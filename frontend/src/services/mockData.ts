import { Circle, PrivateCredential, PeerMessage } from "../types";

export const DEFAULT_CIRCLES: Circle[] = [
  {
    id: "0000000000000000000000000000000000000000000000000000000000000001",
    title: "Oncology Caregivers Sanctuary",
    category: "Caregiver Support",
    description: "A restorative, zero-knowledge safe haven for family caregivers supporting loved ones through oncology treatments and chronic recovery.",
    eligibilityCriteria: "Trusted Clinic Diagnosis Attestation or Clinical Oncology Intake Voucher",
    issuerName: "St. Jude Children'\''s Research Hospital & Clinical Partners",
    issuerPubKey: "0xa1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
    memberCount: 42,
    cohort: "Cohort 04",
    scheduleBadge: "Daily Check-in 7pm",
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80",
    badgeColor: "primary",
    iconName: "nature_people",
    tags: ["caregiver", "referrals", "oncology", "sanctuary"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000002",
    title: "Physicians & Healthcare Burnout",
    category: "Burnout & Recovery",
    description: "Confidential peer decompression space for doctors, nurses, and hospital clinicians navigating occupational burnout and systemic stress.",
    eligibilityCriteria: "State Medical Board anonymous credential or verified physician referral code",
    issuerName: "State Medical Board & Verified Clinician Alliance",
    issuerPubKey: "0xb2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2",
    memberCount: 18,
    cohort: "Cohort 02",
    scheduleBadge: "Peer Moderated",
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80",
    badgeColor: "secondary",
    iconName: "stethoscope",
    tags: ["burnout", "referrals", "physicians", "high-privacy"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000003",
    title: "Chronic Pain & Resilience Circle",
    category: "Chronic Health",
    description: "Supportive fellowship for individuals managing chronic pain syndromes and neurological conditions. Share insights free from insurance surveillance.",
    eligibilityCriteria: "Specialist referral code nullifier proof or clinical pain management attestation",
    issuerName: "National Chronic Care Registry & Genomic Consortium",
    issuerPubKey: "0xc3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3",
    memberCount: 64,
    cohort: "Cohort 07",
    scheduleBadge: "Asynchronous",
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80",
    badgeColor: "primary",
    iconName: "vital_signs",
    tags: ["chronic", "pain-management", "open-enclave"]
  },
  {
    id: "0000000000000000000000000000000000000000000000000000000000000004",
    title: "Grief & Healing Sacred Space",
    category: "Mental Health",
    description: "Gentle sanctuary for processing profound bereavement and loss. Speak authentically in a shielded circle with zero judgement.",
    eligibilityCriteria: "Anonymous licensed provider voucher or peer invite nullifier",
    issuerName: "Grief Support Foundation & Licensed Therapists Guild",
    issuerPubKey: "0xd4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4",
    memberCount: 29,
    cohort: "Cohort 01",
    scheduleBadge: "Gentle Mode",
    isActive: true,
    contractAddress: "mn_contract1veilcirclepreprod4b67857a492f6fb23e475b80",
    badgeColor: "tertiary",
    iconName: "spa",
    tags: ["caregiver", "burnout", "grief", "healing"]
  }
];

export const INITIAL_CREDENTIALS: PrivateCredential[] = [
  {
    id: "cred_st_jude_01",
    title: "Clinical Diagnosis Attestation",
    issuerName: "St. Jude Children'\''s Research Hospital",
    issuerPubKey: "0xa1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1",
    secretKeyHex: "8f29c4ba03e9112a9bc490d347890ef9923841cd2789123490abbacde0912384",
    attributeHex: "12a9bc490d347890ef9923841cd278918f29c4ba03e9123490abbacde0912384",
    saltHex: "5c4d2c83f260429fb2614048fd0067f4a1b2c3d4e5f60718293a4b5c6d7e8f90",
    commitmentHex: "0xe7f9201bc490d347890ef9923841cd2789123490abbacde09123841029384719",
    issuedAt: "2024-10-15T10:30:00Z",
    category: "Caregiver Support",
    predicateText: "Active Caregiver Status: Proven",
    rawDetails: {
      holderAlias: "Caregiver #9042",
      conditionCode: "ICD-10-C80.1 (Oncological Care Pathway)",
      clinicalReferenceCode: "STJUDE-INTAKE-9042-X",
      validityWindow: "2024-2027",
      blindedHashMask: "0x8f4c...3e9a"
    }
  },
  {
    id: "cred_med_board_02",
    title: "Medical Board Clinician Voucher",
    issuerName: "State Medical Board & Verified Clinician Alliance",
    issuerPubKey: "0xb2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2",
    secretKeyHex: "709a08320efa8334cde5f532be8cab48a571fbf388bc6f6903f748d43391c5e9",
    attributeHex: "4b78912e89fa3001bcde91238410293847192837491029384719283749182374",
    saltHex: "1029384756102938475610293847561029384756102938475610293847561029",
    commitmentHex: "0x3f10928374829103948571928374910293847192837491823749182374918237",
    issuedAt: "2024-11-01T14:15:00Z",
    category: "Burnout & Recovery",
    predicateText: "Active Licensed Medical Practitioner",
    rawDetails: {
      holderAlias: "Dr. Anonymous MD",
      conditionCode: "MD-LICENSE-ACTIVE-2026",
      clinicalReferenceCode: "BOARD-VOUCHER-7712-B",
      validityWindow: "2024-2026",
      blindedHashMask: "0x12a9...8f29"
    }
  },
  {
    id: "cred_neuro_care_03",
    title: "Specialist Referral Nullifier Voucher",
    issuerName: "National Chronic Care & Pain Registry",
    issuerPubKey: "0xc3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3",
    secretKeyHex: "9823471029384719283749182374918237491823749182374918237491823749",
    attributeHex: "3847192837491823749182374918237491823749182374918237491823749182",
    saltHex: "8374918237491823749182374918237491823749182374918237491823749182",
    commitmentHex: "0x9812739481729384719283749182374918237491823749182374918237491823",
    issuedAt: "2024-12-05T09:00:00Z",
    category: "Chronic Health",
    predicateText: "Specialist Diagnosis Attested",
    rawDetails: {
      holderAlias: "Chronic Care Peer #419",
      conditionCode: "DX-CHRONIC-RESILIENCE-01",
      clinicalReferenceCode: "REGISTRY-REF-3390-N",
      validityWindow: "Perpetual",
      blindedHashMask: "0x4e7a...91bc"
    }
  }
];

export const DEFAULT_PEER_MESSAGES: PeerMessage[] = [
  {
    id: "msg_1",
    circleId: "0000000000000000000000000000000000000000000000000000000000000001",
    senderAlias: "Veil #281",
    senderAvatarEmoji: "🌸",
    badgeText: "Verified Peer • 3mo",
    content: "Just got back from round 4 with my mom. Exhausted, but grateful for this quiet space today.",
    timestamp: "12m ago",
    isSelf: false,
    reactions: {
      heart: 8,
      warmth: 5,
      presence: 2
    }
  },
  {
    id: "msg_2",
    circleId: "0000000000000000000000000000000000000000000000000000000000000001",
    senderAlias: "Veil #704",
    senderAvatarEmoji: "🌊",
    badgeText: "Verified Caregiver",
    content: "Sending so much strength your way. Remember to drink water and take 5 deep breaths.",
    timestamp: "5m ago",
    isSelf: false,
    reactions: {
      heart: 6,
      warmth: 4,
      presence: 1
    }
  },
  {
    id: "msg_3",
    circleId: "0000000000000000000000000000000000000000000000000000000000000001",
    senderAlias: "You (Veil #419)",
    senderAvatarEmoji: "🌿",
    badgeText: "ZK Verified",
    content: "Thank you all for being here. It means the world to have a sanctuary where no one has to explain or hide.",
    timestamp: "Just now",
    isSelf: true,
    reactions: {
      heart: 3,
      warmth: 2,
      presence: 1
    }
  }
];
