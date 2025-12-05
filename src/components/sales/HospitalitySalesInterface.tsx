import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Receipt, Users, Coffee } from 'lucide-react';
import TableManagement from './TableManagement';
import DirectSalesInterface from './DirectSalesInterface';
import PaymentModal from './PaymentModal';

interface SaleItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  status: 'active' | 'voided' | 'cancelled' | 'complimentary';
  discount?: number;
  reason?: string;
}

interface Sale {
  id: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  table?: string;
  waiter?: string;
  customer?: string;
  status: 'pending' | 'completed' | 'voided';
  paymentMethod?: string;
  timestamp: Date;
}

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentSale?: string;
}

interface HospitalitySalesInterfaceProps {
  onSaleComplete: (sale: Sale) => void;
}

const HospitalitySalesInterface: React.FC<HospitalitySalesInterfaceProps> = ({ onSaleComplete }) => {
  const [salesMode, setSalesMode] = useState<'table' | 'direct'>('table');
  const [currentSale, setCurrentSale] = useState<Sale>({
    id: `SALE-${Date.now()}`,
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    status: 'pending',
    timestamp: new Date()
  });
  const [selectedTable, setSelectedTable] = useState<Table | undefined>();
  const [waiterName, setWaiterName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const addItem = (item: any) => {
    const existingItem = currentSale.items.find(i => i.id === item.id);
    
    if (existingItem && existingItem.status === 'active') {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      const newItem: SaleItem = {
        id: item.id,
        sku: item.sku || item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        total: item.price,
        status: 'active'
      };
      
      const updatedItems = [...currentSale.items, newItem];
      updateSale(updatedItems);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const updatedItems = currentSale.items.map(item => 
      item.id === itemId && item.status === 'active'
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    );
    
    updateSale(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = currentSale.items.filter(item => item.id !== itemId);
    updateSale(updatedItems);
  };

  const updateSale = (items: SaleItem[]) => {
    const activeItems = items.filter(item => item.status === 'active');
    const subtotal = activeItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - currentSale.discount;
    
    setCurrentSale({
      ...currentSale,
      items,
      subtotal,
      total: Math.max(0, total)
    });
  };

  const handleItemAction = (itemId: string, action: string, reason?: string) => {
    const updatedItems = currentSale.items.map(item => 
      item.id === itemId 
        ? { ...item, status: action as any, reason }
        : item
    );
    
    updateSale(updatedItems);
  };

  const handlePayment = (paymentData: any) => {
    const completedSale: Sale = {
      ...currentSale,
      status: 'completed',
      paymentMethod: paymentData.method,
      table: selectedTable?.name,
      waiter: waiterName,
      customer: customerName
    };
    
    onSaleComplete(completedSale);
    
    if (paymentData.printReceipt) {
      console.log('Printing receipt...');
    }
    
    resetSale();
  };

  const resetSale = () => {
    setCurrentSale({
      id: `SALE-${Date.now()}`,
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      status: 'pending',
      timestamp: new Date()
    });
    setSelectedTable(undefined);
    setWaiterName('');
    setCustomerName('');
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Hospitality Sales Point</h2>
          <p className="text-muted-foreground">
            Sale ID: {currentSale.id}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={currentSale.status === 'pending' ? 'default' : 'secondary'}>
            {currentSale.status.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            {currentSale.items.filter(i => i.status === 'active').length} Items
          </Badge>
        </div>
      </div>

      <Tabs value={salesMode} onValueChange={(value) => setSalesMode(value as 'table' | 'direct')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">
            <Users className="h-4 w-4 mr-2" />
            Table-Based Sales
          </TabsTrigger>
          <TabsTrigger value="direct">
            <Coffee className="h-4 w-4 mr-2" />
            Direct Sales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TableManagement
                onTableSelect={handleTableSelect}
                selectedTable={selectedTable}
              />
              <DirectSalesInterface
                items={currentSale.items}
                onAddItem={addItem}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onItemAction={handleItemAction}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Sale Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTable && (
                    <div>
                      <p className="text-sm font-medium">Table: {selectedTable.name}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₦{currentSale.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-₦{currentSale.discount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₦{currentSale.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => setIsPaymentModalOpen(true)}
                      disabled={currentSale.items.filter(i => i.status === 'active').length === 0 || !selectedTable}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Settle Table
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetSale}
                      disabled={currentSale.items.length === 0}
                    >
                      Clear Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="direct" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DirectSalesInterface
                items={currentSale.items}
                onAddItem={addItem}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onItemAction={handleItemAction}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Sale Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₦{currentSale.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>-₦{currentSale.discount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₦{currentSale.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => setIsPaymentModalOpen(true)}
                      disabled={currentSale.items.filter(i => i.status === 'active').length === 0}
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      Process Payment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetSale}
                      disabled={currentSale.items.length === 0}
                    >
                      Clear Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPayment={handlePayment}
        saleData={{
          subtotal: currentSale.subtotal,
          discount: currentSale.discount,
          total: currentSale.total,
          items: currentSale.items,
          table: selectedTable?.name,
          waiter: waiterName,
          customer: customerName
        }}
      />
    </div>
  );
};

export default HospitalitySalesInterface;