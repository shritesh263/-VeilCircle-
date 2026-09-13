// ============================================================================
// WALLET ABSTRACTION LAYER TYPES
// Standardized Provider Registry & Adapter Pattern for Injected Lace & 1AM Wallets
// Midnight Blockchain - Preprod & Preview Network Support
// ============================================================================

import { NetworkId } from '../config/network';

export type WalletType = 'lace' | '1am' | 'sandbox';

export interface WalletAccount {
  address: string;
  coinPublicKey?: string;
  networkId: NetworkId;
  balance?: {
    night: bigint;
    dust: bigint;
  };
}

export interface MidnightTransaction {
  txHash: string;
  status: 'submitted' | 'confirmed' | 'failed';
  blockHeight?: number;
  timestamp: number;
}

export interface ProvingProvider {
  generateProof(circuitName: string, publicInputs: any, privateWitness: any): Promise<any>;
}

export interface WalletAdapter {
  id: WalletType;
  name: string;
  icon: string;
  description: string;
  websiteUrl: string;
  isInstalled(): boolean;
  connect(): Promise<{ account: WalletAccount; api: any }>;
  disconnect(): Promise<void>;
  getAccount(): Promise<WalletAccount | null>;
  getApi(): any;
  signAndBalanceTransaction(txData: any): Promise<MidnightTransaction>;
  getProvingProvider(): Promise<ProvingProvider | null>;
}

declare global {
  interface Window {
    cardano?: {
      lace?: {
        enable: () => Promise<any>;
      };
      midnight?: {
        enable: () => Promise<any>;
      };
      [key: string]: any;
    };
    oneAm?: any;
    '1am'?: any;
    lace?: any;
  }
}
