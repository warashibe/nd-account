"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = exports.props = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rebass = require("rebass");

var _ramda = require("ramda");

var _react = _interopRequireDefault(require("react"));

var _const = require("../const");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var xNil = (0, _ramda.complement)(_ramda.isNil);
var socials_map = (0, _ramda.indexBy)((0, _ramda.prop)("key"))(_const.socials);
var btn = {
  cursor: "pointer",
  ":hover": {
    opacity: 0.75
  }
};
var props = ["user$account", "logout$account", "deleteAccount$account"];
exports.props = props;

var Component = function Component(props) {
  var fn = props.init();
  return /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    p: 3,
    fontColor: "#222"
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    width: "100px"
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
    src: "".concat(props.user$account.image),
    width: 1
  })), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    flex: 1,
    px: 2
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    mx: 2
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    my: 2,
    fontWeight: "bold",
    alignItems: "center"
  }, props.user$account.name, (0, _ramda.hasPath)(["user$account", "links", "uport"])(props) ? /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
    ml: 2,
    src: "/static/account/images/uport.png",
    height: "25px"
  }) : null), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    lineHeight: "120%",
    fontSize: "14px"
  }, props.user$account.description), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    mt: 2
  }, (0, _ramda.compose)((0, _ramda.filter)(xNil), _ramda.values, (0, _ramda.mapObjIndexed)(function (v, k) {
    return (0, _ramda.includes)(k)(["google", "facebook", "authereum", "metamask", "uport"]) ? null : /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
      m: 1,
      as: "a",
      href: xNil(socials_map[k].url) ? socials_map[k].url(v) : null,
      target: "_blank"
    }, /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
      sx: _objectSpread({}, btn),
      src: "/static/account/images/".concat(k, ".png"),
      height: "20px"
    }));
  }))(props.user$account.links || {}))), /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    width: 1,
    mt: 2
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    p: 2,
    width: 0.5
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    textAlign: "center",
    p: 2,
    sx: _objectSpread(_objectSpread({}, btn), {}, {
      borderRadius: "3px"
    }),
    width: 1,
    onClick: fn.logout$account,
    bg: "orange",
    color: "white"
  }, "Logout")), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    p: 2,
    width: 0.5
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    textAlign: "center",
    p: 2,
    width: 1,
    sx: _objectSpread(_objectSpread({}, btn), {}, {
      borderRadius: "3px"
    }),
    onClick: function onClick() {
      if (confirm("Are you sure?")) {
        fn.deleteAccount$account({
          user: props.user$account
        });
      }
    },
    bg: "tomato",
    color: "white"
  }, "Delete")))));
};

exports.Component = Component;