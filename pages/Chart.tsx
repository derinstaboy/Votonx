
import { NextPage } from 'next';
import { Polygon } from "@thirdweb-dev/chains";
import { ConnectWallet, useAddress, useChainId, useSwitchChain, darkTheme } from "@thirdweb-dev/react";
import {
    Box, Button, Container, Flex, Heading, Stack, VStack,
} from "@chakra-ui/react";
import WalletButton from '../components/Nav/ConnectWalletButton';
import SwapFull from '../components/Swap/SwapFullComponent';



const Chart: NextPage = () => {

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
            h={{ base: "100vh", md: "100vh", lg: "100vh" }}
            m="auto"
            justifyContent={"center"}
        >

            <VStack display={{ base: "none", lg: "flex" }}><iframe src="https://dexscreener.com/polygon/0xd639DEEC02d09D18C28DC5DdC7F91a348e3dCEA7?embed=1&theme=dark" height={"600px"} width="750px"></iframe></VStack>
            <VStack display={{ base: "flex", lg: "none" }} mt={10}><iframe src="https://dexscreener.com/polygon/0xd639DEEC02d09D18C28DC5DdC7F91a348e3dCEA7?embed=1&theme=dark" height={"600px"} width="350px"></iframe></VStack>        </Box>
    );
};
export default Chart;