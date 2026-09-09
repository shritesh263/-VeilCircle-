import React from "react";
import { Shield, Lock, Wallet, Activity, Globe, EyeOff, Terminal, Key } from "lucide-react";
import { LaceWalletState, NetworkConfig } from "../types";
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
  const currentNetwork = NETWORKS[walletState.network];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-900/40 bg-[#060814]/80 backdrop-blur-xl">
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
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
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

          {/* Right Action: Network Switcher & Wallet */}
          <div className="flex items-center space-x-3">
            {/* Network Selector */}
            <div className="relative">
              <select
                value={walletState.network}
                onChange={(e) => onNetworkChange(e.target.value as "preview" | "preprod")}
                className="bg-[#0b0e23] text-xs font-mono font-medium text-slate-300 px-3 py-2 rounded-lg border border-indigo-900/60 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="preprod">Midnight Preprod</option>
                <option value="preview">Midnight Preview</option>
              </select>
            </div>

            {/* Wallet Button */}
            {walletState.isConnected ? (
              <div className="flex items-center space-x-2 bg-[#0b0e23] border border-cyan-500/40 px-3.5 py-2 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <div className="text-left font-mono">
                  <div className="text-[11px] font-bold text-cyan-300">
                    {walletState.address?.slice(0, 10)}...{walletState.address?.slice(-6)}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {walletState.balanceDUST.toFixed(1)} DUST ({walletState.mode === "lace_extension" ? "Lace" : "Sandbox"})
                  </div>
                </div>
                <button
                  onClick={onDisconnectWallet}
                  className="ml-2 text-xs text-rose-400 hover:text-rose-300 transition-colors p-1"
                  title="Disconnect"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenWalletModal}
                className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Lace Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
