'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Stack,
  Box,
  Typography,
  SwipeableDrawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  EventName,
  EventDetail,
  EventRegister,
  EventAbout,
} from 'components/event';
import {
  Verify,
  Agree,
  Mint,
  Complete,
  Transaction,
} from '@/components/event/Whitelist';
import {
  SponsorAgree,
  SponsorMint,
  SponsorTransaction,
  SponsorComplete,
} from '@/components/event/Sponsor';
import { ZuButton } from '@/components/core';
import { EditIcon, XMarkIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { Anchor, Contract } from '@/types';
import { LatLngLiteral } from 'leaflet';
import getLatLngFromAddress from '@/utils/osm';
import { styled } from '@mui/system';

interface IAbout {
  eventData: Event | undefined;
  setVerify: React.Dispatch<React.SetStateAction<boolean>> | any;
}

const Announcements: React.FC<IAbout> = ({ eventData, setVerify }) => {
  const [location, setLocation] = useState<string>('');

  const [whitelist, setWhitelist] = useState<boolean>(false);
  const [sponsor, setSponsor] = useState<boolean>(false);

  const [isInitial, setIsInitial] = useState<boolean>(false);
  const [isDisclaimer, setIsDisclaimer] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);

  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [isMint, setIsMint] = useState<boolean>(false);
  const [isTransaction, setIsTransaction] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [tokenId, setTokenId] = useState<string>('');
  const [isSponsorAgree, setIsSponsorAgree] = useState<boolean>(false);
  const [isSponsorMint, setIsSponsorMint] = useState<boolean>(false);
  const [isSponsorTransaction, setIsSponsorTransaction] =
    useState<boolean>(false);
  const [isSponsorComplete, setIsSponsorComplete] = useState<boolean>(false);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [ticketMinted, setTicketMinted] = useState<any[]>([]);
  const [mintedContract, setMintedContract] = useState<Contract>();
  const [transactionLog, setTransactionLog] = useState<any>();
  const params = useParams();
  const eventId = params.eventid.toString();

  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down('sm'));

  const { composeClient } = useCeramicContext();

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [osm, setOsm] = useState<LatLngLiteral | undefined>({
    lat: 0,
    lng: 0,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  const getLocation = async () => {
    try {
      const { data } = await supabase
        .from('locations')
        .select('*')
        .eq('eventId', eventId);
      if (data !== null) {
        setLocation(data[0].name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLocation();
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLatLngFromAddress(location);
      setOsm(res);
    };
    fetchData();
  }, [location]);

  const List = (anchor: Anchor) => {
    const handleClose = () => {
      toggleDrawer('right', false);
      setIsVerify(false);
      setIsAgree(false);
      setIsMint(false);
      setIsTransaction(false);
      setIsComplete(false);
      const root = ref.current?.getElementsByClassName('MuiPaper-root');
      if (root) root?.[0].scrollTo(0, 0);
      // setIsEmail(false);
    };

    return (
      <Box
        sx={{
          width: anchor === 'top' || anchor === 'bottom' ? 'auto' : '700px',
          backgroundColor: '#222222',
        }}
        role="presentation"
        zIndex="10001"
        borderLeft="1px solid #383838"
      >
        <Stack
          direction="row"
          spacing="14px"
          alignItems="center"
          height="50px"
          borderBottom="1px solid #383838"
          paddingX={3}
        >
          <ZuButton startIcon={<XMarkIcon />} onClick={() => handleClose()}>
            Close
          </ZuButton>
          <Typography variant="subtitleSB">Register for Event</Typography>
        </Stack>
        {whitelist && (
          <>
            {!isVerify &&
              !isAgree &&
              !isMint &&
              !isTransaction &&
              !isComplete && (
                <Verify
                  setIsVerify={setIsVerify}
                  eventContractID={eventData?.contractID}
                  setFilteredResults={setFilteredResults}
                />
              )}
            {isVerify &&
              !isAgree &&
              !isMint &&
              !isTransaction &&
              !isComplete && (
                <Agree setIsVerify={setIsVerify} setIsAgree={setIsAgree} />
              )}
            {!isVerify &&
              isAgree &&
              !isMint &&
              !isTransaction &&
              !isComplete && (
                <Mint
                  setIsAgree={setIsAgree}
                  setIsMint={setIsMint}
                  filteredResults={filteredResults}
                  event={eventData}
                  setTokenId={setTokenId}
                  setTicketMinted={setTicketMinted}
                  setIsTransaction={setIsTransaction}
                  setMintedContract={setMintedContract}
                  setTransactionLog={setTransactionLog}
                />
              )}
            {!isVerify &&
              !isAgree &&
              isMint &&
              !isTransaction &&
              !isComplete && (
                <Transaction
                  setIsMint={setIsMint}
                  setIsTransaction={setIsTransaction}
                  handleClose={handleClose}
                />
              )}
            {!isVerify &&
              !isAgree &&
              !isMint &&
              isTransaction &&
              !isComplete && (
                <Complete
                  setIsTransaction={setIsTransaction}
                  setIsComplete={setIsComplete}
                  handleClose={handleClose}
                  tokenId={tokenId}
                  ticketMinted={ticketMinted}
                  mintedContract={mintedContract}
                  transactionLog={transactionLog}
                />
              )}
          </>
        )}
        {sponsor && (
          <>
            {!isSponsorAgree &&
              !isSponsorMint &&
              !isSponsorTransaction &&
              !isSponsorComplete && (
                <SponsorAgree
                  setIsAgree={setIsSponsorAgree}
                  eventContractID={eventData?.contractID}
                  setFilteredResults={setFilteredResults}
                  event={eventData}
                />
              )}
            {isSponsorAgree &&
              !isSponsorMint &&
              !isSponsorTransaction &&
              !isSponsorComplete && (
                <SponsorMint
                  setIsAgree={setIsSponsorAgree}
                  setIsMint={setIsSponsorMint}
                  filteredResults={filteredResults}
                  event={eventData}
                  setTokenId={setTokenId}
                  setTicketMinted={setTicketMinted}
                />
              )}
            {!isSponsorAgree &&
              isSponsorMint &&
              !isSponsorTransaction &&
              !isSponsorComplete && (
                <SponsorTransaction
                  setIsMint={setIsSponsorMint}
                  setIsTransaction={setIsSponsorTransaction}
                  handleClose={handleClose}
                />
              )}
            {!isSponsorAgree &&
              !isSponsorMint &&
              isSponsorTransaction &&
              !isSponsorComplete && (
                <SponsorComplete
                  setIsTransaction={setIsSponsorTransaction}
                  setIsComplete={setIsSponsorComplete}
                  handleClose={handleClose}
                  tokenId={tokenId}
                  ticketMinted={ticketMinted}
                />
              )}
          </>
        )}
      </Box>
    );
  };

  return (
    <Stack
      padding="40px"
      justifyContent="center"
      alignItems="center"
      bgcolor="#222222"
      sx={{
        [breakpoints.down('sm')]: {
          padding: '20px',
        },
      }}
    >
      {eventData && (
        <Stack
          direction="row"
          justifyContent={'center'}
          gap={'10px'}
          sx={{
            [breakpoints.down('md')]: {
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            },
          }}
        >
          <Stack
            spacing="20px"
            boxSizing={'border-box'}
            sx={{
              width: '600px',
              px: '20px',
              [breakpoints.down('lg')]: {
                width: '540px',
              },
              [breakpoints.down('md')]: {
                width: '100%',
              },
              [breakpoints.down('sm')]: {
                px: '10px',
              },
            }}
          >
            <Stack
              padding="10px"
              bgcolor="#ffc77d1a"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              border="1px solid rgba(255, 199, 125, .1)"
              borderRadius={'8px'}
            >
              <Typography
                fontSize={'14px'}
                lineHeight={'160%'}
                color={'rgba(255, 199, 125, 1)'}
                fontWeight={600}
              >
                You are organizing this event
              </Typography>
              <ZuButton
                startIcon={<EditIcon size={5} />}
                sx={{
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255, 199, 125, 0.05)',
                  gap: '10px',
                  '& > span': {
                    margin: '0px',
                  },
                  color: 'rgba(255, 199, 125, 1)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
                onClick={() => toggleDrawer('right', true)}
              >
                Manage
              </ZuButton>
            </Stack>
            <Box gap="30px" display="flex" flexDirection="column">
              <Title>Host Announcements</Title>
              <Box>
                <TagButton># Announcement</TagButton>
              </Box>
            </Box>
            {isMobile ? (
              <EventRegister
                onToggle={toggleDrawer}
                setWhitelist={setWhitelist}
                setSponsor={setSponsor}
                external_url={eventData.external_url}
                eventId={eventData.id}
                setVerify={setVerify}
              />
            ) : null}
          </Stack>
          <Stack
            spacing="20px"
            sx={{
              width: '350px',
              px: '20px',
              [breakpoints.down('md')]: {
                width: '100%',
                px: '20px',
              },
              [breakpoints.down('sm')]: {
                px: '10px',
              },
            }}
          >
            {!isMobile ? (
              <EventRegister
                onToggle={toggleDrawer}
                setWhitelist={setWhitelist}
                setSponsor={setSponsor}
                external_url={eventData.external_url}
                eventId={eventData.id}
                setVerify={setVerify}
              />
            ) : null}
            <EventDetail
              status={eventData.status}
              links={eventData.customLinks}
              address={location}
              location={osm}
            />
          </Stack>
          <SwipeableDrawer
            hideBackdrop={true}
            sx={{
              '& .MuiDrawer-paper': {
                boxShadow: 'none',
              },
            }}
            anchor="right"
            open={state['right']}
            onClose={() => toggleDrawer('right', false)}
            onOpen={() => toggleDrawer('right', true)}
            ref={ref}
          >
            {List('right')}
          </SwipeableDrawer>
        </Stack>
      )}
    </Stack>
  );
};

const Title = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
  line-height: 120%;
  color: #fff;
  opacity: 0.6;
  text-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
`;

const TagButton = styled(ZuButton)`
  padding: 6px 8px;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 13px;
  line-height: 140%;
  color: #fff;
`;

export default Announcements;
