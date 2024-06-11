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
const ceramicUrl =
  process.env.NEXT_PUBLIC_CERAMIC_URL || 'http://localhost:7007';

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
  newUser: boolean;
  logout: () => void;
  isAuthPromptVisible: boolean;
  showAuthPrompt: () => void;
  hideAuthPrompt: () => void;
  createProfile: (newName: string) => Promise<CreateProfileResult>;
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
  createProfile: async (newName: string): Promise<CreateProfileResult> => {
    if (!newName) {
      return { error: 'Name is required.' };
    }
    return { profile: { id: 'newId', username: newName } };
  },
});

export const CeramicProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthPromptVisible, setAuthPromptVisible] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<Profile | undefined>();
  let newUser = false;
  const authenticate = async () => {
    await authenticateCeramic(ceramic, composeClient);
    await getProfile();
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
    localStorage.removeItem('username');
    localStorage.removeItem('ceramic:eth_did');
    localStorage.removeItem('display did');
    localStorage.removeItem('logged_in');
    setIsAuthenticated(false);
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
      localStorage.setItem(
        'username',
        profile?.data?.viewer?.mvpProfile?.username,
      );
      setProfile(basicProfile);
      setUsername(basicProfile?.username);
      if (!basicProfile) {
        newUser = true;
      }
      return basicProfile;
    }
  };

  const createProfile = async (
    newName: string,
  ): Promise<CreateProfileResult> => {
    if (!ceramic.did || !newName) {
      return { error: 'Invalid DID or name provided.' };
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
        return { error: update.errors.map((e: any) => e.message).join(', ') };
      }

      const updatedProfile = await getProfile();
      return { profile: updatedProfile };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { error: 'Failed to create profile.' };
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
