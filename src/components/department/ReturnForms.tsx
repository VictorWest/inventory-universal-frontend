import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Search, ArrowLeft, ArrowRight } from 'lucide-react';

interface ReturnItem {
  sku: string;
  name: string;
  availableQty: number;
  returnQty: number;
  unit: string;
  reason: string;
  condition: 'good' | 'damaged' | 'expired';
  batchNumber?: string;
}

interface ReturnFormsProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'inward' | 'outward';
  departmentName: string;
}

const ReturnForms: React.FC<ReturnFormsProps> = ({ isOpen, onClose, type, departmentName }) => {
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  // Mock available items
  const availableItems = [
    { sku: 'SKU001', name: 'Sample Item 1', availableQty: 50, unit: 'pcs', batchNumber: 'B001' },
    { sku: 'SKU002', name: 'Sample Item 2', availableQty: 30, unit: 'kg', batchNumber: 'B002' },
    { sku: 'SKU003', name: 'Expired Item', availableQty: 10, unit: 'pcs', batchNumber: 'B003' },
    { sku: 'SKU004', name: 'Damaged Item', availableQty: 5, unit: 'pcs', batchNumber: 'B004' }
  ];

  const suppliers = ['Supplier A', 'Supplier B', 'Supplier C'];
  const returnReasons = [
    'Damaged goods',
    'Expired items',
    'Wrong specification',
    'Excess inventory',
    'Quality issues',
    'Customer return',
    'Defective product'
  ];

  const filteredItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addReturnItem = (item: any) => {
    const existingItem = returnItems.find(ri => ri.sku === item.sku);
    if (existingItem) {
      updateReturnQuantity(item.sku, existingItem.returnQty + 1);
    } else {
      const newReturnItem: ReturnItem = {
        sku: item.sku,
        name: item.name,
        availableQty: item.availableQty,
        returnQty: 1,
        unit: item.unit,
        reason: '',
        condition: 'good',
        batchNumber: item.batchNumber
      };
      setReturnItems([...returnItems, newReturnItem]);
    }
  };

  const updateReturnQuantity = (sku: string, newQty: number) => {
    if (newQty <= 0) {
      removeReturnItem(sku);
      return;
    }
    
    setReturnItems(returnItems.map(item => {
      if (item.sku === sku) {
        return { ...item, returnQty: Math.min(newQty, item.availableQty) };
      }
      return item;
    }));
  };

  const removeReturnItem = (sku: string) => {
    setReturnItems(returnItems.filter(item => item.sku !== sku));
  };

  const updateReturnReason = (sku: string, reason: string) => {
    setReturnItems(returnItems.map(item => 
      item.sku === sku ? { ...item, reason } : item
    ));
  };

  const updateReturnCondition = (sku: string, condition: 'good' | 'damaged' | 'expired') => {
    setReturnItems(returnItems.map(item => 
      item.sku === sku ? { ...item, condition } : item
    ));
  };

  const handleSubmit = () => {
    if (returnItems.length === 0) return;
    
    const returnData = {
      type,
      department: departmentName,
      items: returnItems,
      notes,
      returnDate,
      supplier: type === 'outward' ? selectedSupplier : undefined,
      timestamp: new Date().toISOString()
    };
    
    console.log('Return submitted:', returnData);
    
    // Reset form
    setReturnItems([]);
    setNotes('');
    setSelectedSupplier('');
    onClose();
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalItems = returnItems.reduce((sum, item) => sum + item.returnQty, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'inward' ? (
              <ArrowLeft className="h-5 w-5 text-blue-600" />
            ) : (
              <ArrowRight className="h-5 w-5 text-orange-600" />
            )}
            Return {type === 'inward' ? 'Inward' : 'Outward'} - {departmentName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Return Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="returnDate">Return Date</Label>
              <Input
                id="returnDate"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            {type === 'outward' && (
              <div>
                <Label>Return to Supplier</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Total Items</Label>
              <div className="p-2 bg-gray-50 rounded border">
                <span className="font-medium">{totalItems} items</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Items */}
            <Card>
              <CardHeader>
                <CardTitle>Available Items</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.sku}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.availableQty} {item.unit}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addReturnItem(item)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Return Items */}
            <Card>
              <CardHeader>
                <CardTitle>Return Items ({returnItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  {returnItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No items selected for return
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {returnItems.map((item) => (
                        <div key={item.sku} className="border rounded p-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.sku}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeReturnItem(item.sku)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                value={item.returnQty}
                                onChange={(e) => updateReturnQuantity(item.sku, Number(e.target.value))}
                                max={item.availableQty}
                                min="1"
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Condition</Label>
                              <Select value={item.condition} onValueChange={(value: any) => updateReturnCondition(item.sku, value)}>
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="good">Good</SelectItem>
                                  <SelectItem value="damaged">Damaged</SelectItem>
                                  <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-xs">Reason</Label>
                            <Select value={item.reason} onValueChange={(value) => updateReturnReason(item.sku, value)}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {returnReasons.map(reason => (
                                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Badge className={getConditionColor(item.condition)}>
                            {item.condition.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes about this return..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={returnItems.length === 0 || (type === 'outward' && !selectedSupplier)}
            >
              Submit Return ({totalItems} items)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnForms;