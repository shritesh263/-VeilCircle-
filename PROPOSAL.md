# VeilCircle — Project Proposal 🛡️

**Zero-Knowledge Peer Health Support Networks on the Midnight Blockchain**

---

## 📌 Executive Summary

**VeilCircle** is a decentralized, privacy-first peer support platform designed for individuals navigating sensitive medical conditions, mental health journeys, substance recovery, and whistleblower situations. 

By leveraging **Midnight's Compact language** and **client-side Zero-Knowledge proofs (ZK-SNARKs)**, VeilCircle solves the fundamental paradox of sensitive community spaces: **how to strictly verify that participants possess legitimate eligibility without ever requiring them to reveal their identity, medical records, or clinician data.**

---

## 🛑 Problem Statement

### The Paradox of Sensitive Peer Support

Millions of individuals coping with sensitive circumstances (such as PTSD, addiction recovery, rare oncological diagnoses, neurodivergence, or trauma) seek solace and solidarity in peer communities. However, current solutions force an unacceptable tradeoff:

1. **Unverified / Open Communities (Reddit, Discord, Facebook Groups)**:
   - Anyone can enter without credential verification.
   - High risk of harassment, bad actors, curious observers, employer infiltration, and insurance surveillance.
   - Vulnerable individuals censor themselves or avoid joining entirely due to fear of exposure.

2. **Gated / Clinical Intake Communities**:
   - Require uploading government photo IDs, insurance cards, or clinical intake paperwork to administrators.
   - Creates centralized honey pots of sensitive medical data vulnerable to leaks, subpoenas, and unauthorized data monetization.
   - Exposes participants to medical stigma and privacy violations.

---

## 💡 The VeilCircle Solution

VeilCircle bridges this gap by decoupling **eligibility verification** from **identity disclosure**.

```
[ Certified Clinician / Provider ]
                │
                ▼ Issues Blinded Credential
[ Patient / Member Browser Enclave ]
   • Holds Secret Key (sk) & Condition Attribute
   • Generates Compact ZK-Proof (π) & Nullifier
                │
                ▼ Submits Proof (NO identity, NO diagnosis revealed)
[ Midnight Blockchain Smart Contract ]
   • Verifies ZK-Proof on-chain
   • Registers Nullifier to prevent double-joining
   • Grants Ephemeral Token to Anonymous Sanctuary
```

### Key Value Propositions
- **Zero Information Leakage**: No name, national ID, email, IP address, or specific diagnosis is transmitted to the contract or peers.
- **Sybil Resistance via Deterministic Nullifiers**: A member cannot join the same circle multiple times with different identities; the nullifier $N = \text{Hash}(sk, \text{circleId})$ deterministically catches duplicate entries while preserving cross-circle unlinkability.
- **Unlinkable Cross-Circle Activity**: Belonging to a PTSD group cannot be correlated with belonging to an Addiction Recovery group because circle-specific nullifiers use independent salt domains.
- **Decentralized Trust**: Built on the Midnight Preview network with zero reliance on centralized database gatekeepers.

---

## ⛓️ Why Midnight?

VeilCircle is purpose-built for the **Midnight Blockchain** because Midnight natively addresses the exact technical prerequisites for sensitive zero-knowledge workflows:

| Feature | How VeilCircle Leverages It |
| :--- | :--- |
| **Compact Smart Contract Language** | Allows expressing complex cryptographic constraints (private witness parameters, persistent hashing, and ledger sets) directly in high-level domain logic. |
| **Public / Private Dual Ledger State** | Public state stores circle metadata and spent nullifiers; private state executes witnesses entirely inside the client's browser enclave. |
| **Local Proof Server Engine** | Enables generating Zero-Knowledge proofs locally (`http://localhost:6300`) without transmitting private witness parameters over the network. |
| **tDUST Shielded Fee Mechanism** | Gas fees are paid anonymously using unshielded tNIGHT transformed into tDUST capacity, preventing transaction graph deanonymization via fee sponsorship. |
| **Native Wallet Integration** | Seamless user authentication via injected **1AM** and **Lace** Midnight wallet adapters. |

---

## 🔬 Cryptographic Architecture & Circuits

The core contract (`contracts/veilcircle.compact`) compiles into 4 provable circuits using **Compact 0.30.0**:

### 1. `createCircle(circleId, nameHash, issuerPubKey)`
- Initializes an immutable support circle on the public ledger.
- Associates an authorized credential issuer public key and eligibility criteria hash.

### 2. `registerCredentialCommitment(commitment)`
- Clinicians or accredited providers register a blinded commitment $C = \text{Hash}(sk, \text{attribute}, r)$ onto the public ledger.
- The member's secret key ($sk$) and blinding salt ($r$) remain strictly private.

### 3. `proveAndJoinCircle(circleId, expectedNullifier)`
- **Private Witness Inputs**: `secretKeyWitness()`, `eligibilityAttributeWitness()`, `saltWitness()`.
- **Circuit Verification**:
  1. Computes commitment $C = \text{Hash}(sk, \text{attribute}, r)$ and checks that $C \in \text{credentialCommitments}$.
  2. Computes nullifier $N = \text{Hash}(sk, \text{circleId})$ and asserts $N = \text{expectedNullifier}$.
  3. Verifies $N \notin \text{spentNullifiers}$ to prevent replay attacks.
  4. Inserts $N$ into $\text{spentNullifiers}$ and increments the circle member count.

### 4. `isNullifierSpent(nullifier)`
- Public query circuit returning boolean status of whether a nullifier has already been claimed.

---

## 👥 Target Users & Impact

1. **Veterans & First Responders**: Trauma and PTSD recovery without career or security clearance repercussions.
2. **Substance Recovery Groups**: Anonymously proven recovery milestones without social or professional stigma.
3. **Rare & Chronic Illness Patients**: Oncology, autoimmune, and neurodivergent patients connecting safely without health insurance tracking.
4. **Whistleblowers & Human Rights Advocates**: Secure, verified peer enclaves with zero digital footprint.

---

## 🛣️ Roadmap

- **Phase 1 (Completed)**:
  - Smart contract written in Compact 0.30.0 and compiled with zero errors.
  - Zero-Knowledge proving keys and ZKIR artifacts generated.
  - Smart contract deployed on **Midnight Preview Testnet** at address `363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f`.
- **Phase 2 (Completed)**:
  - Full React web application with 1AM and Lace wallet adapters.
  - Client-side ZK-SNARK proving simulator and live contract configuration.
- **Phase 3 (Next Steps)**:
  - End-to-end multi-party encrypted messaging using Midnight session keys.
  - Decentralized clinical attestation issuance portal for healthcare non-profits.
