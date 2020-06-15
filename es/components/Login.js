"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.props = exports.funcs = exports.Component = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rebass = require("rebass");

var _react = _interopRequireWildcard(require("react"));

var _const = require("../const");

var _ramda = require("ramda");

var _firebase = require("@nextdapp/firebase");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var socials_map = (0, _ramda.indexBy)((0, _ramda.prop)("key"))(_const.socials);
var btn = {
  cursor: "pointer",
  ":hover": {
    opacity: 0.75
  }
};

var Component = function Component(props) {
  var methods = (0, _ramda.isNil)(props.methods) ? _const.socials : (0, _ramda.filter)(function (v) {
    return (0, _ramda.includes)(v.key)(props.methods);
  })(_const.socials);
  return /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    textAlign: "center"
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    p: 3,
    width: 1
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    width: 1,
    flexWrap: "wrap"
  }, (0, _ramda.map)(function (v) {
    return /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
      width: [1 / 2, null, 1 / 3, 1 / 2, 1 / 3],
      color: "white",
      p: 2,
      alignItems: "center"
    }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
      onClick: function onClick() {
        return props.login$account({
          provider: v
        });
      },
      flex: 1,
      p: 3,
      bg: socials_map[v].bg,
      sx: _objectSpread(_objectSpread({}, btn), {}, {
        borderRadius: "3px"
      })
    }, /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
      src: "/static/account/images/".concat(socials_map[v].key, "-white.png"),
      height: ["50px"]
    }), /*#__PURE__*/_react["default"].createElement(_rebass.Text, {
      mt: 1
    }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
      fontSize: "18px",
      fontWeight: "bold"
    }, socials_map[v].name), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
      as: "span",
      fontSize: "12px"
    }, "Login with"))));
  })((0, _ramda.pluck)("key")(methods)))));
};

exports.Component = Component;
var funcs = ["login$account"];
exports.funcs = funcs;
var props = [];
exports.props = props;