import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryItem {
  id: string;
  name: string;
  department: string;
  quantity: number;
  costPrice: number;
  totalValue: number;
}

interface DepartmentSummary {
  department: string;
  totalItems: number;
  totalValue: number;
  lastUpdated: string;
}

const CostCalculationModule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const inventoryItems: InventoryItem[] = [
    { id: '1', name: 'Rice 50kg', department: 'Kitchen', quantity: 25, costPrice: 5000, totalValue: 125000 },
    { id: '2', name: 'Cooking Oil 25L', department: 'Kitchen', quantity: 10, costPrice: 5000, totalValue: 50000 },
    { id: '3', name: 'Soft Drinks', department: 'Bar', quantity: 100, costPrice: 300, totalValue: 30000 },
    { id: '4', name: 'Beer Bottles', department: 'Bar', quantity: 50, costPrice: 500, totalValue: 25000 },
    { id: '5', name: 'Office Paper', department: 'Administration', quantity: 20, costPrice: 1500, totalValue: 30000 },
  ];

  const departments = ['Kitchen', 'Bar', 'Administration', 'Store'];

  const filteredItems = selectedDepartment === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.department === selectedDepartment);

  const departmentSummaries: DepartmentSummary[] = departments.map(dept => {
    const deptItems = inventoryItems.filter(item => item.department === dept);
    return {
      department: dept,
      totalItems: deptItems.length,
      totalValue: deptItems.reduce((sum, item) => sum + item.totalValue, 0),
      lastUpdated: selectedDate
    };
  });

  const totalWorkingCapital = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cost Calculation</h2>
          <p className="text-gray-600">Monitor daily inventory valuation and working capital</p>
        </div>
        <div className="flex space-x-4">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Working Capital</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦{totalWorkingCapital.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">As of {selectedDate}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredItems.length}</div>
            <p className="text-xs text-muted-foreground">Inventory items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">System sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Department Summary</CardTitle>
          <CardDescription>Closing inventory values per department</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Total Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentSummaries.map((summary) => (
                <TableRow key={summary.department}>
                  <TableCell className="font-medium">{summary.department}</TableCell>
                  <TableCell>{summary.totalItems}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ₦{summary.totalValue.toLocaleString()}
                  </TableCell>
                  <TableCell>{summary.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Inventory Items */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Inventory Valuation</CardTitle>
          <CardDescription>Cost price and total value of each inventory item</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₦{item.costPrice.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ₦{item.totalValue.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostCalculationModule;