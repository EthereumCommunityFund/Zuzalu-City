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
  let logged_in = localStorage.getItem('logged_in');
  const popup = document.querySelector('.popup');
  console.log('logged_in in localStorage: ', logged_in);
  // if (logged_in == "true") {
  //   if (popup) {
  //     popup.style.display = "none";
  //   }
  // }
  /*let auth_type = localStorage.getItem('ceramic:auth_type');
  if (auth_type == 'key') {
    await authenticateKeyDID(ceramic, compose);
  }
  if (auth_type == 'eth') {
    await authenticateEthPKH(ceramic, compose);
  }*/
  await authenticateEthPKH(ceramic, compose);
  localStorage.setItem('logged_in', 'true');
};

const authenticateKeyDID = async (
  ceramic: CeramicClient,
  compose: ComposeClient,
) => {
  let seed_array: Uint8Array;
  if (localStorage.getItem(DID_SEED_KEY) === null) {
    // for production you will want a better place than localStorage for your sessions.
    console.log('Generating seed...');
    let seed = crypto.getRandomValues(new Uint8Array(32));
    let seed_json = JSON.stringify(seed, (key, value) => {
      if (value instanceof Uint8Array) {
        return Array.from(value);
      }
      return value;
    });
    localStorage.setItem(DID_SEED_KEY, seed_json);
    seed_array = seed;
    console.log('Generated new seed: ' + seed);
  } else {
    let seed_json_value = localStorage.getItem(DID_SEED_KEY);
    let seed_object = JSON.parse(seed_json_value as string);
    seed_array = new Uint8Array(seed_object);
    console.log('Found seed: ' + seed_array);
  }
  const provider = new Ed25519Provider(seed_array);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;
  compose.setDID(did);
  return;
};

const authenticateEthPKH = async (
  ceramic: CeramicClient,
  compose: ComposeClient,
) => {
  const sessionStr = localStorage.getItem('ceramic:eth_did');
  let session;
  console.log('existing session', sessionStr);
  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr);
  }

  if (!session || (session.hasSession && session.isExpired)) {
    if (window.ethereum === null || window.ethereum === undefined) {
      throw new Error('No injected Ethereum provider found.');
    }

    // We enable the ethereum provider to get the user's addresses.
    const ethProvider = window.ethereum;
    console.log('found provider', ethProvider);
    // request ethereum accounts.
    const addresses = await ethProvider.enable({
      method: 'eth_requestAccounts',
    });
    const accountId = await getAccountId(ethProvider, addresses[0]);
    console.log(accountId, 'account');
    console.log(ethProvider, 'ethProvider');
    console.log(accountId, 'accountId');
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId,
    );
    console.log('authMethod', authMethod);

    /**
     * Create DIDSession & provide capabilities for resources that we want to access.
     * @NOTE: The specific resources (ComposeDB data models) are provided through
     * "compose.resources" below.
     */
    console.log('authenticating');
    session = await DIDSession.authorize(authMethod, {
      resources: ['ceramic://*'],
    });
    console.log(compose.resources, 'resources');
    console.log(session, 'session');
    // Set the session in localStorage.
    localStorage.setItem('ceramic:eth_did', session.serialize());
  }

  // Set our Ceramic DID to be our session DID.
  compose.setDID(session.did);
  ceramic.did = session.did;
  localStorage.setItem('display did', session.did.toString());
  console.log(session.did, 'session did');
  console.log(compose.did, 'user did');
  return;
};
