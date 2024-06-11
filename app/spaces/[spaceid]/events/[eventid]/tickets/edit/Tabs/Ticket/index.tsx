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
import { TICKET_FACTORY_ADDRESS, mUSDC_TOKEN, mUSDT_TOKEN, ticketFactoryGetContract } from '@/constant';
import { Address } from 'viem';
import dayjs, { Dayjs } from 'dayjs';
import { convertDateToEpoch } from '@/utils/format';
import { TICKET_ABI } from '@/utils/ticket_abi';
import { useEffect } from 'react';
import { IEventArg } from '@/app/spaces/[spaceid]/adminevents/page';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Ticket = () => {

  const { address } = useAccount();
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
  const [isHideWhenSoldOut, setIsHideWhenSoldOut] = React.useState(false);
  const [selectedToken, setSelectedToken] = React.useState('USDT');

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setTicketInfo({
      ...ticketInfo,
      [name]: value,
    });
  };
  console.log({ ticketInfo }, isTicketFree, isShowQtyRemaining, isHideUntilSetDate, isHideAfterSetDate, isHideWhenSoldOut);

  const [isConfirm, setIsConfirm] = React.useState(false);
  const [isNext, setIsNext] = React.useState(false);
  const [goToSummary, setGoToSummary] = React.useState(false);
  const [purchasingTicket, setPurchasingTicket] = React.useState(false);
  const [toggleAction, setToggleAction] = React.useState('CreateTicket');
  const [txnHash, setTxnHash] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [ticketMintDeadline, setTicketMintDeadline] = React.useState<Dayjs | null>(dayjs());
  const [vaultIndex, setVaultIndex] = React.useState<number>(0)


  const handleFileChange = (event: { target: { files: any[]; }; }) => {
    const file = event.target.files[0];
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp'];

    if (file && allowedExtensions.includes(file.name.split('.').pop().toLowerCase())) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  let eventId = 0;

  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [tickets, setTickets] = React.useState<Array<any>>([])
  const [ticketAddresses, setTicketAddresses] = React.useState<Array<string>>([])

  const handleSubmit = async(e: any)=> {
    e.preventDefault();

    try {
      setIsSubmitLoading(true);
      setPurchasingTicket(true);
      setGoToSummary(false);
      
      const createTicketHash = await writeContract(config, {
        chainId: scrollSepolia.id,
        address: TICKET_FACTORY_ADDRESS as Address,
        abi: TICKET_FACTORY_ABI,
        functionName: "createNewTicket",
        args: [
          eventId, 
          selectedToken === "USDT" ? mUSDT_TOKEN : mUSDC_TOKEN,
          convertDateToEpoch(ticketMintDeadline),
          ticketInfo?.ticketPrice
        ]
      })
      setTxnHash(createTicketHash);
      
      const { status: createTicketStatus } = await waitForTransactionReceipt(config, {
        hash: createTicketHash,
      })
        
      const events = await ticketFactoryGetContract.getEvents.TicketCreated({});
      const eventTicketId = String((events[0] as unknown as IEventArg)?.args?.eventId);
      console.log({ eventTicketId });
      
      if (createTicketStatus === "success") {
        // setPurchasingTicket(true);
        // setGoToSummary(false);
      }

      setIsSubmitLoading(false)
    } catch (error) {
      console.log(error);
      setIsSubmitLoading(false)
    }

  }



  const readFromContract = async () => {
    setIsLoading(true);

    const getTicketAddresses = await client.readContract({
      address: TICKET_FACTORY_ADDRESS as Address,
      abi: TICKET_FACTORY_ABI,
      functionName: 'getTickets',
      args: ['0']
    }) as Array<string>;

    console.log({ getTicketAddresses });
    setTicketAddresses(getTicketAddresses)

    let results = [];
    for (let i = 0; i < getTicketAddresses?.length; i++) {      
      const ticketContract = {
        address: getTicketAddresses[i] as any,
        abi: TICKET_ABI
      } as const
      console.log({ticketContract});

      const result = await client.multicall({
        contracts: [
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
          }
        ]
      })
      results.push(result);      
    }
    setTickets(results)
    setIsLoading(false);
  }

  useEffect(() => {
    readFromContract();
  }, [])



  const list = (anchor: Anchor) => (
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
        <ZuButton onClick={() => {toggleDrawer('right', false),
          setIsConfirm(false)
          setGoToSummary(false)
          setPurchasingTicket(false)
          setIsNext(false)
        }}>Close</ZuButton>
        <Typography marginLeft={'14px'} fontSize="18px" fontWeight="bold">
          Create Ticket
        </Typography>
      </Box>

      {!goToSummary && !isConfirm && !purchasingTicket && !isNext && (
        <InitialSetup setIsNext={setIsNext} />
      )}
      {!goToSummary && !isConfirm && !purchasingTicket && isNext && (
        <TicketSetup
          setIsNext={setIsNext} setIsConfirm={setIsConfirm} setSelectedToken={setSelectedToken} selectedToken={selectedToken} />
      )}
      {isConfirm && !purchasingTicket && !goToSummary && !isNext && (
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
        />
      )}
      {!purchasingTicket && !isConfirm && goToSummary && !isNext && (
        <TicketCreationSummary
          handleSubmit={handleSubmit}
          isTicketFree={isTicketFree}
          selectedToken={selectedToken}
          ticketInfo={ticketInfo}
          setIsConfirm={setIsConfirm}
          setPurchasingTicket={setPurchasingTicket}
          setGoToSummary={setGoToSummary}
        />
      )}
      {purchasingTicket && !goToSummary && !isConfirm && !isNext && (
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
      <TicketHeader />
      {
        isLoading ? (<Box>
          <Typography>
            Loading...
          </Typography>
        </Box>) : 
        <TicketList setVaultIndex={setVaultIndex} ticketAddresses={ticketAddresses} tickets={tickets} setToggleAction={setToggleAction} onToggle={toggleDrawer} />
      }
      <TicketAdd />
      <TicketAccess />
      <SwipeableDrawer
        hideBackdrop={true}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: '50px',
            height: 'calc(100% - 50px)',
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
