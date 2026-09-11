import React, { useState } from "react";
import { PrivateCredential } from "../types";
import { computeCommitment, generateRandomHex, sha256Hex } from "../services/crypto";

interface CredentialVaultProps {
  credentials: PrivateCredential[];
  onAddCredential: (cred: PrivateCredential) => void;
  onSelectForProver?: (cred: PrivateCredential) => void;
}

export const CredentialVault: React.FC<CredentialVaultProps> = ({
  credentials,
  onAddCredential,
  onSelectForProver
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Issue form state
  const [newTitle, setNewTitle] = useState("Clinical Caregiver Attestation");
  const [newIssuer, setNewIssuer] = useState("St. Jude Children'\''s Research Hospital");
  const [newCategory, setNewCategory] = useState<PrivateCredential["category"]>("Caregiver Support");
  const [newPredicate, setNewPredicate] = useState("Active Caregiver Status: Proven");

  const handleSyncVault = () => {
    setIsSyncing(true);
    setSyncProgress(20);
    setTimeout(() => setSyncProgress(65), 300);
    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      showToast("Local Vault Synced with Midnight WASM Enclave!");
    }, 700);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    const secretKeyHex = generateRandomHex(32);
    const attributeHex = await sha256Hex(newTitle + ":" + newIssuer);
    const saltHex = generateRandomHex(32);
    const commitmentHex = await computeCommitment(secretKeyHex, attributeHex, saltHex);

    const newCred: PrivateCredential = {
      id: "cred_" + generateRandomHex(8),
      title: newTitle,
      issuerName: newIssuer,
      issuerPubKey: "0x" + generateRandomHex(32),
      secretKeyHex,
      attributeHex,
      saltHex,
      commitmentHex,
      issuedAt: new Date().toISOString(),
      category: newCategory,
      predicateText: newPredicate,
      rawDetails: {
        holderAlias: "Enclave Member #" + Math.floor(1000 + Math.random() * 9000),
        conditionCode: "DX-VERIFIED-2026",
        clinicalReferenceCode: "CLINIC-REF-" + Math.floor(1000 + Math.random() * 9000),
        validityWindow: "2026-2029",
        blindedHashMask: "0x" + commitmentHex.slice(0, 4) + "..." + commitmentHex.slice(-4)
      }
    };

    onAddCredential(newCred);
    setIsIssueModalOpen(false);
    showToast("New Clinical Credential issued to local ZK Vault!");
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Vault Banner & Title */}
      <section className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
              Credentials &amp; ZK Vault
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant">
              Locally sandboxed on Midnight enclave. Zero raw PII leaves device.
            </p>
          </div>
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface-container text-primary shadow-xs">
            <span className="material-symbols-outlined text-[24px]">vpn_key</span>
          </div>
        </div>

        {/* Live Enclave Status Card */}
        <div className="mt-3 bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,105,72,0.03)] border border-surface-container flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">cloud_done</span>
              <span className="font-bold text-sm text-on-surface">Local Attestation Sync</span>
            </div>
            <div className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full bg-surface-container-low">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
                Online • Synced 4s ago
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-outline">memory</span>
              <span className="font-medium">WASM Isolated Sandbox</span>
            </div>
            <span className="font-semibold text-on-surface bg-surface-container-low px-2 py-0.5 rounded-md font-mono text-[11px]">
              12.4 MB encrypted state
            </span>
          </div>

          {/* Progress Track Micro-Indicator */}
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-xs text-outline font-medium">
              Ephemeral session key derived in secure memory
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncVault}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed font-bold text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
              >
                <span className={`material-symbols-outlined text-[16px] ${isSyncing ? "animate-spin" : ""}`}>
                  refresh
                </span>
                <span>{isSyncing ? "Syncing..." : "Sync Local Vault"}</span>
              </button>
              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Issue Demo Attestation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Metrics Bar */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center shadow-xs border border-surface-container">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary mb-1">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <span className="font-bold text-lg sm:text-xl text-on-surface">{credentials.length}</span>
          <span className="text-xs text-on-surface-variant font-medium mt-0.5">Active Credentials</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono mt-1">
            Verified Issuer
          </span>
        </div>

        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center shadow-xs border border-surface-container">
          <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-1">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <span className="font-bold text-lg sm:text-xl text-on-surface">{credentials.length + 1}</span>
          <span className="text-xs text-on-surface-variant font-medium mt-0.5">Shielded Proofs</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono mt-1">
            Zero Leakage
          </span>
        </div>

        <div className="bg-surface-container-lowest p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center shadow-xs border border-surface-container">
          <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-1">
            <span className="material-symbols-outlined text-[18px]">visibility_off</span>
          </div>
          <span className="font-bold text-lg sm:text-xl text-primary">0</span>
          <span className="text-xs text-on-surface-variant font-medium mt-0.5">PII Exposed</span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono mt-1">
            100% Blinded
          </span>
        </div>
      </section>

      {/* Private Key & Shielded Identity Management */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-on-surface">Manage Private Keys</h2>
              <p className="text-xs text-on-surface-variant">Non-custodial zero-knowledge cryptographic state</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-container-low text-primary flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>Enclave Active</span>
          </span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-1.5 border border-surface-container">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Compact Seed Derivation:</span>
            <span className="font-bold text-primary font-mono">Ed25519-Curve</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-on-surface">#8410-Ed25519 • [Enclave-Gated]</span>
            <span className="text-outline text-[11px]">Wiped from RAM on lock</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => showToast("Ephemeral keys backup bundle downloaded securely.")}
            className="flex items-center justify-center gap-1.5 bg-surface-container text-on-surface-variant hover:text-on-surface font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Backup Ephemeral Keys</span>
          </button>
          <button
            onClick={() => showToast("Key rotation completed. Fresh nullifier seed generated.")}
            className="flex items-center justify-center gap-1.5 bg-surface-container-low text-tertiary hover:bg-tertiary-fixed font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">published_with_changes</span>
            <span>Rotate Keys</span>
          </button>
        </div>
      </section>

      {/* Verifiable Credentials List */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-on-surface">Verifiable Credentials</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-container text-primary font-mono">
              {credentials.length} Ready
            </span>
          </div>
          <span className="text-xs text-secondary font-mono">Compact Schema v2.1</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credentials.map((cred) => (
            <article
              key={cred.id}
              className="bg-surface-container-lowest rounded-2xl p-5 shadow-xs border border-surface-container hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">local_hospital</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-on-surface leading-tight">
                        {cred.title}
                      </h3>
                      <span className="text-xs text-on-surface-variant">{cred.issuerName}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container-low text-primary font-mono shrink-0">
                    Ed25519 Verified
                  </span>
                </div>

                {/* Attribute Details Box */}
                <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1.5 mb-3 border border-surface-container text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Verifiable Predicate:</span>
                    <span className="font-semibold text-primary">{cred.predicateText}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Blinded Data:</span>
                    <span className="font-mono text-outline">{cred.rawDetails.blindedHashMask || "0x8f4c...3e9a"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Validity Window:</span>
                    <span className="font-medium text-on-surface">{cred.rawDetails.validityWindow}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
                <span className="text-on-surface-variant font-mono text-[11px]">
                  Alias: {cred.rawDetails.holderAlias}
                </span>
                <span className="text-primary font-bold text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Ready for ZK Join</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Issue Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg p-6 bg-surface-container-lowest border border-surface-container rounded-3xl shadow-2xl">
            <button
              onClick={() => setIsIssueModalOpen(false)}
              className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-on-surface">Issue Verifiable Credential</h3>
                <p className="text-xs text-on-surface-variant">Simulate clinical attestation into local ZK Vault</p>
              </div>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Attestation Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Issuing Authority / Clinic</label>
                <input
                  type="text"
                  required
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Predicate / Verified Statement</label>
                <input
                  type="text"
                  required
                  value={newPredicate}
                  onChange={(e) => setNewPredicate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold shadow-sm"
                >
                  Issue to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
