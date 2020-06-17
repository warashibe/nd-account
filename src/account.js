import {
  includes,
  is,
  propOr,
  compose,
  apply,
  append,
  isNil,
  hasPath,
  pickBy,
  identity,
  complement,
  mergeLeft,
  invertObj,
  curryN
} from "ramda"
const xNil = complement(isNil)
const err = (fn, ctx) => async (...args) => {
  let ret = null
  let err = null
  try {
    ret = await fn.apply(ctx || this, args)
  } catch (e) {
    err = e
  }
  return [err, ret]
}

const promisifyProp = curryN(2, (prop, ctx) => (...args) =>
  new Promise((res, rej) =>
    prop(prop)(ctx).apply(
      ctx,
      append((err, result) => (isNil(err) ? res(result) : rej(err)), args)
    )
  )
)

const promisifyPath = curryN(2, (path, ctx) => (...args) =>
  new Promise((res, rej) =>
    path(path)(ctx).apply(
      ctx,
      append((err, result) => (isNil(err) ? res(result) : rej(err)), args)
    )
  )
)

const promisify = fn => (...args) =>
  new Promise((res, rej) =>
    compose(
      apply(fn),
      append((err, result) => (isNil(err) ? res(result) : rej(err)))
    )(args)
  )

const p = (fn, pth) =>
  err(
    isNil(pth)
      ? promisify(fn)
      : is(Array)(pth)
        ? promisifyPath(pth, fn)
        : promisifyProp(pth, fn),
    fn
  )

import shortid from "shortid"
import { errlog } from "@nextdapp/util"
import { fb } from "@nextdapp/firebase"
let logging = false
import Identicon from "identicon.js"
import { setCookie, parseCookies, destroyCookie } from "nookies"
let conf, steem_client
const base64url = require("base64url")
const sha256 = require("js-sha256")
const steemconnect = require("steemconnect")
import { Connect } from "uport-connect"

const name_map = {
  "alis.to": "alis",
  uport: "uport",
  metamask: "metamask",
  authereum: "authereum",
  "steemit.com": "steem",
  "twitter.com": "twitter",
  "facebook.com": "facebook",
  "google.com": "google",
  "github.com": "github"
}

const reverse_name_map = invertObj(name_map)

const link_converter = {
  "alis.to": (_u, add) =>
    mergeLeft(
      {
        name: add.user_display_name,
        image: add.icon_image_url,
        description: add.self_introduction,
        username: add.user_id
      },
      _u
    ),

  "twitter.com": (_u, add) =>
    mergeLeft(
      {
        username: add.username,
        id_str: add.profile.id_str,
        description: add.profile.description,
        image: add.profile.profile_image_url_https.replace(/_normal/, ""),
        cover: add.profile.profile_banner_url
      },
      _u
    ),

  "facebook.com": (_u, add) =>
    mergeLeft(
      {
        name: add.profile.name,
        image: hasPath(["profile", "picture", "data", "url"])(add)
          ? add.profile.picture.data.url
          : undefined
      },
      _u
    ),

  "google.com": (_u, add) =>
    mergeLeft({ name: add.profile.name, image: add.profile.picture }, _u),
  authereum: (_u, add) =>
    mergeLeft(
      {
        address: add.address,
        image: add.image,
        name: add.name
      },
      _u
    ),
  metamask: (_u, add) =>
    mergeLeft(
      {
        address: add.address,
        image: add.image,
        name: add.name
      },
      _u
    ),
  uport: (_u, add) =>
    mergeLeft(
      {
        id: add.id,
        image: add.image,
        name: add.name
      },
      _u
    ),

  "steemit.com": (_u, add) =>
    mergeLeft(
      {
        name: add.name,
        image: add.profile_image,
        description: add.about,
        username: add.id,
        cover: add.cover_image
      },
      _u
    ),

  "github.com": (_u, add) =>
    mergeLeft(
      {
        username: add.username,
        name: add.profile.name,
        description: add.profile.bio
      },
      _u
    )
}

const userUpdate = async ({ u, set }) => {
  const user = isNil(u) ? null : await fb().fsdb.get("users", u.uid)
  logging = false
  set({ user$account: user, user_init$account: true })
}

const _userUpdate_props = ["user$account", "user_init$account"]

export const changeUser = async ({ val, set, conf }) => {
  steem_client = new steemconnect.Client({
    app: conf.steem.app,
    callbackURL: conf.steem.redirect_uri,
    scope: ["login"]
  })
  fb()
    .firebase.auth()
    .onAuthStateChanged(async u => {
      if (!logging) await userUpdate({ u, set })
    })
}
changeUser.props = _userUpdate_props

export const logout = async ({ val }) => {
  const auth = await fb().firebase.auth()
  const [error] = await err(auth.signOut, auth)()
  errlog(error, error, "ログアウトに失敗しました。もう一度お試し下さい。")
}

export const logout_authereum = async ({ val }) => {
  const [error] = await err(fb().firebase.auth(), "signOut")()
  errlog(error, error, "ログアウトに失敗しました。もう一度お試し下さい。")
}

const _login = async ({ user, provider, set, _add = {} }) => {
  logging = true
  if (hasPath(["user", "uid"])(user)) {
    await fb().fsdb.tx("users", user.user.uid, async ({ data, t, ref }) => {
      let _u = data || { uid: user.user.uid, status: "active" }
      _u.links = propOr({}, "links")(_u)
      const add = mergeLeft(user.additionalUserInfo, _add)
      for (let v of user.user.providerData) {
        if (xNil(link_converter[v.providerId])) {
          _u.links[name_map[v.providerId]] = {
            id: v.uid,
            name: v.displayName,
            image: v.photoURL
          }
          if (provider === v.providerId && xNil(add)) {
            _u.links[name_map[v.providerId]] = link_converter[v.providerId](
              _u.links[name_map[v.providerId]],
              add
            )
          }
          _u.links[name_map[v.providerId]] = pickBy(identity)(
            _u.links[name_map[v.providerId]]
          )
          if (provider === v.providerId && xNil(add)) {
            for (let k of ["name", "image", "cover", "description"]) {
              if (
                (isNil(_u[k]) || hasPath(["profile_update", k])) &&
                xNil(_u.links[name_map[v.providerId]][k])
              ) {
                _u[k] = _u.links[name_map[v.providerId]][k]
              }
            }
          }
        }
      }
      _u = pickBy(identity)(_u)
      await fb().fsdb.upsert(_u, "users", _u.uid)
    })
    await userUpdate({ u: user.user, set })
  }
}

const getProvider = provider => {
  return new (fb()).firebase.auth[
    `${provider[0].toUpperCase()}${provider.slice(1)}AuthProvider`
  ]()
}

const login_with = {
  steem: async ({ set, props, link = false, conf }) => {
    const [error, code] = await p(steem_client, "login")({})
    if (errlog(error, error, "Something went wrong!")) {
      return
    }
    let login_url = `/api/steem-oauth_account?code=${code}`
    if (link) login_url += `&uid=${props.user$account.uid}`
    await _login_with({
      login_url: login_url,
      set,
      props,
      provider: "steem"
    })
  },
  alis: async ({ conf }) => {
    const code_verifier = get_code_verifier()
    const code_challenge = get_code_challenge(code_verifier)
    const purl = `https://alis.to/oauth-authenticate?client_id=${
      conf.alis.client_id
    }&redirect_uri=${encodeURIComponent(
      conf.alis.redirect_uri
    )}&scope=write&code_challenge=${code_challenge}`
    setCookie(null, "alis_verifier", code_verifier, { path: "/" })
    window.location.href = purl
  },
  authereum: async ({ conf, set, props }) => {
    if (xNil(window)) {
      set(true, "processing$util")
      const provider = props.authereum$web3.getProvider()
      await provider.enable()
      const address = await props.authereum$web3.getAccountAddress()
      if (xNil(address)) {
        const id = shortid.generate()
        await fb().fsdb.set({ address: address }, "login", id)
        const signature = await props.web3_authereum$web3.eth.sign(id, address)
        const login_url = `https://${conf.firebase.region}-${
          conf.firebase.id
        }.cloudfunctions.net/loginAuthereum_account?data=${id}&signature=${signature}`
        const res = await fetch(login_url).then(response => response.json())
        const auth = await fb().firebase.auth()
        const [error, user] = await err(auth.signInWithCustomToken, auth)(
          res.token
        )
        if (xNil(error)) {
          alert("something went wrong")
          set(false, "processing$util")
          return
        }
        const add = {
          address: res.address,
          providerId: "authereum",
          uid: user.user.uid,
          image: `data:image/png;base64,${new Identicon(
            res.address,
            60
          ).toString()}`
        }
        user.user.providerData.push(add)
        _login({ user, provider: "authereum", set, _add: add })
        set(false, "processing$util")
        if (window != undefined) {
          const Box = require("3box")
          const box = await Box.openBox(res.address, provider)
          let profile = await Box.getProfile(res.address)
          if (xNil(profile))
            _login({ user, provider: "authereum", set, _add: profile })
        }
      }
      set(false, "processing$util")
    }
  },
  metamask: async ({ conf, set, props }) => {
    if (xNil(window)) {
      set(true, "processing$util")
      const address = await props.eth_selected$web3
      if (xNil(address)) {
        const id = shortid.generate()
        await fb().fsdb.set({ address: address }, "login", id)
        const [error, signature] = await err(web3.eth.personal.sign, web3)(
          id,
          address
        )
        if (xNil(error)) {
          alert("something went wrong")
          set(false, "processing$util")
          return
        }
        const login_url = `https://${conf.firebase.region}-${
          conf.firebase.id
        }.cloudfunctions.net/loginMetamask_account?data=${id}&signature=${signature}`
        const res = await fetch(login_url).then(response => response.json())
        const auth = await fb().firebase.auth()
        const [err2, user] = await err(auth.signInWithCustomToken, auth)(
          res.token
        )
        if (xNil(err2)) {
          alert("something went wrong")
          set(false, "processing$util")
          return
        }
        const add = {
          address: res.address,
          providerId: "metamask",
          uid: user.user.uid,
          image: `data:image/png;base64,${new Identicon(
            res.address,
            60
          ).toString()}`
        }
        user.user.providerData.push(add)
        _login({ user, provider: "metamask", set, _add: add })
        set(false, "processing$util")
        if (window != undefined) {
          const Box = require("3box")
          const box = await Box.openBox(
            res.address,
            window.web3.currentProvider
          )
          let profile = await Box.getProfile(res.address)
          if (xNil(profile))
            _login({ user, provider: "metamask", set, _add: profile })
        }
      }
    }
  },
  uport: async ({ conf, set, props, link = false }) => {
    const id = shortid.generate()
    const unsub = await fb().fsdb.on("login_read", id, async res => {
      if (xNil(res)) {
        unsub()
        await fb().fsdb.delete("login_read", id)
        if (xNil(res.token)) {
          const auth = await fb().firebase.auth()
          const [error, user] = await err(auth.signInWithCustomToken, auth)(
            res.token
          )
          if (xNil(error)) {
            alert("something went wrong")
            set(false, "processing$util")
            return
          }

          const uid = user.user.uid
          const cert = await fb().fsdb.get("uport", ["uid", "==", uid])
          let add = {
            providerId: "uport",
            uid: uid
          }
          if (xNil(cert[0])) {
            add = mergeLeft(add, {
              id: cert[0].id,
              name: cert[0].verified[conf.uport.name_field],
              image: `data:image/png;base64,${new Identicon(
                cert[0].did.split(":")[2],
                60
              ).toString()}`
            })
            user.user.providerData.push(add)
            _login({ user, provider: "uport", set, _add: add })
          }
        }
        set(null, "uport$account")
      }
    })
    let login_url = `/api/uport-login_account?id=${id}`
    if (link) login_url += `&uid=${props.user$account.uid}`
    const json = await fetch(login_url).then(r => r.json())
    set(json, "uport$account")
  }
}

export const login = async ({ val: { provider }, set, props, conf }) => {
  if (xNil(login_with[provider])) {
    await login_with[provider]({ set, props, conf })
  }
  set(true, "processing$util")
  const _provider = getProvider(provider)
  const auth = await fb().firebase.auth()
  const [error, user] = await err(auth.signInWithPopup, auth)(_provider)
  if (xNil(error)) {
    alert("something went wrong")
  } else {
    await _login({ user, provider: reverse_name_map[provider], set })
  }
  set(false, "processing$util")
}
login.props = ["processing$util", "uport$account"]

function get_code_challenge(str) {
  const hash = sha256.arrayBuffer(str)
  return base64url(hash)
}

function get_code_verifier() {
  const buf = Buffer.alloc(32)
  for (let i = 0; i < buf.length; i++) {
    const random_num = Math.floor(Math.random() * 256)
    buf.writeUInt8(random_num, i)
  }
  return base64url(buf)
}

const checkUser = async props => {
  return await new Promise(res => {
    setInterval(async () => {
      if (props.user_init$account === false) {
        res(await checkUser(props))
      } else {
        res(props.user$account)
      }
    }, 500)
  })
}

export const check_alis = async ({ val: { router }, props, set }) => {
  const code = router.query.code
  if (isNil(code)) return
  set(true, "processing$util")
  const cookies = parseCookies()
  const alis_verifier = cookies.alis_verifier
  let user = await checkUser(props)
  let login_url = `/api/alis-oauth_account?code=${code}&verifier=${
    cookies.alis_verifier
  }`
  await _login_with({ login_url, set, props, provider: "alis" })
  router.replace(router.pathname, router.pathname, { shallow: true })
}
check_alis.props = ["processing$util"]

const _login_with = async ({ set, props, login_url, provider }) => {
  if (hasPath(["value", "user", "uid"])(props)) {
    login_url += `&uid=${props.user$account.uid}`
  }
  const res = await fetch(login_url).then(response => response.json())
  if (xNil(res.user)) {
    const auth = await fb().firebase.auth()
    if (hasPath(["token", "err"])(res) && xNil(res.token.err)) {
      alert(res.token.err)
      set(false, "processing$util")
      return
    }
    const [error, user] = await err(auth.signInWithCustomToken, auth)(
      res.token.token
    )
    if (xNil(err)) {
      alert("something went wrong")
      set(false, "processing$util")
      return
    }
    user.user.providerData.push({
      providerId: reverse_name_map[provider],
      uid: user.uid
    })
    _login({ user, provider: reverse_name_map[provider], set, _add: res.user })
    set(false, "processing$util")
  }
}

export const deleteAccount = async ({ val: { user }, set }) => {
  set(true, "processing$util")
  await fb().fsdb.tx("users", user.uid, async ({ t, ref, data }) => {
    for (let l in data.links || {}) {
      const fsdb = fb().fsdb
      let err = null
      if (includes(l)(["metamask", "authereum"])) {
        const [error] = await err(fsdb.delete)(`wallet`, data.links[l].address)
        if (xNil(error)) console.log(err)
      } else if (includes(l)(["uport"])) {
        await fsdb.delete(`uport`, data.links[l].id)
      } else if (includes(l)(["steem", "alis"])) {
        await fsdb.delete(`usermap_${l}`, data.links[l].username)
      }
    }
    return await t.update(ref, { status: "deleted" })
  })
  let _user = fb().firebase.auth().currentUser
  await _user.delete()
  set(false, "processing$util")
}
deleteAccount.props = ["processing$util"]

export const linkAccount = async ({
  val: { provider, user },
  set,
  props,
  conf
}) => {
  set(true, "processing$util")
  if (
    xNil(login_with[provider]) &&
    !includes(provider)(["metamask", "authereum"])()
  ) {
    await login_with[provider]({ set, props, link: true, conf })
  } else {
    const _provider = getProvider(provider)
    const currentUser = await fb().firebase.auth().currentUser
    const [error, result] = await err(currentUser.linkWithPopup, currentUser)(
      _provider
    )
    if (xNil(error)) {
      alert(xNil(err.code) ? err.code : "something went wrong")
    } else {
      await _login({
        user: result,
        provider: reverse_name_map[provider],
        set
      })
      await userUpdate({ u: result.user, set })
    }
    set(false, "processing$util")
  }
  return
}
linkAccount.props = ["processing$util"]

export const unlinkAccount = async ({ val: { provider, user }, set }) => {
  set(true, "processing$util")
  if (includes(provider)(["metamask", "authereum"])) {
    await fb().fsdb.delete(`wallet`, user.links[provider].address)
  } else if (includes(provider)(["uport"])) {
    await fb().fsdb.delete(`uport`, user.links[provider].id)
  } else if (includes(provider)(["steem", "alis"])) {
    await fb().fsdb.delete(`usermap_${provider}`, user.links[provider].username)
  } else {
    const _provider = getProvider(provider)
    const result = await fb()
      .firebase.auth()
      .currentUser.unlink(reverse_name_map[provider])
  }
  await fb().fsdb.tx("users", user.uid, async ({ t, data, ref }) => {
    let links = data.links
    delete links[provider]
    await t.update(ref, { links: links })
  })
  await userUpdate({ u: user, set })
  set(false, "processing$util")
}

unlinkAccount.props = ["processing$util"]
