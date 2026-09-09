import { describe, it, expect, beforeEach } from "vitest";
import { VeilCircleContract, PrivateWitness } from "../src/contract";
import {
  computeCommitment,
  computeNullifier,
  randomBytes,
  bytesToHex,
  hexToBytes
} from "../src/crypto";

describe("VeilCircle Smart Contract & ZK Circuits", () => {
  let contract: VeilCircleContract;
  const circleIdHex = "0000000000000000000000000000000000000000000000000000000000000001";
  const circleName = "Veterans Trauma & PTSD Recovery Circle";
  const issuerPubKeyHex = "0x" + "a1".repeat(32);

  beforeEach(() => {
    contract = new VeilCircleContract();
    contract.createCircle(circleIdHex, circleName, issuerPubKeyHex);
  });

  it("1. Should successfully initialize a support circle with public metadata", () => {
    const circle = contract.circles.get(circleIdHex);
    expect(circle).toBeDefined();
    expect(circle?.isActive).toBe(true);
    expect(circle?.memberCount).toBe(0);
  });

  it("2. Valid membership proof succeeds without leaking identity or condition data", () => {
    // 1. User generates private witness on client device
    const secretKey = randomBytes(32);
    const eligibilityAttribute = randomBytes(32); // e.g. hash("PTSD_DIAGNOSIS_VALID_2026")
    const salt = randomBytes(32);

    const witness: PrivateWitness = {
      secretKey,
      eligibilityAttribute,
      salt
    };

    // 2. Issuer computes & pre-authorizes commitment = H(secretKey, attribute, salt)
    const commitmentBytes = computeCommitment(secretKey, eligibilityAttribute, salt);
    const commitmentHex = bytesToHex(commitmentBytes);
    contract.registerCredentialCommitment(commitmentHex);

    // 3. User proves eligibility and joins circle
    const joinResult = contract.proveAndJoinCircle(circleIdHex, witness);

    expect(joinResult.success).toBe(true);
    expect(joinResult.publicInputs.circleId).toBe(circleIdHex);
    expect(joinResult.publicInputs.nullifier).toBeDefined();

    // Verify ledger state updated
    const circle = contract.circles.get(circleIdHex);
    expect(circle?.memberCount).toBe(1);
    expect(contract.isNullifierSpent(joinResult.publicInputs.nullifier)).toBe(true);
    expect(contract.totalMembershipsProven).toBe(1);
  });

  it("3. Invalid/forged witness proof fails and is rejected by circuit", () => {
    // Legitimate credential registered
    const legitSecret = randomBytes(32);
    const legitAttr = randomBytes(32);
    const legitSalt = randomBytes(32);
    const commitmentHex = bytesToHex(computeCommitment(legitSecret, legitAttr, legitSalt));
    contract.registerCredentialCommitment(commitmentHex);

    // Attacker attempts to forge proof with unapproved attribute/secret
    const fakeSecret = randomBytes(32);
    const fakeWitness: PrivateWitness = {
      secretKey: fakeSecret,
      eligibilityAttribute: legitAttr,
      salt: legitSalt
    };

    expect(() => {
      contract.proveAndJoinCircle(circleIdHex, fakeWitness);
    }).toThrowError(/Invalid or unverified credential commitment/);

    // Verify member count remains 0
    expect(contract.circles.get(circleIdHex)?.memberCount).toBe(0);
  });

  it("4. Double-spend / nullifier reuse is strictly rejected", () => {
    const secretKey = randomBytes(32);
    const eligibilityAttribute = randomBytes(32);
    const salt = randomBytes(32);

    const witness: PrivateWitness = {
      secretKey,
      eligibilityAttribute,
      salt
    };

    const commitmentHex = bytesToHex(computeCommitment(secretKey, eligibilityAttribute, salt));
    contract.registerCredentialCommitment(commitmentHex);

    // First join succeeds
    const firstResult = contract.proveAndJoinCircle(circleIdHex, witness);
    expect(firstResult.success).toBe(true);

    // Second join attempt with same credential to same circle MUST fail
    expect(() => {
      contract.proveAndJoinCircle(circleIdHex, witness);
    }).toThrowError(/Nullifier already spent/);

    expect(contract.circles.get(circleIdHex)?.memberCount).toBe(1);
  });

  it("5. Circle Isolation: Same credential generates unique, uncorrelated nullifiers for different circles", () => {
    const circle2IdHex = "0000000000000000000000000000000000000000000000000000000000000002";
    contract.createCircle(circle2IdHex, "Addiction Recovery Anonymous", issuerPubKeyHex);

    const secretKey = randomBytes(32);
    const eligibilityAttribute = randomBytes(32);
    const salt = randomBytes(32);

    const witness: PrivateWitness = {
      secretKey,
      eligibilityAttribute,
      salt
    };

    const commitmentHex = bytesToHex(computeCommitment(secretKey, eligibilityAttribute, salt));
    contract.registerCredentialCommitment(commitmentHex);

    // Join Circle 1
    const result1 = contract.proveAndJoinCircle(circleIdHex, witness);
    // Join Circle 2
    const result2 = contract.proveAndJoinCircle(circle2IdHex, witness);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    // Nullifiers must be completely different to prevent cross-circle linkability
    expect(result1.publicInputs.nullifier).not.toBe(result2.publicInputs.nullifier);
  });
});
