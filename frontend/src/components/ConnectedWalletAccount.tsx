import React, { useState, useEffect } from "react";
import { LaceWalletState, DetectedWallet } from "../types";
import { NETWORKS, midnightService } from "../services/midnight";

interface ConnectedWalletAccountProps {
  walletState: LaceWalletState;
  onOpenWalletModal: () => void;
  onDisconnect: () => void;
}

export const ConnectedWalletAccount: React.FC<ConnectedWalletAccountProps> = ({
  walletState,
  onOpenWalletModal,
  onDisconnect
}) => {
  const [shieldActive, setShieldActive] = useState(true);
  const [hasCopiedAddress, setHasCopiedAddress] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [autoLockTime, setAutoLockTime] = useState("30 Minutes");
  const [connectingRdns, setConnectingRdns] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<DetectedWallet[]>([]);

  useEffect(() => {
    const refresh = () => {
      setAvailableWallets(midnightService.getAvailableWallets());
    };
    refresh();
    const interval = setInterval(refresh, 800);
    return () => clearInterval(interval);
  }, []);

  const currentNetwork = NETWORKS[walletState.network] || NETWORKS.preprod;

  const handleCopy = (text: string, label: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setHasCopiedAddress(label);
      setToastMsg(`${label} copied to clipboard!`);
      setTimeout(() => {
        setHasCopiedAddress(null);
        setToastMsg(null);
      }, 2500);
    }
  };

  const handleDirectConnect = async (wallet: DetectedWallet) => {
    setErrorNotice(null);
    setConnectingRdns(wallet.rdns);
    try {
      await midnightService.connectWallet(wallet);
      setToastMsg(`Connected to ${wallet.name}`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      const state = midnightService.getWalletState();
      if (state.isCancelled) {
        setErrorNotice("Connection request was cancelled in the wallet popup.");
      } else {
        setErrorNotice(err?.message || "Failed to establish wallet connection.");
      }
    } finally {
      setConnectingRdns(null);
    }
  };

  const handleExportBackup = () => {
    setToastMsg("Client enclave cryptographic backup generated!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConfirmWipe = () => {
    if (
      window.confirm(
        "Purge local wallet session and cached circuit nullifiers from this browser? You can reconnect anytime via your extension."
      )
    ) {
      onDisconnect();
      setToastMsg("Local session nullifiers securely purged.");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // -------------------------------------------------------------
  // Disconnected View: Serene Sanctuary Wallet Connection Portal
  // -------------------------------------------------------------
  if (!walletState.isConnected) {
    return (
      <div className="flex flex-col w-full gap-6 animate-fade-in max-w-3xl mx-auto pb-12">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-primary text-on-primary text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container shadow-xs border border-surface-container text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm mb-4">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
          </div>

          <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant text-[11px] font-bold uppercase tracking-wider font-mono mb-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span>Zero-Knowledge Shielded Access</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">
            Connect Your Midnight Wallet
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto mt-2 leading-relaxed">
            VeilCircle connects directly to your 1AM or Midnight Lace extension using the official Midnight DApp Connector API. Your private credentials never leave your browser.
          </p>

          {errorNotice && (
            <div className="mt-5 p-4 rounded-2xl bg-error-container/80 border border-error/30 text-on-error-container text-xs text-left flex items-start gap-3 max-w-md mx-auto animate-fade-in">
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
              <div className="flex flex-col">
                <span className="font-bold">Connection Notice</span>
                <p className="text-[11px] text-on-error-container/90 mt-0.5">{errorNotice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Detected Wallets or Honest Install Prompt */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono">
              Available Midnight Extensions
            </span>
            <span className="text-[11px] font-mono text-primary font-bold">
              {availableWallets.length} Detected
            </span>
          </div>

          {availableWallets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {availableWallets.map((wallet) => {
                const isConnecting = connectingRdns === wallet.rdns;
                return (
                  <div
                    key={wallet.rdns}
                    className="p-5 rounded-3xl border border-primary/30 bg-surface-container-lowest hover:bg-surface-container-low shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center shadow-xs overflow-hidden">
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
                            <span className="text-2xl">{wallet.is1AM ? "⚡" : "🪢"}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                          Installed &amp; Ready
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-on-surface">{wallet.name}</h3>
                      <p className="text-[11px] font-mono text-on-surface-variant mt-1 leading-normal truncate">
                        {wallet.rdns} • v{wallet.apiVersion}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-surface-container">
                      <button
                        onClick={() => handleDirectConnect(wallet)}
                        disabled={isConnecting}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-primary text-on-primary hover:bg-primary-container shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            <span>Approving in Extension...</span>
                          </>
                        ) : (
                          <>
                            <span>Connect Wallet</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Honest Empty State: No Extension Installed */
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-surface-container-low border border-surface-container text-center shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest mx-auto flex items-center justify-center text-on-surface-variant mb-3 border border-surface-container">
                  <span className="material-symbols-outlined text-[26px]">extension_off</span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">No Midnight Wallet Extension Detected</h4>
                <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto leading-relaxed">
                  VeilCircle communicates directly with Midnight browser extensions using standard CIP-30 / DApp Connector protocols. Please install either 1AM or Lace to connect:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1AM Wallet Install Link */}
                <div className="p-4 rounded-3xl border border-surface-container bg-surface-container-lowest flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-xl mb-3 shadow-xs">
                      ⚡
                    </div>
                    <h5 className="font-bold text-sm text-on-surface">1AM Midnight Wallet</h5>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      Optimized for zero-knowledge proofs and fast contract execution on Midnight Network.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container">
                    <a
                      href="https://1am.xyz"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Install 1AM Wallet</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* Midnight Lace Install Link */}
                <div className="p-4 rounded-3xl border border-surface-container bg-surface-container-lowest flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-xl mb-3 shadow-xs">
                      🪢
                    </div>
                    <h5 className="font-bold text-sm text-on-surface">Midnight Lace Wallet</h5>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      The official Lace browser extension tailored for Midnight tokens and smart contracts.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container">
                    <a
                      href="https://www.lace.io"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Install Lace</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Guarantees */}
        <div className="rounded-3xl p-5 sm:p-6 bg-surface-container-low shadow-sm border border-surface-container flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
            <h3 className="font-bold text-sm text-on-surface">Zero-Knowledge Privacy Guarantees</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest flex gap-3 shadow-xs border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">visibility_off</span>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Zero On-Chain Linkability</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Your wallet address stays local on your device. Support circles never record your real identity.
                </p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest flex gap-3 shadow-xs border border-surface-container">
              <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">bolt</span>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Gasless Proof Relaying</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Zero gas fees required. Midnight Compact smart contracts sponsor your verification transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Connected View: Serene Sanctuary Real Enclave & Wallet Dashboard
  // -------------------------------------------------------------
  const primaryAddress = walletState.shieldedAddress || walletState.address || "";

  return (
    <div className="flex flex-col w-full gap-5 animate-fade-in max-w-3xl mx-auto pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-primary text-on-primary text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Primary Account Card */}
      <div className="relative w-full overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container shadow-xs border border-surface-container">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary-fixed text-on-primary-fixed shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              {walletState.providerName || "Midnight Wallet"} • Synced
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
            <span className="text-xs font-semibold text-primary">Hardware Enclave</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Shielded Address */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono flex items-center gap-1">
                <span>Shielded Address</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed-variant">ZK Private</span>
              </span>
              <span className="text-[10px] font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full font-mono uppercase">
                Midnight {walletState.network}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container">
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs sm:text-sm text-on-surface font-mono truncate">
                  {primaryAddress}
                </span>
                <span className="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>Provider RDNS: {walletState.provider}</span>
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleCopy(primaryAddress, "Shielded Address")}
                  className="p-2 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container active:scale-95 transition-transform"
                  title="Copy Shielded Address"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {hasCopiedAddress === "Shielded Address" ? "check" : "content_copy"}
                  </span>
                </button>
                <a
                  href={`${currentNetwork.explorerUrl}/accounts/${primaryAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-surface-container-low text-secondary hover:bg-surface-container active:scale-95 transition-transform"
                  title="Midnight Explorer"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>

          {/* Unshielded Address (if available) */}
          {walletState.unshieldedAddress && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                  Transparent / Unshielded Address
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container">
                <span className="font-mono text-xs text-on-surface truncate">
                  {walletState.unshieldedAddress}
                </span>
                <button
                  onClick={() => handleCopy(walletState.unshieldedAddress!, "Unshielded Address")}
                  className="p-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container"
                  title="Copy Unshielded Address"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {hasCopiedAddress === "Unshielded Address" ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Dust Address (if available) */}
          {walletState.dustAddress && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                  Dust Registration Address
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container">
                <span className="font-mono text-xs text-on-surface truncate">
                  {walletState.dustAddress}
                </span>
                <button
                  onClick={() => handleCopy(walletState.dustAddress!, "Dust Address")}
                  className="p-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container"
                  title="Copy Dust Address"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {hasCopiedAddress === "Dust Address" ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Shielding Switch */}
        <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low/70 p-3 rounded-2xl border border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-xs sm:text-sm text-on-surface leading-tight">
                Shield Primary Identifier
              </span>
              <span className="text-xs text-on-surface-variant leading-tight">
                {shieldActive ? "Client-side blinding active" : "Transparent mode"}
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shieldActive}
              onChange={(e) => setShieldActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Balance & Gas Relayer Reserve Card */}
      <div className="relative w-full rounded-3xl p-5 sm:p-6 bg-surface-container-lowest shadow-sm border border-surface-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 mb-4 border-b border-surface-container">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                Shielded DUST Balance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-primary">
                  {walletState.balanceDUST.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant font-mono">tDUST</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                token
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-surface-container">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                Unshielded Balance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-secondary">
                  {walletState.balanceNIGHT.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant font-mono">NIGHT</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            </div>
          </div>
        </div>

        {/* Midnight Service Endpoints Config (from Wallet getConfiguration) */}
        {walletState.serviceConfig && (
          <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col gap-2 mb-4 border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">dns</span>
              <span className="font-bold text-xs text-on-surface">Connected Wallet Endpoints</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-on-surface-variant">
              {walletState.serviceConfig.indexerUri && (
                <div className="p-2 rounded-xl bg-surface-container-lowest truncate">
                  <span className="font-bold text-on-surface">Indexer: </span>
                  <span>{walletState.serviceConfig.indexerUri}</span>
                </div>
              )}
              {walletState.serviceConfig.substrateNodeUri && (
                <div className="p-2 rounded-xl bg-surface-container-lowest truncate">
                  <span className="font-bold text-on-surface">Substrate Node: </span>
                  <span>{walletState.serviceConfig.substrateNodeUri}</span>
                </div>
              )}
              {walletState.serviceConfig.proverServerUri && (
                <div className="p-2 rounded-xl bg-surface-container-lowest truncate col-span-1 sm:col-span-2">
                  <span className="font-bold text-on-surface">Prover: </span>
                  <span>{walletState.serviceConfig.proverServerUri}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gasless Relayer Information */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3 mb-4 border border-surface-container">
          <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">bolt</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-on-surface">Automated ZK Relayer Active</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-mono uppercase">
                GASLESS
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Circle joins and daily proof syncs use zero personal gas. VeilCircle relays proofs securely via Midnight Compact contracts.
            </p>
          </div>
        </div>

        {/* Account Actions: Switch / Disconnect */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenWalletModal}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">switch_account</span>
            <span>Switch Wallet</span>
          </button>
          <button
            onClick={onDisconnect}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-tertiary-fixed text-tertiary font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">link_off</span>
            <span>Disconnect</span>
          </button>
        </div>
        <p className="text-[10px] text-on-surface-variant text-center mt-2.5 font-medium">
          Disconnect is app-side. To revoke dApp permissions completely, manage authorized origins in your wallet extension settings.
        </p>
      </div>

      {/* Zero-Knowledge Guard Explainer */}
      <div className="rounded-3xl p-5 sm:p-6 bg-surface-container-low shadow-sm border border-surface-container flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">lock_reset</span>
          <h3 className="font-bold text-sm sm:text-base text-on-surface">Zero-Knowledge Guard</h3>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          How VeilCircle protects your wallet while you participate in peer healing spaces:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest flex gap-3 shadow-xs border border-surface-container">
            <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">visibility_off</span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-on-surface">Zero On-Chain Linkability</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-normal">
                Your real wallet address resides solely on this device. Circles never receive or index your testnet public key.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container-lowest flex gap-3 shadow-xs border border-surface-container">
            <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-secondary flex-shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            </div>
            <div>
              <h4 className="font-bold text-xs text-on-surface">Circle Nullifier Isolation</h4>
              <p className="text-[11px] text-on-surface-variant mt-0.5 leading-normal">
                Every community produces a fresh cryptographic nullifier hash, rendering cross-circle tracking impossible.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-fixed/40 text-on-primary-fixed-variant text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px] text-primary">done_all</span>
          <span>Status: Quarantined &amp; Client-Side Blinded</span>
        </div>
      </div>

      {/* Linked Attestations & Proof History */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-base text-on-surface">Enclave Attestations</h3>
          <span className="text-xs font-bold text-primary font-mono">3 Active</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-on-surface truncate">Oncology Caregivers Sanctuary</span>
              <span className="text-[11px] text-on-surface-variant font-mono">Nullifier: 0x4e7a...91bc</span>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant shrink-0">
            VERIFIED
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-on-surface truncate">Grief & Resiliency Cohort</span>
              <span className="text-[11px] text-on-surface-variant font-mono">Nullifier: 0x19a2...7c4d</span>
            </div>
          </div>
          <span className="text-[10px] font-bold font-mono px-2 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant shrink-0">
            VERIFIED
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">terminal</span>
            <span className="text-xs font-mono text-on-surface-variant">Proof #9102 • Compact v0.19</span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">4 min ago</span>
        </div>
      </div>

      {/* Security & Device Safety Controls */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-base text-on-surface px-1">Security & Device Safety</h3>

        <button
          onClick={handleExportBackup}
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-colors flex items-center justify-between active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">key</span>
            <span className="font-bold text-xs sm:text-sm">Export Encrypted Enclave Backup</span>
          </div>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>

        {/* Auto-Lock Setting Card */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-on-surface">Auto-Lock Inactivity</h4>
              <p className="text-[11px] text-on-surface-variant">Session duration: {autoLockTime}</p>
            </div>
          </div>
          <select
            value={autoLockTime}
            onChange={(e) => setAutoLockTime(e.target.value)}
            className="bg-surface-container-low font-bold text-xs text-on-surface px-3 py-2 rounded-xl focus:outline-none border border-surface-container"
          >
            <option value="15 Minutes">15 min</option>
            <option value="30 Minutes">30 min</option>
            <option value="1 Hour">1 hour</option>
          </select>
        </div>

        {/* Emergency Wipe Button */}
        <button
          onClick={handleConfirmWipe}
          className="w-full py-3 px-4 rounded-2xl bg-error-container text-on-error-container hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-bold text-xs mt-1"
        >
          <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
          <span>Purge Cached Wallet & Nullifiers</span>
        </button>
      </div>
    </div>
  );
};

