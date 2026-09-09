import { describe, it, expect } from "vitest";
import { computeCommitment, computeNullifier, generateProofForCircle, generateRandomHex } from "../services/crypto";
import { DEFAULT_CIRCLES } from "../services/mockData";

describe("Frontend Crypto & Midnight Integration", () => {
  it("1. Generates deterministic commitments from private witness values", async () => {
    const secretKeyHex = "8f29c4ba03e9112a9bc490d347890ef9923841cd2789123490abbacde0912384";
    const attributeHex = "12a9bc490d347890ef9923841cd278918f29c4ba03e9123490abbacde0912384";
    const saltHex = "5c4d2c83f260429fb2614048fd0067f4a1b2c3d4e5f60718293a4b5c6d7e8f90";

    const commitment1 = await computeCommitment(secretKeyHex, attributeHex, saltHex);
    const commitment2 = await computeCommitment(secretKeyHex, attributeHex, saltHex);

    expect(commitment1).toBe(commitment2);
    expect(commitment1.length).toBe(64);
  });

  it("2. Generates circle-isolated nullifiers preventing cross-circle tracking", async () => {
    const secretKeyHex = generateRandomHex(32);
    const circle1Id = DEFAULT_CIRCLES[0].id;
    const circle2Id = DEFAULT_CIRCLES[1].id;

    const nullifier1 = await computeNullifier(secretKeyHex, circle1Id);
    const nullifier2 = await computeNullifier(secretKeyHex, circle2Id);

    expect(nullifier1).not.toBe(nullifier2);
  });

  it("3. Synthesizes ZK-SNARK circuit proof with blinded private witness", async () => {
    const secret = generateRandomHex(32);
    const attr = generateRandomHex(32);
    const salt = generateRandomHex(32);
    const circleId = DEFAULT_CIRCLES[0].id;

    const result = await generateProofForCircle(circleId, secret, attr, salt);

    expect(result.proof).toBeDefined();
    expect(result.proof.circuitName).toBe("proveAndJoinCircle");
    expect(result.proof.publicInputs.circleId).toBe(circleId);
    expect(result.proof.publicInputs.nullifier).toBe(result.nullifier);
    expect(result.proof.witnessBlinded).toBe(true);
  });
});
