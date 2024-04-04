import { useContract, useContractWrite, useContractRead, useSDK, useAddress, useNFTs, ThirdwebNftMedia, useOwnedNFTs, toEther, } from "@thirdweb-dev/react"
import { CLAIM_CONTRACT, CLAIM_CONTRACT_ABI, VOTONX_NFT, VOTONX_NFT_ABI, VOTONX_TOKEN, VOTONX_TOKEN_ABI } from "./addresses"
import { useState } from "react"
import { Box, Button, useToast, Text, SimpleGrid, Image, VStack, Heading, Spinner } from "@chakra-ui/react"
import { VTNX_CLAIM_CONTRACT, VTNX_NFT } from "../../Consts/Addresses"

export default function TestClaimPage() {
    const [burning, setBurning] = useState(false)
    const [claimingVotonx, setClaimingVotonx] = useState(false)
    const [claimingMatic, setClaimingMatic] = useState(false)
    const [claiming5050, setClaiming5050] = useState(false)
    const [claimingType, setClaimingType] = useState("")
    const [depositingTokensAdmin, setDepositingTokensAdmin] = useState(false)
    const [depositingNativeTokensAdmin, setDepositingNativeTokensAdmin] = useState(false)
    const [claimId, setClaimId] = useState("")
    const [searchId, setSearchId] = useState("")

    const sdk = useSDK()
    const address = useAddress()
    const toast = useToast()

    const error1Toast = () => {
        toast({
            title: 'Sorry, there was an issue whilst claiming.',
            description: "Please try again, if the error persists, contact us via our social medias.",
            status: 'error',
            duration: 9000,
            isClosable: true,
            colorScheme: "red"
        })
    };

    const error2Toast = () => {
        toast({
            title: 'Sorry, you dont own any NFTs from this collection.',
            description: "You were unable to proceed as you do not own the required NFTs.",
            status: 'error',
            duration: 9000,
            isClosable: true,
            colorScheme: "orange"
        })
    };

    const successToast = () => {
        toast({
            title: `You have successfully claimed using ${claimingType}`,
            description: "Thank you for holding our NFT.",
            status: 'success',
            duration: 9000,
            isClosable: true,
            colorScheme: "green"
        })
    };

    const { contract: claimContract, isLoading: isLoadingClaimContract } = useContract(VTNX_CLAIM_CONTRACT, CLAIM_CONTRACT_ABI)
    const { contract: nftContract, isLoading: isLoadingNftContract } = useContract(VTNX_NFT, VOTONX_NFT_ABI)
    const { data: myownedNfts, isLoading: isLoadingMyNFTS } = useOwnedNFTs(nftContract, address)

    const { data: erc20AmountPerNFT } = useContractRead(claimContract, "erc20AmountPerNFT")
    const { data: ethAmountPerNFT } = useContractRead(claimContract, "ethAmountPerNFT")

    const { data: totalERC20TokensBurned } = useContractRead(claimContract, "totalERC20TokensBurned")
    const { data: totalERC20TokensClaimed } = useContractRead(claimContract, "totalERC20TokensClaimed")
    const { data: totalETHClaimed } = useContractRead(claimContract, "totalETHClaimed")
    const { data: totalNFTsClaimed } = useContractRead(claimContract, "totalNFTsClaimed")

    async function callFunction(id: number, functionName: string) {
        const claimContract = await sdk?.getContract(VTNX_CLAIM_CONTRACT, CLAIM_CONTRACT_ABI);
        const tx = await claimContract?.call(functionName, [id]); // burnTokensLeaveETH, claimRewardWithPartialEth
        return tx;
    }

    async function callFunctionBool(id: number, functionName: string, boolean: boolean) {
        const claimContract = await sdk?.getContract(VTNX_CLAIM_CONTRACT, CLAIM_CONTRACT_ABI);
        const tx = await claimContract?.call(functionName, [id, boolean]); //claimReward true = votonx ,false = matic
        return tx;
    }

    async function burnvotonLeaveMatic(id: number) { //1 Leave MATIC & Burn VTNX
        setBurning(true);

        try {
            const nftContract = await sdk?.getContract(VTNX_NFT, VOTONX_NFT_ABI);
            const address = await sdk?.wallet.getAddress();
            if (!nftContract || !claimContract) {
                throw new Error("Contracts not available");
            }
            const balance = await nftContract.erc721.balanceOf(address!);
            if (Number(balance) > 0) {
                await callFunction(id, "burnTokensLeaveETH");
                successToast();
            } else {
                error2Toast();
            }
        } catch (err) {
            console.error(err);
            error1Toast();
        } finally {
            setBurning(false);
        }
    }

    async function claimMatic(id: number) { //2b Claim MATIC & Burn VTNX 
        setClaimingVotonx(true);
        try {
            const nftContract = await sdk?.getContract(VTNX_NFT, VOTONX_NFT_ABI);
            const address = await sdk?.wallet.getAddress();
            if (!nftContract || !claimContract) {
                throw new Error("Contracts not available");
            }
            const balance = await nftContract.erc721.balanceOf(address!);
            if (Number(balance) > 0) {
                await callFunctionBool(id, "claimReward", true);
                successToast();
            } else {
                error2Toast();
            }
        } catch (err) {
            console.error(err);
            error1Toast();
        } finally {
            setClaimingVotonx(false);
        }
    }


    async function claimVotonx(id: number) { //2a Claim VTNX
        setClaimingMatic(true);
        try {
            const nftContract = await sdk?.getContract(VTNX_NFT, VOTONX_NFT_ABI);
            const address = await sdk?.wallet.getAddress();
            if (!nftContract || !claimContract) {
                throw new Error("Contracts not available");
            }
            const balance = await nftContract.erc721.balanceOf(address!);
            if (Number(balance) > 0) {
                await callFunctionBool(id, "claimReward", false);
                successToast();
            } else {
                error2Toast();
            }
        } catch (err) {
            console.error(err);
            error1Toast();
        } finally {
            setClaimingMatic(false);
        }
    }

    async function claim5050(id: number) { //3 Claim 50% MATIC & Burn VTNX
        setClaiming5050(true);
        try {
            const nftContract = await sdk?.getContract(VTNX_NFT, VOTONX_NFT_ABI);
            const address = await sdk?.wallet.getAddress();
            if (!nftContract || !claimContract) {
                throw new Error("Contracts not available");
            }
            const balance = await nftContract.erc721.balanceOf(address!);
            if (Number(balance) > 0) {
                await callFunction(id, "claimRewardWithPartialEth");
                successToast();
            } else {
                error2Toast();
            }
        } catch (err) {
            console.error(err);
            error1Toast();
        } finally {
            setClaiming5050(false);
        }
    }

    async function depositTokensAdmin(tokenAmount: number) {


    }

    async function depositNativeTokensAdmin(nativeAmount: number) {


    }

    return (

        <div>
            <Box h="100vh">
                {myownedNfts && myownedNfts?.length > 0 ? (<Box>

                    <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        margin={"auto"}
                        width="300px" // Adjust the width as needed
                        bgImg="/Background.png"
                    >
                        <VStack m="auto" textAlign={"center"} bgGradient="linear(to-r, pt1,pt3)">
                            <Text>VTNX Amount per NFT: {erc20AmountPerNFT ? toEther(erc20AmountPerNFT)?.toString() : <Spinner />}</Text>
                            <Text>MATIC Amount per NFT: {ethAmountPerNFT ? toEther(ethAmountPerNFT!)?.toString() : <Spinner />}</Text>
                            <Text>Total VTNX Tokens Burned: {totalERC20TokensBurned ? toEther(totalERC20TokensBurned!)?.toString() : <Spinner />}</Text>
                            <Text>Total VTNX Tokens Claimed: {totalERC20TokensClaimed ? toEther(totalERC20TokensClaimed!)?.toString() : <Spinner />}</Text>
                            <Text>Total MATIC Claimed: {totalETHClaimed ? toEther(totalETHClaimed!)?.toString() : <Spinner />}</Text>
                            <Text>Total NFTs Claimed: {totalNFTsClaimed?.toString()}</Text>
                        </VStack>
                    </Box>
                    {myownedNfts && myownedNfts?.length > 0 ? myownedNfts?.map((nft, index) =>
                        <SimpleGrid display={"flex"} gap={8} m="auto" alignContent={"center"} justifyContent={"center"} textAlign={"center"} mt={10}>

                            <Box key={index} borderRadius={"md"} border="2px" p="2" bgGradient="linear(to-r, pt1,pt3)" boxShadow={"dark-lg"}>
                                <Image
                                    src={nft?.metadata?.image!}
                                    borderRadius={4}
                                    m="auto"
                                    boxShadow={"md"}
                                />
                                <Text>{nft.metadata.name}</Text>

                                <SimpleGrid columns={1} gap={2} mt={2}>

                                    <Button
                                        onClick={() => claimVotonx(Number(nft.metadata.id))}
                                        variant={"primary"}
                                        size="sm"
                                        p={4}
                                        isLoading={claimingVotonx}


                                    >
                                        Claim VTNX
                                    </Button>

                                    <Button
                                        onClick={() => claimMatic(Number(nft.metadata.id))}
                                        variant={"primary"}
                                        size="sm"
                                        p={4}
                                        isLoading={claimingMatic}

                                    >
Claim MATIC <br/>&<br/> Burn VTNX                                    
</Button>

                                    <Button
                                        onClick={() => burnvotonLeaveMatic(Number(nft.metadata.id))}
                                        variant={"primary"}
                                        size="sm"
                                        fontSize={"xx-small"}
                                        p={4}
                                        isLoading={burning}

                                    >
Leave MATIC <br/>&<br/> Burn VTNX                                  
  </Button>



                                    <Button
                                        onClick={() => claim5050(Number(nft.metadata.id))}
                                        variant={"primary"}
                                        size="sm"
                                        fontSize={"xx-small"}
                                        p={4}
                                        isLoading={claiming5050}
                                    >
                                         Claim 50% MATIC <br/>&<br/> Burn VTNX                              
                                    </Button>
                                </SimpleGrid>
                            </Box>
                        </SimpleGrid>
                    ) : (<Box h="100vh"><VStack gap="4"><Heading textColor={"#f0c415"}>Loading nfts...</Heading><Spinner /></VStack></Box>
                    )}
                </Box>
                ) : (<VStack borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    margin={"auto"}
                    textAlign={"center"}
                    w={"360px"}
                    justifyContent={"center"}>

                    <Heading textColor={"#f0c415"}>Sorry you do not own the required NFT's</Heading></VStack>)}

            </Box>
        </div>
    )
}
