// ============================================================================
// WALLET PROVIDER CONTEXT
// Manages real injected Midnight wallet connections (1AM & Lace),
// authorization popups, connected account state, and transaction signing.
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { WalletAccount, WalletAdapter, WalletType, MidnightTransaction } from '../wallet/types';
import { walletRegistry } from '../wallet/registry';

interface WalletContextType {
  activeAdapter: WalletAdapter | null;
  account: WalletAccount | null;
  walletApi: any | null;
  isConnected: boolean;
  isConnecting: boolean;
  availableWallets: WalletAdapter[];
  installedWallets: WalletAdapter[];
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  signAndBalance: (txData: any) => Promise<MidnightTransaction>;
  showWalletModal: boolean;
  setShowWalletModal: (show: boolean) => void;
  connectionError: string | null;
  clearConnectionError: () => void;
  rescanWallets: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeAdapter, setActiveAdapter] = useState<WalletAdapter | null>(null);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [walletApi, setWalletApi] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [, setScanTrigger] = useState(0);

  const rescanWallets = useCallback(() => {
    setScanTrigger(prev => prev + 1);
  }, []);

  // Scan on mount and periodically in the first few seconds as extensions load
  useEffect(() => {
    const timer1 = setTimeout(rescanWallets, 500);
    const timer2 = setTimeout(rescanWallets, 1500);
    const timer3 = setTimeout(rescanWallets, 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [rescanWallets]);

  const availableWallets = walletRegistry.getAllAdapters();
  const installedWallets = walletRegistry.getInstalledAdapters();

  const connectWallet = async (type: WalletType) => {
    setIsConnecting(true);
    setConnectionError(null);
    try {
      const adapter = walletRegistry.getAdapter(type);
      if (!adapter) throw new Error(`Wallet adapter for ${type} not found.`);

      // Trigger the real browser extension popup permission window
      const { account: acc, api } = await adapter.connect();

      setActiveAdapter(adapter);
      setAccount(acc);
      setWalletApi(api);
      setShowWalletModal(false);
      setConnectionError(null);
    } catch (error: any) {
      console.error(`Failed to connect ${type} wallet:`, error);
      setActiveAdapter(null);
      setAccount(null);
      setWalletApi(null);
      setConnectionError(error?.message || "Wallet connection request was rejected or failed.");
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (activeAdapter) {
      await activeAdapter.disconnect();
    }
    setActiveAdapter(null);
    setAccount(null);
    setWalletApi(null);
    setConnectionError(null);
  };

  const clearConnectionError = () => {
    setConnectionError(null);
  };

  const signAndBalance = async (txData: any): Promise<MidnightTransaction> => {
    if (!activeAdapter || !account) {
      throw new Error("No wallet connected. Please connect a real Midnight wallet extension.");
    }
    return activeAdapter.signAndBalanceTransaction(txData);
  };

  return (
    <WalletContext.Provider
      value={{
        activeAdapter,
        account,
        walletApi,
        isConnected: !!account,
        isConnecting,
        availableWallets,
        installedWallets,
        connectWallet,
        disconnectWallet,
        signAndBalance,
        showWalletModal,
        setShowWalletModal,
        connectionError,
        clearConnectionError,
        rescanWallets,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
