import React, { useCallback, useState } from 'react';
import { Box, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { ThreeVerticalIcon } from '@/components/icons';
import { Venue, Event } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import VenueForm from '@/components/form/VenueForm';
import Drawer from '@/components/drawer';

type VenueCardProps = {
  venue: Venue;
  event?: Event;
  refetch: () => void;
};

const options = ['Edit', 'Delete'];

const VenueCard: React.FC<VenueCardProps> = ({ venue, event, refetch }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);
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
        setDrawOpen(true);
      } else if (type === 'Delete') {
        setOpenDialog(true);
      }
      handleClose();
    },
    [handleClose],
  );

  const handleDialogClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteVenue.mutate();
    setOpenDialog(false);
  }, [deleteVenue]);

  const toggleDrawer = useCallback(() => {
    setDrawOpen((v) => !v);
  }, []);

  return (
    <>
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
        <Drawer open={drawOpen} onClose={toggleDrawer} onOpen={toggleDrawer}>
          {drawOpen ? (
            <VenueForm
              event={event}
              venue={venue}
              handleClose={toggleDrawer}
              refetch={refetch}
            />
          ) : null}
        </Drawer>
        <Dialog
          showModal={openDialog}
          title="Deleting Venue"
          message="Are you sure you want to delete this venue?"
          confirmText="Delete"
          onClose={handleDialogClose}
          onConfirm={handleDeleteConfirm}
        />
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
    </>
  );
};

export default VenueCard;
