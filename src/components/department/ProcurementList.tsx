import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Download, RefreshCw } from 'lucide-react';

interface ProcurementItem {
  sku: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  suggestedQty: number;
  unit: string;
  lastCost: number;
  supplier: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProcurementListProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
}

const ProcurementList: React.FC<ProcurementListProps> = ({ isOpen, onClose, departmentName }) => {
  const [items, setItems] = useState<ProcurementItem[]>([
    {
      sku: 'SKU001',
      name: 'Sample Item 1',
      currentStock: 5,
      minStock: 10,
      maxStock: 100,
      suggestedQty: 50,
      unit: 'pcs',
      lastCost: 500,
      supplier: 'Supplier A',
      category: 'General',
      priority: 'high'
    },
    {
      sku: 'SKU002',
      name: 'Sample Item 2',
      currentStock: 15,
      minStock: 20,
      maxStock: 200,
      suggestedQty: 100,
      unit: 'kg',
      lastCost: 1000,
      supplier: 'Supplier B',
      category: 'Raw Materials',
      priority: 'medium'
    },
    {
      sku: 'SKU003',
      name: 'Critical Item',
      currentStock: 0,
      minStock: 5,
      maxStock: 50,
      suggestedQty: 25,
      unit: 'pcs',
      lastCost: 2000,
      supplier: 'Supplier C',
      category: 'Critical',
      priority: 'high'
    }
  ]);
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredItems = items.filter(item => {
    if (filterPriority === 'all') return true;
    return item.priority === filterPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { color: 'text-red-600', status: 'Out of Stock' };
    if (current <= min) return { color: 'text-orange-600', status: 'Low Stock' };
    return { color: 'text-green-600', status: 'In Stock' };
  };

  const handleSelectItem = (sku: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, sku]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== sku));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.sku));
    } else {
      setSelectedItems([]);
    }
  };

  const updateSuggestedQty = (sku: string, newQty: number) => {
    setItems(items.map(item => 
      item.sku === sku ? { ...item, suggestedQty: newQty } : item
    ));
  };

  const generateProcurementOrder = () => {
    const selectedItemsData = items.filter(item => selectedItems.includes(item.sku));
    console.log('Generating procurement order for:', selectedItemsData);
    // Here you would typically send this data to your backend
  };

  const exportToPDF = () => {
    console.log('Exporting procurement list to PDF');
  };

  const exportToExcel = () => {
    console.log('Exporting procurement list to Excel');
  };

  const refreshData = () => {
    console.log('Refreshing procurement data');
  };

  const totalValue = items
    .filter(item => selectedItems.includes(item.sku))
    .reduce((sum, item) => sum + (item.suggestedQty * item.lastCost), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Procurement List - {departmentName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{items.filter(i => i.currentStock === 0).length}</p>
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{items.filter(i => i.currentStock <= i.minStock && i.currentStock > 0).length}</p>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedItems.length}</p>
                  <p className="text-sm text-muted-foreground">Selected Items</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">₦{totalValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <Label>Filter by Priority:</Label>
                <select 
                  value={filterPriority} 
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportToPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button 
                onClick={generateProcurementOrder}
                disabled={selectedItems.length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Generate Order ({selectedItems.length})
              </Button>
            </div>
          </div>

          {/* Procurement Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Items Requiring Procurement</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Suggested Qty</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item.currentStock, item.minStock);
                    const isSelected = selectedItems.includes(item.sku);
                    
                    return (
                      <TableRow key={item.sku} className={isSelected ? 'bg-blue-50' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectItem(item.sku, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className={stockStatus.color}>
                          {item.currentStock} {item.unit}
                        </TableCell>
                        <TableCell>{item.minStock} {item.unit}</TableCell>
                        <TableCell>
                          <span className={stockStatus.color}>{stockStatus.status}</span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.suggestedQty}
                            onChange={(e) => updateSuggestedQty(item.sku, Number(e.target.value))}
                            className="w-20"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>₦{item.lastCost.toLocaleString()}</TableCell>
                        <TableCell>₦{(item.suggestedQty * item.lastCost).toLocaleString()}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcurementList;