import React from "react";
import { Wallet, ShieldCheck, CheckCircle2, Sparkles, ExternalLink, KeyRound } from "lucide-react";

interface LaceWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (mode: "lace_extension" | "sandbox") => void;
  network: "preview" | "preprod";
}

export const LaceWalletModal: React.FC<LaceWalletModalProps> = ({
  isOpen,
  onClose,
  onConnect,
  network
}) => {
  if (!isOpen) return null;

  const hasLaceDetected = typeof window !== "undefined" && Boolean((window as any).midnight?.mnLace);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-[#0b0e23] border border-indigo-900/80 rounded-2xl shadow-2xl shadow-cyan-500/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Connect Midnight Wallet</h3>
            <p className="text-xs text-slate-400 font-mono">Target Network: Midnight {network.toUpperCase()}</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          VeilCircle interacts with Midnight's zero-knowledge layer using the Lace wallet connector to sign transactions and balance fees without exposing your private witness.
        </p>

        <div className="space-y-3">
          {/* Lace Extension Option */}
          <button
            onClick={() => {
              onConnect("lace_extension");
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-900/30 transition-all flex items-center justify-between group text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold">
                🪢
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-2">
                  <span>Midnight Lace Extension</span>
                  {hasLaceDetected ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Detected
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                      Auto-Fallback
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">Official browser extension for Midnight ZK tokens &amp; contracts</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-300" />
          </button>

          {/* Testnet Sandbox Session */}
          <button
            onClick={() => {
              onConnect("sandbox");
              onClose();
            }}
            className="w-full p-4 rounded-xl border border-indigo-900/60 bg-indigo-950/20 hover:bg-indigo-900/30 transition-all flex items-center justify-between group text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center space-x-2">
                  <span>Interactive Testnet Sandbox</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    Instant Demo
                  </span>
                </div>
                <div className="text-xs text-slate-400">Pre-funded Midnight testnet session with 850 DUST &amp; 25 NIGHT</div>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-slate-500 group-hover:text-indigo-300" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-indigo-950 flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Your private credentials and witness keys never leave your browser.</span>
        </div>
      </div>
    </div>
  );
};
