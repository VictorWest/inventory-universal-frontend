import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { clearSession, getSessionEmail } from '@/lib/session';

interface DashboardHeaderProps {
  companyName: string;
  industry: string;
  planType: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ companyName, industry, planType }) => {
  const { toggleSidebar } = useAppContext();
  const navigate = useNavigate();
  const email = typeof window !== 'undefined' ? getSessionEmail() : null;

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
        <div className="flex items-center space-x-2">
          {email && (
            <div className="text-sm text-muted-foreground mr-2">{email}</div>
          )}
          <Button variant="ghost" size="sm" onClick={async () => {
            // attempt server logout (if backend supports it)
            try {
              await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            } catch (e) {
              // ignore
            }
            clearSession();
            navigate('/login');
          }} aria-label="Logout">
            <User className="h-5 w-5" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;