import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserFormProps {
  onSubmit: (userData: any) => void;
  onCancel: () => void;
}

const designations = [
  'Manager', 'Assistant Manager', 'Supervisor', 'Team Lead', 'Senior Officer',
  'Officer', 'Junior Officer', 'Clerk', 'Cashier', 'Waitstaff', 'Chef',
  'Cook', 'Kitchen Assistant', 'Bartender', 'Store Keeper', 'Security',
  'Cleaner', 'Driver', 'Accountant', 'HR Officer', 'IT Support',
  'Procurement Officer', 'Sales Representative', 'Customer Service',
  'Receptionist', 'Administrator', 'Executive Assistant'
];

const departments = ['Kitchen', 'Bar', 'Administration', 'Store', 'Sales', 'Accounts'];

const permissions = [
  { id: 'inventory_view', label: 'View Inventory' },
  { id: 'inventory_edit', label: 'Edit Inventory' },
  { id: 'sales_view', label: 'View Sales' },
  { id: 'sales_edit', label: 'Edit Sales' },
  { id: 'departments_view', label: 'View Departments' },
  { id: 'departments_edit', label: 'Edit Departments' },
  { id: 'procurement_access', label: 'Access Procurement (Super Admin Only)' },
  { id: 'receivables_view', label: 'View Receivables' },
  { id: 'receivables_edit', label: 'Edit Receivables' },
  { id: 'creditors_view', label: 'View Creditors' },
  { id: 'creditors_edit', label: 'Edit Creditors' },
  { id: 'writeoff_request', label: 'Damage Write-Off Request' },
  { id: 'user_management', label: 'User Management' },
  { id: 'reports_access', label: 'Access Reports' }
];

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    designation: '',
    department: '',
    permissions: [] as string[]
  });
  
  const [designationOpen, setDesignationOpen] = useState(false);
  const [designationSearch, setDesignationSearch] = useState('');

  const filteredDesignations = designations.filter(designation =>
    designation.toLowerCase().includes(designationSearch.toLowerCase())
  );

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>Create a new user account with permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div>
            <Label>Designation</Label>
            <Popover open={designationOpen} onOpenChange={setDesignationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={designationOpen}
                  className="w-full justify-between"
                >
                  {formData.designation || "Select designation..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search designation..." 
                    value={designationSearch}
                    onValueChange={setDesignationSearch}
                  />
                  <CommandEmpty>
                    <div className="p-2">
                      <p className="text-sm text-gray-600 mb-2">No designation found.</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, designation: designationSearch });
                          setDesignationOpen(false);
                          setDesignationSearch('');
                        }}
                      >
                        Add "{designationSearch}"
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredDesignations.map((designation) => (
                      <CommandItem
                        key={designation}
                        value={designation}
                        onSelect={() => {
                          setFormData({ ...formData, designation });
                          setDesignationOpen(false);
                          setDesignationSearch('');
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.designation === designation ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {designation}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                  />
                  <Label htmlFor={permission.id} className="text-sm">
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create User
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;