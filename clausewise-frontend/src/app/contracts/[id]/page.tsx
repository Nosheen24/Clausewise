'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import { FileText, Calendar, GitCompare, CheckCircle, AlertTriangle, Clock, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ContractsAPI, ApiError } from '@/lib/api';

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  const [contract, setContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContract(params.id);
  }, [params.id]);

  const loadContract = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load contract details
      const contractData = await ContractsAPI.getContract(id);
      if (!contractData) {
        setError('Contract not found');
        return;
      }

      // Load versions
      const versions = await ContractsAPI.getContractVersions(id);

      // Load clauses
      const clauses = await ContractsAPI.getContractClauses(id);

      // Load obligations
      const obligations = await ContractsAPI.getContractObligations(id);

      // Load extracted fields
      const extraction = await ContractsAPI.getContractExtraction(id);

      setContract({
        ...contractData,
        versions,
        clauses,
        obligations,
        extractedFields: extraction || [],
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('You need to be logged in to view contract details.');
        } else {
          setError(err.message || 'Failed to load contract details.');
        }
      } else {
        setError('Failed to load contract details. Please try again.');
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
        <span className="ml-3 text-gray-600">Loading contract...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">Unable to load contract</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <Button variant="secondary" onClick={() => loadContract(params.id)}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar activePath="/contracts" />
        <div className="flex-1 flex flex-col">
          <Header title="Contract Not Found" />
          <main className="flex-1 p-6">
            <p className="text-gray-600">The requested contract could not be found.</p>
          </main>
        </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath={`/contracts/${contract.id}`} />
      <div className="flex-1 flex flex-col">
        <Header title={contract.title} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Badge variant={statusVariant[contract.status]}>
                {statusMap[contract.status] || contract.status}
              </Badge>
              <h2 className="text-xl font-semibold text-primary mt-2">
                Contract Details
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Version {contract.currentVersion?.versionNumber || 'N/A'} · {contract.currentVersion?.fileName || 'N/A'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" asChild>
                <Link href={`/document/${contract.id}`}>
                  <FileText className="w-4 h-4 mr-2" /> Open Document
                </Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href={`/versions/${contract.id}`}>
                  <GitCompare className="w-4 h-4 mr-2" /> Compare Versions
                </Link>
              </Button>
              <Button variant="accent" asChild>
                <Link href={`/approvals`}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Approve
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title="Extracted Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contract.extractedFields?.map((field: any) => (
                    <div key={field.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {field.fieldType.replace(/_/g, ' ')}
                      </div>
                      <div className="font-medium text-gray-900 mt-1">{field.value}</div>
                      <div className="mt-2">
                        <ProgressBar value={field.confidenceScore} label="Confidence" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Clause Review">
                <div className="space-y-3">
                  {contract.clauses?.map((clause: any) => (
                    <div key={clause.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                      {clause.playbookMatch ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {clause.clauseType.charAt(0).toUpperCase() + clause.clauseType.slice(1)} Clause
                        </div>
                        <div className="text-sm text-gray-500">{clause.text}</div>
                      </div>
                      <Badge variant={clause.playbookMatch ? 'success' : 'warning'}>
                        {clause.playbookMatch ? 'Matches Playbook' : 'Deviates'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Obligations">
                <div className="space-y-3">
                  {contract.obligations?.map((obligation: any) => (
                    <div key={obligation.id} className="flex gap-3 items-start">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{obligation.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {obligation.dueDate ? new Date(obligation.dueDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Processing Status">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900">Completed</div>
                    <div className="text-sm text-gray-500">
                      Processed {contract.extractedFields?.length || 0} fields
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}