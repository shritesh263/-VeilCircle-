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
import { DashboardStatsOverview } from "./components/DashboardStatsOverview";
import { ContractInfoPanel } from "./components/ContractInfoPanel";
import { Circle, PrivateCredential, LaceWalletState, ZkProofDetails } from "./types";
import { DEFAULT_CIRCLES, INITIAL_CREDENTIALS } from "./services/mockData";
import { midnightService } from "./services/midnight";
import { getContractConfig } from "./config/contractConfig";
import { WalletProvider } from "./utils/cardanoWallet";

export const App: React.FC = () => {
  const contractConfig = getContractConfig();

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

  const currentProvider: WalletProvider | null = walletState.isConnected
    ? /lace/i.test(walletState.providerName || walletState.provider)
      ? 'Lace'
      : '1AM'
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Header */}
      <Navbar
        walletState={walletState}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={() => midnightService.disconnectWallet()}
        onConnectWalletProvider={(provider) => midnightService.connectWallet(provider)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNetworkChange={(net) => midnightService.setNetwork(net)}
        activeCircleTitle={activeSanctuaryCircle?.title}
      />

      {/* Main Sanctuary Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Contract Configuration Error Warning (if any) */}
        {!contractConfig.isValid && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-4 text-red-700 dark:text-red-400 flex items-center gap-3 shadow-sm" role="alert">
            <span className="material-symbols-outlined text-red-500 text-2xl">error</span>
            <div>
              <div className="font-bold text-sm">Contract Configuration Error</div>
              <div className="text-xs">{contractConfig.errorMessage}</div>
            </div>
          </div>
        )}

        {/* Hero Banner with Protocol Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-wider font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Midnight Network Protocol • Zero-Knowledge Sanctuary Layer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              VeilCircle Privacy-Preserving Health Sanctuary
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Construct client-side zero-knowledge witness proofs for confidential health support. Clinical credentials, oncology attestations, and caregiver records remain completely off-chain.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-xl border border-surface-container shadow-xs self-start md:self-auto shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Circuit Engine</span>
              <span className="font-mono text-xs text-on-surface font-semibold">Compact / BLS12-381</span>
            </div>
          </div>
        </div>

        {/* Dashboard Metrics Overview */}
        <DashboardStatsOverview
          contractConfig={contractConfig}
          walletConnected={walletState.isConnected}
          walletProvider={currentProvider}
          totalCirclesCount={circles.length}
          credentialsCount={credentials.length}
          joinedCirclesCount={joinedCircleIds.size}
          verifiedNullifiersCount={spentNullifiers.length + 3}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />

        {/* Contract Information Panel */}
        <ContractInfoPanel
          contractConfig={contractConfig}
          onOpenExplorerTab={() => setActiveTab('ledger')}
        />

        {/* Main Tab Panels */}
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
            onSelectForProver={(_cred) => {
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
