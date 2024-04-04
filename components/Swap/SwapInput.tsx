import {
  Button,
  HStack,
  Text,
  Image,
  Input,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  type: "native" | "token";
  tokenImage?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
  placeholder: any;
  placeholder2: any;
  balance: string | undefined;
  display: string;
};

export default function SwapInput({
  type,
  tokenImage,
  setValue,
  value,
  current,
  max,
  placeholder,
  balance,
  placeholder2,
  display
}: Props) {
  // Handle input change


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/^0+/, "");
    const newValue = cleanedValue === "" ? "0" : cleanedValue;
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setValue(newValue);
    }
  };



  // Handle the "Max" button click
  const handleMaxClick = () => {
    if (current === type && max) {
      const newValue = Math.max(+max - 5, 0); // Use the unary plus operator to convert 'max' to a number before subtracting 5
      setValue(newValue.toString());
      // Perform other actions or calculations using the updated 'newValue' here if needed
    }
  };

  // Watch for external changes in the input value and update the ref

  return (
    <VStack>
      <HStack
        w="full"
        rounded="2xl"
        px="5"
        boxShadow="2xl"
        borderRadius="2xl"
        borderWidth="4px"
        borderColor={"black"}
        bg={"navy"}

      >
        <Image boxShadow="2xl" src={tokenImage || "/Logo.png"} borderRadius={"100%"} w="7" h="7" />
        <Input
          type="number"
          placeholder={placeholder}
          fontSize="3xl"
          value={current !== type ? "" : value}
          onChange={handleInputChange}
          outline="none"
          py="10"
          border="none"
          fontFamily="monospace"
          isDisabled={current !== type}
          _focus={{ boxShadow: "none" }}
          boxShadow="2xl"
          textColor={"white"}
        />

        {current === type && (
          <Button
            boxShadow="2xl"
            onClick={handleMaxClick}
            bgSize={"contain"}
            borderRadius="2xl"
            borderWidth="4px"
            borderColor={"black"}
            variant={"primary"}

          >
            Max
          </Button>
        )}
      </HStack>
      <Text
        textAlign={"left"}
        textColor={"#f0c415"}
        w={"300px"}
        letterSpacing="-2"
        boxShadow="2xl"

      >
        Balance: {parseFloat(balance ?? "0").toFixed(4)}
      </Text>
    </VStack>
  );
}

