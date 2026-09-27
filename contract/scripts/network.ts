/**
 * scripts/network.ts
 *
 * Midnight network configuration constants for Preview and Preprod.
 * Official preview network endpoints specified in deployment guide:
 * - Substrate Node RPC (WebSocket): wss://rpc.preview.midnight.network
 * - GraphQL Indexer: https://indexer.preview.midnight.network/api/v4/graphql
 * - Official Faucet: https://faucet.preview.midnight.network
 * - Explorer: https://preview.midnightexplorer.com
 */

export type NetworkId = 'preview' | 'preprod' | 'undeployed';

export interface NetworkConfig {
  networkId: NetworkId;
  indexer: string;       // GraphQL HTTP endpoint (public data provider)
  indexerWS: string;     // GraphQL WebSocket endpoint (real-time state updates)
  node: string;          // Midnight node RPC (for tNIGHT registration)
  proofServer: string;   // Local proof server (ZK proof generation)
  faucet: string;        // Faucet URL for test tokens
  explorer: string;      // Blockchain explorer URL
}

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  preview: {
    networkId: 'preview',
    indexer:   'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node:      'wss://rpc.preview.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet:    'https://faucet.preview.midnight.network',
    explorer:  'https://preview.midnightexplorer.com',
  },
  preprod: {
    networkId: 'preprod',
    indexer:   'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node:      'wss://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet:    'https://faucet.preprod.midnight.network',
    explorer:  'https://preprod.midnightexplorer.com',
  },
  undeployed: {
    networkId: 'undeployed',
    indexer:   'http://127.0.0.1:8088/api/v1/graphql',
    indexerWS: 'ws://127.0.0.1:8088/api/v1/graphql/ws',
    node:      'http://127.0.0.1:9944',
    proofServer: 'http://127.0.0.1:6300',
    faucet:    '',
    explorer:  'http://localhost:3000',
  },
};

/**
 * Parses --network <id> from process.argv.
 * Defaults to 'preview' (Preview Testnet).
 */
export function parseNetwork(): { networkId: NetworkId; config: NetworkConfig } {
  const args = process.argv;
  const idx = args.indexOf('--network');
  if (idx !== -1 && args[idx + 1]) {
    const id = args[idx + 1] as NetworkId;
    if (!NETWORKS[id]) throw new Error(`Unknown network: ${id}. Supported: preview | preprod | undeployed`);
    return { networkId: id, config: NETWORKS[id] };
  }
  return { networkId: 'preview', config: NETWORKS['preview'] };
}
