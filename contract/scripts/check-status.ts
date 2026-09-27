import { createWallet } from './wallet.js';
import { NETWORKS } from './network.js';
import * as Rx from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const seedFile = path.resolve(process.cwd(), '.veilcircle-wallet-state', 'seed.hex');
  const seedHex = fs.readFileSync(seedFile, 'utf-8').trim();
  const network = NETWORKS.preview;

  console.log('Starting wallet check on preview...');
  const walletCtx = await createWallet(network.networkId, network, seedHex);

  const unshieldedState = await Rx.firstValueFrom(walletCtx.wallet.unshielded.state);
  console.log('Unshielded coins count:', unshieldedState.availableCoins.length);
  for (const c of unshieldedState.availableCoins) {
    console.log('  Coin value:', c.utxo.value, 'registeredForDust:', c.meta?.registeredForDustGeneration);
  }

  const dustState = await Rx.firstValueFrom(walletCtx.wallet.dust.state);
  console.log('Dust totalCoins count:', dustState.totalCoins.length);
  console.log('Dust availableCoins count:', dustState.availableCoins.length);
  console.log('Dust balance now:', dustState.balance(new Date()));
  console.log('Dust progress:', dustState.progress);

  await walletCtx.wallet.stop();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
