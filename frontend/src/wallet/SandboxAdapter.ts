// ============================================================================
// MIDNIGHT TESTNET SANDBOX WALLET ADAPTER
// Provides a pre-configured, testnet-funded Midnight participant & sponsor identity
// for instant testing on Midnight Preprod & Preview environments.
// ============================================================================

import { WalletAdapter, WalletAccount, MidnightTransaction, ProvingProvider, WalletType } from './types';
import { MIDNIGHT_PREPROD_CONFIG } from '../config/network';

export class SandboxWalletAdapter implements WalletAdapter {
  public readonly id: WalletType = 'sandbox';
  public readonly name = 'Midnight Testnet Sandbox';
  public readonly icon = '🧪';
  public readonly description = 'Pre-configured testnet wallet with pre-allocated tDUST & authorized sponsor credentials.';
  public readonly websiteUrl = 'https://docs.midnight.network';

  private connectedAccount: WalletAccount | null = null;

  public isInstalled(): boolean {
    return true; // Always available for testing & evaluation
  }

  public async connect(): Promise<{ account: WalletAccount; api: any }> {
    // Generate deterministic yet session-unique Preprod address
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const account: WalletAccount = {
      address: `mn_test1qq${randomHex.slice(0, 32)}`,
      coinPublicKey: `0x89a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1`,
      networkId: MIDNIGHT_PREPROD_CONFIG.networkId,
      balance: {
        night: 5000000000n,
        dust: 25000000000n,
      },
    };

    this.connectedAccount = account;

    const mockApi = {
      getAddress: async () => account.address,
      getCoinPublicKey: async () => account.coinPublicKey,
      balanceAndSignTx: async (tx: any) => ({ ...tx, signed: true }),
      submitTx: async () => `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('')}`,
    };

    return { account, api: mockApi };
  }

  public async disconnect(): Promise<void> {
    this.connectedAccount = null;
  }

  public async getAccount(): Promise<WalletAccount | null> {
    return this.connectedAccount;
  }

  public getApi(): any {
    return null;
  }

  public async signAndBalanceTransaction(txData: any): Promise<MidnightTransaction> {
    const txHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('')}`;
    return {
      txHash,
      status: 'confirmed',
      timestamp: Date.now(),
      blockHeight: 148295,
    };
  }

  public async getProvingProvider(): Promise<ProvingProvider | null> {
    return null;
  }
}
