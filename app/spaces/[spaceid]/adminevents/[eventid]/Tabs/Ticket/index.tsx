import * as React from 'react';
import { Stack, Box, SwipeableDrawer, Typography } from '@mui/material';
import {
  TicketHeader,
  TicketList,
  TicketAdd,
  TicketAccess,
  InitialSetup,
  TicketSetup,
  CreateTicket,
  TicketCreationSummary,
  ProcessingTicket,
  TicketVault,
} from './components';
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
import { Address, parseUnits } from 'viem';
import dayjs, { Dayjs } from 'dayjs';
import { convertDateToEpoch } from '@/utils/format';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { ERC20_ABI } from '@/utils/erc20_abi';
import { TICKET_WITH_WHITELIST_ABI } from '@/utils/ticket_with_whitelist_abi';
import { useEffect } from 'react';
import { IEventArg } from '@/app/spaces/[spaceid]/adminevents/page';
import { Event } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import { Abi, AbiItem } from 'viem';
import { TicketType } from './components/CreateTicket';
type Anchor = 'top' | 'left' | 'bottom' | 'right';
interface PropTypes {
  event?: Event;
}
interface Contract {
  type?: string;
  contractAddress?: string;
  description?: string;
  image_url?: string;
  status?: string;
}
const Ticket = ({ event }: PropTypes) => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const [ticketInfo, setTicketInfo] = React.useState<any>({});
  const [isTicketFree, setIsTicketFree] = React.useState(false);
  const [isShowQtyRemaining, setIsShowQtyRemaining] = React.useState(false);
  const [isHideUntilSetDate, setIsHideUntilSetDate] = React.useState(false);
  const [isHideAfterSetDate, setIsHideAfterSetDate] = React.useState(false);
  const [isMintCloseTime, setIsMintCloseTime] = React.useState(false);
  const [endDate, setEndDate] = React.useState<Dayjs>(dayjs());
  const [endTime, setEndTime] = React.useState<Dayjs>(dayjs());
  const [isHideWhenSoldOut, setIsHideWhenSoldOut] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState('USDT');
  const [selectedType, setSelectedType] = React.useState('Attendee');
  const [isWhiteList, setIsWhiteList] = React.useState(false);
  const { ceramic, composeClient, profile } = useCeramicContext();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setTicketInfo({
      ...ticketInfo,
      [name]: value,
    });
  };
  console.log(
    { ticketInfo },
    isTicketFree,
    isShowQtyRemaining,
    isHideUntilSetDate,
    isHideAfterSetDate,
    isHideWhenSoldOut,
  );

  const [isConfirm, setIsConfirm] = React.useState(false);
  const [isNext, setIsNext] = React.useState(false);
  const [isTicket, setIsTicket] = React.useState(false);
  const [goToSummary, setGoToSummary] = React.useState(false);
  const [purchasingTicket, setPurchasingTicket] = React.useState(false);
  const [toggleAction, setToggleAction] = React.useState('CreateTicket');
  const [txnHash, setTxnHash] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [ticketMintDeadline, setTicketMintDeadline] =
    React.useState<Dayjs | null>(dayjs());
  const [vaultIndex, setVaultIndex] = React.useState<number>(0);
  const handleFileChange = (event: { target: { files: any[] } }) => {
    const file = event.target.files[0];
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp'];

    if (
      file &&
      allowedExtensions.includes(file.name.split('.').pop().toLowerCase())
    ) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  // the event ticket ID here will be retrieved from ceramic

  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [tickets, setTickets] = React.useState<Array<any>>([]);
  const [ticketAddresses, setTicketAddresses] = React.useState<Array<string>>(
    [],
  );
  const initialWhitelist = ['0x0000000000000000000000000000000000000000'];
  const updateEventById = async (
    type?: string,
    contractAddress?: string,
    description?: string,
    image_url?: string,
    status?: string,
  ) => {
    const existingContracts: Contract[] = Array.isArray(event?.contracts)
      ? event.contracts
      : [];
    console.log(existingContracts);
    const newContract: Contract = {
      type,
      contractAddress,
      description,
      image_url,
      status,
    };
    const updatedContracts: Contract[] = [...existingContracts, newContract];
    console.log(updatedContracts);
    const query = `
         mutation UpdateEvent($i: UpdateEventInput!) {
          updateEvent(input: $i) {
            document {
              id
            }
      }
    }
  `;

    const variables = {
      i: {
        id: event?.id,
        content: {
          contracts: updatedContracts,
        },
      },
    };

    try {
      const result: any = await composeClient.executeQuery(query, variables);
      console.log(result);
    } catch (err) {
      console.log('ERROR: Update: ', err);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setIsSubmitLoading(true);
      setPurchasingTicket(true);
      setGoToSummary(false);
      console.log(isTicketFree, 'free');
      let ticketMintClose: Dayjs;
      if (isMintCloseTime) {
        endDate.hour(endTime.hour());
        endDate.minute(endTime.minute());
        endDate.second(endTime.second());
        endDate.millisecond(endTime.millisecond());
        ticketMintClose = endDate;
      } else {
        const eventEndTime = dayjs(event?.endTime, 'YYYY-MM-DD HH:mm:ss');
        ticketMintClose = eventEndTime.subtract(1, 'minute');
      }

      const decimal = (await client.readContract({
        address:
          selectedToken === 'USDT' ? mUSDT_TOKEN : (mUSDC_TOKEN as Address),
        abi: ERC20_ABI,
        functionName: 'decimals',
      })) as number;
      console.log(decimal, 'decimal');
      const createTicketHash = await writeContract(config, {
        chainId: scrollSepolia.id,
        address: TICKET_FACTORY_ADDRESS as Address,
        abi: TICKET_FACTORY_ABI,
        functionName: 'createNewTicket',
        args: isWhiteList
          ? [
              event?.contractID,
              ticketInfo?.ticketName,
              selectedToken === 'USDT' ? mUSDT_TOKEN : mUSDC_TOKEN,
              convertDateToEpoch(ticketMintClose),
              isTicketFree
                ? 0
                : parseUnits(String(ticketInfo?.ticketPrice), decimal),
              true,
              initialWhitelist,
            ]
          : [
              event?.contractID,
              ticketInfo?.ticketName,
              selectedToken === 'USDT' ? mUSDT_TOKEN : mUSDC_TOKEN,
              convertDateToEpoch(ticketMintClose),
              isTicketFree
                ? 0
                : parseUnits(String(ticketInfo?.ticketPrice), decimal),
              false,
              [],
            ],
      });
      setTxnHash(createTicketHash);

      const { status: createTicketStatus, logs: createTicketLogs } =
        await waitForTransactionReceipt(config, {
          hash: createTicketHash,
          timeout: 6000_000,
        });

      if (createTicketStatus === 'success') {
        const defaultPreviewImage =
          'https://unsplash.com/photos/a-small-yellow-boat-floating-on-top-of-a-lake-HONnVkEnzDo';
        const previewImageToUse = previewImage ?? defaultPreviewImage;
        console.log(createTicketLogs);
        if (createTicketLogs.length > 0) {
          const newContractAddress = createTicketLogs[0].address;
          updateEventById(
            selectedType,
            newContractAddress?.toString(),
            ticketInfo?.description,
            previewImageToUse,
            ticketInfo?.startingStatus,
          );
          setPurchasingTicket(true);
          setGoToSummary(false);
        }
      }
      await readFromContract();
      setIsSubmitLoading(false);
    } catch (error) {
      console.log(error);
      setIsSubmitLoading(false);
    }
  };

  const readFromContract = async () => {
    try {
      setIsLoading(true);

      const getTicketAddresses = (await client.readContract({
        address: TICKET_FACTORY_ADDRESS as Address,
        abi: TICKET_FACTORY_ABI as Abi,
        functionName: 'getTickets',
        args: [event?.contractID],
      })) as Array<string>;

      console.log({ getTicketAddresses });
      setTicketAddresses(getTicketAddresses);

      if (getTicketAddresses?.length > 0) {
        let results = [];
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
          results.push(result);
        }
        console.log('Multicall result: ', results);
        setTickets(results);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    readFromContract();
  }, []);

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <Box
        display="flex"
        alignItems="center"
        height="50px"
        borderBottom="1px solid #383838"
        paddingX={3}
      >
        <ZuButton
          onClick={() => {
            toggleDrawer('right', false), setIsConfirm(false);
            setGoToSummary(false);
            setPurchasingTicket(false);
            setIsNext(false);
          }}
        >
          Close
        </ZuButton>
        <Typography marginLeft={'14px'} fontSize="18px" fontWeight="bold">
          Create Ticket
        </Typography>
      </Box>

      {!goToSummary &&
        !isConfirm &&
        !purchasingTicket &&
        !isNext &&
        !isTicket && <InitialSetup setIsNext={setIsNext} />}
      {!goToSummary &&
        !isConfirm &&
        !purchasingTicket &&
        isNext &&
        !isTicket && (
          <TicketSetup
            setIsNext={setIsNext}
            setIsConfirm={setIsConfirm}
            setSelectedToken={setSelectedToken}
            selectedToken={selectedToken}
            setIsTicket={setIsTicket}
          />
        )}
      {!goToSummary &&
        !isConfirm &&
        !purchasingTicket &&
        !isNext &&
        isTicket && (
          <TicketType
            setIsTicket={setIsTicket}
            setIsNext={setIsNext}
            setIsConfirm={setIsConfirm}
            setSelectedToken={setSelectedToken}
            selectedToken={selectedToken}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        )}
      {isConfirm &&
        !purchasingTicket &&
        !goToSummary &&
        !isNext &&
        !isTicket && (
          <CreateTicket
            selectedToken={selectedToken}
            isTicketFree={isTicketFree}
            setIsTicketFree={setIsTicketFree}
            isShowQtyRemaining={isShowQtyRemaining}
            setIsShowQtyRemaining={setIsShowQtyRemaining}
            isHideUntilSetDate={isHideUntilSetDate}
            setIsHideUntilSetDate={setIsHideUntilSetDate}
            isHideAfterSetDate={isHideAfterSetDate}
            setIsHideAfterSetDate={setIsHideAfterSetDate}
            isHideWhenSoldOut={isHideWhenSoldOut}
            setIsHideWhenSoldOut={setIsHideWhenSoldOut}
            isWhiteList={isWhiteList}
            setIsWhiteList={setIsWhiteList}
            handleChange={handleChange}
            setIsConfirm={setIsConfirm}
            setGoToSummary={setGoToSummary}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            handleFileChange={handleFileChange}
            ticketMintDeadline={ticketMintDeadline}
            setTicketMintDeadline={setTicketMintDeadline}
            isMintCloseTime={isMintCloseTime}
            setIsMintCloseTime={setIsMintCloseTime}
            endDate={endDate}
            setEndDate={setEndDate}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        )}
      {!purchasingTicket &&
        !isConfirm &&
        goToSummary &&
        !isNext &&
        !isTicket && (
          <TicketCreationSummary
            handleSubmit={handleSubmit}
            isTicketFree={isTicketFree}
            selectedToken={selectedToken}
            isWhiteList={isWhiteList}
            ticketInfo={ticketInfo}
            setIsConfirm={setIsConfirm}
            setPurchasingTicket={setPurchasingTicket}
            setGoToSummary={setGoToSummary}
          />
        )}
      {purchasingTicket &&
        !goToSummary &&
        !isConfirm &&
        !isNext &&
        !isTicket && (
          <ProcessingTicket
            setPurchasingTicket={setPurchasingTicket}
            toggleDrawer={toggleDrawer}
            isSubmitLoading={isSubmitLoading}
            txnHash={txnHash}
          />
        )}
    </Box>
  );
  const vault = (anchor: Anchor) => (
    <Box
      sx={{
        maxWidth: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
        backgroundColor: '#222222',
      }}
      role="presentation"
      zIndex="100"
      borderLeft="1px solid #383838"
    >
      <Box
        display="flex"
        alignItems="center"
        height="50px"
        borderBottom="1px solid #383838"
        paddingX={3}
      >
        <ZuButton onClick={() => toggleDrawer('right', false)}>Close</ZuButton>
        <Typography marginLeft={'14px'} fontSize="18px" fontWeight="bold">
          Create Ticket
        </Typography>
      </Box>
      <TicketVault
        vaultIndex={vaultIndex}
        ticketAddresses={ticketAddresses}
        tickets={tickets}
      />
    </Box>
  );

  return (
    <Stack spacing={2}>
      <TicketHeader event={event} visible={!!event?.contractID} />
      {isLoading ? (
        <Box>
          <Typography>Loading...</Typography>
        </Box>
      ) : tickets.length > 0 ? (
        <TicketList
          setVaultIndex={setVaultIndex}
          ticketAddresses={ticketAddresses}
          tickets={tickets}
          setToggleAction={setToggleAction}
          onToggle={toggleDrawer}
        />
      ) : (
        <TicketAdd
          onToggle={toggleDrawer}
          setToggleAction={setToggleAction}
          visible={!event?.contractID}
        />
      )}
      <TicketAccess />
      <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '50px',
            height: 'calc(100% - 35px)',
            boxShadow: 'none',
          },
        }}
        anchor="right"
        open={state['right']}
        onClose={() => toggleDrawer('right', false)}
        onOpen={() => toggleDrawer('right', true)}
      >
        {toggleAction === 'CreateTicket'
          ? list('right')
          : toggleAction === 'ViewVault'
            ? vault('right')
            : null}
      </SwipeableDrawer>
    </Stack>
  );
};

export default Ticket;
