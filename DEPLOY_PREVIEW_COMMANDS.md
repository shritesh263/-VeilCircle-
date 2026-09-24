# Midnight Preview Network Deployment Commands

## 🐳 Docker-Based Deployment (Official Midnight Way)

### Prerequisites Check
```bash
# Check Docker is installed
docker --version

# Check Docker Compose
docker-compose --version

# Check Node.js
node --version

# Should be v18 or higher
```

---

## Step 1: Install Midnight Tools

```bash
# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Midnight CLI
uv tool install @midnight-ntwrk/midnight-cli

# Verify installation
midnight-cli --version
```

---

## Step 2: Start Local Midnight Network (Docker)

```bash
# Pull Midnight Network Docker images
docker pull midnightnetwork/midnight-node:latest
docker pull midnightnetwork/midnight-indexer:latest
docker pull midnightnetwork/proof-server:latest

# Start local Midnight network
midnight-cli network start

# This will start:
# - Midnight Node (http://localhost:26657)
# - Indexer (http://localhost:8080)
# - Proof Server (http://localhost:6300)

# Wait for network to be ready (30-60 seconds)
midnight-cli network status
```

---

## Step 3: Create and Fund Wallet

```bash
# Create new wallet
midnight-cli wallet create --name my-wallet

# OR import existing wallet
midnight-cli wallet import --seed "your twelve word seed phrase here"

# Get wallet address
midnight-cli wallet address

# For Preview testnet, get tokens from faucet:
# Visit: https://faucet.preview.midnight.network
# Enter your address and request DUST tokens
```

---

## Step 4: Compile Contract

```bash
cd contract

# Install dependencies
npm install

# Compile Compact contract
npm run compact:compile

# Verify compilation
ls -la src/managed/veilcircle/
# Should see: circuits.json, index.ts, keys.ts
```

---

## Step 5: Deploy to Preview Network

```bash
# Method 1: Using Midnight CLI (Recommended)
midnight-cli contract deploy \
  --contract ./src/managed/veilcircle \
  --network preview \
  --wallet my-wallet \
  --wait-for-confirmation

# Method 2: Using Docker Compose
docker-compose -f docker-compose.deploy.yml up

# Method 3: Using npm script
NETWORK=preview npm run deploy:real
```

---

## Docker Compose Deployment (Full Setup)

### Create docker-compose.deploy.yml

```yaml
version: '3.8'

services:
  midnight-node:
    image: midnightnetwork/midnight-node:latest
    ports:
      - "26657:26657"
      - "26656:26656"
    environment:
      - NETWORK=preview
    volumes:
      - midnight-data:/root/.midnight

  indexer:
    image: midnightnetwork/midnight-indexer:latest
    ports:
      - "8080:8080"
    environment:
      - NODE_URL=http://midnight-node:26657
      - NETWORK=preview
    depends_on:
      - midnight-node

  proof-server:
    image: midnightnetwork/proof-server:latest
    ports:
      - "6300:6300"
    volumes:
      - ./contract/src/managed:/circuits

  contract-deployer:
    image: node:18
    working_dir: /app
    volumes:
      - ./contract:/app
    environment:
      - NETWORK=preview
      - WALLET_SEED=${WALLET_SEED}
      - NODE_URL=http://midnight-node:26657
      - INDEXER_URL=http://indexer:8080
      - PROOF_SERVER_URL=http://proof-server:6300
    command: npm run deploy:real
    depends_on:
      - midnight-node
      - indexer
      - proof-server

volumes:
  midnight-data:
```

### Deploy with Docker Compose

```bash
# Set wallet seed
export WALLET_SEED="your twelve word seed phrase here"

# Start all services and deploy
docker-compose -f docker-compose.deploy.yml up

# Check logs
docker-compose -f docker-compose.deploy.yml logs -f contract-deployer

# Stop services
docker-compose -f docker-compose.deploy.yml down
```

---

## Quick Commands (Copy-Paste)

### Full Deployment Flow
```bash
# 1. Start Midnight network
midnight-cli network start

# 2. Wait for ready
sleep 60

# 3. Compile contract
cd contract && npm run compact:compile

# 4. Deploy to Preview
midnight-cli contract deploy \
  --contract ./src/managed/veilcircle \
  --network preview \
  --wallet my-wallet \
  --wait-for-confirmation

# 5. Get contract address
midnight-cli contract list --network preview

# 6. Verify on explorer
echo "https://explorer.preview.midnight.network/contracts/YOUR_ADDRESS"
```

---

## Docker Commands Reference

### Start Midnight Network
```bash
# Start local testnet
docker run -d \
  --name midnight-node \
  -p 26657:26657 \
  midnightnetwork/midnight-node:latest

# Start indexer
docker run -d \
  --name midnight-indexer \
  -p 8080:8080 \
  --link midnight-node \
  -e NODE_URL=http://midnight-node:26657 \
  midnightnetwork/midnight-indexer:latest

# Start proof server
docker run -d \
  --name proof-server \
  -p 6300:6300 \
  -v $(pwd)/contract/src/managed:/circuits \
  midnightnetwork/proof-server:latest
```

### Check Status
```bash
# Check running containers
docker ps

# Check node logs
docker logs midnight-node

# Check indexer logs
docker logs midnight-indexer

# Check proof server logs
docker logs proof-server
```

### Stop and Clean
```bash
# Stop containers
docker stop midnight-node midnight-indexer proof-server

# Remove containers
docker rm midnight-node midnight-indexer proof-server

# Clean volumes
docker volume prune
```

---

## Verify Deployment

```bash
# 1. Check contract on explorer
# https://explorer.preview.midnight.network/contracts/YOUR_ADDRESS

# 2. Using CLI
midnight-cli contract info \
  --address YOUR_CONTRACT_ADDRESS \
  --network preview

# 3. Test circuit call
midnight-cli contract call \
  --address YOUR_CONTRACT_ADDRESS \
  --circuit isNullifierSpent \
  --args '{"nullifier":"0x0000000000000000000000000000000000000000000000000000000000000001"}' \
  --network preview
```

---

## Troubleshooting

### Docker not running
```bash
# Windows: Start Docker Desktop
# Linux: 
sudo systemctl start docker

# Mac:
open -a Docker
```

### Port already in use
```bash
# Find process using port
netstat -ano | findstr :6300

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Linux/Mac)
kill -9 <PID>
```

### Docker images not found
```bash
# Pull latest images
docker pull midnightnetwork/midnight-node:latest
docker pull midnightnetwork/midnight-indexer:latest
docker pull midnightnetwork/proof-server:latest
```

### Container won't start
```bash
# Check logs
docker logs <container-name>

# Restart container
docker restart <container-name>

# Remove and recreate
docker rm -f <container-name>
docker run ...
```

---

## Environment Variables

```bash
# Windows (PowerShell)
$env:NETWORK="preview"
$env:WALLET_SEED="your seed phrase"
$env:NODE_URL="http://localhost:26657"
$env:INDEXER_URL="http://localhost:8080"
$env:PROOF_SERVER_URL="http://localhost:6300"

# Linux/Mac
export NETWORK=preview
export WALLET_SEED="your seed phrase"
export NODE_URL=http://localhost:26657
export INDEXER_URL=http://localhost:8080
export PROOF_SERVER_URL=http://localhost:6300
```

---

## Complete One-Line Deployment

```bash
# Full deployment pipeline
midnight-cli network start && \
  sleep 60 && \
  cd contract && \
  npm run compact:compile && \
  midnight-cli contract deploy --contract ./src/managed/veilcircle --network preview --wallet my-wallet --wait-for-confirmation && \
  midnight-cli contract list --network preview
```

---

## Official Midnight Documentation

- **Main Docs**: https://docs.midnight.network
- **Docker Setup**: https://docs.midnight.network/guides/midnight-local-network
- **Deployment Guide**: https://docs.midnight.network/guides/deploy-and-operate
- **CLI Reference**: https://docs.midnight.network/tools/midnight-cli

---

## Network Endpoints

### Preview Testnet (Public)
- **Node**: https://rpc.preview.midnight.network
- **Indexer**: https://indexer.preview.midnight.network/api/v1/graphql
- **Explorer**: https://explorer.preview.midnight.network
- **Faucet**: https://faucet.preview.midnight.network

### Local Docker Network
- **Node**: http://localhost:26657
- **Indexer**: http://localhost:8080
- **Proof Server**: http://localhost:6300

---

## After Deployment

### 1. Get Contract Address
```bash
midnight-cli contract list --network preview | grep VeilCircle
```

### 2. Update Your Code
```bash
# Update frontend/src/services/midnight.ts
# contractAddress: "mn_contract_preview1..."
```

### 3. Test Contract
```bash
cd frontend
npm run dev
# Connect wallet and test circle join
```

### 4. Verify on Explorer
```bash
# Visit:
# https://explorer.preview.midnight.network/contracts/YOUR_ADDRESS
```

---

**Need Help?**
- Check logs: `docker logs <container-name>`
- Network status: `midnight-cli network status`
- Wallet balance: `midnight-cli wallet balance`
- Discord: https://discord.gg/midnight
