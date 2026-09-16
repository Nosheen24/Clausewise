import {
  Contract,
  ContractStatus,
  ConfidenceLevel,
  ExtractedField,
  Clause,
  Obligation,
  ContractVersion,
  User,
  Playbook,
  PlaybookRule,
  Approval,
  ReviewItem,
} from '@/types';

const users: User[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@clausewise.com', role: 'legal' },
  { id: 'u2', name: 'James Wilson', email: 'james@clausewise.com', role: 'contract_manager' },
  { id: 'u3', name: 'Emily Davis', email: 'emily@clausewise.com', role: 'business' },
  { id: 'u4', name: 'Michael Brown', email: 'michael@clausewise.com', role: 'reviewer' },
  { id: 'u5', name: 'Admin User', email: 'admin@clausewise.com', role: 'admin' },
];

const contractTitles = [
  'Acme Services Agreement',
  'Beta Services Contract',
  'Gamma NDA',
  'Delta Partnership Agreement',
  'Epsilon License Agreement',
  'Zeta Employment Agreement',
  'Eta Consulting Agreement',
  'Theta Vendor Agreement',
  'Iota Distribution Agreement',
  'Kappa Service Level Agreement',
  'Lambda Non-Compete Agreement',
  'Mu Lease Agreement',
  'Nu SaaS Agreement',
  'Xi Partnership Amendment',
  'Omicron Settlement Agreement',
];

const statuses: ContractStatus[] = [
  'draft',
  'under_review',
  'legal_review',
  'approved',
  'expired',
];

const parties = [
  { party1: 'Acme Corporation', party2: 'Example Technologies' },
  { party1: 'Beta Services Inc.', party2: 'Global Solutions Ltd.' },
  { party1: 'Gamma Industries', party2: 'Delta Partners' },
  { party1: 'Epsilon LLC', party2: 'Zeta Holdings' },
  { party1: 'Theta Group', party2: 'Iota Systems' },
];

const fieldValues = [
  { type: 'parties', value: 'Acme Corporation | Example Technologies', page: 1, text: 'This Agreement is made between Acme Corporation ("Company") and Example Technologies ("Client").' },
  { type: 'effective_date', value: '12 Jan 2026', page: 1, text: 'Effective Date: 12 January 2026' },
  { type: 'expiry_date', value: '12 Jan 2027', page: 1, text: 'This Agreement shall expire on 12 January 2027.' },
  { type: 'renewal_window', value: '60 Days', page: 3, text: 'Either party may renew this Agreement by providing 60 days written notice.' },
  { type: 'payment_terms', value: 'Net 30', page: 2, text: 'Payment shall be due within 30 days of invoice date (Net 30).' },
  { type: 'liability_cap', value: '$500,000', page: 4, text: 'Total liability shall not exceed $500,000.' },
  { type: 'termination', value: '30 days written notice', page: 5, text: 'Either party may terminate with 30 days written notice.' },
];

function generateConfidence(): { score: number; level: ConfidenceLevel } {
  const rand = Math.random();
  if (rand > 0.85) return { score: Math.round(60 + Math.random() * 25), level: 'low' };
  if (rand > 0.5) return { score: Math.round(75 + Math.random() * 14), level: 'medium' };
  return { score: Math.round(90 + Math.random() * 9), level: 'high' };
}

function generateFields(contractId: string): ExtractedField[] {
  return fieldValues.map((f, i) => {
    const { score, level } = generateConfidence();
    return {
      id: `ef-${contractId}-${i}`,
      fieldType: f.type,
      value: f.value,
      confidenceScore: score,
      confidenceLevel: level,
      sourcePage: f.page,
      sourceText: f.text,
      reviewStatus: score >= 90 ? 'approved' : 'pending',
    };
  });
}

function generateClauses(contractId: string): Clause[] {
  return [
    { id: `c-${contractId}-1`, clauseType: 'payment', text: 'Payment terms: Net 30', pageNumber: 2, similarityScore: 0.95, playbookMatch: true },
    { id: `c-${contractId}-2`, clauseType: 'liability', text: 'Liability cap: $500,000', pageNumber: 4, similarityScore: 0.72, playbookMatch: false },
    { id: `c-${contractId}-3`, clauseType: 'termination', text: 'Termination: 30 days notice', pageNumber: 5, similarityScore: 0.88, playbookMatch: true },
    { id: `c-${contractId}-4`, clauseType: 'renewal', text: 'Renewal: Automatic with 60 days notice', pageNumber: 3, similarityScore: 0.91, playbookMatch: true },
  ];
}

function generateObligations(contractId: string): Obligation[] {
  const now = new Date();
  return [
    { id: `ob-${contractId}-1`, type: 'renewal', dueDate: new Date(now.getTime() + 30*86400000).toISOString(), description: 'Renewal notice deadline', status: 'upcoming' },
    { id: `ob-${contractId}-2`, type: 'payment', dueDate: new Date(now.getTime() + 15*86400000).toISOString(), description: 'Quarterly payment due', status: 'upcoming' },
    { id: `ob-${contractId}-3`, type: 'expiry', dueDate: new Date(now.getTime() + 365*86400000).toISOString(), description: 'Contract expiry', status: 'upcoming' },
  ];
}

function generateVersions(contractId: string, title: string): ContractVersion[] {
  const versions: ContractVersion[] = [];
  const count = Math.floor(Math.random() * 3) + 1;
  for (let i = 1; i <= count; i++) {
    versions.push({
      id: `cv-${contractId}-${i}`,
      contractId,
      versionNumber: i,
      fileName: `${title.replace(/\s+/g, '_')}_v${i}.pdf`,
      fileType: 'pdf',
      processingStatus: i < count ? 'completed' : 'completed',
      uploadedBy: 'Sarah Chen',
      createdAt: new Date(2025, 0, i * 15).toISOString(),
    });
  }
  return versions;
}

export function generateContracts(): Contract[] {
  return contractTitles.map((title, i) => {
    const id = `contract-${i + 1}`;
    const status = statuses[i % statuses.length];
    const parties_pair = parties[i % parties.length];
    const versions = generateVersions(id, title);
    const fields = generateFields(id);
    const clauses = generateClauses(id);
    const obligations = generateObligations(id);

    return {
      id,
      title,
      status,
      organizationId: 'org-1',
      createdAt: new Date(2025, 0, 1 + i * 5).toISOString(),
      updatedAt: new Date(2025, 3, 1 + i * 2).toISOString(),
      versions,
      extractedFields: fields,
      clauses,
      obligations,
      currentVersion: versions[versions.length - 1],
    };
  });
}

export const playbooks: Playbook[] = [
  {
    id: 'pb-1',
    name: 'Standard Commercial Terms',
    organizationId: 'org-1',
    description: 'Standard positions for commercial agreements',
    rules: [
      { id: 'pr-1', clauseType: 'payment', preferredPosition: 'Net 30', severity: 'high' },
      { id: 'pr-2', clauseType: 'liability', preferredPosition: 'Liability cap at $500,000', severity: 'high' },
      { id: 'pr-3', clauseType: 'termination', preferredPosition: '30 days written notice', severity: 'medium' },
      { id: 'pr-4', clauseType: 'renewal', preferredPosition: '60 days notice for renewal', severity: 'medium' },
    ],
  },
  {
    id: 'pb-2',
    name: 'NDA Standard',
    organizationId: 'org-1',
    description: 'Standard NDA terms',
    rules: [
      { id: 'pr-5', clauseType: 'confidentiality', preferredPosition: '3-year confidentiality', severity: 'high' },
      { id: 'pr-6', clauseType: 'exclusions', preferredPosition: 'Standard exclusions apply', severity: 'medium' },
    ],
  },
];

export const reviewItems: ReviewItem[] = [
  { id: 'ri-1', contractVersionId: 'cv-contract-1-1', fieldId: 'ef-contract-1-4', reason: 'Low confidence on renewal date', confidenceScore: 61, status: 'pending' },
  { id: 'ri-2', contractVersionId: 'cv-contract-2-1', fieldId: 'ef-contract-2-5', reason: 'Unclear liability cap language', confidenceScore: 68, status: 'pending' },
  { id: 'ri-3', contractVersionId: 'cv-contract-3-1', fieldId: 'ef-contract-3-2', reason: 'Payment terms differ from playbook', confidenceScore: 74, status: 'in_progress' },
];

export const approvals: Approval[] = [
  { id: 'a-1', contractId: 'contract-1', status: 'under_review', createdAt: new Date(2025, 2, 1).toISOString() },
  { id: 'a-2', contractId: 'contract-2', status: 'legal_review', createdAt: new Date(2025, 2, 5).toISOString() },
  { id: 'a-3', contractId: 'contract-3', status: 'approved', createdAt: new Date(2025, 2, 10).toISOString() },
];

export function getUsers(): User[] {
  return users;
}

export function getContracts(): Contract[] {
  return generateContracts();
}

export function getContract(id: string): Contract | undefined {
  return generateContracts().find((c) => c.id === id);
}

export function getDashboardStats(): { activeContracts: number; needsReview: number; renewalsNext30Days: number } {
  const contracts = generateContracts();
  return {
    activeContracts: contracts.filter((c) => c.status === 'approved' || c.status === 'under_review').length,
    needsReview: contracts.filter((c) => c.extractedFields.some((f) => f.confidenceLevel === 'low')).length,
    renewalsNext30Days: contracts.filter((c) =>
      c.obligations.some((o) => o.type === 'renewal' && o.status === 'upcoming')
    ).length,
  };
}

export function getApprovals(): Approval[] {
  return approvals;
}