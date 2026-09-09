import React from "react";
import { Shield, Users, Lock, CheckCircle, ArrowRight, Activity, Sparkles, HeartHandshake } from "lucide-react";
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
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Mental Health":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Addiction Recovery":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Chronic & Rare Illness":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Trauma & Abuse":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group hover:shadow-xl hover:shadow-cyan-500/5">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryBadge(circle.category)}`}>
            {circle.category}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono bg-[#0b0e23] px-2.5 py-1 rounded-lg border border-indigo-950">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{circle.memberCount} Verified Members</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
          {circle.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {circle.description}
        </p>

        {/* Eligibility Criteria Callout */}
        <div className="p-3 rounded-xl bg-[#0b0e23]/90 border border-indigo-900/60 mb-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 mb-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Knowledge Eligibility Proof Required:</span>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            {circle.eligibilityCriteria}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {circle.tags.map((tag, idx) => (
            <span key={idx} className="text-[11px] font-mono text-slate-400 bg-slate-900/70 px-2 py-0.5 rounded border border-slate-800">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-indigo-950/80 flex items-center justify-between">
        <div className="text-[10px] font-mono text-slate-500">
          ID: ...{circle.id.slice(-8)}
        </div>

        {isMember ? (
          <button
            onClick={() => onEnterRoomClick(circle)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center space-x-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Enter Anonymous Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onJoinClick(circle)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/10 transition-all flex items-center space-x-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Prove &amp; Join Circle</span>
          </button>
        )}
      </div>
    </div>
  );
};
