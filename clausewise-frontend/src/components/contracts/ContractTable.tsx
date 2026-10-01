'use client';

import { useEffect, useState } from 'react';
import { ContractsAPI, ApiError } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const statusMap: Record<string, string> = {
  draft: 'Draft',
  under_review: 'Under Review',
  legal_review: 'Legal Review',
  approved: 'Approved',
  rejected: 'Rejected',
  expired: 'Expired',
  renewed: 'Renewed',
};

const statusVariant: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger' | 'muted'> = {
  draft: 'muted',
  under_review: 'warning',
  legal_review: 'info',
  approved: 'success',
  rejected: 'danger',
  expired: 'danger',
  renewed: 'success',
};

export function ContractTable() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
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

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || contract.status === status;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="under_review">Under Review</option>
          <option value="legal_review">Legal Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </Select>
      </div>

      {filteredContracts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No contracts found. Upload your first contract to get started.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                        <div className="text-sm text-gray-500">
                          {contract.currentVersion ? `Version ${contract.currentVersion.versionNumber}` : 'No versions'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={statusVariant[contract.status]}>
                      {statusMap[contract.status] || contract.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.createdAt ? new Date(contract.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contract.updatedAt ? new Date(contract.updatedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/contracts/${contract.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}