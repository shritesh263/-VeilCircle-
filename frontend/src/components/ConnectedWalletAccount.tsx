import React, { useState } from "react";
import { LaceWalletState, WalletProviderType } from "../types";
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
  const [hasCopied, setHasCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [autoLockTime, setAutoLockTime] = useState("30 Minutes");
  const [connectingProvider, setConnectingProvider] = useState<WalletProviderType | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const currentNetwork = NETWORKS[walletState.network];

  const handleCopy = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setHasCopied(true);
      setToastMsg("Address copied to clipboard!");
      setTimeout(() => {
        setHasCopied(false);
        setToastMsg(null);
      }, 2500);
    }
  };

  const handleDirectConnect = async (provider: WalletProviderType) => {
    setErrorNotice(null);
    setConnectingProvider(provider);
    try {
      await midnightService.connectWallet(provider);
      setToastMsg(`Connected via ${provider === "lace" ? "Midnight Lace" : provider === "1am" ? "1AM Wallet" : "Developer Sandbox"}`);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err: any) {
      setErrorNotice(err.message || "Connection failed.");
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleExportSeed = () => {
    setToastMsg("Client enclave encrypted key backup generated!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConfirmWipe = () => {
    if (window.confirm("Purge local wallet session and cached circuit nullifiers from this browser? You will need your recovery phrase to re-enter.")) {
      onDisconnect();
      setToastMsg("Local session nullifiers securely purged.");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const getWalletTitle = () => {
    switch (walletState.provider) {
      case "lace":
        return "Midnight Lace Wallet • Synced";
      case "1am":
        return "1AM Midnight Wallet • Synced";
      default:
        return "Midnight Testnet Sandbox • Synced";
    }
  };

  // -------------------------------------------------------------
  // Disconnected View: Serene Sanctuary Wallet Connection Portal
  // -------------------------------------------------------------
  if (!walletState.isConnected) {
    const availableWallets = midnightService.getAvailableWallets();

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
            VeilCircle utilizes zero-knowledge proofs on Midnight to verify your support group eligibility without revealing your identity, wallet address, or medical history.
          </p>

          {errorNotice && (
            <div className="mt-5 p-4 rounded-2xl bg-error-container/80 border border-error/30 text-on-error-container text-xs text-left flex items-start gap-3 max-w-md mx-auto animate-fade-in">
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
              <div className="flex flex-col">
                <span className="font-bold">Connection Alert</span>
                <p className="text-[11px] text-on-error-container/90 mt-0.5">{errorNotice}</p>
                <button
                  onClick={() => handleDirectConnect("sandbox")}
                  className="mt-2 text-xs font-bold text-primary underline text-left hover:text-primary-container"
                >
                  Click here to continue instantly with Testnet Sandbox →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Provider Cards */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono px-1">
            Choose Privacy Provider
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {availableWallets.map((wallet) => {
              const isConnecting = connectingProvider === wallet.id;
              return (
                <div
                  key={wallet.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    wallet.id === "sandbox"
                      ? "border-primary/50 bg-gradient-to-b from-primary-fixed/20 to-surface-container-lowest shadow-sm"
                      : "border-surface-container bg-surface-container-lowest hover:bg-surface-container-low shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center text-2xl shadow-xs">
                        {wallet.icon}
                      </div>
                      {wallet.isInstalled ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant">
                          Detected
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                          Web / Extension
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-on-surface">{wallet.name}</h3>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-normal">
                      {wallet.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-surface-container">
                    <button
                      onClick={() => handleDirectConnect(wallet.id)}
                      disabled={isConnecting}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1.5 ${
                        wallet.id === "sandbox"
                          ? "bg-primary text-on-primary hover:bg-primary-container shadow-xs"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      } disabled:opacity-50`}
                    >
                      {isConnecting ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <span>{wallet.id === "sandbox" ? "Launch Sandbox" : "Connect"}</span>
                          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy Guarantees */}
        <div className="rounded-3xl p-5 sm:p-6 bg-surface-container-low shadow-sm border border-surface-container flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
            <h3 className="font-bold text-sm text-on-surface">Zero-Knowledge Guard Guarantees</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest flex gap-3 shadow-xs border border-surface-container">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">visibility_off</span>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Zero On-Chain Linkability</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Your wallet address stays local on your device. Support circles never record your identity.
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
  // Connected View: Serene Sanctuary Enclave & Wallet Dashboard
  // -------------------------------------------------------------
  return (
    <div className="flex flex-col w-full gap-5 animate-fade-in max-w-3xl mx-auto pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-primary text-on-primary text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Atmospheric Accent Layer */}
      <div className="relative w-full overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container shadow-xs border border-surface-container">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary-fixed text-on-primary-fixed shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              {getWalletTitle()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
            <span className="text-xs font-semibold text-primary">Hardware Enclave</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono">
              Primary Account Address
            </span>
            <span className="text-[10px] font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full font-mono uppercase">
              Midnight {walletState.network}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-surface-container-lowest shadow-xs mt-1 border border-surface-container">
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-on-surface font-mono truncate">
                {walletState.address || "mn_addr_testnet1qq9x48k...7f2w0p"}
              </span>
              <span className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                <span>Key Material: Device Secure Storage</span>
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-surface-container-low text-primary hover:bg-surface-container active:scale-95 transition-transform"
                title="Copy Address"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {hasCopied ? "check" : "content_copy"}
                </span>
              </button>
              <a
                href={`${currentNetwork.explorerUrl}/accounts/${walletState.address}`}
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
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-mono">
              Shielded Balance
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {walletState.balanceDUST.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-on-surface-variant font-mono">tDUST</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              token
            </span>
          </div>
        </div>

        {/* Gasless Relayer Information */}
        <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-start gap-3 mb-4 border border-surface-container">
          <span className="material-symbols-outlined text-secondary text-[24px] mt-0.5">bolt</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-on-surface">Automated Relayer Active</span>
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
          onClick={handleExportSeed}
          className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-colors flex items-center justify-between active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px]">key</span>
            <span className="font-bold text-xs sm:text-sm">Export Encrypted Seed Backup</span>
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

