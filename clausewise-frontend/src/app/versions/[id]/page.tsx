'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Badge, Button, Card } from '@/components/ui';
import { GitCompare, FileText, Download, Calendar, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ContractsAPI, ApiError } from '@/lib/api';

export default function VersionHistoryPage({ params }: { params: { id: string } }) {
  const [contract, setContract] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContract(params.id);
  }, [params.id]);

  const loadContract = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const contractData = await ContractsAPI.getContract(id);
      if (!contractData) {
        setError('Contract not found');
        return;
      }
      const versionsData = await ContractsAPI.getContractVersions(id);
      setContract(contractData);
      setVersions(versionsData || []);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('You need to be logged in to view version history.');
        } else {
          setError(err.message || 'Failed to load contract versions.');
        }
      } else {
        setError('Failed to load contract versions. Please try again.');
      }
      console.error('Failed to load contract:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading version history...</span>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar activePath="/versions" />
        <div className="flex-1 flex flex-col">
          <Header title="Contract Not Found" />
          <main className="flex-1 p-6">
            <p className="text-gray-600">Contract not found.</p>
          </main>
        </div>
      </div>
    );
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'danger';
      case 'processing': return 'info';
      default: return 'muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath={`/versions/${contract.id}`} />
      <div className="flex-1 flex flex-col">
        <Header title="Version History" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary">{contract.title}</h2>
            <p className="text-gray-600 text-sm mt-1">
              Version history and comparison
            </p>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Version History
            </h3>
            {versions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No versions found for this contract.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Uploaded By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {versions.map((version) => (
                      <tr key={version.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">
                            v{version.versionNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {version.fileName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={statusColor(version.processingStatus)}>
                            {version.processingStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {version.createdAt ? new Date(version.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {version.uploadedBy?.name || version.uploadedBy?.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="secondary" size="sm">
                            <GitCompare className="w-4 h-4 mr-2" /> Compare
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}