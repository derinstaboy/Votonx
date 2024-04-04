import { Button, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { ConnectWallet, NATIVE_TOKEN_ADDRESS, darkTheme, lightTheme, useAddress, useBalance, Theme } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { FaWallet } from "react-icons/fa";

interface WalletButtonProps {
    truncatedAddress: string;
    truncatedValue: string;
    address: string | undefined;
}

const lightThemeConfig = lightTheme({
    fontFamily: "Rubik, sans-serif",
    colors: {
        modalBg: "#82C8E2",
        accentText: "#0F0F0F",
        danger: "Hi",
        borderColor: "#0F0F0F",
        secondaryIconColor: "#0F0F0F",
        accentButtonText: "#0F0F0F",
        secondaryButtonText: "#0F0F0F",
        primaryButtonText: "#0F0F0F",
        dropdownBg: "#9D9B86",
        primaryText: "#0F0F0F",
        secondaryText: "#0F0F0F",
        skeletonBg: "#0F0F0F",
        walletSelectorButtonHoverBg: "#ECC87A",
        primaryButtonBg: "#9D9B86",
    },
})



const darkThemeConfigOG = darkTheme({
    fontFamily: "Rubik, sans-serif",
    colors: {
        modalBg: "#82C8E2",
        accentText: "#white",
        danger: "Hi",
        accentButtonBg: "white",
        borderColor: "white",
        secondaryIconColor: "white",
        accentButtonText: "white",
        dropdownBg: "#82C8E2",
        primaryText: "white",
        secondaryText: "#white",
        skeletonBg: "white",
        walletSelectorButtonHoverBg: "#82C8E2",
        secondaryButtonText: "white",
        primaryButtonText: "white",
        primaryButtonBg: "#82C8E2",
    },
})

const WalletButton: React.FC<WalletButtonProps> = ({ truncatedAddress, truncatedValue, address }) => (

    <Button
        boxShadow={"dark-lg"}
        variant="primary"
        size="lg"
        as={ConnectWallet}
        dropdownPosition={{ side: "bottom", align: "start" }}
        btnTitle="Connect to VTNX"
        modalTitle="Select a wallet to connect"
        theme={useColorModeValue(lightThemeConfig, darkThemeConfigOG)}
        welcomeScreen={{
            title: "VTNX",
            subtitle: `Welcome to the Votonx DApp. Please choose a wallet to connect and sign in.`,
            img: {
                src: "/Logo.png",
                width: 300,
                height: 300,
            },
        }}
        modalTitleIconUrl="/Logo.png"
        switchToActiveChain={true}
        detailsBtn={() => {
            return (
                <Button
                    p={2}
                    transition="all 0.3s"
                    _hover={{ transform: "scale(1.02)" }}
                    _active={{ transform: "scale(0.98)" }}
                    variant="primary"
                    size="lg"
                >
                    <VStack gap={-4}>
                        <HStack>
                            <Text
                                textAlign="center"
                                fontSize={{ base: "sm", md: "sm" }}
                            >
                                {truncatedAddress}
                            </Text>
                            <FaWallet />
                        </HStack>
                        <Text
                            fontSize={{ base: "sm", md: "sm" }}
                            textAlign="center"
                        >
                            {truncatedValue}
                        </Text>
                    </VStack>
                </Button>
            );
        }}
    />
);

export default WalletButton;
