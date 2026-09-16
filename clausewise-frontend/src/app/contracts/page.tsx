'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ContractTable } from '@/components/contracts/ContractTable';
import { Button } from '@/components/ui/Button';
import { Upload } from 'lucide-react';
import Link from 'next/link';

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/contracts" />
      <div className="flex-1 flex flex-col">
        <Header title="Contracts" />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-primary">All Contracts</h2>
              <p className="text-gray-600 text-sm mt-1">Manage and review your contract portfolio</p>
            </div>
            <Button asChild>
              <Link href="/upload">
                <Upload className="w-4 h-4 mr-2" /> Upload Contract
              </Link>
            </Button>
          </div>
          <ContractTable />
        </main>
      </div>
    </div>
  );
}