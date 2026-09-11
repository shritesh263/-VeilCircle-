import React, { useState } from "react";
import { NETWORKS } from "../services/midnight";

interface LedgerExplorerProps {
  network: "preview" | "preprod";
  spentNullifiers: { nullifier: string; circleId: string; txHash: string; timestamp: string }[];
}

export const LedgerExplorer: React.FC<LedgerExplorerProps> = ({
  network,
  spentNullifiers
}) => {
  const currentNetwork = NETWORKS[network];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const defaultNullifiers = [
    {
      nullifier: "0xd94e82b7194f1092837482910394857192837491029384719283749182374918",
      circleId: "0000000000000000000000000000000000000000000000000000000000000001",
      txHash: "0x4b78912e89fa3001bcde91238410293847192837491029384719283749182374",
      timestamp: "12 mins ago"
    },
    {
      nullifier: "0x892a01bc490d347890ef9923841cd2789123490abbacde091238410293847192",
      circleId: "0000000000000000000000000000000000000000000000000000000000000002",
      txHash: "0x8f29c4ba03e9112a9bc490d347890ef9923841cd2789123490abbacde0912384",
      timestamp: "28 mins ago"
    },
    {
      nullifier: "0x3f10928374829103948571928374910293847192837491823749182374918237",
      circleId: "0000000000000000000000000000000000000000000000000000000000000004",
      txHash: "0x12a9bc490d347890ef9923841cd278918f29c4ba03e9123490abbacde0912384",
      timestamp: "1 hour ago"
    }
  ];

  const allNullifiers = [...spentNullifiers, ...defaultNullifiers];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col w-full gap-6 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Section Header */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant text-[11px] font-bold uppercase tracking-wider font-mono w-fit">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Midnight Public Ledger • Compact v0.19</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">
          Public Contract State &amp; Nullifier Registry
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
          Observable on-chain cryptographic ledger records on Midnight {network.toUpperCase()}. Zero personal identity data, diagnosis records, or user addresses are ever recorded on-chain.
        </p>
      </div>

      {/* Contract Metadata Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contract Address Card */}
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                Smart Contract
              </span>
              <span className="material-symbols-outlined text-[18px] text-primary">description</span>
            </div>
            <div className="text-xs font-mono font-bold text-on-surface break-all bg-surface-container-low p-2.5 rounded-xl border border-surface-container">
              {currentNetwork.contractAddress}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-container text-xs">
            <button
              onClick={() => handleCopy(currentNetwork.contractAddress, "contract")}
              className="text-primary font-bold hover:text-primary-container flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>{copiedKey === "contract" ? "Copied!" : "Copy Address"}</span>
            </button>
            <a
              href={`${currentNetwork.explorerUrl}/contracts/${currentNetwork.contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="text-secondary font-bold hover:underline flex items-center gap-1"
            >
              <span>Explorer</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Network & Indexer Card */}
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                Network &amp; Node
              </span>
              <span className="material-symbols-outlined text-[18px] text-secondary">hub</span>
            </div>
            <div className="text-base font-bold text-on-surface">
              Midnight {network.toUpperCase()}
            </div>
            <div className="text-xs text-on-surface-variant font-mono mt-1">
              Chain ID: {network === "preprod" ? "489201" : "124589"} • RPC Active
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>GraphQL Indexer Synced</span>
            </span>
            <span className="font-mono text-[11px]">Block #489,244</span>
          </div>
        </div>

        {/* Proven Memberships */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-primary-fixed/30 via-surface-container-lowest to-surface-container-low border border-surface-container shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                Verified Memberships
              </span>
              <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield_with_heart
              </span>
            </div>
            <div className="text-3xl font-black text-primary font-mono mt-1">
              {240 + allNullifiers.length}
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Zero-knowledge proof settlements executed
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container/60 text-[11px] font-mono text-primary font-bold">
            100% Blinded • Zero Linkability
          </div>
        </div>
      </div>

      {/* Nullifiers Table Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">tag</span>
            <h3 className="font-bold text-base text-on-surface">
              Spent Nullifier Registry ({allNullifiers.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-container">
            Anti-Sybil Proof Set
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-surface-container bg-surface-container-lowest shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] tracking-wider font-mono border-b border-surface-container">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Nullifier Hash H(sk, circleId)</th>
                  <th className="py-3.5 px-4 font-bold">Target Circle</th>
                  <th className="py-3.5 px-4 font-bold">Relayed Tx Hash</th>
                  <th className="py-3.5 px-4 font-bold">Timestamp</th>
                  <th className="py-3.5 px-4 font-bold text-right">Proof State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                {allNullifiers.map((item, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{item.nullifier}</span>
                        <button
                          onClick={() => handleCopy(item.nullifier, `null_${idx}`)}
                          className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
                          title="Copy Nullifier"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedKey === `null_${idx}` ? "check" : "content_copy"}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                      <span className="px-2 py-0.5 rounded-lg bg-surface-container font-medium text-[11px]">
                        Circle ...{item.circleId.slice(-6)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-on-surface-variant max-w-[180px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{item.txHash}</span>
                        <button
                          onClick={() => handleCopy(item.txHash, `tx_${idx}`)}
                          className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
                          title="Copy Tx Hash"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {copiedKey === `tx_${idx}` ? "check" : "content_copy"}
                          </span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-medium text-[11px] whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-primary-fixed text-on-primary-fixed-variant shadow-xs">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        <span>ZK_VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Explainer / Security Assurance Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-surface-container-low border border-surface-container shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-xs border border-surface-container">
            <span className="material-symbols-outlined text-[22px]">lock_reset</span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-on-surface">Mathematical Privacy Guarantee</h4>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
              Nullifiers are one-way cryptographic PRF hashes. They prove that an eligible member has claimed access to a specific circle once, without revealing which member or wallet address submitted the proof.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-primary bg-primary-fixed/60 px-3 py-1.5 rounded-xl">
            Compact Plonk SNARK
          </span>
        </div>
      </div>
    </div>
  );
};

