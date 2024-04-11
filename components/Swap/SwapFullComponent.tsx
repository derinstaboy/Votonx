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

import { useState, useEffect } from "react";
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
    const { data: taxFees } = useContractRead(tokenContract, "percentage");

    const { data: feePercent } = useContractRead(dexContract, "feePercent");

    const [amount, setAmount] = useState("");
    const [nativeValue, setNativeValue] = useState<string>("0");
    const [tokenValue, setTokenValue] = useState<string>("0");
    const [currentFrom, setCurrentFrom] = useState<string>("native");
    const [loading, setLoading] = useState<boolean>(false);
    const [tokenA, setTokenA] = useState<string>("0");
    const [tokenB, setTokenB] = useState<string>("0");
    const [isApproved, setIsApproved] = useState(false); // State to track approval status
    const fee = Number(feePercent ? (feePercent / 100) : 100)
    const taxPercent = taxFees / 100 //6
    const taxMultiplier = (100 - taxPercent) / 100
    const percentToSwapAfterFee = 100 - fee

    

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

    const VTNXSwap = tokenValue ? Number(tokenValue) * taxMultiplier : 0;

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

    // Handler function for setting max native token (MATIC) value
    const handleSetMaxNativeValue = () => {
        if (nativeBalance?.value) {
            // Update the state to set the input field with the max balance
            setNativeValue(nativeBalance.displayValue || "0");
        }
    };

    // Simplify and correct logic to calculate output amount
    const calculateOutputAmount = () => {
        if (currentFrom === "native") {
            return isLoadinggetOutputTokenAmountMaticToVTNX
                ? "0"
                : getOutputTokenAmountMaticToVTNX
                    ? ethers.utils.formatUnits(getOutputTokenAmountMaticToVTNX, 18)
                    : "0";
        } else {
            return isLoadinggetOutputTokenAmountVTNXtoMatic
                ? "0"
                : getOutputTokenAmountVTNXtoMatic
                    ? ethers.utils.formatUnits(getOutputTokenAmountVTNXtoMatic, 18)
                    : "0";
        }
    };

    const outputAmount = calculateOutputAmount();

    const checkTokenAllowance = async () => {
    try {
        // Check if tokenContract is defined
        if (tokenContract) {
            const allowance = await tokenContract.call("allowance", [address, VTNX_DEX_CONTRACT]);
            const allowanceAmount = ethers.utils.formatUnits(allowance, 18);
            return parseFloat(allowanceAmount) >= parseFloat(tokenValue);
        } else {
            // Handle the case where tokenContract is undefined
            console.error("tokenContract is undefined");
            return false;
        }
    } catch (error) {
        console.error("Error fetching allowance:", error);
        return false;
    }
};


    // Define checkApproval as an async function outside of useEffect
    const checkApproval = async () => {
        if (!address || !tokenContract || !tokenValue) {
            return false;
        }

        try {
            const allowance = await tokenContract.call("allowance", [address, VTNX_DEX_CONTRACT]);
            const allowanceAmount = ethers.utils.formatUnits(allowance, 18);
            return parseFloat(allowanceAmount) >= parseFloat(tokenValue);
        } catch (error) {
            console.error("Error fetching allowance:", error);
            return false;
        }
    };

    // Updated handleApproval function
    const handleApproval = async () => {
        setLoading(true);
        try {
            await approveTokenSpending({ args: [VTNX_DEX_CONTRACT, toWei(tokenValue)] });
            // Recheck and update approval status
            await checkApproval();
            toast({
                title: "Approval Successful",
                description: "Token spending approved.",
                status: "success",
            });
        } catch (err) {
            console.error(err);
            toast({
                title: "Approval Failed",
                description: "There was an error in token approval.",
                status: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    // In your useEffect hook
    useEffect(() => {
        checkApproval().then(isTokenApproved => {
            setIsApproved(isTokenApproved);
        });
    }, [address, tokenValue, tokenContract]);

    const executeSwap = async () => {
    setLoading(true);
    
    try {
        const isTokenApproved = await checkTokenAllowance();
        if (!isTokenApproved) {
            toast({
                title: "Approval Required",
                description: "Please approve token spending before swapping.",
                status: "warning",
            });
            return;
        }

        const swapArguments = currentFrom === "native" ?
            [nullAddress, vtnxAddress, toWei(nativeValue), maticVtnxPath] : // Assuming swap path for native to token
            [vtnxAddress, nullAddress, toWei(tokenValue), vtnxMaticPath];  // Assuming swap path for token to native

        const overrides = currentFrom === "native" ?
            { value: toWei(nativeValue) } :
            { gasPrice: ethers.utils.parseUnits("5000", "gwei") }; // Adjusted gas price

        await swapTokens({ args: swapArguments, overrides });

        toast({
            status: "success",
            title: "Swap Successful",
            description: `You have successfully swapped your ${currentFrom === "native" ? ACTIVE_CHAIN.nativeCurrency.symbol : symbol || "tokens"} to ${currentFrom === "native" ? symbol || "tokens" : ACTIVE_CHAIN.nativeCurrency.symbol}.`,
        });
    } catch (err) {
        console.error(err);
        toast({
            status: "error",
            title: "Swap Failed",
            description: "There was an error performing the swap. Please try again.",
        });
    } finally {
        setIsApproved(false);
        refetchNativeBalance();
        refetchTokenBalance();
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
