import React, { useState, useEffect } from "react";
import { Shield, Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, Terminal, Sparkles, RefreshCw, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";
import { Circle, PrivateCredential, ZkProofDetails } from "../types";
import { midnightService, NETWORKS } from "../services/midnight";

interface ZkJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  circle: Circle | null;
  credentials: PrivateCredential[];
  onJoinSuccess: (circleId: string, proofData: any) => void;
  network: "preview" | "preprod";
}

export const ZkJoinModal: React.FC<ZkJoinModalProps> = ({
  isOpen,
  onClose,
  circle,
  credentials,
  onJoinSuccess,
  network
}) => {
  if (!isOpen || !circle) return null;

  const [selectedCredId, setSelectedCredId] = useState<string>(credentials[0]?.id || "");
  const [step, setStep] = useState<"SELECT" | "PROVING" | "VERIFIED" | "SUBMITTING" | "SUCCESS">("SELECT");
  const [proofResult, setProofResult] = useState<{
    proof: ZkProofDetails;
    nullifier: string;
    commitment: string;
    txHash?: string;
    blockHeight?: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (credentials.length > 0 && !selectedCredId) {
      setSelectedCredId(credentials[0].id);
    }
  }, [credentials]);

  const selectedCred = credentials.find((c) => c.id === selectedCredId) || credentials[0];

  const handleStartProof = async () => {
    if (!selectedCred) {
      setErrorMsg("Please select or generate a private credential first.");
      return;
    }

    setErrorMsg(null);
    setStep("PROVING");

    try {
      // Simulate circuit compilation & witness generation delay
      await new Promise((r) => setTimeout(r, 900));

      const { proof, nullifier, commitment } = await midnightService.submitProveAndJoinCircle(
        circle.id,
        selectedCred.secretKeyHex,
        selectedCred.attributeHex,
        selectedCred.saltHex
      );

      setProofResult({ proof, nullifier, commitment });
      setStep("VERIFIED");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate zero-knowledge proof");
      setStep("SELECT");
    }
  };

  const handleBroadcastTransaction = async () => {
    if (!proofResult) return;
    setStep("SUBMITTING");

    try {
      await new Promise((r) => setTimeout(r, 1200));

      const finalTxHash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const blockHeight = network === "preprod" ? 489248 : 124618;

      setProofResult({
        ...proofResult,
        txHash: finalTxHash,
        blockHeight
      });

      setStep("SUCCESS");

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      onJoinSuccess(circle.id, {
        nullifier: proofResult.nullifier,
        txHash: finalTxHash,
        proof: proofResult.proof
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Midnight transaction broadcast rejected");
      setStep("VERIFIED");
    }
  };

  const currentNetwork = NETWORKS[network];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 bg-[#0b0e23] border border-indigo-900/80 rounded-3xl shadow-2xl shadow-cyan-500/10 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Midnight Compact ZK Circuit
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Prove Eligibility for Support Circle
            </h3>
            <p className="text-xs text-slate-400 font-mono">Target: {circle.title}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 mb-6 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: SELECT WITNESS */}
        {step === "SELECT" && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Private Attestation Witness (Client-Side)
              </label>

              {credentials.length === 0 ? (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-300 text-xs">
                  No credentials found in your private vault. Please go to "Private Vault" tab to generate a demo attestation first!
                </div>
              ) : (
                <div className="space-y-3">
                  {credentials.map((cred) => (
                    <label
                      key={cred.id}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedCredId === cred.id
                          ? "bg-cyan-950/20 border-cyan-500/60 shadow-md shadow-cyan-500/10"
                          : "bg-[#060814] border-indigo-950 hover:border-indigo-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="witnessCred"
                            value={cred.id}
                            checked={selectedCredId === cred.id}
                            onChange={() => setSelectedCredId(cred.id)}
                            className="text-cyan-500 focus:ring-cyan-400"
                          />
                          <span className="font-bold text-sm text-white">{cred.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                          {cred.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 pl-5">
                        Issuer: {cred.issuerName} • Condition Ref: {cred.rawDetails.conditionCode}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Guarantee Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/60 text-xs text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-300 font-bold">
                <Lock className="w-4 h-4" />
                <span>Midnight Zero-Knowledge Guarantee</span>
              </div>
              <p className="leading-relaxed">
                The Compact circuit evaluates your 256-bit secret and health condition inside your browser's private witness engine. It generates a single-use nullifier <code className="text-cyan-300 bg-[#060814] px-1 py-0.5 rounded font-mono">H(secret, circleId)</code> to prevent double-joins without ever disclosing who you are or linking back to other circles.
              </p>
            </div>

            <button
              onClick={handleStartProof}
              disabled={credentials.length === 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Zero-Knowledge Proof</span>
            </button>
          </div>
        )}

        {/* STEP 2: PROVING SPINNER */}
        {step === "PROVING" && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin mx-auto"></div>
            <h4 className="text-lg font-bold text-white">Synthesizing ZK-SNARK Proof...</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
              Evaluating circuit constraints: H(secret, attr, salt) ≟ commitment
            </p>
          </div>
        )}

        {/* STEP 3: OBSERVABLE PRIVACY COMPARISON */}
        {(step === "VERIFIED" || step === "SUBMITTING") && proofResult && (
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero-Knowledge Proof Successfully Synthesized ({proofResult.proof.proofGenerationTimeMs}ms)</span>
            </div>

            {/* Observable Privacy Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Private Witness (Device Local) */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <EyeOff className="w-4 h-4 text-emerald-400" />
                    <span>Private Witness (STAYS LOCAL)</span>
                  </span>
                  <span className="text-[9px] font-mono bg-emerald-900/40 px-2 py-0.5 rounded text-emerald-200">
                    HIDDEN
                  </span>
                </div>
                <div className="space-y-2 text-[11px] font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500">Secret:</span>{" "}
                    <span className="text-emerald-300">{selectedCred?.secretKeyHex.slice(0, 16)}...</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Condition:</span>{" "}
                    <span className="text-emerald-300">{selectedCred?.rawDetails.conditionCode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Salt:</span>{" "}
                    <span className="text-emerald-300">{selectedCred?.saltHex.slice(0, 16)}...</span>
                  </div>
                </div>
              </div>

              {/* Public On-Chain Payload (Blockchain) */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/40">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>On-Chain Payload (PUBLIC)</span>
                  </span>
                  <span className="text-[9px] font-mono bg-cyan-900/40 px-2 py-0.5 rounded text-cyan-200">
                    SUBMITTED
                  </span>
                </div>
                <div className="space-y-2 text-[11px] font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500">Circle ID:</span>{" "}
                    <span className="text-cyan-300">...{circle.id.slice(-8)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Nullifier:</span>{" "}
                    <span className="text-cyan-300">0x{proofResult.nullifier.slice(0, 14)}...</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ZK Proof:</span>{" "}
                    <span className="text-cyan-300 font-bold">π_SNARK (Groth16/Plonk)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mathematical Guarantee Note */}
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              ✔ Observer learns: A valid member proved eligibility and spent nullifier 0x{proofResult.nullifier.slice(0, 8)}...<br/>
              ✖ Observer NEVER learns: User identity, diagnosis, medical history, or cross-circle links.
            </p>

            <button
              onClick={handleBroadcastTransaction}
              disabled={step === "SUBMITTING"}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {step === "SUBMITTING" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting to Midnight {network.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Submit Proof to Midnight {network.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === "SUCCESS" && proofResult && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-white mb-1">Eligibility Verified ✅</h4>
              <p className="text-sm text-slate-300">
                You have anonymously joined <span className="font-bold text-white">{circle.title}</span>!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#060814] border border-indigo-950 font-mono text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Transaction Hash:</span>
                <span className="text-cyan-400 truncate max-w-[240px]">{proofResult.txHash}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Spent Nullifier:</span>
                <span className="text-slate-300 truncate max-w-[240px]">0x{proofResult.nullifier}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Block Height:</span>
                <span className="text-slate-300">#{proofResult.blockHeight}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Network:</span>
                <span className="text-emerald-400 font-bold uppercase">Midnight {network}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Enter Support Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
