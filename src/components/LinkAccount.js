import {
  map,
  __,
  indexBy,
  prop,
  hasPath,
  compose,
  filter,
  values,
  mapObjIndexed,
  includes,
  complement,
  pluck,
  isNil,
  keys,
  difference
} from "ramda"
const xNil = complement(isNil)

import React from "react"
import { Box, Flex, Text, Image, Button } from "rebass"
import { socials } from "../const"
const btn = { cursor: "pointer", ":hover": { opacity: 0.75 } }
const socials_map = indexBy(prop("key"))(socials)

export const props = [
  "user$account",
  "unlinkAccount$account",
  "linkAccount$account"
]
export const Component = props => {
  const fn = props.init()
  console.log(fn)
  const methods = isNil(props.methods)
    ? socials
    : filter(v => {
        return includes(v.key)(props.methods)
      })(socials)

  return (
    <Flex textAlign="center">
      <Box p={3} width={1}>
        <Flex width={1} flexWrap="wrap">
          {compose(
            filter(xNil),
            map(
              v =>
                includes(v)(["authereum", "metamask"]) ? null : (
                  <Flex
                    width={[1 / 2, null, 1 / 3, 1 / 2, 1 / 3]}
                    color="white"
                    p={2}
                    alignItems="center"
                  >
                    <Box
                      onClick={() =>
                        fn.unlinkAccount$account({
                          provider: v,
                          user: props.user$account
                        })
                      }
                      flex={1}
                      p={3}
                      bg={socials_map[v].bg}
                      sx={{ ...btn, borderRadius: "3px" }}
                    >
                      <Image
                        src={`/static/account/images/${
                          socials_map[v].key
                        }-white.png`}
                        height={["50px"]}
                      />
                      <Text mt={1}>
                        <Box fontSize="18px" fontWeight="bold">
                          {socials_map[v].name}
                        </Box>
                        <Box as="span" fontSize="12px">
                          Unlink
                        </Box>
                      </Text>
                    </Box>
                  </Flex>
                )
            )
          )(keys(props.user$account.links))}
          {compose(
            map(v => (
              <Flex
                width={[1 / 2, null, 1 / 3, 1 / 2, 1 / 3]}
                color="white"
                p={2}
                alignItems="center"
              >
                <Box
                  onClick={() =>
                    fn.linkAccount$account({
                      provider: v,
                      user: props.user$account
                    })
                  }
                  flex={1}
                  p={3}
                  bg={socials_map[v].bg}
                  sx={{ ...btn, borderRadius: "3px", opacity: 0.5 }}
                >
                  <Image
                    src={`/static/account/images/${
                      socials_map[v].key
                    }-white.png`}
                    height={["50px"]}
                  />
                  <Text mt={1}>
                    <Box fontSize="18px" fontWeight="bold">
                      {socials_map[v].name}
                    </Box>
                    <Box as="span" fontSize="12px">
                      Link
                    </Box>
                  </Text>
                </Box>
              </Flex>
            )),
            filter(complement(includes)(__, ["authereum", "metamask"])),
            difference(__, keys(props.user$account.links))
          )(pluck("key")(methods))}
        </Flex>
      </Box>
    </Flex>
  )
}
