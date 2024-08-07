import { ZuButton, ZuInput } from '@/components/core';
import { useCeramicContext } from '@/context/CeramicContext';
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface NewUserPromprtModalProps {
  showModal: boolean;
  onClose: () => void;
}

export default function NewUserPromptModal({
  showModal,
  onClose,
}: NewUserPromprtModalProps) {
  const [stage, setStage] = useState('Initial');
  const [nickname, setNickName] = useState<string>('');
  const [haveRead, setHaveRead] = useState<boolean>(false);
  const { createProfile } = useCeramicContext();

  const handleConinue = async () => {
    await createProfile(nickname);
    setStage('Final');
  };

  useEffect(() => {
    setStage('Initial');
    setNickName('');
  }, [showModal]);

  return (
    <Dialog
      open={showModal}
      onClose={onClose}
      PaperProps={{
        style: {
          width: '692px',
          height: 'auto',
          padding: '20px 16px',
          backgroundColor: 'rgba(34, 34, 34, 0.9)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '20px',
          margin: '0px',
          maxWidth: 'unset',
        },
      }}
    >
      <DialogTitle
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          fontSize: '25px',
          fontWeight: 'bold',
        }}
      >
        {stage === 'Initial' && 'Welcome to Zuzalu.City'}
        {stage === 'Nickname' && 'Welcome to Zuzalu City'}
        {stage === 'Final' && `Welcome, ${nickname}`}
      </DialogTitle>
      <DialogContent style={{ width: '100%', color: 'white', padding: '10px' }}>
        <Stack
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {stage === 'Initial' && (
            <>
              <Typography fontSize={'18px'}>
                Warning - Zuzalu.city is currently in Alpha
              </Typography>
              <ul>
                <li>
                  <Typography fontSize={'18px'}>
                    This version of Zuzalu.city may break or stop working
                    without warning
                  </Typography>
                </li>
                <li>
                  <Typography fontSize={'18px'}>
                    Communities created with this version may be broken by
                    future releases
                  </Typography>
                </li>
                <li>
                  <Typography fontSize={'18px'}>
                    Zuzalu.city currently consumes large amounts of bandwidth
                  </Typography>
                </li>
              </ul>
              <Typography fontSize={'18px'}>
                We are working to fix all these issues ASAP, ahead of
                Zuzalu.city 1.0 release!
              </Typography>
            </>
          )}
          {stage === 'Nickname' && (
            <>
              <Typography fontSize={'18px'} sx={{ opacity: '0.7' }}>
                Let’s get started with your nickname. You can change it later or
                skip this and show your wallet or ENS address
              </Typography>
            </>
          )}
          {stage === 'Final' && (
            <>
              <Typography fontSize={'18px'} sx={{ opacity: '0.7' }}>
                You’re ready! Now explore events and join community spaces.
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'center',
          width: '100%',
          padding: 0,
          flexDirection: 'column',
        }}
      >
        {stage === 'Initial' && (
          <>
            <Box
              flexDirection={'row'}
              display={'flex'}
              width={'100%'}
              gap={'20px'}
              paddingTop={'20px'}
              borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
              alignItems={'center'}
            >
              <Checkbox
                value={haveRead}
                onChange={(e) => setHaveRead(e.target.checked)}
              ></Checkbox>
              <Typography fontSize={'18px'}>
                I have read the above and understand that Zuzalu.city is Beta
                software
              </Typography>
            </Box>
            <ZuButton
              sx={{
                width: '100%',
              }}
              disabled={!haveRead}
              onClick={() => setStage('Nickname')}
            >
              Continue
            </ZuButton>
          </>
        )}
        {stage === 'Nickname' && (
          <Stack width={'100%'} gap={'20px'}>
            <Stack width={'100%'} gap={'5px'} alignItems={'flex-end'}>
              <ZuInput
                placeholder="Type a nick name"
                value={nickname}
                onChange={(e) => setNickName(e.target.value)}
                sx={{
                  padding: '12px',
                  width: '100%',
                }}
              ></ZuInput>
              <Typography fontSize={'10px'} sx={{ opacity: '0.7' }}>
                00 Characters Left
              </Typography>
            </Stack>
            <ZuButton
              disabled={!nickname}
              onClick={handleConinue}
              sx={{
                width: '100%',
              }}
            >
              Continue
            </ZuButton>
          </Stack>
        )}
        {stage === 'Final' && (
          <ZuButton
            sx={{
              width: '100%',
            }}
            onClick={onClose}
          >
            Finish
          </ZuButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
