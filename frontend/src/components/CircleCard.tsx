import React from "react";
import { Circle } from "../types";

interface CircleCardProps {
  circle: Circle;
  isMember: boolean;
  onJoinClick: (circle: Circle) => void;
  onEnterRoomClick: (circle: Circle) => void;
}

export const CircleCard: React.FC<CircleCardProps> = ({
  circle,
  isMember,
  onJoinClick,
  onEnterRoomClick
}) => {
  const getIconColor = () => {
    switch (circle.badgeColor) {
      case "secondary":
        return "bg-secondary-fixed text-on-secondary-fixed-variant";
      case "tertiary":
        return "bg-tertiary-fixed text-tertiary";
      default:
        return "bg-surface-container-low text-primary";
    }
  };

  const getButtonBg = () => {
    switch (circle.badgeColor) {
      case "secondary":
        return "bg-secondary hover:bg-on-secondary-container text-on-secondary";
      case "tertiary":
        return "bg-tertiary hover:bg-tertiary-container text-on-tertiary";
      default:
        return "bg-primary hover:bg-primary-container text-on-primary";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,105,72,0.04)] hover:shadow-[0_14px_36px_rgba(0,105,72,0.08)] transition-all duration-300 border border-surface-container/60 hover:border-primary/20">
      <div>
        {/* Header Badges & Cohort */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 ${getIconColor()}`}>
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {circle.iconName || "nature_people"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-on-surface leading-tight group-hover:text-primary transition-colors">
                {circle.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">group</span>
                  <span>{circle.memberCount} members active</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary font-mono">
                  {circle.cohort || "Cohort 01"}
                </span>
              </div>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold uppercase tracking-wider shrink-0 font-mono">
            {circle.scheduleBadge || "Active Circle"}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
          {circle.description}
        </p>

        {/* ZK Proof Verification Status Box */}
        <div className="rounded-xl bg-surface-container-low p-3.5 mb-5 border border-surface-container">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>Eligible • Local Attestation Detected</span>
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-normal">
            Required: <span className="font-semibold text-on-surface">{circle.eligibilityCriteria}</span>
          </p>
        </div>
      </div>

      {/* Card Footer: Security Badge & Action */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-container/60">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-primary">lock_clock</span>
          <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
            Compact Nullifier Protected
          </span>
        </div>

        {isMember ? (
          <button
            onClick={() => onEnterRoomClick(circle)}
            className="px-4 py-2 rounded-xl bg-surface-container text-primary hover:bg-surface-container-high font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Enter Sanctuary</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={() => onJoinClick(circle)}
            className={`px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 ${getButtonBg()}`}
          >
            <span>Verify &amp; Enter</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};
