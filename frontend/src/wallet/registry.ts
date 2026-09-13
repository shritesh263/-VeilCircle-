// ============================================================================
// WALLET PROVIDER REGISTRY & ADAPTER MANAGER
// Midnight Blockchain - Preprod & Preview Target
// Detects real injected Midnight browser extensions (Lace Wallet & 1AM Wallet)
// + Testnet Sandbox Wallet
// ============================================================================

import { WalletAdapter, WalletType } from './types';
import { LaceWalletAdapter } from './LaceAdapter';
import { OneAmWalletAdapter } from './OneAmAdapter';
import { SandboxWalletAdapter } from './SandboxAdapter';

export class WalletRegistry {
  private adapters: Map<WalletType, WalletAdapter> = new Map();

  constructor() {
    this.registerAdapter(new OneAmWalletAdapter());
    this.registerAdapter(new LaceWalletAdapter());
    this.registerAdapter(new SandboxWalletAdapter());
  }

  public registerAdapter(adapter: WalletAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  public getAdapter(id: WalletType): WalletAdapter | undefined {
    return this.adapters.get(id);
  }

  public getAllAdapters(): WalletAdapter[] {
    return Array.from(this.adapters.values());
  }

  public getInstalledAdapters(): WalletAdapter[] {
    return this.getAllAdapters().filter(adapter => adapter.isInstalled());
  }

  public detectInjectedWallets(): { id: WalletType; name: string; installed: boolean }[] {
    return this.getAllAdapters().map(adapter => ({
      id: adapter.id,
      name: adapter.name,
      installed: adapter.isInstalled(),
    }));
  }
}

export const walletRegistry = new WalletRegistry();
