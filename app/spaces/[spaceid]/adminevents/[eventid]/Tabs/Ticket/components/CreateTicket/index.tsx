import { ZuButton, ZuSwitch } from '@/components/core';
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
}

export const InitialSetup = ({ setIsNext }: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Box margin={3}>
        <Box>
          <Typography fontSize="20px" fontWeight="bold" sx={{ opacity: '0.7' }}>
            Initial Setup
          </Typography>
          <Typography
            marginTop={'20px'}
            fontSize="16px"
            sx={{ opacity: '0.6' }}
          >
            Ticketing Method
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={'center'}
          padding={'20px'}
          marginTop={'30px'}
          sx={{
            borderRadius: '10px',
            border: '2px solid rgba(255, 255, 255, 0.10)',
            background:
              'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%), rgba(255, 255, 255, 0.05))',
          }}
        >
          <Box>
            <Typography
              fontSize="20px"
              fontWeight="bold"
              sx={{ opacity: '0.7' }}
              lineHeight={'120%'}
            >
              Create Tickets Individually
            </Typography>

            <Typography
              marginTop={'10px'}
              fontSize="16px"
              sx={{ opacity: '0.6' }}
            >
              <strong>One ticket equals one contract.</strong> Each ticket
              deploys its own instance. Allows for more control of each ticket
              created. However, this will cost more in transaction fees for
              every ticket created over time.
            </Typography>
          </Box>

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
      </Box>

      <Typography
        textAlign={'center'}
        marginY={'30px'}
        fontSize="16px"
        sx={{ opacity: '0.8' }}
      >
        You are <strong>Creating Tickets Individually</strong>
      </Typography>

      <Box paddingX={3} marginTop={'10px'}>
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
          Confirm
        </Button>

        <Box display="flex" justifyContent={'center'} marginTop={'30px'}>
          <ScrollIcon />
        </Box>
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
      <Box margin={3}>
        <Box>
          <Typography fontSize="20px" fontWeight="bold" sx={{ opacity: '0.7' }}>
            Ticket Setup
          </Typography>
          <Typography
            marginTop={'20px'}
            fontSize="16px"
            sx={{ opacity: '0.6' }}
          >
            Before you create tickets for this event, you&apos;ll need to first
            set the receiving token and address for ticket purchases via crypto
            payments. These settings can be changed later.
          </Typography>
        </Box>

        <Box
          padding={'20px'}
          marginTop={'30px'}
          sx={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
          }}
        >
          <Typography
            fontSize="20px"
            fontWeight="bold"
            sx={{ opacity: '0.7' }}
            lineHeight={'120%'}
          >
            Configure Vault
          </Typography>

          <Box marginTop={'30px'}>
            <Typography fontSize="16px" fontWeight="bold">
              Select Receiving Token
            </Typography>
            <Typography
              marginTop={'10px'}
              fontSize="16px"
              sx={{ opacity: '0.6' }}
            >
              Select the token(s) to be received as payment for ticket purchases
            </Typography>
          </Box>
          <Box marginTop={'20px'}>
            <Typography
              fontSize="10px"
              fontWeight="bold"
              sx={{ opacity: '0.6' }}
            >
              PROTOCOL:
            </Typography>
            <Box marginTop={'10px'}>
              <ZuButton>
                <EthereumIcon />
                <Typography marginLeft="10px" fontSize="14px" fontWeight={600}>
                  Ethereum Chain
                </Typography>
              </ZuButton>
            </Box>
          </Box>
          <Box marginTop={'20px'}>
            <Typography
              fontSize="10px"
              fontWeight="bold"
              sx={{ opacity: '0.6' }}
            >
              TOKEN:
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
            <Stack
              direction="row"
              alignItems="center"
              gap="10px"
              marginTop={'30px'}
            >
              <Switch
                checked={selectedWhiteListTicket}
                onChange={handleToggle}
              />
              {selectedWhiteListTicket ? (
                <Typography style={{ marginLeft: '8px' }}>Whitelist</Typography>
              ) : (
                <Typography style={{ marginLeft: '8px' }}>
                  Permissionless
                </Typography>
              )}
            </Stack>
          </Box>
          <Box marginTop={'30px'}>
            <Typography fontSize="16px" sx={{ opacity: '0.6' }}>
              description - let the user know that the proceeds of this ticket
              purchases are sent to the contract
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box paddingX={3} marginTop={'10px'}>
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
              setIsNext(false), setIsConfirm(true);
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
        <Box display="flex" justifyContent={'center'} marginTop={'30px'}>
          <ScrollIcon />
        </Box>
      </Box>
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
  isHideUntilSetDate,
  setIsHideUntilSetDate,
  isHideAfterSetDate,
  setIsHideAfterSetDate,
  isHideWhenSoldOut,
  setIsHideWhenSoldOut,
  selectedToken,
  ticketMintDeadline,
  setTicketMintDeadline,
}: IProps) => {
  const fileInputField = useRef<HTMLInputElement>(null);
  // const [File, setFile] = useState(second)
  // const handleClick = (event: any) => {
  //   hiddenFileInput?.current.click();
  // };

  const [fileUploaded, setFileUploaded] = useState<HTMLInputElement | null>(
    null,
  );
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFilesChange = (event: { target: { files: any } }) => {
    const fileUpload = event.target.files[0];
    setFileUploaded(fileUpload);
    console.log({ fileUploaded });

    // const filesLength = fileUpload.length;
    console.log({ fileUploaded });
    if (fileUpload) {
      setImageUrl(URL.createObjectURL(fileUpload));
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography fontSize="18px" fontWeight="bold">
          Ticket Basics
        </Typography>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Ticket Name
          </Typography>
          <Input
            required
            name="ticketName"
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
            placeholder="Enter a name for your event"
          />

          {!isTicketFree && (
            <Box>
              <Typography
                color="white"
                fontSize="16px"
                fontWeight={500}
                marginTop={'20px'}
                fontFamily="Inter"
                marginBottom="10px"
              >
                Ticket Price
              </Typography>
              <Box position="relative">
                <Input
                  required
                  name="ticketPrice"
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
                    top: '14px',
                  }}
                >
                  {selectedToken === 'USDT' ? <USDTIcon /> : <USDCIcon />}
                  <Typography marginLeft={'10px'}>
                    {selectedToken === 'USDT' ? 'USDT' : 'USDC'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

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

        <Box flex={1}>
          <Typography
            color="white"
            fontSize="18px"
            fontWeight={700}
            fontFamily="Inter"
          >
            Ticket Mint Deadline
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={(newValue) => setTicketMintDeadline(newValue)}
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
          </LocalizationProvider>
        </Box>

        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Ticket Description
          </Typography>
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
            fontSize={'10px'}
            fontFamily={'Inter'}
            lineHeight={'120%'}
            letterSpacing={'0.2px'}
            marginTop={'10px'}
            display={'flex'}
            justifyContent={'end'}
            textTransform={'uppercase'}
            sx={{ opacity: '0.7' }}
          >
            100 Characters left
          </Typography>
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="10px"
          >
            Ticket Image
          </Typography>
          <Typography
            color="white"
            fontSize="13px"
            fontWeight={400}
            fontFamily="Inter"
            sx={{
              opacity: '0.6',
            }}
          >
            Recommend min of 200 * 200px (1:1 Ratio)
          </Typography>

          <Input
            id="tb-file-upload"
            type="file"
            name="ticketImage"
            inputProps={{
              accept: 'image/*',
            }}
            ref={fileInputField}
            onChange={(event: any) => handleFilesChange(event)}
            sx={{
              display: 'none',
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
            placeholder="Enter a name for your event"
          />
          <ZuButton>
            <label htmlFor="tb-file-upload">Upload Image </label>
            {fileUploaded
              ? ` - ${fileUploaded?.name.substring(0, 6)}...${fileUploaded?.name.slice(-6)}`
              : ''}
          </ZuButton>

          <Box
            marginTop={'12px'}
            sx={{
              backgroundColor: '#2d2d2d',
              opacity: '0.6',
              borderRadius: '8px',
              height: '200px',
              width: '220px',
            }}
          >
            {imageUrl && (
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                }}
                alt={imageUrl}
                src={imageUrl}
                width={100}
                height={100}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* CONFIGURE SETTINGS */}
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography
          color="white"
          fontSize="16px"
          fontWeight={700}
          fontFamily="Inter"
          marginBottom="10px"
          sx={{ opacity: '0.7' }}
        >
          Configure Settings
        </Typography>

        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="5px"
          >
            Starting Status
          </Typography>
          <Typography
            color="white"
            fontSize="13px"
            fontWeight={400}
            lineHeight={'140%'}
            letterSpacing={'0.13px'}
            fontFamily="Inter"
            marginBottom="10px"
            sx={{ opacity: '0.8' }}
          >
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
        </Box>

        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="5px"
            marginTop="20px"
          >
            Minimum/Maximum Orders
          </Typography>
          <Typography
            color="white"
            fontSize="13px"
            fontWeight={400}
            lineHeight={'140%'}
            letterSpacing={'0.13px'}
            fontFamily="Inter"
            sx={{ opacity: '0.6' }}
          >
            Select the min/max of orders per user
          </Typography>
        </Box>

        <Box marginTop={'20px'}>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="5px"
          >
            Min per order
          </Typography>
          <Input
            name="minPerOrder"
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
            placeholder="1"
          />
          <Typography
            color="white"
            fontSize="10px"
            fontFamily="Inter"
            marginTop="4px"
            lineHeight={'120%'}
            sx={{ opacity: '0.7' }}
          >
            Minimum is 1
          </Typography>
        </Box>
        <Box>
          <Typography
            color="white"
            fontSize="16px"
            fontWeight={500}
            fontFamily="Inter"
            marginBottom="5px"
          >
            Max per order
          </Typography>
          <Input
            name="maxPerOrder"
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
            placeholder="00"
          />
          <Typography
            color="white"
            fontSize="10px"
            fontFamily="Inter"
            marginTop="4px"
            sx={{ opacity: '0.7' }}
          >
            Maximum is 1
          </Typography>
        </Box>

        <Box display="flex" flexDirection="row">
          <ZuSwitch
            checked={isShowQtyRemaining}
            onChange={() => setIsShowQtyRemaining((prev: boolean) => !prev)}
          />
          <Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Show quantity remaining on event view
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
              Show users the current amount left for this ticket
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* CONFIGURE CONDITIONS */}
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography
          color="white"
          fontSize="16px"
          fontWeight={700}
          fontFamily="Inter"
          marginBottom="30px"
          sx={{ opacity: '0.7' }}
        >
          Configure Conditions
        </Typography>

        <Box display="flex">
          <ZuSwitch
            checked={isHideUntilSetDate}
            onChange={() => setIsHideUntilSetDate((prev: boolean) => !prev)}
          />
          <Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Hide until a set date and time
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
              Make this ticket visible and available to purchase until a set
              date/time
            </Typography>
          </Box>
        </Box>

        <Box display="flex">
          <ZuSwitch
            checked={isHideAfterSetDate}
            onChange={() => setIsHideAfterSetDate((prev: boolean) => !prev)}
          />
          <Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Hide After Set Date/Time
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
              Make this ticket hidden after a set date/time
            </Typography>
          </Box>
        </Box>

        <Box display="flex">
          <ZuSwitch
            checked={isHideWhenSoldOut}
            onChange={() => setIsHideWhenSoldOut((prev: boolean) => !prev)}
          />
          <Box>
            <Typography
              color="white"
              fontSize="16px"
              fontWeight={700}
              fontFamily="Inter"
              marginLeft="10px"
            >
              Hide when sold out
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
              When the ticket has sold out its quantity, it will automatically
              be hidden
            </Typography>
          </Box>
        </Box>
      </Box>

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
        marginTop={'10px'}
        marginBottom={'30px'}
      >
        <ScrollIcon />
      </Box>
    </Box>
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
            <Typography
              fontSize="16px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.8' }}
            >
              Method:
            </Typography>
            <Typography
              fontSize="16px"
              color="white"
              fontWeight={'700'}
              lineHeight={'160%'}
              sx={{ opacity: '0.8' }}
            >
              Combine Tickets in Contract
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
            <Typography
              fontSize="16px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.8' }}
            >
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
              <Typography
                fontSize="14px"
                color="white"
                marginLeft="8px"
                fontWeight={'600'}
                lineHeight={'160%'}
              >
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
            <Typography
              fontSize="16px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.8' }}
            >
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
              <Typography
                fontSize="14px"
                color="white"
                marginLeft="8px"
                fontWeight={'600'}
                lineHeight={'160%'}
              >
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
            <Typography
              variant="h5"
              fontSize="24px"
              fontFamily={'Inter'}
              lineHeight={'120%'}
              color="white"
            >
              {ticketInfo?.ticketName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                fontSize="14px"
                fontFamily={'Inter'}
                lineHeight={'160%'}
                color="white"
              >
                Price:
              </Typography>
              <Typography
                fontSize="16px"
                color="white"
                fontWeight={'700'}
                lineHeight={'120%'}
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {isTicketFree ? 'Free' : ticketInfo?.ticketPrice}
              </Typography>
              <Typography
                fontSize="10px"
                color="white"
                fontWeight={'400'}
                marginLeft={'2px'}
                lineHeight={'120%'}
                letterSpacing={'0.2'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {isTicketFree ? null : selectedToken}
              </Typography>
            </Box>

            <Typography
              fontSize="14px"
              fontFamily={'Inter'}
              lineHeight={'160%'}
              color="white"
              sx={{ opacity: '0.6' }}
            >
              Description:
            </Typography>
            <Typography
              fontSize="13px"
              color="white"
              fontWeight={'400'}
              lineHeight={'160%'}
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
      <Box display="flex" justifyContent={'center'} marginTop={'30px'}>
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
    <Stack sx={{ background: '#222', height: 'calc(100vh - 6.2rem)' }}>
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

      <Box display="flex" justifyContent={'center'} marginTop={'30px'}>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const TicketProcessingProgress = ({ txnHash }: any) => {
  const steps = [
    // {
    //   label: 'Ticketing Contract Deployed',
    //   description: '0x9999...f08E',
    //   // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
    // },
    {
      label: 'Validating Transaction',
      description: shortenAddress(txnHash),
    },
    // {
    //   label: 'Last Step',
    //   description: `desc`,
    // },
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
