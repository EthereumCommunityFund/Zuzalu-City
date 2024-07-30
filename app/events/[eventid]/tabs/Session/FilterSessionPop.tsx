import { ZuButton, ZuSwitch } from '@/components/core';
import { EditIcon, MapIcon, TicketIcon } from '@/components/icons';
import { FilterSessionsPopComponentProps } from '@/types';
import { Stack, SwipeableDrawer, Typography } from '@mui/material';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export function FilterSessionPop({
  isRSVPFiltered,
  handleRSVPSwitchChange,
  isManagedFiltered,
  handleManagedSwitchChange,
  location,
  track,
  ...props
}: FilterSessionsPopComponentProps) {
  return (
    <SwipeableDrawer {...props}>
      <Stack
        sx={{
          padding: '20px 20px 30px 20px',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stack width={'100%'} gap={'30px'}>
          <Stack direction={'row'} gap={'20px'} alignItems={'center'}>
            <ZuButton
              sx={{
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <ArrowLeftIcon />
            </ZuButton>
            <Typography
              fontSize={'18px'}
              fontWeight={700}
              lineHeight={'120%'}
              color={'white'}
            >
              Filter Sessions
            </Typography>
          </Stack>
          <Stack gap="10px" width={'100%'}>
            <Stack gap={'5px'} width={'100%'}>
              <Stack
                padding="10px"
                direction="row"
                alignItems="center"
                spacing="10px"
              >
                <TicketIcon />
                <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                  My RSVPs
                </Typography>
                <Stack flex={1} direction="row" justifyContent="end">
                  <ZuSwitch
                    checked={isRSVPFiltered}
                    onChange={handleRSVPSwitchChange}
                  />
                </Stack>
              </Stack>
              <Stack
                padding="10px"
                direction="row"
                alignItems="center"
                spacing="10px"
              >
                <EditIcon />
                <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
                  Managed by me
                </Typography>
                <Stack flex={1} direction="row" justifyContent="end">
                  <ZuSwitch
                    checked={isManagedFiltered}
                    onChange={handleManagedSwitchChange}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack gap={'15px'} width={'100%'}>
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              padding={'10px'}
              borderRadius={'10px'}
              border={'solid 1px rgba(255, 255, 255, 0.10)'}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                <MapOutlinedIcon />
                <Typography
                  fontSize={'14px'}
                  lineHeight={'160%'}
                  sx={{
                    opacity: '0.6',
                  }}
                >
                  Track
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems={'center'}>
                <Typography
                  fontSize={'14px'}
                  fontWeight={'600'}
                  lineHeight={'160%'}
                  sx={{
                    opacity: '0.6',
                  }}
                >
                  {track
                    ? track.length > 10
                      ? track.substring(0, 10) + '...'
                      : track
                    : ''}
                </Typography>
                <ChevronRightIcon />
              </Stack>
            </Stack>

            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              padding={'10px'}
              borderRadius={'10px'}
              border={'solid 1px rgba(255, 255, 255, 0.10)'}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <Stack direction={'row'} alignItems={'center'} gap={'10px'}>
                <MapIcon />
                <Typography
                  fontSize={'14px'}
                  lineHeight={'160%'}
                  sx={{
                    opacity: '0.6',
                  }}
                >
                  Location
                </Typography>
              </Stack>
              <Stack direction={'row'} alignItems={'center'}>
                <Typography
                  fontSize={'14px'}
                  fontWeight={'600'}
                  lineHeight={'160%'}
                  sx={{
                    opacity: '0.6',
                  }}
                >
                  {location}
                </Typography>
                <ChevronRightIcon />
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction={'row'} width={'100%'} gap={'20px'}>
          <ZuButton
            sx={{
              flex: '1',
            }}
          >
            Clear
          </ZuButton>
          <ZuButton
            startIcon={<FilterAltIcon />}
            sx={{
              flex: '1',
            }}
          >
            Apply
          </ZuButton>
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
