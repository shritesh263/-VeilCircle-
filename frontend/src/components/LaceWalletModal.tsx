import React, { useState, useEffect } from "react";
import { DetectedWallet } from "../types";
import { midnightService } from "../services/midnight";

interface LaceWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (provider: string) => void;
  network: "preview" | "preprod";
}

type ConnectionStage = "idle" | "popup_requested" | "verifying" | "connected" | "error";

export const LaceWalletModal: React.FC<LaceWalletModalProps> = ({
  isOpen,
  onClose,
  network
}) => {
  const [activeWallet, setActiveWallet] = useState<DetectedWallet | null>(null);
  const [stage, setStage] = useState<ConnectionStage>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<DetectedWallet[]>([]);

  const refreshWallets = () => {
    const list = midnightService.getAvailableWallets();
    setWallets(list);
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setStage("idle");
      setActiveWallet(null);
      setConnectedAddress(null);
      refreshWallets();

      const interval = setInterval(refreshWallets, 600);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectWallet = async (walletOrType: DetectedWallet | string) => {
    let walletObj: DetectedWallet;
    if (typeof walletOrType === "string") {
      walletObj = wallets.find((w) => w.id === walletOrType || w.rdns === walletOrType) || {
        id: walletOrType,
        rdns: walletOrType === "sandbox" ? "sandbox.midnight.testnet" : walletOrType,
        name: walletOrType === "sandbox" ? "Midnight Testnet Sandbox" : "Midnight Wallet",
        icon: "",
        apiVersion: "1.0.0",
        is1AM: /1am/i.test(walletOrType),
        isLace: /lace/i.test(walletOrType),
        api: {
          rdns: walletOrType,
          name: walletOrType,
          icon: "",
          apiVersion: "1.0.0",
          connect: async () => ({}) as any
        }
      };
    } else {
      walletObj = walletOrType;
    }

    setActiveWallet(walletObj);
    setStage("popup_requested");
    setErrorMsg(null);

    try {
      const state = await midnightService.connectWallet(walletOrType);
      setStage("connected");
      setConnectedAddress(state.shieldedAddress || state.address || "mn_connected");

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      const state = midnightService.getWalletState();
      const raw = err?.message || (state.isCancelled ? "Popup was closed before authorization." : "Connection failed.");
      
      setStage("error");
      setErrorMsg(raw);
    }
  };

  const handleRetry = () => {
    if (activeWallet) {
      handleConnectWallet(activeWallet);
    } else if (wallets.length > 0) {
      handleConnectWallet(wallets[0]);
    } else {
      setStage("idle");
    }
  };

  const handleSelectSandbox = async () => {
    handleConnectWallet("sandbox");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-surface-container-lowest border border-surface-container rounded-3xl shadow-2xl shadow-primary/10 my-6 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Dynamic Modal View: Next Steps Window vs Wallets List */}
        {stage === "idle" ? (
          /* STAGE 1: WALLET SELECTION */
          <div>
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
                <p className="text-xs text-on-surface-variant font-medium">
                  Trigger native browser extension approval popup within seconds
                </p>
              </div>
            </div>

            {/* Discovered Extensions */}
            {wallets.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
                  Select your installed wallet. Clicking will instantly launch the extension authorization popup:
                </p>

                {wallets.map((wallet) => {
                  const is1AM = wallet.is1AM || /1am/i.test(wallet.name) || /1am/i.test(wallet.rdns);
                  const isSandbox = wallet.id === "sandbox";

                  return (
                    <div
                      key={wallet.rdns}
                      onClick={() => handleConnectWallet(wallet)}
                      className={`p-4 rounded-2xl border transition-all shadow-xs cursor-pointer flex items-center justify-between gap-3 ${
                        isSandbox
                          ? "border-secondary/30 bg-surface-container-lowest hover:bg-secondary-fixed/20"
                          : "border-primary/30 bg-surface-container-low hover:bg-surface-container hover:border-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest border border-surface-container flex items-center justify-center shadow-xs shrink-0 overflow-hidden text-2xl">
                          {wallet.icon ? (
                            <img
                              src={wallet.icon}
                              alt={wallet.name}
                              className="w-8 h-8 rounded-lg object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : is1AM ? (
                            "⚡"
                          ) : isSandbox ? (
                            "🧪"
                          ) : (
                            "🪢"
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-on-surface truncate">{wallet.name}</h4>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isSandbox
                                  ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                                  : "bg-primary-fixed text-on-primary-fixed-variant"
                              }`}
                            >
                              {isSandbox ? "Instant Testnet" : "Live Extension"}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-on-surface-variant mt-0.5 truncate">
                            {wallet.rdns}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectWallet(wallet);
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container shadow-xs transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
                      >
                        <span>Connect</span>
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                      </button>
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
                    Install 1AM or Lace to connect, or use Instant Sandbox mode to test right away:
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
                        <p className="text-[11px] text-on-surface-variant">Built for Midnight ZK proofs &amp; contracts</p>
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
                        <p className="text-[11px] text-on-surface-variant">Official Lace edition for Midnight</p>
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

                  {/* Instant Sandbox Option */}
                  <button
                    onClick={handleSelectSandbox}
                    className="w-full p-3 rounded-2xl border border-secondary/40 bg-secondary-fixed/20 hover:bg-secondary-fixed/40 text-on-surface text-xs font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <span>🧪 Continue with Instant Testnet Sandbox</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STAGE 2: NEXT STEPS WINDOW */
          <div className="animate-fade-in space-y-5">
            {/* Header with Live Pulsing Wallet Icon */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-3xl shadow-md text-white">
                  {activeWallet?.is1AM || /1am/i.test(activeWallet?.name || "") ? "⚡" : activeWallet?.id === "sandbox" ? "🧪" : "🪢"}
                </div>
                {stage === "popup_requested" && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-surface-container-lowest"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                    {stage === "connected" ? "Connected" : stage === "error" ? "Action Required" : "Authorization In Progress"}
                  </span>
                  <span className="text-[10px] font-mono text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full uppercase font-bold">
                    {network}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mt-0.5">
                  {stage === "connected"
                    ? "Wallet Connected!"
                    : stage === "error"
                    ? "Connection Notice"
                    : `Connecting to ${activeWallet?.name || "Wallet"}...`}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  {stage === "connected"
                    ? "Zero-knowledge cryptographic session established"
                    : "Follow the next steps in your browser extension"}
                </p>
              </div>
            </div>

            {/* Success State */}
            {stage === "connected" ? (
              <div className="p-5 rounded-2xl bg-primary-fixed/30 border border-primary/40 text-on-surface text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary mx-auto flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[28px]">check</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Connection Successful</h4>
                  <p className="text-xs font-mono text-primary truncate max-w-xs mx-auto mt-1">
                    {connectedAddress}
                  </p>
                </div>
                <p className="text-[11px] text-on-surface-variant">Redirecting to your VeilCircle dashboard...</p>
              </div>
            ) : stage === "error" ? (
              /* Error / Cancelled State */
              <div className="p-5 rounded-2xl bg-error-container/80 border border-error/30 text-on-error-container space-y-3 animate-fade-in">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[24px] text-error shrink-0">error</span>
                  <div>
                    <h4 className="font-bold text-sm">Extension Request Incomplete</h4>
                    <p className="text-xs mt-1 leading-relaxed">{errorMsg}</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleRetry}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Re-open Extension Popup</span>
                  </button>
                  <button
                    onClick={() => setStage("idle")}
                    className="py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs"
                  >
                    Change Wallet
                  </button>
                </div>
              </div>
            ) : (
              /* Next Steps Interactive Progress Window */
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono flex items-center justify-between">
                    <span>Next Steps</span>
                    <span className="text-primary font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                      <span>Awaiting Action</span>
                    </span>
                  </div>

                  {/* Step 1 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-lowest border border-primary/30">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                        <span>Check Extension Popup Window</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed-variant font-mono">
                          POPUP OPENED
                        </span>
                      </h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                        A browser popup from <strong>{activeWallet?.name || "your wallet"}</strong> has opened. If you do not see it, check your browser toolbar or taskbar.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">Unlock Your Wallet</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                        If your extension is currently locked, enter your password or PIN in the popup to proceed.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                    <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-on-surface">Click &quot;Approve&quot; or &quot;Authorize&quot;</h5>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                        Grant VeilCircle permission to verify zero-knowledge proofs. No private keys or seed phrases are ever accessed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Helper & Controls */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handleRetry}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Popup didn&apos;t open? Click to re-trigger</span>
                  </button>

                  <button
                    onClick={() => setStage("idle")}
                    className="text-xs font-medium text-on-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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


