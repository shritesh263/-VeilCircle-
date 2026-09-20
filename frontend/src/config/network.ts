// ============================================================================
// MIDNIGHT NETWORK CONFIGURATION (PREPROD & PREVIEW SUPPORT)
// Target Networks: Midnight Preprod (Stable Testnet) & Midnight Preview (Feature Testnet)
// ============================================================================

export type NetworkId = 'preprod' | 'preview';

/**
 * Interface describing Midnight network RPC endpoints, indexers, explorer links, and contract addresses.
 */
export interface NetworkConfig {
  networkId: NetworkId;
  networkName: string;
  rpcEndpoint: string;
  indexerApiUrl: string;
  indexerWsUrl: string;
  blockfrostRpcUrl: string;
  proofServerUrl: string;
  faucetUrl: string;
  explorerUrl: string;
  explorerContractUrl: string;
  contractAddress: string;
  deploymentTxHash: string;
  deployedBlock: number;
}

export const MIDNIGHT_NETWORKS: Record<NetworkId, NetworkConfig> = {
  preprod: {
    networkId: 'preprod',
    networkName: 'Midnight Preprod Testnet',
    rpcEndpoint: 'wss://rpc.preprod.midnight.network',
    indexerApiUrl: 'https://midnight-preprod.blockfrost.io/api/v0',
    indexerWsUrl: 'wss://midnight-preprod.blockfrost.io/api/v0/ws',
    blockfrostRpcUrl: 'https://rpc.midnight-preprod.blockfrost.io',
    proofServerUrl: 'http://localhost:6300',
    faucetUrl: 'https://faucet.preprod.midnight.network',
    explorerUrl: 'https://explorer.preprod.midnight.network',
    explorerContractUrl: 'https://explorer.preprod.midnight.network/contract/0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    contractAddress: '0x02a7b8e9f1c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
    deploymentTxHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    deployedBlock: 148290,
  },
  preview: {
    networkId: 'preview',
    networkName: 'Midnight Preview Testnet',
    rpcEndpoint: 'wss://rpc.preview.midnight.network',
    indexerApiUrl: 'https://midnight-preview.blockfrost.io/api/v0',
    indexerWsUrl: 'wss://midnight-preview.blockfrost.io/api/v0/ws',
    blockfrostRpcUrl: 'https://rpc.midnight-preview.blockfrost.io',
    proofServerUrl: 'http://localhost:6300',
    faucetUrl: 'https://faucet.preview.midnight.network',
    explorerUrl: 'https://explorer.preview.midnight.network',
    explorerContractUrl: 'https://explorer.preview.midnight.network/contract/0x3b8d91a1e2f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    contractAddress: '0x3b8d91a1e2f4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    deploymentTxHash: '0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    deployedBlock: 92840,
  },
};

export const MIDNIGHT_PREPROD_CONFIG = MIDNIGHT_NETWORKS.preprod;
export const MIDNIGHT_PREVIEW_CONFIG = MIDNIGHT_NETWORKS.preview;

/**
 * Returns network configuration by network ID (defaults to Preprod).
 */
export function getNetworkConfig(networkId: NetworkId = 'preprod'): NetworkConfig {
  return MIDNIGHT_NETWORKS[networkId] || MIDNIGHT_NETWORKS.preprod;
}

// Default target network
export const activeNetworkConfig = MIDNIGHT_NETWORKS.preprod;
