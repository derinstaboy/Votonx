import React, { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, VStack, Text } from "@chakra-ui/react";
import { FaTwitter, FaTelegram, FaDiscord } from "react-icons/fa";
import { SiX } from "react-icons/si";  // Importing the X logo

interface SocialFollowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFollowComplete: () => void;
}

const SocialFollowModal: React.FC<SocialFollowModalProps> = ({ isOpen, onClose, onFollowComplete }) => {
  const [followedTwitter, setFollowedTwitter] = useState(false);
  const [followedTelegram, setFollowedTelegram] = useState(false);
  const [followedDiscord, setFollowedDiscord] = useState(false);
  const [followedMagneticMiles, setFollowedMagneticMiles] = useState(false);

  useEffect(() => {
    const checkAllFollowed = () => {
      if (followedTwitter && followedTelegram && followedDiscord && followedMagneticMiles) {
        onFollowComplete();
      }
    };
    checkAllFollowed();
  }, [followedTwitter, followedTelegram, followedDiscord, followedMagneticMiles, onFollowComplete]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Follow Our Socials</ModalHeader>
        <ModalBody>
          <VStack spacing="4" align="center">
            <Text>Please ensure to follow our socials before staking:</Text>
            <Button
              leftIcon={<SiX />}
              colorScheme="twitter"
              onClick={() => {
                window.open("https://twitter.com/VotonxEnergy", "_blank");
                setFollowedTwitter(true);
              }}
            >
              Twitter
            </Button>
            <Button
              leftIcon={<FaTelegram />}
              colorScheme="telegram"
              onClick={() => {
                window.open("https://t.me/votonx", "_blank");
                setFollowedTelegram(true);
              }}
            >
              Telegram
            </Button>
            <Button
              leftIcon={<FaDiscord />}
              bg="#7289da"
              color="white"
              _hover={{ bg: "#5a6ea3" }}
              onClick={() => {
                window.open("https://discord.com/invite/3jQkXK9BJM", "_blank");
                setFollowedDiscord(true);
              }}
            >
              Discord
            </Button>
            <Button
              leftIcon={<SiX />}
              colorScheme="blue"
              onClick={() => {
                window.open("https://x.com/MagneticMLLC", "_blank");
                setFollowedMagneticMiles(true);
              }}
            >
              Magnetic Miles
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>
            {followedTwitter && followedTelegram && followedDiscord && followedMagneticMiles ? "Done" : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SocialFollowModal;
