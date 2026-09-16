'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, Upload, BookOpen, CalendarDays, ClipboardList, History, Settings, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activePath: string;
  onLogout?: () => void;
}

export function Sidebar({ activePath, onLogout }: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, active: activePath === '/dashboard' },
    { name: 'Contracts', href: '/contracts', icon: FileText, active: activePath.startsWith('/contracts') },
    { name: 'Upload', href: '/upload', icon: Upload, active: activePath === '/upload' },
    { name: 'Review Queue', href: '/review', icon: FileText, active: activePath === '/review' },
    { name: 'Playbooks', href: '/playbooks', icon: BookOpen, active: activePath === '/playbooks' },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays, active: activePath === '/calendar' },
    { name: 'Approvals', href: '/approvals', icon: ClipboardList, active: activePath === '/approvals' },
    { name: 'Version History', href: '/versions', icon: History, active: activePath.startsWith('/versions') },
    { name: 'Settings', href: '/settings', icon: Settings, active: activePath === '/settings' },
    { name: 'Users', href: '/users', icon: Users, active: activePath === '/users' },
  ];

  return (
    <aside className="w-64 bg-primary text-white h-full px-4 py-6 flex flex-col">
      <div className="flex items-center mb-8">
        <h2 className="text-xl font-bold text-white">Clausewise</h2>
      </div>

      <nav className="space-y-1">
        {navItems.map(item => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              item.active ? 'bg-accent/20 text-accent' : 'hover:bg-primary/10 hover:text-white'
            )}
          >
            {item.icon && <item.icon className="w-5 h-5 mr-3" />}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {onLogout && (
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}