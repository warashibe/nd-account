"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ramda = require("ramda");

var xNil = (0, _ramda.complement)(_ramda.isNil);

var _require = require("url"),
    parse = _require.parse;

var steemconnect = require("steemconnect");

require("isomorphic-fetch");

var _default = function _default(_ref) {
  var conf = _ref.conf;
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
      var _parse, query, client, me, r2, func_url, href, token;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Content-Type", "application/json");
              _parse = parse(req.url, true), query = _parse.query;
              client = new steemconnect.Client({
                app: "ocrybit",
                callbackURL: conf.steem.redirect_uri,
                scope: ["login"],
                accessToken: query.code
              });
              _context.prev = 4;
              _context.next = 7;
              return new Promise(function (r, e) {
                client.me(function (err, res) {
                  if (err != null) {
                    e(r);
                  } else {
                    r(res);
                  }
                });
              });

            case 7:
              me = _context.sent;

              if (!(me.account != undefined)) {
                _context.next = 21;
                break;
              }

              r2 = {};

              try {
                r2 = JSON.parse(me.account.json_metadata).profile;
              } catch (e) {
                r2 = {};
              }

              r2.id = me.user;
              func_url = "https://".concat(conf.firebase.region, "-").concat(conf.firebase.id, ".cloudfunctions.net/login_account");
              href = "";

              if (xNil(query.uid)) {
                href = "".concat(func_url, "?target=steem&uid=").concat((0, _ramda.is)(Array)(query.uid) ? query.uid[0] : query.uid, "&user_id=").concat(r2.id, "&token=").concat(query.code, "&refresh=&name=").concat(encodeURIComponent(r2.name || r2.id), "&img=").concat(encodeURIComponent(r2.profile_image));
              } else {
                href = "".concat(func_url, "?target=steem&user_id=").concat(r2.id, "&token=").concat(query.code, "&refresh=\"\"&name=").concat(encodeURIComponent(r2.name || r2.id), "&img=").concat(encodeURIComponent(r2.profile_image));
              }

              _context.next = 17;
              return fetch(href).then(function (r) {
                return r.json();
              });

            case 17:
              token = _context.sent;
              res.end(JSON.stringify({
                cred: query.code,
                user: r2,
                token: token
              }));
              _context.next = 22;
              break;

            case 21:
              res.end(JSON.stringify({
                e: "no account"
              }));

            case 22:
              _context.next = 28;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context["catch"](4);
              console.log(_context.t0);
              res.end(JSON.stringify(_context.t0));

            case 28:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 24]]);
    }));

    return function (_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports["default"] = _default;