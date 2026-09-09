import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { CircleExplorer } from "./components/CircleExplorer";
import { CredentialVault } from "./components/CredentialVault";
import { PrivacyInspector } from "./components/PrivacyInspector";
import { LedgerExplorer } from "./components/LedgerExplorer";
import { AnonymousRoom } from "./components/AnonymousRoom";
import { LaceWalletModal } from "./components/LaceWalletModal";
import { ZkJoinModal } from "./components/ZkJoinModal";
import { CreateCircleModal } from "./components/CreateCircleModal";
import { Circle, PrivateCredential, LaceWalletState } from "./types";
import { DEFAULT_CIRCLES, DEMO_CREDENTIAL_TEMPLATES } from "./services/mockData";
import { midnightService } from "./services/midnight";
import { Shield, Lock, EyeOff, Github, Heart, ExternalLink, Activity } from "lucide-react";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [circles, setCircles] = useState<Circle[]>(DEFAULT_CIRCLES);
  const [joinedCircleIds, setJoinedCircleIds] = useState<Set<string>>(new Set());
  const [activeRoomCircle, setActiveRoomCircle] = useState<Circle | null>(null);

  // Seed with 2 demo private credentials so user can test ZK circuits immediately
  const [credentials, setCredentials] = useState<PrivateCredential[]>([
    {
      id: "cred_va_demo",
      title: "Veterans Clinical Intake Attestation",
      issuerName: "Veterans Health Administration",
      issuerPubKey: "0xa1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
      secretKeyHex: "8f29c4ba03e9112a9bc490d347890ef9923841cd2789123490abbacde0912384",
      attributeHex: "12a9bc490d347890ef9923841cd278918f29c4ba03e9123490abbacde0912384",
      saltHex: "5c4d2c83f260429fb2614048fd0067f4a1b2c3d4e5f60718293a4b5c6d7e8f90",
      commitmentHex: "0xe7f9201bc490d347890ef9923841cd2789123490abbacde09123841029384719",
      issuedAt: new Date().toISOString(),
      category: "Trauma & Abuse",
      rawDetails: {
        holderAlias: "Demo Veteran 01",
        conditionCode: "ICD-10-F43.10 (PTSD Intake)",
        clinicalReferenceCode: "VA-CLINIC-9821-X",
        validityWindow: "2026-2028"
      }
    },
    {
      id: "cred_samhsa_demo",
      title: "Clinical Recovery Pass & Sobriety Proof",
      issuerName: "SAMHSA Clinical Network",
      issuerPubKey: "0xb2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2",
      secretKeyHex: "709a08320efa8334cde5f532be8cab48a571fbf388bc6f6903f748d43391c5e9",
      attributeHex: "4b78912e89fa3001bcde91238410293847192837491029384719283749182374",
      saltHex: "1029384756102938475610293847561029384756102938475610293847561029",
      commitmentHex: "0x3f10928374829103948571928374910293847192837491823749182374918237",
      issuedAt: new Date().toISOString(),
      category: "Addiction Recovery",
      rawDetails: {
        holderAlias: "Demo Sobriety Member",
        conditionCode: "DSM-5-SUD-RECOVERY-ACTIVE",
        clinicalReferenceCode: "RECOV-PASS-5541-A",
        validityWindow: "2026-2027"
      }
    }
  ]);

  const [spentNullifiers, setSpentNullifiers] = useState<any[]>([]);
  const [walletState, setWalletState] = useState<LaceWalletState>(midnightService.getWalletState());

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCircleForJoin, setSelectedCircleForJoin] = useState<Circle | null>(null);

  useEffect(() => {
    const unsub = midnightService.subscribe(setWalletState);
    return () => unsub();
  }, []);

  const handleOpenJoinModal = (circle: Circle) => {
    setSelectedCircleForJoin(circle);
    setIsJoinModalOpen(true);
  };

  const handleEnterRoom = (circle: Circle) => {
    setActiveRoomCircle(circle);
    setActiveTab("room");
  };

  const handleJoinSuccess = (circleId: string, proofData: any) => {
    setJoinedCircleIds((prev) => new Set([...prev, circleId]));
    setSpentNullifiers((prev) => [
      {
        nullifier: proofData.nullifier,
        circleId,
        txHash: proofData.txHash,
        timestamp: "Just now"
      },
      ...prev
    ]);

    // Increment circle member count in local state
    setCircles((prev) =>
      prev.map((c) => (c.id === circleId ? { ...c, memberCount: c.memberCount + 1 } : c))
    );
  };

  const handleAddCredential = (cred: PrivateCredential) => {
    setCredentials((prev) => [cred, ...prev]);
  };

  const handleCreateCircle = (newCircle: Circle) => {
    setCircles((prev) => [newCircle, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060814] text-slate-100">
      {/* Navigation */}
      <Navbar
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={() => midnightService.disconnectWallet()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNetworkChange={(net) => midnightService.setNetwork(net)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "explore" && (
          <CircleExplorer
            circles={circles}
            joinedCircleIds={joinedCircleIds}
            onJoinClick={handleOpenJoinModal}
            onEnterRoomClick={handleEnterRoom}
            onCreateCircleModalOpen={() => setIsCreateModalOpen(true)}
          />
        )}

        {activeTab === "vault" && (
          <CredentialVault
            credentials={credentials}
            onAddCredential={handleAddCredential}
          />
        )}

        {activeTab === "privacy" && <PrivacyInspector />}

        {activeTab === "ledger" && (
          <LedgerExplorer
            network={walletState.network}
            spentNullifiers={spentNullifiers}
          />
        )}

        {activeTab === "room" && activeRoomCircle && (
          <AnonymousRoom
            circle={activeRoomCircle}
            onBack={() => setActiveTab("explore")}
            network={walletState.network}
          />
        )}
      </main>

      {/* Modals */}
      <LaceWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={(mode) => midnightService.connectWallet(mode)}
        network={walletState.network}
      />

      <ZkJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        circle={selectedCircleForJoin}
        credentials={credentials}
        onJoinSuccess={handleJoinSuccess}
        network={walletState.network}
      />

      <CreateCircleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCircle={handleCreateCircle}
        network={walletState.network}
      />

      {/* Footer */}
      <footer className="border-t border-indigo-950/80 bg-[#060814] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">VeilCircle</span>
            <span>— Zero-Knowledge Membership on Midnight Blockchain</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Midnight Preprod Live</span>
            </span>
            <span className="text-slate-500">Compact 0.19</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
