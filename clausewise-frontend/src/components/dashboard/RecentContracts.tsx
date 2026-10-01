'use client';

import { useEffect, useState } from 'react';
import { ContractsAPI, ApiError } from '@/lib/api';
import { Badge, Button } from '@/components/ui';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface RecentContractsProps {}

export function RecentContracts({}: RecentContractsProps) {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ContractsAPI.getContracts();
      setContracts(response.results || []);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('You need to be logged in to view contracts.');
        } else {
          setError(err.message || 'Failed to load contracts.');
        }
      } else {
        setError('Failed to load contracts. Please try again.');
      }
      console.error('Failed to load contracts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading contracts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">Unable to load contracts</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <Button variant="secondary" onClick={loadContracts}>
          Try Again
        </Button>
      </div>
    );
  }

  const statusVariant: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger' | 'muted'> = {
    draft: 'muted',
    under_review: 'warning',
    legal_review: 'info',
    approved: 'success',
    rejected: 'danger',
    expired: 'danger',
    renewed: 'success',
  };

  const statusMap: Record<string, string> = {
    draft: 'Draft',
    under_review: 'Under Review',
    legal_review: 'Legal Review',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
    renewed: 'Renewed',
  };

  const visibleContracts = contracts
    .filter(c => c.status !== 'expired')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {visibleContracts.length === 0 && (
        <div className="p-3 text-center text-gray-500 text-sm">
          No contracts found
        </div>
      )}
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
              {contract.status !== null ? statusMap[contract.status] || contract.status : 'N/A'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}