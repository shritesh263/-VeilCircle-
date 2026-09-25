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
    explorerContractUrl: 'https://explorer.preprod.midnight.network/contract/0xac6502ca9401afeb91a8a20d10a4ba0dcdc2452f976a89fba003cc5fdc941d02',
    contractAddress: '0xac6502ca9401afeb91a8a20d10a4ba0dcdc2452f976a89fba003cc5fdc941d02',
    deploymentTxHash: '0x6193246854e40f7e97835eb6a146a4b73569586aab90fb165e1a2b2214b97ff5',
    deployedBlock: 489201,
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
    explorerContractUrl: 'https://explorer.preview.midnight.network/contract/0x124a84fafb57db4096cc7664b5dc5047a46485b04052b9f348413e5365874d86',
    contractAddress: '0x124a84fafb57db4096cc7664b5dc5047a46485b04052b9f348413e5365874d86',
    deploymentTxHash: '0x4b502b60915736f504cacd76abb9442f64a24b0e030da89c313978931dedc407',
    deployedBlock: 124589,
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
