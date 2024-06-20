'use client';
import React, { useState } from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import {
  ScrollIcon,
  RightArrowIcon,
  LeftArrowIcon,
  ChevronDownIcon,
  ArrowUpLeftIcon,
  RefreshIcon,
  ChevronUpIcon,
  Square2StackIcon,
  ArrowTopRightSquareIcon,
} from '@/components/icons';
import { ZuButton, ZuInput } from '@/components/core';
import { Agree, Email, Code, Mint, Completion } from './Register';

const Home = () => {
  const [complete, setComplete] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);

  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isCode, setIsCode] = useState<boolean>(false);
  const [isMint, setIsMint] = useState<boolean>(false);
  const [isCompletion, setIsCompletion] = useState<boolean>(false);

  return (
    <Stack alignItems="center">
      <Stack pt="40px" spacing="33px" color="white" width="600px">
        <Stack direction="row" spacing="10px">
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Stack>
        <Stack spacing="20px">
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px" alignItems="center">
              <Box
                component="img"
                height="30px"
                width="30px"
                borderRadius="2px"
                src="/24.webp"
              />
              <Typography variant="subtitleLB">EventName</Typography>
            </Stack>
            <Typography variant="h1">Your Ticket</Typography>
          </Stack>
          <Typography variant="bodyBB">
            {complete
              ? 'Registration complete!'
              : 'Complete your registration below to purchase your ticket'}
          </Typography>
        </Stack>
        {!isAgree && !isEmail && !isCode && !isMint && !isCompletion && (
          <Agree setIsAgree={setIsAgree} view={view} setView={setView} />
        )}
        {isAgree && !isEmail && !isCode && !isMint && !isCompletion && (
          <Email
            setIsAgree={setIsAgree}
            setIsEmail={setIsEmail}
            view={view}
            setView={setView}
          />
        )}
        {!isAgree && isEmail && !isCode && !isMint && !isCompletion && (
          <Code
            setIsEmail={setIsEmail}
            setIsCode={setIsCode}
            view={view}
            setView={setView}
          />
        )}
        {!isAgree && !isEmail && isCode && !isMint && !isCompletion && (
          <Mint
            setIsCode={setIsCode}
            setIsMint={setIsMint}
            view={view}
            setView={setView}
          />
        )}
        {!isAgree && !isEmail && !isCode && isMint && !isCompletion && (
          <Completion
            setIsMint={setIsMint}
            setIsCompletion={setIsCompletion}
            view={view}
            setView={setView}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default Home;
