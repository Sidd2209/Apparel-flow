
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Department } from '@/types';

const departmentConfig = {
  merchandising: { name: 'Merchandising', color: 'bg-blue-500', emoji: '📋' },
  logistics: { name: 'Logistics', color: 'bg-green-500', emoji: '🚚' },
  procurement: { name: 'Procurement', color: 'bg-orange-500', emoji: '💰' },
  sampling: { name: 'Sampling', color: 'bg-purple-500', emoji: '🧵' },
  management: { name: 'Management', color: 'bg-yellow-500', emoji: '👔' },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, switchDepartment } = useAuth();

  if (!user) return null;

  const currentDept = departmentConfig[user.department];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ApparelOS
              </h1>
              <Badge className={`${currentDept.color} text-white`}>
                {currentDept.emoji} {currentDept.name}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Switch Department
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Departments</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(departmentConfig).map(([key, config]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => switchDepartment(key as Department)}
                      className={user.department === key ? 'bg-gray-100' : ''}
                    >
                      <span className="mr-2">{config.emoji}</span>
                      {config.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`${currentDept.color} text-white`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <Badge variant="outline" className="w-fit">
                        {user.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
