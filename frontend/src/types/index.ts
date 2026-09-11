export interface Circle {
  id: string; // Hex string (32 bytes)
  title: string;
  category: "Caregiver Support" | "Burnout & Recovery" | "Chronic Health" | "Verified Referrals" | "Trauma & Abuse" | "Mental Health" | "Addiction Recovery";
  description: string;
  eligibilityCriteria: string;
  issuerName: string;
  issuerPubKey: string;
  memberCount: number;
  cohort: string;
  scheduleBadge: string;
  iconName: string;
  tags: string[];
  isActive: boolean;
  contractAddress: string;
  badgeColor: string;
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
  predicateText: string;
  rawDetails: {
    holderAlias?: string;
    clinicalReferenceCode?: string;
    conditionCode?: string;
    validityWindow?: string;
    blindedHashMask?: string;
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
  nullifierHash: string;
  contractFile: string;
  validatorNode: string;
  gasSponsored: boolean;
  ephemeralGuardianId: string;
}

export interface PeerMessage {
  id: string;
  circleId: string;
  senderAlias: string;
  senderAvatarEmoji: string;
  badgeText: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
  reactions: {
    heart: number;
    warmth: number;
    presence: number;
  };
}

export interface NetworkConfig {
  name: "preview" | "preprod";
  label: string;
  contractAddress: string;
  indexerUrl: string;
  nodeUrl: string;
  explorerUrl: string;
}

import type { InitialAPI, ConnectedAPI, Configuration } from '@midnight-ntwrk/dapp-connector-api';

export interface DetectedWallet {
  id: string;
  rdns: string;
  name: string;
  icon: string;
  apiVersion: string;
  is1AM: boolean;
  isLace: boolean;
  api: InitialAPI;
}

export interface LaceWalletState {
  isConnected: boolean;
  provider: string; // rdns or wallet id
  providerName: string;
  icon: string | null;
  address: string | null;
  shieldedAddress: string | null;
  unshieldedAddress: string | null;
  dustAddress: string | null;
  network: "preview" | "preprod";
  balanceDUST: number;
  balanceNIGHT: number;
  serviceConfig: Configuration | null;
  connectedAPI: ConnectedAPI | null;
  isConnecting: boolean;
  error: string | null;
  isCancelled: boolean;
}

export interface AnonymousMessage {
  id: string;
  circleId: string;
  ephemeralSenderId: string;
  content: string;
  timestamp: string;
  verifiedShield: boolean;
  zkProofSnippet: string;
}



