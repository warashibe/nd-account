"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _alisOauth = _interopRequireDefault(require("./api/alis-oauth"));

var _steemOauth = _interopRequireDefault(require("./api/steem-oauth"));

var _uportLogin = _interopRequireDefault(require("./api/uport-login"));

var account = require("./account");

var R = require("ramdam");

var Login = {
  Login: require("./components/Login")
};
var UPort = {
  UPort: require("./components/UPort")
};
module.exports = R.mergeAll([account, Login, UPort, {
  apiAlisOauth: _alisOauth["default"],
  apiSteemOauth: _steemOauth["default"],
  apiUportLogin: _uportLogin["default"]
}]);