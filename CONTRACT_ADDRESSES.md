# VeilCircle Contract Addresses

## ⚠️ Important Notice

The contract addresses in this repository use **placeholder/example addresses** in the proper Midnight Network format. 

**Before deploying to production or testing on testnets, you MUST:**

1. Deploy your own contract instances to Midnight Preprod/Preview networks
2. Update all contract address references throughout the codebase
3. Verify your deployed contracts on the Midnight Explorer

---

## Current Placeholder Addresses

### Preprod Testnet
```
mn_contract_preprod1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpzs0ku
```
**Explorer**: https://explorer.preprod.midnight.network/contracts/mn_contract_preprod1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpzs0ku

### Preview Testnet
```
mn_contract_preview1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlhvjal
```
**Explorer**: https://explorer.preview.midnight.network/contracts/mn_contract_preview1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlhvjal

---

## How to Deploy Your Own Contract

### Prerequisites
1. Install dependencies:
   ```bash
   cd contract
   npm install
   ```

2. Fund your wallet with testnet DUST tokens:
   - **Preprod**: https://faucet.preprod.midnight.network
   - **Preview**: https://faucet.preview.midnight.network

### Deployment Steps

#### 1. Compile the Contract
```bash
cd contract
npm run compact:compile
```

#### 2. Deploy to Preprod
```bash
export MIDNIGHT_NETWORK=preprod
export DEPLOYER_PRIVATE_KEY=<your_private_key>
npm run deploy
```

#### 3. Deploy to Preview
```bash
export MIDNIGHT_NETWORK=preview
export DEPLOYER_PRIVATE_KEY=<your_private_key>
npm run deploy
```

### Deployment Output
After successful deployment, you'll receive:
- Contract address (e.g., `mn_contract_preprod1...`)
- Transaction hash
- Explorer URL

The deployment script automatically saves this information to:
- `contract/deployments/preprod.json`
- `contract/deployments/preview.json`

---

## Updating Contract References

After deploying your contracts, update these files with your real contract addresses:

### Core Configuration
1. **`frontend/src/services/midnight.ts`**
   ```typescript
   export const NETWORKS: Record<string, NetworkConfig> = {
     preprod: {
       contractAddress: "YOUR_PREPROD_CONTRACT_ADDRESS",
       // ...
     },
     preview: {
       contractAddress: "YOUR_PREVIEW_CONTRACT_ADDRESS",
       // ...
     }
   };
   ```

2. **`contract/deployments/preprod.json`**
   ```json
   {
     "contractAddress": "YOUR_PREPROD_CONTRACT_ADDRESS",
     "explorerUrl": "https://explorer.preprod.midnight.network/contracts/YOUR_PREPROD_CONTRACT_ADDRESS"
   }
   ```

3. **`contract/deployments/preview.json`**
   ```json
   {
     "contractAddress": "YOUR_PREVIEW_CONTRACT_ADDRESS",
     "explorerUrl": "https://explorer.preview.midnight.network/contracts/YOUR_PREVIEW_CONTRACT_ADDRESS"
   }
   ```

### Documentation Files
4. **`README.md`** (line ~19-20)
5. **`frontend/src/services/mockData.ts`** (for demo circles)

---

## Midnight Contract Address Format

Valid Midnight contract addresses follow this format:

### Preprod Network
```
mn_contract_preprod1<bech32_encoded_data>
```

### Preview Network
```
mn_contract_preview1<bech32_encoded_data>
```

### Mainnet (Future)
```
mn_contract1<bech32_encoded_data>
```

**Key Components**:
- Prefix: `mn_contract_` (Midnight contract identifier)
- Network: `preprod1`, `preview1`, or empty for mainnet
- Data: Bech32-encoded contract identifier (52 characters)

---

## Verifying Your Contract

After deployment, verify your contract is live:

### 1. Using Midnight Explorer
```
https://explorer.preprod.midnight.network/contracts/<YOUR_CONTRACT_ADDRESS>
```

**Expected Information**:
- Contract address
- Deployment transaction
- Public state
- Available circuits
- Transaction history

### 2. Using Midnight CLI (Optional)
```bash
midnight-cli contract info \
  --contract-address <YOUR_CONTRACT_ADDRESS> \
  --network preprod
```

### 3. Testing Contract Calls
```bash
cd frontend
npm run dev
```

1. Connect your wallet (Lace or 1AM)
2. Try joining a circle (triggers `proveAndJoinCircle` circuit)
3. Check transaction on explorer
4. Verify nullifier was recorded on-chain

---

## Common Issues

### Issue: "Contract not found" error
**Cause**: Using placeholder address instead of real deployed contract

**Solution**:
1. Deploy your contract: `cd contract && npm run deploy`
2. Copy the contract address from output
3. Update `frontend/src/services/midnight.ts`
4. Restart dev server

### Issue: "Insufficient DUST" during deployment
**Cause**: Wallet doesn't have enough testnet tokens

**Solution**:
1. Visit https://faucet.preprod.midnight.network
2. Enter your wallet address
3. Request testnet DUST tokens
4. Wait for confirmation (~30 seconds)
5. Retry deployment

### Issue: Contract address format error
**Cause**: Invalid address format

**Solution**:
Ensure address follows format:
- Starts with `mn_contract_preprod1` or `mn_contract_preview1`
- Has correct bech32 encoding
- Is exactly 70 characters long

---

## Network Endpoints

### Preprod Testnet
- **Explorer**: https://explorer.preprod.midnight.network
- **Indexer**: https://indexer.preprod.midnight.network/api/v1/graphql
- **RPC**: https://rpc.preprod.midnight.network
- **Faucet**: https://faucet.preprod.midnight.network

### Preview Testnet
- **Explorer**: https://explorer.preview.midnight.network
- **Indexer**: https://indexer.preview.midnight.network/api/v1/graphql
- **RPC**: https://rpc.preview.midnight.network
- **Faucet**: https://faucet.preview.midnight.network

---

## Security Notes

1. **Never commit private keys** to version control
2. Use environment variables for sensitive data
3. Test thoroughly on testnet before mainnet deployment
4. Keep deployment records secure
5. Document contract upgrade paths

---

## Resources

- **Midnight Documentation**: https://docs.midnight.network
- **Contract Deployment Guide**: https://docs.midnight.network/guides/deploy-and-operate
- **Compact Language Spec**: https://docs.midnight.network/language/compact
- **Midnight Explorer**: https://explorer.preprod.midnight.network

---

## Support

If you encounter issues deploying or verifying your contract:

1. Check [Midnight Documentation](https://docs.midnight.network)
2. Verify network is online (check [Status Page](https://status.midnight.network))
3. Ensure wallet has sufficient DUST tokens
4. Review deployment logs for errors
5. Join [Midnight Discord](https://discord.gg/midnight) for community support

---

**Last Updated**: 2026-09-11  
**Midnight Network Version**: v0.19.0  
**Contract Standard**: Compact v0.19
