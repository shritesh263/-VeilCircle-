import React, { useState } from "react";
import { LaceWalletState } from "../types";
import { NETWORKS } from "../services/midnight";

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

  return (
    <div className="flex flex-col w-full gap-5 animate-fade-in max-w-3xl mx-auto pb-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Subtle Atmospheric Accent Layer */}
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
    </div>
  );
};
