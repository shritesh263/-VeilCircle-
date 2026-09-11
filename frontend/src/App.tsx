import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { CircleExplorer } from "./components/CircleExplorer";
import { CredentialVault } from "./components/CredentialVault";
import { ZkProofStudio } from "./components/ZkProofStudio";
import { ProofSettlement } from "./components/ProofSettlement";
import { PeerSanctuary } from "./components/PeerSanctuary";
import { ConnectedWalletAccount } from "./components/ConnectedWalletAccount";
import { LedgerExplorer } from "./components/LedgerExplorer";
import { LaceWalletModal } from "./components/LaceWalletModal";
import { CreateCircleModal } from "./components/CreateCircleModal";
import { Circle, PrivateCredential, LaceWalletState, ZkProofDetails } from "./types";
import { DEFAULT_CIRCLES, INITIAL_CREDENTIALS } from "./services/mockData";
import { midnightService } from "./services/midnight";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [circles, setCircles] = useState<Circle[]>(DEFAULT_CIRCLES);
  const [credentials, setCredentials] = useState<PrivateCredential[]>(INITIAL_CREDENTIALS);
  const [joinedCircleIds, setJoinedCircleIds] = useState<Set<string>>(new Set([DEFAULT_CIRCLES[0].id]));
  const [activeSanctuaryCircle, setActiveSanctuaryCircle] = useState<Circle>(DEFAULT_CIRCLES[0]);
  const [targetProverCircle, setTargetProverCircle] = useState<Circle>(DEFAULT_CIRCLES[0]);
  const [latestProofDetails, setLatestProofDetails] = useState<ZkProofDetails | null>({
    circuitName: "proveAndJoinCircle",
    pi_a: ["0x8f29c4ba03e9112a", "0x9bc490d347890ef9"],
    pi_b: [["0x8f29c4ba03e9112a", "0x9bc490d347890ef9"], ["0x12a9bc490d347890", "0xef9923841cd27891"]],
    pi_c: ["0x12a9bc490d347890", "0x8f29c4ba03e9112a"],
    publicInputs: {
      circleId: DEFAULT_CIRCLES[0].id,
      nullifier: "0x4e7a91bc8f29c4ba"
    },
    proofGenerationTimeMs: 914,
    circuitConstraintsVerified: 1248,
    witnessBlinded: true,
    nullifierHash: "0x4e7a...91bc",
    contractFile: "veil_circle_v2.compact",
    validatorNode: "Midnight Node #12",
    gasSponsored: true,
    ephemeralGuardianId: "Veil Guardian #419"
  });

  const [spentNullifiers, setSpentNullifiers] = useState<any[]>([
    {
      nullifier: "0x4e7a91bc8f29c4ba03e9112a9bc490d347890ef9923841cd2789123490abbacd",
      circleId: DEFAULT_CIRCLES[0].id,
      txHash: "0x8f29c4ba03e9112a9bc490d347890ef9923841cd2789123490abbacde0912384",
      timestamp: "12m ago"
    }
  ]);

  const [walletState, setWalletState] = useState<LaceWalletState>(midnightService.getWalletState());
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const unsub = midnightService.subscribe(setWalletState);
    return () => unsub();
  }, []);

  const handleJoinClick = (circle: Circle) => {
    setTargetProverCircle(circle);
    setActiveTab("studio");
  };

  const handleEnterRoom = (circle: Circle) => {
    setActiveSanctuaryCircle(circle);
    setActiveTab("sanctuary");
  };

  const handleProofGenerated = (circle: Circle, cred: PrivateCredential, proofDetails: ZkProofDetails) => {
    setLatestProofDetails(proofDetails);
    setActiveSanctuaryCircle(circle);
    setJoinedCircleIds((prev) => new Set([...prev, circle.id]));

    // Record on-chain nullifier
    setSpentNullifiers((prev) => [
      {
        nullifier: proofDetails.nullifierHash || "0x4e7a...91bc",
        circleId: circle.id,
        txHash: "0x" + Math.random().toString(16).substr(2, 64),
        timestamp: "Just now"
      },
      ...prev
    ]);

    // Increment member count in circle list
    setCircles((prev) =>
      prev.map((c) => (c.id === circle.id ? { ...c, memberCount: c.memberCount + 1 } : c))
    );

    setActiveTab("settlement");
  };

  const handleAddCredential = (cred: PrivateCredential) => {
    setCredentials((prev) => [cred, ...prev]);
  };

  const handleCreateCircle = (newCircle: Circle) => {
    setCircles((prev) => [newCircle, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Header */}
      <Navbar
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={() => midnightService.disconnectWallet()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNetworkChange={(net) => midnightService.setNetwork(net)}
        activeCircleTitle={activeSanctuaryCircle?.title}
      />

      {/* Main Sanctuary Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "explore" && (
          <CircleExplorer
            circles={circles}
            joinedCircleIds={joinedCircleIds}
            onJoinClick={handleJoinClick}
            onEnterRoomClick={handleEnterRoom}
            onCreateCircleModalOpen={() => setIsCreateModalOpen(true)}
            verifiableCount={credentials.length}
          />
        )}

        {activeTab === "vault" && (
          <CredentialVault
            credentials={credentials}
            onAddCredential={handleAddCredential}
            onSelectForProver={(cred) => {
              setActiveTab("studio");
            }}
          />
        )}

        {activeTab === "studio" && (
          <ZkProofStudio
            circles={circles}
            credentials={credentials}
            onProofGenerated={handleProofGenerated}
            initialCircle={targetProverCircle}
          />
        )}

        {activeTab === "settlement" && latestProofDetails && (
          <ProofSettlement
            circle={activeSanctuaryCircle}
            proofDetails={latestProofDetails}
            onEnterSanctuary={() => setActiveTab("sanctuary")}
            onBackToCircles={() => setActiveTab("explore")}
          />
        )}

        {activeTab === "sanctuary" && (
          <PeerSanctuary
            circle={activeSanctuaryCircle}
            onExit={() => setActiveTab("explore")}
          />
        )}

        {activeTab === "account" && (
          <ConnectedWalletAccount
            walletState={walletState}
            onOpenWalletModal={() => setIsWalletModalOpen(true)}
            onDisconnect={() => midnightService.disconnectWallet()}
          />
        )}

        {activeTab === "ledger" && (
          <LedgerExplorer
            network={walletState.network}
            spentNullifiers={spentNullifiers}
          />
        )}
      </main>

      {/* Modals */}
      <LaceWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={(provider) => midnightService.connectWallet(provider)}
        network={walletState.network}
      />

      <CreateCircleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCircle={handleCreateCircle}
        network={walletState.network}
      />

      {/* Sanctuary Ambient Footer */}
      <footer className="border-t border-surface-container bg-surface-container-lowest/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
            <span className="font-bold text-on-surface">VeilCircle</span>
            <span>— Serene Sanctuary ZK on Midnight Blockchain</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-on-surface-variant font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary font-bold">Midnight Preprod Active</span>
            </span>
            <span>Compact 0.19 • CIP-30</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
