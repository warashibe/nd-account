"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.props = exports.Component = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _rebass = require("rebass");

var _const = require("../const");

var _ramda = require("ramda");

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
  return /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    justifyContent: "center",
    flexWrap: "wrap",
    px: 3
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    width: 1,
    textAlign: "center"
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
    mt: 2,
    width: "300px",
    src: props.uport$account.qr
  })), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    textAlign: "center",
    mb: 3,
    width: 1
  }, "Scan QR Code with your uPort App."), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    textAlign: "center",
    mb: 3,
    width: 1
  }, "You need a crypto-antique certificate for testnet. Get one", " ", /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    as: "a",
    target: "_blank",
    href: "https://testnet-ssi.warashibe.market/"
  }, "here"), "."), /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    width: 1,
    px: 3,
    justifyContent: "center",
    alignItems: "flex-start"
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    flex: 1,
    color: "white",
    height: "38px",
    mx: 2,
    bg: socials_map["uport"].bg,
    sx: _objectSpread(_objectSpread({}, btn), {}, {
      borderRadius: "3px"
    }),
    onClick: function onClick() {
      props.set(null, "uport$account");
    },
    justifyContent: "center",
    alignItems: "center"
  }, "Back"), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    sx: _objectSpread({}, btn),
    as: "a",
    href: "https://play.google.com/store/apps/details?id=com.uportMobile&hl=ja",
    target: "_blank",
    mx: 2
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
    src: "/static/account/images/android.svg"
  })), /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    sx: _objectSpread({}, btn),
    as: "a",
    href: "https://itunes.apple.com/jp/app/uport-id/id1123434510?mt=8",
    target: "_blank",
    mx: 2
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Image, {
    src: "/static/account/images/apple.svg"
  }))));
};

exports.Component = Component;
var props = ["uport$account"];
exports.props = props;