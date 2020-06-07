const { Credentials } = require("uport-credentials")
const message = require("uport-transports").message.util
const transports = require("uport-transports").transport
const decodeJWT = require("did-jwt").decodeJWT
const { parse } = require("url")
const R = require("ramdam")
require("isomorphic-fetch")
import { Resolver } from "did-resolver"
import { getResolver } from "ethr-did-resolver"

export default ({ conf }) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Content-Type", "application/json")

  const providerConfig = { rpcUrl: process.env.UPORT_RPCURL }
  const rs = getResolver(providerConfig)
  const credentials = new Credentials({
    appName: conf.uport.appName,
    did: conf.uport.did,
    privateKey: process.env.UPORT_PRIVATE_KEY,
    resolver: new Resolver({ ...rs })
  })
  const { query } = parse(req.url, true)
  let callbackUrl = `https://us-central1-${
    conf.firebase.id
  }.cloudfunctions.net/loginUport_account?id=${query.id}`
  if (R.xNil(query.uid)) {
    callbackUrl += `&uid=${query.uid}`
  }
  let obj = {
    notifications: true,
    verified: [conf.uport.verified],
    callbackUrl: callbackUrl
  }
  console.log(obj)
  const requestToken = await credentials.createDisclosureRequest(obj)
  const uri = message.paramsToQueryString(message.messageToURI(requestToken), {
    callback_type: "post"
  })
  const qr = transports.ui.getImageDataURI(uri)
  res.end(JSON.stringify({ qr: qr, uri: uri }))
}
