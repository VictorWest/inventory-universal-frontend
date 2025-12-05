import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIndustryFeatures } from '@/hooks/useIndustryConfig';
import { Plus } from 'lucide-react';

interface AddItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ isOpen, onClose, onAdd }) => {
  const industryFeatures = useIndustryFeatures();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unit: '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    expiry: '',
    batch: '',
    barcode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;
    
    const newItem = {
      id: Date.now().toString(),
      ...formData,
      sellingPrice: industryFeatures.hasSellingPrice ? formData.sellingPrice : undefined,
      expiry: industryFeatures.hasExpiryTracking ? formData.expiry : undefined,
      batch: industryFeatures.hasBatchTracking ? formData.batch : undefined
    };
    
    onAdd(newItem);
    setFormData({
      sku: '',
      name: '',
      category: '',
      unit: '',
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      expiry: '',
      batch: '',
      barcode: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                placeholder="Enter SKU"
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter item name"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {industryFeatures.categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {industryFeatures.uoms.map(uom => (
                    <SelectItem key={uom} value={uom}>{uom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="costPrice">Cost Price</Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({...formData, costPrice: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
            {industryFeatures.hasSellingPrice && (
              <div>
                <Label htmlFor="sellingPrice">Selling Price</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
            )}
            <div>
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                placeholder="0"
              />
            </div>
          </div>
          
          {(industryFeatures.hasExpiryTracking || industryFeatures.hasBatchTracking) && (
            <div className="grid grid-cols-2 gap-4">
              {industryFeatures.hasBatchTracking && (
                <div>
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={formData.batch}
                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                    placeholder="Enter batch number"
                  />
                </div>
              )}
              {industryFeatures.hasExpiryTracking && (
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={formData.expiry}
                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemForm;