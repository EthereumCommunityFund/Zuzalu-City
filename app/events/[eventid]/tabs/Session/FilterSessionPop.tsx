import { ZuButton, ZuSwitch } from '@/components/core';
import { EditIcon, MapIcon, TicketIcon } from '@/components/icons';
import { FilterSessionsPopComponentProps } from '@/types';
import {
  MenuItem,
  Popover,
  Stack,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import { ArrowLeftIcon } from '@mui/x-date-pickers';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useState } from 'react';

export function FilterSessionPop({
  isRSVPFiltered,
  handleRSVPSwitchChange,
  isManagedFiltered,
  handleManagedSwitchChange,
  location,
  track,
  handleClear,
  selectedLocations,
  setSelectedLocations,
  selectedTracks,
  setSelectedTracks,
  ...props
}: FilterSessionsPopComponentProps) {
  const [trackAnchor, setTrackAnchor] = useState<HTMLDivElement | null>(null);
  const [locationAnchor, setLocationAnchor] = useState<HTMLDivElement | null>(
    null,
  );

  const trackAnchorOpen = Boolean(trackAnchor);
  const locationAnchorOpen = Boolean(locationAnchor);
  const trackAnchorId = trackAnchorOpen ? 'track-filter-popup' : undefined;
  const locationAnchorId = locationAnchorOpen
    ? 'location-filter-popup'
    : undefined;

  const handleTrackFilterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setTrackAnchor(event.currentTarget);
  };

  const handleTrackFilterClose = () => {
    setTrackAnchor(null);
  };

  const handleLocationFilterClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    setLocationAnchor(event.currentTarget);
  };

  const handleLocationFilterClose = () => {
    setLocationAnchor(null);
  };

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
              onClick={props.onClose}
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
              aria-describedby={trackAnchorId}
              onClick={handleTrackFilterClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
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
            <Popover
              id={trackAnchorId}
              open={trackAnchorOpen}
              anchorEl={trackAnchor}
              onClose={handleTrackFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              slotProps={{
                paper: {
                  sx: {
                    maxHeight: '200px',
                    backgroundColor: 'rgba(34, 34, 34, 0.8)',
                    backdropFilter: 'blur(20px)',
                    width: '344px',
                  },
                },
              }}
            >
              {track &&
                [...new Set(track.split(','))].map((item: string, index) => {
                  return (
                    <MenuItem
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onClick={() => {
                        if (selectedTracks.includes(item)) {
                          const temp = selectedTracks.filter(
                            (track) => track !== item,
                          );
                          setSelectedTracks(temp);
                        } else {
                          const temp = [...selectedTracks, item];
                          const uniqueArray = [...new Set(temp)];
                          setSelectedTracks(uniqueArray);
                        }
                      }}
                    >
                      {item}
                      {selectedTracks.includes(item) && <HighlightOffIcon />}
                    </MenuItem>
                  );
                })}
            </Popover>

            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
              padding={'10px'}
              borderRadius={'10px'}
              border={'solid 1px rgba(255, 255, 255, 0.10)'}
              aria-describedby={locationAnchorId}
              onClick={handleLocationFilterClick}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
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
                  {location
                    ? location.length > 10
                      ? location.substring(0, 10) + '...'
                      : location
                    : ''}
                </Typography>
                <ChevronRightIcon />
              </Stack>
            </Stack>
            <Popover
              id={locationAnchorId}
              open={locationAnchorOpen}
              anchorEl={locationAnchor}
              onClose={handleLocationFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              slotProps={{
                paper: {
                  sx: {
                    maxHeight: '200px',
                    backgroundColor: 'rgba(34, 34, 34, 0.8)',
                    backdropFilter: 'blur(20px)',
                    width: '344px',
                  },
                },
              }}
            >
              {location &&
                [...new Set(location.split(','))].map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onClick={() => {
                        if (selectedLocations.includes(item)) {
                          const temp = selectedLocations.filter(
                            (location) => location !== item,
                          );
                          setSelectedLocations(temp);
                        } else {
                          const temp = [...selectedLocations, item];
                          const uniqueArray = [...new Set(temp)];
                          setSelectedLocations(uniqueArray);
                        }
                      }}
                    >
                      {item}
                      {selectedLocations.includes(item) && <HighlightOffIcon />}
                    </MenuItem>
                  );
                })}
            </Popover>
          </Stack>
        </Stack>

        <Stack direction={'row'} width={'100%'} gap={'20px'}>
          <ZuButton
            sx={{
              flex: '1',
            }}
            onClick={handleClear}
          >
            Clear
          </ZuButton>
          <ZuButton
            startIcon={<FilterAltIcon />}
            sx={{
              flex: '1',
            }}
            onClick={props.onClose}
          >
            Apply
          </ZuButton>
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
