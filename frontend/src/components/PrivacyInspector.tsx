import React, { useState } from "react";
import { EyeOff, Eye, ShieldCheck, Lock, Binary, Cpu, ArrowRight, CheckCircle2, Copy } from "lucide-react";

export const PrivacyInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"comparison" | "circuit" | "sybil">("comparison");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <EyeOff className="w-4 h-4" />
          <span>Cryptographic Proof &amp; Privacy Verifier</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Observable Privacy Model &amp; State Breakdown
        </h2>
        <p className="text-sm text-slate-300">
          Verify mathematically what is stored in client memory vs what is broadcast to the Midnight ledger.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex space-x-2 border-b border-indigo-950 pb-3">
        <button
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "comparison"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Side-by-Side Privacy Comparison
        </button>
        <button
          onClick={() => setActiveTab("circuit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "circuit"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Compact Circuit Math &amp; Witnesses
        </button>
        <button
          onClick={() => setActiveTab("sybil")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "sybil"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Nullifiers &amp; Double-Spend Prevention
        </button>
      </div>

      {/* TAB 1: SIDE BY SIDE COMPARISON */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Box: Client Witness (Hidden) */}
            <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/50">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <EyeOff className="w-5 h-5" />
                  <span>Client Private Witness</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">
                  Never Leaves Device
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#060814]/90 border border-emerald-900/40">
                  <div className="text-[11px] text-slate-400 font-bold mb-1">User Secret Key (\(sk\)):</div>
                  <div className="text-emerald-300 break-all text-[11px]">
                    0x8a92f01bc490d347890ef9923841cd2789123490abbacde09123841029384719
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#060814]/90 border border-emerald-900/40">
                  <div className="text-[11px] text-slate-400 font-bold mb-1">Medical Attribute / Diagnosis:</div>
                  <div className="text-emerald-300 text-[11px]">
                    "ICD-10-F43.10 : Combat PTSD Clinical Attestation 2026"
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#060814]/90 border border-emerald-900/40">
                  <div className="text-[11px] text-slate-400 font-bold mb-1">Blinding Salt Factor (\(r\)):</div>
                  <div className="text-emerald-300 break-all text-[11px]">
                    0x3f10928374829103948571928374910293847192837491823749182374918237
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-emerald-200/80 leading-relaxed font-sans">
                🔒 Zero identity metadata is transmitted. The client proves knowledge of these values without revealing them.
              </div>
            </div>

            {/* Right Box: On-Chain Public State */}
            <div className="p-6 rounded-3xl bg-cyan-950/20 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-900/50">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                  <Eye className="w-5 h-5" />
                  <span>Midnight On-Chain Ledger State</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded">
                  Publicly Observable
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-[#060814]/90 border border-cyan-900/40">
                  <div className="text-[11px] text-slate-400 font-bold mb-1">Target Circle ID:</div>
                  <div className="text-cyan-300 text-[11px]">
                    0x0000000000000000000000000000000000000000000000000000000000000001
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#060814]/90 border border-cyan-900/40">
                  <div className="text-[11px] text-slate-400 font-bold mb-1">Deterministic Nullifier (\(nf\)):</div>
                  <div className="text-cyan-300 break-all text-[11px]">
                    0xd94e82b7194f1092837482910394857192837491029384719283749182374918
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#060814]/90 border border-cyan-900/40">
                  <div className="text-[11px] text-slate-400 font-bold mb-1">ZK-SNARK Proof (\(\pi\)):</div>
                  <div className="text-cyan-300 break-all text-[11px]">
                    pi_a: [0x4b78..., 0x90ef...], pi_b: [[...], [...]], pi_c: [...]
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-cyan-200/80 leading-relaxed font-sans">
                👁️ On-chain observers only see that a valid membership proof was submitted and a single-use nullifier was registered.
              </div>
            </div>
          </div>

          {/* Privacy Table */}
          <div className="overflow-x-auto rounded-2xl border border-indigo-950 bg-[#0b0e23]">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#060814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-950 font-mono">
                <tr>
                  <th className="p-4">Data Element</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Observer Visibility</th>
                  <th className="p-4">Protection Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/60 text-slate-300 font-mono">
                <tr>
                  <td className="p-4 font-bold text-white">Member Real Name / IP</td>
                  <td className="p-4 text-emerald-400">None (Not collected)</td>
                  <td className="p-4 text-rose-400 font-bold">❌ Zero Visibility</td>
                  <td className="p-4 font-sans text-slate-400">Never required or requested</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Medical Diagnosis / Condition</td>
                  <td className="p-4 text-emerald-400">Client Private Witness</td>
                  <td className="p-4 text-rose-400 font-bold">❌ Zero Visibility</td>
                  <td className="p-4 font-sans text-slate-400">Blinded with 256-bit random salt</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Support Circle ID</td>
                  <td className="p-4 text-cyan-400">Midnight Ledger State</td>
                  <td className="p-4 text-emerald-400 font-bold">✔ Visible</td>
                  <td className="p-4 font-sans text-slate-400">Public circle registry</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Double-Join Nullifier</td>
                  <td className="p-4 text-cyan-400">Midnight Ledger State</td>
                  <td className="p-4 text-emerald-400 font-bold">✔ Visible</td>
                  <td className="p-4 font-sans text-slate-400">H(secret, circleId) prevents sybils</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCUIT MATH */}
      {activeTab === "circuit" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-white">Compact Circuit Architecture</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            VeilCircle implements Midnight's Compact language primitives to enforce exact cryptographic constraints:
          </p>

          <div className="p-4 rounded-2xl bg-[#060814] border border-indigo-950 font-mono text-xs text-slate-300 space-y-3">
            <div className="text-cyan-400 font-bold">// 1. Credential Commitment Constraint</div>
            <div>commitment = persistent_hash([secretKey, attribute, salt]);</div>
            <div>assert credentialCommitments.member(commitment);</div>

            <div className="text-cyan-400 font-bold pt-2">// 2. Deterministic Nullifier Constraint</div>
            <div>nullifier = persistent_hash([secretKey, circleId]);</div>
            <div>assert nullifier == expectedNullifier;</div>
            <div>assert !spentNullifiers.member(nullifier);</div>

            <div className="text-cyan-400 font-bold pt-2">// 3. State Transition</div>
            <div>spentNullifiers.insert(nullifier);</div>
            <div>circle.memberCount = circle.memberCount + 1;</div>
          </div>
        </div>
      )}

      {/* TAB 3: NULLIFIERS */}
      {activeTab === "sybil" && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-bold text-white">Anti-Sybil &amp; Cross-Circle Unlinkability</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Because nullifiers incorporate the unique <code className="text-cyan-300 font-mono">circleId</code>, joining Circle A produces nullifier \(N_A = H(sk, A)\) and joining Circle B produces \(N_B = H(sk, B)\). An observer cannot correlate that \(N_A\) and \(N_B\) were created by the same user.
          </p>
        </div>
      )}
    </div>
  );
};
