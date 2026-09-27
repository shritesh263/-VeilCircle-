# VeilCircle — Usage & User Guide 🛡️

**VeilCircle** is a zero-knowledge peer health support network built on the **Midnight Blockchain**. It empowers users dealing with sensitive medical, psychological, or recovery journeys to prove their eligibility and join peer sanctuaries without revealing their identity, diagnosis, medical provider, or cross-circle activity.

---

## ⚡ Quick Links

- 🚀 **Live Production DApp**: [https://veil-circle.vercel.app](https://veil-circle.vercel.app)
- 📜 **Deployed Preview Contract**: [`363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f`](https://preview.midnightexplorer.com/contracts/0x363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f)
- 🔍 **Midnight Preview Explorer**: [preview.midnightexplorer.com/contracts/0x363d...](https://preview.midnightexplorer.com/contracts/0x363d699425045ed5f61f4485babaa9eef6d3625024714e60259f72d4a810a40f)
- 🎥 **Product Demo Video**: [https://drive.google.com/file/d/1E6O49P6oLA8SkSfrYYYnxGW4Ms178uU9/view?usp=sharing](https://drive.google.com/file/d/1E6O49P6oLA8SkSfrYYYnxGW4Ms178uU9/view?usp=sharing)
- 🐦 **Twitter / X Community**: [https://x.com/veilcircle?s=11](https://x.com/veilcircle?s=11) (`@veilcircle`)

---

## 📋 Prerequisites

Before running VeilCircle locally or testing on Midnight Preview:

1. **Node.js**: Version 20.x or higher (`node -v`)
2. **Midnight Wallet Extension**:
   - **1AM Wallet** (Recommended for Preview) or **Lace Wallet** (with Midnight Preview support enabled)
3. **Docker** (Optional, only needed if generating deployment proofs locally):
   ```bash
   docker run -d -p 6300:6300 --name midnight-proof-server midnightnetwork/proof-server:latest
   ```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/shritesh263/-VeilCircle-.git
cd -VeilCircle-
```

### 2. Install Dependencies

```bash
# Install root, contract, and frontend dependencies
npm run install:all
```

### 3. Launch Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 👛 Wallet Setup & Funding on Midnight Preview

1. Open the [Midnight Preview Faucet](https://faucet.preview.midnight.network).
2. Connect or paste your Midnight unshielded address (starts with `mn_addr_preview...`).
3. Request test tokens (**tNIGHT**). These tokens are used to generate **tDUST** for contract interactions.
4. In your wallet (1AM or Lace), ensure the network is switched to **Midnight Preview Testnet**.

---

## 🔒 How to Use VeilCircle Privacy Features

### 1. Connect Your Wallet
- Click **"Connect Wallet"** in the top navigation bar.
- Choose your installed wallet (1AM or Lace).
- Approve the read-only authorization popup.
- Your address and tNIGHT / tDUST balances will appear in the top bar.

### 2. Explore Support Circles
- Navigate to **"Support Circles"** to view existing verified communities:
  - *Veterans Trauma & PTSD Recovery Sanctuary*
  - *Substance & Addiction Recovery Anonymous*
  - *Oncology & Rare Illness Peer Group*
  - *Whistleblower & Investigative Journalists Enclave*
- Each circle is registered on the Midnight Preview blockchain ledger.

### 3. Prove Eligibility via Client-Side ZK-SNARK
- Click **"Join with ZK Proof"** on any circle.
- Enter your clinical attestation or select a demo referral credential.
- Click **"Prove Membership"**:
  - The Compact Zero-Knowledge prover runs inside your browser sandbox.
  - A blinded commitment $C = \text{Hash}(sk, \text{attribute}, r)$ is matched against the valid commitment set.
  - A deterministic nullifier $N = \text{Hash}(sk, \text{circleId})$ is computed.
  - The zero-knowledge proof ($\pi$) proves your eligibility without revealing your identity or condition.
- Sign the proof submission with your wallet.

### 4. Enter the Anonymous Peer Sanctuary
- Once the proof is validated on the Midnight ledger, an anonymous ephemeral session token is granted.
- Enter the real-time encrypted peer room.
- Interact with peers under your anonymous alias (`Veil #...`) with cryptographic assurance that every participant in the room has also proven valid eligibility.

---

## 🧪 Testing

### Contract Unit Tests
Verify all Compact circuits, nullifier tracking, and cryptographic proofs:
```bash
npm run test:contract
```

### Frontend Tests
Verify wallet state management, ZK formatting, and component rendering:
```bash
npm run test:frontend
```

---

## 🛠️ Contract Architecture

The VeilCircle smart contract is written in **Compact 0.30.0** (`contract/src/veilcircle.compact`):

| Circuit | Access | Description |
| :--- | :--- | :--- |
| `createCircle` | Public | Instantiates a new support circle on the public ledger. |
| `registerCredentialCommitment` | Public | Adds a blinded credential commitment $C$ to the authorized set. |
| `proveAndJoinCircle` | ZK-SNARK | Proves knowledge of private witness ($sk$, attribute, $r$) matching a valid commitment, checks non-membership in `spentNullifiers`, and marks the nullifier as spent. |
| `isNullifierSpent` | Query | View function checking if a member nullifier has already joined. |
