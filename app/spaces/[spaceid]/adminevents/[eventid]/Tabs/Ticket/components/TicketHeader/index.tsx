import React, { useState } from 'react';
import { Typography, Stack } from '@mui/material';
import { ZuSwitch } from 'components/core';
import { GroupIcon, QRCodeIcon } from '@/components/icons';
import { ZuButton } from 'components/core';
import { useAccount } from 'wagmi';
import { scroll, scrollSepolia } from 'viem/chains';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { TICKET_FACTORY_ABI } from '@/utils/ticket_factory_abi';
import { client, config } from '@/context/WalletContext';
import { isDev } from '@/constant';
import {
  TICKET_FACTORY_ADDRESS,
  mUSDC_TOKEN,
  mUSDT_TOKEN,
  ticketFactoryGetContract,
} from '@/constant';
import { Address } from 'viem';
import { convertDateToEpoch } from '@/utils/format';
import { Event } from '@/types';
import { ethers } from 'ethers';
import { useCeramicContext } from '@/context/CeramicContext';
import { updateContractID } from '@/services/event/addContractID';
import Dialog from '@/app/spaces/components/Modal/Dialog';

interface PropTypes {
  event?: Event;
  visible?: boolean;
}
const TicketHeader = ({ event, visible }: PropTypes) => {
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
      <Dialog
        title="Added"
        message="You can create ticekts now."
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={() => {
          setShowModal(false);
        }}
      />
      <Dialog
        showModal={blockClickModal}
        showActions={false}
        title="Updating"
        message="Please wait while the data is being updated..."
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
      >
        <Typography variant="h5" color="white">
          Ticketing
        </Typography>
        <Typography variant="body2" color="white">
          Total Sold: 18
        </Typography>
      </Stack>
      <Stack direction="row" spacing="20px">
        <Stack
          direction="row"
          spacing="10px"
          bgcolor="#2d2d2d"
          borderRadius="10px"
          padding="10px"
          flex={1}
        >
          <ZuSwitch
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <Stack direction="column">
            <Typography variant="subtitleSB">Registration Status</Typography>
            <Typography variant="caption">CLOSED</Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing="10px"
          bgcolor="#2d2d2d"
          borderRadius="10px"
          padding="10px"
          flex={1}
        >
          <GroupIcon size={8} />
          <Stack direction="column">
            <Typography variant="subtitleSB">Event Capacity</Typography>
            <Typography variant="caption">SETTING COMING SOON</Typography>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          spacing="10px"
          bgcolor="#2d2d2d"
          borderRadius="10px"
          padding="10px"
          flex={1}
        >
          <QRCodeIcon />
          <Stack direction="column">
            <Typography variant="subtitleSB">Scan QR Code</Typography>
            <Typography variant="caption">No tracks</Typography>
          </Stack>
        </Stack>
      </Stack>
      {visible ? (
        <ZuButton
          onClick={() => {
            createEventID();
          }}
        >
          Use NFT Tickets
        </ZuButton>
      ) : null}
    </Stack>
  );
};

export default TicketHeader;
