'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
  Initial,
  Disclaimer,
  Email,
  Payment,
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
import { XMarkIcon } from '@/components/icons';
import { useCeramicContext } from '@/context/CeramicContext';
import { CeramicResponseType, EventEdge, Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { SpaceCard } from '@/components/cards';
import { Anchor, Contract } from '@/types';
import { LatLngLiteral } from 'leaflet';
import getLatLngFromAddress from '@/utils/osm';
import LotteryCard from '@/components/cards/LotteryCard';

interface IAbout {
  eventData: Event | undefined;
  setVerify: React.Dispatch<React.SetStateAction<boolean>> | any;
}

const About: React.FC<IAbout> = ({ eventData, setVerify }) => {
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
      setIsEmail(false);
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
        {/* {!isInitial && !isDisclaimer && !isEmail && !isPayment && <Initial setIsInitial={setIsInitial} />}
        {isInitial && !isDisclaimer && !isEmail && !isPayment && <Disclaimer setIsInitial={setIsInitial} setIsDisclaimer={setIsDisclaimer} />}
        {!isInitial && isDisclaimer && !isEmail && !isPayment && <Email setIsDisclaimer={setIsDisclaimer} setIsEmail={setIsEmail} />}
        {!isInitial && !isDisclaimer && isEmail && !isPayment && <Payment setIsEmail={setIsEmail} setIsPayment={setIsPayment} handleClose={handleClose} />} */}
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
    >
      {eventData && (
        <Stack
          direction="row"
          justifyContent={'center'}
          gap={'10px'}
          paddingTop={'40px'}
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
            {/* <Stack spacing="4px">
                      <Box component="img" src="/sponsor_banner.png" height="100px" borderRadius="10px" />
                      <Typography variant="caption" textAlign="right">
                        Sponsored Banner
                      </Typography>
                    </Stack> */}

            <EventName
              avatar={eventData.space?.avatar}
              tagline={eventData.tagline}
              endTime={eventData.endTime}
              startTime={eventData.startTime}
              eventDescription={eventData.description}
              spaceName={eventData.space?.name}
              eventName={eventData.title}
              location={location}
              organizer={eventData.profile?.username as string}
              image_url={eventData.image_url}
              status={eventData.status}
            />
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
            <EventAbout description={eventData.description} />
            <Stack
              bgcolor="#292929"
              padding="20px"
              spacing="20px"
              borderRadius="10px"
            >
              <Typography
                variant="subtitleSB"
                sx={{
                  opacity: '0.6',
                  textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
                }}
                fontSize={'18px'}
                fontWeight={700}
              >
                EVENT SPONSORS
              </Typography>
              <Box display="flex" gap="20px" flexWrap="wrap">
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
                <Stack alignItems="center" spacing="4px">
                  <Box
                    component="img"
                    src="/sponsor.png"
                    width="100px"
                    height="100px"
                    borderRadius="10px"
                  />
                  <Typography variant="bodyS">SponsorName</Typography>
                </Stack>
              </Box>
            </Stack>
            {/*<Stack
              bgcolor="#292929"
              padding="20px"
              spacing="20px"
              borderRadius="10px"
              height="300px"
            >
              <Typography variant="subtitleSB" sx={{opacity: '0.6', textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)'}} fontSize={'18px'} fontWeight={700}>ORGANIZER UPDATES</Typography>
              <Stack spacing="10px">
                <Stack direction="row" alignItems="center" spacing="10px">
                  <Box
                    component="img"
                    src="/5.webp"
                    width="30px"
                    height="30px"
                    borderRadius="20px"
                  />
                  <Typography variant="bodyMB">drivenfast</Typography>
                  <Typography variant="caption">3 DAYS AGO</Typography>
                </Stack>
                <Typography variant="bodyM">
                  ZuConnect is an experience crafted with love by Zuzalu, whose
                  mission is to foster a global network of communities to
                  advance humanity by creating playgrounds at the intersection
                  of free and open technology, science, health, and social
                  innovation.
                </Typography>
              </Stack>
            </Stack>*/}
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
            {/* <Stack spacing="4px">
                      <Box component="img" src="/sponsor_banner.png" height="200px" borderRadius="10px" width="100%" />
                      <Typography variant="caption" textAlign="right">
                        Sponsored Banner
                      </Typography>
                    </Stack> */}
            <LotteryCard inEvent />
            <EventDetail
              status={eventData.status}
              links={eventData.customLinks}
              address={location}
              location={osm}
            />
            {/* <Stack>
                      <SpaceCard id={params.spaceid.toString()} title={eventData?.space?.name} logoImage={eventData?.space?.avatar} bgImage={eventData?.space?.banner} description={eventData?.space?.description} />
                    </Stack> */}
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
          >
            {List('right')}
          </SwipeableDrawer>
        </Stack>
      )}
    </Stack>
  );
};

export default About;
