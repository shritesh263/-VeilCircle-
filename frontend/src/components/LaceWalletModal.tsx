import React, { useState, useEffect } from "react";
import { DetectedWallet } from "../types";
import { midnightService } from "../services/midnight";

interface LaceWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (provider: string) => void;
  network: "preview" | "preprod";
}

export const LaceWalletModal: React.FC<LaceWalletModalProps> = ({
  isOpen,
  onClose,
  network
}) => {
  const [connectingRdns, setConnectingRdns] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [wallets, setWallets] = useState<DetectedWallet[]>([]);

  const refreshWallets = () => {
    const list = midnightService.getAvailableWallets();
    setWallets(list);
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsCancelled(false);
      setConnectingRdns(null);
      refreshWallets();

      // Periodic check for delayed wallet injection
      const interval = setInterval(refreshWallets, 500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectWallet = async (wallet: DetectedWallet) => {
    setErrorMsg(null);
    setIsCancelled(false);
    setConnectingRdns(wallet.rdns);
    try {
      await midnightService.connectWallet(wallet);
      onClose();
    } catch (err: any) {
      const state = midnightService.getWalletState();
      if (state.isCancelled) {
        setIsCancelled(true);
        setErrorMsg("Connection request was cancelled in the wallet popup.");
      } else {
        setErrorMsg(err?.message || "Failed to establish wallet connection.");
      }
    } finally {
      setConnectingRdns(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-surface-container-lowest border border-surface-container rounded-3xl shadow-2xl shadow-primary/10 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                Midnight DApp Connector API
              </span>
              <span className="text-[10px] font-mono text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full uppercase font-bold">
                {network}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">Connect Midnight Wallet</h3>
            <p className="text-xs text-on-surface-variant font-medium">Authorizes zero-knowledge proofs via your browser extension</p>
          </div>
        </div>

        {/* Cancellation Notice */}
        {isCancelled && (
          <div className="p-4 mb-5 rounded-2xl bg-surface-container-low border border-surface-container text-on-surface text-xs flex items-center gap-3 animate-fade-in">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">info</span>
            <div className="flex flex-col">
              <span className="font-bold">Connection Cancelled</span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">The connection prompt was closed. Click Connect on your wallet below to try again.</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && !isCancelled && (
          <div className="p-4 mb-5 rounded-2xl bg-error-container/80 border border-error/30 text-on-error-container text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
              <div className="flex flex-col">
                <span className="font-bold">Connection Error</span>
                <p className="text-[11px] text-on-error-container/90 mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Discovered Wallets Picker */}
        {wallets.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
              Select an installed Midnight wallet extension to connect:
            </p>

            {wallets.map((wallet) => {
              const isConnecting = connectingRdns === wallet.rdns;
              return (
                <div
                  key={wallet.rdns}
                  className="p-4 rounded-2xl border border-primary/30 bg-surface-container-low hover:bg-surface-container transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                        {wallet.icon ? (
                          <img
                            src={wallet.icon}
                            alt={wallet.name}
                            className="w-8 h-8 rounded-lg object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-[24px]">wallet</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-on-surface truncate">{wallet.name}</h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                            Live Extension
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-on-surface-variant mt-0.5 truncate">
                          {wallet.rdns} • v{wallet.apiVersion}
                        </p>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0">
                      <button
                        onClick={() => handleSelectWallet(wallet)}
                        disabled={isConnecting}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                      >
                        {isConnecting ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            <span>Approving...</span>
                          </>
                        ) : (
                          <>
                            <span>Connect</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Honest Empty State: No Extension Installed */
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container text-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest mx-auto flex items-center justify-center text-on-surface-variant mb-3 border border-surface-container">
                <span className="material-symbols-outlined text-[26px]">extension_off</span>
              </div>
              <h4 className="font-bold text-sm text-on-surface">No Midnight Wallet Detected</h4>
              <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto leading-relaxed">
                VeilCircle requires an official Midnight browser extension to verify zero-knowledge proofs. Please install one of the supported wallets below and refresh:
              </p>
            </div>

            <div className="space-y-2.5">
              {/* 1AM Wallet Install Link */}
              <div className="p-3.5 rounded-2xl border border-surface-container bg-surface-container-lowest flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-xl shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-on-surface">1AM Midnight Wallet</h5>
                    <p className="text-[11px] text-on-surface-variant">Purpose-built for Midnight Network & ZK circuits</p>
                  </div>
                </div>
                <a
                  href="https://1am.xyz"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Install 1AM</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>

              {/* Midnight Lace Install Link */}
              <div className="p-3.5 rounded-2xl border border-surface-container bg-surface-container-lowest flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-xl shrink-0">
                    🪢
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-on-surface">Midnight Lace Wallet</h5>
                    <p className="text-[11px] text-on-surface-variant">Official Lace edition for Midnight tokens</p>
                  </div>
                </div>
                <a
                  href="https://www.lace.io"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <span>Install Lace</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Security & Privacy Badge */}
        <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant font-mono">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span>Zero private witness data is ever shared with extensions.</span>
          </div>
          <span className="text-[10px] text-primary font-bold">Midnight Enclave</span>
        </div>
      </div>
    </div>
  );
};


