let props = {}
const mergeProps = (name, obj) => {
  for (const k in obj) {
    props[`${k}$${name}`] = obj[k]
  }
}
mergeProps("core", require("@nextdapp/core").init)
mergeProps("util", require("@nextdapp/util").init)
mergeProps("firebase", require("@nextdapp/firebase").init)
mergeProps("account", require("../..").init)
export default props