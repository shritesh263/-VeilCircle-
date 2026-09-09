import React, { useState } from "react";
import { Wallet, ShieldCheck, CheckCircle2, Sparkles, ExternalLink, RefreshCw, AlertCircle, Shield, Key, ArrowRight } from "lucide-react";
import { WalletProviderType } from "../types";
import { midnightService } from "../services/midnight";

interface LaceWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (provider: WalletProviderType) => void;
  network: "preview" | "preprod";
}

export const LaceWalletModal: React.FC<LaceWalletModalProps> = ({
  isOpen,
  onClose,
  network
}) => {
  const [connectingProvider, setConnectingProvider] = useState<WalletProviderType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableWallets = midnightService.getAvailableWallets();

  const handleSelectProvider = async (provider: WalletProviderType) => {
    setErrorMsg(null);
    setConnectingProvider(provider);
    try {
      await midnightService.connectWallet(provider);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to establish connection.");
    } finally {
      setConnectingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-[#0b0e23] border border-indigo-900/80 rounded-3xl shadow-2xl shadow-cyan-500/10 my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 rounded-2xl text-cyan-400 shadow-md shadow-cyan-500/10">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Midnight Multi-Wallet Connector
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Connect Wallet</h3>
            <p className="text-xs text-slate-400 font-mono">Target Network: Midnight {network.toUpperCase()}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 mb-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
            <div className="pt-2 border-t border-rose-900/40 flex items-center justify-between">
              <span className="text-[11px] text-slate-300">Want to test without installing an extension?</span>
              <button
                onClick={() => handleSelectProvider("sandbox")}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center space-x-1"
              >
                <span>Use Sandbox Demo</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          Select your preferred Midnight wallet to interact with zero-knowledge circuits and balance transaction fees without leaking identity.
        </p>

        {/* Provider Cards */}
        <div className="space-y-3">
          {availableWallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`p-4 rounded-2xl border transition-all ${
                wallet.isInstalled
                  ? "border-cyan-500/40 bg-cyan-950/15 hover:bg-cyan-900/25 hover:border-cyan-500"
                  : "border-indigo-950 bg-[#060814]/80 hover:border-indigo-900"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-900 flex items-center justify-center text-xl flex-shrink-0">
                    {wallet.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-white">{wallet.name}</h4>
                      {wallet.isInstalled ? (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Ready
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          Not Detected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">{wallet.description}</p>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex-shrink-0">
                  {wallet.isInstalled ? (
                    <button
                      onClick={() => handleSelectProvider(wallet.id)}
                      disabled={connectingProvider === wallet.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {connectingProvider === wallet.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>Connect</span>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleSelectProvider(wallet.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Try Connect
                      </button>
                      <a
                        href={wallet.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                        title={`Install ${wallet.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Privacy Badge */}
        <div className="mt-6 pt-4 border-t border-indigo-950 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Zero witness data is ever exposed to wallet extensions.</span>
          </div>
          <span className="text-[10px] text-cyan-400">Midnight CIP-30</span>
        </div>
      </div>
    </div>
  );
};
