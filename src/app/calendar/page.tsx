'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getContracts } from '@/lib/data';
import { Badge, Card } from '@/components/ui';
import { Calendar } from 'lucide-react';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';

interface TipoColor {
  renewal: 'warning';
  payment: 'success';
  expiry: 'danger';
  termination: 'info';
  notice: 'muted';
}

export default function CalendarPage() {
  const contracts = getContracts();

  const obligations = useMemo(() => {
    const now = new Date();
    return contracts
      .filter(c => c.obligations.length > 0)
      .flatMap(c =>
        c.obligations.map(o => ({
          ...o,
          contractTitle: c.title,
          contractId: c.id,
          daysRemaining: Math.max(0, Math.ceil(differenceInDays(new Date(o.dueDate), now))),
        }))
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 10);
  }, []);

  const typeColors: Record<'renewal' | 'payment' | 'expiry' | 'termination' | 'notice', 'info' | 'success' | 'warning' | 'danger' | 'muted'> = {
    renewal: 'warning',
    payment: 'success',
    expiry: 'danger',
    termination: 'info',
    notice: 'muted',
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/calendar" />
      <div className="flex-1 flex flex-col">
        <Header title="Obligation Calendar" />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary">Obligation Calendar</h2>
            <p className="text-gray-600 text-sm mt-1">Track important contract dates and deadlines</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Upcoming Obligations">
                <div className="space-y-3">
                  {obligations.map((obligation, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                        style={{ background: obligation.daysRemaining < 0 ? 'rgba(220,38,38,0.1)' : 'rgba(20,48,79,0.1)' }}>
                        <Calendar className="w-5 h-5" style={{ color: obligation.daysRemaining < 0 ? '#DC2626' : '#14304F' }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{obligation.description}</div>
                        <div className="text-sm text-gray-500">{obligation.contractTitle}</div>
                      </div>
                      <Badge variant={typeColors[obligation.type] as any}>
                        {obligation.type}
                      </Badge>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {obligation.daysRemaining < 0
                          ? `${Math.abs(obligation.daysRemaining)} days overdue`
                          : `${obligation.daysRemaining} days remaining`}
                      </div>
                    </div>
                  ))}
                  {obligations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No upcoming obligations
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card title="Summary">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-medium text-green-600">
                      {obligations.filter(o => o.daysRemaining > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overdue</span>
                    <span className="font-medium text-red-600">
                      {obligations.filter(o => o.daysRemaining < 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-medium text-primary">{obligations.length}</span>
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