#!/usr/bin/env ts-node
/**
 * Real Compact Contract Deployment Script for Midnight Network
 * 
 * Prerequisites:
 * 1. Funded wallet on Preprod/Preview testnet
 * 2. Environment variables set (WALLET_SEED, NETWORK)
 * 3. Compiled Compact contract in managed/ directory
 * 
 * Usage:
 *   NETWORK=preprod WALLET_SEED="your seed phrase" npm run deploy:real
 */

import { ContractDeploymentConfig, deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { providers, Wallet } from '@midnight-ntwrk/midnight-js-types';
import { createWalletFromSeed } from '@midnight-ntwrk/midnight-js-wallet';
import * as fs from 'fs';
import * as path from 'path';

// Network configurations
const NETWORKS = {
  preprod: {
    nodeUri: 'https://rpc.preprod.midnight.network',
    indexerUri: 'https://indexer.preprod.midnight.network/api/v1/graphql',
    proverServerUri: 'http://localhost:6300', // Local proof server
    faucetUri: 'https://faucet.preprod.midnight.network',
  },
  preview: {
    nodeUri: 'https://rpc.preview.midnight.network',
    indexerUri: 'https://indexer.preview.midnight.network/api/v1/graphql',
    proverServerUri: 'http://localhost:6300',
    faucetUri: 'https://faucet.preview.midnight.network',
  },
};

async function main() {
  console.log('=================================================');
  console.log(' VeilCircle Compact Contract Deployment');
  console.log('=================================================\n');

  // 1. Read environment configuration
  const network = (process.env.NETWORK || 'preprod') as keyof typeof NETWORKS;
  const walletSeed = process.env.WALLET_SEED;

  if (!walletSeed) {
    console.error('❌ Error: WALLET_SEED environment variable not set');
    console.log('\nUsage:');
    console.log('  NETWORK=preprod WALLET_SEED="your 12-24 word seed phrase" npm run deploy:real\n');
    process.exit(1);
  }

  if (!NETWORKS[network]) {
    console.error(`❌ Error: Invalid network "${network}". Must be "preprod" or "preview"`);
    process.exit(1);
  }

  const config = NETWORKS[network];
  console.log(`📡 Network: ${network.toUpperCase()}`);
  console.log(`🔗 Node: ${config.nodeUri}`);
  console.log(`🔍 Indexer: ${config.indexerUri}\n`);

  // 2. Initialize wallet
  console.log('🔑 Initializing wallet...');
  const wallet = await createWalletFromSeed(walletSeed, {
    nodeUri: config.nodeUri,
    indexerUri: config.indexerUri,
  });

  const shieldedAddress = await wallet.getShieldedAddress();
  const dustBalance = await wallet.getDustBalance();
  
  console.log(`   Address: ${shieldedAddress}`);
  console.log(`   Balance: ${dustBalance / 1_000_000} DUST\n`);

  if (dustBalance < 1_000_000) {
    console.error('❌ Insufficient DUST balance (need at least 1 DUST)');
    console.log(`💧 Get testnet DUST from: ${config.faucetUri}`);
    process.exit(1);
  }

  // 3. Load compiled contract
  console.log('📦 Loading compiled Compact contract...');
  const contractPath = path.join(__dirname, '..', 'src', 'managed', 'veilcircle');
  
  if (!fs.existsSync(contractPath)) {
    console.error('❌ Compiled contract not found. Run: npm run compact:compile');
    process.exit(1);
  }

  // Read contract bytecode and circuits
  const circuitsFile = path.join(contractPath, 'circuits.json');
  if (!fs.existsSync(circuitsFile)) {
    console.error('❌ circuits.json not found. Ensure contract is compiled.');
    process.exit(1);
  }

  const circuits = JSON.parse(fs.readFileSync(circuitsFile, 'utf-8'));
  console.log(`   ✓ Found ${Object.keys(circuits).length} circuits`);

  // 4. Deploy contract
  console.log('\n🚀 Deploying contract to Midnight Network...');
  console.log('   (This may take 30-60 seconds...)\n');

  try {
    // Deploy using Midnight JS SDK
    const deploymentConfig: ContractDeploymentConfig = {
      wallet,
      contractBytecode: circuits, // This should be the actual compiled bytecode
      initialState: {}, // Add initial state if needed
      proverServerUri: config.proverServerUri,
    };

    // NOTE: This is pseudocode - actual deployment depends on your Midnight SDK version
    // Adjust based on @midnight-ntwrk/midnight-js-contracts API
    const deploymentResult = await deployContract(deploymentConfig);

    const contractAddress = deploymentResult.contractAddress;
    const txHash = deploymentResult.transactionHash;
    const blockHeight = deploymentResult.blockHeight;

    console.log('✅ Contract deployed successfully!\n');
    console.log('Deployment Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Contract Address: ${contractAddress}`);
    console.log(`🔗 Transaction Hash: ${txHash}`);
    console.log(`📦 Block Height: ${blockHeight}`);
    console.log(`🔍 Explorer: https://explorer.${network}.midnight.network/contracts/${contractAddress}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 5. Save deployment artifact
    const deploymentArtifact = {
      network,
      contractAddress,
      contractName: 'VeilCircle',
      deployedAt: new Date().toISOString(),
      transactionHash: txHash,
      blockHeight,
      deployerAddress: shieldedAddress,
      circuits: Object.keys(circuits),
      explorerUrl: `https://explorer.${network}.midnight.network/contracts/${contractAddress}`,
    };

    const outDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, `${network}.json`);
    fs.writeFileSync(outFile, JSON.stringify(deploymentArtifact, null, 2));

    console.log(`💾 Deployment record saved: deployments/${network}.json`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Verify contract on explorer');
    console.log('   2. Update frontend/src/services/midnight.ts with contract address');
    console.log('   3. Update CONTRACT_ADDRESSES.md with deployment details');
    console.log('\n=================================================');

  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  • Ensure wallet has sufficient DUST balance');
    console.error('  • Verify network endpoints are accessible');
    console.error('  • Check proof server is running on port 6300');
    console.error('  • Ensure contract is properly compiled\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
