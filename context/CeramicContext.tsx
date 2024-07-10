import React, { createContext, useContext, useState, useEffect } from 'react';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { definition } from '../composites/definition.js';
import { authenticateCeramic } from '../utils/ceramicAuth';
import { Profile, CreateProfileResult } from '@/types/index.js';
/**
 * Configure ceramic Client & create context.
 */
const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const ceramicUrl =
  (isDev
    ? process.env.NEXT_PUBLIC_CERAMIC_URL_DEV
    : process.env.NEXT_PUBLIC_CERAMIC_URL_PROD) || 'http://localhost:7007';

const ceramic = new CeramicClient(ceramicUrl);
const composeClient = new ComposeClient({
  ceramic: ceramicUrl,
  definition: definition as RuntimeCompositeDefinition,
});

interface CeramicContextType {
  ceramic: CeramicClient;
  composeClient: ComposeClient;
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
  username: string | undefined;
  profile: Profile | undefined;
  newUser: boolean | undefined;
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
  newUser: undefined,
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
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean | undefined>(undefined);
  const authenticate = async () => {
    await authenticateCeramic(ceramic, composeClient);
    setIsAuthenticated(true);
    await getProfile();
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
    localStorage.removeItem('username');
    localStorage.removeItem('ceramic:eth_did');
    localStorage.removeItem('display did');
    localStorage.removeItem('logged_in');
    setIsAuthenticated(false);
    setNewUser(false);
  };
  const getProfile = async () => {
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
      const basicProfile: { id: string; username: string } | undefined =
        profile?.data?.viewer?.mvpProfile;
      if (basicProfile?.id) {
        localStorage.setItem('username', basicProfile.username);
        setProfile(basicProfile);
        setUsername(basicProfile.username);
        setNewUser(false);
      } else {
        setNewUser(true);
      }
    }
  };

  const createProfile = async (newName: string) => {
    if (!ceramic.did || !newName) {
      console.error('Invalid DID or name provided.');
    }

    try {
      const update = await composeClient.executeQuery(`
        mutation {
          createMVPProfile(input: {
            content: {
              username: "${newName}"
            }
          }) {
            document {
              username
            }
          }
        }
      `);

      if (update.errors) {
        console.error('Error creating profile:', update.errors);
      }
      await getProfile();
    } catch (error) {
      console.error('Error creating profile:', error);
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
