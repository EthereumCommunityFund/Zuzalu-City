import { TICKET_FACTORY_ADDRESS, mUSDC_TOKEN } from '@/constant';
import { client, config } from '@/context/WalletContext';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { TICKET_WITH_WHITELIST_ABI } from '@/utils/ticket_with_whitelist_abi';
import React, { Dispatch, useEffect, useState } from 'react';
import { Address, parseUnits } from 'viem';
import { scrollSepolia } from 'viem/chains';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { ZuButton, ZuInput } from '@/components/core';
import {
  ArrowDownSquare,
  CloseIcon,
  PlusCircleIcon,
  RightArrowIcon,
  ScrollIcon,
  SendIcon,
  ChevronDownIcon,
  XCricleIcon,
  LeftArrowIcon,
  CheckIcon,
  CircleCloseIcon,
  CopyIcon,
  GoToExplorerIcon,
} from '@/components/icons';
import {
  Box,
  Button,
  Input,
  Stack,
  TextField,
  Typography,
  Step,
  Stepper,
  StepLabel,
  Modal,
  List,
  ListItem,
} from '@mui/material';
import gaslessFundAndUpload from '@/utils/gaslessFundAndUpload';
import { generateNFTMetadata } from '@/utils/generateNFTMetadata';
import { createFileFromJSON } from '@/utils/generateNFTMetadata';
import { fetchEmailJsConfig } from '@/utils/emailService';
import { send } from '@emailjs/browser';
interface IProps {
  amount?: string;
  recipient?: string;
}

interface IWithdrawToken {
  tokenSymbol: string;
  balance: number;
  tokenAddress: string;
  ticketAddress: string;
  ticket: Array<any>;
}

interface IConfirmWithdrawalTransaction {
  showWithdrawalModal: boolean;
  setShowWithdrawalModal: Dispatch<React.SetStateAction<boolean>>;
  handleWithdraw: any;
  amount?: string;
  recipient?: string;
}

interface IConfirmSendNFTTicketTransaction {
  showNFTTicketModal: boolean;
  setShowNFTTicketModal: Dispatch<React.SetStateAction<boolean>>;
  handleSendNFTTicket: any;
  tokenId: string;
  recipient: string;
  ticket: Array<any>;
}

interface ISendNFTTicket {
  ticketAddress: string;
  ticket: Array<any>;
}
interface ITicketVault {
  vaultIndex: number;
  ticketAddresses: Array<string>;
  tickets: Array<any>;
}
export const WithdrawToken = ({
  tokenSymbol,
  balance,
  tokenAddress,
  ticketAddress,
  ticket,
}: IWithdrawToken) => {
  const [showWithdrawalModal, setShowWithdrawalModal] = React.useState(false);
  const [withdrawInfo, setWithdrawInfo] = React.useState<IProps>();
  const [decimal, setDecimal] = React.useState<number>(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setWithdrawInfo({
      ...withdrawInfo,
      [name]: value,
    });
  };

  const getDecimal = async () => {
    const decimals = (await client.readContract({
      address: tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'decimals',
    })) as number;

    setDecimal(decimals);
  };

  useEffect(() => {
    getDecimal();
  }, []);

  const handleWithdraw = async () => {
    try {
      const ABI = ticket[8]?.result ? TICKET_WITH_WHITELIST_ABI : TICKET_ABI;
      const withdrawHash = await writeContract(config, {
        chainId: scrollSepolia.id,
        address: ticketAddress as Address,
        functionName: 'withdraw',
        abi: ABI,
        args: [withdrawInfo?.recipient],
      });

      const { status: withdrawStatus } = await waitForTransactionReceipt(
        config,
        {
          hash: withdrawHash,
        },
      );

      if (withdrawStatus === 'success') {
        // action to perform
        setShowWithdrawalModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <ConfirmWithdrawalTransaction
        amount={withdrawInfo?.amount}
        recipient={withdrawInfo?.recipient}
        showWithdrawalModal={showWithdrawalModal}
        setShowWithdrawalModal={setShowWithdrawalModal}
        handleWithdraw={handleWithdraw}
      />
      <Box>
        <Box marginTop={'30px'} sx={{ display: 'flex', alignItems: 'center' }}>
          <SendIcon />
          <Typography
            marginLeft={'10px'}
            fontSize="20px"
            fontWeight="bold"
            lineHeight={'120%'}
          >
            Withdrawal
          </Typography>
        </Box>
        <Box marginTop={'14px'} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography fontSize="14px" fontWeight={600} lineHeight={'160%'}>
            {balance} {tokenSymbol === mUSDC_TOKEN ? 'USDC' : 'USDT'}
          </Typography>
          <Typography
            marginLeft={'10px'}
            fontSize="13px"
            lineHeight={'140%'}
            letterSpacing={'0.13px'}
            sx={{ opacity: '0.8' }}
          >
            ({balance} USD)
          </Typography>
        </Box>

        <Box marginTop={'30px'}>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={700}
            fontFamily="Inter"
            marginBottom="10px"
          >
            To Address
          </Typography>
          <Input
            name="recipient"
            onChange={handleChange}
            sx={{
              color: 'white',
              backgroundColor: '#2d2d2d',
              padding: '12px 10px',
              borderRadius: '8px',
              width: '100%',
              fontSize: '15px',
              fontFamily: 'Inter',
              '&::after': {
                borderBottom: 'none',
              },
              '&::before': {
                borderBottom: 'none',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: 'none',
              },
            }}
            placeholder="0x000"
          />
          {/*<Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
              marginBottom="10px"
              marginTop="20px"
            >
              Amount
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <Input
                name="amount"
                onChange={handleChange}
                sx={{
                  color: 'white',
                  backgroundColor: '#2d2d2d',
                  padding: '12px 10px',
                  borderRadius: '8px',
                  width: '100%',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  '&::after': {
                    borderBottom: 'none',
                  },
                  '&::before': {
                    borderBottom: 'none',
                  },
                  '&:hover:not(.Mui-disabled, .Mui-error):before': {
                    borderBottom: 'none',
                  },
                }}
                placeholder="000"
              />
              <ZuButton
                sx={{
                  height: '25px',
                  padding: '10px 14px',
                  color: 'white',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.20)',
                  background: 'rgba(255, 255, 255, 0.10)',
                  position: 'absolute',
                  right: '12px',
                  top: '14px',
                }}
              >
                Max
              </ZuButton>
            </Box>*/}

          {/* <Box marginTop={"14px"} gap={"20px"} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box sx={{
                width: "100%"
              }}>
                <Box display={"flex"} alignItems={"center"}>
                  <Typography
                    color="white"
                    fontSize="16px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                  >
                    Gas Price
                  </Typography>
                  <Typography
                    color="#FFC77D"
                    fontSize="13px"
                    fontWeight={700}
                    fontFamily="Inter"
                    marginBottom="10px"
                    marginLeft="8px"
                  >
                    Medium
                  </Typography>
                </Box>
                <Box>
                  <Typography>15.4 Gwei</Typography>
                  <Slider
                    onChange={(e: any) => setGasPrice(e.target.value)}
                    defaultValue={50}
                    sx={{
                      '.mui-ttgsjq-MuiSlider-track': {
                        color: '#67DBFF',
                      },
                      '.mui-7o8aqz-MuiSlider-rail': {
                        color: 'rgba(255, 255, 255, 0.10)'
                      },
                      '.mui-vr4mn8-MuiSlider-thumb': {
                        color: 'white',
                        height: "19px",
                        width: "19px",
                        borderRadius: "50%"
                      },
                    }} aria-label="Default" valueLabelDisplay="auto" />
                </Box>
              </Box>
              <Box sx={{
                width: "100%"
              }}>
                <Typography
                  color="white"
                  fontSize="16px"
                  fontWeight={700}
                  fontFamily="Inter"
                  marginBottom="10px"
                >
                  Gas Limit:
                </Typography>
                <Input
                  sx={{
                    color: 'white',
                    backgroundColor: '#2d2d2d',
                    padding: '12px 10px',
                    borderRadius: '8px',
                    width: '100%',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    '&::after': {
                      borderBottom: 'none',
                    },
                    '&::before': {
                      borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled, .Mui-error):before': {
                      borderBottom: 'none',
                    },
                  }}
                  placeholder="21000"
                />
              </Box>
            </Box> */}
        </Box>

        <Box marginTop={'30px'}>
          <Button
            onClick={() => setShowWithdrawalModal(true)}
            sx={{
              backgroundColor: '#2f474e',
              color: '#67DAFF',
              width: '100%',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter',
            }}
            startIcon={<RightArrowIcon color="#67DAFF" />}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const SendNFTTicket = ({ ticketAddress, ticket }: ISendNFTTicket) => {
  const [showNFTTicketModal, setShowNFTTicketModal] = React.useState(false);
  const [recipient, setRecipient] = useState('');
  const tokenId = '0'; // this will be removed and be handled in the contract
  const handleSendNFTTicket = async () => {
    try {
      const metadata = generateNFTMetadata(ticket[0].result, 'NFT ticket', '', [
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
      const uploadedID = await gaslessFundAndUpload(metadataFile, tags, 'EVM');
      const ABI = ticket[8]?.result ? TICKET_WITH_WHITELIST_ABI : TICKET_ABI;
      const adminMintHash = await writeContract(config, {
        chainId: scrollSepolia.id,
        address: ticketAddress as Address,
        functionName: 'adminMint',
        abi: ABI,
        args: [recipient, `https://devnet.irys.xyz/${uploadedID}`],
      });

      const { status: adminMintStatus } = await waitForTransactionReceipt(
        config,
        {
          hash: adminMintHash,
        },
      );

      if (adminMintStatus === 'success') {
        console.log('good');
      }
      setShowNFTTicketModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <ConfirmSendNFTTicketTransaction
        tokenId={tokenId}
        recipient={recipient}
        showNFTTicketModal={showNFTTicketModal}
        setShowNFTTicketModal={setShowNFTTicketModal}
        handleSendNFTTicket={handleSendNFTTicket}
        ticket={ticket}
      />
      <Box marginTop={'30px'} sx={{ display: 'flex', alignItems: 'center' }}>
        <SendIcon />
        <Typography
          marginLeft={'10px'}
          fontSize="20px"
          fontWeight="bold"
          lineHeight={'120%'}
        >
          Send Ticket
        </Typography>
      </Box>
      <Box marginTop={'14px'} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography fontSize="14px" fontWeight={600} lineHeight={'160%'}>
          {ticket[4].result}
        </Typography>
        {/*<Typography
          marginLeft={'10px'}
          fontSize="13px"
          lineHeight={'140%'}
          letterSpacing={'0.13px'}
          sx={{ opacity: '0.8' }}
        >
          out of {ticket[8]?.result}
        </Typography>*/}
      </Box>

      <Box marginTop={'30px'}>
        <Typography
          color="white"
          fontSize="16px"
          fontWeight={700}
          fontFamily="Inter"
          marginBottom="10px"
        >
          To Address
        </Typography>
        <Input
          onChange={(e: any) => setRecipient(e.target.value)}
          sx={{
            color: 'white',
            backgroundColor: '#2d2d2d',
            padding: '12px 10px',
            borderRadius: '8px',
            width: '100%',
            fontSize: '15px',
            fontFamily: 'Inter',
            '&::after': {
              borderBottom: 'none',
            },
            '&::before': {
              borderBottom: 'none',
            },
            '&:hover:not(.Mui-disabled, .Mui-error):before': {
              borderBottom: 'none',
            },
          }}
          placeholder="0x000"
        />
      </Box>

      <Box marginTop={'30px'}>
        <Button
          onClick={() => setShowNFTTicketModal(true)}
          sx={{
            backgroundColor: '#2f474e',
            color: '#67DAFF',
            width: '100%',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter',
          }}
          startIcon={<RightArrowIcon color="#67DAFF" />}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export const ConfirmSendNFTTicketTransaction = ({
  showNFTTicketModal,
  setShowNFTTicketModal,
  handleSendNFTTicket,
  tokenId,
  recipient,
}: IConfirmSendNFTTicketTransaction) => {
  return (
    <>
      <Modal
        open={showNFTTicketModal}
        onClose={() => setShowNFTTicketModal(false)}
      >
        <Stack
          padding="20px"
          border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
          spacing="20px"
          color="white"
          width="535px"
          borderRadius="10px"
          sx={{
            position: 'absolute',
            background: 'rgba(52, 52, 52, 0.80)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Stack direction="row" alignItems={'center'} spacing="24px">
            <Stack
              direction="row"
              alignItems={'center'}
              spacing="10px"
              flex={1}
            >
              <SendIcon />
              <Typography variant="subtitleSB">Confirm Transaction</Typography>
            </Stack>
            <Stack
              onClick={() => setShowNFTTicketModal(false)}
              padding="10px"
              borderRadius="10px"
              bgcolor="#3f3f3f"
              sx={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Stack>
          </Stack>
          <Stack
            padding="10px"
            borderRadius="10px"
            border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
            bgcolor="#3f3f3f"
            spacing="20px"
          >
            <Stack spacing="14px">
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">To Address:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {recipient}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Token_ID:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {tokenId}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Amount:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  1
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="center">
              <Typography variant="bodyMB">
                Contract execution fee(?)
              </Typography>
              <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                0.00000
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton
              onClick={() => setShowNFTTicketModal(false)}
              sx={{
                width: '100%',
              }}
            >
              Cancel
            </ZuButton>
            <ZuButton
              onClick={handleSendNFTTicket}
              sx={{
                backgroundColor: '#2f474e',
                color: '#67DAFF',
                width: '100%',
              }}
              startIcon={<RightArrowIcon color="#67DAFF" />}
            >
              Transfer Amount
            </ZuButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

export const ConfirmWithdrawalTransaction = ({
  showWithdrawalModal,
  setShowWithdrawalModal,
  handleWithdraw,
  amount,
  recipient,
}: IConfirmWithdrawalTransaction) => {
  return (
    <>
      <Modal
        open={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
      >
        <Stack
          padding="20px"
          border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
          spacing="20px"
          color="white"
          width="535px"
          borderRadius="10px"
          sx={{
            position: 'absolute',
            background: 'rgba(52, 52, 52, 0.80)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Stack direction="row" alignItems={'center'} spacing="24px">
            <Stack
              direction="row"
              alignItems={'center'}
              spacing="10px"
              flex={1}
            >
              <SendIcon />
              <Typography variant="subtitleSB">Confirm Transaction</Typography>
            </Stack>
            <Stack
              onClick={() => setShowWithdrawalModal(false)}
              padding="10px"
              borderRadius="10px"
              bgcolor="#3f3f3f"
              sx={{ cursor: 'pointer' }}
            >
              <CloseIcon />
            </Stack>
          </Stack>
          <Stack
            padding="10px"
            borderRadius="10px"
            border="1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
            bgcolor="#3f3f3f"
            spacing="20px"
          >
            <Stack spacing="14px">
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">To Address:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {recipient}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Token:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  USDT
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing="10px">
                <Typography variant="bodyMB">Amount:</Typography>
                <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                  {amount}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="center">
              <Typography variant="bodyMB">
                Contract execution fee(?)
              </Typography>
              <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
                0.00000
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton
              sx={{
                width: '100%',
              }}
              onClick={() => setShowWithdrawalModal(false)}
            >
              Cancel
            </ZuButton>
            <ZuButton
              sx={{
                backgroundColor: '#2f474e',
                color: '#67DAFF',
                width: '100%',
              }}
              startIcon={<RightArrowIcon color="#67DAFF" />}
              onClick={handleWithdraw}
            >
              Transfer Amount
            </ZuButton>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};
const steps = [
  {
    label: 'Addresses being uploaded',
    description: '0x9999...f08E',
    // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
  },
  {
    label: 'Ticket contract updated',
    description: '0x9999...f08E',
    // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
  },
  {
    label: 'Sending email notifications',
    description: '0x0184..287d6',
  },
  {
    label: 'Last Step',
    description: `desc`,
  },
];
const TicketProcessingProgress = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                '.mui-10z7562-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
                  color: '#7DFFD1',
                },
              }}
            >
              <Typography
                fontSize={'14px'}
                fontWeight={'600'}
                lineHeight={'160%'}
                color="white"
              >
                {step.label}
              </Typography>
              <Stack
                direction="row"
                display={'flex'}
                alignItems="center"
                spacing="10px"
              >
                <Typography
                  fontSize={'14px'}
                  fontWeight={'400'}
                  lineHeight={'160%'}
                  color="white"
                  sx={{ opacity: '0.8' }}
                >
                  {step.description}
                </Typography>
                {index === 2 || index === 3 ? null : (
                  <>
                    <CopyIcon cursor="pointer" />
                    <GoToExplorerIcon cursor="pointer" />
                  </>
                )}
              </Stack>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
export const Whitelist = ({
  vaultIndex,
  ticketAddresses,
  tickets,
}: ITicketVault) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [initial, setInitial] = useState<boolean>(false);
  const [email, setEmail] = useState<boolean>(false);
  const [process, setProcess] = useState<boolean>(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const [emailList, setEmailList] = useState('');
  let ticketAddress = ticketAddresses[vaultIndex];
  let ticket = tickets[vaultIndex];
  const handleSendEmails = async () => {
    const emailJsConfig = await fetchEmailJsConfig();
    if (emailJsConfig) {
      const { serviceId, templateId, userId } = emailJsConfig;
      const emails = emailList.split(',').map((email) => email.trim());
      for (const email of emails) {
        const result = await send(
          serviceId,
          templateId,
          {
            to_name: 'ZuVillage',
            from_name: email,
            message: 'Here is your invitation to mint the ticket.',
            reply_to: email,
          },
          userId,
        );
      }
      setEmailList('');
    } else {
      console.log('Failed to fetch email JS config.');
    }
  };
  const handleAddWhiteLIST = async () => {
    console.log({ addresses });

    try {
      const appendHash = await writeContract(config, {
        chainId: scrollSepolia.id,
        address: ticketAddress as Address,
        functionName: 'appendToWhitelist',
        abi: TICKET_WITH_WHITELIST_ABI,
        args: [addresses],
      });

      const { status: appendStatus } = await waitForTransactionReceipt(config, {
        hash: appendHash,
        timeout: 6000_000,
      });

      if (appendStatus === 'success') {
        // action to perform
        console.log(emailList);
        await handleSendEmails();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Stack spacing="30px">
      <Stack spacing="10px">
        <Stack direction="row" spacing="10px" alignItems="center">
          <ArrowDownSquare />
          <Typography variant="subtitleMB">Whitelist</Typography>
        </Stack>
        <Stack direction="row" spacing="10px" alignItems="center">
          <Typography variant="bodyS">Total Invites Sent:</Typography>
          <Typography variant="bodyMB">00</Typography>
        </Stack>
      </Stack>
      {!initial && !email && !process && (
        <>
          <Stack spacing="20px">
            {addresses.length === 0 ? (
              <Stack spacing="10px">
                <Typography variant="bodyBB">
                  Input Approved Addresses
                </Typography>
                <Typography variant="bodyM">
                  Upload addresses of individuals to directly gain access to
                  mint this ticket. These users will interact and pay the set
                  contributing amount of the ticket.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing="20px">
                <Stack spacing="10px">
                  <Typography variant="bodyBB">Approved Addresses</Typography>
                  <Typography variant="bodyM">
                    Upload addresses of individuals to directly gain access to
                    mint this ticket. These users will interact and pay the set
                    contributing amount of the ticket.
                  </Typography>
                </Stack>
                <Stack spacing="20px">
                  {addresses.map((item, index) => (
                    <Stack spacing="10px" key={`InviteAddressIndex-${index}`}>
                      <Typography variant="bodyBB">Address (eth)</Typography>
                      <Stack direction="row" spacing="10px" alignItems="center">
                        <ZuInput
                          value={item}
                          onChange={(e) =>
                            setAddresses((prev) =>
                              prev.map((item, i) =>
                                i === index ? e.target.value : item,
                              ),
                            )
                          }
                        />
                        <Box
                          padding="8px 10px 6px 10px"
                          bgcolor="#373737"
                          borderRadius="10px"
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            setAddresses((prev) =>
                              prev.filter((_, i) => i !== index),
                            )
                          }
                        >
                          <XCricleIcon />
                        </Box>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            )}
            <Stack
              onClick={() => {
                setAddresses((prev) => {
                  const newState = [...prev, ''];
                  return newState;
                });
              }}
              sx={{ cursor: 'pointer' }}
              direction="row"
              spacing="10px"
              padding="8px 14px"
              justifyContent="center"
              borderRadius="10px"
              bgcolor="#313131"
              alignItems="center"
            >
              <PlusCircleIcon />
              <Typography variant="bodyM">Add Address</Typography>
            </Stack>
            <Stack
              sx={{ cursor: 'pointer' }}
              direction="row"
              spacing="10px"
              padding="10px 20px"
              justifyContent="center"
              borderRadius="10px"
              border="1px solid #383838"
            >
              <Typography variant="bodyM">
                View existing list of addresses added
              </Typography>

              <ChevronDownIcon size={4.5} />
            </Stack>
          </Stack>
          <Stack
            sx={{ cursor: 'pointer' }}
            direction="row"
            spacing="10px"
            padding="10px 20px"
            justifyContent="center"
            borderRadius="10px"
            border="1px solid #383838"
          >
            <List>
              {ticket[9]?.result &&
                ticket[9].result.map((address: string, index: number) => (
                  <ListItem key={index}>
                    <Typography
                      variant="h6"
                      fontSize="8px"
                      fontFamily={'Inter'}
                      lineHeight={'120%'}
                      color="white"
                    >
                      {address}
                    </Typography>
                  </ListItem>
                ))}
            </List>
          </Stack>
          <ZuButton
            sx={{
              backgroundColor: '#2f474e',
              color: '#67DAFF',
              width: '100%',
            }}
            startIcon={<RightArrowIcon color="#67DAFF" />}
            onClick={() => {
              setEmail(true);
            }}
          >
            Next Step
          </ZuButton>
        </>
      )}
      {!initial && email && !process && (
        <>
          <Stack spacing="10px">
            <Typography variant="bodyBB">
              Send email invitations (optional)
            </Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
              Input corresponding emails of the eth addresses to be sent a
              notification link to mint this ticket.
            </Typography>
            <TextField
              multiline
              rows={4}
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              placeholder="simon@ecf.network, reno@ecf.network"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                border: 'none',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            />
            <Stack
              sx={{ cursor: 'pointer' }}
              direction="row"
              spacing="10px"
              padding="10px 20px"
              justifyContent="center"
              borderRadius="10px"
              border="1px solid #383838"
            >
              <Typography variant="bodyM">
                View existing list of addresses added
              </Typography>
              <ChevronDownIcon size={4.5} />
            </Stack>
          </Stack>
          <Stack direction="row" spacing="20px">
            <ZuButton
              sx={{
                width: '100%',
              }}
              startIcon={<LeftArrowIcon />}
              onClick={() => setEmail(false)}
            >
              Back
            </ZuButton>
            <ZuButton
              sx={{
                backgroundColor: '#2f474e',
                color: '#67DAFF',
                width: '100%',
              }}
              startIcon={<RightArrowIcon color="#67DAFF" />}
              onClick={() => {
                handleAddWhiteLIST();
                setProcess(true);
                setEmail(false);
              }}
            >
              Upload & Send
            </ZuButton>
          </Stack>
        </>
      )}
      {!initial && !email && process && (
        <>
          {!updated ? (
            <Stack padding="10px" borderRadius="10px" bgcolor="#313131">
              <Typography variant="bodyM" textAlign="center">
                Contract being updated...
              </Typography>
            </Stack>
          ) : (
            <Stack
              direction="row"
              padding="10px"
              borderRadius="10px"
              bgcolor="rgba(125, 255, 209, 0.10)"
              justifyContent="center"
              spacing="10px"
            >
              <CheckIcon />
              <Typography variant="bodyM" textAlign="center" color="#7DFFD1">
                Contract Updated
              </Typography>
            </Stack>
          )}
          <TicketProcessingProgress />
          <ZuButton
            onClick={() => {
              setInitial(false);
              setProcess(false);
              setEmail(false);
            }}
            sx={{
              backgroundColor: '#2f474e',
              color: '#67DAFF',
              width: '100%',
            }}
            startIcon={<XCricleIcon color="#67DAFF" />}
          >
            Close
          </ZuButton>
        </>
      )}
    </Stack>
  );
};
