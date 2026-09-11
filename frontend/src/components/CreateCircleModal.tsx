import React, { useState } from "react";
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
  const [category, setCategory] = useState<Circle["category"]>("Caregiver Support");
  const [description, setDescription] = useState("");
  const [eligibilityCriteria, setEligibilityCriteria] = useState("");
  const [issuerName, setIssuerName] = useState("");
  const [tags, setTags] = useState("caregiver, referrals, sanctuary");
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
      const tagList = tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);

      const newCircle: Circle = {
        id: circleId,
        title: title.trim(),
        category,
        description: description.trim(),
        eligibilityCriteria: eligibilityCriteria.trim(),
        issuerName: issuerName.trim() || "Clinical Health Registry",
        issuerPubKey,
        memberCount: 1,
        cohort: "Cohort 01",
        scheduleBadge: "Daily Check-in",
        isActive: true,
        contractAddress: NETWORKS[network].contractAddress,
        badgeColor: "primary",
        iconName: "nature_people",
        tags: tagList.length > 0 ? tagList : ["caregiver", "referrals"]
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl p-6 sm:p-8 bg-surface-container-lowest border border-surface-container rounded-3xl shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-on-surface">Create New Support Circle</h3>
            <p className="text-xs text-on-surface-variant font-mono">Midnight {network.toUpperCase()} • Compact Contract</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 mb-5 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-on-surface mb-1">
              Circle Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rare Pediatric Caregivers Haven"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
            >
              <option value="Caregiver Support">Caregiver Support</option>
              <option value="Burnout &amp; Recovery">Burnout &amp; Recovery</option>
              <option value="Chronic Health">Chronic Health</option>
              <option value="Verified Referrals">Verified Referrals</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Addiction Recovery">Addiction Recovery</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">
              Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the sanctuary purpose, peer format, and ground rules..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">
              Eligibility Verification Criteria *
            </label>
            <textarea
              required
              rows={2}
              value={eligibilityCriteria}
              onChange={(e) => setEligibilityCriteria(e.target.value)}
              placeholder="e.g. Clinical diagnosis attestation or specialist referral voucher..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-bold text-on-surface mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="caregiver, referrals, oncology"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container text-on-surface font-medium focus:outline-none focus:border-primary"
            />
          </div>

          <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-on-surface-variant hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Register Safe Circle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
