import React, { useState } from "react";
import { Plus, Shield, Sparkles, Lock, RefreshCw, AlertCircle } from "lucide-react";
import { Circle } from "../types";
import { generateRandomHex } from "../services/crypto";
import { NETWORKS } from "../services/midnight";

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCircle: (circle: Circle) => void;
  network: "preview" | "preprod";
}

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({
  isOpen,
  onClose,
  onCreateCircle,
  network
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Circle["category"]>("Mental Health");
  const [description, setDescription] = useState("");
  const [eligibilityCriteria, setEligibilityCriteria] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [tags, setTags] = useState("Support, Recovery, Privacy");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !eligibilityCriteria.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await new Promise((r) => setTimeout(r, 600));

      const circleId = generateRandomHex(32);
      const issuerPubKey = "0x" + generateRandomHex(32);
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

      const newCircle: Circle = {
        id: circleId,
        title: title.trim(),
        category,
        description: description.trim(),
        eligibilityCriteria: eligibilityCriteria.trim(),
        issuerName: issuerName.trim() || "Independent Clinical Registry",
        issuerPubKey,
        memberCount: 0,
        isActive: true,
        contractAddress: NETWORKS[network].contractAddress,
        badgeColor: "cyan",
        iconName: "Shield",
        tags: tagList.length > 0 ? tagList : ["PeerSupport", "ZeroKnowledge"]
      };

      onCreateCircle(newCircle);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initialize circle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl p-6 sm:p-8 bg-[#0b0e23] border border-indigo-900/80 rounded-3xl shadow-2xl shadow-cyan-500/10 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-2xl">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Create New Support Circle</h3>
            <p className="text-xs text-slate-400">Initialize a zero-knowledge peer group on Midnight {network.toUpperCase()}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 mb-6 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Circle Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grief &amp; Loss Recovery Circle"
              className="w-full bg-[#060814] text-sm text-white px-4 py-2.5 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#060814] text-sm text-white px-4 py-2.5 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            >
              <option value="Mental Health">Mental Health</option>
              <option value="Addiction Recovery">Addiction Recovery</option>
              <option value="Chronic &amp; Rare Illness">Chronic &amp; Rare Illness</option>
              <option value="Trauma &amp; Abuse">Trauma &amp; Abuse</option>
              <option value="Caregivers &amp; Whistleblowers">Caregivers &amp; Whistleblowers</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the purpose, peer format, and ground rules..."
              className="w-full bg-[#060814] text-sm text-white px-4 py-2.5 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Eligibility Verification Criteria *
            </label>
            <textarea
              required
              rows={2}
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              placeholder="e.g. Clinical diagnosis attestation or sponsor recovery code..."
              className="w-full bg-[#060814] text-sm text-white px-4 py-2.5 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Grief, Bereavement, PeerSupport"
              className="w-full bg-[#060814] text-sm text-white px-4 py-2.5 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-indigo-950 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              <span>Register Circle On-Chain</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
