import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
} from "@thirdweb-dev/react";
import StakeForm from "./StakeForm";
import SocialFollowModal from "./SocialFollowModal";
import { VTNX_TOKEN } from "../../Consts/Addresses";
import VTNX_STAKING_ABI from "../../Consts/ABIS/VTNXStaking.json";
import VTNX_ABI from "../../Consts/ABIS/VTNXToken.json";

interface StakingPoolProps {
  poolAddress: string;
  poolName: string;
  description: string;
  isLocked: boolean;
}

const StakingPool: React.FC<StakingPoolProps> = ({ poolAddress, poolName, description, isLocked }) => {
  const address = useAddress();
  const { contract: stakingContract } = useContract(poolAddress, VTNX_STAKING_ABI);
  const { contract: tokenContract } = useContract(VTNX_TOKEN, VTNX_ABI);
  const { data: totalStaked } = useContractRead(stakingContract, "totalStaked");
  const { data: rewardsPerSecond } = useContractRead(stakingContract, "rewardsPerSecond");
  const { data: pendingReward } = useContractRead(stakingContract, "pendingReward", [address]);
  const { data: userInfo } = useContractRead(stakingContract, "userInfo", [address]);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: exitPenaltyPerc } = useContractRead(stakingContract, "exitPenaltyPerc");
  const { data: holderUnlockTime } = useContractRead(stakingContract, "holderUnlockTime", [address]);

  const [apr, setApr] = useState<string>("0");
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [hasFollowedSocials, setHasFollowedSocials] = useState<boolean>(false);

  const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  const { mutateAsync: depositTokens } = useContractWrite(stakingContract, "deposit");
  const { mutateAsync: withdrawTokens } = useContractWrite(stakingContract, "withdraw");
  const { mutateAsync: withdrawRewards } = useContractWrite(stakingContract, "withdraw");
  const { mutateAsync: emergencyWithdraw } = useContractWrite(stakingContract, "emergencyWithdraw");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEmergencyOpen, onOpen: onEmergencyOpen, onClose: onEmergencyClose } = useDisclosure();
  const { isOpen: isSocialModalOpen, onOpen: onSocialModalOpen, onClose: onSocialModalClose } = useDisclosure();

  useEffect(() => {
    const followedSocials = localStorage.getItem("followedSocials");
    if (!followedSocials) {
      onSocialModalOpen();
    } else {
      setHasFollowedSocials(true);
    }
  }, [onSocialModalOpen]);

  useEffect(() => {
    if (rewardsPerSecond && totalStaked) {
      const aprValue = parseFloat(ethers.utils.formatUnits(rewardsPerSecond, 18))
        * 31536000 / parseFloat(ethers.utils.formatUnits(totalStaked, 18)) * 100;
      setApr(aprValue.toFixed(2));
    }
  }, [rewardsPerSecond, totalStaked]);

  useEffect(() => {
    const checkApproval = async () => {
      if (address && tokenContract) {
        const allowance = await tokenContract.call("allowance", [address, poolAddress]);
        setIsApproved(allowance.gt(0));
      }
    };

    checkApproval();
  }, [address, tokenContract, poolAddress]);

  const handleError = (error: any, defaultMessage: string) => {
    let message = error.data?.message || error.message || defaultMessage;

    // Extract the reason if it exists
    const reasonMatch = message.match(/Reason: (.*?)(\n|$)/);
    if (reasonMatch && reasonMatch[1]) {
      message = reasonMatch[1].trim();
    } else {
      message = defaultMessage;
    }

    toast({ status: "error", title: "Transaction Failed", description: message });
  };

  const handleApprove = async () => {
    try {
      await approve({ args: [poolAddress, ethers.constants.MaxUint256] });
      toast({ status: "success", title: "Approval Successful", description: "You can now stake your tokens." });
      setIsApproved(true);
    } catch (err) {
      handleError(err, "An error occurred while approving tokens.");
    }
  };

  const handleDeposit = async (amount: string) => {
    try {
      await depositTokens({ args: [ethers.utils.parseUnits(amount, 18)] });
      toast({ status: "success", title: "Deposit Successful", description: "Your tokens have been staked." });
    } catch (err) {
      handleError(err, "An error occurred while staking tokens.");
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawTokens({ args: [userInfo.amount] });
      toast({ status: "success", title: "Withdraw Successful", description: "Your tokens have been withdrawn." });
    } catch (err) {
      handleError(err, "An error occurred while withdrawing tokens.");
    }
  };

  const handleClaim = async () => {
    try {
      await depositTokens({ args: [0] });
      toast({ status: "success", title: "Claim Successful", description: "Your rewards have been claimed." });
    } catch (err) {
      handleError(err, "An error occurred while claiming rewards.");
    }
  };


  const handleCompound = async () => {
    try {
      if (pendingReward && pendingReward.gt(0)) {
        await depositTokens({ args: [pendingReward] });
        toast({ status: "success", title: "Compound Successful", description: "Your rewards have been compounded." });
      } else {
        toast({ status: "info", title: "No Rewards", description: "You have no pending rewards to compound." });
      }
    } catch (err) {
      handleError(err, "An error occurred while compounding rewards.");
    }
  };

  const handleEmergencyWithdraw = async () => {
    try {
      await emergencyWithdraw({ args: [] });
      toast({ status: "success", title: "Emergency Withdrawal Successful", description: "Your tokens have been withdrawn." });
      onEmergencyClose(); // Close the modal after a successful emergency withdrawal
    } catch (err) {
      handleError(err, "An error occurred while withdrawing tokens.");
    }
  };

  // Convert the unlock time to a readable date format
  const unlockDate = holderUnlockTime ? new Date(holderUnlockTime * 1000).toLocaleString() : "Loading...";

  const handleFollowComplete = () => {
    localStorage.setItem("followedSocials", "true");
    setHasFollowedSocials(true);
    onSocialModalClose();
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p="6" boxShadow="lg" bg="gray.800" color="white" w="full">
      <VStack spacing="4" textAlign="center">
        <Text fontSize="2xl" fontWeight="bold">{poolName}</Text>
        <Text>{description}</Text>
        <Text>APR: {apr}%</Text>
        <Text>Pending Rewards: {pendingReward ? ethers.utils.formatUnits(pendingReward, 18) : "0"} VTNX</Text>
        <Text>Staked: {userInfo ? ethers.utils.formatUnits(userInfo.amount, 18) : "0"} VTNX</Text>
        <HStack spacing="2" wrap="wrap" justify="center">
          {!isApproved ? (
            <Button onClick={handleApprove} colorScheme="blue" size="sm">Approve</Button>
          ) : (
            <>
              <Button onClick={onOpen} colorScheme="blue" size="sm">Stake</Button>
              <Button onClick={handleWithdraw} colorScheme="red" size="sm">Withdraw</Button>
              <Button onClick={handleClaim} colorScheme="green" size="sm">Claim</Button>
              <Button onClick={handleCompound} colorScheme="purple" size="sm">Compound</Button>
              {isLocked && <Button onClick={onEmergencyOpen} colorScheme="red" size="sm">Emerg. Withdraw</Button>}
            </>
          )}
        </HStack>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Stake Tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StakeForm onDeposit={handleDeposit} tokenBalance={tokenBalance} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEmergencyOpen} onClose={onEmergencyClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Emergency Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to perform an emergency withdrawal?</Text>
            <Text>The current exit penalty for early withdrawal is: {exitPenaltyPerc ? exitPenaltyPerc.toString() : "Loading..."}%</Text>
            <Text>Your tokens will be unlocked on: {unlockDate}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleEmergencyWithdraw}>Confirm</Button>
            <Button variant="ghost" onClick={onEmergencyClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SocialFollowModal isOpen={isSocialModalOpen} onClose={onSocialModalClose} onFollowComplete={handleFollowComplete} />
    </Box>
  );
};

export default StakingPool;
