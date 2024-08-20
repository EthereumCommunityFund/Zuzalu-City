'use client';
import React, { useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Stack,
  Box,
  Typography,
  SwipeableDrawer,
  useTheme,
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
import { XMarkIcon } from '@/components/icons';
import { Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { Anchor, Contract } from '@/types';
import getLatLngFromAddress from '@/utils/osm';
import LotteryCard from '@/components/cards/LotteryCard';
import { useQuery } from '@tanstack/react-query';
import { useDrawerState, useMediaQuery } from '@/hooks';

interface IAbout {
  eventData: Event | undefined;
  setVerify: React.Dispatch<React.SetStateAction<boolean>> | any;
}

const About: React.FC<IAbout> = ({ eventData, setVerify }) => {
  const [whitelist, setWhitelist] = useState<boolean>(false);
  const [sponsor, setSponsor] = useState<boolean>(false);

  const [mintStep, setMintStep] = useState<
    'verify' | 'agree' | 'mint' | 'transaction' | 'complete'
  >('verify');

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
  const { isMobile } = useMediaQuery();

  const { state, setState } = useDrawerState();

  const ref = useRef<HTMLDivElement | null>(null);

  const { data: locationName } = useQuery({
    queryKey: ['getLocation', eventId],
    queryFn: () => {
      return supabase.from('locations').select('*').eq('eventId', eventId);
    },
    select: (data: any) => {
      if (data.data !== null) {
        return data.data[0].name;
      }
      return null;
    },
  });

  const { data: osmData } = useQuery({
    queryKey: ['getLatLngFromAddress', locationName],
    queryFn: () => getLatLngFromAddress(locationName),
    enabled: !!locationName,
  });

  const toggleDrawer = useCallback(
    (anchor: Anchor, open: boolean) => {
      setState((v) => ({ ...v, [anchor]: open }));
    },
    [setState],
  );

  const List = (anchor: Anchor) => {
    const handleClose = () => {
      toggleDrawer('right', false);
      setMintStep('verify');
      const root = ref.current?.getElementsByClassName('MuiPaper-root');
      if (root) root?.[0].scrollTo(0, 0);
    };

    const handleNext = (type: string) => {
      const steps: any[] = [
        'verify',
        'agree',
        'mint',
        'transaction',
        'complete',
      ];
      const index = steps.findIndex((step) => step === type);
      setMintStep(steps[index + 1]);
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
            {mintStep === 'verify' && (
              <Verify
                handleNext={handleNext}
                eventContractID={eventData?.contractID}
                setFilteredResults={setFilteredResults}
              />
            )}
            {mintStep === 'agree' && <Agree handleNext={handleNext} />}
            {mintStep === 'mint' && (
              <Mint
                handleNext={handleNext}
                filteredResults={filteredResults}
                event={eventData}
                setTokenId={setTokenId}
                setTicketMinted={setTicketMinted}
                setMintedContract={setMintedContract}
                setTransactionLog={setTransactionLog}
              />
            )}
            {mintStep === 'transaction' && (
              <Transaction handleNext={handleNext} />
            )}
            {mintStep === 'complete' && (
              <Complete
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
            <EventName
              avatar={eventData.space?.avatar}
              tagline={eventData.tagline}
              endTime={eventData.endTime}
              startTime={eventData.startTime}
              eventDescription={eventData.description}
              spaceName={eventData.space?.name}
              eventName={eventData.title}
              location={locationName}
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
            <LotteryCard inEvent />
            <EventDetail
              status={eventData.status}
              links={eventData.customLinks}
              address={locationName}
              location={osmData}
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

export default About;
