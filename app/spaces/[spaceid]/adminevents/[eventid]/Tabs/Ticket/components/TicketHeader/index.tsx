import React, { useState } from 'react';
import { Typography, Stack, useTheme } from '@mui/material';
import { QRCodeIcon } from '@/components/icons';
import { useAccount } from 'wagmi';
import { scroll, scrollSepolia } from 'viem/chains';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { TICKET_FACTORY_ABI } from '@/utils/ticket_factory_abi';
import { config } from '@/context/WalletContext';
import { isDev } from '@/constant';
import {
  TICKET_FACTORY_ADDRESS,
} from '@/constant';
import { Address } from 'viem';
import { convertDateToEpoch } from '@/utils/format';
import { Event } from '@/types';
import { ethers } from 'ethers';
import { useCeramicContext } from '@/context/CeramicContext';
import { updateContractID } from '@/services/event/addContractID';
import { StatusIndicatorPanel } from '../Common';

interface PropTypes {
  event?: Event;
  visible?: boolean;
}
const TicketHeader = ({ event, visible }: PropTypes) => {
  const breakpoints = useTheme().breakpoints;
  const [isChecked, setIsChecked] = useState(true);
  const { ceramic, composeClient, profile } = useCeramicContext();
  const { address } = useAccount();
  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const updateContract = async (contractEventid: number) => {
    const addContractIDInput = {
      eventId: event?.id as string,
      contractID: contractEventid,
    };
    try {
      setBlockClickModal(true);
      const response = await updateContractID(addContractIDInput);
      if (response.status === 200) {
        setShowModal(true);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setBlockClickModal(false);
    }
  };
  const createEventID = async () => {
    try {
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
        const eventTicketId = Number(decodedLog.eventId);
        await updateContract(eventTicketId);
      } else {
        console.error('EventCreated event not found in transaction receipt');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Stack
      direction="column"
      spacing={2}
      paddingBottom={'30px'}
      borderBottom={'1px solid rgba(255,255,255,0.10)'}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h5" color="white">
          Event Registration
        </Typography>
      </Stack>
      <Stack
        direction="row"
        gap="20px"
        sx={{
          [breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '10px',
          },
        }}
      >
        <StatusIndicatorPanel
          name="Registration"
          desc="CLOSED"
          checked={false}
          disabled
          onChange={() => {}}
        />
        <StatusIndicatorPanel
          name="Event Check-In"
          desc="CLOSED"
          checked={false}
          disabled
          onChange={() => {}}
        />
        <StatusIndicatorPanel
          name="Event Capacity"
          desc="COMING SOON"
          left={<QRCodeIcon />}
          disabled
        />
      </Stack>
    </Stack>
  );
};

export default TicketHeader;
