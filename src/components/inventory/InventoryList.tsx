import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import AddItemForm from './AddItemForm';
import { useIndustryFeatures } from '@/hooks/useIndustryConfig';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  supplier: string;
  department: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'out-of-stock' | 'low-stock';
  lastUpdated: Date;
}

const InventoryList: React.FC = () => {
  const industryFeatures = useIndustryFeatures();
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: '1',
      sku: 'MED001',
      name: 'Paracetamol 500mg',
      category: industryFeatures.categories[0] || 'General',
      supplier: 'PharmaCorp',
      department: 'Pharmacy',
      price: 50,
      stock: 100,
      status: 'in-stock',
      lastUpdated: new Date()
    },
    {
      id: '2',
      sku: 'MED002',
      name: 'Ibuprofen 400mg',
      category: industryFeatures.categories[0] || 'General',
      supplier: 'MedSupply',
      department: 'Pharmacy',
      price: 80,
      stock: 5,
      status: 'low-stock',
      lastUpdated: new Date()
    },
    {
      id: '3',
      sku: 'STA001',
      name: 'A4 Paper Ream',
      category: industryFeatures.categories[1] || 'Office',
      supplier: 'OfficeMax',
      department: 'Admin',
      price: 1200,
      stock: 0,
      status: 'out-of-stock',
      lastUpdated: new Date()
    }
  ]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Supplier filter
    if (supplierFilter !== 'all') {
      filtered = filtered.filter(item => item.supplier === supplierFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(item => item.department === departmentFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, categoryFilter, supplierFilter, departmentFilter, statusFilter]);

  const handleAddItem = (newItem: any) => {
    const item: InventoryItem = {
      id: Date.now().toString(),
      sku: newItem.sku,
      name: newItem.name,
      category: newItem.category,
      supplier: newItem.supplier || 'Unknown',
      department: newItem.department || 'General',
      price: newItem.price,
      stock: newItem.stock || 0,
      status: newItem.stock > 10 ? 'in-stock' : newItem.stock > 0 ? 'low-stock' : 'out-of-stock',
      lastUpdated: new Date()
    };
    setItems(prev => [item, ...prev]);
    setIsAddFormOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge variant="default">In Stock</Badge>;
      case 'low-stock':
        return <Badge variant="secondary">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const uniqueCategories = [...new Set(items.map(item => item.category))];
  const uniqueSuppliers = [...new Set(items.map(item => item.supplier))];
  const uniqueDepartments = [...new Set(items.map(item => item.department))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Inventory Items</h3>
          <p className="text-muted-foreground">Manage and track your inventory items</p>
        </div>
        <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <AddItemForm onSubmit={handleAddItem} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Items</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category-filter">Filter by Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category || 'default'}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="supplier-filter">Filter by Supplier</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger id="supplier-filter">
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  {uniqueSuppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier || 'default'}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="department-filter">Filter by Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger id="department-filter">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(department => (
                    <SelectItem key={department} value={department || 'default'}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setSupplierFilter('all');
                  setDepartmentFilter('all');
                  setStatusFilter('all');
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Inventory Items ({filteredItems.length} of {items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>₦{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No items found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryList;