'use client';

import { useEffect, useState } from 'react';
import { PlaybookAPI, ApiError } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Badge, Card, Button } from '@/components/ui';
import { Book, Plus, AlertCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlaybooks();
  }, []);

  const loadPlaybooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await PlaybookAPI.getPlaybooks();
      setPlaybooks(response.results || []);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError('You need to be logged in to view playbooks.');
        } else {
          setError(err.message || 'Failed to load playbooks.');
        }
      } else {
        setError('Failed to load playbooks. Please try again.');
      }
      console.error('Failed to load playbooks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading playbooks...</span>
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
      <Sidebar activePath="/playbooks" />
      <div className="flex-1 flex flex-col">
        <Header title="Playbooks" />
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-primary">Contract Playbooks</h2>
              <p className="text-gray-600 text-sm mt-1">
                Define your organization's standard positions for contract clauses
              </p>
            </div>
            <Button variant="accent">
              <Plus className="w-4 h-4 mr-2" /> Create Playbook
            </Button>
          </div>

          {playbooks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No playbooks found. Create your first playbook to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {playbooks.map((playbook) => (
                <Card key={playbook.id}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-primary">{playbook.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{playbook.description}</p>
                    </div>
                    <Book className="w-8 h-8 text-primary/30" />
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Rules</h4>
                    {(playbook.rules || []).map((rule: any) => (
                      <div key={rule.id} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                        {rule.severity === 'high' ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : rule.severity === 'medium' ? (
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{rule.clauseType}</div>
                          <div className="text-xs text-gray-500">{rule.preferredPosition}</div>
                        </div>
                        <Badge variant={rule.severity === 'high' ? 'danger' : rule.severity === 'medium' ? 'warning' : 'success'}>
                          {rule.severity}
                        </Badge>
                      </div>
                    ))}
                    {(!playbook.rules || playbook.rules.length === 0) && (
                      <div className="text-sm text-gray-500">No rules defined</div>
                    )}
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