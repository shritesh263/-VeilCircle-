import React, { useState } from "react";
import { Key, Shield, Plus, Lock, CheckCircle2, Copy, Download, RefreshCw, Sparkles, FileText, AlertCircle } from "lucide-react";
import { PrivateCredential } from "../types";
import { DEMO_CREDENTIAL_TEMPLATES } from "../services/mockData";
import { computeCommitment, generateRandomHex, sha256Hex } from "../services/crypto";

interface CredentialVaultProps {
  credentials: PrivateCredential[];
  onAddCredential: (cred: PrivateCredential) => void;
  onSelectCredentialForJoin?: (cred: PrivateCredential) => void;
}

export const CredentialVault: React.FC<CredentialVaultProps> = ({
  credentials,
  onAddCredential
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [customAlias, setCustomAlias] = useState("Anonymous Recovery Seeker");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleIssueCredential = async () => {
    setIsGenerating(true);
    try {
      const template = DEMO_CREDENTIAL_TEMPLATES[selectedTemplateIndex];
      const secretKeyHex = generateRandomHex(32);
      const attributeHex = await sha256Hex(template.conditionCode + ":" + template.clinicalReferenceCode);
      const saltHex = generateRandomHex(32);
      const commitmentHex = await computeCommitment(secretKeyHex, attributeHex, saltHex);

      const newCred: PrivateCredential = {
        id: "cred_" + generateRandomHex(8),
        title: template.title,
        issuerName: template.issuerName,
        issuerPubKey: "0x" + generateRandomHex(32),
        secretKeyHex,
        attributeHex,
        saltHex,
        commitmentHex,
        issuedAt: new Date().toISOString(),
        category: template.category,
        rawDetails: {
          holderAlias: customAlias,
          conditionCode: template.conditionCode,
          clinicalReferenceCode: template.clinicalReferenceCode,
          validityWindow: template.validityWindow
        }
      };

      onAddCredential(newCred);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Key className="w-4 h-4" />
            <span>Client-Side Credential Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Private Health &amp; Referral Credentials
          </h2>
          <p className="text-sm text-slate-300">
            Stored strictly in client memory. Never uploaded unencrypted to any server or blockchain.
          </p>
        </div>
      </div>

      {/* Issuance Sandbox Panel */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Simulate Verified Clinical Credential Issuance</h3>
            <p className="text-xs text-slate-400">
              Receive a zero-knowledge attestation from an accredited healthcare clinic or recovery sponsor.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Issuing Authority &amp; Condition Attestation
            </label>
            <select
              value={selectedTemplateIndex}
              onChange={(e) => setSelectedTemplateIndex(Number(e.target.value))}
              className="w-full bg-[#060814] text-sm text-white px-4 py-3 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            >
              {DEMO_CREDENTIAL_TEMPLATES.map((tpl, i) => (
                <option key={tpl.id} value={i}>
                  {tpl.title} — ({tpl.issuerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Client Ephemeral Alias (Device Local Only)
            </label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="e.g. Anon Recovery Member"
              className="w-full bg-[#060814] text-sm text-white px-4 py-3 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-indigo-950">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generates 256-bit entropy secret + cryptographic commitment hash</span>
          </div>

          <button
            onClick={handleIssueCredential}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-2"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Issue Attestation Credential</span>
          </button>
        </div>
      </div>

      {/* Credential Cards List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Available Vault Credentials ({credentials.length})
        </h3>

        {credentials.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-indigo-950 bg-[#0b0e23]/40">
            <Key className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No credentials in vault yet.</p>
            <p className="text-xs text-slate-500 mt-1">Click "Issue Attestation Credential" above to generate one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div key={cred.id} className="glass-panel rounded-2xl p-6 border border-indigo-900/50 hover:border-cyan-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {cred.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(cred.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-1">{cred.title}</h4>
                <p className="text-xs text-slate-400 mb-4">{cred.issuerName}</p>

                {/* Private vs Public Breakdown Box */}
                <div className="space-y-2 mb-5">
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 mb-1">
                      <span className="flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Private Client Witness (Hidden)</span>
                      </span>
                      <span className="text-[9px] font-mono">256-Bit Secret</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      Secret: {cred.secretKeyHex.slice(0, 16)}...
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      Code: {cred.rawDetails.conditionCode}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#060814] border border-indigo-950">
                    <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 mb-1">
                      <span className="flex items-center space-x-1">
                        <Shield className="w-3 h-3" />
                        <span>Public Commitment (On-Chain)</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(cred.commitmentHex, cred.id)}
                        className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        {copiedId === cred.id ? (
                          <span className="text-emerald-400">Copied!</span>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400/90 truncate">
                      0x{cred.commitmentHex}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-indigo-950 text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">
                    Alias: {cred.rawDetails.holderAlias}
                  </span>
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active &amp; Ready for ZK Join</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
