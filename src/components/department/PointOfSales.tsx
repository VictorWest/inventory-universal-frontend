import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, ShoppingCart, Receipt, Trash2 } from 'lucide-react';

interface SaleItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  availableStock: number;
}

interface PointOfSalesProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
}

const PointOfSales: React.FC<PointOfSalesProps> = ({ isOpen, onClose, departmentName }) => {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);

  // Mock inventory items
  const inventoryItems = [
    { id: '1', sku: 'SKU001', name: 'Product A', price: 500, stock: 50, category: 'Electronics' },
    { id: '2', sku: 'SKU002', name: 'Product B', price: 750, stock: 30, category: 'Accessories' },
    { id: '3', sku: 'SKU003', name: 'Product C', price: 1200, stock: 20, category: 'Electronics' },
    { id: '4', sku: 'SKU004', name: 'Service Item', price: 2000, stock: 100, category: 'Services' }
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToSale = (item: any) => {
    const existingItem = saleItems.find(si => si.id === item.id);
    if (existingItem) {
      if (existingItem.quantity < item.stock) {
        updateQuantity(item.id, existingItem.quantity + 1);
      }
    } else {
      const newSaleItem: SaleItem = {
        id: item.id,
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: 1,
        total: item.price,
        availableStock: item.stock
      };
      setSaleItems([...saleItems, newSaleItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromSale(itemId);
      return;
    }
    
    setSaleItems(saleItems.map(item => {
      if (item.id === itemId) {
        const validQuantity = Math.min(newQuantity, item.availableStock);
        return { ...item, quantity: validQuantity, total: item.price * validQuantity };
      }
      return item;
    }));
  };

  const removeFromSale = (itemId: string) => {
    setSaleItems(saleItems.filter(item => item.id !== itemId));
  };

  const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + tax;
  const change = amountReceived - total;

  const processSale = () => {
    if (saleItems.length === 0) return;
    
    const saleData = {
      id: `SALE-${Date.now()}`,
      department: departmentName,
      items: saleItems,
      customer: customerName,
      subtotal,
      tax,
      total,
      paymentMethod,
      amountReceived,
      change,
      timestamp: new Date().toISOString(),
      cashier: 'Current User'
    };
    
    console.log('Processing sale:', saleData);
    
    // Reset form
    setSaleItems([]);
    setCustomerName('');
    setAmountReceived(0);
    setSearchTerm('');
    
    // In a real app, you would print receipt here
    alert('Sale processed successfully! Receipt printed.');
  };

  const clearSale = () => {
    setSaleItems([]);
    setCustomerName('');
    setAmountReceived(0);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Point of Sales - {departmentName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Search & Selection */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Search</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="border rounded p-3 hover:bg-gray-50 cursor-pointer"
                         onClick={() => addToSale(item)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sku}</p>
                          <p className="text-lg font-bold text-green-600">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={item.stock > 10 ? 'default' : 'destructive'}>
                            {item.stock} left
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sale Items */}
            <Card>
              <CardHeader>
                <CardTitle>Sale Items ({saleItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {saleItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No items in sale. Search and click items to add.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saleItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>₦{item.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                className="w-16 text-center"
                                min="1"
                                max={item.availableStock}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.availableStock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">₦{item.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromSale(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sale Summary & Payment */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sale Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer Name (Optional)</Label>
                  <Input
                    id="customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7.5%):</span>
                    <span>₦{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <Label>Payment Method</Label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card/POS</option>
                    <option value="transfer">Bank Transfer</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
                
                {paymentMethod === 'cash' && (
                  <div>
                    <Label htmlFor="amountReceived">Amount Received</Label>
                    <Input
                      id="amountReceived"
                      type="number"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(Number(e.target.value))}
                      placeholder="0.00"
                    />
                    {amountReceived > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm">
                          Change: <span className="font-bold">₦{change.toFixed(2)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={processSale}
                    disabled={saleItems.length === 0 || (paymentMethod === 'cash' && amountReceived < total)}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Process Sale
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearSale}
                    disabled={saleItems.length === 0}
                  >
                    Clear Sale
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PointOfSales;