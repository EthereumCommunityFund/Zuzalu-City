import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { scrollSepolia } from 'wagmi/chains';
import React, { ReactNode } from 'react';
import { createPublicClient } from 'viem';

export const config = createConfig({
  chains: [scrollSepolia],
  transports: {
    [scrollSepolia.id]: http(),
    // [scrollSepolia.id]: http("https://scroll-sepolia.drpc.org"),
  },
  ssr: true,
})

export const client = createPublicClient({
  chain: scrollSepolia,
  transport: http("https://scroll-sepolia.drpc.org"),
})

interface WalletProviderProps {
  children: ReactNode;
}

// Create a provider component
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
};
