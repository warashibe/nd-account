import { Box, Flex, Text, Image, Button } from "rebass"
import {
  indexBy,
  prop,
  hasPath,
  compose,
  filter,
  values,
  mapObjIndexed,
  includes,
  complement,
  isNil
} from "ramda"
const xNil = complement(isNil)
import React from "react"
import { socials } from "../const"
const socials_map = indexBy(prop("key"))(socials)
const btn = { cursor: "pointer", ":hover": { opacity: 0.75 } }
export const props = ["user$account", "logout$account", "deleteAccount$account"]
export const Component = props => {
  const fn = props.init()
  return (
    <Flex p={3} fontColor="#222">
      <Box width="100px">
        <Image src={`${props.user$account.image}`} width={1} />
      </Box>
      <Box flex={1} px={2}>
        <Box mx={2}>
          <Flex my={2} fontWeight="bold" alignItems="center">
            {props.user$account.name}
            {hasPath(["user$account", "links", "uport"])(props) ? (
              <Image
                ml={2}
                src={`/static/account/images/uport.png`}
                height="25px"
              />
            ) : null}
          </Flex>
          <Box lineHeight="120%" fontSize="14px">
            {props.user$account.description}
          </Box>
          <Box mt={2}>
            {compose(
              filter(xNil),
              values,
              mapObjIndexed(
                (v, k) =>
                  includes(k)([
                    "google",
                    "facebook",
                    "authereum",
                    "metamask",
                    "uport"
                  ]) ? null : (
                    <Box
                      m={1}
                      as="a"
                      href={
                        xNil(socials_map[k].url) ? socials_map[k].url(v) : null
                      }
                      target="_blank"
                    >
                      <Image
                        sx={{ ...btn }}
                        src={`/static/account/images/${k}.png`}
                        height="20px"
                      />
                    </Box>
                  )
              )
            )(props.user$account.links || {})}
          </Box>
        </Box>
        <Flex width={1} mt={2}>
          <Box p={2} width={0.5}>
            <Box
              textAlign="center"
              p={2}
              sx={{ ...btn, borderRadius: "3px" }}
              width={1}
              onClick={fn.logout$account}
              bg="orange"
              color="white"
            >
              Logout
            </Box>
          </Box>
          <Box p={2} width={0.5}>
            <Box
              textAlign="center"
              p={2}
              width={1}
              sx={{ ...btn, borderRadius: "3px" }}
              onClick={() => {
                if (confirm("Are you sure?")) {
                  fn.deleteAccount$account({
                    user: props.user$account
                  })
                }
              }}
              bg="tomato"
              color="white"
            >
              Delete
            </Box>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}
