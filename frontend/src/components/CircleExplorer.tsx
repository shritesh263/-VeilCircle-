import React, { useState } from "react";
import { Search, Filter, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { Circle } from "../types";
import { CircleCard } from "./CircleCard";

interface CircleExplorerProps {
  circles: Circle[];
  joinedCircleIds: Set<string>;
  onJoinClick: (circle: Circle) => void;
  onEnterRoomClick: (circle: Circle) => void;
  onCreateCircleModalOpen: () => void;
}

export const CircleExplorer: React.FC<CircleExplorerProps> = ({
  circles,
  joinedCircleIds,
  onJoinClick,
  onEnterRoomClick,
  onCreateCircleModalOpen
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Trauma & Abuse",
    "Addiction Recovery",
    "Chronic & Rare Illness",
    "Mental Health",
    "Caregivers & Whistleblowers"
  ];

  const filteredCircles = circles.filter((c) => {
    const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-[#0b0e23] to-[#060814] border border-cyan-500/20 p-8 sm:p-10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Proofs on Midnight Blockchain</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Prove you belong in a support group —{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              without ever revealing who you are.
            </span>
          </h1>
          <p className="text-base text-slate-300 leading-relaxed mb-6">
            Sensitive recovery &amp; condition peer groups require trust, not surveillance. VeilCircle uses Midnight's Compact contracts to cryptographically verify your eligibility credential locally on your device. The smart contract, group operator, and on-chain observers never learn your identity or medical diagnosis.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center space-x-2 bg-[#060814]/80 px-3 py-1.5 rounded-lg border border-indigo-900/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Identity Storage</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#060814]/80 px-3 py-1.5 rounded-lg border border-indigo-900/60">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Unlinkable Circle Nullifiers</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#060814]/80 px-3 py-1.5 rounded-lg border border-indigo-900/60">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Client-Side Witness Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search support circles by condition, keyword, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0b0e23] text-sm text-slate-100 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl border border-indigo-900/60 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Create Circle Button */}
        <button
          onClick={onCreateCircleModalOpen}
          className="px-4 py-3 rounded-xl text-sm font-bold bg-[#0b0e23] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/30 transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Circle</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "bg-[#0b0e23] text-slate-400 border border-indigo-950 hover:text-slate-200 hover:border-indigo-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
