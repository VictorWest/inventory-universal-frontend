import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';

interface SaleItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  status: 'active' | 'voided' | 'cancelled' | 'complimentary';
  discount?: number;
}

interface DirectSalesInterfaceProps {
  items: SaleItem[];
  onAddItem: (item: any) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onItemAction: (itemId: string, action: string, reason?: string) => void;
}

const DirectSalesInterface: React.FC<DirectSalesInterfaceProps> = ({
  items,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
  onItemAction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  
  // Mock inventory items
  const inventoryItems = [
    { id: '1', sku: 'MED001', name: 'Paracetamol 500mg', price: 50, stock: 100 },
    { id: '2', sku: 'MED002', name: 'Ibuprofen 400mg', price: 80, stock: 75 },
    { id: '3', sku: 'STA001', name: 'A4 Paper Ream', price: 1200, stock: 50 },
    { id: '4', sku: 'STA002', name: 'Blue Pen', price: 150, stock: 200 },
    { id: '5', sku: 'FOD001', name: 'Bottled Water', price: 100, stock: 300 },
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="default">Active</Badge>;
      case 'voided': return <Badge variant="destructive">Voided</Badge>;
      case 'cancelled': return <Badge variant="secondary">Cancelled</Badge>;
      case 'complimentary': return <Badge variant="outline">Complimentary</Badge>;
      default: return <Badge variant="default">Active</Badge>;
    }
  };

  const getItemStyle = (status: string) => {
    return status === 'voided' || status === 'cancelled' ? 'line-through opacity-50' : '';
  };

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer">Customer Name (Optional)</Label>
              <Input
                id="customer"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Search */}
      <Card>
        <CardHeader>
          <CardTitle>Add Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {searchTerm && (
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => onAddItem(item)}
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        SKU: {item.sku} • Stock: {item.stock}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦{item.price}</div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sale Items */}
      <Card>
        <CardHeader>
          <CardTitle>Sale Items</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No items added yet. Search and add items above.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className={getItemStyle(item.status)}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>₦{item.price}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.status !== 'active'}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.status !== 'active'}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>₦{item.total}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onItemAction(item.id, 'void')}
                          disabled={item.status !== 'active'}
                        >
                          Void
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onItemAction(item.id, 'cancel')}
                          disabled={item.status !== 'active'}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectSalesInterface;