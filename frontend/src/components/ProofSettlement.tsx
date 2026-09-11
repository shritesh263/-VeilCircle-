import React, { useState } from "react";
import { Circle, ZkProofDetails } from "../types";

interface ProofSettlementProps {
  circle: Circle;
  proofDetails: ZkProofDetails;
  onEnterSanctuary: () => void;
  onBackToCircles: () => void;
}

export const ProofSettlement: React.FC<ProofSettlementProps> = ({
  circle,
  proofDetails,
  onEnterSanctuary,
  onBackToCircles
}) => {
  const [hasCopiedNullifier, setHasCopiedNullifier] = useState(false);

  const handleCopyNullifier = () => {
    navigator.clipboard.writeText(proofDetails.nullifierHash || "0x4e7a...91bc");
    setHasCopiedNullifier(true);
    setTimeout(() => setHasCopiedNullifier(false), 2000);
  };

  return (
    <div className="flex flex-col w-full gap-5 animate-fade-in max-w-3xl mx-auto pb-8">
      {/* Status Celebration Card */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 sm:p-8 shadow-[0_12px_32px_-6px_rgba(0,105,72,0.06)] text-center flex flex-col items-center border border-surface-container">
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none"></div>

        {/* Serene Halo Checkmark */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary-fixed/40 flex items-center justify-center animate-pulse">
            <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center shadow-[0_4px_16px_rgba(0,105,72,0.18)]">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'wght' 700" }}>
                verified
              </span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-surface-container-low mb-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
            ZK-SNARK Verification Complete
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
          Eligibility Cryptographically Proven
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mt-1 leading-relaxed">
          Your confidential health conditions have been validated in zero-knowledge. Your privacy boundary is fully locked.
        </p>
      </div>

      {/* Midnight Blockchain Transaction Verification Receipt */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 sm:p-6 shadow-sm border border-surface-container flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">Compact Contract Settlement</h3>
              <span className="text-xs text-on-surface-variant">Midnight Layer 1 Verification</span>
            </div>
          </div>
          <span className="py-0.5 px-2.5 rounded-full bg-primary-fixed/40 text-[10px] font-bold uppercase text-primary font-mono">
            PASSED
          </span>
        </div>

        {/* Receipt Items Box */}
        <div className="rounded-xl bg-surface-container-low p-4 space-y-3 text-xs border border-surface-container">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
              <span>Compact Contract</span>
            </span>
            <code className="text-secondary font-mono font-semibold bg-surface-container-lowest px-2 py-0.5 rounded">
              {proofDetails.contractFile || "veil_circle_v2.compact"}
            </code>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">security</span>
              <span>Shielded Validator</span>
            </span>
            <span className="font-semibold text-primary flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>{proofDetails.validatorNode || "Midnight Node #12"}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-1 border-t border-surface-container">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                <span>Circle Nullifier Hash</span>
              </span>
              <button
                onClick={handleCopyNullifier}
                className="flex items-center gap-1 text-secondary hover:text-on-secondary-fixed-variant transition-colors font-mono font-semibold"
              >
                <span>{proofDetails.nullifierHash || "0x4e7a...91bc"}</span>
                <span className="material-symbols-outlined text-[15px]">
                  {hasCopiedNullifier ? "check" : "content_copy"}
                </span>
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed pl-5">
              Guarantees strictly 1-member-1-seat without sybil vulnerabilities, cryptographically confined to this circle.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-surface-container">
            <span className="text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">local_gas_station</span>
              <span>Gas &amp; Relayer Fee</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="line-through text-outline text-[11px]">0.024 DUST</span>
              <span className="font-bold text-[10px] text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full font-mono uppercase">
                Sponsored
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ephemeral Identity Minting Card */}
      <div className="rounded-2xl bg-surface-container-lowest p-5 sm:p-6 shadow-sm border border-surface-container flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary font-mono">
                Session Identity
              </span>
              <span className="material-symbols-outlined text-[14px] text-secondary">auto_awesome</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">
              {proofDetails.ephemeralGuardianId || "Veil Guardian #419"}
            </h3>
            <p className="text-xs text-on-surface-variant">
              Ephemeral identity minted exclusively for {circle.title}
            </p>
          </div>

          <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-secondary-fixed via-tertiary-fixed to-primary-fixed flex items-center justify-center shadow-sm shrink-0">
            <img
              src="/assets/avatar.png"
              alt="Ephemeral Avatar"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80";
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-surface-container-low p-3.5 flex flex-col justify-between border border-surface-container">
            <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">timer</span>
              <span>Session Key Expiry</span>
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-bold text-sm text-on-surface">23h 59m</span>
              <span className="text-[10px] text-tertiary font-mono">Auto-wipe</span>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-low p-3.5 flex flex-col justify-between border border-surface-container">
            <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">groups_3</span>
              <span>Anonymity Set</span>
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="font-bold text-sm text-on-surface">1,420</span>
              <span className="text-[10px] text-secondary font-mono">Peers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Reassurance Note */}
      <div className="rounded-xl bg-surface-container p-4 flex items-start gap-3 border border-surface-container-high/40">
        <div className="w-7 h-7 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-on-primary mt-0.5">
          <span className="material-symbols-outlined text-[16px]">lock_shield</span>
        </div>
        <div>
          <span className="font-bold text-xs text-on-surface">Zero Medical Linkability Guaranteed</span>
          <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            No wallet address, personal IP, or on-chain history can link your identity back to your personal health records or clinical source.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={onBackToCircles}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-all"
        >
          Back to Circles Directory
        </button>
        <button
          onClick={onEnterSanctuary}
          className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary-container text-on-primary shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Enter Protected Sanctuary</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
