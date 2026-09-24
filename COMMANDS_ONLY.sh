#!/bin/bash
# VeilCircle Preview Network Deployment - Commands Only
# Copy and paste these commands in order

# ============================================
# STEP 1: Install Midnight CLI
# ============================================
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install @midnight-ntwrk/midnight-cli
midnight-cli --version


# ============================================
# STEP 2: Start Docker Network
# ============================================
# Start Midnight local network with Docker
midnight-cli network start

# Wait for network to be ready
sleep 60

# Check status
midnight-cli network status


# ============================================
# STEP 3: Create Wallet
# ============================================
# Create new wallet
midnight-cli wallet create --name veilcircle-wallet

# Get wallet address
midnight-cli wallet address

# Fund wallet at: https://faucet.preview.midnight.network
# Request 10 DUST tokens

# Check balance
midnight-cli wallet balance


# ============================================
# STEP 4: Compile Contract
# ============================================
cd contract
npm install
npm run compact:compile


# ============================================
# STEP 5: Deploy to Preview
# ============================================
midnight-cli contract deploy \
  --contract ./src/managed/veilcircle \
  --network preview \
  --wallet veilcircle-wallet \
  --wait-for-confirmation


# ============================================
# STEP 6: Get Contract Address
# ============================================
midnight-cli contract list --network preview


# ============================================
# STEP 7: Verify on Explorer
# ============================================
# Visit: https://explorer.preview.midnight.network/contracts/YOUR_ADDRESS


# ============================================
# ALTERNATIVE: Docker Compose Deployment
# ============================================
# Set wallet seed
export WALLET_SEED="your twelve word seed phrase here"

# Deploy with Docker Compose
docker-compose -f docker-compose.deploy.yml up

# Check logs
docker-compose -f docker-compose.deploy.yml logs -f contract-deployer

# Stop services
docker-compose -f docker-compose.deploy.yml down


# ============================================
# DOCKER MANUAL COMMANDS
# ============================================
# Start Midnight node
docker run -d \
  --name midnight-node \
  -p 26657:26657 \
  -p 26656:26656 \
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

# Check running containers
docker ps

# Check node logs
docker logs midnight-node

# Stop all
docker stop midnight-node midnight-indexer proof-server
docker rm midnight-node midnight-indexer proof-server


# ============================================
# VERIFY DEPLOYMENT
# ============================================
# Get contract info
midnight-cli contract info \
  --address YOUR_CONTRACT_ADDRESS \
  --network preview

# Test circuit call
midnight-cli contract call \
  --address YOUR_CONTRACT_ADDRESS \
  --circuit isNullifierSpent \
  --args '{"nullifier":"0x0000000000000000000000000000000000000000000000000000000000000001"}' \
  --network preview


# ============================================
# UPDATE YOUR CODE
# ============================================
# Edit frontend/src/services/midnight.ts
# Update contractAddress with deployed address

cd ../frontend
npm run build
npm run dev


# ============================================
# CLEANUP
# ============================================
# Stop Midnight network
midnight-cli network stop

# Remove Docker containers
docker-compose -f docker-compose.deploy.yml down -v

# Remove all Midnight Docker images
docker rmi midnightnetwork/midnight-node:latest
docker rmi midnightnetwork/midnight-indexer:latest
docker rmi midnightnetwork/proof-server:latest
