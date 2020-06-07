const R = require("ramdam")
const { parse } = require("url")
require("isomorphic-fetch")
const toParams = params =>
  Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    })
    .join("&")

export default ({ conf }) => async (req, res) => {
  const { client_id } = conf.alis
  const base64 = new Buffer(
    client_id + ":" + process.env.ALIS_CLIENT_SECRET
  ).toString("base64")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Content-Type", "application/json")
  const { query } = parse(req.url, true)
  try {
    let r = await fetch("https://alis.to/oauth2/token", {
      headers: {
        Authorization: "Basic " + base64,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: toParams({
        grant_type: "authorization_code",
        code: query.code,
        redirect_uri: conf.alis.redirect_uri,
        code_verifier: query.verifier
      })
    }).then(r => r.json())
    console.log(r)
    if (R.xNil(r.error_message)) {
      res.end(JSON.stringify(r))
    } else {
      try {
        let op = {
          headers: {
            Authorization: r.access_token,
            "Content-Type": "application/json; charset=utf-8"
          }
        }
        let func_url = `https://${conf.firebase.region}-${
          conf.firebase.id
        }.cloudfunctions.net/login_account`
        console.log(func_url)
        let r2 = JSON.parse(
          unescape(
            await fetch("https://alis.to/oauth2api/me/info", op).then(r =>
              r.text()
            )
          )
        )
        console.log(r2)
        let href = ""
        if (query.uid != undefined) {
          href = `${func_url}?uid=${query.uid}&user_id=${r2.user_id}&token=${
            r.access_token
          }&refresh=${r.refresh_token}&name=${encodeURIComponent(
            r2.user_display_name
          )}&img=${encodeURIComponent(r2.icon_image_url)}`
        } else {
          href = `${func_url}?user_id=${r2.user_id}&token=${
            r.access_token
          }&refresh=${r.refresh_token}&name=${encodeURIComponent(
            r2.user_display_name
          )}&img=${encodeURIComponent(r2.icon_image_url)}`
        }
        console.log(href)
        let token = await fetch(href).then(r => r.json())
        console.log(token)
        res.end(JSON.stringify({ cred: r, user: r2, token: token }))
      } catch (e) {
        console.log(e)
        res.end(JSON.stringify(e))
      }
    }
  } catch (e) {
    console.log(e)
    res.end(JSON.stringify(e))
  }
}
