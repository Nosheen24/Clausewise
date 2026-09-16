'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getUsers } from '@/lib/data';
import { Badge, Button, Card, Input } from '@/components/ui';
import { UserPlus, User } from 'lucide-react';

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  legal: 'Legal Team',
  contract_manager: 'Contract Manager',
  business: 'Business Manager',
  reviewer: 'Reviewer',
};

const roleVariant: Record<string, 'default' | 'info' | 'warning' | 'success' | 'danger'> = {
  admin: 'danger',
  legal: 'info',
  contract_manager: 'warning',
  business: 'default',
  reviewer: 'success',
};

export default function UsersPage() {
  const users = getUsers();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activePath="/users" />
      <div className="flex-1 flex flex-col">
        <Header title="User Management" />
        <main className="flex-1 p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-primary">Organization Users</h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage user access and permissions
              </p>
            </div>
            <Button variant="accent">
              <UserPlus className="w-4 h-4 mr-2" /> Invite User
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={roleVariant[user.role]}>{roleLabels[user.role]}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success">Active</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}