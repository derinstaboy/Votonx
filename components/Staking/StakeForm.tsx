import React, { useState } from "react";
import { Button, Input, HStack, VStack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";

interface StakeFormProps {
  onDeposit: (amount: string) => void;
  tokenBalance: any;
}

const StakeForm: React.FC<StakeFormProps> = ({ onDeposit, tokenBalance }) => {
  const [amount, setAmount] = useState<string>("");

  const handleDeposit = () => {
    if (parseFloat(amount) > 0) {
      onDeposit(amount);
    }
  };

  const handleMax = () => {
    if (tokenBalance) {
      setAmount(ethers.utils.formatUnits(tokenBalance.value, 18));
    }
  };

  return (
    <VStack spacing="4">
      <Text>Wallet Balance: {tokenBalance ? ethers.utils.formatUnits(tokenBalance.value, 18) : "0"} VTNX</Text>
      <HStack spacing="2" w="full">
        <Input
          placeholder="Enter amount to stake"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          step="0.01"
          flex="1"
        />
        <Button onClick={handleMax} colorScheme="blue">Max</Button>
      </HStack>
      <Button onClick={handleDeposit} colorScheme="blue">Stake</Button>
    </VStack>
  );
};

export default StakeForm;
