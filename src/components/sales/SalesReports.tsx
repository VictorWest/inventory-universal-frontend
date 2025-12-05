import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';

interface SalesReportsProps {
  department?: string;
}

const SalesReports: React.FC<SalesReportsProps> = ({ department }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Mock data
  const salesData = [
    {
      id: 'SALE-001',
      date: '2024-01-15',
      user: 'John Doe',
      customer: 'Walk-in Customer',
      items: 5,
      subtotal: 2500,
      discount: 250,
      total: 2250,
      paymentMethod: 'Cash',
      table: 'Table 1',
      status: 'Completed'
    },
    {
      id: 'SALE-002',
      date: '2024-01-15',
      user: 'Jane Smith',
      customer: 'Mr. Johnson',
      items: 3,
      subtotal: 1800,
      discount: 0,
      total: 1800,
      paymentMethod: 'Card',
      table: 'Table 5',
      status: 'Completed'
    }
  ];

  const voidedItems = [
    {
      id: 'VOID-001',
      date: '2024-01-15',
      user: 'John Doe',
      item: 'Coffee',
      quantity: 2,
      amount: 1000,
      reason: 'Customer changed mind',
      saleId: 'SALE-001'
    }
  ];

  const discountData = [
    {
      id: 'DISC-001',
      date: '2024-01-15',
      user: 'John Doe',
      item: 'Burger',
      originalPrice: 2000,
      discountPercent: 10,
      discountAmount: 200,
      finalPrice: 1800,
      saleId: 'SALE-001'
    }
  ];

  const profitData = [
    {
      item: 'Coffee',
      sold: 25,
      revenue: 12500,
      cost: 6250,
      profit: 6250,
      margin: 50
    },
    {
      item: 'Burger',
      sold: 15,
      revenue: 30000,
      cost: 18000,
      profit: 12000,
      margin: 40
    }
  ];

  const exportToPDF = () => {
    console.log('Exporting to PDF...');
  };

  const exportToExcel = () => {
    console.log('Exporting to Excel...');
  };

  const totalSales = salesData.reduce((sum, sale) => sum + sale.total, 0);
  const totalDiscount = salesData.reduce((sum, sale) => sum + sale.discount, 0);
  const totalProfit = profitData.reduce((sum, item) => sum + item.profit, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Reports</h2>
        <div className="flex space-x-2">
          <Button onClick={exportToPDF} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <Label>User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalDiscount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">-5% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.length}</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="voids">Voids/Cancellations</TabsTrigger>
          <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.user}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell>₦{sale.total}</TableCell>
                      <TableCell>{sale.paymentMethod}</TableCell>
                      <TableCell>
                        <Badge variant="default">{sale.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discounts">
          <Card>
            <CardHeader>
              <CardTitle>Discount Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Discount Amount</TableHead>
                    <TableHead>Final Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountData.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>{discount.date}</TableCell>
                      <TableCell>{discount.user}</TableCell>
                      <TableCell>{discount.item}</TableCell>
                      <TableCell>₦{discount.originalPrice}</TableCell>
                      <TableCell>{discount.discountPercent}%</TableCell>
                      <TableCell>₦{discount.discountAmount}</TableCell>
                      <TableCell>₦{discount.finalPrice}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voids">
          <Card>
            <CardHeader>
              <CardTitle>Voided/Cancelled Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Sale ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voidedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.user}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₦{item.amount}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.saleId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.sold}</TableCell>
                      <TableCell>₦{item.revenue}</TableCell>
                      <TableCell>₦{item.cost}</TableCell>
                      <TableCell>₦{item.profit}</TableCell>
                      <TableCell>{item.margin}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesReports;