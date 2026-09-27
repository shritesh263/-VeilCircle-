import { NETWORKS } from './network.js';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { UnshieldedWallet, createKeystore, PublicKey } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { DustParameters, ZswapSecretKeys, DustSecretKey } from '@midnight-ntwrk/ledger-v8';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const seedFile = path.resolve(process.cwd(), '.veilcircle-wallet-state', 'seed.hex');
  const seedHex = fs.readFileSync(seedFile, 'utf-8').trim();
  const seedBytes = Buffer.from(seedHex, 'hex');
  const network = NETWORKS.preview;

  const hdResult = HDWallet.fromSeed(seedBytes);
  if (hdResult.type !== 'seedOk') throw new Error('HD failed');
  const accountKey = hdResult.hdWallet.selectAccount(0);
  const nightExternal = accountKey.selectRole(Roles.NightExternal).deriveKeyAt(0);
  if (nightExternal.type !== 'keyDerived') throw new Error('Key fail');

  const unshieldedKeystore = createKeystore(nightExternal.key, network.networkId);
  const unshieldedPublicKey = PublicKey.fromKeyStore(unshieldedKeystore);
  const shieldedSecretKeys = ZswapSecretKeys.fromSeed(seedBytes);
  const dustSecretKey = DustSecretKey.fromSeed(seedBytes);
  const initialDustParameters = new DustParameters(100n, 1n, 86400n);

  const relayWsUrl = network.node.startsWith('http') ? network.node.replace(/^http/, 'ws') : network.node;
  const facadeConfig = {
    networkId: network.networkId,
    indexerClientConnection: {
      indexerHttpUrl: network.indexer,
      indexerWsUrl: network.indexerWS,
    },
    relayURL: new URL(relayWsUrl),
    provingServerUrl: new URL(network.proofServer),
  };

  console.log('Initializing wallet with batchUpdates...');
  const wallet = await WalletFacade.init({
    configuration: facadeConfig as any,
    shielded: (cfg) => ShieldedWallet(cfg as any).startWithSecretKeys(shieldedSecretKeys),
    unshielded: (cfg) => UnshieldedWallet(cfg as any).startWithPublicKey(unshieldedPublicKey),
    dust: (cfg) => DustWallet({ ...cfg, batchUpdates: { size: 2000, timeout: 50, spacing: 0 } } as any).startWithSecretKey(dustSecretKey, initialDustParameters),
  });

  const startTime = Date.now();
  wallet.dust.state.subscribe({
    next: (s) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[${elapsed}s] Dust: applied=${s.progress?.appliedIndex}, highest=${s.progress?.highestIndex}, coins=${s.totalCoins?.length}, bal=${s.balance(new Date())}`);
      if (s.totalCoins?.length > 0 || (s.progress?.appliedIndex ?? 0n) >= 250000n) {
        console.log('✅ REACHED TARGET! Total coins:', s.totalCoins?.length);
      }
    },
    error: (e) => console.error('Err:', e),
  });
}

main().catch(console.error);
