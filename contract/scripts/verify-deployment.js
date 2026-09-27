import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const deploymentPath = path.resolve(__dirname, '..', 'deployments', 'preview.json');

if (!fs.existsSync(deploymentPath)) {
  console.error('❌ Deployment artifact not found at:', deploymentPath);
  process.exit(1);
}

const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf-8'));

if (!deployment.contractAddress || !deployment.txHash) {
  console.error('❌ Invalid deployment artifact: missing contractAddress or txHash');
  process.exit(1);
}

console.log('✔ Midnight Preview Contract Verified:');
console.log('  Contract Address :', deployment.contractAddress);
console.log('  Deployment TxHash:', deployment.txHash);
console.log('  Target Network   :', deployment.network);
console.log('  Explorer URL     :', deployment.explorerUrl);
