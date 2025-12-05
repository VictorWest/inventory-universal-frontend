import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreItem {
  sku: string;
  itemName: string;
  availableQty: number;
  unit: string;
  costPrice: number;
  category: string;
  storeName: string;
}

interface RequisitionItem {
  item: StoreItem;
  requestedQty: number;
  urgency: 'low' | 'medium' | 'high';
  purpose: string;
}

interface RequisitionFormProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  availableStores: Array<{ id: string; name: string; items: StoreItem[] }>;
  onSubmit: (items: RequisitionItem[], notes: string, expectedDate: string) => void;
}

const RequisitionForm: React.FC<RequisitionFormProps> = ({
  isOpen,
  onClose,
  departmentName,
  availableStores,
  onSubmit
}) => {
  const [selectedStore, setSelectedStore] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const { toast } = useToast();

  const allItems = availableStores.flatMap(store => store.items);
  const storeItems = selectedStore 
    ? availableStores.find(s => s.id === selectedStore)?.items || []
    : allItems;

  const filteredItems = storeItems.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToRequisition = () => {
    if (!selectedItem || quantity <= 0 || !purpose.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an item, enter quantity and purpose",
        variant: "destructive"
      });
      return;
    }

    const existingItem = requisitionItems.find(req => req.item.sku === selectedItem.sku);
    
    if (existingItem) {
      setRequisitionItems(prev => prev.map(req => 
        req.item.sku === selectedItem.sku 
          ? { ...req, requestedQty: req.requestedQty + quantity, purpose: purpose || req.purpose }
          : req
      ));
    } else {
      setRequisitionItems(prev => [...prev, {
        item: selectedItem,
        requestedQty: quantity,
        urgency,
        purpose
      }]);
    }

    setSelectedItem(null);
    setQuantity(1);
    setPurpose('');
    setSearchTerm('');
  };

  const handleSubmit = () => {
    if (requisitionItems.length === 0 || !expectedDate) {
      toast({
        title: "Missing Information",
        description: "Please add items and set expected date",
        variant: "destructive"
      });
      return;
    }

    onSubmit(requisitionItems, notes, expectedDate);
    setRequisitionItems([]);
    setNotes('');
    setExpectedDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Make Requisition - {departmentName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredItems.slice(0, 10).map(item => (
                  <div
                    key={`${item.storeName}-${item.sku}`}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedItem?.sku === item.sku ? 'border-primary' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.availableQty} {item.unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedItem && (
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <Label>Purpose</Label>
                    <Input
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="Purpose for requisition"
                    />
                  </div>
                  
                  <Button onClick={addToRequisition} className="w-full">
                    Add to Requisition
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requisition Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Expected Date</Label>
                <Input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                {requisitionItems.map((req, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{req.item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{req.purpose}</p>
                      </div>
                      <p className="font-bold">{req.requestedQty} {req.item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              {requisitionItems.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} className="flex-1">
                      Submit Requisition
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequisitionForm;