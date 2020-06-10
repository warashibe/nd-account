"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = exports.funcs = exports.props = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ramdam = _interopRequireDefault(require("ramdam"));

var _react = _interopRequireDefault(require("react"));

var _rebass = require("rebass");

var _const = require("../const");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var btn = {
  cursor: "pointer",
  ":hover": {
    opacity: 0.75
  }
};

var socials_map = _ramdam["default"].indexBy(_ramdam["default"].prop("key"))(_const.socials);

var props = ["user$account"];
exports.props = props;
var funcs = ["unlinkAccount$acocount", "linkAccount$account"];
exports.funcs = funcs;

var Component = function Component(props) {
  var methods = _ramdam["default"].isNil(props.methods) ? _const.socials : _ramdam["default"].filter(function (v) {
    return _ramdam["default"].includes(v.key)(props.methods);
  })(_const.socials);
  return /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    textAlign: "center"
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Box, {
    p: 3,
    width: 1
  }, /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
    width: 1,
    flexWrap: "wrap"
  }, _ramdam["default"].compose(_ramdam["default"].filter(_ramdam["default"].xNil), _ramdam["default"].map(function (v) {
    return _ramdam["default"].includes(v)(["authereum", "metamask"]) ? null : /*#__PURE__*/_react["default"].createElement(_rebass.Flex, {
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
  }))(_ramdam["default"].keys(props.user$account.links)), _ramdam["default"].compose(_ramdam["default"].map(function (v) {
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
  }), _ramdam["default"].filter(_ramdam["default"].complement(_ramdam["default"].includes)(_ramdam["default"].__, ["authereum", "metamask"])), _ramdam["default"].difference(_ramdam["default"].__, _ramdam["default"].keys(props.user$account.links)))(_ramdam["default"].pluck("key")(methods)))));
};

exports.Component = Component;