'use client';

import { useEffect, useState } from 'react';
import { ContractsAPI, ApiError } from '@/lib/api';
import { Badge, Button } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const confidenceVariant = (score: number) => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'danger';
};

export default function ReviewQueuePage() {
  const [reviewContracts, setReviewContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'low' | 'medium' | 'all'>('low');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ContractsAPI.getContracts();
      setReviewContracts(response.results || []);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('You need to be logged in to view the review queue.');
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

  const reviewContractsFiltered = reviewContracts.filter((c: any) => {
    const hasLowConf = c.extractedFields.some((f: any) => f.confidenceLevel === 'low');
    const hasMediumConf = c.extractedFields.some((f: any) => f.confidenceLevel === 'medium');
    const matchesFilter =
      filter === 'low' ? hasLowConf : filter === 'medium' ? hasMediumConf : true;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/review" />
      <div className="flex-1 flex flex-col">
        <Header title="Review Queue" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary">Human Review Queue</h2>
            <p className="text-gray-600 text-sm mt-1">
              Review contracts with uncertain or low-confidence extracted data
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Loading review queue...</span>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <div className="flex gap-4 mb-6">
                <div className="flex gap-2">
                  <Button
                    variant={filter === 'low' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('low')}
                  >
                    Low Confidence
                  </Button>
                  <Button
                    variant={filter === 'medium' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('medium')}
                  >
                    Medium Confidence
                  </Button>
                  <Button
                    variant={filter === 'all' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Search contracts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {reviewContractsFiltered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No contracts need review at this time.
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Contract
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Confidence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reviewContractsFiltered.map((contract) => (
                        <tr key={contract.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {contract.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {contract.extractedFields[0]?.fieldType || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={confidenceVariant(contract.extractedFields[0]?.confidenceScore || 0)}>
                              {contract.extractedFields[0]?.confidenceScore || 0}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="warning">Review Required</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/contracts/${contract.id}`} className="text-primary hover:underline text-sm">
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}