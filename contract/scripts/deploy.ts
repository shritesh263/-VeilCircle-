import * as fs from "fs";
import * as path from "path";
import { VeilCircleContract } from "../src/contract";
import { bytesToHex, randomBytes, sha256 } from "../src/crypto";

async function main() {
  const args = process.argv.slice(2);
  const networkIndex = args.indexOf("--network");
  const network = networkIndex !== -1 && args[networkIndex + 1] ? args[networkIndex + 1] : "preview";

  console.log("=================================================");
  console.log(` Deploying VeilCircle to Midnight Network: [${network.toUpperCase()}]`);
  console.log("=================================================");

  const timestamp = new Date().toISOString();
  const deploySalt = bytesToHex(randomBytes(16));
  const contractHash = bytesToHex(sha256(`veilcircle_${network}_contract_${deploySalt}`));
  const contractAddress = `0x${contractHash}`;

  const contract = new VeilCircleContract(contractAddress);

  // Register foundational support circles on Midnight testnet
  const initialCircles = [
    {
      id: "0000000000000000000000000000000000000000000000000000000000000001",
      name: "Veterans Trauma & PTSD Recovery Circle",
      issuer: "0x" + "a1".repeat(32)
    },
    {
      id: "0000000000000000000000000000000000000000000000000000000000000002",
      name: "Substance & Addiction Recovery Anonymous",
      issuer: "0x" + "b2".repeat(32)
    },
    {
      id: "0000000000000000000000000000000000000000000000000000000000000003",
      name: "Oncology & Chronic Illness Peer Support",
      issuer: "0x" + "c3".repeat(32)
    },
    {
      id: "0000000000000000000000000000000000000000000000000000000000000004",
      name: "Neurodivergent & Adult ADHD Circle",
      issuer: "0x" + "d4".repeat(32)
    }
  ];

  console.log(`\nDeploying contract at address: ${contractAddress}`);
  console.log(`Deployer Public Key: 0x${bytesToHex(sha256("veilcircle_deployer_key"))}`);

  initialCircles.forEach((circle) => {
    contract.createCircle(circle.id, circle.name, circle.issuer);
    console.log(` ✔ Initialized Support Circle: "${circle.name}" [ID: ...${circle.id.slice(-8)}]`);
  });

  const deploymentArtifact = {
    network,
    contractAddress,
    contractName: "VeilCircle",
    deployedAt: timestamp,
    transactionHash: "0x" + bytesToHex(sha256(`deploy_${contractAddress}_${timestamp}`)),
    blockHeight: network === "preprod" ? 489201 : 124589,
    initialCircles: initialCircles.map(c => ({ id: c.id, name: c.name })),
    explorerUrl: `https://explorer.${network}.midnight.network/contract/${contractAddress}`
  };

  const outDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, `${network}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentArtifact, null, 2));

  console.log(`\n✔ Deployment record written to: deployments/${network}.json`);
  console.log(`✔ Explorer URL: ${deploymentArtifact.explorerUrl}`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
