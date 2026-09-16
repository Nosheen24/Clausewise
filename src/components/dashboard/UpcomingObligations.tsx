'use client';

import { getDashboardStats, generateContracts } from '@/lib/data';
import { Badge } from '@/components/ui';
import { Calendar, Clock, FileCheck, Bell, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';

function getStats(): any {
  return getDashboardStats();
}

const obligationConfig: Record<string, { label: string; icon: typeof Clock; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
  payment: { label: 'Payment', icon: CreditCard, variant: 'success' },
  renewal: { label: 'Renewal', icon: Clock, variant: 'warning' },
  compliance: { label: 'Compliance Filing', icon: FileCheck, variant: 'info' },
  notice: { label: 'Notice Period', icon: Bell, variant: 'danger' },
  termination: { label: 'Termination', icon: Calendar, variant: 'danger' },
};

export function UpcomingObligations() {
  const stats = getStats();
  const contracts = generateContracts();

  const upcoming = contracts
    .flatMap(c => c.obligations)
    .filter(o => o.status === 'upcoming')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const now = new Date();

  return (
    <div className="space-y-3">
      {upcoming.map((obligation, index) => {
        const dueDate = new Date(obligation.dueDate);
        const daysRemaining = Math.ceil(differenceInDays(dueDate, now));
        const config = obligationConfig[obligation.type] || obligationConfig.compliance;
        const Icon = config.icon;

        return (
          <Link
            key={obligation.id}
            href={`/contracts/${obligation.id}`}
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
            <Badge variant={config.variant}>
              {config.label}
            </Badge>
          </Link>
        );
      })}

      {upcoming.length === 0 && (
        <div className="p-3 text-center text-gray-500 text-sm">
          No upcoming obligations
        </div>
      )}
    </div>
  );
}