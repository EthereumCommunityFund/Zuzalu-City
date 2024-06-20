import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { ChevronDownIcon } from 'components/icons';

interface EventAboutTypes {
  tagline?: string;
  description: string;
}

const EventAbout = ({ tagline, description }: EventAboutTypes) => {
  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  return (
    <Stack bgcolor="#292929" padding="10px" borderRadius="10px">
      <Stack padding="10px" spacing="20px">
        <Typography color="white" variant="subtitleSB">
          ABOUT THIS EVENT
        </Typography>
        <Stack>
          <Typography color="white" variant="subtitleMB">
            {tagline}
          </Typography>
          <Typography color="white" variant="bodyB">
            {description === null && 'NULL'}
            {description !== null &&
              !isValidJSON(description.replaceAll('\\"', '"')) &&
              description}
            {description === null ||
            !isValidJSON(description.replaceAll('\\"', '"')) ||
            JSON.parse(description.replaceAll('\\"', '"')).blocks[0] ===
              undefined
              ? 'JSON ERROR'
              : JSON.parse(description.replaceAll('\\"', '"')).blocks[0].data
                  .text}
          </Typography>
        </Stack>
      </Stack>
      <ZuButton
        startIcon={<ChevronDownIcon />}
        sx={{ backgroundColor: '#313131', width: '100%' }}
      >
        Show More
      </ZuButton>
    </Stack>
  );
};

export default EventAbout;
