import React, { useState } from "react";
import { Shield, Lock, Wallet, Globe, EyeOff, Terminal, Key, ChevronDown, Copy, Check, LogOut, RefreshCw, ExternalLink } from "lucide-react";
import { LaceWalletState } from "../types";
import { NETWORKS } from "../services/midnight";

interface NavbarProps {
  walletState: LaceWalletState;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNetworkChange: (net: "preview" | "preprod") => void;
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

  const currentNetwork = NETWORKS[walletState.network];

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
        return { icon: "🪢", name: "Lace", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" };
      case "1am":
        return { icon: "⚡", name: "1AM", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" };
      default:
        return { icon: "✨", name: "Sandbox", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" };
    }
  };

  const providerBadge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-900/40 bg-[#060814]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Pitch */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("explore")}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 shadow-lg shadow-cyan-500/20">
              <Shield className="w-6 h-6 text-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#060814] flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-black" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                  VeilCircle
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full font-mono">
                  Midnight ZK
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Prove you belong in a support group — without ever revealing who you are.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0b0e23] p-1.5 rounded-xl border border-indigo-950">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === "explore"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Explore Circles</span>
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === "vault"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Private Vault</span>
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === "privacy"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>Privacy Inspector</span>
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                activeTab === "ledger"
                  ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>On-Chain Ledger</span>
            </button>
          </nav>

          {/* Right Action: Network & Wallet Controls */}
          <div className="flex items-center space-x-3">
            {/* Network Selector */}
            <select
              value={walletState.network}
              onChange={(e) => onNetworkChange(e.target.value as "preview" | "preprod")}
              className="bg-[#0b0e23] text-xs font-mono font-medium text-slate-300 px-3 py-2.5 rounded-xl border border-indigo-900/60 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="preprod">Midnight Preprod</option>
              <option value="preview">Midnight Preview</option>
            </select>

            {/* Wallet Button / Dropdown */}
            {walletState.isConnected ? (
              <div className="relative">
                <button
                  onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                  className="flex items-center space-x-2.5 bg-[#0b0e23] border border-cyan-500/40 hover:border-cyan-500 px-3.5 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/5 text-left"
                >
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${providerBadge.color} flex items-center space-x-1`}>
                    <span>{providerBadge.icon}</span>
                    <span>{providerBadge.name}</span>
                  </span>
                  
                  <div className="font-mono">
                    <div className="text-[11px] font-bold text-white flex items-center space-x-1">
                      <span>{walletState.address?.slice(0, 8)}...{walletState.address?.slice(-5)}</span>
                    </div>
                    <div className="text-[9px] text-cyan-400">
                      {walletState.balanceDUST.toFixed(1)} DUST
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {isWalletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 p-3 bg-[#0b0e23] border border-indigo-900 rounded-2xl shadow-2xl shadow-black/80 z-50 animate-fade-in font-sans">
                    <div className="p-2.5 mb-2 rounded-xl bg-[#060814] border border-indigo-950 font-mono">
                      <div className="text-[10px] text-slate-400">Connected via {walletState.providerName}</div>
                      <div className="text-xs font-bold text-cyan-300 truncate mt-0.5">{walletState.address}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-300 mt-2 pt-2 border-t border-indigo-950">
                        <span>Balance:</span>
                        <span className="text-emerald-400 font-bold">{walletState.balanceDUST} DUST</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        onClick={handleCopyAddress}
                        className="w-full px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center justify-between transition-colors"
                      >
                        <span className="flex items-center space-x-2">
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </span>
                        {hasCopied && <span className="text-emerald-400 text-[10px]">Copied!</span>}
                      </button>

                      <button
                        onClick={() => {
                          setIsWalletMenuOpen(false);
                          onOpenWalletModal();
                        }}
                        className="w-full px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center space-x-2 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Switch Wallet (Lace / 1AM)</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsWalletMenuOpen(false);
                          onDisconnectWallet();
                        }}
                        className="w-full px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 flex items-center space-x-2 transition-colors pt-2 border-t border-indigo-950"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenWalletModal}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
