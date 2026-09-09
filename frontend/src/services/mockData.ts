import { Circle, PrivateCredential } from "../types";

export const DEFAULT_CIRCLES: Circle[] = [
  {
    id: "0000000000000000000000000000000000000000000000000000000000000001",
    title: "Veterans Trauma & PTSD Recovery Circle",
    category: "Trauma & Abuse",
    description: "A private, zero-knowledge safe haven for military veterans and first responders navigating PTSD and combat trauma. Verified without disclosing service record or medical history.",
    eligibilityCriteria: "Attestation of military/first-responder PTSD clinical intake from an accredited VA or civilian health provider.",
    issuerName: "Veterans Health Administration & Trusted Clinical Partners",
    issuerPubKey: "0xa1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
    memberCount: 28,
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod8f29c4ba03e9112a9bc490d3",
    badgeColor: "emerald",
    iconName: "ShieldCheck",
    tags: ["Veterans", "PTSD", "Trauma Recovery", "First Responders"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000002",
    title: "Substance & Addiction Recovery Anonymous",
    category: "Addiction Recovery",
    description: "Confidential peer-to-peer fellowship for individuals maintaining sobriety and recovery from opioid, alcohol, or substance dependency.",
    eligibilityCriteria: "Clinical recovery pass or verified sponsor referral code with cryptographic zero-knowledge binding.",
    issuerName: "SAMHSA Clinical Network & Verified Recovery Coalition",
    issuerPubKey: "0xb2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2",
    memberCount: 64,
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod8f29c4ba03e9112a9bc490d3",
    badgeColor: "purple",
    iconName: "HeartHandshake",
    tags: ["Addiction", "Sobriety", "12-Steps", "Harm Reduction"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000003",
    title: "Oncology & Chronic Illness Peer Support",
    category: "Chronic & Rare Illness",
    description: "Support group for patients undergoing chemotherapy, radiation, or living with chronic oncological conditions. Share insights free from insurance surveillance.",
    eligibilityCriteria: "Cryptographic diagnosis attestation from an oncology clinic or genomic research consortium.",
    issuerName: "Global Oncology Research & Patient Alliance",
    issuerPubKey: "0xc3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3",
    memberCount: 42,
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod8f29c4ba03e9112a9bc490d3",
    badgeColor: "rose",
    iconName: "Activity",
    tags: ["Oncology", "Cancer Support", "Rare Illness", "Chemotherapy"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000004",
    title: "Neurodivergent & Adult ADHD Circle",
    category: "Mental Health",
    description: "Safe discussion space for neurodivergent individuals, late-diagnosed autistic adults, and ADHDers navigating workplace and life accommodations.",
    eligibilityCriteria: "Licensed psychological evaluation commitment or accredited neurodiversity self-advocate key.",
    issuerName: "Neurodiversity Alliance & Certified Psychologists Guild",
    issuerPubKey: "0xd4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4",
    memberCount: 89,
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod8f29c4ba03e9112a9bc490d3",
    badgeColor: "cyan",
    iconName: "Sparkles",
    tags: ["Neurodiversity", "ADHD", "Autism", "Mental Health"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000005",
    title: "Healthcare Whistleblowers & Ethical Advocates",
    category: "Caregivers & Whistleblowers",
    description: "Encrypted sanctuary for hospital workers, nurses, and medical researchers reporting institutional misconduct without career jeopardy.",
    eligibilityCriteria: "Cryptographic medical license verification hash without revealing physician license number or hospital employer.",
    issuerName: "Ethical Healthcare Coalition & Defense Registry",
    issuerPubKey: "0xe5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5",
    memberCount: 17,
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod8f29c4ba03e9112a9bc490d3",
    badgeColor: "amber",
    iconName: "Lock",
    tags: ["Whistleblower", "Healthcare", "Ethics", "Nurses"]
  }
];

export const DEMO_CREDENTIAL_TEMPLATES = [
  {
    id: "cred_va_ptsd_2026",
    title: "Veterans Clinical Intake Attestation",
    issuerName: "Veterans Health Administration",
    category: "Trauma & Abuse",
    conditionCode: "ICD-10-F43.10 (Post-traumatic stress disorder)",
    clinicalReferenceCode: "VA-CLINIC-9821-X",
    validityWindow: "2026-2028"
  },
  {
    id: "cred_samhsa_sobriety",
    title: "Clinical Recovery Pass & Sobriety Proof",
    issuerName: "SAMHSA Clinical Network",
    category: "Addiction Recovery",
    conditionCode: "DSM-5-SUD-RECOVERY-ACTIVE",
    clinicalReferenceCode: "RECOV-PASS-5541-A",
    validityWindow: "2026-2027"
  },
  {
    id: "cred_oncology_dx",
    title: "Oncology Diagnosis & Patient Attestation",
    issuerName: "Global Oncology Research Alliance",
    category: "Chronic & Rare Illness",
    conditionCode: "ICD-10-C50.9 (Oncological Care Pathway)",
    clinicalReferenceCode: "ONCO-REF-1092-Z",
    validityWindow: "2026-2029"
  },
  {
    id: "cred_neuro_eval",
    title: "Psychological Evaluation Attestation",
    issuerName: "Neurodiversity Alliance Guild",
    category: "Mental Health",
    conditionCode: "DSM-5-ADHD-COMBINED",
    clinicalReferenceCode: "PSYCH-DX-3390-N",
    validityWindow: "Perpetual"
  }
];
