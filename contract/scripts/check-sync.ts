import { parseNetwork } from './network.js';
import { getOrCreateSeed, createWallet } from './wallet.js';
import { WebSocket } from 'ws';
import { nativeToken } from '@midnight-ntwrk/ledger-v8';

// @ts-expect-error WebSocket polyfill
globalThis.WebSocket = WebSocket;

async function main() {
  const { networkId, config } = parseNetwork();
  const seed = getOrCreateSeed();

  console.log('Connecting to Preview wallet...');
  const walletCtx = await createWallet(networkId, config, seed);
  const address = walletCtx.getAddress();
  console.log('Address:', address);

  // Subscribe to wallet state stream
  let count = 0;
  const sub = walletCtx.wallet.state().subscribe((state) => {
    count++;
    const unshieldedBal = state.unshielded?.balances?.[nativeToken().raw] ?? 0n;
    const dustBal = state.dust?.balance?.(new Date()) ?? 0n;
    const isSynced = state.isSynced;
    const availableCoins = state.unshielded?.availableCoins?.length ?? 0;
    console.log(`[Update #${count}] isSynced: ${isSynced}, unshielded tNIGHT: ${unshieldedBal}, available coins: ${availableCoins}, tDUST: ${dustBal}`);
  });

  // Wait 20 seconds to see updates
  await new Promise((r) => setTimeout(r, 20000));
  sub.unsubscribe();
  await walletCtx.wallet.stop();
  process.exit(0);
}

main().catch(console.error);
