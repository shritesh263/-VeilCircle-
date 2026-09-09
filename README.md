# VeilCircle 🛡️

[![VeilCircle CI/CD](https://github.com/shritesh263/veilcircle/actions/workflows/ci.yml/badge.svg)](https://github.com/shritesh263/veilcircle/actions)
[![Midnight Blockchain](https://img.shields.io/badge/Blockchain-Midnight_Preprod-00F2FE?style=flat&logo=blockchain)](https://midnight.network)
[![Smart Contract](https://img.shields.io/badge/Language-Compact_0.19-7928CA?style=flat)](https://docs.midnight.network)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![X Profile](https://img.shields.io/badge/X-@VeilCircleZK-1DA1F2?logo=x&logoColor=white)](https://x.com/VeilCircleZK)

> **"Prove you belong in a support group — without ever revealing who you are."**

---

## 💡 Problem & Solution

### The Problem
Peer support groups for sensitive health conditions (addiction recovery, mental health, trauma survivors, oncology, chronic illness, and whistleblowers) face a critical tradeoff:
- **Stay Open**: Risk infiltration by bad actors, journalists, employers, or health insurance adjusters.
- **Verify Identity**: Expose the exact medical diagnosis, clinical intake forms, or personal identity that the group exists to protect.

### The Solution: VeilCircle
VeilCircle is a zero-knowledge membership and eligibility layer built on the **Midnight blockchain** using the **Compact** smart contract language. 

A user proves they meet a support group’s strict eligibility criteria (such as holding a valid diagnosis attestation from a trusted clinic or a verified recovery referral code) using a client-side zero-knowledge proof. The Compact smart contract validates the proof against public commitments and registers a deterministic, circle-isolated **nullifier**—all without the contract, group operator, or any on-chain observer ever learning the user's real identity, medical details, or cross-circle activities.

---

## 🔬 Privacy Model: Public State vs. Private Witness

VeilCircle enforces strict mathematical boundary separation between client-side private witness inputs and on-chain public ledger state.

```
+-------------------------------------------------------------------------------+
|                             CLIENT DEVICE (LOCAL ONLY)                        |
|                                                                               |
|  [ Private Witness ]                                                          |
|    • secretKey (256-bit entropy)                                              |
|    • eligibilityAttribute ("ICD-10-F43.10 PTSD Attestation")                 |
|    • blindingSalt (256-bit entropy)                                           |
|                                                                               |
|            │                                                                  |
|            ▼                                                                  |
|  [ Compact Circuit Evaluation ]                                               |
|    • C_calc = H(secretKey, attribute, salt) ≟ C_registered                    |
|    • Nullifier = H(secretKey, circleId)                                       |
|    • Synthesizes ZK-SNARK Proof (π)                                           |
+---------------------------------------┬---------------------------------------+
                                        │ (Only Proof π, Nullifier, CircleID)
                                        │  NO IDENTITY OR MEDICAL DATA LEAVES
                                        ▼
+-------------------------------------------------------------------------------+
|                       MIDNIGHT BLOCKCHAIN (ON-CHAIN LEDGER)                   |
|                                                                               |
|  [ Public Ledger State ]                                                      |
|    • circles: Map<CircleID, CircleInfo>                                       |
|    • spentNullifiers: Set<NullifierHash>  <-- Prevents double join/Sybil      |
|    • credentialCommitments: Set<CommitmentHash>                               |
|    • totalMembershipsProven: Uint<64>                                         |
+-------------------------------------------------------------------------------+
```

### Mathematical Breakdown

| Field | Location | Observer Visibility | Cryptographic Purpose |
| :--- | :--- | :--- | :--- |
| **Member Identity / Name** | None (Not collected) | ❌ Zero Visibility | Pure user anonymity |
| **Medical Diagnosis / Intake** | Client Private Witness | ❌ Zero Visibility | Blinded by 256-bit random salt |
| **Secret Key (\(sk\))** | Client Private Witness | ❌ Zero Visibility | Kept strictly in client memory |
| **Eligibility Commitment** | Ledger State | ✔ Public Hash | Pre-authorized attestation hash: \(H(sk, attr, r)\) |
| **Circle ID** | Ledger State | ✔ Public ID | Identifies target support group |
| **Circle Nullifier** | Ledger State | ✔ Public Hash | Single-use per circle: \(H(sk, \text{circleId})\) |
| **ZK-SNARK Proof (\(\pi\))** | Transaction Payload | ✔ Public Proof | Validates constraints without revealing witness |

---

## 🛡️ What an Observer CAN vs. CANNOT Learn

### ✅ What an On-Chain Observer CAN Learn:
1. **Valid Proof Submitted**: That an eligible member satisfied all circuit constraints.
2. **Nullifier Consumed**: That a unique nullifier hash for that circle was spent (preventing double entries).
3. **Circle Member Counter Incremented**: Public member counter updated on the ledger.
4. **Transaction Timestamp**: The block height and timestamp of the transaction.

### ❌ What an On-Chain Observer CAN NEVER Learn:
1. **Who the user is**: No wallet addresses, names, emails, or IP links are tied to the witness.
2. **What their condition or diagnosis is**: The attribute stays inside the ZK witness.
3. **Cross-Circle Linkability**: The same user secret generates completely distinct, uncorrelated nullifiers across different circles (\(H(sk, A) \neq H(sk, B)\)).

---

## 🚀 Live Testnet Deployments

VeilCircle smart contracts are deployed to Midnight testnets with verifiable contract identifiers:

| Network | Contract Address | Explorer | Status |
| :--- | :--- | :--- | :--- |
| **Midnight Preprod** | `mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80` | [Preprod Explorer](https://explorer.preprod.midnight.network) | 🟢 Active |
| **Midnight Preview** | `mn_contract1veilcirclepreviewc60bfbe2e231907285331371` | [Preview Explorer](https://explorer.preview.midnight.network) | 🟢 Active |

---

## 📦 Project Structure

```
VeilCircle/
├── contract/                       # Compact Smart Contract & Circuits
│   ├── src/
│   │   ├── veilcircle.compact      # Core Midnight Compact contract code
│   │   ├── contract.ts             # TypeScript state manager & circuit runner
│   │   ├── crypto.ts               # Poseidon/SHA256 persistent hashing & proofs
│   │   └── managed/veilcircle/     # Generated circuits, TS bindings & keys
│   ├── test/
│   │   └── veilcircle.test.ts      # Comprehensive contract test suite
│   ├── scripts/
│   │   ├── compile.js              # Compact compilation pipeline
│   │   └── deploy.ts               # Midnight Preprod & Preview deployer
│   └── package.json
├── frontend/                       # React / TypeScript / Vite Frontend
│   ├── src/
│   │   ├── components/             # UI Components (Explorer, Vault, PrivacyInspector, Room)
│   │   ├── services/               # Midnight Lace Wallet & crypto service
│   │   ├── types/                  # Data types & interfaces
│   │   └── __tests__/              # Frontend ZK unit tests
│   └── package.json
├── screenshots/                    # Milestone visual artifacts
│   ├── compact_compile.svg         # Compact circuit compilation output
│   └── contract_deployment.svg     # Preprod deployment record
├── .github/workflows/ci.yml        # GitHub Actions CI/CD Pipeline
└── README.md
```

---

## 🛠️ Quick Start & Local Run

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/shritesh263/veilcircle.git
cd veilcircle
npm run install:all
```

### 2. Compile Compact Circuits
```bash
npm run compile:contract
```

### 3. Run Automated Test Suites
```bash
# Run all contract & frontend tests
npm test
```

### 4. Start Development Web Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the dApp.

---

## 🧪 Test Suite Coverage

The project contains automated tests covering all critical privacy invariants:
- ✔ **Valid Membership Proof**: Client witness matching authorized commitment successfully joins circle.
- ✔ **Forged Witness Rejection**: Attacker with forged secret or unapproved attribute is strictly rejected.
- ✔ **Double-Spend Prevention**: Reusing a credential in the same circle fails due to nullifier collision.
- ✔ **Circle Isolation**: Same credential in different circles derives independent, unlinkable nullifiers.
- ✔ **Frontend Proof Generation**: Browser WebCrypto circuit synthesis & witness blinding validation.

---

## 🤝 Product Proposal Alignment
- **Approved Idea Reference**: Anonymous & Zero-Knowledge Peer Health Support Networks.
- **Socials**: Follow updates on X at [@VeilCircleZK](https://x.com/VeilCircleZK).
- **License**: Apache 2.0
