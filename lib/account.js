"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlinkAccount = exports.linkAccount = exports.deleteAccount = exports.check_alis = exports.login = exports.logout_authereum = exports.logout = exports.changeUser = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ramda = require("ramda");

var _shortid = _interopRequireDefault(require("shortid"));

var _util = require("@nextdapp/util");

var _firebase = require("@nextdapp/firebase");

var _identicon = _interopRequireDefault(require("identicon.js"));

var _nookies = require("nookies");

var _uportConnect = require("uport-connect");

var _this = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var xNil = (0, _ramda.complement)(_ramda.isNil);

var err = function err(fn, ctx) {
  return /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var ret,
        err,
        _len,
        args,
        _key,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ret = null;
            err = null;
            _context.prev = 2;

            for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = _args[_key];
            }

            _context.next = 6;
            return fn.apply(ctx || _this, args);

          case 6:
            ret = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](2);
            err = _context.t0;

          case 12:
            return _context.abrupt("return", [err, ret]);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 9]]);
  }));
};

var promisifyProp = (0, _ramda.curryN)(2, function (prop, ctx) {
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return new Promise(function (res, rej) {
      return prop(prop)(ctx).apply(ctx, (0, _ramda.append)(function (err, result) {
        return (0, _ramda.isNil)(err) ? res(result) : rej(err);
      }, args));
    });
  };
});
var promisifyPath = (0, _ramda.curryN)(2, function (path, ctx) {
  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return new Promise(function (res, rej) {
      return path(path)(ctx).apply(ctx, (0, _ramda.append)(function (err, result) {
        return (0, _ramda.isNil)(err) ? res(result) : rej(err);
      }, args));
    });
  };
});

var promisify = function promisify(fn) {
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return new Promise(function (res, rej) {
      return (0, _ramda.compose)((0, _ramda.apply)(fn), (0, _ramda.append)(function (err, result) {
        return (0, _ramda.isNil)(err) ? res(result) : rej(err);
      }))(args);
    });
  };
};

var p = function p(fn, pth) {
  return err((0, _ramda.isNil)(pth) ? promisify(fn) : (0, _ramda.is)(Array)(pth) ? promisifyPath(pth, fn) : promisifyProp(pth, fn), fn);
};

var logging = false;
var conf, steem_client;

var base64url = require("base64url");

var sha256 = require("js-sha256");

var steemconnect = require("steemconnect");

var name_map = {
  "alis.to": "alis",
  uport: "uport",
  metamask: "metamask",
  authereum: "authereum",
  "steemit.com": "steem",
  "twitter.com": "twitter",
  "facebook.com": "facebook",
  "google.com": "google",
  "github.com": "github"
};
var reverse_name_map = (0, _ramda.invertObj)(name_map);
var link_converter = {
  "alis.to": function alisTo(_u, add) {
    return (0, _ramda.mergeLeft)({
      name: add.user_display_name,
      image: add.icon_image_url,
      description: add.self_introduction,
      username: add.user_id
    }, _u);
  },
  "twitter.com": function twitterCom(_u, add) {
    return (0, _ramda.mergeLeft)({
      username: add.username,
      id_str: add.profile.id_str,
      description: add.profile.description,
      image: add.profile.profile_image_url_https.replace(/_normal/, ""),
      cover: add.profile.profile_banner_url
    }, _u);
  },
  "facebook.com": function facebookCom(_u, add) {
    return (0, _ramda.mergeLeft)({
      name: add.profile.name,
      image: (0, _ramda.hasPath)(["profile", "picture", "data", "url"])(add) ? add.profile.picture.data.url : undefined
    }, _u);
  },
  "google.com": function googleCom(_u, add) {
    return (0, _ramda.mergeLeft)({
      name: add.profile.name,
      image: add.profile.picture
    }, _u);
  },
  authereum: function authereum(_u, add) {
    return (0, _ramda.mergeLeft)({
      address: add.address,
      image: add.image,
      name: add.name
    }, _u);
  },
  metamask: function metamask(_u, add) {
    return (0, _ramda.mergeLeft)({
      address: add.address,
      image: add.image,
      name: add.name
    }, _u);
  },
  uport: function uport(_u, add) {
    return (0, _ramda.mergeLeft)({
      id: add.id,
      image: add.image,
      name: add.name
    }, _u);
  },
  "steemit.com": function steemitCom(_u, add) {
    return (0, _ramda.mergeLeft)({
      name: add.name,
      image: add.profile_image,
      description: add.about,
      username: add.id,
      cover: add.cover_image
    }, _u);
  },
  "github.com": function githubCom(_u, add) {
    return (0, _ramda.mergeLeft)({
      username: add.username,
      name: add.profile.name,
      description: add.profile.bio
    }, _u);
  }
};

var userUpdate = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref2) {
    var u, set, user;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            u = _ref2.u, set = _ref2.set;

            if (!(0, _ramda.isNil)(u)) {
              _context2.next = 5;
              break;
            }

            _context2.t0 = null;
            _context2.next = 8;
            break;

          case 5:
            _context2.next = 7;
            return (0, _firebase.fb)().fsdb.get("users", u.uid);

          case 7:
            _context2.t0 = _context2.sent;

          case 8:
            user = _context2.t0;
            logging = false;
            set({
              user$account: user,
              user_init$account: true
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function userUpdate(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var _userUpdate_props = ["user$account", "user_init$account"];

var changeUser = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(_ref4) {
    var val, set, conf;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            val = _ref4.val, set = _ref4.set, conf = _ref4.conf;
            steem_client = new steemconnect.Client({
              app: conf.steem.app,
              callbackURL: conf.steem.redirect_uri,
              scope: ["login"]
            });
            (0, _firebase.fb)().firebase.auth().onAuthStateChanged( /*#__PURE__*/function () {
              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(u) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        if (logging) {
                          _context3.next = 3;
                          break;
                        }

                        _context3.next = 3;
                        return userUpdate({
                          u: u,
                          set: set
                        });

                      case 3:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x3) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function changeUser(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.changeUser = changeUser;
changeUser.props = _userUpdate_props;

var logout = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(_ref7) {
    var val, auth, _yield$err, _yield$err2, error;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            val = _ref7.val;
            _context5.next = 3;
            return (0, _firebase.fb)().firebase.auth();

          case 3:
            auth = _context5.sent;
            _context5.next = 6;
            return err(auth.signOut, auth)();

          case 6:
            _yield$err = _context5.sent;
            _yield$err2 = (0, _slicedToArray2["default"])(_yield$err, 1);
            error = _yield$err2[0];
            (0, _util.errlog)(error, error, "ログアウトに失敗しました。もう一度お試し下さい。");

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function logout(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.logout = logout;

var logout_authereum = /*#__PURE__*/function () {
  var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(_ref9) {
    var val, _yield$err3, _yield$err4, error;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            val = _ref9.val;
            _context6.next = 3;
            return err((0, _firebase.fb)().firebase.auth(), "signOut")();

          case 3:
            _yield$err3 = _context6.sent;
            _yield$err4 = (0, _slicedToArray2["default"])(_yield$err3, 1);
            error = _yield$err4[0];
            (0, _util.errlog)(error, error, "ログアウトに失敗しました。もう一度お試し下さい。");

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function logout_authereum(_x5) {
    return _ref10.apply(this, arguments);
  };
}();

exports.logout_authereum = logout_authereum;

var _login = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_ref11) {
    var user, provider, set, _ref11$_add, _add;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            user = _ref11.user, provider = _ref11.provider, set = _ref11.set, _ref11$_add = _ref11._add, _add = _ref11$_add === void 0 ? {} : _ref11$_add;
            logging = true;

            if (!(0, _ramda.hasPath)(["user", "uid"])(user)) {
              _context8.next = 7;
              break;
            }

            _context8.next = 5;
            return (0, _firebase.fb)().fsdb.tx("users", user.user.uid, /*#__PURE__*/function () {
              var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(_ref13) {
                var data, t, ref, _u, add, _iterator, _step, v, _i, _arr, k;

                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        data = _ref13.data, t = _ref13.t, ref = _ref13.ref;
                        _u = data || {
                          uid: user.user.uid,
                          status: "active"
                        };
                        _u.links = (0, _ramda.propOr)({}, "links")(_u);
                        add = (0, _ramda.mergeLeft)(user.additionalUserInfo, _add);
                        _iterator = _createForOfIteratorHelper(user.user.providerData);

                        try {
                          for (_iterator.s(); !(_step = _iterator.n()).done;) {
                            v = _step.value;

                            if (xNil(link_converter[v.providerId])) {
                              _u.links[name_map[v.providerId]] = {
                                id: v.uid,
                                name: v.displayName,
                                image: v.photoURL
                              };

                              if (provider === v.providerId && xNil(add)) {
                                _u.links[name_map[v.providerId]] = link_converter[v.providerId](_u.links[name_map[v.providerId]], add);
                              }

                              _u.links[name_map[v.providerId]] = (0, _ramda.pickBy)(_ramda.identity)(_u.links[name_map[v.providerId]]);

                              if (provider === v.providerId && xNil(add)) {
                                for (_i = 0, _arr = ["name", "image", "cover", "description"]; _i < _arr.length; _i++) {
                                  k = _arr[_i];

                                  if (((0, _ramda.isNil)(_u[k]) || (0, _ramda.hasPath)(["profile_update", k])) && xNil(_u.links[name_map[v.providerId]][k])) {
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

                        _u = (0, _ramda.pickBy)(_ramda.identity)(_u);
                        _context7.next = 9;
                        return (0, _firebase.fb)().fsdb.upsert(_u, "users", _u.uid);

                      case 9:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x7) {
                return _ref14.apply(this, arguments);
              };
            }());

          case 5:
            _context8.next = 7;
            return userUpdate({
              u: user.user,
              set: set
            });

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function _login(_x6) {
    return _ref12.apply(this, arguments);
  };
}();

var getProvider = function getProvider(provider) {
  return new ((0, _firebase.fb)().firebase.auth["".concat(provider[0].toUpperCase()).concat(provider.slice(1), "AuthProvider")])();
};

var login_with = {
  steem: function () {
    var _steem = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(_ref15) {
      var set, props, _ref15$link, link, conf, _yield$p, _yield$p2, error, code, login_url;

      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              set = _ref15.set, props = _ref15.props, _ref15$link = _ref15.link, link = _ref15$link === void 0 ? false : _ref15$link, conf = _ref15.conf;
              _context9.next = 3;
              return p(steem_client, "login")({});

            case 3:
              _yield$p = _context9.sent;
              _yield$p2 = (0, _slicedToArray2["default"])(_yield$p, 2);
              error = _yield$p2[0];
              code = _yield$p2[1];

              if (!(0, _util.errlog)(error, error, "Something went wrong!")) {
                _context9.next = 9;
                break;
              }

              return _context9.abrupt("return");

            case 9:
              login_url = "/api/steem-oauth_account?code=".concat(code);
              if (link) login_url += "&uid=".concat(props.user$account.uid);
              _context9.next = 13;
              return _login_with({
                login_url: login_url,
                set: set,
                props: props,
                provider: "steem"
              });

            case 13:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    function steem(_x8) {
      return _steem.apply(this, arguments);
    }

    return steem;
  }(),
  alis: function () {
    var _alis = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(_ref16) {
      var conf, code_verifier, code_challenge, purl;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              conf = _ref16.conf;
              code_verifier = get_code_verifier();
              code_challenge = get_code_challenge(code_verifier);
              purl = "https://alis.to/oauth-authenticate?client_id=".concat(conf.alis.client_id, "&redirect_uri=").concat(encodeURIComponent(conf.alis.redirect_uri), "&scope=write&code_challenge=").concat(code_challenge);
              (0, _nookies.setCookie)(null, "alis_verifier", code_verifier, {
                path: "/"
              });
              window.location.href = purl;

            case 6:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));

    function alis(_x9) {
      return _alis.apply(this, arguments);
    }

    return alis;
  }(),
  authereum: function () {
    var _authereum = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(_ref17) {
      var conf, set, props, provider, address, id, signature, login_url, res, auth, _yield$err5, _yield$err6, error, user, add, Box, box, profile;

      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              conf = _ref17.conf, set = _ref17.set, props = _ref17.props;

              if (!xNil(window)) {
                _context11.next = 47;
                break;
              }

              set(true, "processing$util");
              provider = props.authereum$web3.getProvider();
              _context11.next = 6;
              return provider.enable();

            case 6:
              _context11.next = 8;
              return props.authereum$web3.getAccountAddress();

            case 8:
              address = _context11.sent;

              if (!xNil(address)) {
                _context11.next = 46;
                break;
              }

              id = _shortid["default"].generate();
              _context11.next = 13;
              return (0, _firebase.fb)().fsdb.set({
                address: address
              }, "login", id);

            case 13:
              _context11.next = 15;
              return props.web3_authereum$web3.eth.sign(id, address);

            case 15:
              signature = _context11.sent;
              login_url = "https://".concat(conf.firebase.region, "-").concat(conf.firebase.id, ".cloudfunctions.net/loginAuthereum_account?data=").concat(id, "&signature=").concat(signature);
              _context11.next = 19;
              return fetch(login_url).then(function (response) {
                return response.json();
              });

            case 19:
              res = _context11.sent;
              _context11.next = 22;
              return (0, _firebase.fb)().firebase.auth();

            case 22:
              auth = _context11.sent;
              _context11.next = 25;
              return err(auth.signInWithCustomToken, auth)(res.token);

            case 25:
              _yield$err5 = _context11.sent;
              _yield$err6 = (0, _slicedToArray2["default"])(_yield$err5, 2);
              error = _yield$err6[0];
              user = _yield$err6[1];

              if (!xNil(error)) {
                _context11.next = 33;
                break;
              }

              alert("something went wrong");
              set(false, "processing$util");
              return _context11.abrupt("return");

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
                _context11.next = 46;
                break;
              }

              Box = require("3box");
              _context11.next = 41;
              return Box.openBox(res.address, provider);

            case 41:
              box = _context11.sent;
              _context11.next = 44;
              return Box.getProfile(res.address);

            case 44:
              profile = _context11.sent;
              if (xNil(profile)) _login({
                user: user,
                provider: "authereum",
                set: set,
                _add: profile
              });

            case 46:
              set(false, "processing$util");

            case 47:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));

    function authereum(_x10) {
      return _authereum.apply(this, arguments);
    }

    return authereum;
  }(),
  metamask: function () {
    var _metamask = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(_ref18) {
      var conf, set, props, address, id, _yield$err7, _yield$err8, error, signature, login_url, res, auth, _yield$err9, _yield$err10, err2, user, add, Box, box, profile;

      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              conf = _ref18.conf, set = _ref18.set, props = _ref18.props;

              if (!xNil(window)) {
                _context12.next = 50;
                break;
              }

              set(true, "processing$util");
              _context12.next = 5;
              return props.eth_selected$web3;

            case 5:
              address = _context12.sent;

              if (!xNil(address)) {
                _context12.next = 50;
                break;
              }

              id = _shortid["default"].generate();
              _context12.next = 10;
              return (0, _firebase.fb)().fsdb.set({
                address: address
              }, "login", id);

            case 10:
              _context12.next = 12;
              return err(web3.eth.personal.sign, web3)(id, address);

            case 12:
              _yield$err7 = _context12.sent;
              _yield$err8 = (0, _slicedToArray2["default"])(_yield$err7, 2);
              error = _yield$err8[0];
              signature = _yield$err8[1];

              if (!xNil(error)) {
                _context12.next = 20;
                break;
              }

              alert("something went wrong");
              set(false, "processing$util");
              return _context12.abrupt("return");

            case 20:
              login_url = "https://".concat(conf.firebase.region, "-").concat(conf.firebase.id, ".cloudfunctions.net/loginMetamask_account?data=").concat(id, "&signature=").concat(signature);
              _context12.next = 23;
              return fetch(login_url).then(function (response) {
                return response.json();
              });

            case 23:
              res = _context12.sent;
              _context12.next = 26;
              return (0, _firebase.fb)().firebase.auth();

            case 26:
              auth = _context12.sent;
              _context12.next = 29;
              return err(auth.signInWithCustomToken, auth)(res.token);

            case 29:
              _yield$err9 = _context12.sent;
              _yield$err10 = (0, _slicedToArray2["default"])(_yield$err9, 2);
              err2 = _yield$err10[0];
              user = _yield$err10[1];

              if (!xNil(err2)) {
                _context12.next = 37;
                break;
              }

              alert("something went wrong");
              set(false, "processing$util");
              return _context12.abrupt("return");

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
                _context12.next = 50;
                break;
              }

              Box = require("3box");
              _context12.next = 45;
              return Box.openBox(res.address, window.web3.currentProvider);

            case 45:
              box = _context12.sent;
              _context12.next = 48;
              return Box.getProfile(res.address);

            case 48:
              profile = _context12.sent;
              if (xNil(profile)) _login({
                user: user,
                provider: "metamask",
                set: set,
                _add: profile
              });

            case 50:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));

    function metamask(_x11) {
      return _metamask.apply(this, arguments);
    }

    return metamask;
  }(),
  uport: function () {
    var _uport = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(_ref19) {
      var conf, set, props, _ref19$link, link, id, unsub, login_url, json;

      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              conf = _ref19.conf, set = _ref19.set, props = _ref19.props, _ref19$link = _ref19.link, link = _ref19$link === void 0 ? false : _ref19$link;
              id = _shortid["default"].generate();
              _context14.next = 4;
              return (0, _firebase.fb)().fsdb.on("login_read", id, /*#__PURE__*/function () {
                var _ref20 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(res) {
                  var auth, _yield$err11, _yield$err12, error, user, uid, cert, add;

                  return _regenerator["default"].wrap(function _callee13$(_context13) {
                    while (1) {
                      switch (_context13.prev = _context13.next) {
                        case 0:
                          if (!xNil(res)) {
                            _context13.next = 25;
                            break;
                          }

                          unsub();
                          _context13.next = 4;
                          return (0, _firebase.fb)().fsdb["delete"]("login_read", id);

                        case 4:
                          if (!xNil(res.token)) {
                            _context13.next = 24;
                            break;
                          }

                          _context13.next = 7;
                          return (0, _firebase.fb)().firebase.auth();

                        case 7:
                          auth = _context13.sent;
                          _context13.next = 10;
                          return err(auth.signInWithCustomToken, auth)(res.token);

                        case 10:
                          _yield$err11 = _context13.sent;
                          _yield$err12 = (0, _slicedToArray2["default"])(_yield$err11, 2);
                          error = _yield$err12[0];
                          user = _yield$err12[1];

                          if (!xNil(error)) {
                            _context13.next = 18;
                            break;
                          }

                          alert("something went wrong");
                          set(false, "processing$util");
                          return _context13.abrupt("return");

                        case 18:
                          uid = user.user.uid;
                          _context13.next = 21;
                          return (0, _firebase.fb)().fsdb.get("uport", ["uid", "==", uid]);

                        case 21:
                          cert = _context13.sent;
                          add = {
                            providerId: "uport",
                            uid: uid
                          };

                          if (xNil(cert[0])) {
                            add = (0, _ramda.mergeLeft)(add, {
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
                          return _context13.stop();
                      }
                    }
                  }, _callee13);
                }));

                return function (_x13) {
                  return _ref20.apply(this, arguments);
                };
              }());

            case 4:
              unsub = _context14.sent;
              login_url = "/api/uport-login_account?id=".concat(id);
              if (link) login_url += "&uid=".concat(props.user$account.uid);
              _context14.next = 9;
              return fetch(login_url).then(function (r) {
                return r.json();
              });

            case 9:
              json = _context14.sent;
              set(json, "uport$account");

            case 11:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    }));

    function uport(_x12) {
      return _uport.apply(this, arguments);
    }

    return uport;
  }()
};

var login = /*#__PURE__*/function () {
  var _ref22 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(_ref21) {
    var provider, set, props, conf, _provider, auth, _yield$err13, _yield$err14, error, user;

    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            provider = _ref21.val.provider, set = _ref21.set, props = _ref21.props, conf = _ref21.conf;

            if (!xNil(login_with[provider])) {
              _context15.next = 4;
              break;
            }

            _context15.next = 4;
            return login_with[provider]({
              set: set,
              props: props,
              conf: conf
            });

          case 4:
            set(true, "processing$util");
            _provider = getProvider(provider);
            _context15.next = 8;
            return (0, _firebase.fb)().firebase.auth();

          case 8:
            auth = _context15.sent;
            _context15.next = 11;
            return err(auth.signInWithPopup, auth)(_provider);

          case 11:
            _yield$err13 = _context15.sent;
            _yield$err14 = (0, _slicedToArray2["default"])(_yield$err13, 2);
            error = _yield$err14[0];
            user = _yield$err14[1];

            if (!xNil(error)) {
              _context15.next = 19;
              break;
            }

            alert("something went wrong");
            _context15.next = 21;
            break;

          case 19:
            _context15.next = 21;
            return _login({
              user: user,
              provider: reverse_name_map[provider],
              set: set
            });

          case 21:
            set(false, "processing$util");

          case 22:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15);
  }));

  return function login(_x14) {
    return _ref22.apply(this, arguments);
  };
}();

exports.login = login;
login.props = ["processing$util", "uport$account"];

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
  var _ref23 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(props) {
    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return new Promise(function (res) {
              setInterval( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
                return _regenerator["default"].wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        if (!(props.user_init$account === false)) {
                          _context16.next = 8;
                          break;
                        }

                        _context16.t0 = res;
                        _context16.next = 4;
                        return checkUser(props);

                      case 4:
                        _context16.t1 = _context16.sent;
                        (0, _context16.t0)(_context16.t1);
                        _context16.next = 9;
                        break;

                      case 8:
                        res(props.user$account);

                      case 9:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16);
              })), 500);
            });

          case 2:
            return _context17.abrupt("return", _context17.sent);

          case 3:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17);
  }));

  return function checkUser(_x15) {
    return _ref23.apply(this, arguments);
  };
}();

var check_alis = /*#__PURE__*/function () {
  var _ref26 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(_ref25) {
    var router, props, set, code, cookies, alis_verifier, user, login_url;
    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            router = _ref25.val.router, props = _ref25.props, set = _ref25.set;
            code = router.query.code;

            if (!(0, _ramda.isNil)(code)) {
              _context18.next = 4;
              break;
            }

            return _context18.abrupt("return");

          case 4:
            set(true, "processing$util");
            cookies = (0, _nookies.parseCookies)();
            alis_verifier = cookies.alis_verifier;
            _context18.next = 9;
            return checkUser(props);

          case 9:
            user = _context18.sent;
            login_url = "/api/alis-oauth_account?code=".concat(code, "&verifier=").concat(cookies.alis_verifier);
            _context18.next = 13;
            return _login_with({
              login_url: login_url,
              set: set,
              props: props,
              provider: "alis"
            });

          case 13:
            router.replace(router.pathname, router.pathname, {
              shallow: true
            });

          case 14:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18);
  }));

  return function check_alis(_x16) {
    return _ref26.apply(this, arguments);
  };
}();

exports.check_alis = check_alis;
check_alis.props = ["processing$util"];

var _login_with = /*#__PURE__*/function () {
  var _ref28 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(_ref27) {
    var set, props, login_url, provider, res, auth, _yield$err15, _yield$err16, error, user;

    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            set = _ref27.set, props = _ref27.props, login_url = _ref27.login_url, provider = _ref27.provider;

            if ((0, _ramda.hasPath)(["value", "user", "uid"])(props)) {
              login_url += "&uid=".concat(props.user$account.uid);
            }

            _context19.next = 4;
            return fetch(login_url).then(function (response) {
              return response.json();
            });

          case 4:
            res = _context19.sent;

            if (!xNil(res.user)) {
              _context19.next = 26;
              break;
            }

            _context19.next = 8;
            return (0, _firebase.fb)().firebase.auth();

          case 8:
            auth = _context19.sent;

            if (!((0, _ramda.hasPath)(["token", "err"])(res) && xNil(res.token.err))) {
              _context19.next = 13;
              break;
            }

            alert(res.token.err);
            set(false, "processing$util");
            return _context19.abrupt("return");

          case 13:
            _context19.next = 15;
            return err(auth.signInWithCustomToken, auth)(res.token.token);

          case 15:
            _yield$err15 = _context19.sent;
            _yield$err16 = (0, _slicedToArray2["default"])(_yield$err15, 2);
            error = _yield$err16[0];
            user = _yield$err16[1];

            if (!xNil(err)) {
              _context19.next = 23;
              break;
            }

            alert("something went wrong");
            set(false, "processing$util");
            return _context19.abrupt("return");

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
            return _context19.stop();
        }
      }
    }, _callee19);
  }));

  return function _login_with(_x17) {
    return _ref28.apply(this, arguments);
  };
}();

var deleteAccount = /*#__PURE__*/function () {
  var _ref30 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(_ref29) {
    var user, set, _user;

    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            user = _ref29.val.user, set = _ref29.set;
            set(true, "processing$util");
            _context21.next = 4;
            return (0, _firebase.fb)().fsdb.tx("users", user.uid, /*#__PURE__*/function () {
              var _ref32 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(_ref31) {
                var t, ref, data, l, fsdb, _err, _yield$_err, _yield$_err2, error;

                return _regenerator["default"].wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        t = _ref31.t, ref = _ref31.ref, data = _ref31.data;
                        _context20.t0 = _regenerator["default"].keys(data.links || {});

                      case 2:
                        if ((_context20.t1 = _context20.t0()).done) {
                          _context20.next = 25;
                          break;
                        }

                        l = _context20.t1.value;
                        fsdb = (0, _firebase.fb)().fsdb;
                        _err = null;

                        if (!(0, _ramda.includes)(l)(["metamask", "authereum"])) {
                          _context20.next = 15;
                          break;
                        }

                        _context20.next = 9;
                        return _err(fsdb["delete"])("wallet", data.links[l].address);

                      case 9:
                        _yield$_err = _context20.sent;
                        _yield$_err2 = (0, _slicedToArray2["default"])(_yield$_err, 1);
                        error = _yield$_err2[0];
                        if (xNil(error)) console.log(_err);
                        _context20.next = 23;
                        break;

                      case 15:
                        if (!(0, _ramda.includes)(l)(["uport"])) {
                          _context20.next = 20;
                          break;
                        }

                        _context20.next = 18;
                        return fsdb["delete"]("uport", data.links[l].id);

                      case 18:
                        _context20.next = 23;
                        break;

                      case 20:
                        if (!(0, _ramda.includes)(l)(["steem", "alis"])) {
                          _context20.next = 23;
                          break;
                        }

                        _context20.next = 23;
                        return fsdb["delete"]("usermap_".concat(l), data.links[l].username);

                      case 23:
                        _context20.next = 2;
                        break;

                      case 25:
                        _context20.next = 27;
                        return t.update(ref, {
                          status: "deleted"
                        });

                      case 27:
                        return _context20.abrupt("return", _context20.sent);

                      case 28:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20);
              }));

              return function (_x19) {
                return _ref32.apply(this, arguments);
              };
            }());

          case 4:
            _user = (0, _firebase.fb)().firebase.auth().currentUser;
            _context21.next = 7;
            return _user["delete"]();

          case 7:
            set(false, "processing$util");

          case 8:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21);
  }));

  return function deleteAccount(_x18) {
    return _ref30.apply(this, arguments);
  };
}();

exports.deleteAccount = deleteAccount;
deleteAccount.props = ["processing$util"];

var linkAccount = /*#__PURE__*/function () {
  var _ref34 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(_ref33) {
    var _ref33$val, provider, user, set, props, conf, _provider, currentUser, _yield$err17, _yield$err18, error, result;

    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _ref33$val = _ref33.val, provider = _ref33$val.provider, user = _ref33$val.user, set = _ref33.set, props = _ref33.props, conf = _ref33.conf;
            set(true, "processing$util");

            if (!(xNil(login_with[provider]) && !(0, _ramda.includes)(provider)(["metamask", "authereum"])())) {
              _context22.next = 7;
              break;
            }

            _context22.next = 5;
            return login_with[provider]({
              set: set,
              props: props,
              link: true,
              conf: conf
            });

          case 5:
            _context22.next = 26;
            break;

          case 7:
            _provider = getProvider(provider);
            _context22.next = 10;
            return (0, _firebase.fb)().firebase.auth().currentUser;

          case 10:
            currentUser = _context22.sent;
            _context22.next = 13;
            return err(currentUser.linkWithPopup, currentUser)(_provider);

          case 13:
            _yield$err17 = _context22.sent;
            _yield$err18 = (0, _slicedToArray2["default"])(_yield$err17, 2);
            error = _yield$err18[0];
            result = _yield$err18[1];

            if (!xNil(error)) {
              _context22.next = 21;
              break;
            }

            alert(xNil(err.code) ? err.code : "something went wrong");
            _context22.next = 25;
            break;

          case 21:
            _context22.next = 23;
            return _login({
              user: result,
              provider: reverse_name_map[provider],
              set: set
            });

          case 23:
            _context22.next = 25;
            return userUpdate({
              u: result.user,
              set: set
            });

          case 25:
            set(false, "processing$util");

          case 26:
            return _context22.abrupt("return");

          case 27:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function linkAccount(_x20) {
    return _ref34.apply(this, arguments);
  };
}();

exports.linkAccount = linkAccount;
linkAccount.props = ["processing$util"];

var unlinkAccount = /*#__PURE__*/function () {
  var _ref36 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(_ref35) {
    var _ref35$val, provider, user, set, _provider, result;

    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _ref35$val = _ref35.val, provider = _ref35$val.provider, user = _ref35$val.user, set = _ref35.set;
            set(true, "processing$util");

            if (!(0, _ramda.includes)(provider)(["metamask", "authereum"])) {
              _context24.next = 7;
              break;
            }

            _context24.next = 5;
            return (0, _firebase.fb)().fsdb["delete"]("wallet", user.links[provider].address);

          case 5:
            _context24.next = 21;
            break;

          case 7:
            if (!(0, _ramda.includes)(provider)(["uport"])) {
              _context24.next = 12;
              break;
            }

            _context24.next = 10;
            return (0, _firebase.fb)().fsdb["delete"]("uport", user.links[provider].id);

          case 10:
            _context24.next = 21;
            break;

          case 12:
            if (!(0, _ramda.includes)(provider)(["steem", "alis"])) {
              _context24.next = 17;
              break;
            }

            _context24.next = 15;
            return (0, _firebase.fb)().fsdb["delete"]("usermap_".concat(provider), user.links[provider].username);

          case 15:
            _context24.next = 21;
            break;

          case 17:
            _provider = getProvider(provider);
            _context24.next = 20;
            return (0, _firebase.fb)().firebase.auth().currentUser.unlink(reverse_name_map[provider]);

          case 20:
            result = _context24.sent;

          case 21:
            _context24.next = 23;
            return (0, _firebase.fb)().fsdb.tx("users", user.uid, /*#__PURE__*/function () {
              var _ref38 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(_ref37) {
                var t, data, ref, links;
                return _regenerator["default"].wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        t = _ref37.t, data = _ref37.data, ref = _ref37.ref;
                        links = data.links;
                        delete links[provider];
                        _context23.next = 5;
                        return t.update(ref, {
                          links: links
                        });

                      case 5:
                      case "end":
                        return _context23.stop();
                    }
                  }
                }, _callee23);
              }));

              return function (_x22) {
                return _ref38.apply(this, arguments);
              };
            }());

          case 23:
            _context24.next = 25;
            return userUpdate({
              u: user,
              set: set
            });

          case 25:
            set(false, "processing$util");

          case 26:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24);
  }));

  return function unlinkAccount(_x21) {
    return _ref36.apply(this, arguments);
  };
}();

exports.unlinkAccount = unlinkAccount;
unlinkAccount.props = ["processing$util"];