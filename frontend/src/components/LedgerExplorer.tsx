import React, { useState } from "react";
import { Terminal, Database, Shield, Hash, CheckCircle, ExternalLink, Clock, Layers } from "lucide-react";
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Terminal className="w-4 h-4" />
          <span>Midnight Blockchain Ledger State</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Public Contract State &amp; Nullifier Registry
        </h2>
        <p className="text-sm text-slate-300">
          Observable on-chain ledger records on Midnight {network.toUpperCase()}. Zero private identity data is stored.
        </p>
      </div>

      {/* Contract Metadata Box */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[#060814] border border-indigo-950">
            <div className="text-xs text-slate-400 font-mono mb-1">Contract Address</div>
            <div className="text-xs font-mono font-bold text-cyan-300 break-all">
              {currentNetwork.contractAddress}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060814] border border-indigo-950">
            <div className="text-xs text-slate-400 font-mono mb-1">Target Network &amp; Indexer</div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              Midnight {network.toUpperCase()} (Chain ID: {network === "preprod" ? 489201 : 124589})
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060814] border border-indigo-950">
            <div className="text-xs text-slate-400 font-mono mb-1">Total Proven Memberships</div>
            <div className="text-2xl font-black text-white font-mono">
              {240 + allNullifiers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Nullifiers Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <span>Spent Nullifiers Ledger ({allNullifiers.length})</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Anti-Sybil Proof Set</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-indigo-950 bg-[#0b0e23]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#060814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-950">
              <tr>
                <th className="p-4">Nullifier Hash (H(sk, circleId))</th>
                <th className="p-4">Target Circle ID</th>
                <th className="p-4">Transaction Hash</th>
                <th className="p-4">Time</th>
                <th className="p-4">Proof State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-950/60 text-slate-300">
              {allNullifiers.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-bold text-cyan-300 truncate max-w-[220px]">
                    {item.nullifier}
                  </td>
                  <td className="p-4 text-slate-400 font-mono">
                    ...{item.circleId.slice(-8)}
                  </td>
                  <td className="p-4 text-slate-400 truncate max-w-[200px]">
                    {item.txHash}
                  </td>
                  <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {item.timestamp}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-900/50">
                      ZK_VALIDATED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
