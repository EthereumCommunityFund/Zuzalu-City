export const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxia3BicWVtYnRiZHVwaWRrYmN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3MTc1NjMsImV4cCI6MjAzMDI5MzU2M30.ZvO6KbDesswcZ77B-vAKI7lzSCiGjcfEN0vHfRo-tFs';

export const JWT_SECRET = 'ZuCity';

export const PROVIDER =
  'https://eth-sepolia.g.alchemy.com/v2/dIHWHPAPI_-uPhkXh5mcNrqJV88vkI-2';

export const CONTRACT_ADDRESS = '0xB05611bC75Fdd276b336eD8f2f3cE24d8A10a751';

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
      value: 'Github',
    },
    {
      key: 'discord',
      value: 'Discord',
    },
    {
      key: 'twitter',
      value: 'Twitter',
    },
    {
      key: 'telegram',
      value: 'Telegram',
    },
    {
      key: 'lens',
      value: 'Lens',
    },
    {
      key: 'nostr',
      value: 'Nostr',
    },
  ];

export const EXPREIENCE_LEVEL_TYPES: {
  key: string;
  value: string;
}[] = [
    {
      key: 'beginner',
      value: 'Beginner',
    },
    {
      key: 'intermediate',
      value: 'Intermediate',
    },
    {
      key: 'advanced',
      value: 'Advanced',
    },
  ];