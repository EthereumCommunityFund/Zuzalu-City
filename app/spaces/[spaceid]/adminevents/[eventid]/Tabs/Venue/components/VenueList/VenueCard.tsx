import React, { useCallback } from 'react';
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { ThreeVerticalIcon } from '@/components/icons';
import { Venue } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';

type VenueCardProps = {
  venue: Venue;
  refetch: () => void;
};

const options = ['Edit', 'Delete'];

const VenueCard: React.FC<VenueCardProps> = ({ venue, refetch }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: sessions } = useQuery({
    queryKey: ['getSession', venue.name],
    queryFn: async () => {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('location', venue.name);
      return data;
    },
  });

  const deleteVenue = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venue.id);
      return error;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleMenuItemClick = useCallback(
    (type: string) => {
      if (type === 'Edit') {
        console.log('Edit');
      } else if (type === 'Delete') {
        deleteVenue.mutate();
      }
    },
    [deleteVenue],
  );

  return (
    <Stack
      direction="row"
      spacing="14px"
      padding="10px"
      borderRadius={'10px'}
      border="1px solid rgba(255, 255, 255, 0.06)"
      bgcolor="#2d2d2d"
      sx={{
        ':hover': {
          backgroundColor: '#383838',
        },
      }}
    >
      <Box
        component="img"
        width="40px"
        height="40px"
        borderRadius="6px"
        src={venue.avatar || '/7.jpg'}
      />
      <Stack spacing="10px" flex="1">
        <Typography variant="bodyBB">{venue.name}</Typography>
        <Stack direction="row" spacing="10px">
          {venue.tags.split(',').map((item, i) => (
            <Stack
              bgcolor="#424242"
              padding="3px 8px"
              borderRadius="4px"
              key={`Venue_Label${i}`}
            >
              <Typography variant="caption">{item}</Typography>
            </Stack>
          ))}
        </Stack>
        <Typography variant="bodyS">
          Sessions Booked: {sessions?.length} Capacity: {venue.capacity}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        padding="10px"
        alignItems="center"
        bgcolor="#383838"
        borderRadius="6px"
        height="fit-content"
        sx={{ cursor: 'pointer' }}
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        aria-label="more"
        id="long-button"
        onClick={handleClick}
      >
        <ThreeVerticalIcon size={5} />
      </Stack>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuItemClick(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default VenueCard;
