
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
import { 
  Calculator, 
  Truck, 
  Calendar, 
  ShoppingCart, 
  Lightbulb, 
  CheckSquare, 
  Package, 
  BarChart3 
} from 'lucide-react';

const departmentConfig = {
  merchandising: { name: 'Merchandising', color: 'bg-blue-500', emoji: '📋' },
  logistics: { name: 'Logistics', color: 'bg-green-500', emoji: '🚚' },
  procurement: { name: 'Procurement', color: 'bg-orange-500', emoji: '💰' },
  sampling: { name: 'Sampling', color: 'bg-purple-500', emoji: '🧵' },
  management: { name: 'Management', color: 'bg-yellow-500', emoji: '👔' },
};

interface AppSidebarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onNavigate, currentView }) => {
  const { user, switchDepartment } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  if (!user) return null;

  const coreModules = [
    { key: 'orders', label: 'Order Management', icon: ShoppingCart },
    { key: 'product-dev', label: 'Product Development', icon: Lightbulb },
    { key: 'costing', label: 'Costing Calculator', icon: Calculator },
    { key: 'sourcing', label: 'Sourcing Management', icon: Truck },
    { key: 'production', label: 'Production Scheduler', icon: Calendar },
    { key: 'quality', label: 'Quality Control', icon: CheckSquare },
    { key: 'shipping', label: 'Packing & Shipping', icon: Package },
    { key: 'inventory', label: 'Inventory Management', icon: BarChart3 },
  ];

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

        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Core Modules"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreModules.map((module) => (
                <SidebarMenuItem key={module.key}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(module.key)}
                    className={`${currentView === module.key ? 'bg-muted text-primary font-medium' : 'hover:bg-muted/50'}`}
                  >
                    <module.icon className="h-5 w-5 mr-2" />
                    {!collapsed && <span>{module.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
