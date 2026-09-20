import React, { useState } from 'react';
import { ContractConfig } from '../config/contractConfig';

interface ContractInfoPanelProps {
  contractConfig: ContractConfig;
  policyId?: string;
  onOpenExplorerTab?: () => void;
}

export const ContractInfoPanel: React.FC<ContractInfoPanelProps> = ({
  contractConfig,
  policyId,
  onOpenExplorerTab
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const defaultPolicyId =
    policyId || contractConfig.policyId || '0x5665696c436972636c655f507269766163795f53616e6374756172795f563230';

  const explorerUrl =
    contractConfig.explorerUrl ||
    `https://explorer.${contractConfig.network || 'preprod'}.midnight.network/contract/${contractConfig.address}`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container shadow-[0_4px_20px_rgba(0,105,72,0.03)] space-y-4 transition-all">
      {/* Top Protocol Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-container/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-on-surface">Midnight Smart Contract Protocol</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
                Compact v0.19
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              Decentralized Zero-Knowledge Verification Enclave &amp; Nullifier Registry
            </p>
          </div>
        </div>

        {/* Live Network Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {contractConfig.isValid ? (
            <span className="px-3 py-1 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold border border-primary/20 uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live {contractConfig.network === 'preview' ? 'Preview' : 'Preprod'} Testnet
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-[10px] font-bold border border-red-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Invalid Contract Address
            </span>
          )}
        </div>
      </div>

      {/* Contract Details Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        {/* Network Field */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container/60 flex flex-col justify-between">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans tracking-wide">
            Target Network
          </span>
          <div className="font-bold text-on-surface mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Midnight {contractConfig.network || 'Preprod'}</span>
          </div>
        </div>

        {/* Contract Address Field */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container/60 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans tracking-wide">
              Contract Address
            </span>
            <button
              type="button"
              onClick={() => handleCopy(contractConfig.address, 'address')}
              className="text-[10px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              title="Copy Address"
            >
              <span className="material-symbols-outlined text-[13px]">
                {copiedKey === 'address' ? 'check' : 'content_copy'}
              </span>
              <span>{copiedKey === 'address' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="font-bold text-primary truncate mt-1" title={contractConfig.address}>
            {contractConfig.address.length > 20
              ? `${contractConfig.address.slice(0, 10)}...${contractConfig.address.slice(-8)}`
              : contractConfig.address}
          </div>
        </div>

        {/* Circuit Specification */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container/60 flex flex-col justify-between">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans tracking-wide">
            Circuit Specification
          </span>
          <div className="font-bold text-on-surface truncate mt-1 text-[11px]" title="proveAndJoinCircle (BLS12-381)">
            proveAndJoinCircle (BLS12-381)
          </div>
        </div>

        {/* Explorer Link */}
        <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container/60 flex flex-col justify-between">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase font-sans tracking-wide">
            Ledger Explorer
          </span>
          <div className="mt-1 flex items-center gap-2">
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-secondary hover:underline cursor-pointer text-xs"
            >
              <span>View On Explorer</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
            {onOpenExplorerTab && (
              <button
                type="button"
                onClick={onOpenExplorerTab}
                className="text-[10px] text-on-surface-variant hover:text-on-surface font-sans"
              >
                (Inspect)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Footer Note */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low/60 border border-surface-container/40 text-[11px] text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-primary shrink-0">lock</span>
        <span>
          <strong className="text-on-surface">Zero-Knowledge Guarantee:</strong> All medical diagnoses, caregiver relationships, and private credentials remain 100% off-chain in your client-side witness vault.
        </span>
      </div>
    </div>
  );
};
