import { ZuButton, ZuInput, ZuSwitch } from '@/components/core';
import {
  CheckCircleIcon,
  CheckIcon,
  CircleCloseIcon,
  CopyIcon,
  EthereumIcon,
  GoToExplorerIcon,
  LeftArrowIcon,
  RightArrowIcon,
  ScrollIcon,
  SignCreateIcon,
  USDCIcon,
  USDTIcon,
  UncheckCircleIcon,
} from '@/components/icons';
import { STARTING_STATUS } from '@/constant';
import {
  Box,
  Button,
  Input,
  MenuItem,
  Select,
  Switch,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { shortenAddress } from '@/utils/format';
import { SCROLL_EXPLORER } from '@/constant';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Uploader3, SelectedFile } from '@lxdao/uploader3';
import { PreviewFile } from '@/components';
import gaslessFundAndUpload from '@/utils/gaslessFundAndUpload';
import { useUploaderPreview } from '@/components/PreviewFile/useUploaderPreview';
interface IProps {
  setIsConfirm?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setGoToSummary?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setPurchasingTicket?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsNext?: React.Dispatch<React.SetStateAction<boolean>> | any;
  toggleDrawer?: any;
  handleChange?: any;
  isTicketFree?: boolean;
  setIsTicketFree?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isShowQtyRemaining?: boolean;
  setIsShowQtyRemaining?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isHideUntilSetDate?: boolean;
  setIsHideUntilSetDate?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isWhiteList?: boolean;
  setIsWhiteList?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isHideAfterSetDate?: boolean;
  setIsHideAfterSetDate?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isHideWhenSoldOut?: boolean;
  setIsHideWhenSoldOut?: React.Dispatch<React.SetStateAction<boolean>> | any;
  selectedToken?: string;
  setSelectedToken?: React.Dispatch<React.SetStateAction<boolean>> | any;
  selectedWhiteListTicket?: boolean;
  setSelectedWhiteListTicket?:
    | React.Dispatch<React.SetStateAction<string>>
    | any;
  ticketInfo?: any;
  handleSubmit?: any;
  selectedFile?: string | null;
  setSelectedFile?: React.Dispatch<React.SetStateAction<string | null>> | any;
  previewImage?: string | null;
  setPreviewImage?: React.Dispatch<React.SetStateAction<string | null>> | any;
  handleFileChange?: any;
  ticketMintDeadline?: any;
  setTicketMintDeadline?: any;
  isSubmitLoading?: boolean;
  txnHash?: string;
  isMintCloseTime?: boolean;
  setIsMintCloseTime?: React.Dispatch<React.SetStateAction<boolean>> | any;
  endDate?: Dayjs;
  setEndDate?: React.Dispatch<React.SetStateAction<Dayjs>> | any;
  endTime?: Dayjs;
  setEndTime?: React.Dispatch<React.SetStateAction<Dayjs>> | any;
  setIsTicket?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setSelectedType?: React.Dispatch<React.SetStateAction<string>> | any;
  selectedType?: string;
  ticketImage?: SelectedFile;
  setTicketImage?: React.Dispatch<React.SetStateAction<SelectedFile>> | any;
  ticketImageURL?: string;
  setTicketImageURL?: React.Dispatch<React.SetStateAction<string>> | any;
}

export const InitialSetup = ({ setIsNext }: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
      padding="20px 30px"
      spacing="30px"
    >
      <Stack spacing="20px">
        <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
          Ticket Setup
        </Typography>
        <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
          Ticketing Method cannnot be changed for this event once created.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing="10px"
        alignItems={'center'}
        padding={'20px'}
        sx={{
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.10)',
          background:
            'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%), rgba(255, 255, 255, 0.05))',
        }}
      >
        <Stack justifyContent="space-between" height="140px">
          <Typography variant="subtitleSB" sx={{ opacity: '0.7' }}>
            Create Tickets Individually
          </Typography>

          <Typography variant="bodyM" sx={{ opacity: '0.6' }}>
            <strong>One ticket equals one contract.</strong>A parent contract is
            deployed and subsequent tickets created are individual child
            contracts. This allows for more control of each ticket type created.
          </Typography>
          <Stack
            padding="4px 10px"
            borderRadius="6px"
            direction="row"
            spacing="10px"
            bgcolor="#3e3e3e"
            alignItems="center"
          >
            <Typography variant="caption">TICKETING PROTOCOL:</Typography>
            <ScrollIcon />
          </Stack>
        </Stack>

        <Image
          alt={'25.webp'}
          src={'/25.webp'}
          width={160}
          height={140}
          objectFit="cover"
          style={{
            paddingTop: isMobile ? '30px' : undefined,
            width: isMobile ? '100%' : undefined,
            height: isMobile ? '100%' : undefined,
          }}
        />
      </Stack>

      <Typography textAlign={'center'} variant="bodyB" sx={{ opacity: '0.8' }}>
        You are <strong>Creating Tickets Individually</strong>
      </Typography>

      <Box>
        <Button
          onClick={() => setIsNext(true)}
          // onClick={() => alert("OKKAAAYYYY")}
          sx={{
            backgroundColor: '#2f474e',
            color: '#67DAFF',
            width: '100%',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter',
            textTransform: 'capitalize',
          }}
          startIcon={<RightArrowIcon color="#67DAFF" />}
        >
          Next
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent={'center'}
        gap="10px"
        alignItems="center"
      >
        <Typography variant="caption">TICKETING PROTOCOL:</Typography>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const TicketSetup = ({
  setIsNext,
  setIsConfirm,
  selectedToken,
  setSelectedToken,
  selectedWhiteListTicket,
  setSelectedWhiteListTicket,
  setIsTicket,
}: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');

  const handleToggle = () => {
    setSelectedWhiteListTicket(!selectedWhiteListTicket);
  };

  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Stack spacing="30px" padding="20px 30px">
        <Stack spacing="20px">
          <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
            Ticket Setup
          </Typography>
          <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
            Set the receiving token and address for ticket purchases via crypto
            payments. These settings cannot be changed once the contract is
            deployed.
          </Typography>
        </Stack>

        <Stack
          padding={'20px'}
          bgcolor="rgba(255, 255, 255, 0.02)"
          borderRadius="10px"
          spacing="30px"
        >
          <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
            Select Token
          </Typography>

          <Stack spacing="20px">
            <Stack spacing="10px">
              <Typography variant="bodyBB">Receiving Token</Typography>
              <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
                Select a token to be received as payment for ticket purchases
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing="10px">
            <Typography variant="caption" sx={{ opacity: '0.6' }}>
              PROTOCOL:
            </Typography>
            <ZuButton startIcon={<EthereumIcon />}>Ethereum Chain</ZuButton>
          </Stack>
          <Stack spacing="10px">
            <Typography variant="caption" sx={{ opacity: '0.6' }}>
              TOKEN (ONLY ONE CAN BE SELECTED)
            </Typography>
            <Stack
              direction={'row'}
              alignItems="center"
              spacing={2.5}
              marginTop={'10px'}
            >
              <Stack
                width={'100%'}
                direction="row"
                alignItems="center"
                justifyContent={'space-between'}
                padding="10px 20px"
                spacing={1}
                borderRadius={3}
                sx={{
                  cursor: 'pointer',
                  border: `${selectedToken === 'USDT' ? 'rgba(125, 255, 209, 0.10)' : 'rgba(255, 255, 255, 0.05)'}`,
                  backgroundColor: `${selectedToken === 'USDT' ? 'rgba(125, 255, 209, 0.10)' : 'rgba(255, 255, 255, 0.05)'}`,
                }}
                onClick={() => setSelectedToken('USDT')}
              >
                <Stack direction="row" alignItems="center" gap="10px">
                  <USDTIcon />
                  <Typography fontSize="14px" fontWeight={600}>
                    USDT
                  </Typography>
                </Stack>
                <Stack>
                  {selectedToken === 'USDT' ? (
                    <CheckCircleIcon color="#65C0A0" />
                  ) : (
                    <UncheckCircleIcon />
                  )}
                </Stack>
              </Stack>

              <Stack
                width={'100%'}
                direction="row"
                alignItems="center"
                justifyContent={'space-between'}
                padding="10px 20px"
                spacing={1}
                borderRadius={3}
                sx={{
                  cursor: 'pointer',
                  border: `${selectedToken === 'USDC' ? 'rgba(125, 255, 209, 0.10)' : 'rgba(255, 255, 255, 0.05)'}`,
                  backgroundColor: `${selectedToken === 'USDC' ? 'rgba(125, 255, 209, 0.10)' : 'rgba(255, 255, 255, 0.05)'}`,
                }}
                onClick={() => setSelectedToken('USDC')}
              >
                <Stack direction="row" alignItems="center" gap="10px">
                  <USDCIcon />
                  <Typography fontSize="14px" fontWeight={600}>
                    USDC
                  </Typography>
                </Stack>
                <Stack>
                  {selectedToken === 'USDC' ? (
                    <CheckCircleIcon color="#65C0A0" />
                  ) : (
                    <UncheckCircleIcon />
                  )}
                </Stack>
              </Stack>
            </Stack>
            {/* <Stack
              direction="row"
              alignItems="center"
              gap="10px"
              marginTop={'30px'}
            >
              <Switch
                checked={selectedWhiteListTicket}
                onChange={handleToggle}
              />
              selectedWhiteListTicket ? (
                <Typography style={{ marginLeft: '8px' }}>Whitelist</Typography>
              ) : (
                <Typography style={{ marginLeft: '8px' }}>
                  Permissionless
                </Typography>
              )
            </Stack>*/}
          </Stack>
          {/* <Box marginTop={'30px'}>
            <Typography fontSize="16px" sx={{ opacity: '0.6' }}>
              description - let the user know that the proceeds of this ticket
              purchases are sent to the contract
            </Typography>
          </Box>*/}
        </Stack>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          gap={'20px'}
        >
          <Button
            onClick={() => {
              setIsNext(false);
            }}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              width: '100%',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'Inter',
              textTransform: 'capitalize',
            }}
            startIcon={<LeftArrowIcon />}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              setIsNext(false), setIsTicket(true);
            }}
            sx={{
              backgroundColor: '#2f474e',
              color: '#67DAFF',
              width: '100%',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'Inter',
              textTransform: 'capitalize',
            }}
            startIcon={<RightArrowIcon color="#67DAFF" />}
          >
            Confirm
          </Button>
        </Box>
        <Box
          display="flex"
          justifyContent={'center'}
          gap="10px"
          alignItems="center"
        >
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Box>
      </Stack>
    </Stack>
  );
};

export const TicketType = ({
  setIsTicket,
  setIsConfirm,
  selectedType,
  setSelectedType,
}: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');

  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Stack spacing="30px" padding="20px 30px">
        <Stack spacing="20px">
          <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
            Ticket Setup
          </Typography>
          <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
            Set the receiving token and address for ticket purchases via crypto
            payments. These settings cannot be changed once the contract is
            deployed.
          </Typography>
        </Stack>
        <Stack
          padding="20px"
          spacing="30px"
          bgcolor="#2d2d2d"
          borderRadius="10px"
        >
          <Typography variant="subtitleMB">Select Type</Typography>
          <Stack spacing="10px">
            <Stack
              onClick={() => setSelectedType('Attendee')}
              direction="row"
              justifyContent="space-between"
              padding="10px 20px"
              alignItems="center"
              bgcolor={
                selectedType === 'Attendee'
                  ? 'rgba(125, 255, 209, 0.10)'
                  : 'rgba(255, 255, 255, 0.05)'
              }
              borderRadius="10px"
            >
              <Stack spacing="10px">
                <Typography variant="bodyMB">Attendee Ticket</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                  These are tickets for those who will attend this event
                </Typography>
              </Stack>
              {selectedType === 'Attendee' ? (
                <CheckCircleIcon />
              ) : (
                <UncheckCircleIcon />
              )}
            </Stack>
            <Stack
              onClick={() => setSelectedType('Sponsor')}
              direction="row"
              justifyContent="space-between"
              padding="10px 20px"
              alignItems="center"
              bgcolor={
                selectedType === 'Sponsor'
                  ? 'rgba(125, 255, 209, 0.10)'
                  : 'rgba(255, 255, 255, 0.05)'
              }
              borderRadius="10px"
            >
              <Stack spacing="10px">
                <Typography variant="bodyMB">Sponsor Package</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                  These are packages for those who will sponsor this event
                </Typography>
              </Stack>
              {selectedType === 'Sponsor' ? (
                <CheckCircleIcon />
              ) : (
                <UncheckCircleIcon />
              )}
            </Stack>
          </Stack>
          {/*<Typography variant="bodyB" sx={{ opacity: 0.6 }}>
            description - let the user know that the proceeds of this ticket purchases are held in the contract
          </Typography>*/}
        </Stack>
        <Box>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            gap={'20px'}
          >
            <Button
              onClick={() => {
                setIsTicket(false);
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                width: '100%',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'Inter',
                textTransform: 'capitalize',
              }}
              startIcon={<LeftArrowIcon />}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                setIsTicket(false), setIsConfirm(true);
              }}
              sx={{
                backgroundColor: '#2f474e',
                color: '#67DAFF',
                width: '100%',
                borderRadius: '10px',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'Inter',
                textTransform: 'capitalize',
              }}
              startIcon={<RightArrowIcon color="#67DAFF" />}
            >
              Confirm
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent={'center'}
          gap="10px"
          alignItems="center"
        >
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Box>
      </Stack>
    </Stack>
  );
};

export const CreateTicket = ({
  handleChange,
  setIsConfirm,
  setGoToSummary,
  isTicketFree,
  setIsTicketFree,
  isShowQtyRemaining,
  setIsShowQtyRemaining,
  isWhiteList,
  setIsWhiteList,
  isHideAfterSetDate,
  setIsHideAfterSetDate,
  isHideWhenSoldOut,
  setIsHideWhenSoldOut,
  selectedToken,
  ticketMintDeadline,
  setTicketMintDeadline,
  isMintCloseTime,
  setIsMintCloseTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  ticketImage,
  setTicketImage,
  ticketImageURL,
  setTicketImageURL,
}: IProps) => {
  const avatarUploader = useUploaderPreview();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack padding="20px 30px" spacing="30px">
        <Stack
          gap="30px"
          padding="20px"
          bgcolor="rgba(255, 255, 255, 0.02)"
          borderRadius="10px"
        >
          <Typography variant="subtitleSB">Ticket Basics</Typography>
          <Stack spacing="10px">
            <Typography variant="bodyBB">Name*</Typography>
            <ZuInput
              required
              name="ticketName"
              onChange={handleChange}
              placeholder="Enter a name for your event"
            />
          </Stack>
          {!isTicketFree && (
            <Stack spacing="10px">
              <Typography variant="bodyBB">Price*</Typography>
              <Box position="relative">
                <ZuInput
                  required
                  name="ticketPrice"
                  onChange={handleChange}
                  placeholder="00.00"
                />

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '28px',
                    padding: '14px',
                    color: 'white',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    position: 'absolute',
                    right: '12px',
                    top: '7px',
                  }}
                >
                  {selectedToken === 'USDT' ? <USDTIcon /> : <USDCIcon />}
                  <Typography marginLeft={'10px'}>
                    {selectedToken === 'USDT' ? 'USDT' : 'USDC'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}

          <Box display="flex">
            <ZuSwitch
              checked={isTicketFree}
              onChange={() => setIsTicketFree((prev: boolean) => !prev)}
            />
            <Box>
              <Typography
                color="white"
                fontSize="16px"
                fontWeight={700}
                fontFamily="Inter"
                marginLeft="10px"
              >
                Free
              </Typography>
              <Typography
                color="white"
                fontSize="13px"
                lineHeight={'140%'}
                letterSpacing={'0.13px'}
                fontFamily="Inter"
                marginLeft="10px"
                sx={{ opacity: '0.7' }}
              >
                Make this ticket free to mint
              </Typography>
            </Box>
          </Box>

          {/*<Stack spacing="10px">
            <Typography variant="bodyBB">Quantity*</Typography>
            <ZuInput
              required
              type="number"
              name="ticketQuantity"
              placeholder="00"
            />
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Requires a minimum of 1
            </Typography>
          </Stack>*/}

          <Stack spacing="10px">
            <Typography variant="bodyBB">Description*</Typography>
            <TextField
              required
              name="description"
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                height: '200px',
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-inputMultiline': {
                  fontFamily: 'Inter',
                  color: 'white',
                },
              }}
              placeholder="Provide a captivating description of your event"
            />
            <Typography
              variant="caption"
              display={'flex'}
              justifyContent={'end'}
              textTransform={'uppercase'}
              sx={{ opacity: '0.7' }}
            >
              100 Characters left
            </Typography>
          </Stack>

          <Stack spacing="10px">
            <Typography variant="bodyBB">Add an Agreement Message</Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
              Write an agreement for users to understand and agree before they
              proceed to purchase this ticket.
            </Typography>
            <TextField
              required
              name="message"
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                height: '200px',
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-inputMultiline': {
                  fontFamily: 'Inter',
                  color: 'white',
                },
              }}
              placeholder="Write an agreement here"
            />
          </Stack>
          <Stack spacing="10px">
            <Typography variant="bodyBB">Image</Typography>
            <Typography variant="bodyS" sx={{ opacity: '0.6' }}>
              Recommend min of 200 * 200px (1:1 Ratio)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Uploader3
                accept={['.gif', '.jpeg', '.gif', '.png']}
                api={'/api/file/upload'}
                multiple={false}
                crop={{
                  size: { width: 400, height: 400 },
                  aspectRatio: 1,
                }} // must be false when accept is svg
                onUpload={(file) => {
                  avatarUploader.setFile(file);
                }}
                onComplete={(file) => {
                  avatarUploader.setFile(file);
                }}
              >
                <Button
                  component="span"
                  sx={{
                    color: 'white',
                    borderRadius: '10px',
                    backgroundColor: '#373737',
                    border: '1px solid #383838',
                  }}
                >
                  Upload Image
                </Button>
              </Uploader3>
              <PreviewFile
                sx={{ width: '200px', height: '200px' }}
                src={avatarUploader.getUrl()}
                errorMessage={avatarUploader.errorMessage()}
                isLoading={avatarUploader.isLoading()}
              />
            </Box>
          </Stack>
        </Stack>

        <Stack
          padding="20px"
          spacing="30px"
          sx={{
            background: '#2d2d2d',
            borderRadius: '10px',
          }}
        >
          <Typography variant="bodyBB" sx={{ opacity: '0.7' }}>
            Minting Access
          </Typography>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isWhiteList}
              onChange={() => setIsWhiteList((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">
                Add Whitelist For This Ticket
              </Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                This ticket will require whitelisted addresses to mint
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isMintCloseTime}
              onChange={() => setIsMintCloseTime((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">
                Set Minting Closing Period
              </Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                Set the end date and time for when minting for this ticket ends.
              </Typography>
            </Stack>
          </Stack>
          {isMintCloseTime && (
            <Stack direction="row" spacing="20px">
              <Stack spacing="10px">
                <Typography variant="bodyBB">End Date*</Typography>
                <DatePicker
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        ...{
                          '& .MuiPickersDay-root': { color: 'black' },
                          '& .MuiPickersDay-root.Mui-selected': {
                            backgroundColor: '#D7FFC4',
                          },
                          '& .MuiPickersCalendarHeader-root': {
                            color: 'black',
                          },
                        },
                      },
                    },
                  }}
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">End Time*</Typography>
                <TimePicker
                  onChange={(newValue) => setEndTime(newValue)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        ...{
                          '& .MuiPickersLayout-contentWrapper': {
                            color: 'black',
                          },
                        },
                      },
                    },
                  }}
                />
              </Stack>
            </Stack>
          )}
        </Stack>

        {/* CONFIGURE SETTINGS */}
        <Stack
          spacing="30px"
          padding="20px"
          sx={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
          }}
        >
          <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
            Configure Display Settings
          </Typography>

          <Stack spacing="10px">
            <Typography variant="bodyBB">Starting Status*</Typography>
            <Typography variant="bodyS" sx={{ opacity: '0.8' }}>
              Select a status for this ticket post-creation
            </Typography>
            <Select
              name="startingStatus"
              onChange={handleChange}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                backgroundColor: '#2d2d2d',
              }}
              placeholder="Select"
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#222222',
                  },
                },
              }}
            >
              {STARTING_STATUS.map((status, index) => {
                return (
                  <MenuItem value={status.key} key={index}>
                    {status.value}
                  </MenuItem>
                );
              })}
            </Select>
          </Stack>
        </Stack>

        {/* CONFIGURE CONDITIONS
        <Stack
          padding="20px"
          spacing="30px"
          sx={{
            background:
              'linear-gradient(0deg, rgba(255, 112, 112, 0.20) 0%, rgba(255, 112, 112, 0.20) 100%), rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
          }}
        >
          <Stack spacing="10px">
            <Typography variant="bodyBB" sx={{ opacity: '0.7' }}>
              Configure Conditions
            </Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
              These conditions do not affect the contract
            </Typography>
          </Stack>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isHideUntilSetDate}
              onChange={() => setIsHideUntilSetDate((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">
                Hide Until Set Date and Time
              </Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                Make this ticket visible and available to purchase until a set
                date/time
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isHideAfterSetDate}
              onChange={() => setIsHideAfterSetDate((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">Hide After Set Date/Time</Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                Make this ticket hidden after a set date/time
              </Typography>
            </Stack>
          </Stack>
        </Stack>*/}

        <Box
          padding={'20px'}
          display="flex"
          gap={'10px'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Button
            onClick={() => setIsConfirm(false)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              width: '100%',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter',
              textTransform: 'capitalize',
            }}
            startIcon={<LeftArrowIcon />}
          >
            Back
          </Button>

          <Button
            onClick={() => {
              setTicketImageURL(avatarUploader.getUrl());
              setIsConfirm(false), setGoToSummary(true);
            }}
            sx={{
              backgroundColor: '#2f474e',
              color: '#67DAFF',
              width: '100%',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter',
              textTransform: 'capitalize',
            }}
            startIcon={<RightArrowIcon color="#67DAFF" />}
          >
            Save Ticket
          </Button>
        </Box>

        <Box
          display="flex"
          justifyContent={'center'}
          gap="10px"
          alignItems="center"
        >
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
};

export const TicketCreationSummary = ({
  isTicketFree,
  selectedToken,
  ticketInfo,
  setIsConfirm,
  setGoToSummary,
  setPurchasingTicket,
  handleSubmit,
}: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  return (
    <Stack
      spacing="30px"
      padding="20px"
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Box
        padding={'30px'}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography fontSize="20px" fontWeight="bold" sx={{ opacity: '0.7' }}>
          Summary
        </Typography>

        <Box margin={'30px 0px 20px'}>
          <Box
            sx={{
              display: isMobile ? 'grid' : 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
            }}
          >
            <Typography variant="bodyB" sx={{ opacity: '0.8' }}>
              Method:
            </Typography>
            <Typography variant="bodyBB" sx={{ opacity: '0.8' }}>
              Combine Tickets in Contract Deployed on Scroll
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography variant="bodyB" sx={{ opacity: '0.8' }}>
              Protocol:
            </Typography>
            <Box
              padding={'4px 10px'}
              borderRadius="10px"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <EthereumIcon />
              <Typography variant="bodyM" marginLeft="8px">
                Ethereum Chain
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography variant="bodyB" sx={{ opacity: '0.8' }}>
              Receiving Token:
            </Typography>
            <Box
              padding={'4px 10px'}
              borderRadius="10px"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {selectedToken === 'USDT' ? <USDTIcon /> : <USDCIcon />}
              <Typography variant="bodyM" marginLeft="8px">
                {selectedToken === 'USDT' ? 'USDT' : 'USDC'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Stack marginTop={'16px'} direction={{ xs: 'column', sm: 'row' }}>
          <Image alt={'23.webp'} src={'/23.webp'} width={200} height={200} />
          <Stack
            direction="column"
            spacing={1}
            marginLeft={isMobile ? undefined : '16px'}
            marginTop={isMobile ? '30px' : undefined}
          >
            <Typography variant="h5">{ticketInfo?.ticketName}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="bodyM">Price:</Typography>
              <Typography
                variant="bodyBB"
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {isTicketFree ? 'Free' : ticketInfo?.ticketPrice}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: '0.8',
                }}
              >
                {isTicketFree ? null : selectedToken}
              </Typography>
            </Box>

            <Typography variant="bodyM">Description:</Typography>
            <Typography
              variant="bodyS"
              sx={{
                opacity: '0.8',
              }}
            >
              {ticketInfo.description}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box
        display={'flex'}
        gap={'14px'}
        justifyContent={'space-between'}
        alignItems={'center'}
        paddingX={3}
        marginTop={'10px'}
      >
        <Button
          onClick={() => {
            setIsConfirm(true), setGoToSummary(false);
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            width: '100%',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter',
            textTransform: 'capitalize',
          }}
          startIcon={isMobile ? undefined : <LeftArrowIcon />}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#2f474e',
            color: '#67DAFF',
            width: '100%',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter',
            textTransform: 'capitalize',
          }}
          startIcon={isMobile ? undefined : <SignCreateIcon />}
        >
          Sign & Create
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent={'center'}
        gap="10px"
        alignItems="center"
      >
        <Typography variant="caption">TICKETING PROTOCOL:</Typography>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const ProcessingTicket = ({
  setPurchasingTicket,
  toggleDrawer,
  isSubmitLoading,
  txnHash,
}: IProps) => {
  let status = false;
  const isMobile = useMediaQuery('(max-width:500px)');

  return (
    <Stack
      sx={{ background: '#222', height: 'calc(100vh - 6.2rem)' }}
      spacing="30px"
      padding="20px 30px"
    >
      <Box
        padding={'30px'}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography fontSize="20px" fontWeight="bold" sx={{ opacity: '0.7' }}>
          {isSubmitLoading ? 'Processing' : 'Complete'}
        </Typography>

        <Box
          padding="10px"
          display={'flex'}
          justifyContent={'center'}
          marginY={'20px'}
          sx={{
            borderRadius: '10px',
            background: `${status ? 'rgba(255, 255, 255, 0.05)' : 'rgba(125, 255, 209, 0.10)'}`,
          }}
        >
          {isSubmitLoading ? (
            <Typography color="white" fontSize={'14px'} lineHeight={'160%'}>
              Your ticket is being created...
            </Typography>
          ) : (
            <Box display={'flex'} alignItems={'center'}>
              <CheckIcon />
              <Typography color="#7DFFD1" fontSize={'14px'} lineHeight={'160%'}>
                Ticket creation successful
              </Typography>
            </Box>
          )}
        </Box>

        <TicketProcessingProgress txnHash={txnHash} />
      </Box>

      {!isSubmitLoading && (
        <Box paddingX={'30px'}>
          <Button
            onClick={() => {
              setPurchasingTicket(false), toggleDrawer('right', false);
            }}
            sx={{
              backgroundColor: 'rgba(103, 219, 255, 0.10)',
              color: '#67DBFF',
              border: '1px solid rgba(103, 219, 255, 0.20)',
              width: '100%',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter',
              textTransform: 'capitalize',
            }}
            startIcon={<CircleCloseIcon />}
          >
            Close
          </Button>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent={'center'}
        gap="10px"
        alignItems="center"
      >
        <Typography variant="caption">TICKETING PROTOCOL:</Typography>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const TicketProcessingProgress = ({ txnHash }: any) => {
  const steps = [
    {
      label: 'Event Contract Deployed',
      description: '0x9999...f08E',
      // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
    },
    {
      label: 'Ticket Contract Deployed',
      description: '0x9999...f08E',
      // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
    },
    {
      label: 'Validating Transaction (Hash)',
      description: shortenAddress(txnHash),
    },
    {
      label: 'Last Step',
      description: 'desc',
    },
  ];
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
              <Box display={'flex'} alignItems={'center'}>
                <Typography
                  fontSize={'14px'}
                  fontWeight={'400'}
                  lineHeight={'160%'}
                  color="white"
                  sx={{ opacity: '0.8' }}
                >
                  {step.description}
                </Typography>
                {index === 2 ? null : (
                  <Box display={'flex'} alignItems={'center'}>
                    <CopyIcon cursor="pointer" />

                    <Box
                      onClick={() =>
                        window.open(
                          `${SCROLL_EXPLORER}/tx/${txnHash}`,
                          '_blank',
                        )
                      }
                    >
                      <GoToExplorerIcon cursor="pointer" />
                    </Box>
                  </Box>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
