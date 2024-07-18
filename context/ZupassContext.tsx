'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import { Zuconfig } from '@/constant';
import { zuAuthPopup } from '@pcd/zuauth/client';
import { authenticate } from '@pcd/zuauth/server';

type ZuAuthState =
  | 'logged out'
  | 'auth-start'
  | 'authenticating'
  | 'authenticated'
  | 'error';

interface ZuAuthContextType {
  pcdStr: string;
  nullifierHash: string;
  authState: ZuAuthState;
  log: string;
  user: Record<string, string> | undefined;
  auth: () => void;
  logout: () => void;
}

const ZupassContext = createContext<ZuAuthContextType>({
  pcdStr: '',
  nullifierHash: '',
  authState: 'logged out',
  log: '',
  user: undefined,
  auth: () => {},
  logout: () => {},
});

export const ZupassProvider = ({ children }: any) => {
  const [pcdStr, setPcdStr] = useState<string>('');
  const [nullifierHash, setNullifierHash] = useState<string>('');
  const [authState, setAuthState] = useState<ZuAuthState>('logged out');
  const [log, addLog] = useReducer((currentLog: string, toAdd: string) => {
    return `${currentLog}${currentLog === '' ? '' : '\n'}${toAdd}`;
  }, '');
  const [user, setUser] = useState<Record<string, string> | undefined>();

  useEffect(() => {
    (async () => {
      if (authState === 'auth-start') {
        addLog('Fetching watermark');
        const watermark = (await (await fetch('/api/watermark')).json())
          .watermark;
        addLog('Got watermark');
        addLog('Opening popup window');
        setAuthState('authenticating');
        const result = await zuAuthPopup({
          zupassUrl: process.env.NEXT_PUBLIC_ZUPASS_SERVER_URL as string,
          fieldsToReveal: {
            revealAttendeeEmail: true,
            revealAttendeeName: true,
            revealEventId: true,
            revealProductId: true,
          },
          watermark,
          config: Zuconfig,
        });
        if (result.type === 'pcd') {
          addLog('Received PCD');
          setPcdStr(result.pcdStr);
          /*const loginResult = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pcd: result.pcdStr }),
          });
          console.log('Response status:', loginResult.status);
          console.log('here', loginResult);
          setUser((await loginResult.json()).user);*/
          const pcd = await authenticate(result.pcdStr, watermark, Zuconfig);
          console.log(pcd);
          setNullifierHash(pcd.claim.nullifierHash as string);
          addLog('Authenticated successfully');
          setAuthState('authenticated');
        } else if (result.type === 'popupBlocked') {
          addLog('The popup was blocked by your browser');
          setAuthState('error');
        } else if (result.type === 'popupClosed') {
          addLog('The popup was closed before a result was received');
          setAuthState('error');
        } else {
          addLog(`Unexpected result type from zuAuth: ${result.type}`);
          setAuthState('error');
        }
      }
    })();
  }, [authState]);

  const auth = useCallback(() => {
    if (authState === 'logged out' || authState === 'error') {
      addLog('Beginning authentication');
      setAuthState('auth-start');
    }
  }, [authState]);

  const logout = useCallback(() => {
    setUser(undefined);
    setPcdStr('');
    setAuthState('logged out');
    addLog('Logged out');
  }, []);

  return (
    <ZupassContext.Provider
      value={{ pcdStr, authState, log, user, auth, logout, nullifierHash }}
    >
      {children}
    </ZupassContext.Provider>
  );
};

export const useZupassContext = () => useContext(ZupassContext);
