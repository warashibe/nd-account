const account = require("./account")
import { default as init } from "./init"
import { mergeAll } from "ramda"
const Login = { Login: require("./components/Login") }
const UPort = { UPort: require("./components/UPort") }
const Profile = { Profile: require("./components/Profile") }
const LinkAccount = { LinkAccount: require("./components/LinkAccount") }
import apiAlisOauth from "./api/alis-oauth"
import apiSteemOauth from "./api/steem-oauth"
import apiUportLogin from "./api/uport-login"
import { socials } from "./const"
module.exports = mergeAll([
  { socials: socials },
  init,
  account,
  Profile,
  LinkAccount,
  Login,
  UPort,
  { apiAlisOauth, apiSteemOauth, apiUportLogin }
])
