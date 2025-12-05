import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

interface DashboardHeaderProps {
  companyName: string;
  industry: string;
  planType: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ companyName, industry, planType }) => {
  const { toggleSidebar } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{companyName}</h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">{industry}</Badge>
            <Badge variant="secondary" className="text-xs">{planType}</Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => navigate('/login')} aria-label="Account">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;