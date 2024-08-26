import React, { useState, useEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import { ZuButton } from 'components/core';
import { ChevronDownIcon, ChevronUpIcon } from 'components/icons';
import EditorPreview from '@/components/editor/EditorPreview';

interface EventAboutTypes {
  description: string;
}

const EventAbout = ({ description }: EventAboutTypes) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);

  return (
    <Stack bgcolor="#292929" padding="10px" borderRadius="10px">
      <Stack padding="10px" spacing="20px">
        <Typography
          color="white"
          variant="subtitleSB"
          sx={{
            opacity: '0.6',
            textShadow: '0px 5px 10px rgba(0, 0, 0, 0.15)',
          }}
          fontSize={'18px'}
          fontWeight={700}
        >
          ABOUT THIS EVENT
        </Typography>
        <Stack sx={{ opacity: '0.8' }}>
          <EditorPreview
            value={description}
            collapsed={isCollapsed}
            onCollapse={(collapsed) => {
              setIsCanCollapse((v) => {
                return v || collapsed;
              });
              setIsCollapsed(collapsed);
            }}
          />
        </Stack>
      </Stack>
      {isCanCollapse && (
        <ZuButton
          startIcon={
            isCollapsed ? (
              <ChevronDownIcon size={4} />
            ) : (
              <ChevronUpIcon size={4} />
            )
          }
          sx={{ backgroundColor: '#313131', width: '100%' }}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? 'Show More' : 'Show Less'}
        </ZuButton>
      )}
    </Stack>
  );
};

export default EventAbout;
