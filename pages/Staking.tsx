import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Container, Heading, useDisclosure } from "@chakra-ui/react";
import StakingPools from "../components/Staking/StakingPools";
import SocialFollowModal from "../components/Staking/SocialFollowModal";

const Staking: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasFollowedSocials, setHasFollowedSocials] = useState<boolean>(false);

  useEffect(() => {
    const followedSocials = localStorage.getItem("followedSocials");
    if (!followedSocials) {
      onOpen();
    } else {
      setHasFollowedSocials(true);
    }
  }, [onOpen]);

  const handleFollowComplete = () => {
    localStorage.setItem("followedSocials", "true");
    setHasFollowedSocials(true);
  };

  return (
    <Container
      maxW="container.xl"
      py="8"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Heading as="h1" size="2xl" color="white" mb="8">Stake Your VTNX Tokens</Heading>
      {hasFollowedSocials && <StakingPools />}
      <SocialFollowModal isOpen={isOpen} onClose={onClose} onFollowComplete={handleFollowComplete} />
    </Container>
  );
};

export default Staking;
