import React from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { Stack, Typography, Box, FormLabel } from '@mui/material';
import { ArrowDownIcon, PlusIcon, MinusIcon } from '@/components/icons';
import { ZuInput, ZuButton } from '@/components/core';
import { Venue } from '@/types';

interface LocationDisplayProps {
  room: Venue;
}

const LocationDisplay: React.FC<LocationDisplayProps> = React.memo(
  ({ room }) => (
    <Stack
      borderRadius="10px"
      padding="10px"
      bgcolor="#313131"
      direction="row"
      spacing="10px"
    >
      <Box
        component="img"
        width="60px"
        height="60px"
        borderRadius="8px"
        src={room.avatar}
      />
      <Stack spacing="4px">
        <Typography variant="bodyBB">{room.name}</Typography>
        <Typography variant="caption">Capacity: {room.capacity}</Typography>
      </Stack>
    </Stack>
  ),
);

interface CustomLocationInputProps {
  control: Control<BookingFormData>;
}

const CustomLocationInput: React.FC<CustomLocationInputProps> = ({
  control,
}) => {
  const isDirections = useWatch({
    control,
    name: 'isDirections',
    defaultValue: false,
  });

  return (
    <Stack spacing="10px">
      <FormLabel>Custom Location</FormLabel>
      <Typography variant="caption">Write name of the location</Typography>
      <Controller
        name="customLocation"
        control={control}
        rules={{ required: 'Custom location is required' }}
        render={({ field, fieldState: { error } }) => (
          <ZuInput
            {...field}
            placeholder="Type location name"
            error={!!error}
          />
        )}
      />
      <Controller
        name="isDirections"
        control={control}
        render={({ field }) => (
          <ZuButton
            endIcon={
              !field.value ? <PlusIcon size={4} /> : <MinusIcon size={4} />
            }
            onClick={() => field.onChange(!field.value)}
          >
            {!field.value ? 'Add Directions' : 'Remove Directions'}
          </ZuButton>
        )}
      />
      {isDirections && (
        <Controller
          name="directions"
          control={control}
          render={({ field }) => (
            <ZuInput {...field} placeholder="Directions description" />
          )}
        />
      )}
    </Stack>
  );
};

interface CustomLocationDisplayProps {
  location: string;
  directions: string;
}

const CustomLocationDisplay: React.FC<CustomLocationDisplayProps> = React.memo(
  ({ location, directions }) => (
    <Stack
      borderRadius="10px"
      border="1px solid #383838"
      padding="10px"
      spacing="10px"
    >
      <Typography variant="caption">CUSTOM LOCATIONS:</Typography>
      <Stack borderRadius="10px" bgcolor="#373737" padding="10px">
        <Typography variant="bodyBB">{location}</Typography>
        <Typography variant="bodyS">{directions}</Typography>
      </Stack>
    </Stack>
  ),
);

interface BookingFormData {
  sessionLocation: string;
  customLocation: string;
  directions: string;
  isDirections: boolean;
}

interface BookingLocationProps {
  control: Control<any>;
  selectedRoom: Venue;
}

const SessionLocationDisplay: React.FC<BookingLocationProps> = ({
  control,
  selectedRoom,
}) => {
  const sessionLocation = useWatch({
    control,
    name: 'location',
  });

  const customLocation = useWatch({
    control,
    name: 'customLocation',
  });

  const directions = useWatch({
    control,
    name: 'directions',
  });

  if (!sessionLocation) return null;

  return (
    <Stack spacing="10px">
      <Stack alignItems="center">
        <ArrowDownIcon />
      </Stack>
      {sessionLocation !== 'Custom' ? (
        <Stack
          borderRadius="10px"
          border="1px solid rgba(255, 255, 255, 0.10)"
          spacing="10px"
          padding="10px"
        >
          <Typography variant="caption">You are booking at:</Typography>
          <LocationDisplay room={{ ...selectedRoom, name: sessionLocation }} />
        </Stack>
      ) : (
        <>
          <CustomLocationInput control={control} />
          {customLocation && (
            <CustomLocationDisplay
              location={customLocation}
              directions={directions || ''}
            />
          )}
        </>
      )}
    </Stack>
  );
};

export default React.memo(SessionLocationDisplay);
