const account = require("./account")
const R = require("ramdam")
const Login = { Login: require("./components/Login") }
const UPort = { UPort: require("./components/UPort") }
const Profile = { Profile: require("./components/Profile") }
const LinkAccount = { LinkAccount: require("./components/LinkAccount") }
import apiAlisOauth from "./api/alis-oauth"
import apiSteemOauth from "./api/steem-oauth"
import apiUportLogin from "./api/uport-login"
import { socials } from "./const"
module.exports = R.mergeAll([
  { socials: socials },
  account,
  Profile,
  LinkAccount,
  Login,
  UPort,
  { apiAlisOauth, apiSteemOauth, apiUportLogin }
])
