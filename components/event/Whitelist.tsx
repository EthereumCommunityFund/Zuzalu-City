import React, { useState, useEffect } from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import {
  ArrowUpLeftIcon,
  RightArrowIcon,
  ScrollIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
} from '@/components/icons';
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
import { Event, Contract } from '@/types';
interface IProps {
  setIsVerify?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsAgree?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsMint?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsTransaction?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsComplete?: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleClose?: () => void;
  eventContractID?: number;
  setFilteredResults?: React.Dispatch<React.SetStateAction<any[]>>;
  filteredResults?: any[];
  event?: Event;
  tokenId?: string;
  setTokenId?: React.Dispatch<React.SetStateAction<string>> | any;
  ticketMinted?: any[];
  setTicketMinted?: React.Dispatch<React.SetStateAction<any[]>> | any;
}

export const Verify: React.FC<IProps> = ({
  setIsVerify,
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
      //setVerifying(true);
      const getTicketAddresses = (await client.readContract({
        address: TICKET_FACTORY_ADDRESS as Address,
        abi: TICKET_FACTORY_ABI as Abi,
        functionName: 'getTickets',
        args: [eventContractID],
      })) as Array<string>;
      setTicketAddresses(getTicketAddresses);
      if (getTicketAddresses?.length > 0) {
        let results = [];
        let whitelistResults = [];
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

            const isWhitelisted = await client.readContract({
              address: ticketAddress,
              abi: TICKET_WITH_WHITELIST_ABI as Abi,
              functionName: 'isWhitelisted',
              args: [address],
            });

            if (isWhitelisted) {
              whitelistResults.push(ticketAddress);
            }
          }

          const result = await client.multicall({
            contracts: multicallContracts,
          });
          results.push({ ticketAddress, data: result });
        }
        const filteredResults = results.filter((result) =>
          whitelistResults.includes(result.ticketAddress),
        );

        const transformedResults = filteredResults.map((result) => {
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
    setIsConnect(false);
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
          <Typography variant="subtitleLB">Connect Wallet</Typography>
          {isConnect ? (
            <Stack spacing="10px">
              <Typography variant="bodyBB" textAlign="center">
                Verify your address
              </Typography>
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
                Verify
              </ZuButton>
            </Stack>
          ) : verifying ? (
            <Stack paddingY="20px" bgcolor="#FFFFFF0D" borderRadius="10px">
              <Typography variant="subtitleS" textAlign="center">
                Verifying address
              </Typography>
            </Stack>
          ) : validate ? (
            <>
              <Stack paddingY="20px" bgcolor="#7DFFD10D" borderRadius="10px">
                <Typography
                  variant="subtitleS"
                  textAlign="center"
                  color="#7DFFD1"
                  sx={{ opacity: 0.7 }}
                >
                  Validated!
                </Typography>
              </Stack>
              <ZuButton
                startIcon={<RightArrowIcon color="#67DBFF" />}
                onClick={() => setIsVerify(true)}
                sx={{
                  width: '100%',
                  color: '#67DBFF',
                  backgroundColor: '#67DBFF33',
                  border: 'border: 1px solid rgba(103, 219, 255, 0.20)',
                }}
              >
                Next
              </ZuButton>
            </>
          ) : (
            <Stack spacing="10px">
              <Stack paddingY="20px" bgcolor="#FFFFFF0D" borderRadius="10px">
                <Typography
                  variant="subtitleS"
                  textAlign="center"
                  color="#FF5E5E"
                >
                  Address invalid. Please connect a valid address.
                </Typography>
              </Stack>
              <ZuButton
                startIcon={<RightArrowIcon color="#67DBFF" />}
                onClick={() => setIsConnect(false)}
                sx={{
                  width: '100%',
                  color: '#67DBFF',
                  backgroundColor: '#67DBFF33',
                  border: 'border: 1px solid rgba(103, 219, 255, 0.20)',
                }}
              >
                Connect
              </ZuButton>
            </Stack>
          )}
          <Stack direction="row" spacing="10px" justifyContent="center">
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              TICKETING PROTOCOL:
            </Typography>
            <ScrollIcon />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const Agree: React.FC<IProps> = ({ setIsVerify, setIsAgree }) => {
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
          <Typography variant="subtitleLB">Attendees Must Know,</Typography>
          <Stack spacing="10px" paddingX="10px">
            <Typography variant="subtitleMB" sx={{ opacity: 0.8 }}>
              Artificial Intelligence (AI) Disclaimer
            </Typography>
            <Typography
              variant="bodyB"
              sx={{ opacity: 0.7 }}
              height="550px"
              overflow="scroll"
            >
              If your company publishes content generated by artificial
              intelligence (AI) or machine learning models, consider adding an
              AI disclaimer to your site to differentiate it from your
              human-created content. Over the past few years, AI technology
              quickly advanced and become more accessible to the everyday
              internet user. For example, businesses can now use AI to create
              customized icons or quickly write blog posts using AI for their
              websites. And that&apos;s just a few examples from a
              rapidly-growing toolset. As exciting as this is, the U.S.
              Copyright Office released an AI Policy Guidance in the Spring of
              2023 stating that you must disclaim any purely AI-created
              materials from your copyright application. Plus, your consumers
              also prefer knowing the difference. We suggest including a
              disclaimer on your website or app that explains what parts of your
              platform were created by people and the specific content, logos,
              or other features you made using AI. Confidentiality Disclaimer
              aka Email Disclaimer Confidentiality disclaimers, also known as
              email disclaimers, explain that some content is only intended to
              be seen by a certain audience — for example, private information
              in an email. Digital communication offers more opportunities for
              confidential information to be exposed or intercepted. A
              confidentiality disclaimer states who the message is for, why the
              recipient should not forward it to others, and who they should
              contact if they receive it by mistake. Email hosting company Zoho
              offers a sample disclaimer to include in an email signature: This
              message contains confidential information and is intended only for
              the individual named. If you are not the named addressee, you
              should not disseminate, distribute or copy this email. You cannot
              use or forward any attachments in the email. Please notify the
              sender immediately by email if you have received this email by
              mistake and delete this email from your system. Company X, Suite#
              1, Street, City, Country, www.company.com Confidentiality
              disclaimers are commonly used in law, education, and healthcare —
              industries that rely on the transfer of sensitive information. For
              example, they&apos;re useful in situations where a business needs
              to ensure attorney-client privilege, safeguard sensitive personal
              data, or protect private health records. If you send emails
              containing protected health information to US medical patients, a
              confidentiality disclaimer is required to comply with the Health
              Insurance Portability and Accountability Act (HIPAA). The
              screenshot below shows a HIPPA email disclaimer sample from the
              University of Miami. Standard disclaimer text like this can help
              meet HIPAA&apos;s list of precautions for emails. If your business
              sends certain confidential information by email, add a
              confidentiality disclaimer to all electronic communications to
              comply with the law or just to ensure your messages are only seen
              by the intended audience. Warranty Disclaimer To explain that
              sellers and service providers are not bound by any implied
              promises about their products in the event of failures or defects,
              add warranty disclaimers to your website or app. These statements
              vary depending on the nature of your business but typically
              explain that a product or service is offered “as is” — implying
              that the customer or user accepts it in its current condition,
              including any unseen faults. For websites and apps, warranty
              disclaimers state that the company makes no promises about the
              accuracy and reliability of the content it publishes. Below, see
              an example from our warranty disclaimer template.
            </Typography>
          </Stack>
          <ZuButton
            startIcon={<RightArrowIcon color="#67DBFF" />}
            onClick={() => {
              setIsVerify(false);
              setIsAgree(true);
            }}
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

export const Mint: React.FC<IProps> = ({
  setIsAgree,
  setIsMint,
  filteredResults = [],
  event,
  setTokenId,
  setTicketMinted,
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
        contract.type === 'Attendee';
      return isMatch;
    });
    return match;
  });
  const findMatchingContract = (
    contracts: Contract[],
    ticketAddress: string,
  ): Contract | undefined => {
    return contracts.find(
      (contract) =>
        contract.contractAddress?.trim().toLowerCase() ===
        ticketAddress.trim().toLowerCase(),
    );
  };
  const handleMintTicket = async (
    ticketAddress: Address,
    tokenAddress: Address,
    ticketPrice: number,
    eventContract: Contract,
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
        const metadata = generateNFTMetadata(
          ticketAddress,
          'NFT ticket',
          eventContract.image_url as string,
          [
            {
              name: 'Event',
              value: 'Exclusive Event',
            },
            {
              name: 'Type',
              value: 'Attendee',
            },
          ],
        );
        const metadataFile = createFileFromJSON(metadata, 'metaData');
        const tags = [{ name: 'Content-Type', value: 'application/json' }];
        const uploadedID = await gaslessFundAndUpload(
          metadataFile,
          tags,
          'EVM',
        );
        const ABI = TICKET_WITH_WHITELIST_ABI;
        const MintHash = await writeContract(config, {
          chainId: scrollSepolia.id,
          address: ticketAddress,
          functionName: 'purchaseTicket',
          abi: ABI,
          args: [address, `https://devnet.irys.xyz/${uploadedID}`, address],
        });

        const { status: MintStatus, logs: MintLogs } =
          await waitForTransactionReceipt(config, {
            hash: MintHash,
            timeout: 6000_000,
          });

        if (MintStatus === 'success') {
          if (MintLogs.length > 0) {
            setTokenId(BigInt(MintLogs[3].data).toString());
            setIsAgree(false);
            setIsMint(true);
          }
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
                  onClick={() => {
                    const matchingContract = findMatchingContract(
                      event?.contracts as Contract[],
                      ticket[0],
                    );
                    if (matchingContract) {
                      handleMintTicket(
                        ticket[0],
                        ticket[3].result,
                        Number(ticket[4].result),
                        matchingContract,
                      );
                      setTicketMinted(ticket);
                    } else {
                      console.error(
                        'No matching contract found for ticket address:',
                        ticket[0],
                      );
                    }
                  }}
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

export const Transaction: React.FC<IProps> = ({
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

export const Complete: React.FC<IProps> = ({
  setIsTransaction,
  setIsComplete,
  handleClose,
  tokenId,
  ticketMinted,
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
          <Stack direction="row" alignItems="center" spacing="20px">
            <Typography variant="bodyM">Contract Address:</Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
              {ticketMinted ? ticketMinted[0] : ''}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing="20px">
            <Typography variant="bodyMB">Token_ID:</Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
              {tokenId}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing="20px">
            <Typography variant="bodyMB">
              Ticket mint successfully, Feel free to add this NFT(SBT) into your
              wallet
            </Typography>
          </Stack>
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
        <Stack spacing="10px" alignItems="center">
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
