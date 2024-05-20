import { createContext, useContext, useState } from 'react';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { definition } from '../composites/definition.js';
import React from 'react';
import { authenticateCeramic } from '../utils/ceramicAuth';
/**
 * Configure ceramic Client & create context.
 */
const ceramicUrl = 'http://67.207.76.155:7007/';
//process.env.NEXT_PUBLIC_CERAMIC_URL || 'http://localhost:7007';

const ceramic = new CeramicClient(ceramicUrl);
const composeClient = new ComposeClient({
  ceramic: ceramicUrl,
  definition: definition as RuntimeCompositeDefinition,
});
type Profile = {
  id?: any;
  username?: string | undefined;
};
interface CeramicContextType {
  ceramic: CeramicClient;
  composeClient: ComposeClient;
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  username: string | undefined;
  profile: Profile | undefined;
  newUser: boolean;
  logout: () => void;
  isAuthPromptVisible: boolean;
  showAuthPrompt: () => void;
  hideAuthPrompt: () => void;
  createProfile: (newName: string) => Promise<void>;
}

const CeramicContext = createContext<CeramicContextType>({
  ceramic,
  composeClient,
  isAuthenticated: false,
  authenticate: async () => {},
  username: undefined,
  profile: undefined,
  newUser: false,
  logout: () => {},
  isAuthPromptVisible: false,
  showAuthPrompt: () => {},
  hideAuthPrompt: () => {},
  createProfile: async (newName: string) => {},
});

export const CeramicProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthPromptVisible, setAuthPromptVisible] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [newUser, setNewuser] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>();

  const authenticate = async () => {
    console.log('authenticating', ceramicUrl, ceramic, composeClient);
    await authenticateCeramic(ceramic, composeClient);
    setIsAuthenticated(true);
    await getProfile();
    console.log(newUser, profile, 'info');
    setIsAuthenticated(true);
  };

  const showAuthPrompt = () => {
    setAuthPromptVisible(true);
    const existingusername = localStorage.getItem('username');
    if (existingusername) {
      setIsAuthenticated(true);
    }
  };
  const hideAuthPrompt = () => setAuthPromptVisible(false);

  const logout = () => {
    setIsAuthenticated(false);
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
      console.log(profile, 'profile');
      const basicProfile: { id: string; username: string } | undefined =
        profile?.data?.viewer?.mvpProfile;
      console.log('Basic Profile:', basicProfile);
      localStorage.setItem(
        'username',
        profile?.data?.viewer?.mvpProfile?.username,
      );
      setProfile(basicProfile);
      setUsername(basicProfile?.username);
      console.log(basicProfile?.username);
      if (!basicProfile) {
        setProfile(undefined);
        setNewuser(true);
      }
    }
  };

  const createProfile = async (newName: string) => {
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
        const newProfile: { id: string; username: string } | undefined =
          updatedProfile?.data?.viewer?.mvpProfile;
        setProfile(newProfile);
        if (newProfile?.username) {
          setUsername(newProfile.username);
          localStorage.setItem('username', newProfile.username);
        }
      }
    }
  };

  return (
    <CeramicContext.Provider
      value={{
        ceramic,
        composeClient,
        isAuthenticated,
        authenticate,
        username,
        profile,
        newUser,
        logout,
        isAuthPromptVisible,
        showAuthPrompt,
        hideAuthPrompt,
        createProfile,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export default CeramicContext;
export const useCeramicContext = () => useContext(CeramicContext);
