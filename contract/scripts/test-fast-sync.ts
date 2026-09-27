import { createWallet } from './wallet.js';
import { NETWORKS } from './network.js';
import { getOrCreateSeed } from './wallet.js';
import * as Rx from 'rxjs';

async function main() {
  const network = NETWORKS.preview;
  const seed = getOrCreateSeed();

  console.log('Starting wallet...');
  const walletCtx = await createWallet(network.networkId, network, seed);

  console.log('Waiting for unshielded sync...');
  const uState = await walletCtx.wallet.unshielded.waitForSyncedState();
  console.log('Unshielded coins:', uState.availableCoins.length);
  for (const c of uState.availableCoins) {
    console.log('  UTXO:', c.utxo.value, 'registeredForDust:', c.meta?.registeredForDustGeneration);
  }

  console.log('Watching Dust sync...');
  const startTime = Date.now();
  const sub = walletCtx.wallet.dust.state.subscribe({
    next: (s) => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const applied = s.progress?.appliedIndex?.toString() ?? '0';
      const highest = s.progress?.highestIndex?.toString() ?? '0';
      const bal = s.balance(new Date());
      console.log(`[${elapsed}s] applied=${applied}/${highest}, coins=${s.totalCoins.length}, bal=${bal}`);
      if (bal > 0n) {
        console.log('🎉 DUST AVAILABLE:', bal.toString(), 'Specks!');
        sub.unsubscribe();
        walletCtx.wallet.stop().then(() => process.exit(0));
      }
    },
    error: (e) => console.error('Dust err:', e),
  });
}

main().catch(console.error);
