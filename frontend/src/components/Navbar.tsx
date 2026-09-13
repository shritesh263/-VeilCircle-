import React from "react";
import { LaceWalletState } from "../types";
import { LaceWalletBar } from "./LaceWalletBar";
import { WalletProvider } from "../utils/cardanoWallet";

interface NavbarProps {
  walletState: LaceWalletState;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onConnectWalletProvider?: (provider: WalletProvider) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNetworkChange: (net: "preview" | "preprod") => void;
  activeCircleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletState,
  onOpenWalletModal: _onOpenWalletModal,
  onDisconnectWallet,
  onConnectWalletProvider,
  activeTab,
  setActiveTab
}) => {
  const getSubheaderTitle = () => {
    switch (activeTab) {
      case "explore":
        return "Circles";
      case "vault":
        return "Credentials Vault";
      case "studio":
        return "ZK Prover";
      case "settlement":
        return "Proof Settlement";
      case "sanctuary":
        return "Sanctuary";
      case "account":
        return "Connected Account";
      case "ledger":
        return "On-Chain Ledger";
      default:
        return "Sanctuary";
    }
  };

  const currentProvider: WalletProvider = /lace/i.test(walletState.providerName || walletState.provider) ? 'Lace' : '1AM';
  const balanceDisplay = `${walletState.balanceDUST > 0 ? walletState.balanceDUST.toFixed(2) : '1,450.00'} tDUST / ${walletState.balanceNIGHT > 0 ? walletState.balanceNIGHT.toFixed(2) : '25.00'} NIGHT`;

  return (
    <header className="sticky top-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container shadow-[0_4px_20px_rgba(0,105,72,0.03)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo and Screen Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab("explore")}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-sm overflow-hidden p-1">
              <img
                src="/assets/logo.png"
                alt="VeilCircle Logo"
                className="w-full h-full object-contain filter brightness-110"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="material-symbols-outlined text-[20px] text-white hidden font-variation-fill">shield_with_heart</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-on-surface tracking-tight leading-none">
                VeilCircle
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium leading-none mt-1">
                {getSubheaderTitle()}
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low p-1 rounded-xl shadow-xs">
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "explore"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
              <span>Circles</span>
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "vault"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">vpn_key</span>
              <span>ZK Vault</span>
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "studio"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>ZK Prover</span>
            </button>
            <button
              onClick={() => setActiveTab("sanctuary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sanctuary"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">spa</span>
              <span>Sanctuary</span>
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "account"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">account_circle</span>
              <span>Account</span>
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "ledger"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Ledger</span>
            </button>
          </nav>

          {/* Right Action: Shield Badge & LaceWalletBar */}
          <div className="flex items-center gap-3">
            {/* Shielded Indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-surface-container-low shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
                Shielded • Midnight ZK
              </span>
            </div>

            {/* LaceWalletBar Component */}
            <LaceWalletBar
              walletConnected={walletState.isConnected}
              isConnecting={walletState.isConnecting}
              walletAddress={walletState.shieldedAddress || walletState.address || ""}
              nightBalance={balanceDisplay}
              walletProvider={currentProvider}
              onConnect={(provider) => {
                if (onConnectWalletProvider) {
                  onConnectWalletProvider(provider || "1AM");
                }
              }}
              onDisconnect={onDisconnectWallet}
              onOpenAccountTab={() => setActiveTab("account")}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
