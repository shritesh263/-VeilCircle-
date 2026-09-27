/**
 * scripts/wallet.ts
 *
 * Creates and manages the Midnight wallet for VeilCircle deployment.
 * Follows Rule 2: Unshielded sponsor wallet derived via HD derivation.
 * Deployments on Midnight Preview are paid using unshielded tDUST / tNIGHT.
 */

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { NetworkId, NetworkConfig } from './network.js';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

const STATE_DIR = path.resolve(process.cwd(), '.veilcircle-wallet-state');
const SEED_FILE = path.join(STATE_DIR, 'seed.hex');

/**
 * Gets or creates a random 32-byte hex wallet seed.
 * If MIDNIGHT_WALLET_SEED env var is set, uses that instead.
 * Persisted to .veilcircle-wallet-state/seed.hex between runs.
 */
export function getOrCreateSeed(): string {
  const fromEnv = process.env.MIDNIGHT_WALLET_SEED?.trim();
  if (fromEnv && fromEnv.length === 64) return fromEnv;

  if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
  if (fs.existsSync(SEED_FILE)) {
    return fs.readFileSync(SEED_FILE, 'utf-8').trim();
  }

  const seed = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SEED_FILE, seed, 'utf-8');
  return seed;
}

/**
 * Creates and initializes a unified Midnight WalletFacade instance.
 */
export async function createWallet(
  networkId: NetworkId,
  networkConfig: NetworkConfig,
  seedHex: string,
) {
  setNetworkId(networkId);
  const { HDWallet, Roles } = await import('@midnight-ntwrk/wallet-sdk-hd');
  const { ShieldedWallet } = await import('@midnight-ntwrk/wallet-sdk-shielded');
  const { DustWallet } = await import('@midnight-ntwrk/wallet-sdk-dust-wallet');
  const { UnshieldedWallet, createKeystore, PublicKey } = await import('@midnight-ntwrk/wallet-sdk-unshielded-wallet');
  const { WalletFacade } = await import('@midnight-ntwrk/wallet-sdk-facade');
  const { DustParameters, ZswapSecretKeys, DustSecretKey } = await import('@midnight-ntwrk/ledger-v8');

  const seedBytes = Buffer.from(seedHex, 'hex');
  if (seedBytes.length !== 32) {
    throw new Error(`Invalid seed length: expected 64 hex characters (32 bytes), got ${seedHex.length}`);
  }

  // Derive HD root wallet
  const hdResult = HDWallet.fromSeed(seedBytes);
  if (hdResult.type !== 'seedOk') {
    throw new Error('Failed to derive HDWallet from seed');
  }
  const hdWallet = hdResult.hdWallet;
  const accountKey = hdWallet.selectAccount(0);

  // Derive unshielded keystore & public key
  const nightExternalDerivation = accountKey.selectRole(Roles.NightExternal).deriveKeyAt(0);
  if (nightExternalDerivation.type !== 'keyDerived') {
    throw new Error('Failed to derive NightExternal unshielded key');
  }
  const unshieldedKeystore = createKeystore(nightExternalDerivation.key, networkId);
  const unshieldedPublicKey = PublicKey.fromKeyStore(unshieldedKeystore);

  // Derive shielded and dust secret keys from seed
  const shieldedSecretKeys = ZswapSecretKeys.fromSeed(seedBytes);
  const dustSecretKey = DustSecretKey.fromSeed(seedBytes);

  // Standard fallback parameters for initial dust wallet start before network sync
  const initialDustParameters = new DustParameters(100n, 1n, 86400n);

  const relayWsUrl = networkConfig.node.startsWith('http')
    ? networkConfig.node.replace(/^http/, 'ws')
    : networkConfig.node;

  const facadeConfig = {
    networkId,
    indexerClientConnection: {
      indexerHttpUrl: networkConfig.indexer,
      indexerWsUrl: networkConfig.indexerWS,
    },
    relayURL: new URL(relayWsUrl),
    provingServerUrl: new URL(networkConfig.proofServer),
  };

  const wallet = await WalletFacade.init({
    configuration: facadeConfig as any,
    shielded: (cfg) => ShieldedWallet(cfg as any).startWithSecretKeys(shieldedSecretKeys),
    unshielded: (cfg) => UnshieldedWallet(cfg as any).startWithPublicKey(unshieldedPublicKey),
    dust: (cfg) =>
      DustWallet({
        ...cfg,
        costParameters: {
          feeBlocksMargin: 5,
          additionalFeeOverhead: 0n,
        },
        batchUpdates: { size: 5000, timeout: 500, spacing: 0 },
      } as any).startWithSecretKey(dustSecretKey, initialDustParameters),
  });

  await wallet.start(shieldedSecretKeys, dustSecretKey);

  return {
    wallet,
    unshieldedKeystore,
    shieldedSecretKeys,
    dustSecretKey,
    getAddress: () => unshieldedKeystore.getBech32Address(),
    getPublicKeyBytes: () => unshieldedKeystore.getPublicKey(),
  };
}

export async function deriveDeployerAddress(networkId: NetworkId, seedHex: string): Promise<string> {
  setNetworkId(networkId);
  const { HDWallet, Roles } = await import('@midnight-ntwrk/wallet-sdk-hd');
  const { createKeystore } = await import('@midnight-ntwrk/wallet-sdk-unshielded-wallet');

  const seedBytes = Buffer.from(seedHex, 'hex');
  const hdResult = HDWallet.fromSeed(seedBytes);
  if (hdResult.type !== 'seedOk') {
    throw new Error('Failed to derive HDWallet from seed');
  }
  const accountKey = hdResult.hdWallet.selectAccount(0);

  const nightExternalDerivation = accountKey.selectRole(Roles.NightExternal).deriveKeyAt(0);
  if (nightExternalDerivation.type !== 'keyDerived') {
    throw new Error('Failed to derive NightExternal unshielded key');
  }
  const unshieldedKeystore = createKeystore(nightExternalDerivation.key, networkId);
  return unshieldedKeystore.getBech32Address().toString();
}

export type WalletContext = Awaited<ReturnType<typeof createWallet>>;

