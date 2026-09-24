# Quick Deployment Commands for VeilCircle Compact Contract

## 🚀 Fastest Way to Deploy

### Step 1: Fund Your Wallet
Visit faucet and get testnet DUST:
- **Preprod**: https://faucet.preprod.midnight.network
- **Preview**: https://faucet.preview.midnight.network

Request **10 DUST** tokens to your wallet address.

---

### Step 2: Set Environment Variables

#### Windows (PowerShell)
```powershell
$env:MIDNIGHT_NETWORK="preprod"
$env:WALLET_SEED="your twelve word seed phrase here"
```

#### Windows (CMD)
```cmd
set MIDNIGHT_NETWORK=preprod
set WALLET_SEED=your twelve word seed phrase here
```

#### Linux/Mac
```bash
export MIDNIGHT_NETWORK=preprod
export WALLET_SEED="your twelve word seed phrase here"
```

---

### Step 3: Compile and Deploy

```bash
cd contract
npm install
npm run compact:compile
npm run deploy:real
```

---

## 📋 Alternative: Using Midnight CLI

### Install CLI
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install midnight-cli
```

### Deploy
```bash
midnight-cli contract deploy \
  --compiled ./src/managed/veilcircle \
  --network preprod \
  --wait-for-confirmation
```

---

## ✅ After Deployment

### 1. Copy Contract Address
From deployment output, copy the contract address:
```
mn_contract_preprod1abc123def456...
```

### 2. Update Configuration
Edit `frontend/src/services/midnight.ts`:
```typescript
contractAddress: "mn_contract_preprod1abc123def456...", // ← Paste here
```

### 3. Update README
Edit `README.md` with your contract address.

### 4. Rebuild Frontend
```bash
cd frontend
npm run build
```

---

## 🔍 Verify Deployment

### Check Explorer
```
https://explorer.preprod.midnight.network/contracts/YOUR_ADDRESS
```

### Check via CLI
```bash
midnight-cli contract info \
  --address YOUR_ADDRESS \
  --network preprod
```

### Test from Frontend
```bash
cd frontend
npm run dev
# Open http://localhost:5173
# Connect wallet and try joining a circle
```

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Insufficient DUST" | Visit faucet, request more tokens |
| "Compilation failed" | Run `npm run compact:compile` and check errors |
| "Network timeout" | Wait 60s, check network status |
| "Proof server error" | Ensure port 6300 is available |
| "Contract not found" | Wait 30s for blockchain confirmation |

---

## 📚 Full Documentation

For detailed instructions, see:
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[CONTRACT_ADDRESSES.md](./CONTRACT_ADDRESSES.md)** - Contract address management
- **[Midnight Docs](https://docs.midnight.network)** - Official documentation

---

## 💡 Quick Commands Reference

```bash
# Compile contract
npm run compact:compile

# Deploy to Preprod (simulation)
npm run deploy:preprod

# Deploy to Preprod (real)
NETWORK=preprod WALLET_SEED="..." npm run deploy:real

# Deploy to Preview (real)
NETWORK=preview WALLET_SEED="..." npm run deploy:real

# Check wallet balance
midnight-cli wallet balance --network preprod

# Get wallet address
midnight-cli wallet address

# View contract info
midnight-cli contract info --address ADDRESS --network preprod
```

---

**Need Help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions!
