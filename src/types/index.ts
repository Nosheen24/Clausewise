export type UserRole = 'admin' | 'legal' | 'contract_manager' | 'business' | 'reviewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type ContractStatus =
  | 'draft'
  | 'under_review'
  | 'legal_review'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'renewed';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ExtractedField {
  id: string;
  fieldType: string;
  value: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  sourcePage?: number;
  sourceText?: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
}

export interface Clause {
  id: string;
  clauseType: string;
  text: string;
  pageNumber: number;
  similarityScore?: number;
  playbookMatch?: boolean;
}

export interface Obligation {
  id: string;
  type: 'expiry' | 'renewal' | 'payment' | 'termination' | 'notice';
  dueDate: string;
  description: string;
  status: 'upcoming' | 'passed' | 'completed';
}

export interface ContractVersion {
  id: string;
  contractId: string;
  versionNumber: number;
  s3Key?: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'other';
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedBy: string;
  createdAt: string;
}

export interface Contract {
  id: string;
  title: string;
  status: ContractStatus;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  versions: ContractVersion[];
  extractedFields: ExtractedField[];
  clauses: Clause[];
  obligations: Obligation[];
  currentVersion: ContractVersion;
}

export interface PlaybookRule {
  id: string;
  clauseType: string;
  preferredPosition: string;
  severity: 'low' | 'medium' | 'high';
  embedding?: string;
}

export interface Playbook {
  id: string;
  name: string;
  organizationId: string;
  description?: string;
  rules: PlaybookRule[];
}

export interface Approval {
  id: string;
  contractId: string;
  reviewerId?: string;
  status: ContractStatus;
  comment?: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  contractVersionId: string;
  fieldId?: string;
  reason: string;
  confidenceScore: number;
  status: 'pending' | 'in_progress' | 'completed';
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface DashboardStats {
  activeContracts: number;
  needsReview: number;
  renewalsNext30Days: number;
}

export type NavigationItem = {
  name: string;
  href: string;
  icon: string;
} | {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string }[];
};