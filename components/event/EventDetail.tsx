import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stack, Typography, Box, useTheme } from '@mui/material';
import { RightArrowIcon } from 'components/icons';
import { SOCIAL_TYPES } from '@/constant';
import { TileLayer, MapContainer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngLiteral } from 'leaflet';
import LocationFinder from '../map';

type UserLink = {
  title: string;
  links: string;
};
interface IEventDetail {
  status?: string;
  links?: [UserLink];
  location?: LatLngLiteral | undefined;
  address: string;
}

const EventDetail: React.FC<IEventDetail> = ({
  status = 'In-Person',
  links = [],
  location,
  address,
}) => {
  const { breakpoints } = useTheme();

  return (
    <Stack
      spacing="20px"
      sx={{
        padding: '0px',
        [breakpoints.down('md')]: {
          padding: '0px 10px 20px 10px',
        },
      }}
    >
      <Typography
        color="white"
        variant="subtitleMB"
        borderBottom="1px solid #383838"
        paddingY="14px"
      >
        Event Details
      </Typography>
      <Typography color="white" variant="bodyB">
        Format: {status}
      </Typography>
      <Stack
        spacing="10px"
        paddingBottom={'20px'}
        borderBottom={'1px solid rgba(255, 255, 255, 0.10)'}
      >
        <Typography color="white" variant="bodyBB" paddingBottom="20px">
          Links
        </Typography>
        {links?.length !== 0 && (
          <>
            {links?.map((link, index) => (
              <Link
                href={link.links}
                target="_blank"
                key={`UserLink-${index}`}
                style={{ textDecoration: 'none' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  bgcolor="#2a2a2a"
                  padding="10px 14px"
                  borderRadius="10px"
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography color="white" variant="bodyB">
                    {
                      SOCIAL_TYPES.filter((item) => item.key === link.title)[0]
                        .value
                    }
                  </Typography>
                  <RightArrowIcon />
                </Stack>
              </Link>
            ))}
          </>
        )}
      </Stack>
      <Stack spacing="5px">
        <Typography color="white" variant="bodyBB" paddingBottom="20px">
          Location
        </Typography>
        <Typography color="white" variant="bodyMB">
          City, Country
        </Typography>
        <Typography color="white" variant="bodyS">
          Apply to see address
        </Typography>
        <Box>
          {location !== undefined && (
            <MapContainer
              center={location}
              zoom={7}
              scrollWheelZoom={false}
              style={{ width: '100%', height: '182px', borderRadius: '10px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          )}
          {/* <LocationFinder address={address} /> */}
        </Box>
      </Stack>
    </Stack>
  );
};

export default EventDetail;
