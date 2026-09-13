import React, { useState } from "react";
import { Circle } from "../types";
import { CircleCard } from "./CircleCard";

interface CircleExplorerProps {
  circles: Circle[];
  joinedCircleIds: Set<string>;
  onJoinClick: (circle: Circle) => void;
  onEnterRoomClick: (circle: Circle) => void;
  onCreateCircleModalOpen: () => void;
  verifiableCount?: number;
}

export const CircleExplorer: React.FC<CircleExplorerProps> = ({
  circles,
  joinedCircleIds,
  onJoinClick,
  onEnterRoomClick,
  onCreateCircleModalOpen,
  verifiableCount = 3
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCircles = circles.filter((circle) => {
    const matchesSearch =
      circle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.eligibilityCriteria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-6 animate-fade-in">
      {/* Privacy Assurance Clearing Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_8px_30px_rgba(0,105,72,0.04)] p-5 sm:p-6 border border-surface-container">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
                ZK Enclave Active • Zero Footprint
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface leading-snug">
              Your identity never leaves this device. Peer circles are protected by{" "}
              <span className="font-bold text-primary">Midnight Compact</span> smart contracts and client-side nullifiers.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Search Field & Create Circle Action */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Field */}
        <div className="relative w-full sm:flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe spaces, clinical criteria, or tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline text-xs sm:text-sm shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-surface-container focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Create Circle Button */}
        <button
          onClick={onCreateCircleModalOpen}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs border border-surface-container shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Create Safe Circle</span>
        </button>
      </div>

      {/* Realtime Eligibility Summary Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-container shadow-xs border border-surface-container-high/40">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">key_vertical</span>
          <span className="text-xs font-semibold text-on-surface">
            {verifiableCount} proofs verifiable in local wallet
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-secondary font-mono">
          Sync: 12s ago
        </span>
      </div>

      {/* Peer Circles Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCircles.map((circle) => (
          <CircleCard
            key={circle.id}
            circle={circle}
            isMember={joinedCircleIds.has(circle.id)}
            onJoinClick={onJoinClick}
            onEnterRoomClick={onEnterRoomClick}
          />
        ))}
      </div>
    </div>
  );
};
