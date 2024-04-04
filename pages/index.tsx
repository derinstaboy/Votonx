import type { NextPage } from "next";
import { Polygon } from "@thirdweb-dev/chains";
import { ConnectWallet, useAddress, useChainId, useSwitchChain, darkTheme } from "@thirdweb-dev/react";
import {
  Box, Button, Container, Flex, Heading, SimpleGrid, Image, Stack, VStack, Link, HStack
} from "@chakra-ui/react";
import { easeIn } from "framer-motion";
import WalletButton from "../components/Nav/ConnectWalletButton";



const Home: NextPage = () => {

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
      h={{ lg: "110vh" }}
      textAlign={"center"}
      m="auto"
    >
      <Stack direction={{base:"column", md: "column", lg: "row"}} justifyContent={{base: "center", lg:"space-between"}}>
        <Image src="/Banner.png" h={{ base: "170px", lg: "30%" }} w={{ base: "300px", lg: "30%" }} border={"2px"} borderRadius={"md"} _hover={{
          boxShadow: "2xl",
          transform: "scale(1.1)", // Apply scaling on hover
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Add cubic bezier transition
        }}
          transition="transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Add cubic bezier transition
          justifyContent={{base:"center", md:"left", lg:"left"}}
          m="auto"
        />
        <Heading m="auto" textAlign={"center"} textColor={"#f0c415"} fontSize={"7xl"}>Welcome to the Votonx DApp</Heading>
      </Stack>
      <SimpleGrid columns={{ base: 1, lg: 5 }} m="auto" justifyContent={"center"} w={"100%"} mt={10} spacing={4}>
        <Box h={175} w={175} m="auto" _hover={{
          boxShadow: "2xl",
          transform: "scale(1.1)", // Apply scaling on hover
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Add cubic bezier transition
        }}
          transition="transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Add cubic bezier transition
        >
          <VStack>
            <Image src="/VTNX.png" h="50" w="50" />

            <Heading textColor="white" fontSize={"xl"}>
              Get $VTNX for your $MATIC!            </Heading>
            <Button as={Link} href="/Swap">
              Swap Now
            </Button>
          </VStack>
        </Box>

        <Box h={175} w={175} m="auto" _hover={{
          boxShadow: "2xl",
          transform: "scale(1.1)", // Apply scaling on hover
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Add cubic bezier transition
        }}
          transition="transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Add cubic bezier transition
        >
          <VStack>
            <Image src="/VTNX.png" h="50" w="50" />

            <Heading textColor="white" fontSize={"xl"}>
              Read the whitepaper
            </Heading>
            <Button as={Link} target="_blank" href="https://votonx.com/wp-content/uploads/2023/05/WP-Final-Corrected.pdf">
              Visit Now
            </Button>
          </VStack>
        </Box>

        <Box h={175} w={175} m="auto" _hover={{
          boxShadow: "2xl",
          transform: "scale(1.1)", // Apply scaling on hover
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Add cubic bezier transition
        }}
          transition="transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Add cubic bezier transition
        >
          <VStack>
            <Image src="/VTNX.png" h="50" w="50" />

            <Heading textColor="white" fontSize={"xl"}>
              View the contract
            </Heading>
            <Button as={Link} target="_blank" href="https://polygonscan.com/token/0x3d1b34db20dd01A5e744Fb44a086b34c963aB7De">
              View Now
            </Button>
          </VStack>
        </Box>

        <Box h={175} w={175} m="auto" _hover={{
          boxShadow: "2xl",
          transform: "scale(1.1)", // Apply scaling on hover
          transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Add cubic bezier transition
        }}
          transition="transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Add cubic bezier transition
        >
          <VStack>
            <Image src="/VTNX.png" h="50" w="50" />

            <Heading textColor="white" fontSize={"xl"}>
              See the chart
            </Heading>
            <Button as={Link} href="/Chart">
              Dive in
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
export default Home;
