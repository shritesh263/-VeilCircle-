import { useState, useCallback } from 'react';
import { useWallet } from '../providers/WalletContext';
import { getContractConfig } from '../config/contractConfig';
import { activeNetworkConfig } from '../config/network';
import { LaceWalletState } from '../types';
import { WalletType } from '../wallet/types';

export interface UseMidnightReturn {
  // Wallet
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  walletName: string | null;
  walletState: LaceWalletState;
  connect: (walletType?: '1am' | 'lace') => Promise<void>;
  disconnect: () => Promise<void>;
  
  // Contract & Network
  networkId: string;
  contractAddress: string;
  isValidContract: boolean;
  explorerUrl: string;
  proofServerUrl: string;
  
  // Actions
  verifyNullifier: (nullifierHex: string) => Promise<boolean>;
  error: string | null;
}

export function useMidnight(): UseMidnightReturn {
  const walletContext = useWallet();
  const contractConfig = getContractConfig();
  const [error, setError] = useState<string | null>(null);

  const address = walletContext.account?.address || null;
  const isConnected = walletContext.isConnected;
  const isConnecting = walletContext.isConnecting;
  const walletName = walletContext.activeAdapter?.name || null;

  const dustBal = walletContext.account?.balance?.dust
    ? Number(walletContext.account.balance.dust) / 1_000_000
    : 0;
  const nightBal = walletContext.account?.balance?.night
    ? Number(walletContext.account.balance.night) / 1_000_000
    : 0;

  const walletState: LaceWalletState = {
    isConnected,
    isConnecting,
    address: address || '',
    shieldedAddress: address || '',
    unshieldedAddress: address || '',
    dustAddress: address || '',
    provider: (walletName?.toLowerCase().includes('lace') ? 'lace' : '1am'),
    providerName: walletName || 'Midnight Wallet',
    icon: walletContext.activeAdapter?.icon || null,
    balanceDUST: dustBal,
    balanceNIGHT: nightBal,
    network: 'preview',
    serviceConfig: null,
    connectedAPI: null,
    error: walletContext.connectionError,
    isCancelled: false,
  };

  const connect = useCallback(async (walletType: '1am' | 'lace' = '1am') => {
    try {
      setError(null);
      await walletContext.connectWallet(walletType as WalletType);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
    }
  }, [walletContext]);

  const disconnect = useCallback(async () => {
    try {
      setError(null);
      await walletContext.disconnectWallet();
    } catch (err: any) {
      setError(err?.message || 'Failed to disconnect wallet');
    }
  }, [walletContext]);

  const verifyNullifier = useCallback(async (nullifierHex: string): Promise<boolean> => {
    try {
      return !nullifierHex || nullifierHex.length !== 64;
    } catch {
      return false;
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    address,
    walletName,
    walletState,
    connect,
    disconnect,
    networkId: contractConfig.network,
    contractAddress: contractConfig.address,
    isValidContract: contractConfig.isValid,
    explorerUrl: contractConfig.explorerUrl || activeNetworkConfig.explorerContractUrl,
    proofServerUrl: activeNetworkConfig.proofServerUrl,
    verifyNullifier,
    error,
  };
}

export default useMidnight;
