'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { ContractStatus } from '@/types';
import { Badge, Skeleton } from '@/components/ui';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { getContracts } from '@/lib/data';

interface RecentContractsProps {}

export function RecentContracts({}: RecentContractsProps) {
  const contracts = getContracts();
  const user = useAuth().user;

  const visibleContracts = contracts
    .filter(c => c.status !== 'expired')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {visibleContracts.map((contract) => (
        <Link
          key={contract.id}
          href={`/contracts/${contract.id}`}
          className="flex items-center gap-3 hover:text-primary transition-colors p-3 rounded-lg border border-gray-100"
        >
          <span
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(20,48,79,0.1)' }}
          >
            <FileText className="w-4 h-4 text-primary" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">
              {contract.title}
            </p>
            <p className="text-xs text-gray-500">
              {contract.status === 'approved'
                ? <Badge variant="success">Approved</Badge>
                : contract.status === 'under_review'
                ? <Badge variant="warning">In Review</Badge>
                : contract.status === 'legal_review'
                ? <Badge variant="info">Legal Review</Badge>
                : contract.status === 'draft'
                ? <Badge variant="muted">Draft</Badge>
                : contract.status}
            </p>
          </div>
        </Link>
      ))}

      {visibleContracts.length === 0 && (
        <Skeleton className="h-12 rounded border-gray-200" />
      )}
    </div>
  );
}