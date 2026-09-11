import React, { useState, useEffect } from "react";
import { WalletProviderType, WalletProviderInfo } from "../types";
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
  const [wallets, setWallets] = useState<WalletProviderInfo[]>([]);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setConnectingProvider(null);
      setWallets(midnightService.getAvailableWallets());

      // Re-scan after short delay in case extension injected asynchronously
      const timer = setTimeout(() => {
        setWallets(midnightService.getAvailableWallets());
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectProvider = async (provider: WalletProviderType) => {
    setErrorMsg(null);
    setConnectingProvider(provider);
    try {
      await midnightService.connectWallet(provider);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to establish wallet connection.");
    } finally {
      setConnectingProvider(null);
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
                Midnight CIP-30
              </span>
              <span className="text-[10px] font-mono text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full uppercase font-bold">
                {network}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">Connect Shielded Wallet</h3>
            <p className="text-xs text-on-surface-variant font-medium">Select your Midnight or Cardano privacy provider</p>
          </div>
        </div>

        {/* Error Alert with Quick Sandbox Recovery */}
        {errorMsg && (
          <div className="p-4 mb-5 rounded-2xl bg-error-container/70 border border-error/30 text-on-error-container text-xs space-y-2.5 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
              <div className="flex flex-col">
                <span className="font-bold text-on-error-container">Connection Notice</span>
                <p className="text-[11px] text-on-error-container/90 mt-0.5 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-error/20 flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="text-[11px] text-on-surface-variant font-medium">Test instantly without installing extensions:</span>
              <button
                onClick={() => handleSelectProvider("sandbox")}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Launch Sandbox</span>
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
          VeilCircle interacts with zero-knowledge circuits and relays proofs gaslessly. Select a wallet below to authenticate:
        </p>

        {/* Provider Cards */}
        <div className="space-y-3">
          {wallets.map((wallet) => {
            const isConnecting = connectingProvider === wallet.id;
            return (
              <div
                key={wallet.id}
                className={`p-4 rounded-2xl border transition-all ${
                  wallet.isInstalled
                    ? "border-primary/40 bg-surface-container-low hover:bg-surface-container hover:border-primary shadow-xs"
                    : "border-surface-container bg-surface-container-lowest hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {wallet.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-on-surface truncate">{wallet.name}</h4>
                        {wallet.isInstalled ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                            Detected
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                            Not Installed
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-normal line-clamp-1">
                        {wallet.description}
                      </p>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="shrink-0">
                    {wallet.isInstalled ? (
                      <button
                        onClick={() => handleSelectProvider(wallet.id)}
                        disabled={isConnecting}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
                      >
                        {isConnecting ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <span>Connect</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSelectProvider(wallet.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                        >
                          Try
                        </button>
                        <a
                          href={wallet.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary transition-colors"
                          title={`Install ${wallet.name}`}
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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

