import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { scroll, scrollSepolia } from 'wagmi/chains';
import React, { ReactNode } from 'react';
import { createPublicClient } from 'viem';

const { wallets } = getDefaultWallets();

const connectors = connectorsForWallets([...wallets], {
  appName: 'Zuzalu City',
  projectId: '6c190133ca2cec0744761447d868de85',
});
const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';

const selectedChain = isDev ? scrollSepolia : scroll;
const transportUrl = isDev
  ? 'https://scroll-sepolia.drpc.org'
  : 'https://scroll.drpc.org';

export const config = createConfig({
  chains: [selectedChain],
  transports: {
    [scrollSepolia.id]: isDev
      ? http()
      : http('https://scroll-sepolia.drpc.org'),
    [scroll.id]: isDev ? http() : http('https://scroll.drpc.org'),
  },
  connectors,
  ssr: true,
});

export const client = createPublicClient({
  chain: selectedChain,
  transport: http(transportUrl),
});

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
