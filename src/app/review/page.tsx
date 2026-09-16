'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getContracts } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const confidenceVariant = (score: number) => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'danger';
};

export default function ReviewQueuePage() {
  const contracts = getContracts();
  const [filter, setFilter] = useState<'low' | 'medium' | 'all'>('low');
  const [search, setSearch] = useState('');

  const reviewContracts = contracts.filter(c => {
    const hasLowConf = c.extractedFields.some(f => f.confidenceLevel === 'low');
    const hasMediumConf = c.extractedFields.some(f => f.confidenceLevel === 'medium');
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
                {reviewContracts.map((contract) => (
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
        </main>
      </div>
    </div>
  );
}