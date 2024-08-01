import {
  ChevronDownIcon,
  ChevronUpIcon,
  RightArrowCircleIcon,
} from '@/components/icons';
import { Divider, Stack, Typography } from '@mui/material';
import BpCheckbox from '../Checkbox';
import { ZuButton } from '@/components/core';
import { Dispatch, SetStateAction } from 'react';
import { Anchor } from '@/types';

interface PropTypes {
  isOne: boolean;
  setIsOne: Dispatch<SetStateAction<boolean>>;
  isTwo: boolean;
  setIsTwo: Dispatch<SetStateAction<boolean>>;
  setSponsor: Dispatch<SetStateAction<boolean>>;
  setWhitelist: Dispatch<SetStateAction<boolean>>;
  onToggle: (anchor: Anchor, open: boolean) => void;
  handleStep: (val: number) => void;
}

export const InitialStep = ({
  setIsOne,
  isOne,
  setIsTwo,
  isTwo,
  setSponsor,
  setWhitelist,
  onToggle,
  handleStep,
}: PropTypes) => {
  return (
    <Stack spacing="1px" padding="10px 20px">
      <Stack spacing="4px">
        {/*<Typography color="white" variant="bodyMB" sx={{ opacity: '0.7' }}>
          Get Ticket: (single)
        </Typography>
        <Typography color="#FF9C66" variant="bodyS" sx={{ opacity: '0.8' }}>
          All tickets require an application
        </Typography>
      </Stack>
      <Stack spacing="10px">
        <Stack
          onClick={() => setIsOne((prev) => !prev)}
          sx={{ cursor: 'pointer' }}
          spacing="10px"
          padding="10px"
          direction="row"
          borderRadius="10px"
          bgcolor="#2a2a2a"
        >*/}
        {/*isOne ? <ChevronUpIcon size={5} /> : <ChevronDownIcon size={5} />}
          <Stack spacing="5px" width={'100%'} flex={1}>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction="row"
              width={'100%'}
            >
              <Typography variant="bodyMB" fontSize={'14px'} fontWeight={600}>
                Full Pass
              </Typography>
              <Stack
                direction="row"
                alignItems="end"
                spacing="5px"
                sx={{ opacity: '0.7' }}
              >
                <Typography variant="bodyMB">1000</Typography>
                <Typography variant="caption">USDT</Typography>
              </Stack>
            </Stack>
            <Typography
              variant="bodyS"
              fontSize={'13px'}
              fontWeight={400}
              sx={{ opacity: '0.7' }}
              fontFamily={'Inter'}
              lineHeight={'140%'}
              letterSpacing={'0.13px'}
            >
              This pass does not include accomodation.
            </Typography>
          </Stack>
        </Stack>*/}
        {/*isOne && (
          <Stack>
            <Typography variant="bodyS" textAlign="center">
              Select Accommodation Type:
            </Typography>
            <Stack divider={<Divider sx={{ border: '1px solid #383838' }} />}>
              <Stack spacing="10px" padding="10px" direction="row">
                <BpCheckbox />
                <Stack spacing="5px">
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                  >
                    <Typography variant="bodyMB">Accom One</Typography>
                    <Stack direction="row" alignItems="end" spacing="5px">
                      <Typography variant="bodyMB">+100</Typography>
                      <Typography variant="caption">USDT</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="bodyS">
                    Get ready to groove at the Summer Music Festival! Join us
                    for a day filled with live music, food trucks, and good
                    vibes.
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing="10px" padding="10px" direction="row">
                <BpCheckbox />
                <Stack spacing="5px">
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                  >
                    <Typography variant="bodyMB">Accom One</Typography>
                    <Stack direction="row" alignItems="end" spacing="5px">
                      <Typography variant="bodyMB">+100</Typography>
                      <Typography variant="caption">USDT</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="bodyS">
                    Get ready to groove at the Summer Music Festival! Join us
                    for a day filled with live music, food trucks, and good
                    vibes.
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )}
        <Stack
          onClick={() => setIsTwo((prev) => !prev)}
          sx={{ cursor: 'pointer' }}
          spacing="10px"
          padding="10px"
          direction="row"
          borderRadius="10px"
          bgcolor="#2a2a2a"
        >*/}
        {/*isTwo ? <ChevronUpIcon size={5} /> : <ChevronDownIcon size={5} />*/}
        {/*<Stack spacing="5px" width={'100%'} flex={1}>
            <Stack
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="bodyMB" fontSize={'14px'} fontWeight={600}>
                Week Pass
              </Typography>
              <Stack
                direction="row"
                alignItems="end"
                spacing="5px"
                sx={{ opacity: '0.7' }}
              >
                <Typography variant="bodyMB">1000</Typography>
                <Typography variant="caption">USDT</Typography>
              </Stack>
            </Stack>
            <Typography
              variant="bodyS"
              fontSize={'13px'}
              fontWeight={400}
              sx={{ opacity: '0.7' }}
              fontFamily={'Inter'}
              lineHeight={'140%'}
              letterSpacing={'0.13px'}
            >
              one two three four five six seven eight nine ten elevane
            </Typography>
          </Stack>
        </Stack>*/}
        {/*isTwo && (
          <Stack>
            <Typography variant="bodyS" textAlign="center">
              Select Accommodation Type:
            </Typography>
            <Stack divider={<Divider sx={{ border: '1px solid #383838' }} />}>
              <Stack spacing="10px" padding="10px" direction="row">
                <BpCheckbox />
                <Stack spacing="5px">
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                  >
                    <Typography variant="bodyMB">Accom One</Typography>
                    <Stack direction="row" alignItems="end" spacing="5px">
                      <Typography variant="bodyMB">+100</Typography>
                      <Typography variant="caption">USDT</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="bodyS">
                    Get ready to groove at the Summer Music Festival! Join us
                    for a day filled with live music, food trucks, and good
                    vibes.
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing="10px" padding="10px" direction="row">
                <BpCheckbox />
                <Stack spacing="5px">
                  <Stack
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                  >
                    <Typography variant="bodyMB">Accom One</Typography>
                    <Stack direction="row" alignItems="end" spacing="5px">
                      <Typography variant="bodyMB">+100</Typography>
                      <Typography variant="caption">USDT</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="bodyS">
                    Get ready to groove at the Summer Music Festival! Join us
                    for a day filled with live music, food trucks, and good
                    vibes.
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )*/}
      </Stack>
      <Stack spacing="10px">
        {/*<ZuButton
          sx={{
            backgroundColor: '#373b36',
            color: '#D7FFC4',
            width: '100%',
            '&:disabled': {
              opacity: '0.5',
              color: '#D7FFC4',
              backgroundColor: '#373b36',
              border: '1px solid rgba(215, 255, 196, 0.20)',
            },
          }}
          startIcon={<RightArrowCircleIcon color="#D7FFC4" />}
          disabled
        >
          Register For Event
        </ZuButton>
        <Typography textAlign="center" variant="caption">
          OR
        </Typography>*/}
        <ZuButton
          onClick={() => {
            setSponsor(false);
            setWhitelist(true);
            onToggle('right', true);
          }}
          sx={{
            width: '100%',
          }}
        >
          Whitelisted Users
        </ZuButton>
        {/*<ZuButton
          sx={{
            width: '100%',
          }}
          onClick={() => handleStep(1)}
        >
          Register as Sponsor
        </ZuButton>*/}
      </Stack>
    </Stack>
  );
};
