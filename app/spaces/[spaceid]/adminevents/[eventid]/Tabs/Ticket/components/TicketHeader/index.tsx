import * as React from 'react';
import { Typography, Stack } from '@mui/material';
import { ZuSwitch } from 'components/core';
import { GroupIcon, QRCodeIcon } from '@/components/icons';
import { ZuButton } from 'components/core';
import { useAccount } from 'wagmi';
import { scrollSepolia } from 'viem/chains';
import { waitForTransactionReceipt, writeContract } from 'wagmi/actions';
import { TICKET_FACTORY_ABI } from '@/utils/ticket_factory_abi';
import { client, config } from '@/context/WalletContext';
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
interface PropTypes {
  event?: Event;
  visible?: boolean;
}
const TicketHeader = ({ event, visible }: PropTypes) => {
  const [isChecked, setIsChecked] = React.useState(true);
  const { ceramic, composeClient, profile } = useCeramicContext();
  const { address } = useAccount();
  const updateEventById = async (contractEventid: number) => {
    const query = `
          mutation {
          updateEvent(input: {id: "${event?.id}", content: {contractID: ${contractEventid}}}) {
            document {
              id
               contractID
            }
          }
        }
    `;

    try {
      const result: any = await composeClient.executeQuery(query);
      console.log(result);
    } catch (err) {
      console.log('ERROR: Update: ', err);
    }
  };
  const createEventID = async () => {
    try {
      const createEventHash = await writeContract(config, {
        chainId: scrollSepolia.id,
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
        await updateEventById(eventTicketId);
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
          Ticketing
        </Typography>
        <Typography variant="body2" color="white">
          Total Sold: 18
        </Typography>
      </Stack>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        <div className="col-span-1 gap-x-4 cursor-pointer p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
          <ZuSwitch
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <Stack direction="column">
            <Typography variant="subtitle2" color="white">
              Registration Status
            </Typography>
            <Typography variant="body2" color="white">
              CLOSED
            </Typography>
          </Stack>
        </div>
        <div className="col-span-1 p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
          <div className="mr-[10px]">
            <GroupIcon />
          </div>
          <div className="">
            <div className="mb-[4px] text-white opacity-50 text-[18px] leading-[120%] font-[700]">
              Event Capacity
            </div>
            <div className="text-[10px] text-white opacity-50">
              SETTING COMING SOON
            </div>
          </div>
        </div>
        <div className="col-span-1 cursor-pointer p-[10px] flex items-center rounded-[10px] bg-[rgba(255,255,255,0.05)]">
          <div className="mr-[10px]">
            <QRCodeIcon />
          </div>
          <div className="">
            <div className="mb-[4px] text-white text-[18px] leading-[120%] font-[700]">
              Scan QR Code
            </div>
            <div className="text-[10px] leading-[120%] text-[rgba(255,255,255,0.7)]">
              No tracks
            </div>
          </div>
        </div>
      </div>
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
