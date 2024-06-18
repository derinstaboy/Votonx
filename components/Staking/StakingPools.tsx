import React from "react";
import { SimpleGrid, Center } from "@chakra-ui/react";
import StakingPool from "./StakingPool";

const StakingPools: React.FC = () => {
  return (
    <Center w="full" flexGrow="1">
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
        spacing="6"
        justifyItems="center"
        alignItems="center"
        width="100%"
      >
        <StakingPool
          poolAddress="0x0E02e52157561e54b019f4EF6595F021332fCEd9"
          poolName="VTNX - Unlocked"
          description="Unlocked Staking: 1 - 1B wallet holdings"
          isLocked={false}
        />
        <StakingPool
          poolAddress="0xE2C189a5BcC5cFD64471aCd7B5581BFe9a5dEEF0"
          poolName="VTNX - Locked"
          description="Locked Staking: 1 - 1B wallet holdings"
          isLocked={true}
        />
        <StakingPool
          poolAddress="0x13Fc394d72b10CeAfecE4716b94135b2baE3b484"
          poolName="VTNX - Locked"
          description="Locked Staking: 1B+ wallet holdings"
          isLocked={true}
        />
      </SimpleGrid>
    </Center>
  );
};

export default StakingPools;
