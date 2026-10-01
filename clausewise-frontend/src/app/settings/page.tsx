'use client';

import { useEffect, useState } from 'react';
import { SettingsAPI, ApiError } from '@/lib/api';
import { Card, Button, Input, Select } from '@/components/ui';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [orgName, setOrgName] = useState('Acme Corporation');
  const [highThreshold, setHighThreshold] = useState('90');
  const [mediumThreshold, setMediumThreshold] = useState('70');
  const [lowThreshold, setLowThreshold] = useState('50');
  const [renewalDays, setRenewalDays] = useState('90');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Try to get organization settings
      const response = await SettingsAPI.getOrganizationSettings();
      if (response.results && response.results.length > 0) {
        const settings = response.results[0];
        setOrgName(settings.organization_id || 'Acme Corporation');
        setHighThreshold((settings.confidence_threshold * 100).toString());
        // Note: The backend doesn't have medium/low threshold fields or renewalDays in settings
        // These might need to be added to the backend settings model, or we store them separately
      }
    } catch (err) {
      // Settings might not exist yet, that's OK - we'll use defaults
      console.log('No existing settings found, using defaults');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Try to update existing settings
      const response = await SettingsAPI.getOrganizationSettings();
      if (response.results && response.results.length > 0) {
        const settingsId = response.results[0].id;
        await SettingsAPI.updateOrganizationSettings(settingsId, {
          organization_id: orgName,
          confidence_threshold: parseFloat(highThreshold) / 100,
        });
      } else {
        // Create new settings
        await SettingsAPI.createOrganizationSettings({
          organization_id: orgName,
          confidence_threshold: parseFloat(highThreshold) / 100,
        });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to save settings. Please try again.');
      } else {
        setError('Failed to save settings. Please try again.');
      }
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

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
                      min={0}
                      max={100}
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
                      min={0}
                      max={100}
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
                    min={0}
                    max={100}
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
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}