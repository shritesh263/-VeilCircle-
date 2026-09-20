import React from 'react';
import { ContractConfig } from '../config/contractConfig';
import { WalletProvider } from '../utils/cardanoWallet';

interface DashboardStatsOverviewProps {
  contractConfig: ContractConfig;
  walletConnected: boolean;
  walletProvider: WalletProvider | null;
  totalCirclesCount: number;
  credentialsCount: number;
  joinedCirclesCount: number;
  verifiedNullifiersCount: number;
  onNavigateTab?: (tab: string) => void;
}

export const DashboardStatsOverview: React.FC<DashboardStatsOverviewProps> = ({
  contractConfig,
  walletConnected,
  walletProvider,
  totalCirclesCount,
  credentialsCount,
  joinedCirclesCount,
  verifiedNullifiersCount,
  onNavigateTab
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Safe Circles */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('explore')}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-xs hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Sanctuaries</span>
          <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
            all_inclusive
          </span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-on-surface font-mono">
          {totalCirclesCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Active Peer Spaces
        </div>
      </div>

      {/* 2. ZK Credentials in Vault */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('vault')}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-xs hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
          <span>ZK Vault</span>
          <span className="material-symbols-outlined text-[18px] text-emerald-600 group-hover:scale-110 transition-transform">
            vpn_key
          </span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-emerald-600 font-mono">
          {credentialsCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Local Witness Proofs
        </div>
      </div>

      {/* 3. Joined Sanctuaries */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('sanctuary')}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-xs hover:border-secondary/40 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-secondary text-[11px] font-bold uppercase tracking-wider">
          <span>Memberships</span>
          <span className="material-symbols-outlined text-[18px] text-secondary group-hover:scale-110 transition-transform">
            spa
          </span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-secondary font-mono">
          {joinedCirclesCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Unlocked Sanctuaries
        </div>
      </div>

      {/* 4. On-Chain Nullifiers */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('ledger')}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-xs hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-primary text-[11px] font-bold uppercase tracking-wider">
          <span>Nullifiers</span>
          <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
            receipt_long
          </span>
        </div>
        <div className="mt-2 text-2xl font-extrabold text-primary font-mono">
          {verifiedNullifiersCount}
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1">
          Settled on Midnight
        </div>
      </div>

      {/* 5. Wallet Status */}
      <div
        onClick={() => onNavigateTab && onNavigateTab('account')}
        className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-xs hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Wallet</span>
          <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
            account_balance_wallet
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              walletConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          ></span>
          <span className="text-sm font-bold text-on-surface truncate">
            {walletConnected ? (walletProvider ? `${walletProvider}` : 'Connected') : 'Disconnected'}
          </span>
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1 truncate">
          {walletConnected ? 'Shielded Session' : 'Click to Connect'}
        </div>
      </div>

      {/* 6. Network & Privacy */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
          <span>Network</span>
          <span className="material-symbols-outlined text-[18px] text-secondary">
            lan
          </span>
        </div>
        <div className="mt-2 text-sm font-bold text-on-surface font-mono truncate">
          {contractConfig.network.toUpperCase()}
        </div>
        <div className="text-[10px] text-emerald-600 font-semibold mt-1 truncate">
          100% Zero-Knowledge
        </div>
      </div>
    </div>
  );
};
