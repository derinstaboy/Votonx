import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  trustWallet,
  metamaskWallet,
  walletConnect,
  coinbaseWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Polygon } from "@thirdweb-dev/chains";

import {
  ChakraProvider,
  Box,
} from "@chakra-ui/react";
import Head from "next/head";
import Header from "../components/Nav/header";
import colourTheme from "../components/Hooks/Theme";
import {
  ThirdwebStorage,
  IpfsUploader,
} from "@thirdweb-dev/storage";


const gatewayUrls = {
  "ipfs://": [
    "https://ipfs.io/ipfs/",
  ],
};
const uploader = new IpfsUploader();
const storage = new ThirdwebStorage({ uploader, gatewayUrls });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId="e16649e68aa11a9b63e484526019120a"
      supportedWallets={[
        metamaskWallet(),
        trustWallet(),
        walletConnect(),
        coinbaseWallet(),
      ]}
      activeChain={Polygon}
      supportedChains={[Polygon]}
      sdkOptions={{
        gasSettings: {
          maxPriceInGwei: 21000, // Maximum gas price for transactions (default 300 gwei)
          speed: "fastest", // the tx speed setting: 'standard'|'fast|'fastest' (default: 'fastest')
        },
      }}
      storageInterface={storage}
      dAppMeta={{
        name: "Votonx",
        description: "Welcome to Votonx!",
        logoUrl: "/Logo.png",
        url: "",
        isDarkMode: true,
      }}
      autoSwitch={true}
      autoConnect={true}
    >
      <Head>
        <title>Votonx</title>
      </Head>
      <ChakraProvider theme={colourTheme}>
        <Box m="auto" bgImage={"/Background.png"} bgSize={"100% 100%"}>

          <Header bgIm={"/Background.png"} />
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
