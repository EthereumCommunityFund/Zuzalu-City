import React, { useState } from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import { ZuButton, ZuInput } from '@/components/core';
import {
  ArrowDownTrayIcon,
  ArrowUpRightIcon,
  RightArrowIcon,
  ScrollIcon,
} from '@/components/icons';
import BpCheckbox from '@/components/event/Checkbox';

interface IProps {
  setIsInitial?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsDisclaimer?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsEmail?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsPayment?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsCompletion?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsRush?: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleClose?: () => void;
}

export const Initial: React.FC<IProps> = ({ setIsInitial }) => {
  return (
    <Stack>
      <Stack
        direction="row"
        spacing="10px"
        padding="20px"
        alignItems="center"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
      >
        <Box
          component="img"
          height="30px"
          width="30px"
          borderRadius="2px"
          src="/14.webp"
        />
        <Typography variant="subtitleLB">EventName</Typography>
      </Stack>
      <Stack padding="20px">
        <Stack
          padding="20px"
          border="1px solid #383838"
          bgcolor="#262626"
          spacing="20px"
          borderRadius="10px"
        >
          <Typography variant="subtitleLB">Approval Required</Typography>
          <Typography variant="bodyB">
            Registration for this event requires an application. Once approved,
            a link to complete registration will be sent via email.
          </Typography>
          <ZuButton
            endIcon={<ArrowUpRightIcon size={5} />}
            onClick={() => setIsInitial(true)}
          >
            Apply
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const Disclaimer: React.FC<IProps> = ({
  setIsInitial,
  setIsDisclaimer,
}) => {
  return (
    <Stack>
      <Stack
        padding="20px"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
        spacing="20px"
      >
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
        <Stack direction="row" spacing="14px">
          <Box
            component="img"
            width="140px"
            height="140px"
            borderRadius="8px"
            src="/24.webp"
          />
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px">
              <Typography variant="bodyM">Ticket:</Typography>
              <Typography variant="bodyBB">TicketName</Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">Contributing Amount::</Typography>
              <Typography variant="bodyBB">0000</Typography>
              <Typography variant="caption">TOKEN</Typography>
            </Stack>
            <Typography variant="bodyM">Description:</Typography>
            <Typography variant="bodyS">
              Get ready to groove at the Summer Music Festival! Join us for a
              day filled with live music, food trucks, and good vibes.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding="20px">
        <Stack
          padding="20px"
          border="1px solid #383838"
          bgcolor="#262626"
          spacing="30px"
          borderRadius="10px"
        >
          <Stack spacing="10px">
            <Typography variant="subtitleLB">Backup Method</Typography>
            <Typography variant="bodyBB">
              Select a method for your backup code
            </Typography>
          </Stack>
          <Stack
            spacing="10px"
            divider={<Divider sx={{ border: '1px solid #383838' }} />}
          >
            <Stack padding="10px" spacing="20px">
              <Stack direction="row" spacing="10px">
                <BpCheckbox />
                <Stack spacing="5px">
                  <Typography variant="bodyMB">Via Email</Typography>
                  <Typography variant="bodyS">
                    You will receive an email for a backup code
                  </Typography>
                </Stack>
              </Stack>
              <ZuInput placeholder="Type an address here" />
            </Stack>
            <Stack direction="row" spacing="10px" padding="10px">
              <BpCheckbox />
              <Stack spacing="5px">
                <Typography variant="bodyMB">Via Email</Typography>
                <Typography variant="bodyS">
                  You will receive an email for a backup code
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <ZuButton
            startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: '100%', backgroundColor: '#2c383b', color: '#67DBFF' }}
            onClick={() => {
              setIsInitial(false);
              setIsDisclaimer(true);
            }}
          >
            Payment
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export const Email: React.FC<IProps> = ({ setIsDisclaimer, setIsEmail }) => {
  const [awaiting, setAwaiting] = useState<boolean>(false);

  return (
    <Stack>
      <Stack
        padding="20px"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
        spacing="20px"
      >
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
        <Stack direction="row" spacing="14px">
          <Box
            component="img"
            width="140px"
            height="140px"
            borderRadius="8px"
            src="/24.webp"
          />
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px">
              <Typography variant="bodyM">Ticket:</Typography>
              <Typography variant="bodyBB">TicketName</Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">Contributing Amount::</Typography>
              <Typography variant="bodyBB">0000</Typography>
              <Typography variant="caption">TOKEN</Typography>
            </Stack>
            <Typography variant="bodyM">Description:</Typography>
            <Typography variant="bodyS">
              Get ready to groove at the Summer Music Festival! Join us for a
              day filled with live music, food trucks, and good vibes.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding="20px" spacing="20px">
        <Stack
          padding="20px"
          border="1px solid #383838"
          bgcolor="#262626"
          spacing="30px"
          borderRadius="10px"
        >
          <Typography variant="subtitleLB" textAlign="center">
            Sign in Wallet
          </Typography>
          <Stack paddingY="20px" bgcolor="#323232" borderRadius="10px">
            {awaiting && (
              <Typography
                variant="subtitleS"
                fontWeight={400}
                textAlign="center"
                sx={{ opacity: 0.7 }}
              >
                Awaiting transaction...
              </Typography>
            )}
            <Typography
              variant="subtitleS"
              fontWeight={400}
              textAlign="center"
              sx={{ opacity: 0.7 }}
            >
              Confirming transaction...
            </Typography>
          </Stack>
          <Stack direction="row" spacing="10px" justifyContent="center">
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              POWERED BY:
            </Typography>
            <ScrollIcon />
          </Stack>
        </Stack>
        <ZuButton
          startIcon={<RightArrowIcon color="#67DBFF" />}
          sx={{ width: '100%', backgroundColor: '#2c383b', color: '#67DBFF' }}
          onClick={() => {
            setIsDisclaimer(false);
            setIsEmail(true);
          }}
        >
          Next
        </ZuButton>
      </Stack>
    </Stack>
  );
};

export const Payment: React.FC<IProps> = ({
  setIsEmail,
  setIsPayment,
  handleClose,
}) => {
  return (
    <Stack>
      <Stack
        padding="20px"
        bgcolor="#262626"
        borderBottom="1px solid #383838"
        spacing="20px"
      >
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box
            component="img"
            height="30px"
            width="30px"
            borderRadius="2px"
            src="/14.webp"
          />
          <Typography variant="subtitleLB">EventName</Typography>
        </Stack>
        <Stack
          padding="20px"
          spacing="30px"
          borderRadius="10px"
          border="1px solid #383838"
          alignItems="center"
          bgcolor="#222222"
        >
          <Typography variant="subtitleLB">Congrats, you received</Typography>
          <Box
            component="img"
            width="300px"
            height="300px"
            borderRadius="20px"
            src="/26.png"
          />
          <ZuButton endIcon={<ArrowDownTrayIcon size={5} />}>
            Download Your Backup
          </ZuButton>
          <Typography variant="bodyB">
            transaction id - explorer link
          </Typography>
          <ZuButton
            startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: '100%', backgroundColor: '#2c383b', color: '#67DBFF' }}
            onClick={handleClose}
          >
            Back to Event View
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
