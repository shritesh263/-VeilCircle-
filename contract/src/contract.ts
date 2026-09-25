import {
  bytesToHex,
  computeCommitment,
  computeNullifier,
  generateZkProof,
  hexToBytes,
  sha256,
  ZkProof
} from "./crypto";

export interface CircleInfo {
  id: string; // Hex 32 bytes
  nameHash: string; // Hex 32 bytes
  issuerPubKey: string; // Hex 32 bytes
  memberCount: number;
  isActive: boolean;
}

export interface PrivateWitness {
  secretKey: Uint8Array; // 32 bytes private secret
  eligibilityAttribute: Uint8Array; // 32 bytes private attribute / condition hash
  salt: Uint8Array; // 32 bytes random blinding factor
}

export interface JoinProofResult {
  proof: ZkProof;
  publicInputs: {
    circleId: string;
    nullifier: string;
  };
  success: boolean;
}

export class VeilCircleContract {
  // Public Ledger State (Observable on-chain)
  public circles: Map<string, CircleInfo> = new Map();
  public spentNullifiers: Set<string> = new Set();
  public credentialCommitments: Set<string> = new Set();
  public totalMembershipsProven: number = 0;

  // Contract address on Midnight network
  public address: string;

  constructor(address?: string) {
    this.address = address || "0x" + bytesToHex(sha256("veilcircle_v1_midnight_preprod"));
  }

  /**
   * Public Circuit: createCircle
   */
  public createCircle(
    circleId: string,
    name: string,
    issuerPubKey: string
  ): CircleInfo {
    const cleanId = circleId.toLowerCase();
    if (this.circles.has(cleanId)) {
      throw new Error("Circle with this ID already exists");
    }

    const nameHash = bytesToHex(sha256(name));
    const circle: CircleInfo = {
      id: cleanId,
      nameHash,
      issuerPubKey,
      memberCount: 0,
      isActive: true
    };

    this.circles.set(cleanId, circle);
    return circle;
  }

  /**
   * Public Circuit: registerCredentialCommitment
   * Trusted issuer registers a commitment = H(secretKey, attribute, salt)
   */
  public registerCredentialCommitment(commitmentHex: string): void {
    const cleanCommitment = commitmentHex.toLowerCase();
    if (this.credentialCommitments.has(cleanCommitment)) {
      throw new Error("Commitment already registered");
    }
    this.credentialCommitments.add(cleanCommitment);
  }

  /**
   * Client-Side ZK Witness Execution: proveAndJoinCircle
   * Verifies private witness and executes the circuit
   */
  public proveAndJoinCircle(
    circleId: string,
    witness: PrivateWitness
  ): JoinProofResult {
    const cleanId = circleId.toLowerCase();
    const circle = this.circles.get(cleanId);
    if (!circle) {
      throw new Error("Target circle does not exist");
    }
    if (!circle.isActive) {
      throw new Error("Circle is currently inactive");
    }

    // 1. Calculate commitment from client private witness
    const calculatedCommitmentBytes = computeCommitment(
      witness.secretKey,
      witness.eligibilityAttribute,
      witness.salt
    );
    const calculatedCommitmentHex = bytesToHex(calculatedCommitmentBytes);

    // 2. Circuit check: commitment must exist on ledger
    if (!this.credentialCommitments.has(calculatedCommitmentHex)) {
      throw new Error("Invalid or unverified credential commitment: Proof rejected");
    }

    // 3. Derive deterministic nullifier for this circle
    const circleBytes = hexToBytes(cleanId);
    const derivedNullifierBytes = computeNullifier(witness.secretKey, circleBytes);
    const derivedNullifierHex = bytesToHex(derivedNullifierBytes);

    // 4. Sybil check: verify nullifier is not already spent
    if (this.spentNullifiers.has(derivedNullifierHex)) {
      throw new Error("Nullifier already spent: Member already joined this circle");
    }

    // 5. Generate ZK-SNARK proof of the statement
    const proof = generateZkProof(
      "proveAndJoinCircle",
      { circleId: cleanId, nullifier: derivedNullifierHex },
      calculatedCommitmentHex
    );

    // 6. Apply state transition to ledger
    this.spentNullifiers.add(derivedNullifierHex);
    this.totalMembershipsProven += 1;
    circle.memberCount += 1;
    this.circles.set(cleanId, { ...circle });

    return {
      proof,
      publicInputs: {
        circleId: cleanId,
        nullifier: derivedNullifierHex
      },
      success: true
    };
  }

  /**
   * Read-only helper: isNullifierSpent
   */
  public isNullifierSpent(nullifierHex: string): boolean {
    return this.spentNullifiers.has(nullifierHex.toLowerCase());
  }

  /**
   * Export ledger state for inspection
   */
  public getPublicLedgerState() {
    return {
      contractAddress: this.address,
      circlesCount: this.circles.size,
      circles: Array.from(this.circles.values()),
      spentNullifiers: Array.from(this.spentNullifiers),
      credentialCommitments: Array.from(this.credentialCommitments),
      totalMembershipsProven: this.totalMembershipsProven
    };
  }
}
