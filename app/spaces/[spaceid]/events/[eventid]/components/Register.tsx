import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import { ZuButton, ZuInput } from '@/components/core';
import { ArrowUpRightIcon, LeftArrowIcon, RightArrowIcon } from '@/components/icons';

interface IProps {
  setIsInitial?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsDisclaimer?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsEmail?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsPayment?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsCompletion?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsRush?: React.Dispatch<React.SetStateAction<boolean>> | any;
}

export const Initial: React.FC<IProps> = ({ setIsInitial }) => {
  return (
    <Stack>
      <Stack direction="row" spacing="10px" padding="20px" alignItems="center" bgcolor="#262626" borderBottom="1px solid #383838">
        <Box component="img" height="30px" width="30px" borderRadius="2px" src="/14.webp" />
        <Typography variant="subtitleLB">
          EventName
        </Typography>
      </Stack>
      <Stack padding="20px">
        <Stack padding="20px" border="1px solid #383838" bgcolor="#262626" spacing="20px" borderRadius="10px">
          <Typography variant="subtitleLB">
            Approval Required
          </Typography>
          <Typography variant="bodyB">
            Registration for this event requires an application. Once approved, a link to complete registration will be sent via email.
          </Typography>
          <ZuButton endIcon={<ArrowUpRightIcon size={5} />} onClick={() => setIsInitial(true)}>
            Apply
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export const Disclaimer: React.FC<IProps> = ({ setIsInitial, setIsDisclaimer }) => {
  return (
    <Stack>
      <Stack direction="row" spacing="10px" padding="20px" alignItems="center" bgcolor="#262626" borderBottom="1px solid #383838">
        <Box component="img" height="30px" width="30px" borderRadius="2px" src="/14.webp" />
        <Typography variant="subtitleLB">
          EventName
        </Typography>
      </Stack>
      <Stack padding="20px">
        <Stack padding="20px" border="1px solid #383838" bgcolor="#262626" spacing="30px" borderRadius="10px">
          <Stack spacing="20px">
            <Typography variant="subtitleLB">
              Notice for Registrants:
            </Typography>
            <Typography variant="bodyB">
              Be sure to have an invited code before minting this ticket.
              To Apply to this event, please go to https://....
            </Typography>
          </Stack>
          <Stack spacing="10px">
            <Typography variant="bodyBB">
              Invite Code
            </Typography>
            <ZuInput />
          </Stack>
          <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
            onClick={() => { setIsInitial(false); setIsDisclaimer(true) }}>
            Authenticate
          </ZuButton>
        </Stack >
      </Stack>
    </Stack>
  )
}

export const Email: React.FC<IProps> = ({ setIsDisclaimer, setIsEmail }) => {
  return (
    <Stack>
      <Stack padding="20px" bgcolor="#262626" borderBottom="1px solid #383838" spacing="20px">
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box component="img" height="30px" width="30px" borderRadius="2px" src="/14.webp" />
          <Typography variant="subtitleLB">
            EventName
          </Typography>
        </Stack>
        <Stack direction="row" spacing="14px">
          <Box component="img" width="140px" height="140px" borderRadius="8px" src="/14.webp" />
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px">
              <Typography variant="bodyM">
                Ticket:
              </Typography>
              <Typography variant="bodyBB">
                TicketName
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">
                Price:
              </Typography>
              <Typography variant="bodyBB">
                0000
              </Typography>
              <Typography variant="caption">
                TOKEN
              </Typography>
            </Stack>
            <Typography variant="bodyM">
              Description
            </Typography>
            <Typography variant="bodyS">
              Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding="20px">
        <Stack padding="20px" border="1px solid #383838" bgcolor="#262626" spacing="30px" borderRadius="10px">
          <Stack spacing="20px">
            <Typography variant="subtitleLB">
              Provide Email
            </Typography>
            <Typography variant="bodyB">
              Input your email for notifications
            </Typography>
          </Stack>
          <Stack spacing="10px">
            <Typography variant="bodyBB">
              Email
            </Typography>
            <ZuInput />
          </Stack>
          <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
            sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
            onClick={() => { setIsDisclaimer(false); setIsEmail(true); }}>
            Payment
          </ZuButton>
        </Stack>
      </Stack>
    </Stack>
  )
}

export const Payment: React.FC<IProps> = ({ setIsEmail, setIsPayment }) => {
  return (
    <Stack>
      <Stack padding="20px" bgcolor="#262626" borderBottom="1px solid #383838" spacing="20px">
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box component="img" height="30px" width="30px" borderRadius="2px" src="/14.webp" />
          <Typography variant="subtitleLB">
            EventName
          </Typography>
        </Stack>
        <Stack direction="row" spacing="14px">
          <Box component="img" width="140px" height="140px" borderRadius="8px" src="/14.webp" />
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px">
              <Typography variant="bodyM">
                Ticket:
              </Typography>
              <Typography variant="bodyBB">
                TicketName
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">
                Price:
              </Typography>
              <Typography variant="bodyBB">
                0000
              </Typography>
              <Typography variant="caption">
                TOKEN
              </Typography>
            </Stack>
            <Typography variant="bodyM">
              Description
            </Typography>
            <Typography variant="bodyS">
              Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding="20px" spacing="20px">
        <Stack textAlign="center" bgcolor="#2d2d2d" paddingY="59px" fontFamily="Inter" fontSize="16px">
          Payment
        </Stack>
        <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
          sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
          onClick={() => { setIsEmail(false); setIsPayment(true); }}>
          Next
        </ZuButton>
      </Stack>
    </Stack>
  )
}

export const Completion: React.FC<IProps> = ({ setIsPayment, setIsCompletion }) => {
  return (
    <Stack>
      <Stack padding="20px" bgcolor="#262626" borderBottom="1px solid #383838" spacing="20px">
        <Stack direction="row" spacing="10px" alignItems="center">
          <Box component="img" height="30px" width="30px" borderRadius="2px" src="/14.webp" />
          <Typography variant="subtitleLB">
            EventName
          </Typography>
        </Stack>
        <Stack direction="row" spacing="14px">
          <Box component="img" width="140px" height="140px" borderRadius="8px" src="/14.webp" />
          <Stack spacing="10px">
            <Stack direction="row" spacing="10px">
              <Typography variant="bodyM">
                Ticket:
              </Typography>
              <Typography variant="bodyBB">
                TicketName
              </Typography>
            </Stack>
            <Stack direction="row" spacing="10px" alignItems="end">
              <Typography variant="bodyM">
                Price:
              </Typography>
              <Typography variant="bodyBB">
                0000
              </Typography>
              <Typography variant="caption">
                TOKEN
              </Typography>
            </Stack>
            <Typography variant="bodyM">
              Description
            </Typography>
            <Typography variant="bodyS">
              Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack padding="20px" spacing="20px">
        <Stack textAlign="center" bgcolor="#2d2d2d" paddingY="59px" fontFamily="Inter" fontSize="16px">
          Payment
        </Stack>
        <ZuButton startIcon={<RightArrowIcon color="#67DBFF" />}
          sx={{ width: "100%", backgroundColor: '#2c383b', color: "#67DBFF" }}
          onClick={() => { setIsPayment(false); setIsCompletion(true); }}>
          Next
        </ZuButton>
      </Stack>
    </Stack>
  )
}

export const Rush = () => {
  return (
    <Stack padding="20px" bgcolor="#262626" borderBottom="1px solid #383838" spacing="20px">
      <Stack direction="row" spacing="10px" alignItems="center">
        <Box component="img" height="30px" width="30px" borderRadius="2px" src="/14.webp" />
        <Typography variant="subtitleLB">
          EventName
        </Typography>
      </Stack>
      <Stack spacing="14px">
        <Stack alignItems="center">
          <Box component="img" width="312px" height="312px" borderRadius="8px" src="/14.webp" />
        </Stack>
        <Stack spacing="10px" padding="20px">
          <Stack direction="row" spacing="10px">
            <Typography variant="bodyM">
              Ticket:
            </Typography>
            <Typography variant="bodyBB">
              TicketName
            </Typography>
          </Stack>
          <Stack direction="row" spacing="10px" alignItems="end">
            <Typography variant="bodyM">
              Price:
            </Typography>
            <Typography variant="bodyBB">
              0000
            </Typography>
            <Typography variant="caption">
              TOKEN
            </Typography>
          </Stack>
          <Typography variant="bodyM">
            Description
          </Typography>
          <Typography variant="bodyS">
            Get ready to groove at the Summer Music Festival! Join us for a day filled with live music, food trucks, and good vibes.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}


