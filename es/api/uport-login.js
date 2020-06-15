"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ramda = require("ramda");

var _didResolver = require("did-resolver");

var _ethrDidResolver = require("ethr-did-resolver");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var xNil = (0, _ramda.complement)(_ramda.isNil);

var _require = require("uport-credentials"),
    Credentials = _require.Credentials;

var message = require("uport-transports").message.util;

var transports = require("uport-transports").transport;

var decodeJWT = require("did-jwt").decodeJWT;

var _require2 = require("url"),
    parse = _require2.parse;

require("isomorphic-fetch");

var _default = function _default(_ref) {
  var conf = _ref.conf;
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var providerConfig, rs, credentials, _parse, query, callbackUrl, obj, requestToken, uri, qr;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Content-Type", "application/json");
              providerConfig = {
                rpcUrl: process.env.UPORT_RPCURL
              };
              rs = (0, _ethrDidResolver.getResolver)(providerConfig);
              credentials = new Credentials({
                appName: conf.uport.appName,
                did: conf.uport.did,
                privateKey: process.env.UPORT_PRIVATE_KEY,
                resolver: new _didResolver.Resolver(_objectSpread({}, rs))
              });
              _parse = parse(req.url, true), query = _parse.query;
              callbackUrl = "https://us-central1-".concat(conf.firebase.id, ".cloudfunctions.net/loginUport_account?id=").concat(query.id);

              if (xNil(query.uid)) {
                callbackUrl += "&uid=".concat(query.uid);
              }

              obj = {
                notifications: true,
                verified: [conf.uport.verified],
                callbackUrl: callbackUrl
              };
              console.log(obj);
              _context.next = 12;
              return credentials.createDisclosureRequest(obj);

            case 12:
              requestToken = _context.sent;
              uri = message.paramsToQueryString(message.messageToURI(requestToken), {
                callback_type: "post"
              });
              qr = transports.ui.getImageDataURI(uri);
              res.end(JSON.stringify({
                qr: qr,
                uri: uri
              }));

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports["default"] = _default;