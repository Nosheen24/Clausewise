'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getContracts, getApprovals } from '@/lib/data';
import { Badge, Button, Card } from '@/components/ui';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ApprovalsPage() {
  const contracts = getContracts();
  const approvals = getApprovals();
  const [pendingOnly, setPendingOnly] = useState(true);

  const contractsWithApprovals = contracts.map(c => {
    const approval = approvals.find(a => a.contractId === c.id);
    return { ...c, approval };
  }).filter(item => {
    if (!pendingOnly) return true;
    return item.approval && item.approval.status !== 'approved' && item.approval.status !== 'rejected';
  });

  const handleApprove = (id: string) => {
    alert(`Approved contract ${id}`);
  };

  const handleReject = (id: string) => {
    alert(`Rejected contract ${id}`);
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

          <div className="grid grid-cols-1 gap-4">
            {contractsWithApprovals.map(contract => (
              <Card key={contract.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-primary">{contract.title}</h3>
                      <Badge variant={statusColor(contract.status)}>
                        {contract.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Version {contract.currentVersion.versionNumber} · {contract.currentVersion.fileName}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{contract.extractedFields.length} extracted fields</span>
                      <span>{contract.obligations.length} obligations</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="primary" onClick={() => handleApprove(contract.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button variant="danger" onClick={() => handleReject(contract.id)}>
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}