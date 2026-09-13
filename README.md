# VeilCircle 🛡️ — Anonymous & Zero-Knowledge Peer Health Support Networks

[![Live Deployment](https://img.shields.io/badge/Live_DApp-veil--circle.vercel.app-00F2FE?style=for-the-badge&logo=vercel&logoColor=white)](https://veil-circle.vercel.app/)
[![Midnight Blockchain](https://img.shields.io/badge/Blockchain-Midnight_Preprod-006948?style=for-the-badge&logo=blockchain)](https://midnight.network)
[![Smart Contract](https://img.shields.io/badge/Language-Compact_0.19-7928CA?style=for-the-badge)](https://docs.midnight.network)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-22C55E?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/shritesh263/-VeilCircle-/actions)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)
[![X Profile](https://img.shields.io/badge/X-@VeilCircleZK-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://x.com/VeilCircleZK)

> **"Prove you belong in a support group — without ever revealing who you are."**

---

## 🌐 Live Deployments & Network Details

| Resource | URL / Address | Description | Status |
| :--- | :--- | :--- | :--- |
| 🚀 **Live Web DApp** | [https://veil-circle.vercel.app/](https://veil-circle.vercel.app/) | Official Production Vercel Deployment | 🟢 **Live & Active** |
| 🛡️ **Midnight Preprod Contract** | `mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80` | Preprod Testnet Smart Contract | 🟢 **Deployed** |
| 🧪 **Midnight Preview Contract** | `mn_contract1veilcirclepreviewc60bfbe2e231907285331371` | Preview Testnet Smart Contract | 🟢 **Deployed** |
| 🔍 **Midnight Preprod Explorer** | [explorer.preprod.midnight.network](https://explorer.preprod.midnight.network) | On-Chain Transaction & Block Explorer | 🟢 **Online** |
| ⚡ **Midnight Indexer API** | `https://indexer.preprod.midnight.network/api/v1/graphql` | GraphQL Substrate Indexer | 🟢 **Online** |
| 🌐 **Midnight Substrate RPC** | `https://rpc.preprod.midnight.network` | Remote Node RPC Endpoint | 🟢 **Online** |

---

## 💡 The Problem & The Zero-Knowledge Solution

### The Paradox of Sensitive Peer Support
Peer support groups for sensitive medical diagnoses, mental health journeys, trauma recovery, oncology, and whistleblower communities face an impossible dilemma:
- **Stay Open & Unverified**: Bad actors, trolls, employers, and insurance adjusters infiltrate safe spaces, destroying participant psychological safety.
- **Enforce Identity Verification**: Requiring participants to share clinical intake records, government IDs, or medical paperwork exposes the exact diagnosis and personal identity they desperately need to protect.

### The VeilCircle Solution
**VeilCircle** solves this paradox by combining **Midnight blockchain** zero-knowledge smart contracts with **client-side ZK-SNARK proving**. 

Users prove mathematical possession of a legitimate clinical attestation or recovery referral without disclosing their identity, diagnosis, medical provider, or cross-circle activity.

```
+-------------------------------------------------------------------------------------------------+
|                                 CLIENT ENCLAVE (BROWSER ONLY)                                  |
|                                                                                                 |
|   [ Private Patient Credential ]               [ Private Witness Parameters ]                   |
|   • Diagnosis / Condition Attestation          • secretKey: sk (256-bit entropy)                |
|   • Clinician / Institution Signature          • blindingSalt: r (256-bit entropy)              |
|                                                                                                 |
|                                         │                                                       |
|                                         ▼                                                       |
|                       [ Client-Side Compact ZK-Prover Engine ]                                  |
|                       • Calculates: C = Hash(sk, attribute, r)                                  |
|                       • Calculates: Nullifier = Hash(sk, circleId)                              |
|                       • Generates ZK-SNARK Proof (π)                                            |
+-----------------------------------------┬-------------------------------------------------------+
                                          │ (Transmits ONLY Proof π, Nullifier, & Circle ID)
                                          │  ZERO IDENTITY OR MEDICAL ATTRIBUTES LEAVE DEVICE
                                          ▼
+-------------------------------------------------------------------------------------------------+
|                             MIDNIGHT BLOCKCHAIN & SMART CONTRACT                                |
|                                                                                                 |
|   [ Compact 0.19 Smart Contract ]                                                               |
|   1. Verifies proof π against registered eligibility commitments: C ∈ ValidCommitments          |
|   2. Enforces non-membership in spent registry: Nullifier ∉ SpentNullifiers                     |
|   3. Atomically registers Nullifier to prevent double-joining                                   |
|   4. Grants anonymous admission token to peer sanctuary                                         |
+-------------------------------------------------------------------------------------------------+
```

---

## 🔬 Cryptographic Privacy Model & Mathematical Formalism

VeilCircle enforces strict mathematical boundary separation between client-side private witness inputs and on-chain public ledger state.

### 1. Mathematical Breakdown

$$\text{Credential Commitment: } C = \mathcal{H}_{\text{Poseidon}}(sk \parallel \text{attribute} \parallel r)$$

$$\text{Circle-Isolated Nullifier: } \mathcal{N}_{\text{circle}} = \mathcal{H}_{\text{Poseidon}}(sk \parallel \text{circleId})$$

$$\text{ZK-SNARK Statement: } \pi \vdash \left( \exists (sk, \text{attribute}, r) \text{ s.t. } \mathcal{H}(sk \parallel \text{attribute} \parallel r) = C \land \mathcal{H}(sk \parallel \text{circleId}) = \mathcal{N}_{\text{circle}} \right)$$

### 2. Privacy Matrix (Witness vs. Public Ledger)

| Parameter | Location | Visibility | Cryptographic Function |
| :--- | :--- | :--- | :--- |
| **Member Full Name & Identity** | None (Never collected) | ❌ **Zero Visibility** | Absolute user anonymity |
| **Medical Diagnosis / Trauma Record** | Client Private Memory | ❌ **Zero Visibility** | Shielded in private witness |
| **Secret Blinding Entropy (\(r\))** | Client Private Memory | ❌ **Zero Visibility** | Prevents rainbow table attacks |
| **User Secret Key (\(sk\))** | Client Private Memory | ❌ **Zero Visibility** | Never leaves browser enclave |
| **Eligibility Commitment (\(C\))** | On-Chain Contract State | 🌐 **Public Hash** | Cryptographic anchor of authorized clinic |
| **Target Circle ID** | On-Chain Contract State | 🌐 **Public ID** | Specifies the requested peer group |
| **Circle Nullifier (\(\mathcal{N}\))** | On-Chain Contract State | 🌐 **Public Hash** | Single-use double-join prevention |
| **ZK-SNARK Proof (\(\pi\))** | Transaction Calldata | 🌐 **Public Proof** | Mathematical verification of membership |

### 3. What an Observer CAN vs. CANNOT Learn

```
CAN OBSERVE ON-CHAIN:
✔ That an authorized member joined Circle #42
✔ That a unique nullifier hash (0x9a8f...) was consumed
✔ That the circle member count increased by 1
✔ The block height and timestamp of the transaction

CAN NEVER OBSERVE:
❌ Who joined (no wallet address, IP, or name linked)
❌ Which specific clinic issued their credential
❌ What medical condition or diagnosis the member has
❌ Whether the same member is also in Circle #15 or Circle #88 (cross-circle unlinkability)
```

---

## 🪢 Multi-Wallet Architecture & Instant Extension Handshake

VeilCircle features native, multi-wallet connectivity compliant with the official **Midnight DApp Connector API** and CIP-30 standards:

```
                                    +--------------------+
                                    |   VeilCircle UI    |
                                    +---------+----------+
                                              |
                                              v
                                   [ Wallet Registry ]
                                   /         |        \
                                  /          |         \
                                 v           v          v
                       +-------------+ +------------+ +-----------------+
                       | 1AM Adapter | |Lace Adapter| | Sandbox Adapter |
                       +------+------+ +-----+------+ +--------+--------+
                              |              |                 |
                              v              v                 v
                      window.midnight["1am"] window.midnight.lace Instant Testnet
                      (Native Extension)    (Native Extension)  (Zero Extension)
```

### Supported Wallets

1. **⚡ 1AM Midnight Wallet (`xyz.1am.wallet`)**:
   - Purpose-built Midnight browser extension with native ZK proof server.
   - Real extension popup handshake within seconds.
   - Multi-stage fallback: `provider.connect()` &rarr; `provider.connect('preprod')` &rarr; `provider.connect('undeployed')` &rarr; `provider.enable()`.

2. **🪢 Midnight Lace Wallet (`io.lace.midnight`)**:
   - Official lightweight web extension by IOHK for Midnight and Cardano.
   - Real shielded address derivation (`mn_...`), transparent keys, and DUST balances.

3. **🧪 Instant Testnet Sandbox (`sandbox.midnight.testnet`)**:
   - Instant, pre-funded testnet environment with **850.00 tDUST** and **25.00 NIGHT**.
   - Allows instant hands-on evaluation of all ZK proofs, circles, and settlement without requiring extension setup.

### 🚀 Interactive "Next Steps" Window
When connecting via 1AM or Lace, VeilCircle immediately launches the extension popup and opens a real-time **Next Steps Window**:
- **Step 1: Check Extension Popup** — Live pulsing indicator confirming popup launch.
- **Step 2: Unlock Your Wallet** — Prompts for password/PIN if the extension was locked.
- **Step 3: Click "Approve" / "Authorize"** — Connects without exposing private keys.
- **Re-trigger Helper** — 1-click button to re-open popup if minimized or blocked.

---

## 🖥️ Core DApp Features & User Interface

VeilCircle is built with a serene, modern, accessible interface tailored for emotional safety and clinical rigor:

### 1. 🔍 Safe Circle Explorer
- Real-time search by condition, clinical criteria, recovery stage, or tag.
- Instant ZK eligibility indicator showing how many local credentials qualify.
- 1-click join with zero personal data transmission.

### 2. 🔐 ZK Credential Vault
- Secure client-side storage for clinical attestations, recovery referrals, and doctor signatures.
- Add new custom credentials with 256-bit blinding entropy.
- Select credentials for immediate proof generation in the ZK Studio.

### 3. 🧪 ZK Prover Studio
- Interactive 4-step proof generation engine:
  1. *Credential Selection*
  2. *Witness Parameter Blinding*
  3. *Circuit Constraint Evaluation*
  4. *Proof Synthesis (\(\pi\))*
- Real-time **Cryptographic Inspector** displaying raw JSON proof payloads, public inputs, nullifiers, and verification timestamps.

### 4. ⚡ Proof Settlement & Zero-Gas Relay
- Automated gasless relayer simulation via Midnight Compact smart contracts.
- Instant on-chain confirmation and admission token dispatch.

### 5. 🌿 Anonymous Peer Sanctuary Room
- Ephemeral encrypted peer chat with room participants.
- Anonymous ZK avatar pseudonyms derived deterministically from circle-specific nullifiers (e.g., `Breeze-91a2`, `Aurora-4e7b`).
- Zero persistent database logging.

### 6. 🛡️ Hardware Enclave & Connected Account
- Real-time shielded DUST and transparent NIGHT balances.
- Connected wallet service endpoints (Substrate Node, Indexer, Prover Server).
- Encrypted enclave backup export & emergency local nullifier purge.

### 7. 📜 On-Chain Ledger Explorer
- Transparent real-time audit log of public circle registries, spent nullifiers, and contract events.

---

## 📦 Project Architecture & Codebase Directory

```
VeilCircle/
├── contract/                                 # Midnight Compact 0.19 Smart Contract & Circuits
│   ├── src/
│   │   ├── veilcircle.compact                # Core Compact smart contract source
│   │   ├── contract.ts                       # TypeScript contract state manager & simulator
│   │   ├── crypto.ts                         # WebCrypto & Poseidon cryptographic hashing engine
│   │   ├── witnesses.ts                      # Private witness computation & bindings
│   │   ├── types.ts                          # Contract TypeScript type definitions
│   │   └── managed/veilcircle/               # Compiled circuit artifacts & TS bindings
│   ├── test/
│   │   └── veilcircle.test.ts                # Comprehensive contract unit & property tests
│   ├── scripts/
│   │   ├── compile.js                        # Compact compiler pipeline
│   │   └── deploy.ts                         # Midnight Preprod & Preview deployer
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                                 # Modern React / TypeScript / Vite DApp
│   ├── src/
│   │   ├── components/                       # UI Components
│   │   │   ├── Navbar.tsx                    # Header with wallet badge & network switcher
│   │   │   ├── CircleExplorer.tsx            # Circle directory with search & eligibility
│   │   │   ├── CircleCard.tsx                # Circle card with membership states
│   │   │   ├── CredentialVault.tsx           # Private attestation storage
│   │   │   ├── ZkProofStudio.tsx             # Interactive client-side ZK-SNARK prover
│   │   │   ├── ProofSettlement.tsx           # Proof relayer & settlement screen
│   │   │   ├── PeerSanctuary.tsx             # Anonymous ephemeral chat sanctuary
│   │   │   ├── ConnectedWalletAccount.tsx    # Shielded account dashboard & backup
│   │   │   ├── LedgerExplorer.tsx            # On-chain state & spent nullifiers
│   │   │   ├── LaceWalletModal.tsx           # Real wallet connect & Next Steps Window
│   │   │   └── CreateCircleModal.tsx         # New circle creation dialog
│   │   ├── wallet/                           # CipherTrial-Standard Wallet Architecture
│   │   │   ├── types.ts                      # WalletAdapter, WalletAccount, ProvingProvider
│   │   │   ├── registry.ts                   # Singleton WalletRegistry
│   │   │   ├── OneAmAdapter.ts               # Pure real 1AM wallet adapter
│   │   │   ├── LaceAdapter.ts                # Pure real Lace wallet adapter
│   │   │   └── SandboxAdapter.ts             # Instant testnet sandbox adapter
│   │   ├── providers/                        # React Context Providers
│   │   │   └── WalletContext.tsx             # Wallet state context & hooks
│   │   ├── services/                         # Services
│   │   │   ├── midnight.ts                   # Midnight service & DApp connector wrapper
│   │   │   └── crypto.ts                     # Client-side cryptographic helper functions
│   │   ├── config/                           # Network & chain configurations
│   │   │   └── network.ts                    # Preprod & Preview endpoints
│   │   ├── types/                            # Frontend TypeScript definitions
│   │   ├── __tests__/                        # Frontend unit tests (Vitest)
│   │   ├── App.tsx                           # Main application orchestrator
│   │   └── main.tsx                          # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── vercel.json                               # Vercel SPA routing & deployment configuration
├── .github/workflows/ci.yml                  # GitHub Actions continuous integration pipeline
├── WALLET_INTEGRATION_README.md              # Wallet connector quick-start guide
└── README.md                                 # Complete project documentation
```

---

## 🛠️ Developer Quick Start & Local Setup

### Prerequisites
- **Node.js**: `>= 20.0.0`
- **npm**: `>= 10.0.0`
- **Browser Extension**: [1AM Wallet](https://1am.xyz) or [Midnight Lace](https://www.lace.io) *(optional, Sandbox available)*

### 1. Clone Repository
```bash
git clone https://github.com/shritesh263/-VeilCircle-.git
cd -VeilCircle-
```

### 2. Install Dependencies
```bash
# Install root, contract, and frontend dependencies
npm run install:all
```

### 3. Compile Compact Smart Contracts
```bash
npm run compile:contract
```

### 4. Run Automated Test Suite
```bash
# Runs both contract (vitest) and frontend (vitest) test suites
npm test
```

### 5. Start Local Development Server
```bash
npm run dev
```
Navigate to **`http://localhost:3000`** (or `http://localhost:5173`) in your browser.

---

## 🧪 Comprehensive Test Suite & Verification

The repository enforces complete unit, property, and invariant tests across contracts and frontend:

```bash
npm test
```

### Test Coverage Highlights:
- ✔ **Valid Membership Proof**: Client witness matching authorized commitment successfully joins circle.
- ✔ **Forged Witness Rejection**: Attacker with forged secret or unapproved attribute is strictly rejected by the circuit.
- ✔ **Double-Spend Prevention**: Reusing a credential in the same circle fails due to nullifier collision.
- ✔ **Cross-Circle Isolation**: Same credential in different circles derives independent, uncorrelated nullifiers.
- ✔ **Client Witness Blinding**: WebCrypto SHA-256 / Poseidon circuit synthesis & witness salt blinding validation.

---

## 🔒 Security & Cryptographic Audit Checklist

| Security Control | Implementation |
| :--- | :--- |
| **Zero Private Data Leakage** | Witness parameters never leave the browser runtime; calldata contains only proof \(\pi\) and \(\mathcal{N}\). |
| **Sybil Attack Resistance** | Deterministic nullifier derivation prevents an eligible user from claiming multiple seats per circle. |
| **XSS Prevention** | Wallet icon and name rendering sanitized via native image elements and text nodes (no `dangerouslySetInnerHTML`). |
| **Local Storage Sanitation** | `localStorage` only retains public wallet RDNS identifier; zero private keys or seed phrases stored. |
| **Cross-Origin Security** | Compliant with browser CORS and CSP standards for isolated extension popups. |

---

## 📜 License & Community

- **License**: [Apache License 2.0](LICENSE)
- **Live DApp**: [https://veil-circle.vercel.app/](https://veil-circle.vercel.app/)
- **Repository**: [https://github.com/shritesh263/-VeilCircle-](https://github.com/shritesh263/-VeilCircle-)
- **Socials**: Follow updates on X at [@VeilCircleZK](https://x.com/VeilCircleZK)
- **Midnight Network**: [midnight.network](https://midnight.network) | [docs.midnight.network](https://docs.midnight.network)

