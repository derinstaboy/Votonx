import {
    Box,
    HStack,
    Text,
    VStack,
    Image,
    useToast,
    Button,
    Spinner,
    Flex,
    Heading,
    Input,
    useColorModeValue,
} from "@chakra-ui/react";
import SwapInput from "./SwapInput";
import {
    toWei,
    useAddress,
    useBalance,
    useContract,
    useContractRead,
    useContractWrite,
    useTokenBalance,
} from "@thirdweb-dev/react";

import { useState } from "react";
import { Cronos, Polygon } from "@thirdweb-dev/chains";
import { ethers } from "ethers";
import {
    NULL_AD,
    VTNX_DEX_CONTRACT,
    VTNX_TOKEN,
    WMATIC_AD,
    USDC_AD,
} from "../../Consts/Addresses";
import VTNX_DEX_ABI from "../../Consts/ABIS/VTNXDex.json";
import VTNX_ABI from "../../Consts/ABIS/VTNXToken.json";
import WMATIC_ABI from "../../Consts/ABIS/WrappedToken.json";
import WalletButton from "../Nav/ConnectWalletButton";


export default function SwapFull() {
    const toast = useToast();
    const address = useAddress();

    const { contract: dexContract } = useContract(VTNX_DEX_CONTRACT, VTNX_DEX_ABI);
    const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance();

    const { contract: tokenContract } = useContract(VTNX_TOKEN, VTNX_ABI);
    const { data: tokenBalance, refetch: refetchTokenBalance } = useTokenBalance(tokenContract, address);

    const ACTIVE_CHAIN = Polygon;
    const vtnxAddress = VTNX_TOKEN;
    const nullAddress = NULL_AD;
    const nativeAddress = WMATIC_AD;
    const { data: symbol } = useContractRead(tokenContract, "symbol");


    const [amount, setAmount] = useState("");
    const [nativeValue, setNativeValue] = useState<string>("0");
    const [tokenValue, setTokenValue] = useState<string>("0");
    const [currentFrom, setCurrentFrom] = useState<string>("native");
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenA, setTokenA] = useState<string>("0");
    const [tokenB, setTokenB] = useState<string>("0");
    const percentToSwapAfterFee = 100

    const { mutateAsync: swapTokens } = useContractWrite(
        dexContract,
        "swapTokens"
    );

    const { mutateAsync: approveTokenSpending } = useContractWrite(
        tokenContract,
        "approve"
    );

    const vtnxMaticPath = [
        "0xf8D9CB7D8ce7d7bEdd8cEACF087f7adF1C9937Ad",
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    ];

    const maticVtnxPath = [
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        "0xf8D9CB7D8ce7d7bEdd8cEACF087f7adF1C9937Ad",
    ];

    const multiRouteMiddle = [
        WMATIC_AD,
        USDC_AD,
    ];

    const matic = nativeValue ? nativeValue : 0;
    const VTNX = tokenValue ? tokenValue : 0;

    const VTNXSwap = tokenValue ? Number(tokenValue) : 0;

    const vtnxSwapArg = VTNXSwap?.toString()
    const { mutateAsync: approveTokens, isLoading } = useContractWrite(
        dexContract,
        "approveTokens"
    );

    const {
        data: getOutputTokenAmountMaticToVTNX,
        isLoading: isLoadinggetOutputTokenAmountMaticToVTNX,
    } = useContractRead(dexContract, "getOutputTokenAmount", [
        ethers.utils.parseUnits(matic.toString(), 18),
        maticVtnxPath,
    ]);

    const {
        data: getOutputTokenAmountVTNXtoMatic,
        isLoading: isLoadinggetOutputTokenAmountVTNXtoMatic,
    } = useContractRead(dexContract, "getOutputTokenAmount", [
        ethers.utils.parseUnits(VTNX.toString(), 18),
        vtnxMaticPath,
    ]);

    const executeSwap = async () => {
        setLoading(true);
        const baseFee = ethers.utils.parseUnits("71", "gwei"); // Base fee in gwei
        const priorityFee = ethers.utils.parseUnits("40", "gwei"); // Priority fee in gwei
        const totalGasPrice = baseFee.add(priorityFee); // Total gas price = Base + Priority

        const transactionOverrides = {
            gasPrice: totalGasPrice
        };

        try {
            if (currentFrom === "native") {
                await swapTokens({
                    args: [nullAddress, vtnxAddress, toWei(nativeValue)],
                    overrides: { value: toWei(nativeValue), ...transactionOverrides },
                });
            } else {
                await approveTokenSpending({ args: [VTNX_DEX_CONTRACT, toWei(tokenValue)] });
                await swapTokens({
                    args: [vtnxAddress, nullAddress, toWei(tokenValue)],
                    overrides: transactionOverrides,
                });
            }
            toast({
                status: "success",
                title: "Swap Successful",
                description: `You have successfully swapped your ${symbol || "tokens"} to ${ACTIVE_CHAIN.nativeCurrency.symbol}.`,
            });
        } catch (err) {
            console.error(err);
            toast({
                status: "error",
                title: "Swap Failed",
                description:
                "There was an error performing the swap. Please try again.",
            });
        } finally {
            refetchNativeBalance();
            refetchTokenBalance();
            setLoading(false);
        }
    };


    const resetInputValues = () => {
        setNativeValue("0");
        setTokenValue("0");
    };


    const amountToSwap = (Number(currentFrom === "native" ? nativeValue : tokenValue) / 100) * percentToSwapAfterFee

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
                        placeholder2={(Number(bottomBoxOutput)).toString()}
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
                        value={(Number(bottomBoxOutput)).toString()}
                        placeholder={currentFrom === "token" ? (Number(bottomBoxOutput)).toString() : "0"}
                        placeholder2={(Number(bottomBoxOutput)).toString()}
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
                        placeholder2={(Number(bottomBoxOutput)).toString()}
                        balance={tokenBalance?.displayValue}
                    />

                ) : (
                    <SwapInput
                        display={""}
                        current={currentFrom}
                        type="native"
                        max={tokenBalance?.displayValue}
                        value={(Number(bottomBoxOutput)).toString()}
                        setValue={setTokenValue}
                        tokenImage={"/Logo.png"}
                        placeholder={currentFrom === "native" ? (Number(bottomBoxOutput)).toString() : "0"}
                        placeholder2={(Number(bottomBoxOutput)).toString()}
                        balance={tokenBalance?.displayValue}
                    />
                )}
            </Flex>
            {address ? (
                <Button
                    onClick={executeSwap}
                    py="7"
                    fontSize="2xl"
                    rounded="xl"
                    isDisabled={loading}
                    boxShadow="2xl"
                    bg={useColorModeValue("pt1", "pt4")}
                    variant={"primary"}
                >
                    {loading ? <Spinner /> : "Execute Swap"}
                </Button>
            ) : (
                <WalletButton truncatedAddress="" address="" truncatedValue="" />
            )}
        </VStack>
    );
}
