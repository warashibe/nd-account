const account = require("./account")
const R = require("ramdam")
const Login = { Login: require("./components/Login") }
const UPort = { UPort: require("./components/UPort") }
import apiAlisOauth from "./api/alis-oauth"
import apiSteemOauth from "./api/steem-oauth"
import apiUportLogin from "./api/uport-login"

module.exports = R.mergeAll([
  account,
  Login,
  UPort,
  { apiAlisOauth, apiSteemOauth, apiUportLogin }
])
