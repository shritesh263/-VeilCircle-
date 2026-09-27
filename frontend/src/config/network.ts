// ============================================================================
// MIDNIGHT NETWORK CONFIGURATION (MIDNIGHT PREVIEW TESTNET)
// Target Network: Midnight Preview Testnet (Feature Testnet)
// Live Deployed Contract: 363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f
// ============================================================================

export type NetworkId = 'preview';

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
  preview: {
    networkId: 'preview',
    networkName: 'Midnight Preview Testnet',
    rpcEndpoint: 'wss://rpc.preview.midnight.network',
    indexerApiUrl: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWsUrl: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    blockfrostRpcUrl: 'https://rpc.preview.midnight.network',
    proofServerUrl: 'http://localhost:6300',
    faucetUrl: 'https://faucet.preview.midnight.network',
    explorerUrl: 'https://preview.midnightexplorer.com',
    explorerContractUrl: 'https://preview.midnightexplorer.com/contracts/0x363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f',
    contractAddress: '363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f',
    deploymentTxHash: 'f84a691f39fd0795b7efeb1b92c402f978c0c8861c5e0ee2ea604e2023509c62',
    deployedBlock: 1,
  },
};

export const MIDNIGHT_PREVIEW_CONFIG = MIDNIGHT_NETWORKS.preview;

/**
 * Returns network configuration by network ID (strictly Preview).
 */
export function getNetworkConfig(_networkId: string = 'preview'): NetworkConfig {
  return MIDNIGHT_NETWORKS.preview;
}

// Default target network: Midnight Preview
export const activeNetworkConfig = MIDNIGHT_NETWORKS.preview;

