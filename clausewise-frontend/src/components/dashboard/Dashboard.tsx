'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentContracts } from '@/components/dashboard/RecentContracts';
import { UpcomingObligations } from '@/components/dashboard/UpcomingObligations';
import { Button } from '@/components/ui/Button';
import { Upload, FileText } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  activeContracts: number;
  needsReview: number;
  renewalsNext30Days: number;
}

function getStats(): DashboardStats {
  return { activeContracts: 42, needsReview: 8, renewalsNext30Days: 7 };
}

export function Dashboard() {
  const { user, logout } = useAuth();
  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Welcome back, {user?.name}</h2>
          <p className="text-gray-600">Here's your contract overview</p>
        </div>
        <div className="flex gap-3">
          <Button variant="accent" size="lg" asChild>
            <Link href="/upload">
              <Upload className="w-4 h-4 mr-2" /> Upload Contract
            </Link>
          </Button>
          <Button variant="primary" size="lg" asChild>
            <Link href="/review">
              <FileText className="w-4 h-4 mr-2" /> Review Queue
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Contracts" value={stats.activeContracts} color="info" />
        <StatCard title="Needs Review" value={stats.needsReview} color="warning" />
        <StatCard title="Renewals Next 30 Days" value={stats.renewalsNext30Days} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Contracts">
          <RecentContracts />
        </Card>
        <Card title="Upcoming Obligations">
          <UpcomingObligations />
        </Card>
      </div>
    </div>
  );
}