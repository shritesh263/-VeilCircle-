/**
 * scripts/deploy.ts
 *
 * Deploys the VeilCircle zero-knowledge support group contract to Midnight Preview Network.
 *
 * Contract : contract/src/veilcircle.compact
 * Compiled : contract/src/managed/veilcircle/
 *
 * Pipeline :
 *   1. Check local proof server health (http://127.0.0.1:6300)
 *   2. Derive unshielded sponsor wallet and synchronize unshielded state
 *   3. Confirm funded tNIGHT balance (faucet tokens)
 *   4. Register tNIGHT UTXOs for DUST generation & wait for tDUST capacity
 *   5. Wire Midnight SDK providers
 *   6. Generate deployment ZK proof & submit transaction to Midnight blockchain
 *   7. Save deployment artifact with address, txId, and explorer link
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import * as Rx from 'rxjs';

// Official Midnight JS SDK
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// Local helpers
import { parseNetwork } from './network.js';
import { getOrCreateSeed, createWallet, type WalletContext } from './wallet.js';

// WebSocket polyfill required by Midnight SDK in Node.js
// @ts-expect-error global polyfill
globalThis.WebSocket = WebSocket;

// ─── Network ──────────────────────────────────────────────────────────────────

const { networkId, config: networkConfig } = parseNetwork();
setNetworkId(networkId);

// ─── Contract Artifacts ───────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const managedPath = path.resolve(__dirname, '..', 'src', 'managed', 'veilcircle');
const contractIndexPath = path.join(managedPath, 'contract', 'index.js');

console.log('\n================================================================');
console.log('       VeilCircle — Midnight Network Contract Deployment');
console.log('================================================================');
console.log(`📡 Network : ${networkId.toUpperCase()}`);
console.log(`📁 Managed : ${managedPath}`);

if (!fs.existsSync(contractIndexPath)) {
  console.error('\n❌ Compiled contract not found!');
  console.error('   Please run: bash compile.sh');
  console.error(`   Expected:   ${contractIndexPath}\n`);
  process.exit(1);
}

const VeilCircleModule = await import(pathToFileURL(contractIndexPath).href);

// Deployment does not execute member-joining circuits, but Contract constructor
// requires witnesses object implementing all declared contract witnesses:
const deployWitnesses = {
  secretKeyWitness: (context: any) => [context.privateState, new Uint8Array(32)],
  eligibilityAttributeWitness: (context: any) => [context.privateState, new Uint8Array(32)],
  saltWitness: (context: any) => [context.privateState, new Uint8Array(32)],
};

const compiledContract = (CompiledContract.make('veilcircle', VeilCircleModule.Contract) as any).pipe(
  (CompiledContract.withWitnesses as any)(deployWitnesses),
  (CompiledContract.withCompiledFileAssets as any)(managedPath),
);

// ─── Proof Server Check ───────────────────────────────────────────────────────

async function waitForProofServer(maxAttempts = 10, delayMs = 1500): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(networkConfig.proofServer, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok || res.status < 500) return true;
    } catch (err: any) {
      const code = err?.cause?.code || err?.code || '';
      if (code !== 'ECONNREFUSED' && code !== 'UND_ERR_CONNECT_TIMEOUT' && code !== 'UND_ERR_SOCKET') {
        return true;
      }
    }
    if (attempt < maxAttempts) {
      process.stdout.write(`\r  ⏳ Checking proof server... (attempt ${attempt}/${maxAttempts})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return false;
}

// ─── Providers Setup ──────────────────────────────────────────────────────────

async function createProviders(walletCtx: WalletContext) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim()
    ?? 'VeilCircle-Preview-Deploy-PrivateState';

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        {
          shieldedSecretKeys: walletCtx.shieldedSecretKeys,
          dustSecretKey: walletCtx.dustSecretKey,
        },
        {
          ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000),
          tokenKindsToBalance: ['dust', 'unshielded'],
        },
      );
      const signedRecipe = await walletCtx.wallet.signRecipe(recipe, (payload: Uint8Array) =>
        walletCtx.unshieldedKeystore.signData(payload),
      );
      return walletCtx.wallet.finalizeRecipe(signedRecipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const zkConfigProvider = new NodeZkConfigProvider(managedPath);
  const accountId = walletCtx.getAddress().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'veilcircle-private-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

// ─── Main Deployment Function ─────────────────────────────────────────────────

async function main() {
  console.log('\n─── Step 1: Wallet Setup ───────────────────────────────────────\n');
  const seed = getOrCreateSeed();
  console.log('  Deriving wallet from seed...');

  const walletCtx = await createWallet(networkId, networkConfig, seed);
  const address = walletCtx.getAddress();
  console.log(`  Deployer Address : \x1b[32m${address}\x1b[0m`);

  console.log('\n─── Step 2: Unshielded Balance Sync ────────────────────────────\n');
  console.log(`  Connecting to Midnight Preview indexer...`);

  const { nativeToken } = await import('@midnight-ntwrk/ledger-v8');

  // Wait for unshielded wallet to sync with indexer
  const unshieldedState = await walletCtx.wallet.unshielded.waitForSyncedState();
  const balance = unshieldedState.balances[nativeToken().raw] ?? 0n;

  console.log(`  Wallet Address : ${address}`);
  console.log(`  tNIGHT Balance : ${balance.toLocaleString()} Specks (${Number(balance) / 1_000_000} tNIGHT)\n`);

  if (balance === 0n && networkId !== 'undeployed') {
    console.log('─── Step 3: Fund Wallet ────────────────────────────────────────\n');
    console.log('  ⚠️  Wallet has 0 tNIGHT. Please request test tokens:');
    console.log(`  👉 Faucet URL : \x1b[36m${networkConfig.faucet}\x1b[0m`);
    console.log(`  👉 Address    : \x1b[32m${address}\x1b[0m\n`);
    console.log('  Waiting for funding transaction (polling every 5s)...');

    const timeout = Number(process.env.MIDNIGHT_FAUCET_TIMEOUT_MS) || 600_000;
    const start = Date.now();
    while (true) {
      await new Promise((r) => setTimeout(r, 5_000));
      const s = await walletCtx.wallet.unshielded.waitForSyncedState();
      const bal = s.balances[nativeToken().raw] ?? 0n;
      if (bal > 0n) {
        console.log(`\n  ✅ Funded! tNIGHT: ${bal.toLocaleString()} Specks\n`);
        break;
      }
      if (Date.now() - start > timeout) {
        console.log('\n  ❌ Funding timeout (10 min). Please fund the wallet and retry.');
        await walletCtx.wallet.stop();
        process.exit(1);
      }
      process.stdout.write(`\r  Waiting for tokens to appear on-chain... (${Math.round((Date.now() - start) / 1000)}s)`);
    }
  } else {
    console.log('─── Step 3: Wallet Funds Confirmed ─────────────────────────────\n');
    console.log(`  ✅ tNIGHT balance available: ${balance.toLocaleString()} Specks\n`);
  }

  console.log('─── Step 4: DUST Setup & Generation ────────────────────────────\n');

  // Fetch state with availableCoins
  const currentState = await Rx.firstValueFrom(
    walletCtx.wallet.state().pipe(
      Rx.filter((s: any) => s.unshielded?.availableCoins !== undefined && s.unshielded.availableCoins.length > 0),
    ),
  );

  const unregistered = (currentState as any).unshielded?.availableCoins?.filter(
    (c: any) => !c.meta?.registeredForDustGeneration,
  ) ?? [];

  if (unregistered.length > 0) {
    console.log(`  Registering ${unregistered.length} tNIGHT UTXOs for DUST generation...`);
    try {
      const recipe = await walletCtx.wallet.registerNightUtxosForDustGeneration(
        unregistered,
        walletCtx.getPublicKeyBytes(),
        (payload: Uint8Array) => walletCtx.unshieldedKeystore.signData(payload),
      );
      const finalized = await walletCtx.wallet.finalizeRecipe(recipe);
      const regTxId = await walletCtx.wallet.submitTransaction(finalized);
      console.log(`  ✅ Registration transaction submitted: ${regTxId}\n`);
    } catch (e: any) {
      console.log(`  ℹ️  Registration info: ${e.message}\n`);
    }
  } else {
    console.log('  ✅ UTXOs already registered for DUST generation.\n');
  }

  // Check / wait for tDUST balance
  console.log('  ⏳ Checking for tDUST capacity to pay deployment fees...');
  let dustBal = 0n;
  try {
    const initialDustState = await Rx.firstValueFrom(walletCtx.wallet.dust.state);
    dustBal = initialDustState.balance(new Date());
  } catch {}

  if (dustBal === 0n) {
    console.log('  Syncing DUST ledger events from Preview indexer...');
    const startTime = Date.now();
    const DUST_SYNC_TIMEOUT = 900_000; // 15 min max
    while (dustBal === 0n && Date.now() - startTime < DUST_SYNC_TIMEOUT) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const s = await Rx.firstValueFrom(walletCtx.wallet.dust.state);
        dustBal = s.balance(new Date());
        if (dustBal > 0n) break;
        const applied = Number(s.progress?.appliedIndex ?? 0n);
        const highest = Number(s.progress?.highestRelevantWalletIndex ?? s.progress?.highestIndex ?? 255272n);
        const pct = highest > 0 ? ((applied / highest) * 100).toFixed(1) : '0';
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        process.stdout.write(`\r  ⏳ Syncing DUST events: ${applied.toLocaleString()} / ${highest.toLocaleString()} (${pct}%) — ${elapsed}s`);
      } catch {}
    }
    process.stdout.write('\n');
  }

  console.log(`  ✅ tDUST capacity ready: ${dustBal.toLocaleString()} Specks\n`);

  console.log('─── Step 5: Proof Server Verification ──────────────────────────\n');
  console.log(`  Connecting to Proof Server at ${networkConfig.proofServer}...`);
  const proofReady = await waitForProofServer();
  if (!proofReady) {
    console.log('\n  ❌ Proof server not responding at http://localhost:6300!');
    console.log('  Ensure Docker container is running:');
    console.log('  docker run -d -p 6300:6300 --name midnight-proof-server midnightnetwork/proof-server:latest\n');
    await walletCtx.wallet.stop();
    process.exit(1);
  }
  process.stdout.write('\r  ✅ Local Proof Server is healthy and ready!            \n\n');

  console.log('─── Step 6: Deploy VeilCircle Smart Contract ───────────────────\n');
  console.log('  Initializing Midnight SDK providers...');
  const providers = await createProviders(walletCtx);

  process.stdout.write('  Allowing state to settle (4s)...');
  await new Promise((r) => setTimeout(r, 4000));
  process.stdout.write(' done.\n\n');

  console.log('  Generating deployment Zero-Knowledge proof and submitting...');
  const MAX_RETRIES = 10;
  const RETRY_DELAY = 6_000;
  let deployed: Awaited<ReturnType<typeof deployContract>> | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      deployed = await deployContract(providers, {
        compiledContract: compiledContract as any,
        args: [],
      });
      break;
    } catch (err: any) {
      const msg = err?.message ?? '';
      const cause = err?.cause?.message ?? '';
      const full = `${msg} ${cause}`;

      const isDust = full.includes('Not enough Dust') || full.includes('Insufficient Funds') || full.includes('could not balance dust');
      const isNoProof = full.includes('ECONNREFUSED') || full.includes('Failed to connect to Proof Server');

      console.error(`  ⚠️  Attempt ${attempt}/${MAX_RETRIES}: ${msg}`);

      if (isNoProof) {
        console.log('  ❌ Proof server connection failed. Ensure Docker is running.\n');
        await walletCtx.wallet.stop();
        process.exit(1);
      }

      if (attempt < MAX_RETRIES) {
        console.log(`  🔄 Retrying in ${RETRY_DELAY / 1000}s... (attempt ${attempt}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
      } else {
        throw err;
      }
    }
  }

  if (!deployed) throw new Error('Deployment failed after all attempts.');

  const contractAddress = String(deployed.deployTxData.public.contractAddress);
  const txHash = String(deployed.deployTxData.public.txHash ?? deployed.deployTxData.public.contractAddress);

  console.log('\n================================================================');
  console.log('  🎉 VeilCircle Contract Successfully Deployed to Midnight!');
  console.log('================================================================\n');
  console.log(`  Contract Name    : VeilCircle`);
  console.log(`  Network          : ${networkId.toUpperCase()}`);
  console.log(`  Contract Address : \x1b[32m${contractAddress}\x1b[0m`);
  console.log(`  Deployer Address : ${address}`);
  console.log(`  Explorer Link    : \x1b[36m${networkConfig.explorer}/contract/${contractAddress}\x1b[0m\n`);

  // Save deployment artifacts
  const deploymentRecord = {
    contractName: 'VeilCircle',
    network: networkId,
    contractAddress,
    txHash,
    deployerAddress: String(address),
    deployedAt: new Date().toISOString(),
    circuits: [
      'createCircle',
      'registerCredentialCommitment',
      'proveAndJoinCircle',
      'isNullifierSpent'
    ],
    explorerUrl: `${networkConfig.explorer}/contract/${contractAddress}`,
  };

  // 1. Save in contract/deployments/
  const deploymentsDir = path.resolve(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });
  fs.writeFileSync(path.join(deploymentsDir, `${networkId}.json`), JSON.stringify(deploymentRecord, null, 2));

  // 2. Save root .midnight-contract.json
  const rootContractJson = path.resolve(__dirname, '..', '..', '.midnight-contract.json');
  fs.writeFileSync(rootContractJson, JSON.stringify(deploymentRecord, null, 2));

  // 3. Save frontend configuration
  const frontendConfigDir = path.resolve(__dirname, '..', '..', 'frontend', 'src', 'config');
  if (!fs.existsSync(frontendConfigDir)) fs.mkdirSync(frontendConfigDir, { recursive: true });
  fs.writeFileSync(
    path.join(frontendConfigDir, 'deployed-contract.json'),
    JSON.stringify(deploymentRecord, null, 2)
  );

  console.log('  ✔ Saved deployment record to:');
  console.log(`    • contract/deployments/${networkId}.json`);
  console.log(`    • .midnight-contract.json`);
  console.log(`    • frontend/src/config/deployed-contract.json\n`);

  await walletCtx.wallet.stop();
  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Fatal deployment error:', err);
  process.exit(1);
});
