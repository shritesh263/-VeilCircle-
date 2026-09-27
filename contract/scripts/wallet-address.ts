/**
 * scripts/wallet-address.ts
 *
 * Displays the deployer wallet address and instructions to request test funds from the faucet.
 *
 * Usage:
 *   npx tsx scripts/wallet-address.ts
 */

import { parseNetwork } from './network.js';
import { getOrCreateSeed, deriveDeployerAddress } from './wallet.js';

async function main() {
  const { networkId, config } = parseNetwork();
  const seed = getOrCreateSeed();

  console.log('\n================================================================');
  console.log('       VeilCircle Deployer Wallet Info (Midnight Preview)');
  console.log('================================================================\n');

  console.log(`Network         : ${networkId.toUpperCase()}`);
  console.log(`Seed File       : .veilcircle-wallet-state/seed.hex`);

  const address = await deriveDeployerAddress(networkId, seed);

  console.log('\n----------------------------------------------------------------');
  console.log(`Deployer Address (Bech32m): \x1b[32m${address}\x1b[0m`);
  console.log('----------------------------------------------------------------\n');
  console.log('Follow these steps to fund the deployer wallet:');
  console.log(`1. Open official faucet : \x1b[36m${config.faucet}\x1b[0m`);
  console.log(`2. Paste your address   : \x1b[32m${address}\x1b[0m`);
  console.log('3. Request tDUST tokens to sponsor contract deployment on Preview testnet.\n');
  console.log('After requesting from the faucet, run:');
  console.log('  \x1b[33mnpm run deploy\x1b[0m  (or: npx tsx scripts/deploy.ts)\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Error getting wallet address:', err);
  process.exit(1);
});
