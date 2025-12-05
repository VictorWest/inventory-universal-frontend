import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  RotateCcw, 
  TrendingUp, 
  Users, 
  PlusCircle,
  Eye,
  Download
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  type: 'store' | 'sales' | 'production' | 'admin';
  isCustomerFacing: boolean;
}

interface DepartmentActionsProps {
  department: Department;
  onPosting: () => void;
  onSales: () => void;
  onMakeRequisition: () => void;
  onViewRequisitions: () => void;
  onReturnInward: () => void;
  onReturnOutward: () => void;
  onProcurementList: () => void;
  onGenerateReport: (type: string) => void;
  userRole: 'admin' | 'manager' | 'staff';
}

const DepartmentActions: React.FC<DepartmentActionsProps> = ({
  department,
  onPosting,
  onSales,
  onMakeRequisition,
  onViewRequisitions,
  onReturnInward,
  onReturnOutward,
  onProcurementList,
  onGenerateReport,
  userRole
}) => {
  const canAccess = (action: string) => {
    if (userRole === 'admin') return true;
    if (userRole === 'manager') return true;
    // Staff can only do basic operations
    return ['posting', 'sales', 'makeRequisition'].includes(action);
  };

  const getActionsByDepartmentType = () => {
    const actions = [];

    // Core actions available to all departments
    if (canAccess('posting')) {
      actions.push({
        key: 'posting',
        label: 'Manual Posting',
        description: 'Record item usage manually',
        icon: Package,
        color: 'bg-blue-500',
        onClick: onPosting
      });
    }

    // Sales actions for customer-facing departments
    if (department.isCustomerFacing && canAccess('sales')) {
      actions.push({
        key: 'sales',
        label: 'Point of Sale',
        description: 'Process customer transactions',
        icon: TrendingUp,
        color: 'bg-green-500',
        onClick: onSales
      });
    }

    // Requisition actions (not for store departments)
    if (department.type !== 'store' && canAccess('makeRequisition')) {
      actions.push({
        key: 'makeRequisition',
        label: 'Make Requisition',
        description: 'Request items from store',
        icon: ShoppingCart,
        color: 'bg-purple-500',
        onClick: onMakeRequisition
      });
    }

    // Store-specific actions
    if (department.type === 'store') {
      if (canAccess('viewRequisitions')) {
        actions.push({
          key: 'viewRequisitions',
          label: 'View Requisitions',
          description: 'Manage incoming requests',
          icon: Eye,
          color: 'bg-orange-500',
          onClick: onViewRequisitions
        });
      }

      if (canAccess('procurementList')) {
        actions.push({
          key: 'procurementList',
          label: 'Procurement List',
          description: 'Generate purchase suggestions',
          icon: PlusCircle,
          color: 'bg-indigo-500',
          onClick: onProcurementList
        });
      }
    }

    // Return actions
    if (canAccess('returnInward')) {
      actions.push({
        key: 'returnInward',
        label: 'Return Inward',
        description: 'Return items to store',
        icon: RotateCcw,
        color: 'bg-yellow-500',
        onClick: onReturnInward
      });
    }

    if (department.type === 'store' && canAccess('returnOutward')) {
      actions.push({
        key: 'returnOutward',
        label: 'Return Outward',
        description: 'Return items to suppliers',
        icon: RotateCcw,
        color: 'bg-red-500',
        onClick: onReturnOutward
      });
    }

    return actions;
  };

  const getReportTypes = () => {
    const reports = [
      { key: 'usage', label: 'Usage Report' },
      { key: 'movement', label: 'Stock Movement' },
      { key: 'requisition', label: 'Requisition Log' },
      { key: 'returns', label: 'Return Log' }
    ];

    if (department.isCustomerFacing) {
      reports.unshift({ key: 'sales', label: 'Sales Report' });
    }

    if (department.type === 'store') {
      reports.push({ key: 'procurement', label: 'Procurement History' });
    }

    return reports;
  };

  const actions = getActionsByDepartmentType();
  const reports = getReportTypes();

  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Department Actions
            <Badge variant="secondary">{department.type}</Badge>
            {department.isCustomerFacing && (
              <Badge className="bg-green-100 text-green-800">Customer Facing</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.key}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow"
                  onClick={action.onClick}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`p-2 rounded-md ${action.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reports Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {reports.map((report) => (
              <Button
                key={report.key}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => onGenerateReport(report.key)}
              >
                <Download className="h-4 w-4 mr-2" />
                {report.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Today's Postings</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {department.isCustomerFacing && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Today's Sales</p>
                  <p className="text-2xl font-bold">₦45,200</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Pending Requisitions</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentActions;