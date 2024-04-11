import {
    Box, Button, Flex, Heading, Image, Input, Spinner, Text, VStack, useToast, useColorModeValue
} from "@chakra-ui/react";
import SwapInput from "./SwapInput";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
    useAddress, useBalance, useContract, useContractRead, useContractWrite, useTokenBalance
} from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";
import { VTNX_DEX_CONTRACT, VTNX_TOKEN, WMATIC_AD, USDC_AD } from "../../Consts/Addresses";
import VTNX_DEX_ABI from "../../Consts/ABIS/VTNXDex.json";
import VTNX_ABI from "../../Consts/ABIS/VTNXToken.json";
import WalletButton from "../Nav/ConnectWalletButton";

export default function SwapFull() {
    const toast = useToast();
    const address = useAddress();
    const { contract: dexContract } = useContract(VTNX_DEX_CONTRACT, VTNX_DEX_ABI);
    const { data: nativeBalance } = useBalance();
    const { contract: tokenContract } = useContract(VTNX_TOKEN, VTNX_ABI);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);

    const [fromToken, setFromToken] = useState(WMATIC_AD); 
    const [toToken, setToToken] = useState(VTNX_TOKEN);
    const [amount, setAmount] = useState('0');
    const [outputAmount, setOutputAmount] = useState('0');
    const [isApproved, setIsApproved] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch output token amount
    const fetchOutputAmount = async () => {
        if (fromToken === WMATIC_AD) {
            const maticVtnxPath = [WMATIC_AD, VTNX_TOKEN];
            const amountInWei = ethers.utils.parseUnits(amount, 18);
            const amountsOut = await dexContract.call("getOutputTokenAmount", [amountInWei, maticVtnxPath]);
            setOutputAmount(ethers.utils.formatUnits(amountsOut[amountsOut.length - 1], 18));
        } else {
            const vtnxMaticPath = [VTNX_TOKEN, WMATIC_AD];
            const amountInWei = ethers.utils.parseUnits(amount, 18);
            const amountsOut = await dexContract.call("getOutputTokenAmount", [amountInWei, vtnxMaticPath]);
            setOutputAmount(ethers.utils.formatUnits(amountsOut[amountsOut.length - 1], 18));
        }
    };

    useEffect(() => {
        if(amount !== '0') {
            fetchOutputAmount();
        }
    }, [amount, fromToken, toToken]);

    // Check token allowance
    const checkTokenAllowance = async () => {
        if (fromToken === VTNX_TOKEN) {
            const allowance = await tokenContract.call("allowance", [address, VTNX_DEX_CONTRACT]);
            return ethers.utils.formatUnits(allowance, 18) >= amount;
        }
        return true;
    };

    // Handle token approval
    const handleApproval = async () => {
        setLoading(true);
        try {
            const amountInWei = ethers.utils.parseUnits(amount, 18);
            await tokenContract.functions.approve(VTNX_DEX_CONTRACT, amountInWei);
            setIsApproved(true);
            toast({ title: "Approval Successful", description: "Token spending approved.", status: "success" });
        } catch (error) {
            toast({ title: "Approval Failed", description: error.message, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Execute swap
    const executeSwap = async () => {
        setLoading(true);
        try {
            const isApproved = await checkTokenAllowance();
            if (!isApproved) {
                await handleApproval();
            }
            const amountInWei = ethers.utils.parseUnits(amount, 18);
            const swapArgs = {
                args: [fromToken, toToken, amountInWei],
                overrides: {}
            };
            if (fromToken === WMATIC_AD) {
                swapArgs.overrides = { value: amountInWei };
            }
            await dexContract.functions.swapTokens(swapArgs);
            toast({ title: "Swap Successful", description: "Tokens swapped successfully.", status: "success" });
        } catch (error) {
            toast({ title: "Swap Failed", description: error.message, status: "error" });
        } finally {
            setLoading(false);
        }
    };



    const resetInputValues = () => {
        setNativeValue("0");
        setTokenValue("0");
    };


    const amountToSwap = Number(currentFrom === "native" ? nativeValue : tokenValue); // Updated line

    const bottomBoxOutput =
        currentFrom === "native"
            ? isLoadinggetOutputTokenAmountMaticToVTNX
                ? "0"
                : getOutputTokenAmountMaticToVTNX
                    ? parseFloat(
                        ethers.utils.formatUnits(getOutputTokenAmountMaticToVTNX, 18)
                    ).toFixed(8)
                    : "0"
            : isLoadinggetOutputTokenAmountVTNXtoMatic
                ? "0"
                : getOutputTokenAmountVTNXtoMatic
                    ? parseFloat(
                        ethers.utils.formatUnits(getOutputTokenAmountVTNXtoMatic, 18)
                    ).toFixed(8)
                    : "0";



    return (
        <VStack
            p="4"
            m={"auto"}
            maxW={{ base: "360", md: "360" }}
            w="full"
            borderRadius="2xl"
            borderWidth="8px"
            borderColor={"#f0c415"}
            boxShadow="2xl"
            mt={{ base: 4, lg: 10 }}
            textAlign={"center"}
            textColor="#f0c415"
            bg="black"
        >
            <HStack justifyContent={"center"} m="auto" textAlign={"center"} alignContent={"center"}>
                <Heading textAlign={"center"} justifyContent={"center"} m="auto" alignContent={"center"}>Swap</Heading>{" "}
                <Image boxShadow="2xl" borderRadius="100%" justifyContent={"center"} m="auto" textAlign={"center"} alignContent={"center"} src={currentFrom === "token" ? "/Logo.png" : "/Matic.png"} w="7" h="7" />
                <Text justifyContent={"center"} m="auto" textAlign={"center"} alignContent={"center"}>And </Text>
                <Image justifyContent={"center"} borderRadius="100%" m="auto" textAlign={"center"} alignContent={"center"} boxShadow="2xl" src={currentFrom === "native" ? "/Logo.png" : "/matic.png"} w="7" h="7" />
            </HStack>
            <VStack textAlign="center">
<Text justifyContent={"center"} m="auto" textAlign={"center"} alignContent={"center"}>MATIC to VTNX swap function only at this time. </Text>

                
                <Text>You will receive approx <Text textColor="white">{Number(bottomBoxOutput)} {currentFrom === "native" ? "VTNX" : "MATIC"}</Text>
                </Text>
            </VStack>
            <Flex
                direction={currentFrom === "native" ? "column" : "column-reverse"}
                gap="3"
                p={4}
            >
                {currentFrom === "native" ? (
                    <SwapInput
                        current={currentFrom}
                        type="native"
                        display=""
                        max={nativeBalance?.displayValue}
                        value={nativeValue}
                        //@ts-ignore
                        placeholder={currentFrom === "token" ? (Number(bottomBoxOutput) * taxMultiplier).toString() : "0"}
                        placeholder2={(Number(bottomBoxOutput) * taxMultiplier).toString()}
                        setValue={setNativeValue}
                        tokenImage={"/matic.png"}
                        balance={nativeBalance?.displayValue}
                    />
                ) : (

                    <SwapInput
                        current={currentFrom}
                        type="token"
                        display=""
                        max={nativeBalance?.displayValue}
                        value={outputAmount}
                        placeholder={currentFrom === "token" ? (Number(bottomBoxOutput) * taxMultiplier).toString() : "0"}
                        placeholder2={(Number(bottomBoxOutput) * taxMultiplier).toString()}
                        setValue={setNativeValue}
                        tokenImage={"/matic.png"}
                        balance={nativeBalance?.displayValue}
                    />
                )}
                <Button
                    onClick={() => {
                        setCurrentFrom(currentFrom === "native" ? "token" : "native");
                        resetInputValues();
                    }}
                    w={"35%"}
                    m="auto"
                    variant="primary"
                    boxShadow="2xl"
                    bg={useColorModeValue("pt1", "pt4")}

                >
                    ↓
                </Button>
                {currentFrom === "token" ? (
                    <SwapInput
                        current={currentFrom}
                        display=""
                        type="token"
                        max={tokenBalance?.displayValue}
                        value={tokenValue}
                        setValue={setTokenValue}
                        tokenImage={"/Logo.png"}
                        //@ts-ignore
                        placeholder={currentFrom === "native" ? (Number(bottomBoxOutput) * taxMultiplier).toString() : "0"}
                        placeholder2={(Number(bottomBoxOutput) * taxMultiplier).toString()}
                        balance={tokenBalance?.displayValue}
                    />

                ) : (
                    <SwapInput
                        display={""}
                        current={currentFrom}
                        type="native"
                        max={tokenBalance?.displayValue}
                        value={outputAmount}
                        setValue={setTokenValue}
                        tokenImage={"/Logo.png"}
                        placeholder={currentFrom === "native" ? (Number(bottomBoxOutput) * taxMultiplier).toString() : "0"}
                        placeholder2={(Number(bottomBoxOutput) * taxMultiplier).toString()}
                        balance={tokenBalance?.displayValue}
                    />
                )}
            </Flex>
            {address && !isApproved ? (
                <Button onClick={handleApproval} disabled={loading}>
                    {loading ? <Spinner /> : "Approve Tokens"}
                </Button>
            ) : null}
            {address && isApproved ? (
                <Button onClick={executeSwap} disabled={loading}>
                    {loading ? <Spinner /> : "Execute Swap"}
                </Button>
            ) : (
                <WalletButton truncatedAddress="" address="" truncatedValue="" />
            )}
        </VStack>
    );
}
