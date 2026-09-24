# VeilCircle Compact Contract Deployment Guide

## 🎯 Overview

This guide walks you through deploying the VeilCircle Compact smart contract to Midnight Network's Preprod or Preview testnets.

---

## 📋 Prerequisites

### 1. Install Midnight SDK and Tools

```bash
# Install Midnight CLI (requires Python/uv)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install midnight-cli

# Verify installation
midnight-cli --version
```

### 2. Create a Wallet

```bash
# Generate a new wallet
midnight-cli wallet create --network preprod

# OR import existing wallet
midnight-cli wallet import --seed "your 12-24 word seed phrase"

# Get your wallet address
midnight-cli wallet address
```

### 3. Fund Your Wallet

Visit the testnet faucet and request tokens:

#### Preprod Testnet
- **Faucet**: https://faucet.preprod.midnight.network
- Enter your wallet address
- Request **10 DUST** (minimum for deployment)
- Wait ~30 seconds for confirmation

#### Preview Testnet
- **Faucet**: https://faucet.preview.midnight.network
- Same process as Preprod

**Verify balance**:
```bash
midnight-cli wallet balance --network preprod
```

---

## 🏗️ Deployment Methods

### Method 1: Using Midnight CLI (Recommended)

#### Step 1: Compile the Contract

```bash
cd contract
npm install
npm run compact:compile
```

**Expected Output**:
```
✔ Compiled 4 circuits successfully:
  - createCircle
  - registerCredentialCommitment
  - proveAndJoinCircle
  - isNullifierSpent
✔ Generated managed/ directory
```

#### Step 2: Deploy to Preprod

```bash
# Set environment variables
export MIDNIGHT_NETWORK=preprod
export DEPLOYER_PRIVATE_KEY=<your_private_key>

# Deploy
midnight-cli contract deploy \
  --compiled ./src/managed/veilcircle \
  --network preprod \
  --wait-for-confirmation
```

#### Step 3: Verify Deployment

```bash
# Get contract info
midnight-cli contract info \
  --address <deployed_contract_address> \
  --network preprod
```

**Example Output**:
```
Contract Address: mn_contract_preprod1abc123...xyz789
Status: Active
Circuits: 4
Block Height: 489250
Transaction: 0xabcdef...
```

#### Step 4: Test Contract Call

```bash
# Call a circuit (example)
midnight-cli contract call \
  --address <contract_address> \
  --circuit isNullifierSpent \
  --args '{"nullifier": "0x0000000000000000000000000000000000000000000000000000000000000001"}' \
  --network preprod
```

---

### Method 2: Using TypeScript Deployment Script

#### Step 1: Install Dependencies

```bash
cd contract
npm install @midnight-ntwrk/midnight-js-contracts
npm install @midnight-ntwrk/midnight-js-types
npm install @midnight-ntwrk/midnight-js-wallet
```

#### Step 2: Set Environment Variables

```bash
# Linux/Mac
export NETWORK=preprod
export WALLET_SEED="your twelve word seed phrase here for wallet access"

# Windows (PowerShell)
$env:NETWORK="preprod"
$env:WALLET_SEED="your twelve word seed phrase here for wallet access"

# Windows (CMD)
set NETWORK=preprod
set WALLET_SEED=your twelve word seed phrase here for wallet access
```

#### Step 3: Run Deployment Script

```bash
npm run deploy:real
```

**Expected Output**:
```
=================================================
 VeilCircle Compact Contract Deployment
=================================================

📡 Network: PREPROD
🔗 Node: https://rpc.preprod.midnight.network
🔍 Indexer: https://indexer.preprod.midnight.network/api/v1/graphql

🔑 Initializing wallet...
   Address: mn_addr_preprod1abc...xyz
   Balance: 10.0 DUST

📦 Loading compiled Compact contract...
   ✓ Found 4 circuits

🚀 Deploying contract to Midnight Network...
   (This may take 30-60 seconds...)

✅ Contract deployed successfully!

Deployment Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Contract Address: mn_contract_preprod1abc123def456...
🔗 Transaction Hash: 0xabcdef1234567890...
📦 Block Height: 489250
🔍 Explorer: https://explorer.preprod.midnight.network/contracts/...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Deployment record saved: deployments/preprod.json
```

---

### Method 3: Manual Deployment (Advanced)

If you want full control, deploy manually using the Midnight SDK:

```typescript
// deploy-manual.ts
import { WalletManager } from '@midnight-ntwrk/midnight-js-wallet';
import { ContractManager } from '@midnight-ntwrk/midnight-js-contracts';

async function deploy() {
  // 1. Initialize wallet
  const wallet = await WalletManager.fromSeed(process.env.WALLET_SEED!, {
    network: 'preprod',
  });

  // 2. Load compiled contract
  const contractBytecode = await fs.readFile('./src/managed/veilcircle/contract.wasm');
  
  // 3. Deploy
  const contractManager = new ContractManager(wallet);
  const deployment = await contractManager.deploy({
    bytecode: contractBytecode,
    initialState: {},
  });

  console.log('Contract Address:', deployment.address);
}

deploy();
```

---

## 📍 After Deployment: Update Your Code

### 1. Update Contract Configuration

Edit **`frontend/src/services/midnight.ts`**:

```typescript
export const NETWORKS: Record<string, NetworkConfig> = {
  preprod: {
    name: "preprod",
    label: "Midnight Preprod Testnet",
    contractAddress: "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE", // ← Update this
    indexerUrl: "https://indexer.preprod.midnight.network/api/v1/graphql",
    nodeUrl: "https://rpc.preprod.midnight.network",
    explorerUrl: "https://explorer.preprod.midnight.network"
  },
  // ...
};
```

### 2. Update Deployment Records

Edit **`contract/deployments/preprod.json`**:

```json
{
  "network": "preprod",
  "contractAddress": "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
  "contractName": "VeilCircle",
  "deployedAt": "2026-09-11T...",
  "transactionHash": "0x...",
  "blockHeight": 489250,
  "explorerUrl": "https://explorer.preprod.midnight.network/contracts/YOUR_ADDRESS"
}
```

### 3. Update README.md

```markdown
| 🛡️ **Midnight Preprod Contract** | `YOUR_DEPLOYED_CONTRACT_ADDRESS` | ...
```

### 4. Rebuild Frontend

```bash
cd frontend
npm run build
```

---

## 🔍 Verifying Your Deployment

### Using Midnight Explorer

1. **Navigate to Explorer**:
   ```
   https://explorer.preprod.midnight.network/contracts/YOUR_CONTRACT_ADDRESS
   ```

2. **Verify Information**:
   - ✅ Contract address matches
   - ✅ Status shows "Active"
   - ✅ Circuits are listed
   - ✅ Deployment transaction visible

### Using CLI

```bash
# Get contract details
midnight-cli contract info \
  --address YOUR_CONTRACT_ADDRESS \
  --network preprod

# View contract state
midnight-cli contract state \
  --address YOUR_CONTRACT_ADDRESS \
  --network preprod

# List contract circuits
midnight-cli contract circuits \
  --address YOUR_CONTRACT_ADDRESS \
  --network preprod
```

### Using Frontend

1. Start dev server: `npm run dev`
2. Connect wallet (Lace or 1AM)
3. Try joining a circle
4. Check transaction on explorer
5. Verify nullifier recorded

---

## 🚨 Troubleshooting

### Issue: "Insufficient DUST balance"

**Cause**: Wallet doesn't have enough tokens for deployment

**Solution**:
```bash
# Check balance
midnight-cli wallet balance --network preprod

# If low, request more from faucet
# Visit: https://faucet.preprod.midnight.network
# Request 10 DUST (deployment typically needs 1-2 DUST)
```

---

### Issue: "Contract compilation failed"

**Cause**: Compact source has syntax errors

**Solution**:
```bash
# Check Compact syntax
cd contract
npm run compact:check

# View compilation errors
npm run compact:compile 2>&1 | tee compile.log

# Common fixes:
# - Check circuit signatures
# - Verify type annotations
# - Ensure all imports are correct
```

---

### Issue: "Network timeout" during deployment

**Cause**: RPC endpoint is slow or unreachable

**Solution**:
```bash
# Test network connectivity
curl https://rpc.preprod.midnight.network

# Try alternative endpoint (if available)
export MIDNIGHT_NODE_URI=https://rpc.preprod.midnight.network:443

# Increase timeout in deployment script
# Add: { timeout: 120000 } to deployment config
```

---

### Issue: "Proof server not running"

**Cause**: Local proof server on port 6300 is not started

**Solution**:
```bash
# Start proof server
midnight-cli proof-server start

# Verify it's running
curl http://localhost:6300/health

# Expected response:
# {"status": "healthy"}
```

---

### Issue: "Contract not found on explorer"

**Cause**: Transaction not yet confirmed on blockchain

**Solution**:
```bash
# Wait 30-60 seconds for blockchain confirmation

# Check transaction status
midnight-cli transaction status \
  --hash YOUR_TX_HASH \
  --network preprod

# If still not found after 5 minutes:
# - Check you're looking at correct network (preprod vs preview)
# - Verify contract address format
# - Ensure deployment actually succeeded (check script output)
```

---

## 📊 Deployment Checklist

Before marking deployment as complete:

- [ ] ✅ Contract compiled successfully (`npm run compact:compile`)
- [ ] ✅ Wallet funded with sufficient DUST (10+ recommended)
- [ ] ✅ Contract deployed to Preprod network
- [ ] ✅ Contract address starts with `mn_contract_preprod1`
- [ ] ✅ Contract visible on Midnight Explorer
- [ ] ✅ Deployment transaction confirmed
- [ ] ✅ All 4 circuits available on-chain
- [ ] ✅ `frontend/src/services/midnight.ts` updated
- [ ] ✅ `contract/deployments/preprod.json` updated
- [ ] ✅ `README.md` updated with contract address
- [ ] ✅ Frontend rebuilt (`npm run build`)
- [ ] ✅ Test circuit call succeeds
- [ ] ✅ Can join circle from frontend
- [ ] ✅ Nullifier recorded on explorer

**Optional (for Preview network):**
- [ ] ✅ Deploy to Preview network
- [ ] ✅ Update Preview configuration files
- [ ] ✅ Test on Preview network

---

## 🔐 Security Best Practices

### Wallet Security

1. **Never commit private keys** to version control
2. Use environment variables for sensitive data
3. Store seed phrases securely (password manager)
4. Use different wallets for testnet vs mainnet
5. Limit testnet wallet to minimum required DUST

### Deployment Security

1. **Test thoroughly on Preprod** before Preview
2. **Verify contract bytecode** matches source
3. **Document deployment parameters**
4. **Keep deployment records** in secure location
5. **Monitor contract** for unexpected activity

### Code Security

1. **Audit Compact contract** before deployment
2. **Test all circuits** with various inputs
3. **Verify ZK proofs** work as expected
4. **Check nullifier uniqueness** enforcement
5. **Review access controls** on circuits

---

## 📚 Additional Resources

### Midnight Network Documentation
- **Main Docs**: https://docs.midnight.network
- **Compact Guide**: https://docs.midnight.network/language/compact
- **Deployment Tutorial**: https://docs.midnight.network/guides/deploy-and-operate
- **CLI Reference**: https://docs.midnight.network/tools/midnight-cli

### Network Information
- **Preprod Explorer**: https://explorer.preprod.midnight.network
- **Preview Explorer**: https://explorer.preview.midnight.network
- **Network Status**: https://status.midnight.network
- **Faucet (Preprod)**: https://faucet.preprod.midnight.network
- **Faucet (Preview)**: https://faucet.preview.midnight.network

### Community Support
- **Midnight Discord**: https://discord.gg/midnight
- **GitHub Issues**: https://github.com/midnight-network
- **Developer Forum**: https://forum.midnight.network

---

## 🎉 Success!

Once deployment is complete and verified:

1. ✅ Your contract is live on Midnight Network
2. ✅ Users can interact through your frontend
3. ✅ ZK proofs are generated and verified on-chain
4. ✅ All transactions visible on block explorer

**Next Steps**:
- Test all contract circuits thoroughly
- Monitor gas usage and performance
- Gather user feedback
- Plan for mainnet deployment

---

**Last Updated**: 2026-09-11  
**Midnight Network**: Preprod/Preview Testnets  
**Contract Standard**: Compact v0.19  
**Deployment Cost**: ~1-2 DUST
