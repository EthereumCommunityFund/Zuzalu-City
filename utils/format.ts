import { getAddress } from 'viem';

export function shortenAddress(address: string, chars = 4): string {
  try {
    // const parsed = getAddress(address)
    return `${address.substring(0, chars + 2)}...${address.slice(-chars)}`;
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
}

export function convertDateToEpoch(dateString: any) {
  const date = new Date(dateString);
  const epoch = date.getTime();
  const epochInSeconds = Math.floor(epoch / 1000);

  return epochInSeconds;
}
