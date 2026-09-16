'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, Button, Input, Select } from '@/components/ui';
import { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [highThreshold, setHighThreshold] = useState('90');
  const [mediumThreshold, setMediumThreshold] = useState('70');
  const [lowThreshold, setLowThreshold] = useState('50');
  const [renewalDays, setRenewalDays] = useState('90');

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/settings" />
      <div className="flex-1 flex flex-col">
        <Header title="Settings" />
        <main className="flex-1 p-6">
          <div className="max-w-2xl space-y-6">
            <Card title="Organization Settings">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
              </div>
            </Card>

            <Card title="Confidence Thresholds">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      High Confidence (%)
                    </label>
                    <Input
                      type="number"
                      value={highThreshold}
                      onChange={(e) => setHighThreshold(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medium Confidence (%)
                    </label>
                    <Input
                      type="number"
                      value={mediumThreshold}
                      onChange={(e) => setMediumThreshold(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Confidence (%)
                  </label>
                  <Input
                    type="number"
                    value={lowThreshold}
                    onChange={(e) => setLowThreshold(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card title="Alert Settings">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renewal Alert Days
                  </label>
                  <Select value={renewalDays} onChange={(e) => setRenewalDays(e.target.value)}>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </Select>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}