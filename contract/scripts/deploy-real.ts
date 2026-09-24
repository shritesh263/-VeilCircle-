#!/usr/bin/env ts-node
/**
 * Real Compact Contract Deployment Script for Midnight Network
 * 
 * This script uses Midnight CLI for deployment (no SDK dependencies needed)
 * 
 * Prerequisites:
 * 1. Midnight CLI installed: uv tool install @midnight-ntwrk/midnight-cli
 * 2. Funded wallet on Preprod/Preview testnet
 * 3. Compiled Compact contract in managed/ directory
 * 
 * Usage:
 *   NETWORK=preprod npm run deploy:real
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('=================================================');
  console.log(' VeilCircle Compact Contract Deployment');
  console.log('=================================================\n');

  // 1. Read environment configuration
  const network = (process.env.NETWORK || 'preprod') as 'preprod' | 'preview';
  const walletName = process.env.WALLET_NAME || 'veilcircle-wallet';

  console.log(`📡 Network: ${network.toUpperCase()}`);
  console.log(`👛 Wallet: ${walletName}\n`);

  // 2. Check Midnight CLI is installed
  console.log('🔍 Checking Midnight CLI installation...');
  try {
    execSync('midnight-cli --version', { stdio: 'pipe' });
    console.log('   ✓ Midnight CLI is installed\n');
  } catch (error) {
    console.error('❌ Midnight CLI not found. Install it with:');
    console.log('   curl -LsSf https://astral.sh/uv/install.sh | sh');
    console.log('   uv tool install @midnight-ntwrk/midnight-cli\n');
    process.exit(1);
  }

  // 3. Check compiled contract exists
  console.log('📦 Checking compiled contract...');
  const contractPath = path.join(__dirname, '..', 'src', 'managed', 'veilcircle');
  
  if (!fs.existsSync(contractPath)) {
    console.error('❌ Compiled contract not found. Run: npm run compact:compile');
    process.exit(1);
  }

  const circuitsFile = path.join(contractPath, 'circuits.json');
  if (!fs.existsSync(circuitsFile)) {
    console.error('❌ circuits.json not found. Ensure contract is compiled.');
    process.exit(1);
  }

  const circuits = JSON.parse(fs.readFileSync(circuitsFile, 'utf-8'));
  console.log(`   ✓ Found ${Object.keys(circuits).length} circuits\n`);

  // 4. Check wallet exists
  console.log(`🔑 Checking wallet: ${walletName}...`);
  try {
    const walletAddress = execSync(`midnight-cli wallet address --wallet ${walletName}`, { 
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
    console.log(`   ✓ Wallet found: ${walletAddress}\n`);
  } catch (error) {
    console.error(`❌ Wallet "${walletName}" not found.`);
    console.log('\nCreate wallet with:');
    console.log(`   midnight-cli wallet create --name ${walletName}`);
    console.log('\nOr use existing wallet:');
    console.log(`   WALLET_NAME=my-wallet npm run deploy:real\n`);
    process.exit(1);
  }

  // 5. Check wallet balance
  console.log('💰 Checking wallet balance...');
  try {
    const balance = execSync(`midnight-cli wallet balance --wallet ${walletName} --network ${network}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
    console.log(`   Balance: ${balance}`);
    
    // Parse balance (expecting format like "10.5 DUST")
    const balanceMatch = balance.match(/(\d+\.?\d*)/);
    if (balanceMatch && parseFloat(balanceMatch[1]) < 1) {
      console.error('\n❌ Insufficient balance (need at least 1 DUST)');
      console.log(`💧 Get testnet DUST from: https://faucet.${network}.midnight.network\n`);
      process.exit(1);
    }
    console.log('   ✓ Sufficient balance\n');
  } catch (error) {
    console.warn('   ⚠️  Could not check balance, continuing anyway...\n');
  }

  // 6. Deploy contract
  console.log('🚀 Deploying contract to Midnight Network...');
  console.log('   (This may take 30-60 seconds...)\n');

  try {
    const deployOutput = execSync(
      `midnight-cli contract deploy --contract ${contractPath} --network ${network} --wallet ${walletName} --wait-for-confirmation`,
      { 
        encoding: 'utf-8',
        stdio: 'pipe'
      }
    );

    console.log(deployOutput);

    // Parse contract address from output
    const addressMatch = deployOutput.match(/Contract Address:\s*([a-z0-9_]+)/i) || 
                        deployOutput.match(/Deployed to:\s*([a-z0-9_]+)/i) ||
                        deployOutput.match(/Address:\s*([a-z0-9_]+)/i);
    
    const contractAddress = addressMatch ? addressMatch[1] : 'CHECK_LOGS_FOR_ADDRESS';

    // Parse transaction hash from output
    const txMatch = deployOutput.match(/Transaction Hash:\s*(0x[a-f0-9]+)/i) ||
                    deployOutput.match(/Tx Hash:\s*(0x[a-f0-9]+)/i);
    
    const txHash = txMatch ? txMatch[1] : '0x...';

    console.log('\n✅ Contract deployed successfully!\n');
    console.log('Deployment Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Contract Address: ${contractAddress}`);
    console.log(`🔗 Transaction Hash: ${txHash}`);
    console.log(`🔍 Explorer: https://explorer.${network}.midnight.network/contracts/${contractAddress}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 7. Save deployment artifact
    const deploymentArtifact = {
      network,
      contractAddress,
      contractName: 'VeilCircle',
      deployedAt: new Date().toISOString(),
      transactionHash: txHash,
      walletName,
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
    console.log('   1. Verify contract on explorer (link above)');
    console.log('   2. Update frontend/src/services/midnight.ts with contract address:');
    console.log(`      contractAddress: "${contractAddress}"`);
    console.log('   3. Update CONTRACT_ADDRESSES.md with deployment details');
    console.log('   4. Rebuild frontend: cd ../frontend && npm run build');
    console.log('\n=================================================');

  } catch (error: any) {
    console.error('\n❌ Deployment failed!');
    console.error('Error:', error.message);
    
    if (error.stdout) {
      console.error('\nOutput:', error.stdout.toString());
    }
    if (error.stderr) {
      console.error('\nError details:', error.stderr.toString());
    }
    
    console.error('\n🔧 Troubleshooting:');
    console.error('  • Ensure wallet has sufficient DUST balance');
    console.error('  • Verify network endpoints are accessible');
    console.error('  • Check contract is properly compiled');
    console.error('  • Try again with: npm run deploy:real\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
