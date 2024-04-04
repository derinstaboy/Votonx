import type { NextPage } from "next";
import {
  Box, Button, Container, Flex, Heading, Stack, VStack,
} from "@chakra-ui/react";
import { Polygon } from "@thirdweb-dev/chains";
import { ConnectWallet, useAddress, useChainId, useSwitchChain, darkTheme } from "@thirdweb-dev/react";
import ClaimPage from "../components/VotonxClaim/Claim";
import WalletButton from "../components/Nav/ConnectWalletButton";



const Claim: NextPage = () => {

  const address = useAddress();
  const chainid = useChainId();
  const switchChain = useSwitchChain();

  if (!address) {
    return (
      <Container maxW={"1200px"} m="auto" textColor={"pt1"}>
        <VStack h={"100vh"} justifyContent={"center"} textAlign={"center"}>
          <Heading textColor={"#f0c415"}>Please Connect a Wallet</Heading>
          <WalletButton truncatedAddress={address ? address : ""} truncatedValue={address ? address : ""} address={address ? address : ""} />

        </VStack>
      </Container>
    );
  }

  if (chainid !== Polygon.chainId) {
    return (
      <Container maxW={"1200px"} m="auto" textColor={"pt1"}>
        <Stack h={"100vh"} justifyContent={"center"} textAlign={"center"}>
          <Heading textColor={"#f0c415"}>Switch to Polygon Network</Heading>
          <Button variant="primary" size={"lg"} onClick={() => switchChain(Polygon.chainId)}>
            Switch to Polygon
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Box
      p={4}
      bgSize={"cover"}
      h={{ lg: "100%vh" }}
      m="auto"
      justifyContent={"center"}
      w="100%"
    >
      <ClaimPage />
    </Box>
  );
};
export default Claim;
