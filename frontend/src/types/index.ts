export interface Circle {
  id: string; // Hex string (32 bytes)
  title: string;
  category: "Mental Health" | "Addiction Recovery" | "Chronic & Rare Illness" | "Trauma & Abuse" | "Caregivers & Whistleblowers";
  description: string;
  eligibilityCriteria: string;
  issuerName: string;
  issuerPubKey: string;
  memberCount: number;
  isActive: boolean;
  contractAddress: string;
  badgeColor: string;
  iconName: string;
  tags: string[];
}

export interface PrivateCredential {
  id: string;
  title: string;
  issuerName: string;
  issuerPubKey: string;
  secretKeyHex: string; // 32 bytes entropy (client-only)
  attributeHex: string; // 32 bytes attribute hash (client-only)
  saltHex: string; // 32 bytes salt (client-only)
  commitmentHex: string; // On-chain public commitment hash
  issuedAt: string;
  category: string;
  rawDetails: {
    holderAlias?: string;
    clinicalReferenceCode?: string;
    conditionCode?: string;
    validityWindow?: string;
  };
}

export interface ZkProofDetails {
  circuitName: string;
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
  publicInputs: {
    circleId: string;
    nullifier: string;
  };
  proofGenerationTimeMs: number;
  circuitConstraintsVerified: number;
  witnessBlinded: boolean;
}

export interface AnonymousMessage {
  id: string;
  circleId: string;
  ephemeralSenderId: string; // Short hash derived from nullifier (e.g. "Member #48B2")
  content: string;
  timestamp: string;
  verifiedShield: boolean;
  zkProofSnippet: string;
}

export interface NetworkConfig {
  name: "preview" | "preprod";
  label: string;
  contractAddress: string;
  indexerUrl: string;
  nodeUrl: string;
  explorerUrl: string;
}

export type WalletProviderType = "lace" | "1am" | "sandbox";

export interface WalletProviderInfo {
  id: WalletProviderType;
  name: string;
  description: string;
  icon: string;
  websiteUrl: string;
  isInstalled: boolean;
}

export interface LaceWalletState {
  isConnected: boolean;
  provider: WalletProviderType;
  providerName: string;
  address: string | null;
  network: "preview" | "preprod";
  balanceDUST: number;
  balanceNIGHT: number;
  isConnecting: boolean;
  error: string | null;
}
