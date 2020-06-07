import bind from "nd/bind"
import { useState, Fragment, useEffect } from "react"
import { fb, isFirebase } from "@nextdapp/firebase"
import R from "ramdam"
import Login from "nd/account/Login"
import UPort from "nd/account/UPort"

export default bind(
  props => {
    useEffect(() => {
      isFirebase(props.conf).then(() => {
        props.changeUser$account()
      })
    }, [])
    useEffect(
      () => {
        if (R.hasPath(["router", "query", "code"])(props)) {
          isFirebase(props.conf).then(() => {
            props.check_alis$account({ router: props.router })
          })
        }
      },
      [props.router.query]
    )
    return R.isNil(props.user$account) ? (
      R.xNil(props.uport$account) ? (
        <UPort />
      ) : (
        <Login />
      )
    ) : (
      <Fragment>
        <div
          onClick={() => {
            props.logout$account()
          }}
        >
          logout
        </div>
        <div>{props.user$account.name}</div>
      </Fragment>
    )
  },
  ["user$account", "uport$account", "processing$util"],
  [
    "changeUser$account",
    "login$account",
    "logout$account",
    "check_alis$account"
  ]
)
