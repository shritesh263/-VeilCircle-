import deployedContract from './deployed-contract.json';

export interface ContractConfig {
  address: string;
  network: string;
  isValid: boolean;
  errorMessage: string | null;
  policyId?: string;
  circuitName?: string;
  explorerUrl?: string;
}

/**
 * Validates if a contract address string matches valid Midnight or EVM address format:
 * - Standard Midnight Bech32 contract address (mn_contract1..., mn_contract_preprod1..., mn_contract_preview1..., mn_test1...)
 * - Standard 32-byte Midnight contract address (0x + 64 hex chars or 64 hex chars without 0x)
 * - Standard 20-byte EVM address (0x + 40 hex chars or 40 hex chars)
 */
export function isValidContractAddress(address: string | undefined | null): boolean {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  
  // 1. Bech32 Midnight address format (mn_contract1..., mn_contract_preprod1..., mn_contract_preview1..., mn_test1...)
  if (/^(mn_contract1|mn_contract_preprod1|mn_contract_preview1|mn_test1|addr1)[a-zA-Z0-9]{20,90}$/.test(trimmed)) {
    return true;
  }

  // 2. Standard Hex address (0x + 64 hex chars or 0x + 40 hex chars)
  if (/^0x([0-9a-fA-F]{64}|[0-9a-fA-F]{40})$/.test(trimmed)) {
    return true;
  }

  // 3. Raw 64 or 40 hex characters without 0x prefix
  if (/^([0-9a-fA-F]{64}|[0-9a-fA-F]{40})$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Loads the VeilCircle contract configuration from environment variables or defaults.
 * Defaults to the live deployed contract on Midnight Preview testnet.
 */
export function getContractConfig(): ContractConfig {
  const meta = typeof import.meta !== 'undefined' ? (import.meta as any) : undefined;
  const envAddress =
    meta?.env?.VITE_CONTRACT_ADDRESS ||
    meta?.env?.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    (typeof process !== 'undefined' ? (process.env as any)?.VITE_CONTRACT_ADDRESS || (process.env as any)?.NEXT_PUBLIC_CONTRACT_ADDRESS : undefined) ||
    deployedContract.contractAddress;

  const network = 'preview';

  const cleanAddress = (envAddress || '363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f').trim();
  const isValid = isValidContractAddress(cleanAddress);

  let errorMessage: string | null = null;
  if (!cleanAddress) {
    errorMessage = 'VeilCircle contract address is not configured. Please set VITE_CONTRACT_ADDRESS in environment variables.';
  } else if (!isValid) {
    errorMessage = `VeilCircle contract address "${cleanAddress}" is invalid. Expected a valid Midnight contract address (64-character hex hash or Bech32 address).`;
  }

  const hexAddress = cleanAddress.startsWith('0x') ? cleanAddress : `0x${cleanAddress}`;
  const explorerUrl = `https://preview.midnightexplorer.com/contracts/${hexAddress}`;

  return {
    address: cleanAddress,
    network: 'preview',
    isValid,
    errorMessage,
    policyId: '0x5665696c436972636c655f507269766163795f53616e6374756172795f563230',
    circuitName: 'proveAndJoinCircle (BLS12-381 / Groth16)',
    explorerUrl
  };
}
