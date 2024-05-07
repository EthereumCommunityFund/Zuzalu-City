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
const ceramicUrl =
  process.env.NEXT_PUBLIC_CERAMIC_URL || 'http://localhost:7007';

const ceramic = new CeramicClient(ceramicUrl);
const composeClient = new ComposeClient({
  ceramic: ceramicUrl,
  definition: definition as RuntimeCompositeDefinition,
});

const CeramicContext = createContext({
  ceramic,
  composeClient,
  isAuthenticated: false,
  authenticate: async () => {},
  username: '',
  profile: null,
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
  const [username, setUsername] = useState('');
  const [newUser,setNewuser ] = useState(false);
  const [profile, setProfile] = useState(null);

  const authenticate = async () => {
    console.log('authenticating', ceramicUrl, ceramic, composeClient);
    await authenticateCeramic(ceramic, composeClient);
    setIsAuthenticated(true);
    await getProfile();
      setIsAuthenticated(true);
    
  };

  const showAuthPrompt = () => {
    setAuthPromptVisible(true);
    console.log(isAuthPromptVisible, 'showAuthPrompt called');
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
      localStorage.setItem('viewer', profile?.data?.viewer?.id);
      console.log(profile, 'profile');
      const basicProfile: { id: string; username: string } | undefined =
        profile?.data?.viewer?.mvpProfile;
      console.log('Basic Profile:', basicProfile);
      setProfile(basicProfile);
      setUsername(profile.username);
    } else {
      setProfile(undefined);
      setNewuser(true);
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
        setProfile(updatedProfile?.data?.viewer?.mvpProfile);
        setUsername(profile.username);
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
        createProfile
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export default CeramicContext;
export const useCeramicContext = () => useContext(CeramicContext);
