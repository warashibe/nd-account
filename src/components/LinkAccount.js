import R from "ramdam"
import React from "react"
import { Box, Flex, Text, Image, Button } from "rebass"
import { socials } from "../const"
const btn = { cursor: "pointer", ":hover": { opacity: 0.75 } }
const socials_map = R.indexBy(R.prop("key"))(socials)

export const props = ["user$account"]
export const funcs = ["unlinkAccount$acocount", "linkAccount$account"]
export const Component = props => {
  const methods = R.isNil(props.methods)
    ? socials
    : R.filter(v => {
        return R.includes(v.key)(props.methods)
      })(socials)

  return (
    <Flex textAlign="center">
      <Box p={3} width={1}>
        <Flex width={1} flexWrap="wrap">
          {R.compose(
            R.filter(R.xNil),
            R.map(
              v =>
                R.includes(v)(["authereum", "metamask"]) ? null : (
                  <Flex
                    width={[1 / 2, null, 1 / 3, 1 / 2, 1 / 3]}
                    color="white"
                    p={2}
                    alignItems="center"
                  >
                    <Box
                      onClick={() =>
                        props.unlinkAccount$account({
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
          )(R.keys(props.user$account.links))}
          {R.compose(
            R.map(v => (
              <Flex
                width={[1 / 2, null, 1 / 3, 1 / 2, 1 / 3]}
                color="white"
                p={2}
                alignItems="center"
              >
                <Box
                  onClick={() =>
                    props.linkAccount$account({
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
            R.filter(R.complement(R.includes)(R.__, ["authereum", "metamask"])),
            R.difference(R.__, R.keys(props.user$account.links))
          )(R.pluck("key")(methods))}
        </Flex>
      </Box>
    </Flex>
  )
}
