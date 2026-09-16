'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Badge, ProgressBar, Card, Skeleton } from '@/components/ui';
import { Calendar } from 'lucide-react';
import { Document, Page } from 'react-pdf';
import Link from 'next/link';

interface DocumentProps {
  contractId: string;
}

export default function DocumentViewer({ contractId }: DocumentProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timeout);
  }, [contractId]);

  // Sample extracted fields for this document
  const extractedFields = {
    parties: 'Acme Corporation | Example Technologies',
    effectiveDate: '12 Jan 2026',
    expiryDate: '12 Jan 2027',
    renewalWindow: '60 Days',
    paymentTerms: 'Net 30',
    liabilityCap: '$500,000',
    termination: '30 days written notice',
  };

  const confidenceScores = {
    parties: 94,
    effectiveDate: 96,
    expiryDate: 93,
    renewalWindow: 89,
    paymentTerms: 91,
    liabilityCap: 94,
    termination: 88,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar activePath={`/document/${contractId}`} />
        <div className="flex-1 flex flex-col">
          <Header title="Document" />
          <main className="flex-1 p-6">
            <Card>
              <Skeleton className="h-64 rounded border-gray-200 mb-4" />
              <Skeleton className="h-24 rounded border-gray-200 mb-4" />
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath={`/document/${contractId}`} />
      <div className="flex-1 flex flex-col">
        <Header title="Contract Document" />
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">
                    Extracted Information
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Source: Page 4</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-gray-500 text-sm">
                    Confidence: 94%
                  </div>
                  <ProgressBar value={confidenceScores.liabilityCap} />
                  <div className="mt-6">
                    <p className="text-sm text-gray-600">
                      Document: {extractedFields.liabilityCap}
                    </p>
                    {/* PDF.js Document Viewer */}
                    <div className="mt-4">
                      <Document
                        file={{
                          url: `/contracts/${contractId}/${contractId}_v1.pdf`,
                        }}
                      />
                      {/* Page component would go here but we're showing extracted info instead */}
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Extracted Information">
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Parties
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.parties}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Effective Date
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.effectiveDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Expiry Date
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.expiryDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Renewal Window
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.renewalWindow}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Payment Terms
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.paymentTerms}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Liability Cap
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.liabilityCap}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Termination
                    </div>
                    <div className="font-medium text-gray-900">
                      {extractedFields.termination}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card title="Field Confidence">
                <div className="space-y-4">
                  {Object.entries(confidenceScores).map(([field, score]) => (
                    <div key={field} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 capitalize">{field}</span>
                        <span className="font-medium">{score}%</span>
                      </div>
                      <ProgressBar value={score} />
                      <Badge
                        variant={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'danger'}
                      >
                        {score >= 90 ? 'High' : score >= 70 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}