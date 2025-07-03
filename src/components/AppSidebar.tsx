
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Department } from '@/types';

const departmentConfig = {
  merchandising: { name: 'Merchandising', color: 'bg-blue-500', emoji: '📋' },
  logistics: { name: 'Logistics', color: 'bg-green-500', emoji: '🚚' },
  procurement: { name: 'Procurement', color: 'bg-orange-500', emoji: '💰' },
  sampling: { name: 'Sampling', color: 'bg-purple-500', emoji: '🧵' },
  management: { name: 'Management', color: 'bg-yellow-500', emoji: '👔' },
};

const AppSidebar: React.FC = () => {
  const { user, switchDepartment } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  if (!user) return null;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Departments"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(departmentConfig).map(([key, config]) => {
                const isActive = user.department === key;
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      onClick={() => switchDepartment(key as Department)}
                      className={`${isActive ? 'bg-muted text-primary font-medium' : 'hover:bg-muted/50'}`}
                    >
                      <span className="text-lg mr-2">{config.emoji}</span>
                      {!collapsed && <span>{config.name}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
