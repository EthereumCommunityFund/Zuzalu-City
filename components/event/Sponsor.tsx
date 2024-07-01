import { Stack, Typography, Box, Divider } from '@mui/material';
import {
  ArrowUpLeftIcon,
  RightArrowIcon,
  ScrollIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
} from '@/components/icons';
import React, { useState, useEffect } from 'react';
import { TICKET_FACTORY_ABI } from '@/utils/ticket_factory_abi';
import { client, config } from '@/context/WalletContext';
import { useAccount } from 'wagmi';
import {
  TICKET_FACTORY_ADDRESS,
  mUSDC_TOKEN,
  mUSDT_TOKEN,
  ticketFactoryGetContract,
} from '@/constant';
import { Address } from 'viem';
import dayjs, { Dayjs } from 'dayjs';
import { convertDateToEpoch } from '@/utils/format';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { TICKET_WITH_WHITELIST_ABI } from '@/utils/ticket_with_whitelist_abi';
import { Abi, AbiItem } from 'viem';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { scrollSepolia } from 'viem/chains';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { ZuButton, ZuInput } from '@/components/core';
import gaslessFundAndUpload from '@/utils/gaslessFundAndUpload';
import { generateNFTMetadata } from '@/utils/generateNFTMetadata';
import { createFileFromJSON } from '@/utils/generateNFTMetadata';
import { fetchEmailJsConfig } from '@/utils/emailService';
import { Event } from '@/types';
interface IProps {
  setIsAgree?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsMint?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsTransaction?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsComplete?: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleClose?: () => void;
  eventContractID?: number;
  setFilteredResults?: React.Dispatch<React.SetStateAction<any[]>>;
  filteredResults?: any[];
  event?: Event;
}

export const SponsorAgree: React.FC<IProps> = ({
  setIsAgree,
  eventContractID,
  setFilteredResults,
}) => {
  const [isConnect, setIsConnect] = useState<boolean>(true);
  const [validate, setValidate] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ticketAddresses, setTicketAddresses] = useState<Array<string>>([]);
  const [tickets, setTickets] = useState<Array<any>>([]);
  const { address } = useAccount();

  const readFromContract = async () => {
    try {
      // setVerifying(true);
      const getTicketAddresses = (await client.readContract({
        address: TICKET_FACTORY_ADDRESS as Address,
        abi: TICKET_FACTORY_ABI as Abi,
        functionName: 'getTickets',
        args: [eventContractID],
      })) as Array<string>;
      setTicketAddresses(getTicketAddresses);

      let results = [];

      if (getTicketAddresses?.length > 0) {
        for (let i = 0; i < getTicketAddresses.length; i++) {
          const ticketAddress = getTicketAddresses[i] as Address;
          let isWhitelistTicket = false;

          try {
            await client.readContract({
              address: ticketAddress,
              abi: TICKET_WITH_WHITELIST_ABI as Abi,
              functionName: 'whitelist',
              args: ['0x0000000000000000000000000000000000000000'],
            });
            isWhitelistTicket = true;
          } catch (e) {
            isWhitelistTicket = false;
          }

          const ticketABI: AbiItem[] = isWhitelistTicket
            ? (TICKET_WITH_WHITELIST_ABI as AbiItem[])
            : (TICKET_ABI as AbiItem[]);

          const ticketContract = {
            address: ticketAddress,
            abi: ticketABI,
          } as const;

          const multicallContracts = [
            {
              ...ticketContract,
              functionName: 'name',
            },
            {
              ...ticketContract,
              functionName: 'symbol',
            },
            {
              ...ticketContract,
              functionName: 'paymentToken',
            },
            {
              ...ticketContract,
              functionName: 'ticketPrice',
            },
            {
              ...ticketContract,
              functionName: 'totalTicketsMinted',
            },
            {
              ...ticketContract,
              functionName: 'eventTime',
            },
            {
              ...ticketContract,
              functionName: 'ticketMintCloseTime',
            },
            {
              ...ticketContract,
              functionName: 'owner',
            },
          ];

          if (isWhitelistTicket) {
            multicallContracts.push(
              {
                ...ticketContract,
                functionName: 'whitelist',
                args: ['0x0000000000000000000000000000000000000000'] as const,
              } as any,
              {
                ...ticketContract,
                functionName: 'getWhitelistAddresses',
              } as any,
            );
          }

          const result = await client.multicall({
            contracts: multicallContracts,
          });
          results.push({ ticketAddress, data: result });
        }

        const transformedResults = results.map((result) => {
          const newData = [result.ticketAddress, ...result.data];
          return newData;
        });

        setTickets(transformedResults);
        if (setFilteredResults) {
          setFilteredResults(transformedResults);
        }
      }
    } catch (error) {
      console.error('Error reading from contract', error);
    } finally {
      setVerifying(false);
    }
  };
  const handleConnect = async () => {
    await readFromContract();
    setIsAgree(true);
  };
  return (
    <Stack>
      <Stack
        padding="20px"
        spacing="10px"
        borderBottom="1px solid #383838"
        bgcolor="#262626"
      >
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box
            component="img"
            height="30px"
            width="30px"
            borderRadius="2px"
            src="/14.webp"
          />
          <Typography variant="subtitleLB">EventName</Typography>
        </Stack>
        <Typography variant="bodyS" color="#FF9C66">
          Disclaimer: the ticketing system is in beta, please take caution
          moving forward
        </Typography>
      </Stack>
      <Stack padding="20px" height="100vh">
        <Stack
          padding="20px"
          border="1px solid #383838"
          bgcolor="#262626"
          spacing="20px"
          borderRadius="10px"
        >
          <Typography variant="subtitleLB">Sponsors Must Know,</Typography>
          <Stack spacing="10px" paddingX="10px">
            <Typography variant="subtitleMB" sx={{ opacity: 0.8 }}>
              Artificial Intelligence (AI) Disclaimer
            </Typography>
            <Typography variant="bodyB" sx={{ opacity: 0.7 }} height="550px">
              If your company publishes content generated by artificial
              intelligence (AI) or machine learning models, consider adding an
              AI disclaimer to your site to differentiate it from your
              human-created content.
            </Typography>
          </Stack>
          <ZuButton
            startIcon={<RightArrowIcon color="#67DBFF" />}
            onClick={handleConnect}
            sx={{
              width: '100%',
              color: '#67DBFF',
              backgroundColor: '#67DBFF33',
              border: 'border: 1px solid rgba(103, 219, 255, 0.20)',
            }}
          >
            Agree and Continue
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const SponsorMint: React.FC<IProps> = ({
  setIsAgree,
  setIsMint,
  filteredResults = [],
  event,
}) => {
  const [awaiting, setAwaiting] = useState<boolean>(false);
  const { address } = useAccount();
  const filteredTickets = filteredResults.filter((ticket) => {
    const contractAddress = ticket[0].trim().toLowerCase();
    const match = event?.contracts?.some((contract) => {
      if (!contract.contractAddress) {
        return false;
      }
      const normalizedContractAddress = contract.contractAddress
        .trim()
        .toLowerCase();
      const isMatch =
        normalizedContractAddress === contractAddress &&
        contract.type === 'Sponsor';
      return isMatch;
    });
    return match;
  });
  const handleMintTicket = async (
    ticketAddress: Address,
    tokenAddress: Address,
    ticketPrice: number,
  ) => {
    try {
      const approveHash = await writeContract(config, {
        chainId: scrollSepolia.id,
        address: tokenAddress,
        functionName: 'approve',
        abi: ERC20_ABI,
        args: [ticketAddress, ticketPrice],
      });
      const { status: approveStatus } = await waitForTransactionReceipt(
        config,
        {
          hash: approveHash,
        },
      );

      if (approveStatus === 'success') {
        const metadata = generateNFTMetadata(ticketAddress, 'NFT ticket', '', [
          {
            name: 'Event',
            value: 'Exclusive Event',
          },
          {
            name: 'Type',
            value: 'Attendee',
          },
        ]);
        const metadataFile = createFileFromJSON(metadata, 'metaData');
        const tags = [{ name: 'Content-Type', value: 'application/json' }];
        const uploadedID = await gaslessFundAndUpload(
          metadataFile,
          tags,
          'EVM',
        );
        const ABI = TICKET_ABI;
        const MintHash = await writeContract(config, {
          chainId: scrollSepolia.id,
          address: ticketAddress,
          functionName: 'purchaseTicket',
          abi: ABI,
          args: [address, `https://devnet.irys.xyz/${uploadedID}`, address],
        });

        const { status: adminMintStatus } = await waitForTransactionReceipt(
          config,
          {
            hash: MintHash,
            timeout: 6000_000,
          },
        );

        if (adminMintStatus === 'success') {
          setIsAgree(false);
          setIsMint(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Stack>
      <Stack
        padding="20px"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
        spacing="20px"
      >
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box
            component="img"
            height="30px"
            width="30px"
            borderRadius="2px"
            src="/14.webp"
          />
          <Typography variant="subtitleLB">EventName</Typography>
        </Stack>
        <Typography variant="bodyS" color="#FF9C66">
          Disclaimer: the ticketing system is in beta, please take caution
          moving forward
        </Typography>
      </Stack>
      <Stack
        spacing="10px"
        padding="20px"
        height="auto"
        sx={{ minHeight: '800px' }}
      >
        <Stack spacing="20px">
          <Typography variant="subtitleLB">Your Ticket</Typography>
          {filteredTickets.map((ticket, index) => (
            <Stack key={index} alignItems="center" spacing="20px">
              <Box
                component="img"
                width="250px"
                height="250px"
                borderRadius="20px"
                src="/26.png"
              />
              <Stack
                border="1px solid #383838"
                borderRadius="20px"
                divider={<Divider sx={{ border: '1px solid #383838' }} />}
                spacing="10px"
                padding="20px"
              >
                {ticket[1] && (
                  <Stack direction="row" spacing="10px">
                    <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                      Ticket Name:
                    </Typography>
                    <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                      {ticket[1].result.toString()}
                    </Typography>
                  </Stack>
                )}
                {ticket[4] && (
                  <Stack direction="row" spacing="10px">
                    <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                      Ticket Price:
                    </Typography>
                    <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                      {(ticket[4].result / BigInt(10 ** 18)).toString()}
                    </Typography>
                  </Stack>
                )}
                <ZuButton
                  startIcon={<RightArrowIcon color="#67DBFF" />}
                  onClick={() =>
                    handleMintTicket(
                      ticket[0],
                      ticket[3].result,
                      Number(ticket[4].result),
                    )
                  }
                  sx={{
                    width: '100%',
                    color: '#67DBFF',
                    backgroundColor: '#67DBFF33',
                    border: 'border: 1px solid rgba(103, 219, 255, 0.20)',
                  }}
                >
                  Mint Ticket
                </ZuButton>
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Typography
          variant="bodyS"
          color="#FF9C66"
          sx={{ opacity: 0.8 }}
          textAlign="center"
        >
          Make sure to also have native tokens in your wallet to finalize the
          transaction
        </Typography>
        <Stack direction="row" spacing="10px" justifyContent="center">
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            TICKETING PROTOCOL:
          </Typography>
          <ScrollIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export const SponsorTransaction: React.FC<IProps> = ({
  setIsMint,
  setIsTransaction,
  handleClose,
}) => {
  const [isWait, setIsWait] = useState<boolean>(false);

  return (
    <Stack>
      <Stack
        padding="20px"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
        spacing="20px"
      >
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box
            component="img"
            height="30px"
            width="30px"
            borderRadius="2px"
            src="/14.webp"
          />
          <Typography variant="subtitleLB">EventName</Typography>
        </Stack>
        <Typography variant="bodyS" color="#FF9C66">
          Disclaimer: the ticketing system is in beta, please take caution
          moving forward
        </Typography>
      </Stack>
      <Stack padding="20px" height="100vh">
        {isWait ? (
          <Stack
            padding="20px"
            spacing="30px"
            border="1px solid #383838"
            bgcolor="#262626"
            borderRadius="10px"
          >
            <Typography variant="subtitleLB">
              Sign in Wallet define data that they interacting with contract
            </Typography>
            <Stack paddingY="20px" bgcolor="#FFFFFF0D" borderRadius="10px">
              <Typography variant="subtitleS" textAlign="center">
                Awaiting transaction...
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" justifyContent="center">
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                TICKETING PROTOCOL:
              </Typography>
              <ScrollIcon />
            </Stack>
          </Stack>
        ) : (
          <Stack
            padding="20px"
            spacing="30px"
            border="1px solid #383838"
            bgcolor="#262626"
            borderRadius="10px"
          >
            <Typography variant="subtitleLB">
              Sign in Wallet define data that they interacting with contract
            </Typography>
            <Stack
              paddingY="20px"
              bgcolor="#FFFFFF0D"
              borderRadius="10px"
              onClick={() => {
                setIsMint(false);
                setIsTransaction(true);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitleS" textAlign="center">
                Transaction Complete!
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" justifyContent="center">
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                TICKETING PROTOCOL:
              </Typography>
              <ScrollIcon />
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export const SponsorComplete: React.FC<IProps> = ({
  setIsTransaction,
  setIsComplete,
  handleClose,
}) => {
  const [view, setView] = useState<boolean>(false);
  return (
    <Stack>
      <Stack
        padding="20px"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
        spacing="20px"
      >
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box
            component="img"
            height="30px"
            width="30px"
            borderRadius="2px"
            src="/14.webp"
          />
          <Typography variant="subtitleLB">EventName</Typography>
        </Stack>
        <Typography variant="bodyS" color="#FF9C66">
          Disclaimer: the ticketing system is in beta, please take caution
          moving forward
        </Typography>
      </Stack>
      <Stack padding="20px" spacing="30px" alignItems="center" height="100vh">
        <Typography variant="subtitleLB">Congrats, you received</Typography>
        <Box
          component="img"
          width="250px"
          height="250px"
          borderRadius="20px"
          src="/26.png"
        />
        <Stack
          borderRadius="10px"
          border="1px solid #383838"
          width="100%"
          sx={{ cursor: 'pointer' }}
          onClick={() => setView((prev) => !prev)}
        >
          {!view ? (
            <Stack
              direction="row"
              spacing="10px"
              padding="10px 20px"
              justifyContent="center"
            >
              <Typography variant="bodyM">View Transaction Details</Typography>
              <ChevronDownIcon size={4.5} />
            </Stack>
          ) : (
            <Stack padding="20px" spacing="10px">
              <Stack direction="row" spacing="10px" justifyContent="center">
                <Typography variant="bodyM">
                  Close Transaction Details
                </Typography>
                <ChevronUpIcon size={4.5} />
              </Stack>
              <Stack
                border="1px solid #383838"
                borderRadius="20px"
                divider={<Divider sx={{ border: '1px solid #383838' }} />}
                spacing="10px"
                padding="20px"
              >
                <Stack direction="row" spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Ticket:
                  </Typography>
                  <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                    Full Pass
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Secondary Option:
                  </Typography>
                  <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                    Shared Room
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Contributing Amount to Mint:
                  </Typography>
                  <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                    0000 USDT
                  </Typography>
                </Stack>
                <Stack spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Ticket Description
                  </Typography>
                  <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                    Get ready to groove at the Summer Music Festival! Join us
                    for a day filled with live music, food trucks, and good
                    vibes.
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
        <ZuButton
          startIcon={<ArrowUpLeftIcon size={5} color="#67DBFF" />}
          onClick={() => {
            setIsTransaction(false);
            setIsComplete(false);
          }}
          sx={{ width: '100%', backgroundColor: '#2c383b', color: '#67DBFF' }}
        >
          Back to Event View
        </ZuButton>
        <Stack
          spacing="10px"
          alignItems="center"
          bgcolor="rgba(255, 94, 94, 0.10)"
          width="100%"
          padding="8px 14px"
          borderRadius="10px"
          border="border: 1px solid rgba(255, 94, 94, 0.20)"
        >
          <HeartIcon color="#FF5E5E" />
          <Typography variant="bodyMB" color="#FF5E5E" textAlign="center">
            Donate to the Event
          </Typography>
          <Typography variant="bodyBB">
            Send your donated tokens to zuvillage.eth
          </Typography>
        </Stack>
        <Stack direction="row" spacing="10px" justifyContent="center">
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            TICKETING PROTOCOL:
          </Typography>
          <ScrollIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};
