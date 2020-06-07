"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socials = void 0;
var socials = [{
  key: "github",
  name: "Github",
  bg: "#24292E",
  url: function url(v) {
    return "https://github.com/".concat(v.username);
  }
}, {
  key: "alis",
  name: "ALIS",
  bg: "#232538",
  url: function url(v) {
    return "https://alis.to/users/".concat(v.username);
  }
}, {
  key: "uport",
  name: "uPort",
  bg: "#5952FF"
}, {
  key: "facebook",
  name: "Facebook",
  bg: "#4267B2"
}, {
  key: "google",
  name: "Google",
  bg: "#3A7CEC"
}, {
  key: "twitter",
  name: "Twitter",
  bg: "#1DA1F2",
  url: function url(v) {
    return "https://twitter.com/".concat(v.username);
  }
}, {
  key: "steem",
  name: "Steem",
  bg: "#07D6AA",
  url: function url(v) {
    return "https://steemit.com/@".concat(v.username);
  }
}, {
  key: "metamask",
  name: "MetaMask",
  bg: "#F6851B"
}, {
  key: "authereum",
  name: "Authereum",
  bg: "#FF4C2F"
}];
exports.socials = socials;