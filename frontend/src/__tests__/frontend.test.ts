import { describe, it, expect, beforeEach, afterEach, beforeAll } from "vitest";
import { computeCommitment, computeNullifier, generateProofForCircle, generateRandomHex } from "../services/crypto";
import { DEFAULT_CIRCLES } from "../services/mockData";
import { midnightService, getAvailableWallets } from "../services/midnight";

describe("Frontend Crypto & Midnight Integration", () => {
  beforeAll(() => {
    if (typeof (globalThis as any).window === "undefined") {
      (globalThis as any).window = globalThis;
    }
  });

  beforeEach(() => {
    midnightService.disconnectWallet();
    delete (window as any).midnight;
    delete (window as any).cardano;
  });

  afterEach(() => {
    delete (window as any).midnight;
    delete (window as any).cardano;
  });

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

  it("4. Returns empty wallet list when no Midnight extensions are injected in window", () => {
    const wallets = midnightService.getAvailableWallets();
    expect(wallets.length).toBe(0);
  });

  it("5. Dynamically discovers 1AM and Lace when injected into window.midnight", async () => {
    (window as any).midnight = {
      "1am": {
        name: "1AM Wallet",
        rdns: "xyz.1am.wallet",
        icon: "data:image/svg+xml;base64,mock1am",
        apiVersion: "1.1.0",
        connect: async () => ({
          getShieldedAddresses: async () => ({ shieldedAddress: "mn_addr_testnet1qq9x48k7f2w0p1am" }),
          getUnshieldedAddress: async () => ({ unshieldedAddress: "mn_unshielded1am" }),
          getDustAddress: async () => ({ dustAddress: "mn_dust1am" }),
          getDustBalance: async () => ({ balance: 25000000n, cap: 100000000n }),
          getUnshieldedBalances: async () => ({ "00": 50000000n }),
          getConfiguration: async () => ({
            indexerUri: "https://indexer.preprod.midnight.network",
            indexerWsUri: "wss://indexer.preprod.midnight.network",
            substrateNodeUri: "https://rpc.preprod.midnight.network",
            proverServerUri: "http://localhost:6300",
            networkId: "preprod"
          })
        })
      },
      "mnLace": {
        name: "Midnight Lace",
        rdns: "io.lace.midnight",
        icon: "data:image/svg+xml;base64,mocklace",
        apiVersion: "1.0.0",
        connect: async () => ({
          getShieldedAddresses: async () => ({ shieldedAddress: "mn_addr_testnet1qq9x48k7f2w0place" }),
          getUnshieldedAddress: async () => ({ unshieldedAddress: "mn_unshieldedlace" }),
          getDustAddress: async () => ({ dustAddress: "mn_dustlace" }),
          getDustBalance: async () => ({ balance: 12000000n, cap: 50000000n }),
          getUnshieldedBalances: async () => ({ "00": 10000000n }),
          getConfiguration: async () => ({
            indexerUri: "https://indexer.preprod.midnight.network",
            indexerWsUri: "wss://indexer.preprod.midnight.network",
            substrateNodeUri: "https://rpc.preprod.midnight.network",
            proverServerUri: "http://localhost:6300",
            networkId: "preprod"
          })
        })
      }
    };

    const wallets = midnightService.getAvailableWallets();
    expect(wallets.length).toBe(2);

    const oneAm = wallets.find((w) => w.is1AM);
    expect(oneAm).toBeDefined();
    expect(oneAm?.rdns).toBe("xyz.1am.wallet");

    const lace = wallets.find((w) => w.isLace);
    expect(lace).toBeDefined();
    expect(lace?.rdns).toBe("io.lace.midnight");

    // Connect to 1AM
    const state = await midnightService.connectWallet(oneAm!);
    expect(state.isConnected).toBe(true);
    expect(state.provider).toBe("xyz.1am.wallet");
    expect(state.shieldedAddress).toBe("mn_addr_testnet1qq9x48k7f2w0p1am");
    expect(state.balanceDUST).toBe(25);
    expect(state.serviceConfig?.proverServerUri).toBe("http://localhost:6300");

    // Disconnect
    midnightService.disconnectWallet();
    const disconnected = midnightService.getWalletState();
    expect(disconnected.isConnected).toBe(false);
    expect(disconnected.address).toBeNull();
  });
});
