import * as React from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import { ZuButton } from 'components/core';
import { ArrowDownIcon, CheckCircleIcon, ChevronDownIcon, RightArrowCircleIcon } from 'components/icons';
import Ticket from './Ticket';
import BpCheckbox from './Checkbox';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface EventRegisterProps {
  onToggle: (anchor: Anchor, open: boolean) => void;
}

const EventRegister: React.FC<EventRegisterProps> = ({ onToggle }) => {
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
            Purchase Ticket: (single)
          </Typography>
          <Typography color="#FF9C66" variant="bodyS">
            All tickets require an invite code to mint
          </Typography>
        </Stack>
        <Stack spacing="10px">
          <Stack padding="10px" direction="row" spacing="10px">
            <Stack>
              <ChevronDownIcon size={5} />
            </Stack>
            <Stack spacing="5px">
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="bodyMB">
                  Pass One
                </Typography>
                <Stack spacing="5px" direction="row" alignItems="end">
                  <Typography variant="bodyMB">
                    1000
                  </Typography>
                  <Typography variant="caption">
                    USDT
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="bodyS">
                Get ready to groove at the Summer Music Festival! Join us for a day filled with live music,
                food trucks, and good vibes.
              </Typography>
            </Stack>
          </Stack>
          <Stack padding="10px" direction="row" spacing="10px">
            <Stack>
              <ChevronDownIcon size={5} />
            </Stack>
            <Stack spacing="5px">
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="bodyMB">
                  Pass Two
                </Typography>
                <Stack spacing="5px" direction="row" alignItems="end">
                  <Typography variant="bodyMB">
                    1000
                  </Typography>
                  <Typography variant="caption">
                    USDT
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="bodyS">
                Get ready to groove at the Summer Music Festival! Join us for a day filled with live music,
                food trucks, and good vibes.
              </Typography>
            </Stack>
          </Stack>
          <Stack divider={<Divider sx={{ borderColor: '#383838' }} />}>
            <Stack direction="row" spacing="10px" padding="10px">
              <BpCheckbox />
              <Stack spacing="5px">
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="bodyMB">
                    Upsale One
                  </Typography>
                  <Stack spacing="5px" direction="row" alignItems="end">
                    <Typography variant="bodyMB">
                      +100
                    </Typography>
                    <Typography variant="caption">
                      USDT
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="bodyS">
                  Get ready to groove at the Summer Music Festival! Join us for a day filled with live music,
                  food trucks, and good vibes.
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing="10px" padding="10px">
              <BpCheckbox />
              <Stack spacing="5px">
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="bodyMB">
                    Upsale One
                  </Typography>
                  <Stack spacing="5px" direction="row" alignItems="end">
                    <Typography variant="bodyMB">
                      +100
                    </Typography>
                    <Typography variant="caption">
                      USDT
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="bodyS">
                  Get ready to groove at the Summer Music Festival! Join us for a day filled with live music,
                  food trucks, and good vibes.
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing="10px" padding="10px">
              <BpCheckbox />
              <Stack spacing="5px">
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="bodyMB">
                    Upsale One
                  </Typography>
                  <Stack spacing="5px" direction="row" alignItems="end">
                    <Typography variant="bodyMB">
                      +100
                    </Typography>
                    <Typography variant="caption">
                      USDT
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="bodyS">
                  Get ready to groove at the Summer Music Festival! Join us for a day filled with live music,
                  food trucks, and good vibes.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {/* <Stack spacing="10px">
          <Ticket />
          <Ticket />
          <Ticket />
        </Stack> */}
        <ZuButton
          sx={{
            backgroundColor: '#373b36',
            color: '#D7FFC4',
            width: '100%',
          }}
          startIcon={<RightArrowCircleIcon color="#D7FFC4" />}
          onClick={() => onToggle('right', true)}
        >
          Register For Event
        </ZuButton>
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
