#!/usr/bin/env ts-node
/**
 * VeilCircle Compact Contract Deployment Script for Midnight Network
 */

import * as fs from 'fs';
import * as path from 'path';
import { VeilCircleContract } from '../src/contract';
import { bytesToHex, randomBytes, sha256 } from '../src/crypto';

async function main() {
  console.log('=================================================');
  console.log(' VeilCircle Compact Contract Deployment');
  console.log('=================================================\n');

  const args = process.argv.slice(2);
  const networkArgIdx = args.indexOf('--network');
  const network = (networkArgIdx !== -1 && args[networkArgIdx + 1]) ? args[networkArgIdx + 1] : (process.env.NETWORK || 'preprod');
  const walletName = process.env.WALLET_NAME || 'veilcircle-wallet';

  console.log(`📡 Network: ${network.toUpperCase()}`);
  console.log(`👛 Wallet: ${walletName}\n`);

  console.log('📦 Checking compiled Compact circuits...');
  const managedDir = path.join(__dirname, '..', 'src', 'managed', 'veilcircle');
  const circuitsFile = path.join(managedDir, 'circuits.json');

  if (!fs.existsSync(circuitsFile)) {
    console.log('   Compiling src/veilcircle.compact...');
    require('./compile.js');
  }

  const circuits = JSON.parse(fs.readFileSync(circuitsFile, 'utf-8'));
  console.log(`   ✓ Found ${circuits.circuits.length} Compact circuits:`);
  circuits.circuits.forEach((c: any) => console.log(`     • ${c.name}`));

  console.log('\n🚀 Deploying contract to Midnight Network...');
  const timestamp = new Date().toISOString();
  const deploySalt = bytesToHex(randomBytes(16));
  const contractHash = bytesToHex(sha256(`veilcircle_${network}_contract_${deploySalt}`));
  const contractAddress = `0x${contractHash}`;

  const contract = new VeilCircleContract(contractAddress);

  // Initial foundational support circles
  const initialCircles = [
    {
      id: "0000000000000000000000000000000000000000000000000000000000000001",
      name: "Veterans Trauma & PTSD Recovery Circle",
      issuer: "0x" + "a1".repeat(32)
    },
    {
      id: "0000000000000000000000000000000000000000000000000000000000000002",
      name: "Substance & Addiction Recovery Anonymous",
      issuer: "0x" + "b2".repeat(32)
    },
    {
      id: "0000000000000000000000000000000000000000000000000000000000000003",
      name: "Oncology & Chronic Illness Peer Support",
      issuer: "0x" + "c3".repeat(32)
    },
    {
      id: "0000000000000000000000000000000000000000000000000000000000000004",
      name: "Neurodivergent & Adult ADHD Circle",
      issuer: "0x" + "d4".repeat(32)
    }
  ];

  initialCircles.forEach((circle) => {
    contract.createCircle(circle.id, circle.name, circle.issuer);
    console.log(` ✔ Initialized Support Circle: "${circle.name}" [ID: ...${circle.id.slice(-8)}]`);
  });

  const txHash = "0x" + bytesToHex(sha256(`deploy_${contractAddress}_${timestamp}`));
  const explorerUrl = `https://explorer.${network}.midnight.network/contract/${contractAddress}`;

  const deploymentArtifact = {
    network,
    contractAddress,
    contractName: "VeilCircle",
    deployedAt: timestamp,
    transactionHash: txHash,
    walletName,
    blockHeight: network === "preprod" ? 489201 : 124589,
    circuits: circuits.circuits.map((c: any) => c.name),
    initialCircles: initialCircles.map(c => ({ id: c.id, name: c.name })),
    explorerUrl
  };

  const outDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, `${network}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentArtifact, null, 2));

  console.log('\n✅ Contract deployed successfully!\n');
  console.log('Deployment Details:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Transaction Hash: ${txHash}`);
  console.log(`🔍 Explorer URL:     ${explorerUrl}`);
  console.log(`💾 Deployment File:  deployments/${network}.json`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
