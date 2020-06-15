# How to install and develop Account plugin

This is all about how to develop this next-dapp account plugin, not how to develop a next-dapp based project itself.

Next Dapp itself is based upon [Next.js](https://nextjs.org/) / [React](https://reactjs.org) and hevily powered by [Recoil](https://recoiljs.org/) state management library. Other major dependencies are [Ramda](https://ramdajs.com/) and [Rebass](https://rebassjs.org/). 

The core plugin is located at [@nextdapp/core](https://github.com/warashibe/nd-core).

A working example can be found [here](https://next-dapp.warashibe.market/examples/login).

You will need the [nextdapp command line tool](https://github.com/warashibe/nextdapp) for development. Install it globally with `npm` or `yarn`.

I will use `yarn` throughout this document.

```bash
sudo npm i -g nextdapp
```
or

```bash
yarn global add nextdapp
```

## 1. Clone the repo & Install node modules

A demo directory is nested inside the plugin directory. They are separate projects, so you need to install the required packages for the both projects separately.

```bash
# clone
git clone https://github.com/warashibe/nd-account.git

# move to the plugin dixrectory and install node modules with yarn
cd nd-account && yarn

# move to the demo directory and install node modules with yarn
cd demo && yarn
```
## 2. Copy and Modify conf.sample.js file

`nd/conf.js` is ignored by `.gitignore`, so you need to copy `nd/conf.sample.js` to `nd/conf.js` and modify it according to your needs. For now, keep all the dummy data even if you don't use some login methods. The plugin throws an error, if something is missing. This behavior will be taken care of in the future.

```bash
cp nd/conf.sample.js nd/conf.js
```
### Sample Settings [/nd/conf.js]
```bash
import { mergeAll } from "ramda"

let local = {}

try {
  local = require("nd/conf.local")
} catch (e) {}

const prod = {
  id: "next-dapp",
  html: {
    title: "Next Dapp | The Bridge between Web 2.0 and 3.0",
    description:
      "Next Dapp is a web framework to progressively connect web 2.0 with 3.0.",
    image: "https://picsum.photos/1000/500",
    "theme-color": "#03414D"
  },
  firebase: {
    name: "xxx-xxx",
    id: "xxx-xxx",
    key: "xxxxxxx",
    sender: "123456789",
    region: "us-central1"
  },
  web3: {
    network: "3" // Ropsten Testnet
  },
  alis: {
    client_id: "123456789,
    redirect_uri: "http://localhost:3000/"
  },
  steem: {
    redirect_uri: "http://localhost:3000/",
    app: "ocrybit"
  },
  uport: {
    name_field: "氏名又は名称",
    id_field: "交付番号",
    appName: "暗号資産古物商協会",
    did: "did:ethr:0x62507aa089182659ff595266e3c1de2975a51780",
    verified: "古物商許可証テストネット"
  }
}

module.exports = mergeAll([prod, local])
```
## 4. Setup credentials as env values

Sensitive data such as private keys are not to be mixed with the configurations above, use `.env` for credintials.

```bash
touch .env
```

### replace below with your data [/.env]

UPort requires my private key and not configurable for anyone other than me at the moment.

```bash
# if not used, you don't need alis and uport credentials
ALIS_CLIENT_SECRET=xxxxxxxxx
UPORT_PRIVATE_KEY=xxxxxxxx
WEB3_INFURA=https://ropsten.infura.io/v3/xxxxxxx
UPORT_RPCURL=https://mainnet.infura.io/v3/xxxxxxxx
```
## 5. Setup Firestore and Cloud Functions


### Initialize firebase project (choose Firestore and Functions)

Create a new project if you don't have one to use for the development. Do not overwrite any files during the initialization such as `firebase/firestore.rules`. If you keep pressing `Enter` without changing the default options, you won't overwrite anything.

Alternatively, create one from the web console [https://console.firebase.google.com](https://console.firebase.google.com). Then run below.

You need to set a cloud resource location by setting up `Firestore` via the web console above.

You need to install `firebase-tools` and set it up first. Refer to [this page](https://firebase.google.com/docs/cli).

```bash
npm install -g firebase-tools
```

Once you set it up and log in, proceed.


```bash
cd firebase && firebase init
```

### How to set up login methods

* Google, Twitter, Github, Facebook can be set up via [Firebse console](https://console.firebase.google.com).
* ALIS: Register an OAuth app from [here](https://alis.to/me/settings/applications), and set the redirect URI to `http://localhost:3000/`.
* STEEM: Set up [steemconnect](https://beta.steemconnect.com/) somehow... I forgot how :)
* Metamask, Authereum: You will need the `@nextdapp/web3` plugin to make it work.
* UPort: It only works with my private key at the moment, to be extended.

### update security rules for Firestore

```bash
firebase deploy --only firestore:rules

```

### create env.json and deploy environmental variables and functions

Functions are only compatible with node v.10.x. Use `nvm` to temporarily switch versions.

`nvm` can be installed by `yarn` or `npm`

```bash
yarn global add nvm

```
Create `/firebase/functions/env.json` and modify as shown below. If you are not using the web3 based login methos, just copy and paste below for dummy data.

```bash
cd functions && nvm use 10 && yarn && touch env.json
```

/firebase/functions/env.json

```json

{
  "web3": {
    "infura": "https://ropsten.infura.io/v3/xxxxx"
  },
  "uport": {
    "name_field": "氏名又は名称",
    "id_field": "交付番号",
    "appName": "暗号資産古物商協会",
    "did": "did:ethr:0x62507aa089182659ff595266e3c1de2975a51780",
    "privateKey":
      "xxxxxxx",
    "rpcUrl": "https://mainnet.infura.io/v3/xxxxx",
    "verified": "古物商許可証テストネット"
  }
}

```

Upload env to your remote Cloud Functions environment. This command will do the magic.

```bash
firebase functions:config:set env="$(cat env.json)"
```

Deploy functions.

```bash
cd ..
firebase deploy --only functions

```
## 6. Run the demo locally

```bash
cd ../demo
yarn dev
```

# Adding a New Login Method

## 1. add login mehtod data to const.js

### [/src/const.js](https://github.com/warashibe/nd-account/blob/master/src/const.js)

Example: `url` is optional.

```javascript
{
  key: "alis",
  name: "ALIS",
  bg: "#232538",
  url: v => `https://alis.to/users/${v.username}`
}
```

## 2. add two types of icons to [/static/images](https://github.com/warashibe/nd-account/tree/master/static/images) directory

Name them `github-white.png`(Login Button) and `github.png`(Link to User Account).

## 3. add a function to `const login_with` in [/src/account.js](https://github.com/warashibe/nd-account/blob/master/src/account.js)

### Example

This will redirect the user to [alis.to](https://alis.to/) for an OAuth2.0 authentication flow.

You automatically get `{ set, values, conf }` as the arguments.

```javascript
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
```

## 4. add a callback function to execute after redirecting back from OAuth provider (if needed)

Next-Dapp utilizes [Recoil](https://recoiljs.org/) - the Facebook official state management library.

If you change global states, you need to list them in the first argument like done below -`["processing$util"]`.

`set` can change globally reactive states in this way.

If you need your own global states, define them in [/src/init.js](https://github.com/warashibe/nd-account/blob/master/src/init.js), and add them to [/nextdapp.json](https://github.com/warashibe/nd-account/blob/master/nextdapp.json). If you define `your_state`, it will namespaced and become `your_state$account` throughout the app.

### Example

```javascript
export const check_alis = [
  ["processing$util"],
  async ({ val: { router }, state$, set }) => {
    const code = router.query.code
    if (isNil(code)) return
    set(true, "processing$util")
    const cookies = parseCookies()
    const alis_verifier = cookies.alis_verifier
    let user = await checkUser(state$)
    let login_url = `/api/alis-oauth_account?code=${code}&verifier=${
      cookies.alis_verifier
    }`
    await _login_with({ login_url, set, state$, provider: "alis" })
    router.replace(router.pathname, router.pathname, { shallow: true })
  }
]
```

## 5. set a user data converter via `const name_map` and `link_converter`

### Example

Pick necessary fields to form a user data from `add`. 

`name`, `image` and `description` are preffered to be assigned.

```javascript
const name_map = {
  "alis.to": "alis",

```

```javascript
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
```

## 6. bind and execute the callback function when the required query parameter exists in the demo.

Plugin functions will be automatically namespaced. `check_alis` becomes `fn.check_alis$account`.

Example: [/demo/page/index.js](https://github.com/warashibe/nd-account/blob/master/demo/pages/index.js)

```javascript
  useEffect(
    () => {
      if (hasPath(["router", "query", "code"])(props)) {
        isFirebase(props.conf).then(() => {
          fn.check_alis$account({ router: props.router })
        })
      }
    },
    [props.router.query]
  )
```

Don't forget to bind the function to the Component.

```javascript
  [
    "user$account",
    "uport$account",
    "processing$util",

    "changeUser$account",
    "check_alis$account", // <= bind to Component
    "linkAccount$account",
    "unlinkAccount$account"
  ]
```

## 7. write the logic to generate custom_token using [Next.js api](https://github.com/warashibe/nd-account/tree/master/src/api) or/and [Cloud Functions](https://github.com/warashibe/nd-account/blob/master/firebase/functions/index.js).

For alis, refer to [/src/api/alis-oauth.js](https://github.com/warashibe/nd-account/blob/master/src/api/alis-oauth.js) and `exports login` in [/firebase/functions/index.js](https://github.com/warashibe/nd-account/blob/master/firebase/functions/index.js).

If you need any credentials to set for Cloud Functions, refer back to [create env.json and deploy environmental variables and functions](#create-envjson-and-deploy-environmental-variables-and-functions)

Public configurations for Next.js app can be set as described in [2. Copy and Modify conf.sample.js file](#2-copy-and-modify-confsamplejs-file)

Credentials for Next.js app can be set as described in [4. Setup credentials as env values](#4-setup-credentials-as-env-values)

## 8. if you have added public apis, cloud functions or env variables, specify them in `/nextdapp.js`

```javascript
{
  "epics": [ "changeUser", "logout", "logout_authereum", "login", "check_alis", "deleteAccount", "linkAccount", "unlinkAccount" ],
  "props": [ "user", "user_init", "uport", "_user" ],
  "api": { "apiAlisOauth": "alis-oauth", "apiSteemOauth": "steem-oauth", "apiUportLogin": "uport-login" },
  "functions": { "nd-account-functions": [ "loginUport", "loginMetamask", "loginAuthereum", "login" ] },
  "env": [ "ALIS_CLIENT_SECRET", "UPORT_PRIVATE_KEY", "WEB3_INFURA", "UPORT_RPCURL" ],
  "components": ["Login", "UPort", "Profile", "LinkAccount"]
}
```

## 9. build pulugin, update package and deploy functions

### build plugin

```bash
yarn build
```

### move to demo directory and update `@nextdapp/account` package

Use `.. noinstall` for local rebuild and update. It will link to the updated local file without installing the node package.

You don't need them when updating directly from `node package registry`.

```bash
cd demo
nextdapp remove @nextdapp/account .. noinstall
nextdapp add @nextdapp/account .. noinstall

```
