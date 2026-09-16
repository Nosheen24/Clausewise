'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { playbooks } from '@/lib/data';
import { Badge, Card, Button } from '@/components/ui';
import { Book, Plus, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PlaybooksPage() {
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
                  {playbook.rules.map((rule) => (
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
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}