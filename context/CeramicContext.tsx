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
  logout: () => {},
  isAuthPromptVisible: false,
  showAuthPrompt: () => {},
  hideAuthPrompt: () => {},
});

export const CeramicProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthPromptVisible, setAuthPromptVisible] = useState(false);

  const authenticate = async () => {
    console.log('authenticating', ceramicUrl, ceramic, composeClient);
    await authenticateCeramic(ceramic, composeClient);
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

  return (
    <CeramicContext.Provider
      value={{
        ceramic,
        composeClient,
        isAuthenticated,
        authenticate,
        logout,
        isAuthPromptVisible,
        showAuthPrompt,
        hideAuthPrompt,
      }}
    >
      {children}
    </CeramicContext.Provider>
  );
};

export default CeramicContext;
export const useCeramicContext = () => useContext(CeramicContext);
