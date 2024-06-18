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
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onFollowComplete();
    }
  }, [timer, onFollowComplete]);

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
              }}
            >
              Twitter
            </Button>
            <Button
              leftIcon={<FaTelegram />}
              colorScheme="telegram"
              onClick={() => {
                window.open("https://t.me/votonx", "_blank");
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
              }}
            >
              Discord
            </Button>
            <Button
              leftIcon={<SiX />}
              colorScheme="blue"
              onClick={() => {
                window.open("https://x.com/MagneticMLLC", "_blank");
              }}
            >
              Magnetic Miles
            </Button>
            <Text>{timer} seconds</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SocialFollowModal;
