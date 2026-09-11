import React, { useState } from "react";
import { LaceWalletState } from "../types";
import { NETWORKS } from "../services/midnight";

interface NavbarProps {
  walletState: LaceWalletState;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNetworkChange: (net: "preview" | "preprod") => void;
  activeCircleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletState,
  onOpenWalletModal,
  onDisconnectWallet,
  activeTab,
  setActiveTab,
  onNetworkChange
}) => {
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

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

  const handleCopyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const getProviderBadge = () => {
    switch (walletState.provider) {
      case "lace":
        return { icon: "🪢", name: "Lace", color: "bg-primary-fixed text-on-primary-fixed" };
      case "1am":
        return { icon: "⚡", name: "1AM", color: "bg-secondary-fixed text-on-secondary-fixed" };
      default:
        return { icon: "✨", name: "Sandbox", color: "bg-surface-container text-primary" };
    }
  };

  const providerBadge = getProviderBadge();

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

          {/* Right Action: Shield Badge & Wallet Account */}
          <div className="flex items-center gap-2.5">
            {/* Shielded Indicator */}
            <div className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-surface-container-low shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
                Shielded • Midnight ZK
              </span>
            </div>

            {/* Wallet Button / Dropdown */}
            {walletState.isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-surface-container transition-all shadow-sm"
                >
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${providerBadge.color}`}>
                    <span>{providerBadge.icon}</span>
                    <span>{providerBadge.name}</span>
                  </span>
                  
                  <span className="text-xs font-mono font-semibold text-on-surface pr-1">
                    {walletState.address?.slice(0, 6)}...{walletState.address?.slice(-4)}
                  </span>

                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary-fixed to-secondary-fixed flex items-center justify-center">
                    <img
                      src="/assets/avatar.png"
                      alt="Profile Avatar"
                      className="w-7 h-7 rounded-full object-cover shadow-xs"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isWalletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-3 bg-surface-container-lowest border border-surface-container rounded-2xl shadow-xl shadow-primary/5 z-50 animate-fade-in text-left">
                    <div className="p-3 mb-2 rounded-xl bg-surface-container-low">
                      <div className="text-[10px] uppercase font-bold text-on-surface-variant font-mono">
                        {walletState.providerName}
                      </div>
                      <div className="text-xs font-mono font-bold text-primary truncate mt-0.5">
                        {walletState.address}
                      </div>
                      <div className="flex items-center justify-between text-xs text-on-surface mt-2 pt-2 border-t border-surface-container">
                        <span>Shielded Balance:</span>
                        <span className="text-primary font-bold">{walletState.balanceDUST} tDUST</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-medium">
                      <button
                        onClick={handleCopyAddress}
                        className="w-full px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-low flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">content_copy</span>
                          <span>Copy Address</span>
                        </span>
                        {hasCopied && <span className="text-primary text-[11px] font-bold">Copied!</span>}
                      </button>

                      <button
                        onClick={() => {
                          setIsWalletMenuOpen(false);
                          setActiveTab("account");
                        }}
                        className="w-full px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">manage_accounts</span>
                        <span>Account &amp; Security</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsWalletMenuOpen(false);
                          onOpenWalletModal();
                        }}
                        className="w-full px-3 py-2 rounded-lg text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary">switch_account</span>
                        <span>Switch Wallet (Lace / 1AM)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsWalletMenuOpen(false);
                          onDisconnectWallet();
                        }}
                        className="w-full px-3 py-2 rounded-lg text-error hover:bg-error-container/30 flex items-center gap-2 transition-colors pt-2 border-t border-surface-container"
                      >
                        <span className="material-symbols-outlined text-[16px]">link_off</span>
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenWalletModal}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary hover:bg-primary-container text-on-primary shadow-sm shadow-primary/20 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
