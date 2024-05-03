import React, {
  useState,
  useEffect,
  Fragment,
  ReactNode,
  useCallback,
} from 'react';
import { useCeramicContext } from '../context/CeramicContext';
import { useAccount, useEnsName } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import {
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
//const AuthPrompt: React.FC<{ onAuthenticated: () => void }> = ({
type AuthPromptContent =
  | {
      title: string;
      message: string;
      actions: Element[];
    }
  | {
      title: string;
      message: string;
      actions: { text: string; onClick: () => void }[];
    }
  | undefined;

type Profile = {
  id?: any;
  name?: string;
  username?: string;
  description?: string;
  gender?: string;
  emoji?: string;
};

const AuthPrompt: React.FC<{}> = () => {
  const { address, isConnected } = useAccount();
  const [isVisible, setIsVisible] = useState(true);
  const { data: ensName } = useEnsName({ address });
  const [inputUsername, setInputUsername] = useState('');
  const {
    ceramic,
    composeClient,
    isAuthenticated,
    authenticate,
    logout,
    showAuthPrompt,
    hideAuthPrompt,
    isAuthPromptVisible,
  } = useCeramicContext();
  //const { ceramic, composeClient } = clients;
  const [authState, setAuthState] = useState('CONNECT_WALLET');
  const isLogged = () => {
    return localStorage.getItem('logged_in') == 'true';
  };

  const handleOpen = () => {
    if (localStorage.getItem('logged_in')) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const [profile, setProfile] = useState<Profile | undefined>();

  const [isLoading, setIsLoading] = useState(true);
  const handleKeyDid = () => {
    localStorage.setItem('ceramic:auth_type', 'key');
    authenticate;
    setIsVisible(false);
  };

  const handleConnectWallet = () => {
    if (isConnected) {
      setAuthState('NEW_USER');
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputUsername(newValue);
  };
  const handleEthPkh = () => {
    localStorage.setItem('ceramic:auth_type', 'eth');
    authenticate;
    setIsVisible(false);
  };
  const getProfile = async () => {
    console.log('getting profile ceramic.did: ', ceramic.did);
    if (ceramic.did !== undefined) {
      const profile: any = await composeClient.executeQuery(`
        query {
          viewer {
            mvpProfile {
              id
              username
            }
          }
        }
      `);
      localStorage.setItem('viewer', profile?.data?.viewer?.id);
      const basicProfile:
        | { id: string; name: string; username: string }
        | undefined = profile?.data?.viewer?.basicProfile;
      console.log('Basic Profile:', basicProfile);
      setProfile(basicProfile);
      setIsLoading(false);
    } else {
      setProfile(undefined);
      setIsLoading(false);
    }
  };

  const updateProfile = async (newName: string) => {
    if (ceramic.did !== undefined && newName) {
      console.log(newName, 'username');
      const update = await composeClient.executeQuery(`
        mutation {
          createMVPProfile(input: {
            content: {
              username: "${newName}"
            }
          }) 
          {
            document {
              username
            }
          }
        }
      `);
      if (update.errors) {
        alert(update.errors);
      } else {
        const updatedProfile: any = await composeClient.executeQuery(`
        query {
          viewer {
            mvpProfile {
              id
              username
            }
          }
        }
      `);
        console.log(updatedProfile, 'updated profile');
        setProfile(updatedProfile?.data?.viewer?.mvpProfile);
      }
    }
  };

  const getDialogContent = useCallback(() => {
    switch (authState) {
      case 'CONNECT_WALLET':
        return {
          title: 'Sign In to Zuzalu City1',
          message: 'Sign in or register a new account',
          actions: [
            <Fragment key="connectButton">
              <ConnectButton
                key="connect"
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
              />
            </Fragment>,
          ],
        };
      case 'NEW_USER':
        return {
          title: 'Welcome to Zuzalu City',
          message:
            "Let's get started with your username. You can change your username later or skip this.",
          actions: [
            <Box
              key="action-buttons"
              sx={{
                width: '100%',
                height: '100%',
                p: 3,
                bgcolor: 'rgba(34, 34, 34, 0.60)',
                borderRadius: 2,
                border: '1px rgba(255, 255, 255, 0.10) solid',
                backdropFilter: 'blur(40px)',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                display: 'flex',
              }}
            >
              <OutlinedInput
                placeholder="Enter text here"
                value={inputUsername}
                onChange={handleInputChange}
                style={{ marginRight: 8 }}
              />
              <Button
                onClick={() => {
                  if (address) {
                    updateProfile((ensName || address.slice(0, 10)) as string);
                  }
                  setAuthState('Logged_In');
                }}
                variant="outlined"
              >
                Skip
              </Button>
              <Button
                onClick={() => {
                  updateProfile(inputUsername);
                  setAuthState('Logged_In');
                }}
                color="primary"
                variant="contained"
                style={{ marginLeft: 8 }}
              >
                Continue
              </Button>
            </Box>,
          ],
        };
      case 'Logged_In':
        if (profile) {
          return {
            title: `Welcome, ${profile.username}`,
            message:
              'You’re ready! Now explore events and join community spaces.',
            actions: [
              <Button key="retry" onClick={() => hideAuthPrompt()}>
                Finish
              </Button>,
            ],
          };
        }
    }
  }, [authState, setAuthState, profile, hideAuthPrompt]);

  useEffect(() => {
    if (isAuthPromptVisible) {
      getDialogContent();
      setAuthState('CONNECT_WALLET');
    }
  }, [isAuthPromptVisible]);

  useEffect(() => {
    const authenticateConnected = async () => {
      if (isConnected) {
        console.log('Wallet is connected with address:', address);
        try {
          await authenticate();
          await getProfile();
          if (profile) {
            setAuthState('Logged_In');
          } else {
            setAuthState('NEW_USER');
          }
          getDialogContent();
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      }
    };
    authenticateConnected();
  }, [isConnected]);

  const content = getDialogContent();
  if (content) {
    const { title, message, actions } = content as {
      title: string;
      message: string;
      actions: ReactNode[];
    };

    return (
      <div>
        <Dialog open={isAuthPromptVisible} onClose={hideAuthPrompt}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>
          <DialogActions>{actions}</DialogActions>
        </Dialog>
      </div>
    );
  } else {
    return <div>1111</div>;
  }
};

export default AuthPrompt;
