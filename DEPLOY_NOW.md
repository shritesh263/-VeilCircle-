# Deploy VeilCircle to Midnight Preview - COPY THESE COMMANDS

## ✅ Build Fixed - Ready to Deploy!

---

## STEP 1: Install Midnight CLI

```bash
# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Midnight CLI
uv tool install @midnight-ntwrk/midnight-cli

# Verify
midnight-cli --version
```

---

## STEP 2: Create Wallet

```bash
# Create new wallet
midnight-cli wallet create --name veilcircle-wallet

# Get your address
midnight-cli wallet address --wallet veilcircle-wallet
```

---

## STEP 3: Fund Wallet

1. Copy your wallet address from step 2
2. Visit: **https://faucet.preview.midnight.network**
3. Paste your address
4. Request **10 DUST** tokens
5. Wait 30 seconds

```bash
# Check balance
midnight-cli wallet balance --wallet veilcircle-wallet --network preview
```

---

## STEP 4: Compile Contract

```bash
cd contract
npm install
npm run compact:compile
```

---

## STEP 5: Deploy to Preview

```bash
# Deploy
midnight-cli contract deploy \
  --contract ./src/managed/veilcircle \
  --network preview \
  --wallet veilcircle-wallet \
  --wait-for-confirmation
```

---

## STEP 6: Get Contract Address

```bash
# List deployed contracts
midnight-cli contract list --wallet veilcircle-wallet --network preview
```

---

## STEP 7: Verify on Explorer

Copy your contract address and visit:
```
https://explorer.preview.midnight.network/contracts/YOUR_CONTRACT_ADDRESS
```

---

## STEP 8: Update Your Code

Edit `frontend/src/services/midnight.ts`:

```typescript
preview: {
  name: "preview",
  label: "Midnight Preview Testnet",
  contractAddress: "YOUR_CONTRACT_ADDRESS_HERE", // ← Paste here
  indexerUrl: "https://indexer.preview.midnight.network/api/v1/graphql",
  nodeUrl: "https://rpc.preview.midnight.network",
  explorerUrl: "https://explorer.preview.midnight.network"
},
```

---

## STEP 9: Rebuild and Test

```bash
# Rebuild frontend
cd ../frontend
npm run build

# Start dev server
npm run dev

# Open http://localhost:5173
# Connect wallet and test!
```

---

## Alternative: Docker Method

```bash
# Set wallet seed
export WALLET_SEED="your twelve word seed phrase"

# Deploy with Docker
docker-compose -f docker-compose.deploy.yml up
```

---

## Troubleshooting

### "Midnight CLI not found"
```bash
# Reinstall
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install @midnight-ntwrk/midnight-cli
```

### "Insufficient balance"
- Visit faucet again: https://faucet.preview.midnight.network
- Request more DUST

### "Contract not found"
- Wait 30 seconds after deployment
- Check transaction on explorer
- Verify network is "preview"

### "Build errors"
```bash
# Clean and rebuild
cd contract
rm -rf node_modules package-lock.json
npm install
npm run compact:compile
```

---

## Quick Reference

```bash
# Check CLI
midnight-cli --version

# Check wallet
midnight-cli wallet address --wallet veilcircle-wallet

# Check balance
midnight-cli wallet balance --wallet veilcircle-wallet --network preview

# List contracts
midnight-cli contract list --wallet veilcircle-wallet --network preview

# Contract info
midnight-cli contract info --address YOUR_ADDRESS --network preview
```

---

## ✅ DONE!

Your contract is now live on Midnight Preview Network! 🎉

Next: Test wallet connection in your frontend and join a circle!
