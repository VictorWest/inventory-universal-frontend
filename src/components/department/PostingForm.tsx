import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Minus, Plus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostingItem {
  sku: string;
  itemName: string;
  availableQty: number;
  unit: string;
  costPrice: number;
  category: string;
}

interface PostingEntry {
  item: PostingItem;
  quantity: number;
  reason: string;
}

interface PostingFormProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  availableItems: PostingItem[];
  onSubmit: (entries: PostingEntry[], notes: string) => void;
}

const PostingForm: React.FC<PostingFormProps> = ({
  isOpen,
  onClose,
  departmentName,
  availableItems,
  onSubmit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PostingItem | null>(null);
  const [postingEntries, setPostingEntries] = useState<PostingEntry[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const filteredItems = availableItems.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToPosting = () => {
    if (!selectedItem || quantity <= 0) return;
    
    if (quantity > selectedItem.availableQty) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${selectedItem.availableQty} ${selectedItem.unit} available`,
        variant: "destructive"
      });
      return;
    }

    const existingEntry = postingEntries.find(entry => entry.item.sku === selectedItem.sku);
    
    if (existingEntry) {
      const newQty = existingEntry.quantity + quantity;
      if (newQty > selectedItem.availableQty) {
        toast({
          title: "Insufficient Stock",
          description: `Total quantity would exceed available stock`,
          variant: "destructive"
        });
        return;
      }
      
      setPostingEntries(prev => prev.map(entry => 
        entry.item.sku === selectedItem.sku 
          ? { ...entry, quantity: newQty, reason: reason || entry.reason }
          : entry
      ));
    } else {
      setPostingEntries(prev => [...prev, {
        item: selectedItem,
        quantity,
        reason: reason || 'Department usage'
      }]);
    }

    setSelectedItem(null);
    setQuantity(1);
    setReason('');
    setSearchTerm('');
  };

  const removeFromPosting = (sku: string) => {
    setPostingEntries(prev => prev.filter(entry => entry.item.sku !== sku));
  };

  const updateQuantity = (sku: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromPosting(sku);
      return;
    }
    
    setPostingEntries(prev => prev.map(entry => {
      if (entry.item.sku === sku) {
        if (newQty > entry.item.availableQty) {
          toast({
            title: "Insufficient Stock",
            description: `Only ${entry.item.availableQty} ${entry.item.unit} available`,
            variant: "destructive"
          });
          return entry;
        }
        return { ...entry, quantity: newQty };
      }
      return entry;
    }));
  };

  const handleSubmit = () => {
    if (postingEntries.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please add items to post",
        variant: "destructive"
      });
      return;
    }

    onSubmit(postingEntries, notes);
    setPostingEntries([]);
    setNotes('');
    onClose();
  };

  const totalValue = postingEntries.reduce((sum, entry) => 
    sum + (entry.item.costPrice * entry.quantity), 0
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Manual Usage Posting - {departmentName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Item Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredItems.map(item => (
                  <div
                    key={item.sku}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedItem?.sku === item.sku ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{item.sku}</p>
                        <Badge variant="outline" className="mt-1">{item.category}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.availableQty} {item.unit}</p>
                        <p className="text-sm text-muted-foreground">₦{item.costPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedItem && (
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <Label>Quantity to Post</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                        min="1"
                        max={selectedItem.availableQty}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(selectedItem.availableQty, quantity + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">{selectedItem.unit}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Reason (Optional)</Label>
                    <Input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g., Kitchen usage, Cleaning supplies"
                    />
                  </div>
                  
                  <Button onClick={addToPosting} className="w-full">
                    Add to Posting
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posting Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Posting Summary
                <Badge variant="secondary">{postingEntries.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2">
                {postingEntries.map((entry, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{entry.item.itemName}</p>
                        <p className="text-sm text-muted-foreground">{entry.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(entry.item.sku, entry.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-bold">{entry.quantity} {entry.item.unit}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(entry.item.sku, entry.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ₦{(entry.item.costPrice * entry.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {postingEntries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No items selected for posting</p>
                </div>
              )}

              {postingEntries.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Value:</span>
                    <span className="font-bold text-lg">₦{totalValue.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional notes about this posting..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSubmit} className="flex-1">
                      Submit Posting
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

export default PostingForm;