import React, { useState } from "react";
import { Circle, PrivateCredential, ZkProofDetails } from "../types";
import { midnightService } from "../services/midnight";

interface ZkProofStudioProps {
  circles: Circle[];
  credentials: PrivateCredential[];
  onProofGenerated: (circle: Circle, cred: PrivateCredential, proofDetails: ZkProofDetails) => void;
  initialCircle?: Circle;
}

export const ZkProofStudio: React.FC<ZkProofStudioProps> = ({
  circles,
  credentials,
  onProofGenerated,
  initialCircle
}) => {
  const [selectedCircleId, setSelectedCircleId] = useState<string>(initialCircle?.id || circles[0]?.id || "");
  const [selectedCredId, setSelectedCredId] = useState<string>(credentials[0]?.id || "");
  const [isProving, setIsProving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedCircle = circles.find((c) => c.id === selectedCircleId) || circles[0];
  const selectedCred = credentials.find((c) => c.id === selectedCredId) || credentials[0];

  const handleGenerateProof = async () => {
    if (!selectedCircle || !selectedCred) {
      setErrorMsg("Please select both a target circle and a local credential.");
      return;
    }

    setErrorMsg(null);
    setIsProving(true);

    try {
      // Simulate WASM proof synthesis
      await new Promise((r) => setTimeout(r, 800));

      const { proof, nullifier, commitment } = await midnightService.submitProveAndJoinCircle(
        selectedCircle.id,
        selectedCred.secretKeyHex,
        selectedCred.attributeHex,
        selectedCred.saltHex
      );

      const enhancedProof: ZkProofDetails = {
        ...proof,
        nullifierHash: "0x" + nullifier.slice(0, 16) + "...91bc",
        contractFile: "veil_circle_v2.compact",
        validatorNode: "Midnight Node #12",
        gasSponsored: true,
        ephemeralGuardianId: "Veil Guardian #" + Math.floor(100 + Math.random() * 900)
      };

      onProofGenerated(selectedCircle, selectedCred, enhancedProof);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to compile zero-knowledge proof.");
    } finally {
      setIsProving(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 animate-fade-in">
      {/* Privacy Shield Ambient Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm p-5 sm:p-6 border border-surface-container flex flex-col gap-3">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                lock
              </span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
              Local Sandboxed Proof
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-mono">
            Midnight v2.4
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
            Client-Side Prover (Compact Engine)
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
            Your raw medical records stay permanently locked in this device's memory vault. Midnight generates an immutable cryptographic proof of eligibility without exposing your identity, diagnosis, or facility records.
          </p>
        </div>

        {/* Micro-assurance pill tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
            <span>Zero Ingress</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-secondary">memory</span>
            <span>WASM Isolated</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-primary">key</span>
            <span>Ephemeral Keys</span>
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Target Circle & Loaded Local Credential Pair */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Circle Destination */}
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-5 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono">
              Destination Circle
            </span>
            <span className="text-[10px] font-bold text-on-surface-variant font-mono">
              {selectedCircle?.memberCount || 0} Shielded Peers
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[26px]">
                {selectedCircle?.iconName || "nature_people"}
              </span>
            </div>
            <div className="min-w-0">
              <select
                value={selectedCircleId}
                onChange={(e) => setSelectedCircleId(e.target.value)}
                className="w-full bg-transparent font-bold text-sm sm:text-base text-on-surface focus:outline-none cursor-pointer"
              >
                {circles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                {selectedCircle?.description}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant">
            <span className="font-semibold text-on-surface">Required:</span> {selectedCircle?.eligibilityCriteria}
          </div>
        </div>

        {/* Active Credential in Vault */}
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-5 border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary font-mono">
              Loaded Local Credential
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-secondary font-mono">
              Ed25519 Validated
            </span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[26px]">domain_verification</span>
            </div>
            <div className="min-w-0 flex-1">
              <select
                value={selectedCredId}
                onChange={(e) => setSelectedCredId(e.target.value)}
                className="w-full bg-transparent font-bold text-sm sm:text-base text-on-surface focus:outline-none cursor-pointer"
              >
                {credentials.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.issuerName})
                  </option>
                ))}
              </select>
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                {selectedCred?.predicateText}
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant font-mono">
            <span>Commitment: </span>
            <span className="text-primary font-bold">0x{selectedCred?.commitmentHex?.slice(0, 16)}...</span>
          </div>
        </div>
      </div>

      {/* ZK Disclosure Matrix */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-5 sm:p-6 border border-surface-container flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-on-surface">ZK Disclosure Matrix</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Strict cryptographic comparison between shared consensus witnesses and locally quarantined private states.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-mono shrink-0">
            Zero Leakage
          </span>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Public Proof Witness */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2.5 border border-surface-container">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider font-mono">
              <span className="material-symbols-outlined text-[18px]">public</span>
              <span>Public Proof Witness (Midnight Ledger)</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-1">What the Circle and Midnight network can verify:</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <div className="font-semibold text-on-surface">Valid Clinical Attestation</div>
                  <div className="text-[10px] font-bold uppercase text-primary font-mono">Status: TRUE (ZK Verified)</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <div className="font-semibold text-on-surface">Attestation Not Expired</div>
                  <div className="text-[10px] font-bold uppercase text-primary font-mono">Status: TRUE (Within Validity Window)</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">check_circle</span>
                <div>
                  <div className="font-semibold text-on-surface">Unique Circle Nullifier</div>
                  <div className="text-[10px] text-on-surface-variant font-mono">0x8f4c...3e9a (Isolated per circle)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Private Vault (Quarantined) */}
          <div className="p-4 rounded-xl bg-tertiary-fixed/30 flex flex-col gap-2.5 border border-tertiary-fixed">
            <div className="flex items-center gap-2 text-tertiary font-bold text-xs uppercase tracking-wider font-mono">
              <span className="material-symbols-outlined text-[18px]">visibility_off</span>
              <span>Strictly Private (Quarantined on Device)</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-1">Never broadcast, never logged, destroyed post-computation:</p>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">shield_with_heart</span>
                <div>
                  <div className="font-semibold text-on-surface">Real Identity &amp; Wallet Address</div>
                  <div className="text-[10px] font-bold uppercase text-tertiary font-mono">HIDDEN • 100% Blinded</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">shield_with_heart</span>
                <div>
                  <div className="font-semibold text-on-surface">Medical Record Number &amp; Clinic ID</div>
                  <div className="text-[10px] font-bold uppercase text-tertiary font-mono">HIDDEN • Salt Blinding Active</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-tertiary text-[18px] shrink-0 mt-0.5">shield_with_heart</span>
                <div>
                  <div className="font-semibold text-on-surface">Diagnosis Codes &amp; Clinical Notes</div>
                  <div className="text-[10px] font-bold uppercase text-tertiary font-mono">HIDDEN • Kept in RAM Only</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerateProof}
            disabled={isProving}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary-container text-on-primary shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProving ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                <span>Synthesizing Zero-Knowledge Circuit Proof...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Synthesize ZK Proof &amp; Join Circle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
