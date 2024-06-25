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
          poolAddress="0x4aF686dE1d2032F483f3C1913B385cE488eBbE3C"
          poolName="VTNX - Unlocked"
          description="Unlocked Staking: 1 - 1B wallet holdings"
          isLocked={false}
        />
        <StakingPool
          poolAddress="0x3c6f57994df94940e362706fe38b838089Fb04Ab"
          poolName="VTNX - Locked"
          description="Locked Staking: 1 - 1B wallet holdings"
          isLocked={true}
        />
        <StakingPool
          poolAddress="0x751efEA09b2693B81B40B4521ff50e802B6eafAc"
          poolName="VTNX - Locked"
          description="Locked Staking: 1B+ wallet holdings"
          isLocked={true}
          isSoloStaking={true} // Pass the prop to indicate this is Pool 3
        />
      </SimpleGrid>
    </Center>
  );
};

export default StakingPools;
