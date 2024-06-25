import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { ChevronDownIcon, ChevronUpIcon } from 'components/icons';
import TextEditor from '../editor/editor';

interface EventAboutTypes {
  description: string;
}

const EventAbout = ({ description }: EventAboutTypes) => {
  const [showMore, setShowMore] = useState(false);
  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  console.log("showmore", showMore)
  return (
    <Stack bgcolor="#292929" padding="10px" borderRadius="10px">
      <Stack padding="10px" spacing="20px">
        <Typography color="white" variant="subtitleSB" sx={{ opacity: 0.6 }}>
          ABOUT THIS EVENT
        </Typography>
        <Stack>
          <TextEditor
            holder='event-description'
            value={JSON.parse(description.replaceAll('\\"', '"'))}
            showMore={showMore}
          />
        </Stack>
      </Stack>
      <ZuButton
        startIcon={!showMore ? <ChevronDownIcon size={4} /> : <ChevronUpIcon size={4} />}
        sx={{ backgroundColor: '#313131', width: '100%' }}
        onClick={() => setShowMore(prev => !prev)}
      >
        {!showMore ? "Show More" : "Show Less"}
      </ZuButton>
    </Stack>
  );
};

export default EventAbout;
