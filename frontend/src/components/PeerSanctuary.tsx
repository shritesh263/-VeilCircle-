import React, { useState } from "react";
import { Circle, PeerMessage } from "../types";
import { DEFAULT_PEER_MESSAGES } from "../services/mockData";

interface PeerSanctuaryProps {
  circle: Circle;
  onExit: () => void;
}

export const PeerSanctuary: React.FC<PeerSanctuaryProps> = ({
  circle,
  onExit
}) => {
  const [messages, setMessages] = useState<PeerMessage[]>(DEFAULT_PEER_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isWhisperActive, setIsWhisperActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: PeerMessage = {
      id: "msg_" + Date.now(),
      circleId: circle.id,
      senderAlias: "You (Veil #419)",
      senderAvatarEmoji: "🌿",
      badgeText: "ZK Verified",
      content: userText,
      timestamp: "Just now",
      isSelf: true,
      reactions: {
        heart: 1,
        warmth: 1,
        presence: 0
      }
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    showToast("Message broadcasted with zero-knowledge anonymity.");

    // Simulate an empathetic peer response in the sanctuary
    setIsTyping(true);
    setTimeout(() => {
      const peerResponses = [
        "Thank you for sharing this so openly. You are not alone in this journey.",
        "Sending you calm and strength. This sanctuary is always here for you.",
        "Holding space with you today. Take gentle breaths.",
        "We hear you, and we honor what you're navigating. One step at a time."
      ];
      const randomResponse = peerResponses[Math.floor(Math.random() * peerResponses.length)];
      const peerAliases = ["Veil Companion #812", "Serene Seeker #105", "Quiet Guardian #340"];
      const randomAlias = peerAliases[Math.floor(Math.random() * peerAliases.length)];

      const peerMsg: PeerMessage = {
        id: "msg_reply_" + Date.now(),
        circleId: circle.id,
        senderAlias: randomAlias,
        senderAvatarEmoji: "🕊️",
        badgeText: "ZK Verified",
        content: randomResponse,
        timestamp: "Just now",
        isSelf: false,
        reactions: {
          heart: 2,
          warmth: 3,
          presence: 1
        }
      };

      setMessages((prev) => [...prev, peerMsg]);
      setIsTyping(false);
    }, 2200);
  };

  const handleReaction = (msgId: string, type: "heart" | "warmth" | "presence") => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [type]: msg.reactions[type] + 1
            }
          };
        }
        return msg;
      })
    );
  };

  return (
    <div className="flex flex-col w-full gap-4 animate-fade-in max-w-4xl mx-auto pb-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-secondary text-on-secondary text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Room Presence & Safety Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm p-5 sm:p-6 border border-surface-container">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary-fixed/20 blur-xl pointer-events-none"></div>
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-[10px] font-bold uppercase text-primary tracking-wider font-mono">
                Zero-Knowledge Encrypted
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface truncate">
              {circle.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="material-symbols-outlined text-[16px] text-secondary">shield_lock</span>
              <span className="text-xs text-on-surface-variant font-medium">
                Shielded Sanctuary • 14 Verified Peers Present
              </span>
            </div>
          </div>

          {/* Quick Exit Safety Button */}
          <button
            onClick={onExit}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant hover:bg-tertiary-fixed-dim transition-all shadow-xs active:scale-95 font-bold text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            <span>Exit Sanctuary</span>
          </button>
        </div>

        {/* Ephemeral Session Bar */}
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-surface-container text-on-surface-variant text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
            <span>Midnight Proof: Shielded (Nullifier Active)</span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-[16px]">auto_delete</span>
            <span>Ephemeral Session • Disappears in 24h</span>
          </div>
        </div>
      </div>

      {/* Audio Whisper Lounge Bar */}
      <div className="rounded-2xl bg-surface-container-low shadow-sm p-4 flex items-center justify-between gap-4 border border-surface-container">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed flex-shrink-0 relative">
            <span className="material-symbols-outlined text-[20px] animate-pulse">graphic_eq</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-on-surface truncate">Gentle Reflection Lounge</span>
            <span className="text-xs text-on-surface-variant">
              {isWhisperActive ? "You are listening quietly • Microphone veiled" : "3 listening quietly • Audio veiled"}
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setIsWhisperActive(!isWhisperActive);
            showToast(isWhisperActive ? "Disconnected from Reflection Lounge." : "Connected to Whisper Audio Lounge!");
          }}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
            isWhisperActive
              ? "bg-primary text-on-primary"
              : "bg-secondary text-on-secondary hover:bg-on-secondary-container"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isWhisperActive ? "volume_up" : "hearing"}
          </span>
          <span>{isWhisperActive ? "Listening" : "Join Whispers"}</span>
        </button>
      </div>

      {/* Pinned Sanctuary Prompt */}
      <div className="rounded-2xl bg-surface-container-lowest shadow-sm p-5 border border-surface-container relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary font-mono">
                Empathetic Prompt of the Day
              </span>
              <span className="text-xs text-on-surface-variant">Daily Reflection</span>
            </div>
            <p className="font-bold text-sm sm:text-base text-on-surface leading-snug">
              "How are you holding space for yourself this week?"
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Take a breath. There are no expectations here, only shared understanding.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Peer Message Stream */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl shadow-xs p-5 flex flex-col gap-2.5 transition-all border ${
              msg.isSelf
                ? "bg-surface-container-low/80 border-primary/30 ml-4 sm:ml-8"
                : "bg-surface-container-lowest border-surface-container mr-4 sm:mr-8"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-sm font-bold shadow-xs">
                  {msg.senderAvatarEmoji}
                </div>
                <span className="font-bold text-xs sm:text-sm text-on-surface">{msg.senderAlias}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold font-mono">
                  {msg.badgeText}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono">{msg.timestamp}</span>
            </div>

            <p className="text-xs sm:text-sm text-on-surface leading-relaxed">{msg.content}</p>

            {/* Supportive Reaction Bubbles */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleReaction(msg.id, "heart")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/60 hover:bg-tertiary-fixed text-on-tertiary-fixed-variant transition-all text-xs font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
                <span>{msg.reactions.heart}</span>
              </button>

              <button
                onClick={() => handleReaction(msg.id, "warmth")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/60 hover:bg-primary-fixed text-on-primary-fixed-variant transition-all text-xs font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">diversity_1</span>
                <span>{msg.reactions.warmth} Warmth</span>
              </button>

              <button
                onClick={() => handleReaction(msg.id, "presence")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-all text-xs font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">self_improvement</span>
                <span>{msg.reactions.presence} Presence</span>
              </button>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="rounded-2xl shadow-xs p-4 bg-surface-container-lowest border border-surface-container mr-4 sm:mr-8 flex items-center gap-2 text-xs text-on-surface-variant animate-pulse">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span>A peer in the sanctuary is writing a response...</span>
          </div>
        )}
      </div>

      {/* Peer Sanctuary Input Dock */}
      <div className="sticky bottom-4 rounded-2xl bg-surface-container-lowest shadow-lg p-4 border border-surface-container">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Share quiet solidarity or personal reflection (anonymously)..."
            className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
