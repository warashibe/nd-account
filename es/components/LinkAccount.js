"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = exports.funcs = exports.props = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ramda = require("ramda");

var _react = _interopRequireDefault(require("react"));

var _rebass = require("rebass");

var _const = require("../const");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var xNil = (0, _ramda.complement)(_ramda.isNil);
var btn = {
  cursor: "pointer",
  ":hover": {
    opacity: 0.75
  }
};
var socials_map = (0, _ramda.indexBy)((0, _ramda.prop)("key"))(_const.socials);
var props = ["user$account"];
exports.props = props;
var funcs = ["unlinkAccount$acocount", "linkAccount$account"];
exports.funcs = funcs;

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
  }, (0, _ramda.compose)((0, _ramda.filter)(xNil), (0, _ramda.map)(function (v) {
    return (0, _ramda.includes)(v)(["authereum", "metamask"]) ? null : /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
      width: [1 / 2, null, 1 / 3, 1 / 2, 1 / 3],
      color: "white",
      p: 2,
      alignItems: "center"
    }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
      onClick: function onClick() {
        return props.unlinkAccount$account({
          provider: v,
          user: props.user$account
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
    }, "Unlink"))));
  }))((0, _ramda.keys)(props.user$account.links)), (0, _ramda.compose)((0, _ramda.map)(function (v) {
    return /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
      width: [1 / 2, null, 1 / 3, 1 / 2, 1 / 3],
      color: "white",
      p: 2,
      alignItems: "center"
    }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
      onClick: function onClick() {
        return props.linkAccount$account({
          provider: v,
          user: props.user$account
        });
      },
      flex: 1,
      p: 3,
      bg: socials_map[v].bg,
      sx: _objectSpread(_objectSpread({}, btn), {}, {
        borderRadius: "3px",
        opacity: 0.5
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
    }, "Link"))));
  }), (0, _ramda.filter)((0, _ramda.complement)(_ramda.includes)(_ramda.__, ["authereum", "metamask"])), (0, _ramda.difference)(_ramda.__, (0, _ramda.keys)(props.user$account.links)))((0, _ramda.pluck)("key")(methods)))));
};

exports.Component = Component;