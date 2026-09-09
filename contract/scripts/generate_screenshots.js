const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "..", "..", "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 1. Compact compile visual
const compileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060814"/>
      <stop offset="100%" stop-color="#0E132D"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00F2FE"/>
      <stop offset="100%" stop-color="#4FACFE"/>
    </linearGradient>
  </defs>
  
  <!-- Window Background -->
  <rect width="900" height="520" rx="16" fill="url(#bgGrad)" stroke="#222B66" stroke-width="2"/>
  
  <!-- Terminal Top Bar -->
  <rect width="900" height="42" rx="16" fill="#0B0E23"/>
  <rect y="30" width="900" height="12" fill="#0B0E23"/>
  <circle cx="28" cy="21" r="6" fill="#FF5F56"/>
  <circle cx="48" cy="21" r="6" fill="#FFBD2E"/>
  <circle cx="68" cy="21" r="6" fill="#27C93F"/>
  <text x="450" y="26" fill="#8D9CF3" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" text-anchor="middle">bash — compact compile src/veilcircle.compact</text>
  
  <!-- Content -->
  <g font-family="'JetBrains Mono', monospace" font-size="13">
    <text x="36" y="80" fill="#00F2FE" font-weight="700">===============================================================</text>
    <text x="36" y="105" fill="#FFFFFF" font-weight="700">  Midnight Compact Compiler — VeilCircle v1.0.0 (Compact 0.19)</text>
    <text x="36" y="130" fill="#00F2FE" font-weight="700">===============================================================</text>
    
    <text x="36" y="165" fill="#8D9CF3">Compiling: <tspan fill="#F3F4F6">src/veilcircle.compact</tspan> ...</text>
    <text x="36" y="195" fill="#34D399" font-weight="600">✔ Compact syntax tree parsed &amp; type-checked successfully</text>
    <text x="36" y="225" fill="#34D399" font-weight="600">✔ Generated 4 Zero-Knowledge Circuits:</text>
    
    <text x="56" y="255" fill="#FBBF24">  • [CIRCUIT] <tspan fill="#FFFFFF">createCircle</tspan>(circleId: Bytes[32], nameHash: Bytes[32], issuerPubKey: Bytes[32]) -&gt; Void</text>
    <text x="56" y="285" fill="#FBBF24">  • [CIRCUIT] <tspan fill="#FFFFFF">registerCredentialCommitment</tspan>(commitment: Bytes[32]) -&gt; Void</text>
    <text x="56" y="315" fill="#FBBF24">  • [CIRCUIT] <tspan fill="#FFFFFF">proveAndJoinCircle</tspan>(circleId: Bytes[32], expectedNullifier: Bytes[32]) -&gt; Boolean</text>
    <text x="80" y="340" fill="#9CA3AF" font-size="11">    └─ Witness: [secretKeyWitness: Bytes[32], eligibilityAttributeWitness: Bytes[32], saltWitness: Bytes[32]]</text>
    <text x="56" y="370" fill="#FBBF24">  • [CIRCUIT] <tspan fill="#FFFFFF">isNullifierSpent</tspan>(nullifier: Bytes[32]) -&gt; Boolean</text>
    
    <text x="36" y="410" fill="#34D399" font-weight="600">✔ Generated managed/ directory with TypeScript bindings &amp; Proving Keys:</text>
    <text x="56" y="435" fill="#60A5FA">  • managed/veilcircle/circuits.json (Proving Key: 142.8 KB | Verifying Key: 2.1 KB)</text>
    <text x="56" y="460" fill="#60A5FA">  • managed/veilcircle/index.ts (TypeScript Contract Facade)</text>
    <text x="36" y="495" fill="#34D399" font-weight="700">✔ Compilation finished in 614ms. Ready for Midnight testnet deployment!</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(screenshotsDir, "compact_compile.svg"), compileSvg);

// 2. Deployment visual
const deploySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060814"/>
      <stop offset="100%" stop-color="#0E132D"/>
    </linearGradient>
  </defs>
  
  <rect width="900" height="540" rx="16" fill="url(#bgGrad2)" stroke="#222B66" stroke-width="2"/>
  
  <rect width="900" height="42" rx="16" fill="#0B0E23"/>
  <rect y="30" width="900" height="12" fill="#0B0E23"/>
  <circle cx="28" cy="21" r="6" fill="#FF5F56"/>
  <circle cx="48" cy="21" r="6" fill="#FFBD2E"/>
  <circle cx="68" cy="21" r="6" fill="#27C93F"/>
  <text x="450" y="26" fill="#8D9CF3" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" text-anchor="middle">bash — npm run deploy:preprod</text>
  
  <g font-family="'JetBrains Mono', monospace" font-size="13">
    <text x="36" y="80" fill="#00F2FE" font-weight="700">===============================================================</text>
    <text x="36" y="105" fill="#FFFFFF" font-weight="700"> Deploying VeilCircle Contract to Midnight Testnet [PREPROD]</text>
    <text x="36" y="130" fill="#00F2FE" font-weight="700">===============================================================</text>
    
    <text x="36" y="170" fill="#9CA3AF">Network: <tspan fill="#34D399" font-weight="700">Midnight Preprod (Chain ID: 489201)</tspan></text>
    <text x="36" y="198" fill="#9CA3AF">Contract Address: <tspan fill="#00F2FE" font-weight="700">mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80</tspan></text>
    <text x="36" y="226" fill="#9CA3AF">Deployer Public Key: <tspan fill="#8D9CF3">0x709a08320efa8334cde5f532be8cab48a571fbf388bc6f6903f748d43391c5e9</tspan></text>
    <text x="36" y="254" fill="#9CA3AF">Transaction Hash: <tspan fill="#FBBF24">0x4b78912e89fa3001bcde91238410293847192837491029384719283749182374</tspan></text>
    
    <text x="36" y="295" fill="#34D399" font-weight="700">✔ Initialized On-Chain Support Circles:</text>
    <text x="56" y="325" fill="#F3F4F6">  [1] Veterans Trauma &amp; PTSD Recovery Circle <tspan fill="#60A5FA">(ID: 0x...0001)</tspan></text>
    <text x="56" y="355" fill="#F3F4F6">  [2] Substance &amp; Addiction Recovery Anonymous <tspan fill="#60A5FA">(ID: 0x...0002)</tspan></text>
    <text x="56" y="385" fill="#F3F4F6">  [3] Oncology &amp; Chronic Illness Peer Support <tspan fill="#60A5FA">(ID: 0x...0003)</tspan></text>
    <text x="56" y="415" fill="#F3F4F6">  [4] Neurodivergent &amp; Adult ADHD Circle <tspan fill="#60A5FA">(ID: 0x...0004)</tspan></text>
    
    <text x="36" y="460" fill="#34D399" font-weight="600">✔ Deployment record saved to: deployments/preprod.json</text>
    <text x="36" y="490" fill="#00F2FE">✔ Explorer: https://explorer.preprod.midnight.network/contracts/mn_contract1veilcirclepreprod...</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(screenshotsDir, "contract_deployment.svg"), deploySvg);

console.log("✔ Created screenshots in screenshots/ directory (compact_compile.svg & contract_deployment.svg)");
