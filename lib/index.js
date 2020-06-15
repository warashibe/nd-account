"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _init = _interopRequireDefault(require("./init"));

var _ramda = require("ramda");

var _alisOauth = _interopRequireDefault(require("./api/alis-oauth"));

var _steemOauth = _interopRequireDefault(require("./api/steem-oauth"));

var _uportLogin = _interopRequireDefault(require("./api/uport-login"));

var _const = require("./const");

var account = require("./account");

var Login = {
  Login: require("./components/Login")
};
var UPort = {
  UPort: require("./components/UPort")
};
var Profile = {
  Profile: require("./components/Profile")
};
var LinkAccount = {
  LinkAccount: require("./components/LinkAccount")
};
module.exports = (0, _ramda.mergeAll)([{
  socials: _const.socials
}, _init["default"], account, Profile, LinkAccount, Login, UPort, {
  apiAlisOauth: _alisOauth["default"],
  apiSteemOauth: _steemOauth["default"],
  apiUportLogin: _uportLogin["default"]
}]);