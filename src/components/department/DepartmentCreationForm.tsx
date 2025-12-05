import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useIndustryFeatures } from '@/hooks/useIndustryConfig';
import { Building2, Users, MapPin, Store } from 'lucide-react';

interface DepartmentFormData {
  name: string;
  location: string;
  description: string;
  headOfDepartment: string;
  isCustomerFacing: boolean;
  salesMode: 'table' | 'direct';
  linkedStores: string[];
  departmentType: string;
}

interface DepartmentCreationFormProps {
  onSubmit: (data: DepartmentFormData) => void;
  onCancel: () => void;
}

const DepartmentCreationForm: React.FC<DepartmentCreationFormProps> = ({ onSubmit, onCancel }) => {
  const industryFeatures = useIndustryFeatures();
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    location: '',
    description: '',
    headOfDepartment: '',
    isCustomerFacing: false,
    salesMode: 'direct',
    linkedStores: [],
    departmentType: ''
  });

  // Mock data for dropdowns
  const users = [
    { id: '1', name: 'John Doe', role: 'Manager' },
    { id: '2', name: 'Jane Smith', role: 'Supervisor' },
    { id: '3', name: 'Mike Johnson', role: 'Team Lead' }
  ];

  const stores = [
    { id: '1', name: 'Main Store', location: 'Ground Floor' },
    { id: '2', name: 'Secondary Store', location: 'First Floor' },
    { id: '3', name: 'Emergency Store', location: 'Basement' }
  ];

  const departmentTypes = [
    'Sales Department',
    'Kitchen',
    'Bar',
    'Pharmacy',
    'Ward',
    'Admin Office',
    'Production Floor',
    'Warehouse',
    'Reception',
    'Laboratory',
    'Classroom',
    'Store Room'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleStoreToggle = (storeId: string) => {
    setFormData(prev => ({
      ...prev,
      linkedStores: prev.linkedStores.includes(storeId)
        ? prev.linkedStores.filter(id => id !== storeId)
        : [...prev.linkedStores, storeId]
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Create New Department
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Main Bar, Pharmacy, Sales Floor"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Ground Floor, Building A"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="departmentType">Department Type</Label>
            <Select 
              value={formData.departmentType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, departmentType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department type" />
              </SelectTrigger>
              <SelectContent>
                {departmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the department's function"
              rows={3}
            />
          </div>

          {/* Head of Department */}
          <div>
            <Label htmlFor="head">Head of Department</Label>
            <Select 
              value={formData.headOfDepartment} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, headOfDepartment: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department head" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {user.name} ({user.role})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer-Facing Configuration */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="customerFacing"
                checked={formData.isCustomerFacing}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isCustomerFacing: checked as boolean }))
                }
              />
              <Label htmlFor="customerFacing" className="font-medium">
                Is this department customer-facing?
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Enable this if the department will handle direct sales to customers
            </p>

            {formData.isCustomerFacing && (
              <div>
                <Label>Sales Mode</Label>
                <Select 
                  value={formData.salesMode} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, salesMode: value as 'table' | 'direct' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">
                      <div>
                        <div className="font-medium">Direct Sales</div>
                        <div className="text-sm text-muted-foreground">
                          For retail, pharmacy, office stores
                        </div>
                      </div>
                    </SelectItem>
                    {industryFeatures.hasTableService && (
                      <SelectItem value="table">
                        <div>
                          <div className="font-medium">Table-Based Sales</div>
                          <div className="text-sm text-muted-foreground">
                            For restaurants, bars, lounges
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Linked Stores */}
          <div className="space-y-4">
            <div>
              <Label className="font-medium">Link to Store(s) *</Label>
              <p className="text-sm text-muted-foreground">
                Select which stores this department will draw inventory from
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    id={`store-${store.id}`}
                    checked={formData.linkedStores.includes(store.id)}
                    onCheckedChange={() => handleStoreToggle(store.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-2" />
                      <Label htmlFor={`store-${store.id}`} className="font-medium">
                        {store.name}
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {store.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!formData.name || !formData.location || formData.linkedStores.length === 0}
            >
              Create Department
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepartmentCreationForm;