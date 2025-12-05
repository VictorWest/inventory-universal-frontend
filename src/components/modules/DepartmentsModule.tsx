import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Building, Users, FileText, Package, Calendar } from 'lucide-react';
import { useIndustryFeatures } from '@/hooks/useIndustryConfig';
import { useToast } from '@/hooks/use-toast';
import DepartmentCreationForm from '@/components/department/DepartmentCreationForm';
import DepartmentInventoryTable from '@/components/department/DepartmentInventoryTable';
import DepartmentActions from '@/components/department/DepartmentActions';
import PostingForm from '@/components/department/PostingForm';
import RequisitionForm from '@/components/department/RequisitionForm';
import ViewRequisitions from '@/components/department/ViewRequisitions';
import ProcurementList from '@/components/department/ProcurementList';
import ReturnForms from '@/components/department/ReturnForms';
import PointOfSales from '@/components/department/PointOfSales';

interface Department {
  id: string;
  name: string;
  location: string;
  headId: string;
  headName: string;
  type: 'store' | 'sales' | 'production' | 'admin';
  isCustomerFacing: boolean;
  linkedStores: string[];
  itemCount: number;
  lastActivity: string;
}

const DepartmentsModule: React.FC = () => {
  const industryFeatures = useIndustryFeatures();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Main Store',
      location: 'Ground Floor',
      headId: 'user1',
      headName: 'John Doe',
      type: 'store',
      isCustomerFacing: false,
      linkedStores: [],
      itemCount: 150,
      lastActivity: '2024-01-15'
    },
    {
      id: '2',
      name: industryFeatures.departments[1] || 'Sales Department',
      location: 'First Floor',
      headId: 'user2',
      headName: 'Jane Smith',
      type: 'sales',
      isCustomerFacing: true,
      linkedStores: ['1'],
      itemCount: 45,
      lastActivity: '2024-01-15'
    }
  ]);
  
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPosting, setShowPosting] = useState(false);
  const [showRequisition, setShowRequisition] = useState(false);
  const [showViewRequisitions, setShowViewRequisitions] = useState(false);
  const [showProcurement, setShowProcurement] = useState(false);
  const [showReturnInward, setShowReturnInward] = useState(false);
  const [showReturnOutward, setShowReturnOutward] = useState(false);
  const [showPOS, setShowPOS] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 'user1', name: 'John Doe', department: 'Administration' },
    { id: 'user2', name: 'Jane Smith', department: 'Sales' },
    { id: 'user3', name: 'Mike Johnson', department: 'Operations' }
  ];

  const mockStores = [
    { id: '1', name: 'Main Store', location: 'Ground Floor' },
    { id: '2', name: 'Secondary Store', location: 'First Floor' }
  ];

  const mockInventory = [
    {
      sku: 'SKU001',
      itemName: 'Sample Item 1',
      opening: 100,
      added: 20,
      total: 120,
      out: 30,
      closing: 90,
      unit: industryFeatures.uoms[0] || 'pcs',
      costPrice: 500,
      sellingPrice: 750,
      category: 'General'
    }
  ];

  const mockPostingItems = mockInventory.map(item => ({
    sku: item.sku,
    itemName: item.itemName,
    availableQty: item.closing,
    unit: item.unit,
    costPrice: item.costPrice,
    category: item.category
  }));

  const mockStoreItems = mockStores.map(store => ({
    id: store.id,
    name: store.name,
    items: mockPostingItems.map(item => ({ ...item, storeName: store.name }))
  }));

  const addDepartment = (formData: any) => {
    const headUser = mockUsers.find(u => u.id === formData.headId);
    const department: Department = {
      id: Date.now().toString(),
      name: formData.name,
      location: formData.location,
      headId: formData.headId,
      headName: headUser?.name || 'Unknown',
      type: formData.type,
      isCustomerFacing: formData.isCustomerFacing,
      linkedStores: formData.linkedStores,
      itemCount: 0,
      lastActivity: new Date().toISOString().split('T')[0]
    };
    
    setDepartments([...departments, department]);
    setShowAddForm(false);
    toast({ title: "Department Created", description: `${formData.name} has been successfully created.` });
  };

  const handlePosting = (entries: any[], notes: string) => {
    toast({ title: "Posting Submitted", description: `${entries.length} items posted successfully.` });
  };

  const handleRequisition = (items: any[], notes: string, expectedDate: string) => {
    toast({ title: "Requisition Submitted", description: `Requisition for ${items.length} items submitted for approval.` });
  };

  const getDepartmentTypeColor = (type: string) => {
    switch (type) {
      case 'store': return 'bg-blue-100 text-blue-800';
      case 'sales': return 'bg-green-100 text-green-800';
      case 'production': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Departments</h2>
          <p className="text-muted-foreground">Manage departments and their inventory operations</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedDept(dept)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{dept.location}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getDepartmentTypeColor(dept.type)}>
                    {dept.type}
                  </Badge>
                  {dept.isCustomerFacing && (
                    <Badge className="bg-green-100 text-green-800">POS</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{dept.headName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{dept.itemCount} items</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last: {dept.lastActivity}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showAddForm && (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-2xl">
            <DepartmentCreationForm
              onSubmit={addDepartment}
              onCancel={() => setShowAddForm(false)}
              users={mockUsers}
              stores={mockStores}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedDept && (
        <Dialog open={!!selectedDept} onOpenChange={() => setSelectedDept(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {selectedDept.name} - Department Operations
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-4 w-4" />
                <Label>Select Date:</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>

              <DepartmentActions
                department={selectedDept}
                onPosting={() => setShowPosting(true)}
                onSales={() => setShowPOS(true)}
                onMakeRequisition={() => setShowRequisition(true)}
                onViewRequisitions={() => setShowViewRequisitions(true)}
                onReturnInward={() => setShowReturnInward(true)}
                onReturnOutward={() => setShowReturnOutward(true)}
                onProcurementList={() => setShowProcurement(true)}
                onGenerateReport={(type) => toast({ title: "Report", description: `Generating ${type} report...` })}
                userRole="admin"
              />

              <DepartmentInventoryTable
                items={mockInventory}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showPrices={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <PostingForm
        isOpen={showPosting}
        onClose={() => setShowPosting(false)}
        departmentName={selectedDept?.name || ''}
        availableItems={mockPostingItems}
        onSubmit={handlePosting}
      />

      <RequisitionForm
        isOpen={showRequisition}
        onClose={() => setShowRequisition(false)}
        departmentName={selectedDept?.name || ''}
        availableStores={mockStoreItems}
        onSubmit={handleRequisition}
      />

      <ViewRequisitions
        isOpen={showViewRequisitions}
        onClose={() => setShowViewRequisitions(false)}
        departmentName={selectedDept?.name || ''}
        userRole="admin"
      />

      <ProcurementList
        isOpen={showProcurement}
        onClose={() => setShowProcurement(false)}
        departmentName={selectedDept?.name || ''}
      />

      <ReturnForms
        isOpen={showReturnInward}
        onClose={() => setShowReturnInward(false)}
        type="inward"
        departmentName={selectedDept?.name || ''}
      />

      <ReturnForms
        isOpen={showReturnOutward}
        onClose={() => setShowReturnOutward(false)}
        type="outward"
        departmentName={selectedDept?.name || ''}
      />

      <PointOfSales
        isOpen={showPOS}
        onClose={() => setShowPOS(false)}
        departmentName={selectedDept?.name || ''}
      />
    </div>
  );
};

export default DepartmentsModule;