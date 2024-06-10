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
  console.log("desc", description)
  return (
    <Stack direction="column" spacing={1}>
      <Stack bgcolor="#292929" padding="10px" spacing={1} borderRadius="10px">
        <Typography color="white" variant="subtitleSB">
          ABOUT THIS EVENT
        </Typography>
        <Typography color="white" variant="subtitleMB">
          {tagline}
        </Typography>
        <Typography color="white" variant="bodyB">
          {
            description ? isValidJSON(description.replaceAll('\\"', '"'))
              ? JSON.parse(description.replaceAll('\\"', '"'))
                .blocks[0].data.text
              : description : ""
          }

        </Typography>
        <ZuButton
          startIcon={<ChevronDownIcon />}
          sx={{ backgroundColor: '#313131', width: '100%' }}
        >
          Show More
        </ZuButton>
      </Stack>
      {/*<Stack
        bgcolor="#292929"
        padding="10px"
        spacing={1}
        borderRadius="10px"
        height="300px"
      >
        <Typography color="white" variant="subtitleSB">
          ORGANIZER UPDATES
        </Typography>
  </Stack>*/}
    </Stack>
  );
};

export default EventAbout;
