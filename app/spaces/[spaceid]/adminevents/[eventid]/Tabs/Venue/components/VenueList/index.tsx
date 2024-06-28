import * as React from 'react';
import { Stack, Typography, OutlinedInput, InputAdornment, useTheme } from '@mui/material';
import ZuButton from 'components/core/Button';
import { PlusIcon, PlusCircleIcon, InformationIcon, SearchIcon } from 'components/icons';
import { Venue } from '@/types';
import VenueCard from './VenueCard';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface VenueListProps {
  venues?: Venue[];
  onToggle: (anchor: Anchor, open: boolean) => void;
  setSearchValue: React.Dispatch<React.SetStateAction<string>> | any;
}

const VenueList: React.FC<VenueListProps> = ({ venues, onToggle, setSearchValue }) => {
  const theme = useTheme();

  return (
    <Stack direction="column" spacing="20px">
      <Stack spacing="10px">
        <Stack direction="row" justifyContent="space-between">
          <Stack spacing="10px" direction="row" alignItems="center">
            <Typography variant="subtitleMB">Spaces</Typography>
            <InformationIcon size={5} />
          </Stack>
          <ZuButton
            startIcon={<PlusIcon />}
            onClick={() => onToggle('right', true)}
          >
            Add a Space
          </ZuButton>
        </Stack>
        <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
          These are bookable areas at or near a venue for sessions
        </Typography>
      </Stack>
      {venues?.length === 0 && (
        <Stack
          direction="column"
          alignItems="center"
          bgcolor="#2d2d2d"
          padding="20px 10px"
          borderRadius={2}
          onClick={() => onToggle('right', true)}
          sx={{ cursor: "pointer" }}
        >
          <PlusCircleIcon color="#6c6c6c" size={15} />
          <Typography variant="subtitle2">No Spaces</Typography>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>Add a Space</Typography>
        </Stack>
      )}
      <Stack spacing="20px">
        <Stack
          sx={{
            flexDirection: 'column',
            gap: '10px',
            [theme.breakpoints.down('md')]: {
              display: 'flex',
            },
          }}
        >
          <OutlinedInput
            placeholder="Search Venue Spaces"
            // onKeyDown={(event) => {
            //   if (event.keyCode === 13) {
            //     onSearch();
            //   }
            // }}
            sx={{
              backgroundColor:
                '#313131',
              paddingX: '15px',
              paddingY: '13px',
              borderRadius: '10px',
              height: '35px',
              border:
                '1px solid var(--Hover-White, rgba(255, 255, 255, 0.10))',
              fontFamily: 'Inter',
              opacity: 0.7,
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
            onChange={(e) => setSearchValue(e.target.value)}
            startAdornment={
              <InputAdornment position="start" sx={{ opacity: 0.6 }}>
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Stack>
        {venues?.map((venue, index) => (
          <VenueCard key={`VenueCard-${index}`} venue={venue} />
        ))}
      </Stack>
    </Stack>
  );
};

export default VenueList;
