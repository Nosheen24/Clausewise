'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Badge, Card, Button } from '@/components/ui';
import { Calendar as CalendarIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { differenceInDays } from 'date-fns';
import { ContractsAPI } from '@/lib/api';

interface ObligationColor {
  renewal: 'warning';
  payment: 'success';
  expiry: 'danger';
  termination: 'info';
  notice: 'muted';
}

export default function CalendarPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ContractsAPI.getContracts();
      setContracts(response.results || []);
    } catch (err: any) {
      if (err.status === 401) {
        setError('You need to be logged in to view the calendar.');
      } else {
        setError(err.message || 'Failed to load contracts.');
      }
      console.error('Failed to load contracts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const obligations = useMemo(() => {
    const now = new Date();
    return contracts
      .filter(c => c.obligations && c.obligations.length > 0)
      .flatMap(c =>
        c.obligations.map((o: any) => ({
          ...o,
          contractTitle: c.title,
          contractId: c.id,
          daysRemaining: Math.max(0, Math.ceil(differenceInDays(new Date(o.dueDate), now))),
        }))
      )
      .sort((a: any, b: any) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 10);
  }, [contracts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading calendar...</span>
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
                  {obligations.map((obligation: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                        style={{ background: obligation.daysRemaining < 0 ? 'rgba(220,38,38,0.1)' : 'rgba(20,48,79,0.1)' }}>
                        <CalendarIcon className="w-5 h-5" style={{ color: obligation.daysRemaining < 0 ? '#DC2626' : '#14304F' }} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{obligation.description}</div>
                        <div className="text-sm text-gray-500">{obligation.contractTitle}</div>
                      </div>
                      <Badge variant={typeColors[obligation.type as keyof typeof typeColors]}>
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