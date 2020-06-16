let props = {}
const mergeProps = (name, obj) => {
  for (const k in obj) {
    props[`${k}$${name}`] = obj[k]
  }
}
import { default as util } from "@nextdapp/util/lib/init"
mergeProps("util", util)
import { default as firebase } from "@nextdapp/firebase/lib/init"
mergeProps("firebase", firebase)
import { default as account } from "../../lib/init"
mergeProps("account", account)
export default props