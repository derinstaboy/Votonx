import {
  Flex,
  Image,
  IconButton,
  Heading,
  HStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
  Stack,
  ButtonGroup,
  Divider,
  Box,
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionItem,
  AccordionIcon,
  SimpleGrid,
  Text,

  useTheme
} from "@chakra-ui/react";
import { ConnectWallet, NATIVE_TOKEN_ADDRESS, useAddress, useBalance, useSwitchChain, darkTheme } from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react"; // Include useMemo here

import reDirects from "./Redirects"; // Import the navigation items array
import { ethers } from "ethers";
import { motion } from "framer-motion";

import { VTNX_TOKEN } from "../../Consts/Addresses";
import WalletButton from "./ConnectWalletButton";


interface HeaderProps {
  bgIm: string;
}



const Header: React.FC<HeaderProps> = ({
  bgIm,
}) => {
  const address = useAddress();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const switchChain = useSwitchChain();
  const { data: nativeTokenData, isLoading } = useBalance(NATIVE_TOKEN_ADDRESS);
  const MotionBox = motion(Box);
  const theme = useTheme();

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  let truncatedValue = "";
  if (nativeTokenData?.value) {
    const formattedValue = ethers.utils.formatUnits(nativeTokenData.value, 18);
    truncatedValue = `${formattedValue.split(".")[0]} ${nativeTokenData.symbol
      }`; // Add symbol after truncated value
  }
  const { data: VTNX } = useBalance(VTNX_TOKEN)


  return (
    <HStack
      as="header"
      justify="space-between"
      align="center"
      p="1"
      color={"white"}
      bg={bgIm}
      bgSize={"cover"}
      textColor="white"
    >
      <Flex align="center" p={2}>
        <Image
          as={Button}
          bgImg={"/Logo.png"}
          alt="Logo"
          h={"70px"}
          w={"70px"}
          bgSize={"cover"}
          borderRadius={"100%"}
          onClick={onOpen}
          mr={5}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          size={{ base: "xs", lg: "sm" }}
        >
          <DrawerOverlay />
          <DrawerContent
  bg={`rgba(0, 0, 0, 0.7)`} // Dark overlay with reduced opacity
  backdropFilter="blur(4px)" // Optional: Adds a blur effect to the background
  textColor={"white"}
>
            <DrawerHeader bgSize={"cover"} p={2}>
              <HStack justifyContent="space-between" p={1}>
                <HStack>
                  <Button variant="primary" size="sm" as={"a"} href={"/"}>
                    <Text>Return Home</Text>
                  </Button>
                  <Button
                    variant="primary" size="sm" onClick={onClose}
                  >
                    Go back
                  </Button>
                </HStack>
              </HStack>
              <Divider />

              <HStack p={4}>
                <Stack direction={"row"}>
                  <Image onClick={onClose} src={"/Logo.png"} h={"50px"} w={"50px"} borderRadius="3xl" />
                  <WalletButton truncatedAddress={address ? truncatedAddress : ""} truncatedValue={address ? truncatedValue : ""} address={address ? address : ""} />
                </Stack>
              </HStack>
            </DrawerHeader>
            <Divider />
            <DrawerBody>


              <Accordion allowToggle bg="transparent" gap={4}>
                {reDirects.map((item, index) => (
                  <AccordionItem my={4} bg="transparent" key={index}>
                    {({ isExpanded }) => (
                      <>
                        <AccordionButton
                          key={index}
                          _hover={{
                            transform: "scale(1.05)",
                          }}
                          _active={{
                            transform: "scale(1.02)",
                          }}
                          p={2}
                          justifyContent={"space-between"}
                        >
                          <Stack direction="row" w="100%" justifyContent={"space-between"}>
                            <Text>
                              {item.label}
                            </Text>
                            <AccordionIcon />
                          </Stack>
                        </AccordionButton>

                        <AccordionPanel bg="transparent">
                          {item.subpages && (
                            <SimpleGrid columns={2} gap={2} bg="transparent" mt={4}>
                              {item.subpages.map((subpage, subIndex) => (
                                <Button variant="primary" w="100%" size="sm" as={"a"} target={item.href.includes("https://") || item?.href2?.includes("https://") ? "_blank" : "_self"} href={subpage === "/" ? (subpage === "/" ? item.href : `${subpage}`) : (subpage === "/Votonx" ? item.href : item.href2)}
                                  key={subIndex}>
                                  <Text>{subpage === "/" ? `${item.label}` : subpage.replace(/^\//, "")}</Text>
                                </Button>
                              ))}
                            </SimpleGrid>
                          )}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                ))}
                <AccordionItem bgImg={"/VotonxTextLogo.png"} h="100" w="100" bgSize={"cover"}>
                  <AccordionPanel />
                </AccordionItem>
              </Accordion>



            </DrawerBody>
            <Divider />
            <DrawerFooter
              textColor={"white"}
              justifyContent="space-between"
              alignItems={"left"}
            >
              <HStack>
                <Image src="/VTNX.png" h="32px" w="32px" borderRadius="2xl" />
                <Text>{VTNX?.displayValue}</Text>
                <Text>${VTNX?.symbol}</Text>

              </HStack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Heading fontSize="md" color="white">
          Votonx
        </Heading>
      </Flex>
      <WalletButton truncatedAddress={address ? truncatedAddress : ""} truncatedValue={address ? truncatedValue : ""} address={address ? address : ""} />
    </HStack>
  );
};

export default Header;
