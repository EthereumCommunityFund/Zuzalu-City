import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { scroll, scrollSepolia } from 'wagmi/chains';
import React, { ReactNode } from 'react';
import { createPublicClient } from 'viem';
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet, rainbowWallet],
    },
  ],
  {
    appName: 'Zuzalu City',
    projectId: '2ae588c8e2c83e087672119a2b42f330',
  },
);

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
