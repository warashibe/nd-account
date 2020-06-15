# How to install and develop Account plugin
You will need the [nextdapp command line tool](https://github.com/warashibe/nextdapp) for development. Install it globally with `npm`.

```bash
sudo npm i -g nextdapp
```

## 1. Clone the repo & Install node modules

```bash
# clone
git clone https://github.com/warashibe/nd-account.git

# move to the plugin dixrectory and install node modules with yarn
cd nd-account && yarn

# move to the demo directory and install node modules with yarn
cd demo && yarn
```
## 2. Copy and Modify conf.sample.js file
```bash
cp nd/conf.sample.js nd/conf.js
```
### Sample Settings [/nd/conf.js]
```bash
import R from "ramdam"
let local = {}

try {
  local = require("nd/conf.local")
} catch (e) {}

const prod = {
  id: "next-dapp-account-demo",
  html: {
    title: "Account Plugin | Next Dapp",
    description:
      "Next Dapp is a web framework to progressively connect web 2.0 with 3.0.",
    image: "https://next-dapp.warashibe.market/static/cover.png",
    "theme-color": "#03414D"
  },
  firebase: {
    name: "xxx-xxx,
    id: "xxx-xxx,
    key: "xxxxxxx",
    sender: "123456789,
    region: "us-central1"
  },
  web3: {
    network: "3" // Ropsten Testnet
  },
  alis: {
    client_id: "17716139431674",
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
module.exports = R.mergeAll([prod, local])
```
## 4. Setup credentials as env values

```bash
touch .env
```

### replace below with your data [/.env]

```bash
# if not used, you don't need alis and uport credentials
ALIS_CLIENT_SECRET=xxxxxxxxx
UPORT_PRIVATE_KEY=xxxxxxxx
WEB3_INFURA=https://ropsten.infura.io/v3/xxxxxxx
UPORT_RPCURL=https://mainnet.infura.io/v3/xxxxxxxx
```
## 5. Setup Firestore and Cloud Functions


### Initialize firebase project (choose Firestore and Functions)

Create a new project if you don't have one to use. Do not overwrite any files.

Alternatively, create one from the web console [https://console.firebase.google.com](https://console.firebase.google.com). Then run below.

```bash

cd firebase && firebase init
```

### update security rules for Firestore

```bash
firebase deploy --only firestore:rules

```

### create env.json and deploy environmental variables and functions

Functions are only compatible with node v.10.x. Use `nvm` to temporarily switch versions.

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

Upload env to your remote Cloud Functions environment.

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
cd ..
yarn dev
```

# Adding a New Login Method

## 1. add login mehtod data to const.js

### /src/const.js

Example: `url` is optional.

```javascript
{
  key: "alis",
  name: "ALIS",
  bg: "#232538",
  url: v => `https://alis.to/users/${v.username}`
}
```

## 2. add two types of icons to /static/images directory

Name them `github-white.png`(Login Button) and `github.png`(Link to User Account).

## 3. add a function to `const login_with` in `/src/account.js`

### Example

This will redirect the user to [alis.to](https://alis.to/) for an OAuth2.0 authentication flow.

You automatically get `{ set, state$, conf }` as the arguments.

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

## 4. add a callback function to execute after redirecting back from OAuth provider

### Example

```javascript
export const check_alis = async ({ val: { router }, state$, set }) => {
  const code = router.query.code
  if (R.isNil(code)) return
  set(true, "processing$util")
  const cookies = parseCookies()
  const alis_verifier = cookies.alis_verifier
  let user = await checkUser(state$)
  
  // where you generate a custom token for login
  let login_url = `/api/alis-oauth_account?code=${code}&verifier=${
    cookies.alis_verifier
  }`
  
  // this will take care of the rest, do the same
  await _login_with({ login_url, set, state$, provider: "alis" })
  
  // clear the query parametars
  router.replace(router.pathname, router.pathname, { shallow: true })
}
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
    R.mergeLeft(
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

Plugin functions will be automatically namespaced. `check_alis` becomes `props.check_alis$account`.

Example: /demo/page/index.js

```javascript
  useEffect(
    () => {
      if (R.hasPath(["router", "query", "code"])(props)) {
        isFirebase(props.conf).then(() => {
          props.check_alis$account({ router: props.router })
        })
      }
    },
    [props.router.query]
  )
```

Don't forget to bind the function to the Component.

```javascript
  [
    "changeUser$account",
    "check_alis$account", // <= bind to Component
    "linkAccount$account",
    "unlinkAccount$account"
  ]
```

## 7. write the logic to generate custom_token using Next.js api or/and Cloud Functions.

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
