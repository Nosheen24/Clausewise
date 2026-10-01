'use client';

import { useEffect, useState } from 'react';
import { ContractsAPI, ApprovalsAPI, ApiError } from '@/lib/api';
import { Badge, Button, Card } from '@/components/ui';
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOnly, setPendingOnly] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const contractsResponse = await ContractsAPI.getContracts();
      setContracts(contractsResponse.results || []);
      const approvalsResponse = await ApprovalsAPI.getApprovalQueue();
      // getApprovalQueue returns Approval[] directly, not paginated
      setApprovals(approvalsResponse || []);
    } catch (err: any) {
      if (err.status === 401) {
        setError('You need to be logged in to view the approval queue.');
      } else {
        setError(err.message || 'Failed to load data.');
      }
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      await ApprovalsAPI.approveContract(approvalId);
      loadData();
    } catch (err: any) {
      console.error('Failed to approve contract:', err);
      if (err.message) {
        setError(err.message || 'Failed to approve contract. Please try again.');
      } else {
        setError('Failed to approve contract. Please try again.');
      }
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      await ApprovalsAPI.rejectContract(approvalId);
      loadData();
    } catch (err: any) {
      console.error('Failed to reject contract:', err);
      if (err.message) {
        setError(err.message || 'Failed to reject contract. Please try again.');
      } else {
        setError('Failed to reject contract. Please try again.');
      }
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'muted';
      case 'under_review': return 'warning';
      case 'legal_review': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  };

  const statusMap: Record<string, string> = {
    draft: 'Draft',
    under_review: 'Under Review',
    legal_review: 'Legal Review',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  const getContractApprovals = () => {
    const contractsWithApprovals = contracts.map(c => {
      const approval = approvals.find(a => a.contractId === c.id);
      return { ...c, approval };
    });
    return contractsWithApprovals.filter(item => {
      if (!pendingOnly) return true;
      return item.approval && item.approval.status !== 'approved' && item.approval.status !== 'rejected';
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading approval queue...</span>
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/approvals" />
      <div className="flex-1 flex flex-col">
        <Header title="Approval Queue" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary">Approval Queue</h2>
            <p className="text-gray-600 text-sm mt-1">
              Review and approve contracts before they become finalized
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <Button variant={pendingOnly ? 'primary' : 'secondary'} size="sm" onClick={() => setPendingOnly(true)}>
              Pending
            </Button>
            <Button variant={!pendingOnly ? 'primary' : 'secondary'} size="sm" onClick={() => setPendingOnly(false)}>
              All
            </Button>
          </div>

          {getContractApprovals().length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No approvals in the queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {getContractApprovals().map(contract => (
                <Card key={contract.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-primary">{contract.title}</h3>
                        <Badge variant={statusColor(contract.status)}>
                          {statusMap[contract.status] || contract.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Version {contract.currentVersion?.versionNumber || 'N/A'} · {contract.currentVersion?.fileName || 'N/A'}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{contract.extractedFields?.length || 0} extracted fields</span>
                        <span>{contract.obligations?.length || 0} obligations</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="primary" onClick={() => handleApprove(contract.approval?.id || contract.id)}>
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                      <Button variant="danger" onClick={() => handleReject(contract.approval?.id || contract.id)}>
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}