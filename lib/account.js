"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.unlinkAccount = exports.linkAccount = exports.deleteAccount = exports.check_alis = exports.login = exports.logout_authereum = exports.logout = exports.changeUser = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ramdam = _interopRequireDefault(require("ramdam"));

var _shortid = _interopRequireDefault(require("shortid"));

var _util = require("@nextdapp/util");

var _firebase = require("@nextdapp/firebase");

var _identicon = _interopRequireDefault(require("identicon.js"));

var _nookies = require("nookies");

var _uportConnect = require("uport-connect");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var logging = false;
var conf, steem_client;

var base64url = require("base64url");

var sha256 = require("js-sha256");

var steemconnect = require("steemconnect");

var userUpdate = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var u, set, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            u = _ref.u, set = _ref.set;

            if (!_ramdam["default"].isNil(u)) {
              _context.next = 5;
              break;
            }

            _context.t0 = null;
            _context.next = 8;
            break;

          case 5:
            _context.next = 7;
            return (0, _firebase.fb)().fsdb.get("users", u.uid);

          case 7:
            _context.t0 = _context.sent;

          case 8:
            user = _context.t0;
            logging = false;
            set({
              user$account: user,
              _user$account: u,
              user_init$account: true
            });

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function userUpdate(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var changeUser = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref3) {
    var type, val, dispatch, extra, set, to, conf;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            type = _ref3.type, val = _ref3.val, dispatch = _ref3.dispatch, extra = _ref3.extra, set = _ref3.set, to = _ref3.to, conf = _ref3.conf;
            steem_client = new steemconnect.Client({
              app: conf.steem.app,
              callbackURL: conf.steem.redirect_uri,
              scope: ["login"]
            });
            (0, _firebase.fb)().firebase.auth().onAuthStateChanged( /*#__PURE__*/function () {
              var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(u) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (logging) {
                          _context2.next = 3;
                          break;
                        }

                        _context2.next = 3;
                        return userUpdate({
                          u: u,
                          set: set
                        });

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x3) {
                return _ref5.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function changeUser(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.changeUser = changeUser;

var logout = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref6) {
    var type, val, dispatch, extra, auth, _yield$R$err, _yield$R$err2, err;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            type = _ref6.type, val = _ref6.val, dispatch = _ref6.dispatch, extra = _ref6.extra;
            _context4.next = 3;
            return (0, _firebase.fb)().firebase.auth();

          case 3:
            auth = _context4.sent;
            _context4.next = 6;
            return _ramdam["default"].err(auth.signOut, auth)();

          case 6:
            _yield$R$err = _context4.sent;
            _yield$R$err2 = (0, _slicedToArray2["default"])(_yield$R$err, 1);
            err = _yield$R$err2[0];
            (0, _util.errlog)(err, err, "ログアウトに失敗しました。もう一度お試し下さい。");

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function logout(_x4) {
    return _ref7.apply(this, arguments);
  };
}();

exports.logout = logout;

var logout_authereum = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref8) {
    var type, val, dispatch, extra, _yield$R$err3, _yield$R$err4, err;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            type = _ref8.type, val = _ref8.val, dispatch = _ref8.dispatch, extra = _ref8.extra;
            _context5.next = 3;
            return _ramdam["default"].err((0, _firebase.fb)().firebase.auth(), "signOut")();

          case 3:
            _yield$R$err3 = _context5.sent;
            _yield$R$err4 = (0, _slicedToArray2["default"])(_yield$R$err3, 1);
            err = _yield$R$err4[0];
            (0, _util.errlog)(err, err, "ログアウトに失敗しました。もう一度お試し下さい。");

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function logout_authereum(_x5) {
    return _ref9.apply(this, arguments);
  };
}();

exports.logout_authereum = logout_authereum;
var link_converter = {
  "twitter.com": function twitterCom(_u, add) {
    return _ramdam["default"].mergeLeft({
      username: add.username,
      id_str: add.profile.id_str,
      description: add.profile.description,
      image: add.profile.profile_image_url_https.replace(/_normal/, ""),
      cover: add.profile.profile_banner_url
    }, _u);
  },
  "facebook.com": function facebookCom(_u, add) {
    return _ramdam["default"].mergeLeft({
      name: add.profile.name,
      image: _ramdam["default"].hasPath(["profile", "picture", "data", "url"])(add) ? add.profile.picture.data.url : undefined
    }, _u);
  },
  "google.com": function googleCom(_u, add) {
    return _ramdam["default"].mergeLeft({
      name: add.profile.name,
      image: add.profile.picture
    }, _u);
  },
  "alis.to": function alisTo(_u, add) {
    return _ramdam["default"].mergeLeft({
      name: add.user_display_name,
      image: add.icon_image_url,
      description: add.self_introduction,
      username: add.user_id
    }, _u);
  },
  authereum: function authereum(_u, add) {
    return _ramdam["default"].mergeLeft({
      address: add.address,
      image: add.image,
      name: add.name
    }, _u);
  },
  metamask: function metamask(_u, add) {
    return _ramdam["default"].mergeLeft({
      address: add.address,
      image: add.image,
      name: add.name
    }, _u);
  },
  uport: function uport(_u, add) {
    return _ramdam["default"].mergeLeft({
      id: add.id,
      image: add.image,
      name: add.name
    }, _u);
  },
  "steemit.com": function steemitCom(_u, add) {
    return _ramdam["default"].mergeLeft({
      name: add.name,
      image: add.profile_image,
      description: add.about,
      username: add.id,
      cover: add.cover_image
    }, _u);
  },
  "github.com": function githubCom(_u, add) {
    return _ramdam["default"].mergeLeft({
      username: add.username,
      name: add.profile.name,
      description: add.profile.bio
    }, _u);
  }
};
var name_map = {
  uport: "uport",
  metamask: "metamask",
  authereum: "authereum",
  "alis.to": "alis",
  "steemit.com": "steem",
  "twitter.com": "twitter",
  "facebook.com": "facebook",
  "google.com": "google",
  "github.com": "github"
};

var reverse_name_map = _ramdam["default"].invertObj(name_map);

var _login = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref10) {
    var user, provider, set, _ref10$_add, _add;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            user = _ref10.user, provider = _ref10.provider, set = _ref10.set, _ref10$_add = _ref10._add, _add = _ref10$_add === void 0 ? {} : _ref10$_add;
            logging = true;

            if (!_ramdam["default"].hasPath(["user", "uid"])(user)) {
              _context7.next = 7;
              break;
            }

            _context7.next = 5;
            return (0, _firebase.fb)().fsdb.tx("users", user.user.uid, /*#__PURE__*/function () {
              var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref12) {
                var data, t, ref, _u, add, _iterator, _step, v, _i, _arr, k;

                return _regenerator["default"].wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        data = _ref12.data, t = _ref12.t, ref = _ref12.ref;
                        _u = data || {
                          uid: user.user.uid,
                          status: "active"
                        };
                        _u.links = _ramdam["default"].propOr({}, "links")(_u);
                        add = _ramdam["default"].mergeLeft(user.additionalUserInfo, _add);
                        _iterator = _createForOfIteratorHelper(user.user.providerData);

                        try {
                          for (_iterator.s(); !(_step = _iterator.n()).done;) {
                            v = _step.value;

                            if (_ramdam["default"].xNil(link_converter[v.providerId])) {
                              _u.links[name_map[v.providerId]] = {
                                id: v.uid,
                                name: v.displayName,
                                image: v.photoURL
                              };

                              if (provider === v.providerId && _ramdam["default"].xNil(add)) {
                                _u.links[name_map[v.providerId]] = link_converter[v.providerId](_u.links[name_map[v.providerId]], add);
                              }

                              _u.links[name_map[v.providerId]] = _ramdam["default"].pickBy(_ramdam["default"].identity)(_u.links[name_map[v.providerId]]);

                              if (provider === v.providerId && _ramdam["default"].xNil(add)) {
                                for (_i = 0, _arr = ["name", "image", "cover", "description"]; _i < _arr.length; _i++) {
                                  k = _arr[_i];

                                  if ((_ramdam["default"].isNil(_u[k]) || _ramdam["default"].hasPath(["profile_update", k])) && _ramdam["default"].xNil(_u.links[name_map[v.providerId]][k])) {
                                    _u[k] = _u.links[name_map[v.providerId]][k];
                                  }
                                }
                              }
                            }
                          }
                        } catch (err) {
                          _iterator.e(err);
                        } finally {
                          _iterator.f();
                        }

                        _u = _ramdam["default"].pickBy(_ramdam["default"].identity)(_u);
                        _context6.next = 9;
                        return (0, _firebase.fb)().fsdb.upsert(_u, "users", _u.uid);

                      case 9:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x7) {
                return _ref13.apply(this, arguments);
              };
            }());

          case 5:
            _context7.next = 7;
            return userUpdate({
              u: user.user,
              set: set
            });

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function _login(_x6) {
    return _ref11.apply(this, arguments);
  };
}();

var getProvider = function getProvider(provider) {
  return new ((0, _firebase.fb)().firebase.auth["".concat(provider[0].toUpperCase()).concat(provider.slice(1), "AuthProvider")])();
};

var login = /*#__PURE__*/function () {
  var _ref15 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref14) {
    var type, provider, dispatch, extra, set, state$, conf, _provider, auth, _yield$R$err5, _yield$R$err6, err, user;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            type = _ref14.type, provider = _ref14.val.provider, dispatch = _ref14.dispatch, extra = _ref14.extra, set = _ref14.set, state$ = _ref14.state$, conf = _ref14.conf;

            if (!(provider === "uport")) {
              _context8.next = 7;
              break;
            }

            _context8.next = 4;
            return login_with_uport({
              set: set,
              state$: state$,
              conf: conf
            });

          case 4:
            return _context8.abrupt("return");

          case 7:
            if (!(provider === "metamask")) {
              _context8.next = 13;
              break;
            }

            _context8.next = 10;
            return login_with_metamask({
              set: set,
              state$: state$,
              conf: conf
            });

          case 10:
            return _context8.abrupt("return");

          case 13:
            if (!(provider === "authereum")) {
              _context8.next = 19;
              break;
            }

            _context8.next = 16;
            return login_with_authereum({
              set: set,
              state$: state$,
              conf: conf
            });

          case 16:
            return _context8.abrupt("return");

          case 19:
            if (!(provider === "alis")) {
              _context8.next = 25;
              break;
            }

            _context8.next = 22;
            return login_with_alis({
              set: set,
              state$: state$,
              conf: conf
            });

          case 22:
            return _context8.abrupt("return");

          case 25:
            if (!(provider === "steem")) {
              _context8.next = 29;
              break;
            }

            _context8.next = 28;
            return login_with_steem({
              set: set,
              state$: state$,
              conf: conf
            });

          case 28:
            return _context8.abrupt("return");

          case 29:
            set(true, "processing$util");
            _provider = getProvider(provider);
            _context8.next = 33;
            return (0, _firebase.fb)().firebase.auth();

          case 33:
            auth = _context8.sent;
            _context8.next = 36;
            return _ramdam["default"].err(auth.signInWithPopup, auth)(_provider);

          case 36:
            _yield$R$err5 = _context8.sent;
            _yield$R$err6 = (0, _slicedToArray2["default"])(_yield$R$err5, 2);
            err = _yield$R$err6[0];
            user = _yield$R$err6[1];

            if (!_ramdam["default"].xNil(err)) {
              _context8.next = 44;
              break;
            }

            alert("something went wrong");
            _context8.next = 46;
            break;

          case 44:
            _context8.next = 46;
            return _login({
              user: user,
              provider: reverse_name_map[provider],
              set: set
            });

          case 46:
            set(false, "processing$util");

          case 47:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function login(_x8) {
    return _ref15.apply(this, arguments);
  };
}();

exports.login = login;

function get_code_challenge(str) {
  var hash = sha256.arrayBuffer(str);
  return base64url(hash);
}

function get_code_verifier() {
  var buf = Buffer.alloc(32);

  for (var i = 0; i < buf.length; i++) {
    var random_num = Math.floor(Math.random() * 256);
    buf.writeUInt8(random_num, i);
  }

  return base64url(buf);
}

var checkUser = /*#__PURE__*/function () {
  var _ref16 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(state$) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return new Promise(function (res) {
              setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (!(state$.value.user_init$account === false)) {
                          _context9.next = 8;
                          break;
                        }

                        _context9.t0 = res;
                        _context9.next = 4;
                        return checkUser(state$);

                      case 4:
                        _context9.t1 = _context9.sent;
                        (0, _context9.t0)(_context9.t1);
                        _context9.next = 9;
                        break;

                      case 8:
                        res(state$.value.user$account);

                      case 9:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              })), 500);
            });

          case 2:
            return _context10.abrupt("return", _context10.sent);

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function checkUser(_x9) {
    return _ref16.apply(this, arguments);
  };
}();

var check_alis = /*#__PURE__*/function () {
  var _ref19 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(_ref18) {
    var router, state$, set, code, cookies, alis_verifier, user, login_url;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            router = _ref18.val.router, state$ = _ref18.state$, set = _ref18.set;
            code = router.query.code;

            if (!_ramdam["default"].isNil(code)) {
              _context11.next = 4;
              break;
            }

            return _context11.abrupt("return");

          case 4:
            set(true, "processing$util");
            cookies = (0, _nookies.parseCookies)();
            alis_verifier = cookies.alis_verifier;
            _context11.next = 9;
            return checkUser(state$);

          case 9:
            user = _context11.sent;
            login_url = "/api/alis-oauth_account?code=".concat(code, "&verifier=").concat(cookies.alis_verifier);
            _context11.next = 13;
            return _login_with({
              login_url: login_url,
              set: set,
              state$: state$,
              provider: "alis"
            });

          case 13:
            router.replace(router.pathname, router.pathname, {
              shallow: true
            });

          case 14:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function check_alis(_x10) {
    return _ref19.apply(this, arguments);
  };
}();

exports.check_alis = check_alis;

var login_with_uport = /*#__PURE__*/function () {
  var _ref21 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(_ref20) {
    var conf, set, state$, _ref20$link, link, id, unsub, login_url, json;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            conf = _ref20.conf, set = _ref20.set, state$ = _ref20.state$, _ref20$link = _ref20.link, link = _ref20$link === void 0 ? false : _ref20$link;

            /*
            const uport = new Connect(conf.uport.appname, {
              ethrConfig: {
                rpcUrl: conf.uport.env.UPORT_RPCURL
              }
            })*/
            id = _shortid["default"].generate();
            _context13.next = 4;
            return (0, _firebase.fb)().fsdb.on("login_read", id, /*#__PURE__*/function () {
              var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(res) {
                var auth, _yield$R$err7, _yield$R$err8, _err, user, uid, cert, add;

                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        if (!_ramdam["default"].xNil(res)) {
                          _context12.next = 25;
                          break;
                        }

                        unsub();
                        _context12.next = 4;
                        return (0, _firebase.fb)().fsdb["delete"]("login_read", id);

                      case 4:
                        if (!_ramdam["default"].xNil(res.token)) {
                          _context12.next = 24;
                          break;
                        }

                        _context12.next = 7;
                        return (0, _firebase.fb)().firebase.auth();

                      case 7:
                        auth = _context12.sent;
                        _context12.next = 10;
                        return _ramdam["default"].err(auth.signInWithCustomToken, auth)(res.token);

                      case 10:
                        _yield$R$err7 = _context12.sent;
                        _yield$R$err8 = (0, _slicedToArray2["default"])(_yield$R$err7, 2);
                        _err = _yield$R$err8[0];
                        user = _yield$R$err8[1];

                        if (!_ramdam["default"].xNil(_err)) {
                          _context12.next = 18;
                          break;
                        }

                        alert("something went wrong");
                        set(false, "processing$util");
                        return _context12.abrupt("return");

                      case 18:
                        uid = user.user.uid;
                        _context12.next = 21;
                        return (0, _firebase.fb)().fsdb.get("uport", ["uid", "==", uid]);

                      case 21:
                        cert = _context12.sent;
                        add = {
                          providerId: "uport",
                          uid: uid
                        };

                        if (_ramdam["default"].xNil(cert[0])) {
                          add = _ramdam["default"].mergeLeft(add, {
                            id: cert[0].id,
                            name: cert[0].verified[conf.uport.name_field],
                            image: "data:image/png;base64,".concat(new _identicon["default"](cert[0].did.split(":")[2], 60).toString())
                          });
                          user.user.providerData.push(add);

                          _login({
                            user: user,
                            provider: "uport",
                            set: set,
                            _add: add
                          });
                        }

                      case 24:
                        set(null, "uport$account");

                      case 25:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x12) {
                return _ref22.apply(this, arguments);
              };
            }());

          case 4:
            unsub = _context13.sent;
            login_url = "/api/uport-login_account?id=".concat(id);
            if (link) login_url += "&uid=".concat(state$.value.user$account.uid);
            _context13.next = 9;
            return fetch(login_url).then(function (r) {
              return r.json();
            });

          case 9:
            json = _context13.sent;
            set(json, "uport$account");

          case 11:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function login_with_uport(_x11) {
    return _ref21.apply(this, arguments);
  };
}();

var login_with_authereum = /*#__PURE__*/function () {
  var _ref24 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(_ref23) {
    var conf, set, state$, provider, address, id, signature, login_url, res, auth, _yield$R$err9, _yield$R$err10, _err2, user, add, Box, box, profile;

    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            conf = _ref23.conf, set = _ref23.set, state$ = _ref23.state$;

            if (!_ramdam["default"].xNil(window)) {
              _context14.next = 47;
              break;
            }

            set(true, "processing$util");
            provider = state$.value.authereum$web3.getProvider();
            _context14.next = 6;
            return provider.enable();

          case 6:
            _context14.next = 8;
            return state$.value.authereum$web3.getAccountAddress();

          case 8:
            address = _context14.sent;

            if (!_ramdam["default"].xNil(address)) {
              _context14.next = 46;
              break;
            }

            id = _shortid["default"].generate();
            _context14.next = 13;
            return (0, _firebase.fb)().fsdb.set({
              address: address
            }, "login", id);

          case 13:
            _context14.next = 15;
            return state$.value.web3_authereum$web3.eth.sign(id, address);

          case 15:
            signature = _context14.sent;
            login_url = "https://".concat(conf.firebase.region, "-").concat(conf.firebase.id, ".cloudfunctions.net/loginAuthereum_account?data=").concat(id, "&signature=").concat(signature);
            _context14.next = 19;
            return fetch(login_url).then(function (response) {
              return response.json();
            });

          case 19:
            res = _context14.sent;
            _context14.next = 22;
            return (0, _firebase.fb)().firebase.auth();

          case 22:
            auth = _context14.sent;
            _context14.next = 25;
            return _ramdam["default"].err(auth.signInWithCustomToken, auth)(res.token);

          case 25:
            _yield$R$err9 = _context14.sent;
            _yield$R$err10 = (0, _slicedToArray2["default"])(_yield$R$err9, 2);
            _err2 = _yield$R$err10[0];
            user = _yield$R$err10[1];

            if (!_ramdam["default"].xNil(_err2)) {
              _context14.next = 33;
              break;
            }

            alert("something went wrong");
            set(false, "processing$util");
            return _context14.abrupt("return");

          case 33:
            add = {
              address: res.address,
              providerId: "authereum",
              uid: user.user.uid,
              image: "data:image/png;base64,".concat(new _identicon["default"](res.address, 60).toString())
            };
            user.user.providerData.push(add);

            _login({
              user: user,
              provider: "authereum",
              set: set,
              _add: add
            });

            set(false, "processing$util");

            if (!(window != undefined)) {
              _context14.next = 46;
              break;
            }

            Box = require("3box");
            _context14.next = 41;
            return Box.openBox(res.address, provider);

          case 41:
            box = _context14.sent;
            _context14.next = 44;
            return Box.getProfile(res.address);

          case 44:
            profile = _context14.sent;
            if (_ramdam["default"].xNil(profile)) _login({
              user: user,
              provider: "authereum",
              set: set,
              _add: profile
            });

          case 46:
            set(false, "processing$util");

          case 47:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function login_with_authereum(_x13) {
    return _ref24.apply(this, arguments);
  };
}();

var login_with_metamask = /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(_ref25) {
    var conf, set, state$, address, id, _yield$R$err11, _yield$R$err12, _err3, signature, login_url, res, auth, _yield$R$err13, _yield$R$err14, err2, user, add, Box, box, profile;

    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            conf = _ref25.conf, set = _ref25.set, state$ = _ref25.state$;

            if (!_ramdam["default"].xNil(window)) {
              _context15.next = 50;
              break;
            }

            set(true, "processing$util");
            _context15.next = 5;
            return state$.value.eth_selected$web3;

          case 5:
            address = _context15.sent;

            if (!_ramdam["default"].xNil(address)) {
              _context15.next = 50;
              break;
            }

            id = _shortid["default"].generate();
            _context15.next = 10;
            return (0, _firebase.fb)().fsdb.set({
              address: address
            }, "login", id);

          case 10:
            _context15.next = 12;
            return _ramdam["default"].err(web3.eth.personal.sign, web3)(id, address);

          case 12:
            _yield$R$err11 = _context15.sent;
            _yield$R$err12 = (0, _slicedToArray2["default"])(_yield$R$err11, 2);
            _err3 = _yield$R$err12[0];
            signature = _yield$R$err12[1];

            if (!_ramdam["default"].xNil(_err3)) {
              _context15.next = 20;
              break;
            }

            alert("something went wrong");
            set(false, "processing$util");
            return _context15.abrupt("return");

          case 20:
            login_url = "https://".concat(conf.firebase.region, "-").concat(conf.firebase.id, ".cloudfunctions.net/loginMetamask_account?data=").concat(id, "&signature=").concat(signature);
            _context15.next = 23;
            return fetch(login_url).then(function (response) {
              return response.json();
            });

          case 23:
            res = _context15.sent;
            _context15.next = 26;
            return (0, _firebase.fb)().firebase.auth();

          case 26:
            auth = _context15.sent;
            _context15.next = 29;
            return _ramdam["default"].err(auth.signInWithCustomToken, auth)(res.token);

          case 29:
            _yield$R$err13 = _context15.sent;
            _yield$R$err14 = (0, _slicedToArray2["default"])(_yield$R$err13, 2);
            err2 = _yield$R$err14[0];
            user = _yield$R$err14[1];

            if (!_ramdam["default"].xNil(err2)) {
              _context15.next = 37;
              break;
            }

            alert("something went wrong");
            set(false, "processing$util");
            return _context15.abrupt("return");

          case 37:
            add = {
              address: res.address,
              providerId: "metamask",
              uid: user.user.uid,
              image: "data:image/png;base64,".concat(new _identicon["default"](res.address, 60).toString())
            };
            user.user.providerData.push(add);

            _login({
              user: user,
              provider: "metamask",
              set: set,
              _add: add
            });

            set(false, "processing$util");

            if (!(window != undefined)) {
              _context15.next = 50;
              break;
            }

            Box = require("3box");
            _context15.next = 45;
            return Box.openBox(res.address, window.web3.currentProvider);

          case 45:
            box = _context15.sent;
            _context15.next = 48;
            return Box.getProfile(res.address);

          case 48:
            profile = _context15.sent;
            if (_ramdam["default"].xNil(profile)) _login({
              user: user,
              provider: "metamask",
              set: set,
              _add: profile
            });

          case 50:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function login_with_metamask(_x14) {
    return _ref26.apply(this, arguments);
  };
}();

var login_with_alis = /*#__PURE__*/function () {
  var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(_ref27) {
    var set, conf, code_verifier, code_challenge, purl;
    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            set = _ref27.set, conf = _ref27.conf;
            code_verifier = get_code_verifier();
            code_challenge = get_code_challenge(code_verifier);
            purl = "https://alis.to/oauth-authenticate?client_id=".concat(conf.alis.client_id, "&redirect_uri=").concat(encodeURIComponent(conf.alis.redirect_uri), "&scope=write&code_challenge=").concat(code_challenge);
            (0, _nookies.setCookie)(null, "alis_verifier", code_verifier, {
              path: "/"
            });
            window.location.href = purl;

          case 6:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16);
  }));

  return function login_with_alis(_x15) {
    return _ref28.apply(this, arguments);
  };
}();

var _login_with = /*#__PURE__*/function () {
  var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(_ref29) {
    var set, state$, login_url, provider, res, auth, _yield$R$err15, _yield$R$err16, _err4, user;

    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            set = _ref29.set, state$ = _ref29.state$, login_url = _ref29.login_url, provider = _ref29.provider;

            if (_ramdam["default"].hasPath(["value", "user", "uid"])(state$)) {
              login_url += "&uid=".concat(state$.value.user$account.uid);
            }

            _context17.next = 4;
            return fetch(login_url).then(function (response) {
              return response.json();
            });

          case 4:
            res = _context17.sent;

            if (!_ramdam["default"].xNil(res.user)) {
              _context17.next = 26;
              break;
            }

            _context17.next = 8;
            return (0, _firebase.fb)().firebase.auth();

          case 8:
            auth = _context17.sent;

            if (!(_ramdam["default"].hasPath(["token", "err"])(res) && _ramdam["default"].xNil(res.token.err))) {
              _context17.next = 13;
              break;
            }

            alert(res.token.err);
            set(false, "processing$util");
            return _context17.abrupt("return");

          case 13:
            _context17.next = 15;
            return _ramdam["default"].err(auth.signInWithCustomToken, auth)(res.token.token);

          case 15:
            _yield$R$err15 = _context17.sent;
            _yield$R$err16 = (0, _slicedToArray2["default"])(_yield$R$err15, 2);
            _err4 = _yield$R$err16[0];
            user = _yield$R$err16[1];

            if (!_ramdam["default"].xNil(_err4)) {
              _context17.next = 23;
              break;
            }

            alert("something went wrong");
            set(false, "processing$util");
            return _context17.abrupt("return");

          case 23:
            user.user.providerData.push({
              providerId: reverse_name_map[provider],
              uid: user.uid
            });

            _login({
              user: user,
              provider: reverse_name_map[provider],
              set: set,
              _add: res.user
            });

            set(false, "processing$util");

          case 26:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function _login_with(_x16) {
    return _ref30.apply(this, arguments);
  };
}();

var login_with_steem = /*#__PURE__*/function () {
  var _ref32 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(_ref31) {
    var set, state$, _ref31$link, link, conf, _yield$R$p, _yield$R$p2, err, code, login_url;

    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            set = _ref31.set, state$ = _ref31.state$, _ref31$link = _ref31.link, link = _ref31$link === void 0 ? false : _ref31$link, conf = _ref31.conf;
            _context18.next = 3;
            return _ramdam["default"].p(steem_client, "login")({});

          case 3:
            _yield$R$p = _context18.sent;
            _yield$R$p2 = (0, _slicedToArray2["default"])(_yield$R$p, 2);
            err = _yield$R$p2[0];
            code = _yield$R$p2[1];

            if (!(0, _util.errlog)(err, err, "Something went wrong!")) {
              _context18.next = 9;
              break;
            }

            return _context18.abrupt("return");

          case 9:
            login_url = "/api/steem-oauth_account?code=".concat(code);
            if (link) login_url += "&uid=".concat(state$.value.user$account.uid);
            _context18.next = 13;
            return _login_with({
              login_url: login_url,
              set: set,
              state$: state$,
              provider: "steem"
            });

          case 13:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function login_with_steem(_x17) {
    return _ref32.apply(this, arguments);
  };
}();

var deleteAccount = /*#__PURE__*/function () {
  var _ref34 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(_ref33) {
    var type, user, dispatch, extra, set, _user;

    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            type = _ref33.type, user = _ref33.val.user, dispatch = _ref33.dispatch, extra = _ref33.extra, set = _ref33.set;
            set(true, "processing$util");
            _context20.next = 4;
            return (0, _firebase.fb)().fsdb.tx("users", user.uid, /*#__PURE__*/function () {
              var _ref36 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(_ref35) {
                var t, ref, data, l, fsdb, _err5, _yield$R$err17, _yield$R$err18;

                return _regenerator["default"].wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        t = _ref35.t, ref = _ref35.ref, data = _ref35.data;
                        _context19.t0 = _regenerator["default"].keys(data.links || {});

                      case 2:
                        if ((_context19.t1 = _context19.t0()).done) {
                          _context19.next = 26;
                          break;
                        }

                        l = _context19.t1.value;
                        fsdb = (0, _firebase.fb)().fsdb;
                        _err5 = null;

                        if (!_ramdam["default"].includes(l)(["metamask", "authereum"])) {
                          _context19.next = 16;
                          break;
                        }

                        ;
                        _context19.next = 10;
                        return _ramdam["default"].err(fsdb["delete"])("wallet", data.links[l].address);

                      case 10:
                        _yield$R$err17 = _context19.sent;
                        _yield$R$err18 = (0, _slicedToArray2["default"])(_yield$R$err17, 1);
                        _err5 = _yield$R$err18[0];
                        if (_ramdam["default"].xNil(_err5)) console.log(_err5);
                        _context19.next = 24;
                        break;

                      case 16:
                        if (!_ramdam["default"].includes(l)(["uport"])) {
                          _context19.next = 21;
                          break;
                        }

                        _context19.next = 19;
                        return fsdb["delete"]("uport", data.links[l].id);

                      case 19:
                        _context19.next = 24;
                        break;

                      case 21:
                        if (!_ramdam["default"].includes(l)(["steem", "alis"])) {
                          _context19.next = 24;
                          break;
                        }

                        _context19.next = 24;
                        return fsdb["delete"]("usermap_".concat(l), data.links[l].username);

                      case 24:
                        _context19.next = 2;
                        break;

                      case 26:
                        _context19.next = 28;
                        return t.update(ref, {
                          status: "deleted"
                        });

                      case 28:
                        return _context19.abrupt("return", _context19.sent);

                      case 29:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19);
              }));

              return function (_x19) {
                return _ref36.apply(this, arguments);
              };
            }());

          case 4:
            _user = (0, _firebase.fb)().firebase.auth().currentUser;
            _context20.next = 7;
            return _user["delete"]();

          case 7:
            set(false, "processing$util");

          case 8:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));

  return function deleteAccount(_x18) {
    return _ref34.apply(this, arguments);
  };
}();

exports.deleteAccount = deleteAccount;

var linkAccount = /*#__PURE__*/function () {
  var _ref38 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(_ref37) {
    var type, _ref37$val, provider, user, dispatch, extra, set, state$, conf, _provider, currentUser, _yield$R$err19, _yield$R$err20, _err6, result;

    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            type = _ref37.type, _ref37$val = _ref37.val, provider = _ref37$val.provider, user = _ref37$val.user, dispatch = _ref37.dispatch, extra = _ref37.extra, set = _ref37.set, state$ = _ref37.state$, conf = _ref37.conf;

            if (!(provider === "uport")) {
              _context21.next = 7;
              break;
            }

            set(true, "processing$util");
            _context21.next = 5;
            return login_with_uport({
              set: set,
              state$: state$,
              link: true,
              conf: conf
            });

          case 5:
            _context21.next = 42;
            break;

          case 7:
            if (!(provider === "steem")) {
              _context21.next = 13;
              break;
            }

            _context21.next = 10;
            return login_with_steem({
              set: set,
              state$: state$,
              link: true,
              conf: conf
            });

          case 10:
            return _context21.abrupt("return");

          case 13:
            if (!(provider === "alis")) {
              _context21.next = 20;
              break;
            }

            set(true, "processing$util");
            _context21.next = 17;
            return login_with_alis({
              set: set,
              conf: conf
            });

          case 17:
            return _context21.abrupt("return");

          case 20:
            set(true, "processing$util");
            _provider = getProvider(provider);
            _context21.next = 24;
            return (0, _firebase.fb)().firebase.auth().currentUser;

          case 24:
            currentUser = _context21.sent;
            _context21.next = 27;
            return _ramdam["default"].err(currentUser.linkWithPopup, currentUser)(_provider);

          case 27:
            _yield$R$err19 = _context21.sent;
            _yield$R$err20 = (0, _slicedToArray2["default"])(_yield$R$err19, 2);
            _err6 = _yield$R$err20[0];
            result = _yield$R$err20[1];

            if (!_ramdam["default"].xNil(_err6)) {
              _context21.next = 37;
              break;
            }

            if (_ramdam["default"].xNil(_err6.code)) {
              alert(_err6.code);
            } else {
              alert("something went wrong");
            }

            set(false, "processing$util");
            return _context21.abrupt("return");

          case 37:
            _context21.next = 39;
            return _login({
              user: result,
              provider: reverse_name_map[provider],
              set: set
            });

          case 39:
            _context21.next = 41;
            return userUpdate({
              u: result.user,
              set: set
            });

          case 41:
            set(false, "processing$util");

          case 42:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function linkAccount(_x20) {
    return _ref38.apply(this, arguments);
  };
}();

exports.linkAccount = linkAccount;

var unlinkAccount = /*#__PURE__*/function () {
  var _ref40 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(_ref39) {
    var type, _ref39$val, provider, user, dispatch, extra, set, _provider, result;

    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            type = _ref39.type, _ref39$val = _ref39.val, provider = _ref39$val.provider, user = _ref39$val.user, dispatch = _ref39.dispatch, extra = _ref39.extra, set = _ref39.set;
            set(true, "processing$util");

            if (!_ramdam["default"].includes(provider)(["metamask", "authereum"])) {
              _context23.next = 7;
              break;
            }

            _context23.next = 5;
            return (0, _firebase.fb)().fsdb["delete"]("wallet", user.links[provider].address);

          case 5:
            _context23.next = 21;
            break;

          case 7:
            if (!_ramdam["default"].includes(provider)(["uport"])) {
              _context23.next = 12;
              break;
            }

            _context23.next = 10;
            return (0, _firebase.fb)().fsdb["delete"]("uport", user.links[provider].id);

          case 10:
            _context23.next = 21;
            break;

          case 12:
            if (!_ramdam["default"].includes(provider)(["steem", "alis"])) {
              _context23.next = 17;
              break;
            }

            _context23.next = 15;
            return (0, _firebase.fb)().fsdb["delete"]("usermap_".concat(provider), user.links[provider].username);

          case 15:
            _context23.next = 21;
            break;

          case 17:
            _provider = getProvider(provider);
            _context23.next = 20;
            return (0, _firebase.fb)().firebase.auth().currentUser.unlink(reverse_name_map[provider]);

          case 20:
            result = _context23.sent;

          case 21:
            _context23.next = 23;
            return (0, _firebase.fb)().fsdb.tx("users", user.uid, /*#__PURE__*/function () {
              var _ref42 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(_ref41) {
                var t, data, ref, links;
                return _regenerator["default"].wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        t = _ref41.t, data = _ref41.data, ref = _ref41.ref;
                        links = data.links;
                        delete links[provider];
                        _context22.next = 5;
                        return t.update(ref, {
                          links: links
                        });

                      case 5:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22);
              }));

              return function (_x22) {
                return _ref42.apply(this, arguments);
              };
            }());

          case 23:
            _context23.next = 25;
            return userUpdate({
              u: user,
              set: set
            });

          case 25:
            set(false, "processing$util");

          case 26:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23);
  }));

  return function unlinkAccount(_x21) {
    return _ref40.apply(this, arguments);
  };
}();

exports.unlinkAccount = unlinkAccount;
var init = {
  user: null,
  user_init: false,
  uport: null
};
exports.init = init;