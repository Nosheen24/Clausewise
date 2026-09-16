'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getContract } from '@/lib/data';
import { Badge, Button, Card } from '@/components/ui';
import { GitCompare, FileText, Download, Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VersionHistoryPage({ params }: { params: { id: string } }) {
  const contract = getContract(params.id);

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
                  {contract.versions.map((version) => (
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
                        {new Date(version.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {version.uploadedBy}
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
          </Card>
        </main>
      </div>
    </div>
  );
}