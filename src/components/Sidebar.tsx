import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Package, 
  Building2, 
  ShoppingCart, 
  Users, 
  Calculator, 
  BarChart3, 
  Settings, 
  Crown,
  X,
  Receipt,
  CreditCard,
  UserCog,
  Truck
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'inventory', name: 'Inventory Management', icon: Package },
  { id: 'departments', name: 'Departments', icon: Building2 },
  { id: 'sales', name: 'Sales', icon: ShoppingCart },
  { id: 'vendors', name: 'Vendors', icon: Users },
  { id: 'receivables', name: 'Receivables', icon: Receipt },
  { id: 'creditors', name: 'Creditors', icon: CreditCard },
  { id: 'procurement', name: 'Procurement', icon: Truck },
  { id: 'user-management', name: 'User Management', icon: UserCog },
  { id: 'cost-calculation', name: 'Cost Calculation', icon: Calculator },
  { id: 'reports', name: 'Reports', icon: BarChart3 },
  { id: 'settings', name: 'Settings', icon: Settings },
  { id: 'upgrade', name: 'Upgrade', icon: Crown },
];

const Sidebar: React.FC<SidebarProps> = ({ activeModule, onModuleChange }) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Mi-Inventory Pro</h2>
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onModuleChange(module.id);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {module.name}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </>
  );
};

export default Sidebar;