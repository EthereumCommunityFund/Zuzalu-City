//import type { CeramicApi } from "@ceramicnetwork/common";
import type { ComposeClient } from '@composedb/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { DIDSession } from 'did-session';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { SolanaWebAuth, getAccountIdByNetwork } from '@didtools/pkh-solana';
import { StreamID } from '@ceramicnetwork/streamid';
//import { ModelInstanceDocument } from '@composedb/types';
//import { makeCeramicDaemon } from "@ceramicnetwork/cli/lib/__tests__/make-ceramic-daemon";
import { CeramicClient } from '@ceramicnetwork/http-client';

const DID_SEED_KEY = 'ceramic:did_seed';

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
export const authenticateCeramic = async (
  ceramic: CeramicClient,
  compose: ComposeClient,
) => {
  const sessionStr = localStorage.getItem('did'); // for production you will want a better place than localStorage for your sessions.
  let session;

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr);
  }

  if (!session || (session.hasSession && session.isExpired)) {
    if (window.ethereum === null || window.ethereum === undefined) {
      throw new Error('No injected Ethereum provider found.');
    }

    // We enable the ethereum provider to get the user's addresses.
    const ethProvider = window.ethereum;
    // request ethereum accounts.
    const addresses = await ethProvider.enable({
      method: 'eth_requestAccounts',
    });
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId,
    );

    /**
     * Create DIDSession & provide capabilities that we want to access.
     * @NOTE: Any production applications will want to provide a more complete list of capabilities.
     *        This is not done here to allow you to add more datamodels to your application.
     */
    // @ts-ignore
    session = await DIDSession.authorize(authMethod, {
      resources: compose.resources,
    });
    // Set the session in localStorage.
    localStorage.setItem('did', session.serialize());
  }

  // Set our Ceramic DID to be our session DID.
  //@ts-ignore
  compose.setDID(session.did);
  //@ts-ignore
  ceramic.did = session.did;
  localStorage.setItem('id', session.did.parent);
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts;
};
