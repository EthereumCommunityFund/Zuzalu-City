import React, { useState } from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import { ZuButton } from 'components/core';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  RightArrowCircleIcon,
  ScrollIcon,
} from 'components/icons';
import { ChevronUpIcon } from '../icons/ChevronUp';
import BpCheckbox from './Checkbox';
import { Anchor } from '@/types';

interface EventRegisterProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const EventRegister: React.FC<EventRegisterProps> = ({ onToggle }) => {
  const [isOne, setIsOne] = useState<boolean>(false);
  const [isTwo, setIsTwo] = useState<boolean>(false);

  return (
    <Stack
      borderRadius="10px"
      spacing={1}
      border="1px solid #383838"
      bgcolor="#262626"
    >
      <Stack
        padding="10px 14px"
        borderBottom="1px solid #383838"
        bgcolor="#2d2d2d"
        borderRadius="10px 10px 0 0"
      >
        <Typography color="white" variant="subtitleS">
          Event Registration
        </Typography>
      </Stack>
      <Stack spacing="20px" padding="10px 20px">
        <Stack spacing="4px">
          <Typography color="white" variant="bodyMB">
            Get Ticket: (single)
          </Typography>
          <Typography color="#FF9C66" variant="bodyS">
            All tickets require an invite code to mint
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
          >
            {isOne ? (
              <ChevronUpIcon size={12} />
            ) : (
              <ChevronDownIcon size={12} />
            )}
            <Stack spacing="5px">
              <Stack
                alignItems="center"
                justifyContent="space-between"
                direction="row"
              >
                <Typography variant="bodyMB">Pass One</Typography>
                <Stack direction="row" alignItems="end" spacing="5px">
                  <Typography variant="bodyMB">1000</Typography>
                  <Typography variant="caption">USDT</Typography>
                </Stack>
              </Stack>
              <Typography variant="bodyS">
                Get ready to groove at the Summer Music Festival! Join us for a
                day filled with live music, food trucks, and good vibes.
              </Typography>
            </Stack>
          </Stack>
          {isOne && (
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
          >
            {isTwo ? <ChevronUpIcon size={5} /> : <ChevronDownIcon size={5} />}
            <Stack spacing="5px">
              <Stack
                alignItems="center"
                justifyContent="space-between"
                direction="row"
              >
                <Typography variant="bodyMB">Pass Two</Typography>
                <Stack direction="row" alignItems="end" spacing="5px">
                  <Typography variant="bodyMB">1000</Typography>
                  <Typography variant="caption">USDT</Typography>
                </Stack>
              </Stack>
              <Typography variant="bodyS">
                one two three four five six seven eight nine ten elevane
              </Typography>
            </Stack>
          </Stack>
          {isTwo && (
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
        </Stack>
        <Stack spacing="10px">
          <ZuButton
            onClick={() => onToggle('right', true)}
            sx={{
              backgroundColor: '#373b36',
              color: '#D7FFC4',
              width: '100%',
            }}
            startIcon={<RightArrowCircleIcon color="#D7FFC4" />}
          >
            Register For Event
          </ZuButton>
          <Typography textAlign="center" variant="caption">
            OR
          </Typography>
          <ZuButton
            sx={{
              width: '100%',
            }}
          >
            Register as Sponsor
          </ZuButton>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing="10px"
          >
            <Typography variant="caption">TICKETING PROTOCOL BY:</Typography>
            <ScrollIcon />
          </Stack>
        </Stack>
        {/* <Stack direction="row" spacing={1} alignItems="center">
          <Stack direction="row" spacing={-1} alignItems="center">
            <Box
              component="img"
              src="/16.jpg"
              width={25}
              height={25}
              borderRadius={20}
            />
            <Box
              component="img"
              src="/17.jpg"
              width={25}
              height={25}
              borderRadius={20}
            />
            <Box
              component="img"
              src="/18.jpg"
              width={25}
              height={25}
              borderRadius={20}
            />
            <Box
              component="img"
              src="/19.jpg"
              width={25}
              height={25}
              borderRadius={20}
            />
          </Stack>
          <Typography color="white">+28 Applied</Typography>
        </Stack> */}
      </Stack>
      {/* <Stack padding="14px" borderTop="1px solid #383838" spacing="5px">
        <Typography color="white" variant="bodyBB">
          Gated For:
        </Typography>
        <Typography color="white" variant="bodyS">
          Need to have as least one of the below credentials
        </Typography>
        <ZuButton
          sx={{ backgroundColor: '#495145', color: '#D7FFC4' }}
          endIcon={<CheckCircleIcon color="#D7FFC4" />}
        >
          Zuzalu Resident
        </ZuButton>
        <ZuButton sx={{ backgroundColor: '#313131' }}>
          ZuConnect Resident
        </ZuButton>
        <ZuButton sx={{ backgroundColor: '#313131' }}>
          DevConnect Attendee
        </ZuButton>
      </Stack> */}
    </Stack>
  );
};

export default EventRegister;
