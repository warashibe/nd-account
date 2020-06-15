import bind from "nd/bind"
import { useState, Fragment, useEffect } from "react"
import { fb, isFirebase } from "@nextdapp/firebase"
import { complement, prop, hasPath, isNil, indexBy } from "ramda"
const xNil = complement(isNil)
import Login from "nd/account/Login"
import UPort from "nd/account/UPort"
import Profile from "nd/account/Profile"
import LinkAccount from "nd/account/LinkAccount"
import { Box, Flex, Text, Image, Button } from "rebass"
import { socials } from "../.."
const btn = { cursor: "pointer", ":hover": { opacity: 0.75 } }
const socials_map = indexBy(prop("key"))(socials)

export default bind(
  props => {
    const fn = props.init()
    useEffect(() => {
      isFirebase(props.conf).then(() => {
        fn.changeUser$account()
      })
    }, [])
    useEffect(
      () => {
        if (hasPath(["router", "query", "code"])(props)) {
          isFirebase(props.conf).then(() => {
            fn.check_alis$account({ router: props.router })
          })
        }
      },
      [props.router.query]
    )
    return isNil(props.user$account) ? (
      xNil(props.uport$account) ? (
        <UPort />
      ) : (
        <Login />
      )
    ) : (
      <Fragment>
        <Flex
          flexWrap="wrap"
          sx={{ position: "relative", minHeight: props.innerHeight$nav }}
        >
          <Box width={[1, null, null, 1 / 2]}>
            <Profile />
          </Box>
          <Box width={[1, null, null, 1 / 2]}>
            <LinkAccount />
          </Box>
        </Flex>
      </Fragment>
    )
  },
  [
    "user$account",
    "uport$account",
    "processing$util",

    "changeUser$account",
    "check_alis$account",
    "linkAccount$account",
    "unlinkAccount$account"
  ]
)
