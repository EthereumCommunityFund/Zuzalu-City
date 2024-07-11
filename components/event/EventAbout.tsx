import React, { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { ChevronDownIcon, ChevronUpIcon } from 'components/icons';
import TextEditor from '../editor/editor';

interface EventAboutTypes {
  description: string;
}

const EventAbout = ({ description }: EventAboutTypes) => {
  const [showMore, setShowMore] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [isContentLarge, setIsContentLarge] = useState(false);

  useEffect(() => {
    const editorContent = document.querySelector(
      '.codex-editor__redactor',
    ) as HTMLElement;
    if (editorContent) {
      setContentHeight(editorContent.scrollHeight);
      setIsContentLarge(editorContent.scrollHeight > 300);
    }
  }, [description]);

  return (
    <Stack bgcolor="#292929" padding="10px" borderRadius="10px">
      <Stack padding="10px" spacing="20px">
        <Typography color="white" variant="subtitleSB" sx={{opacity: '0.6', textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)'}} fontSize={'18px'} fontWeight={700}>
          ABOUT THIS EVENT
        </Typography>
        <Stack sx={{opacity: '0.8'}}>
          <TextEditor
            holder="event-description"
            value={JSON.parse(description.replaceAll('\\"', '"'))}
            showMore={showMore}
          />
        </Stack>
      </Stack>
      {isContentLarge && (
        <ZuButton
          startIcon={
            !showMore ? (
              <ChevronDownIcon size={4} />
            ) : (
              <ChevronUpIcon size={4} />
            )
          }
          sx={{ backgroundColor: '#313131', width: '100%' }}
          onClick={() => setShowMore((prev) => !prev)}
        >
          {!showMore ? 'Show More' : 'Show Less'}
        </ZuButton>
      )}
    </Stack>
  );
};

export default EventAbout;
