import { WebIrys } from '@irys/sdk';

interface WindowWithEthereum extends Window {
  ethereum?: any;
}

/**
 * Creates a new Irys object with the specified configuration.
 *
 * @param {string} url - The Irys network URL.
 * @param {string} currency - The currency to use (e.g., "matic").
 * @param {string} providerUrl - The provider URL for the Ethereum network.
 * @returns {Promise<WebIrys>} - A reference to the initialized Irys object.
 */
const getIrys = async (
  network: string = process.env.NEXT_PUBLIC_NETWORK || 'devnet',
  token: string = process.env.NEXT_PUBLIC_TOKEN || '',
): Promise<WebIrys> => {
  await (window as WindowWithEthereum).ethereum.enable();
  const ethProvider = typeof window !== 'undefined' && window.ethereum;
  const wallet = { name: 'ethersv5', provider: ethProvider };
  const webIrys = new WebIrys({ network, token, wallet });
  await webIrys.ready();
  return webIrys;
};

export default getIrys;
