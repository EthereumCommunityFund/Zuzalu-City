import { TICKET_FACTORY_ABI } from "@/utils/ticket_factory_abi";
import { createPublicClient, createWalletClient, getContract } from "viem";
import { http } from "wagmi";
import { scrollSepolia } from "wagmi/chains";

export const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3BicWVtYnRiZHVwaWRrYmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3MTc1NjMsImV4cCI6MjAzMDI5MzU2M30.ZvO6KbDesswcZ77B-vAKI7lzSCiGjcfEN0vHfRo-tFs';

export const JWT_SECRET = 'ZuCity';

export const PROVIDER =
  'https://eth-sepolia.g.alchemy.com/v2/dIHWHPAPI_-uPhkXh5mcNrqJV88vkI-2';

export const CONTRACT_ADDRESS = '0xB05611bC75Fdd276b336eD8f2f3cE24d8A10a751';

export const TICKET_FACTORY_ADDRESS = "0x782398fCa8546570a27cdA632E1499d03044A493" as const;
export const mUSDT_TOKEN = "0xd61f92AA071012a7048B81b0B222a228503593e1" as const;
export const mUSDC_TOKEN = "0x0C9725edb55709994E0B4e07b8134fdfCBDB4aE5" as const;
export const OWNER = "0x8D5b0F873c00F8e8EA7FEF0C24DBdC5Ac2758D26" as const;
export const SCROLL_EXPLORER = "https://sepolia.scrollscan.com" as const;

export const ticketFactoryContract = {
  address: TICKET_FACTORY_ADDRESS,
  abi: TICKET_FACTORY_ABI
} as const


const read = createPublicClient({ chain: scrollSepolia, transport: http(), batch: { multicall: true } });
const write = createWalletClient({ chain: scrollSepolia, transport: http() });
export const ticketFactoryGetContract = getContract({
  address: TICKET_FACTORY_ADDRESS,
  abi: TICKET_FACTORY_ABI,
  client: { public: read, wallet: write },
});

export const NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000';

export const SPACE_CATEGORIES: {
  value: string;
  label: string;
}[] = [
  {
    value: 'network_states',
    label: 'Network States',
  },
  {
    value: 'charter_cities',
    label: 'Charter Cities',
  },
  {
    value: 'coordinations',
    label: 'Coordinations',
  },
  {
    value: 'zk_tech',
    label: 'ZK Tech',
  },
  {
    value: 'core_eth_development',
    label: 'Core Ethereum Development',
  },
  {
    value: 'l2_projects',
    label: 'Layer2 Projects',
  },
  {
    value: 'decentralized_social',
    label: 'Decentralized Social',
  },
];

export const VENUE_TAGS: {
  value: string;
  label: string;
}[] = [
  {
    value: 'live_stream_available',
    label: 'Live-stream Available',
  },
  {
    value: 'external_venue',
    label: 'External Venue',
  },
];

export const SOCIAL_TYPES: {
  key: string;
  value: string;
}[] = [
    {
      key: 'github',
      value: 'Github'
    },
    {
      key: 'discord',
      value: 'Discord'
    },
    {
      key: 'twitter',
      value: 'Twitter'
    },
    {
      key: 'telegram',
      value: 'Telegram'
    },
    {
      key: 'lens',
      value: 'Lens'
    },
    {
      key: 'nostr',
      value: 'Nostr'
    }
  ]

export const STARTING_STATUS: {
  key: string
  value: string
}[] = [
    {
      key: 'available',
      value: 'Available'
    },
    {
      key: 'hidden',
      value: 'Hidden'
    }
  ]
