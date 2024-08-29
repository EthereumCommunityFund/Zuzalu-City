import React, { useState } from 'react';
import {
  Stack,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowUpLeftIcon,
  RightArrowIcon,
  ScrollIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  GoToExplorerIcon,
  CopyIcon,
} from '@/components/icons';
import { TICKET_FACTORY_ABI } from '@/utils/ticket_factory_abi';
import { client, config } from '@/context/WalletContext';
import { useAccount, useSwitchChain } from 'wagmi';
import {
  TICKET_FACTORY_ADDRESS,
  mUSDT_TOKEN,
  isDev,
  SCROLL_EXPLORER,
} from '@/constant';
import { Address } from 'viem';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { TICKET_WITH_WHITELIST_ABI } from '@/utils/ticket_with_whitelist_abi';
import { Abi, AbiItem } from 'viem';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { scroll, scrollSepolia } from 'viem/chains';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { ZuButton } from '@/components/core';
import gaslessFundAndUpload from '@/utils/gaslessFundAndUpload';
import { generateNFTMetadata } from '@/utils/generateNFTMetadata';
import { createFileFromJSON } from '@/utils/generateNFTMetadata';
import { Event, Contract } from '@/types';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import { useConnectModal } from '@rainbow-me/rainbowkit';

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
  mintedContract?: Contract;
  setMintedContract?: React.Dispatch<React.SetStateAction<Contract>> | any;
  transactionLog?: any;
  setTransactionLog?: React.Dispatch<React.SetStateAction<any>> | any;
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
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();

  const readFromContract = async () => {
    try {
      setVerifying(true);
      const chainId = isDev ? scrollSepolia.id : scroll.id;
      await switchChainAsync({
        chainId,
      });
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
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
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
          <Typography variant="subtitleLB">ZuVillage Georgia</Typography>
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
                startIcon={
                  verifying ? null : <RightArrowIcon color="#67DBFF" />
                }
                onClick={handleConnect}
                sx={{
                  width: '100%',
                  color: '#67DBFF',
                  backgroundColor: '#67DBFF33',
                  border: 'border: 1px solid rgba(103, 219, 255, 0.20)',
                }}
                disabled={verifying}
              >
                {verifying ? <CircularProgress size={24.5} /> : 'Verify'}
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
    <Stack height="calc(100vh - 50px)">
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
          <Typography variant="subtitleLB">ZuVillage Georgia</Typography>
        </Stack>
        <Typography variant="bodyS" color="#FF9C66">
          Disclaimer: the ticketing system is in beta, please take caution
          moving forward
        </Typography>
      </Stack>
      <Stack padding="20px" overflow="hidden">
        <Stack
          padding="20px"
          border="1px solid #383838"
          bgcolor="#262626"
          spacing="20px"
          borderRadius="10px"
          height="100%"
        >
          <Typography variant="subtitleLB">Attendees Must Know,</Typography>
          <Stack spacing="10px" paddingX="10px" sx={{ overflowY: 'scroll' }}>
            <Typography variant="subtitleMB" sx={{ opacity: 0.8 }}>
              Ticketing Disclaimer
            </Typography>
            <Typography
              variant="bodyB"
              sx={{ opacity: 0.7 }}
              height="550px"
              overflow="scroll"
            >
              By confirming your attendance, you agree to the following points:
              ZuVillage is an experimental digital community that gathers in
              real life at a private event. By sending the contributions or by
              participating in any other way, each individual explicitly agrees
              to assume full personal liability for their actions within the
              experiment, both digitally and in the analogue world, and that no
              entity or individual, other than the participant themselves, may
              be held accountable for any occurrences or outcomes related to the
              experiment. In order for participants to invite a guest, the guest
              also has to agree to this agreement. By inviting a guest,
              participants explicitly agree to assume full personal liability
              for the actions of the guest within the experiment, both digitally
              and in the analogue world, and that no entity or individual, other
              than the participant or the guest themselves, may be held
              accountable for any occurrences or outcomes related to the
              experiment. Privacy: All individuals that participate in the
              experiment need to agree to our Privacy Policy. Software Use
              Disclosure: The software, including Zuzalu.city and associated
              tools utilized in the experiment, is currently in alpha stage and
              is being tested by select communities. Participants and guests
              acknowledge that the software may suffer from technical failures.
              Participants and guests agree to use the software understanding
              these risks. It will not be required for participants to share
              personal data with the group on the software. Participants and
              guests will receive a ZK key, which is a technical necessary to
              use most of the software. Receiving the key does not legally
              translate into usage rights to the software or access rights to
              the venue. ZuVillage may decide to also hand out similar digital
              goods like additional NFTs. In this case, receiving these digital
              goods does also not legally translate into usage rights to the
              software or the right to access the venue. Contributions: All
              contributions made by participants or guests to the ZuVillage
              experiment are made solely to support the experiment, on purely
              voluntary basis and are to be considered non-refundable.
              Contributors acknowledge that these are donated in order to
              support the ZuVillage community to facilitate the experimental
              objectives and accept that all contributions are final. This
              affects contributions of cryptocurrencies as well as all other
              forms of active or passive contributions towards ZuVillage. By
              making contributions that carry intellectual property or
              potentially lead to the generation of intellectual property, the
              contribution is seen as limited to allowance for usage. Especially
              if intellectual property includes personal data, like generated
              data in scientific experiments that participants opt-in to take
              part, it is up to the involved individuals and participants to
              agree over any issues of intellectual property on their own.
              ZuVillage is not able to own intellectual property of any sort and
              is not able to participate in any dispute over intellectual
              property.
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
  setIsTransaction,
  setMintedContract,
  setTransactionLog,
}) => {
  const [awaiting, setAwaiting] = useState<boolean>(false);
  const { address } = useAccount();
  const [blockMintClickModal, setBlockMintClickModal] = useState(false);
  const [blockTokenClickModal, setBlockTokenClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { switchChainAsync } = useSwitchChain();

  const filteredTickets = filteredResults
    .map((ticket) => {
      const contractAddress = ticket[0].trim().toLowerCase();
      const matchingContract = event?.contracts?.find((contract) => {
        if (!contract.contractAddress) {
          return false;
        }
        const normalizedContractAddress = contract.contractAddress
          .trim()
          .toLowerCase();
        return (
          normalizedContractAddress === contractAddress &&
          contract.type === 'Attendee'
        );
      });
      return matchingContract ? { ticket, matchingContract } : null;
    })
    .filter(Boolean);
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
      setIsMinting(true);
      const chainId = isDev ? scrollSepolia.id : scroll.id;
      await switchChainAsync({
        chainId,
      });
      const approveHash = await writeContract(config, {
        chainId,
        address: tokenAddress,
        functionName: 'approve',
        abi: ERC20_ABI,
        args: [ticketAddress, ticketPrice],
      });
      setBlockTokenClickModal(true);
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
        setBlockTokenClickModal(false);
        const MintHash = await writeContract(config, {
          chainId: isDev ? scrollSepolia.id : scroll.id,
          address: ticketAddress,
          functionName: 'purchaseTicket',
          abi: ABI,
          args: [`https://gateway.irys.xyz/${uploadedID}`],
        });
        console.log(`https://gateway.irys.xyz/${uploadedID}`);
        setBlockMintClickModal(true);
        const { status: MintStatus, logs: MintLogs } =
          await waitForTransactionReceipt(config, {
            hash: MintHash,
            timeout: 6000_000,
          });

        if (MintStatus === 'success') {
          setBlockMintClickModal(false);
          setShowModal(true);
          if (MintLogs.length > 0) {
            setTokenId(BigInt(MintLogs[3].data).toString());
            setTransactionLog(MintHash);
            setIsAgree(false);
            setIsTransaction(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Stack>
      <Dialog
        title="Minted"
        message="Your new NFT ticket is ready."
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={() => {
          setShowModal(false);
        }}
      />
      <Dialog
        showModal={blockTokenClickModal}
        showActions={false}
        title="Approving Tokens"
        message="Please wait until the transaction is finished."
      />
      <Dialog
        showModal={blockMintClickModal}
        showActions={false}
        title="Minting NFT"
        message="Please wait until the transaction is finished."
      />
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
          <Typography variant="subtitleLB">ZuVillage Georgia</Typography>
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
          {filteredTickets.map((item, index) => {
            if (!item) return null;
            const { ticket, matchingContract } = item;
            return (
              <Stack key={index} alignItems="center" spacing="20px">
                <Box
                  component="img"
                  width="250px"
                  height="250px"
                  borderRadius="20px"
                  src={matchingContract.image_url}
                />
                <Stack
                  border="1px solid #383838"
                  borderRadius="20px"
                  width="600px"
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
                        Contributing Amount to Mint:
                      </Typography>
                      <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                        {(ticket[4].result / BigInt(10 ** 18)).toString()}{' '}
                        {ticket[3].result.toString() === mUSDT_TOKEN.toString()
                          ? 'USDT'
                          : 'USDC'}
                      </Typography>
                    </Stack>
                  )}
                  {ticket[0] && (
                    <Stack direction="row" spacing="10px">
                      <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                        Ticket Description:
                      </Typography>
                      <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                        {matchingContract.description}
                      </Typography>
                    </Stack>
                  )}
                  <ZuButton
                    startIcon={
                      isMinting ? null : <RightArrowIcon color="#67DBFF" />
                    }
                    onClick={() => {
                      handleMintTicket(
                        ticket[0],
                        ticket[3].result,
                        Number(ticket[4].result),
                        matchingContract,
                      );
                      setTicketMinted(ticket);
                      setMintedContract(matchingContract);
                    }}
                    sx={{
                      width: '100%',
                      color: '#67DBFF',
                      backgroundColor: '#67DBFF33',
                      border: 'border: 1px solid rgba(103, 219, 255, 0.20)',
                    }}
                    disabled={isMinting}
                  >
                    Mint Ticket
                  </ZuButton>
                </Stack>
              </Stack>
            );
          })}
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
          <Typography variant="subtitleLB">ZuVillage Georgia</Typography>
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
            <Typography variant="subtitleLB">NFT Minting!</Typography>
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
            <Typography variant="subtitleLB">NFT Minted! </Typography>
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
  mintedContract,
  transactionLog,
}) => {
  const [view, setView] = useState<boolean>(true);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);

  const truncateHash = (hash: any, startLength = 6, endLength = 6) => {
    if (!hash) return '';
    return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
  };
  const onClose = () => {
    if (handleClose) {
      handleClose();
    }
  };
  return (
    <Stack spacing="20px" padding="20px">
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showCopyToast}
        autoHideDuration={800}
        onClose={() => {
          setShowCopyToast(false);
        }}
      >
        <Alert severity="success" variant="filled">
          Copy success
        </Alert>
      </Snackbar>
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
          <Typography variant="subtitleLB">ZuVillage Georgia</Typography>
        </Stack>
        <Typography variant="bodyS" color="#FF9C66">
          Disclaimer: the ticketing system is in beta, please take caution
          moving forward
        </Typography>
      </Stack>
      {ticketMinted && (
        <Stack padding="20px" spacing="10px" alignItems="center">
          <Typography variant="subtitleLB">Congrats, you received</Typography>
          <Stack width="100%" spacing="10px" sx={{ cursor: 'pointer' }}>
            <Stack alignItems="center" spacing="20px">
              <Box
                component="img"
                width="250px"
                height="250px"
                src={mintedContract?.image_url}
              />
              <Stack
                borderRadius="20px"
                border="1px solid #383838"
                width="600px"
                divider={<Divider sx={{ border: '1px solid #383838' }} />}
                spacing="10px"
                padding="20px"
              >
                <Stack direction="row" spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Ticket Name:
                  </Typography>
                  <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                    {ticketMinted[1].result.toString()}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Contributing Amount to Mint:
                  </Typography>
                  <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                    {(ticketMinted[4].result / BigInt(10 ** 18)).toString()}{' '}
                    {ticketMinted[3].result.toString() ===
                    mUSDT_TOKEN.toString()
                      ? 'USDT'
                      : 'USDC'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing="10px">
                  <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                    Ticket Description:
                  </Typography>
                  <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                    {mintedContract?.description}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Box display="flex" justifyContent="center" width="100%">
              {!view ? (
                <Stack
                  direction="row"
                  spacing="10px"
                  padding="10px 20px"
                  justifyContent="center"
                  borderRadius="20px"
                  width="600px"
                  border="1px solid #383838"
                  onClick={() => setView((prev) => !prev)}
                >
                  <Typography variant="bodyM">
                    View Transaction Details
                  </Typography>
                  <ChevronDownIcon size={4.5} />
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  spacing="10px"
                  padding="10px 20px"
                  justifyContent="center"
                  borderRadius="20px"
                  width="600px"
                  border="1px solid #383838"
                  onClick={() => setView((prev) => !prev)}
                >
                  <Typography variant="bodyM">
                    Close Transaction Details
                  </Typography>
                  <ChevronUpIcon size={4.5} />
                </Stack>
              )}
            </Box>
            {view && (
              <Stack padding="20px" spacing="10px">
                <Stack
                  border="1px solid #383838"
                  borderRadius="20px"
                  divider={<Divider sx={{ border: '1px solid #383838' }} />}
                  spacing="10px"
                  padding="20px"
                >
                  <Stack direction="row" spacing="10px">
                    <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                      Transaction ID:
                    </Typography>
                    <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                      {truncateHash(transactionLog)}
                    </Typography>
                    <Box
                      marginLeft={'4px'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setShowCopyToast(true);
                        navigator.clipboard.writeText(
                          transactionLog.toString(),
                        );
                      }}
                    >
                      <CopyIcon cursor="pointer" />
                    </Box>
                    <Box
                      marginLeft={'4px'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() =>
                        window.open(
                          `${SCROLL_EXPLORER}/tx/${transactionLog.toString()}`,
                          '_blank',
                        )
                      }
                    >
                      <GoToExplorerIcon cursor="pointer" />
                    </Box>
                  </Stack>
                  <Stack spacing="10px">
                    <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                      Ticket mint success. To add this NFT(SBT) to your wallet
                      add the following contract address and token ID in your
                      wallet:
                    </Typography>
                    <Stack direction="row" spacing="10px" alignItems="center">
                      <Typography variant="bodyS" sx={{ opacity: 0.6 }}>
                        Contract Address:
                      </Typography>
                      <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                        {truncateHash(ticketMinted[0].toString())}
                      </Typography>
                      <Box
                        marginLeft={'4px'}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setShowCopyToast(true);
                          navigator.clipboard.writeText(
                            ticketMinted[0].toString(),
                          );
                        }}
                      >
                        <CopyIcon cursor="pointer" />
                      </Box>
                      <Box
                        marginLeft={'4px'}
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          window.open(
                            `${SCROLL_EXPLORER}/address/${ticketMinted[0].toString()}`,
                            '_blank',
                          )
                        }
                      >
                        <GoToExplorerIcon cursor="pointer" />
                      </Box>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing="10px">
                    <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                      Token ID:
                    </Typography>
                    <Typography variant="bodyBB" sx={{ opacity: 0.8 }}>
                      {tokenId}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
      <Box padding="20px" width="100%">
        <ZuButton
          startIcon={<ArrowUpLeftIcon size={5} color="#67DBFF" />}
          onClick={() => {
            setIsTransaction(false);
            setIsComplete(true);
            onClose();
          }}
          sx={{ width: '100%', backgroundColor: '#2c383b', color: '#67DBFF' }}
        >
          Back to Event View
        </ZuButton>
      </Box>
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
  );
};
