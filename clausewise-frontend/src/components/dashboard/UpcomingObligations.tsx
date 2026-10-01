'use client';

import { useEffect, useState } from 'react';
import { ContractsAPI, ApiError } from '@/lib/api';
import { Badge, Button } from '@/components/ui';
import { Calendar, Clock, FileCheck, Bell, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

const obligationConfig: Record<string, { label: string; icon: typeof Clock; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
  payment: { label: 'Payment', icon: CreditCard, variant: 'success' },
  renewal: { label: 'Renewal', icon: Clock, variant: 'warning' },
  compliance: { label: 'Compliance Filing', icon: FileCheck, variant: 'info' },
  notice: { label: 'Notice Period', icon: Bell, variant: 'danger' },
  termination: { label: 'Termination', icon: Calendar, variant: 'danger' },
};

export function UpcomingObligations() {
  const [obligations, setObligations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadObligations();
  }, []);

  const loadObligations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ContractsAPI.getContracts();
      const contracts = response.results || [];
      const allObligations: any[] = [];
      for (const contract of contracts) {
        try {
          const contractObligations = await ContractsAPI.getContractObligations(contract.id);
          // Backend returns array directly (not paginated)
          if (Array.isArray(contractObligations)) {
            allObligations.push(...contractObligations);
          }
        } catch {
          // Skip if we can't get obligations for this contract
        }
      }
      setObligations(allObligations);
    } catch (err: any) {
      if (err.status === 401) {
        setError('You need to be logged in to view obligations.');
      } else {
        setError(err.message || 'Failed to load obligations.');
      }
      console.error('Failed to load obligations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading obligations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-700 font-medium mb-2">Unable to load obligations</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <Button variant="secondary" onClick={loadObligations}>
          Try Again
        </Button>
      </div>
    );
  }

  const now = new Date();

  const upcoming = obligations
    .filter((o: any) => o.status === 'upcoming')
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-3">
      {upcoming.length === 0 && (
        <div className="p-3 text-center text-gray-500 text-sm">
          No upcoming obligations
        </div>
      )}
      {upcoming.map((obligation: any, index: number) => {
        const dueDate = new Date(obligation.dueDate);
        const daysRemaining = Math.ceil(differenceInDays(dueDate, now));
        const config = obligationConfig[obligation.type as keyof typeof obligationConfig] || obligationConfig.compliance;
        const Icon = config.icon;

        return (
          <Link
            key={obligation.id}
            href={`/contracts/${obligation.contract_id || obligation.contractId}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50`}
            >
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">
                {obligation.description}
              </p>
              <p className="text-xs text-gray-500">
                {daysRemaining} days remaining
              </p>
            </div>
            <Badge variant={config.variant as any}>
              {config.label}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}