const path = require("path")
import { apiSteemOauth } from "../../.."
import conf from "nd/conf"
export default apiSteemOauth({ conf: conf })