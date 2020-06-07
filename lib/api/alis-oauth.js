"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var R = require("ramdam");

var _require = require("url"),
    parse = _require.parse;

require("isomorphic-fetch");

var toParams = function toParams(params) {
  return Object.keys(params).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
  }).join("&");
};

var _default = function _default(_ref) {
  var conf = _ref.conf;
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var client_id, base64, _parse, query, r, op, func_url, r2, href, token;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              client_id = conf.alis.client_id;
              base64 = new Buffer(client_id + ":" + process.env.ALIS_CLIENT_SECRET).toString("base64");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Content-Type", "application/json");
              _parse = parse(req.url, true), query = _parse.query;
              _context.prev = 5;
              _context.next = 8;
              return fetch("https://alis.to/oauth2/token", {
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
              }).then(function (r) {
                return r.json();
              });

            case 8:
              r = _context.sent;
              console.log(r);

              if (!R.xNil(r.error_message)) {
                _context.next = 14;
                break;
              }

              res.end(JSON.stringify(r));
              _context.next = 40;
              break;

            case 14:
              _context.prev = 14;
              op = {
                headers: {
                  Authorization: r.access_token,
                  "Content-Type": "application/json; charset=utf-8"
                }
              };
              func_url = "https://".concat(conf.firebase.region, "-").concat(conf.firebase.id, ".cloudfunctions.net/login_account");
              console.log(func_url);
              _context.t0 = JSON;
              _context.t1 = unescape;
              _context.next = 22;
              return fetch("https://alis.to/oauth2api/me/info", op).then(function (r) {
                return r.text();
              });

            case 22:
              _context.t2 = _context.sent;
              _context.t3 = (0, _context.t1)(_context.t2);
              r2 = _context.t0.parse.call(_context.t0, _context.t3);
              console.log(r2);
              href = "";

              if (query.uid != undefined) {
                href = "".concat(func_url, "?uid=").concat(query.uid, "&user_id=").concat(r2.user_id, "&token=").concat(r.access_token, "&refresh=").concat(r.refresh_token, "&name=").concat(encodeURIComponent(r2.user_display_name), "&img=").concat(encodeURIComponent(r2.icon_image_url));
              } else {
                href = "".concat(func_url, "?user_id=").concat(r2.user_id, "&token=").concat(r.access_token, "&refresh=").concat(r.refresh_token, "&name=").concat(encodeURIComponent(r2.user_display_name), "&img=").concat(encodeURIComponent(r2.icon_image_url));
              }

              console.log(href);
              _context.next = 31;
              return fetch(href).then(function (r) {
                return r.json();
              });

            case 31:
              token = _context.sent;
              console.log(token);
              res.end(JSON.stringify({
                cred: r,
                user: r2,
                token: token
              }));
              _context.next = 40;
              break;

            case 36:
              _context.prev = 36;
              _context.t4 = _context["catch"](14);
              console.log(_context.t4);
              res.end(JSON.stringify(_context.t4));

            case 40:
              _context.next = 46;
              break;

            case 42:
              _context.prev = 42;
              _context.t5 = _context["catch"](5);
              console.log(_context.t5);
              res.end(JSON.stringify(_context.t5));

            case 46:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[5, 42], [14, 36]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports["default"] = _default;