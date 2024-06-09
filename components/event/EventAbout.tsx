import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { ChevronDownIcon } from 'components/icons';

interface EventAboutTypes {
  tagline?: string;
  description?: string;
}

const EventAbout = ({ tagline, description }: EventAboutTypes) => {
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
          {/*Embark on a transformative journey at ZuConnect— a two-week popup
          village in Istanbul where the luminaries of crypto, AI, governance,
          decentralized science, and culture coalesce. Here, the brightest minds
          convene to co-work, foster collaborations, and have a joyous time.
          ZuConnect is an experience crafted with love by Zuzalu, whose mission
          is to foster a global network of communities to advance humanity by
          creating playgrounds at the intersection of free and open technology,
          science, health, and social innovation.*/}
          {description}
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
