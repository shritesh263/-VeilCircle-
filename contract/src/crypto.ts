import * as crypto from "crypto";

/**
 * VeilCircle Cryptographic Utilities
 * Simulates Midnight Compact persistent_hash and zero-knowledge circuit commitments
 */

export function sha256(data: Uint8Array | string): Uint8Array {
  const hash = crypto.createHash("sha256");
  if (typeof data === "string") {
    hash.update(data, "utf8");
  } else {
    hash.update(data);
  }
  return new Uint8Array(hash.digest());
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const paddedHex = cleanHex.length % 2 !== 0 ? "0" + cleanHex : cleanHex;
  const bytes = new Uint8Array(paddedHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(paddedHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export function randomBytes(length: number = 32): Uint8Array {
  return new Uint8Array(crypto.randomBytes(length));
}

/**
 * Computes commitment = persistent_hash([secretKey, attribute, salt])
 */
export function computeCommitment(
  secretKey: Uint8Array,
  attribute: Uint8Array,
  salt: Uint8Array
): Uint8Array {
  const combined = new Uint8Array(secretKey.length + attribute.length + salt.length);
  combined.set(secretKey, 0);
  combined.set(attribute, secretKey.length);
  combined.set(salt, secretKey.length + attribute.length);
  return sha256(combined);
}

/**
 * Computes nullifier = persistent_hash([secretKey, circleId])
 */
export function computeNullifier(
  secretKey: Uint8Array,
  circleId: Uint8Array
): Uint8Array {
  const combined = new Uint8Array(secretKey.length + circleId.length);
  combined.set(secretKey, 0);
  combined.set(circleId, secretKey.length);
  return sha256(combined);
}

/**
 * Generate a mock ZK-SNARK proof structure matching Midnight's proof witness
 */
export interface ZkProof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
  publicInputs: string[];
}

export function generateZkProof(
  circuitName: string,
  publicInputs: Record<string, string>,
  witnessCommitment: string
): ZkProof {
  const proofSeed = sha256(circuitName + witnessCommitment + JSON.stringify(publicInputs));
  const seedHex = bytesToHex(proofSeed);

  return {
    pi_a: [
      "0x" + seedHex.slice(0, 32),
      "0x" + seedHex.slice(32, 64)
    ],
    pi_b: [
      ["0x" + seedHex.slice(0, 32), "0x" + seedHex.slice(16, 48)],
      ["0x" + seedHex.slice(32, 64), "0x" + seedHex.slice(8, 40)]
    ],
    pi_c: [
      "0x" + seedHex.slice(16, 48),
      "0x" + seedHex.slice(0, 32)
    ],
    publicInputs: Object.values(publicInputs)
  };
}
