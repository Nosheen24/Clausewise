'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activePath="/dashboard" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Dashboard" />
        <main className="flex-1 p-6 lg:p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}