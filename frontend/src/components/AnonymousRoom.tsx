import React, { useState } from "react";
import { Shield, Send, Lock, CheckCircle2, User, Sparkles, MessageSquare, ArrowLeft, ShieldAlert } from "lucide-react";
import { Circle, AnonymousMessage } from "../types";

interface AnonymousRoomProps {
  circle: Circle;
  onBack: () => void;
  network: "preview" | "preprod";
}

export const AnonymousRoom: React.FC<AnonymousRoomProps> = ({
  circle,
  onBack,
  network
}) => {
  const [messages, setMessages] = useState<AnonymousMessage[]>([
    {
      id: "msg_1",
      circleId: circle.id,
      ephemeralSenderId: "Member #48B2",
      content: "Hello everyone. So relieved to have a space where we can speak frankly about daily symptoms and recovery without our employers or health insurers monitoring us.",
      timestamp: "10 mins ago",
      verifiedShield: true,
      zkProofSnippet: "π_SNARK_OK(0x4b78...)"
    },
    {
      id: "msg_2",
      circleId: circle.id,
      ephemeralSenderId: "Member #C91A",
      content: "Welcome! We share clinical coping tools and personal check-ins here every evening. No names, just solidarity.",
      timestamp: "4 mins ago",
      verifiedShield: true,
      zkProofSnippet: "π_SNARK_OK(0x90ef...)"
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 400));

    const newMsg: AnonymousMessage = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      circleId: circle.id,
      ephemeralSenderId: "You (Member #7F30)",
      content: inputMessage.trim(),
      timestamp: "Just now",
      verifiedShield: true,
      zkProofSnippet: "π_SNARK_OK(0x" + Math.random().toString(16).substr(2, 6) + "...)"
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsSending(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-indigo-950">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-[#0b0e23] border border-indigo-900/60 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Circles</span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero-Knowledge Shield Active</span>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-[#0b0e23] px-2.5 py-1 rounded-lg border border-indigo-950">
            {circle.memberCount} Members
          </span>
        </div>
      </div>

      {/* Circle Banner */}
      <div className="p-6 rounded-3xl bg-[#0b0e23] border border-indigo-900/70 relative overflow-hidden">
        <div className="relative z-10">
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {circle.category}
          </span>
          <h2 className="text-2xl font-black text-white mt-2 mb-1">{circle.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{circle.description}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="glass-panel rounded-3xl p-6 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-4 mb-6">
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-center text-xs text-slate-400 font-mono">
            🔒 End-to-end anonymized channel. Messages are broadcast with single-use session proofs.
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-2xl border transition-all ${
                msg.ephemeralSenderId.includes("You")
                  ? "bg-cyan-950/20 border-cyan-500/40 ml-6"
                  : "bg-[#060814]/80 border-indigo-950 mr-6"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                    {msg.ephemeralSenderId.slice(-2)}
                  </div>
                  <span className="font-bold text-xs text-white font-mono">
                    {msg.ephemeralSenderId}
                  </span>
                  {msg.verifiedShield && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/40 flex items-center space-x-1">
                      <Shield className="w-2.5 h-2.5" />
                      <span>ZK-Verified</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3 pt-4 border-t border-indigo-950">
          <input
            type="text"
            placeholder="Share support, coping strategy, or check-in anonymously..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-[#060814] text-sm text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-indigo-900/80 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="px-5 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
