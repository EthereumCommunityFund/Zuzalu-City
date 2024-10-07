import { useCallback, useState } from 'react';
import { isDev, TICKET_FACTORY_ADDRESS } from '@/constant';
import { config } from '@/context/WalletContext';
import { updateContractID } from '@/services/event/addContractID';
import { Event } from '@/types';
import { convertDateToEpoch } from '@/utils/format';
import { Address } from 'viem';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { scroll, scrollSepolia } from 'viem/chains';
import { TICKET_FACTORY_ABI } from '@/utils/ticket_factory_abi';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

interface PropTypes {
  event: Event;
}

export const useCreateEventId = ({ event }: PropTypes) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const createEventID = useCallback(async () => {
    try {
      setIsLoading(true);
      const createEventHash = await writeContract(config, {
        chainId: isDev ? scrollSepolia.id : scroll.id,
        address: TICKET_FACTORY_ADDRESS as Address,
        abi: TICKET_FACTORY_ABI,
        functionName: 'createEvent',
        args: [
          address,
          event?.title,
          event?.id,
          convertDateToEpoch(event?.endTime),
        ],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: createEventHash,
      });

      if (receipt.status !== 'success') {
        console.error('Transaction failed');
        return;
      }
      const eventTopic = ethers.id('EventCreated(uint256,address,string)');

      const log = receipt.logs.find((log) => log.topics[0] === eventTopic);
      if (log) {
        const iface = new ethers.Interface(TICKET_FACTORY_ABI);
        const decodedLog = iface.decodeEventLog(
          'EventCreated',
          log.data,
          log.topics,
        );
        return Number(decodedLog.eventId);
      } else {
        console.error('EventCreated event not found in transaction receipt');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address, event?.title, event?.id, event?.endTime]);

  return { createEventID, isLoading };
};
