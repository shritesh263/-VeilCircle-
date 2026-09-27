/**
 * utils/contract.ts
 *
 * Contract interaction helpers and formatters for VeilCircle on Midnight Preview testnet.
 */

import { getContractConfig, isValidContractAddress } from '../config/contractConfig';
import { activeNetworkConfig } from '../config/network';
import deployedContract from '../config/deployed-contract.json';

export interface CircleRecord {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  isActive: boolean;
  issuerPubKey?: string;
}

/**
 * Returns the currently active deployed contract address.
 */
export function getContractAddress(): string {
  return deployedContract.contractAddress || getContractConfig().address;
}

/**
 * Returns the blockchain explorer link for the contract.
 */
export function getExplorerUrl(): string {
  const addr = getContractAddress();
  return `${activeNetworkConfig.explorerUrl}/contract/${addr}`;
}

/**
 * Formats a Midnight address or contract hash for clean display: `0x363d...a40f`
 */
export function formatAddress(address: string, leadingChars = 6, trailingChars = 4): string {
  if (!address) return '';
  if (address.length <= leadingChars + trailingChars) return address;
  const prefix = address.startsWith('0x') ? address.slice(0, leadingChars + 2) : address.slice(0, leadingChars);
  const suffix = address.slice(-trailingChars);
  return `${prefix}...${suffix}`;
}

/**
 * Verifies if an address conforms to valid Midnight Bech32 or 32-byte hex hash.
 */
export function validateContract(address: string): boolean {
  return isValidContractAddress(address);
}

/**
 * Pre-configured verified circles on Midnight Preview network.
 */
export const VERIFIED_CIRCLES: CircleRecord[] = [
  {
    id: '0000000000000000000000000000000000000000000000000000000000000001',
    name: 'Veterans Trauma & PTSD Recovery Sanctuary',
    category: 'Mental Health & PTSD',
    memberCount: 42,
    isActive: true,
  },
  {
    id: '0000000000000000000000000000000000000000000000000000000000000002',
    name: 'Substance & Addiction Recovery Anonymous',
    category: 'Substance Recovery',
    memberCount: 29,
    isActive: true,
  },
  {
    id: '0000000000000000000000000000000000000000000000000000000000000003',
    name: 'Oncology & Rare Illness Peer Group',
    category: 'Chronic Illness',
    memberCount: 68,
    isActive: true,
  },
  {
    id: '0000000000000000000000000000000000000000000000000000000000000004',
    name: 'Whistleblower & Investigative Journalists Enclave',
    category: 'Privacy & Rights',
    memberCount: 15,
    isActive: true,
  },
];
