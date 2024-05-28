//import type { CeramicApi } from "@ceramicnetwork/common";
import type { ComposeClient } from '@composedb/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { SolanaWebAuth, getAccountIdByNetwork } from '@didtools/pkh-solana';
import { StreamID } from '@ceramicnetwork/streamid';
import { normalizeAccountId } from '@ceramicnetwork/common';
import { Cacao, SiweMessage } from '@didtools/cacao';
import { getAddress } from '@ethersproject/address';
import { randomBytes, randomString } from '@stablelib/random';
import { DIDSession, createDIDCacao, createDIDKey } from 'did-session';
import React, { useCallback, useEffect, useState } from 'react';
//import { ModelInstanceDocument } from '@composedb/types';
//import { makeCeramicDaemon } from "@ceramicnetwork/cli/lib/__tests__/make-ceramic-daemon";
import { CeramicClient } from '@ceramicnetwork/http-client';

const DID_SEED_KEY = 'ceramic:did_seed';

declare global {
  interface Window {
    ethereum?: any;
  }
}
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

    // if (ethProvider.chainId !== appConfig.testNetwork.chainId) {
    /*const switchRes = await switchTestNetwork();
      if (!switchRes) {
        throw new Error("Network error.");
        }*/
    // }

    // request ethereum accounts.
    const addresses = await ethProvider.enable({
      method: 'eth_requestAccounts',
    });

    const accountId = await getAccountId(ethProvider, addresses[0]);
    let normAccount, keySeed, didKey;
    try {
      normAccount = normalizeAccountId(accountId);
      console.log(normAccount, 'normAccount');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          'Error occurred in normalizeAccountId method:',
          error.message,
        );
      } else {
        console.error(
          'An unknown type of error occurred in normalizeAccountId method',
        );
      }
    }

    try {
      keySeed = randomBytes(32);
      console.log(keySeed, 'keySeed');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error occurred in randomBytes method:', error.message);
      } else {
        console.error(
          'An unknown type of error occurred in randomBytes method',
        );
      }
    }

    try {
      didKey = await createDIDKey(keySeed);
      console.log(didKey, 'didKey');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error occurred in createDIDKey method:', error.message);
      } else {
        console.error(
          'An unknown type of error occurred in createDIDKey method',
        );
      }
    }

    const now = new Date();
    const twentyFiveDaysLater = new Date(
      now.getTime() + 25 * 24 * 60 * 60 * 1000,
    );
    console.log('here');
    if (normAccount && didKey) {
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: getAddress(normAccount.address),
        statement:
          'Give this application access to some of your data on Ceramic',
        uri: didKey.id,
        version: '1',
        chainId: '1',
        nonce: randomString(10),
        issuedAt: now.toISOString(),
        expirationTime: twentyFiveDaysLater.toISOString(),
        resources: ['ceramic://*'],
      });
      console.log(
        siweMessage.signMessage(),
        'message',
        getAddress(accountId.address),
        'address',
      );
      try {
        siweMessage.signature = await ethProvider.request({
          method: 'personal_sign',
          params: [siweMessage.signMessage(), getAddress(accountId.address)],
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('error', error.message);
        } else {
          console.error('unknown error');
        }
      }

      const cacao = Cacao.fromSiweMessage(siweMessage);
      const did = await createDIDCacao(didKey, cacao);
      session = new DIDSession({ cacao, keySeed, did });
      console.log(session.did);
      localStorage.setItem('did', session.serialize());
      // Set the session in localStorage.
    }

    // Set our Ceramic DID to be our session DID.
    //@ts-ignore
    if (session) {
      compose.setDID(session.did);
      //@ts-ignore
      ceramic.did = session.did;
      localStorage.setItem('id', session.did.parent);
    }
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts;
  }
};
