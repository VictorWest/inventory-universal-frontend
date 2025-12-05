import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface UOM {
  id: string;
  name: string;
  abbreviation: string;
  category: string;
  baseUnit?: string;
  conversionFactor?: number;
  description: string;
}

const UOMConfiguration: React.FC = () => {
  const [uoms, setUoms] = useState<UOM[]>([
    {
      id: '1',
      name: 'Pieces',
      abbreviation: 'pcs',
      category: 'Count',
      description: 'Individual items'
    },
    {
      id: '2',
      name: 'Cartons',
      abbreviation: 'ctn',
      category: 'Packaging',
      baseUnit: 'pcs',
      conversionFactor: 12,
      description: '1 carton = 12 pieces'
    },
    {
      id: '3',
      name: 'Kilograms',
      abbreviation: 'kg',
      category: 'Weight',
      description: 'Weight measurement'
    },
    {
      id: '4',
      name: 'Litres',
      abbreviation: 'L',
      category: 'Volume',
      description: 'Volume measurement'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    abbreviation: '',
    category: '',
    baseUnit: '',
    conversionFactor: '',
    description: ''
  });

  const categories = ['Count', 'Weight', 'Volume', 'Length', 'Area', 'Packaging', 'Time'];

  const handleCreate = () => {
    if (!formData.name || !formData.abbreviation || !formData.category) return;

    const newUOM: UOM = {
      id: Date.now().toString(),
      name: formData.name,
      abbreviation: formData.abbreviation,
      category: formData.category,
      baseUnit: formData.baseUnit || undefined,
      conversionFactor: formData.conversionFactor ? parseFloat(formData.conversionFactor) : undefined,
      description: formData.description
    };

    setUoms([...uoms, newUOM]);
    setIsCreating(false);
    resetForm();
  };

  const handleEdit = (uom: UOM) => {
    setEditingId(uom.id);
    setFormData({
      name: uom.name,
      abbreviation: uom.abbreviation,
      category: uom.category,
      baseUnit: uom.baseUnit || '',
      conversionFactor: uom.conversionFactor?.toString() || '',
      description: uom.description
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;

    const updatedUOMs = uoms.map(u => {
      if (u.id === editingId) {
        return {
          ...u,
          name: formData.name,
          abbreviation: formData.abbreviation,
          category: formData.category,
          baseUnit: formData.baseUnit || undefined,
          conversionFactor: formData.conversionFactor ? parseFloat(formData.conversionFactor) : undefined,
          description: formData.description
        };
      }
      return u;
    });

    setUoms(updatedUOMs);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setUoms(uoms.filter(u => u.id !== id));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      abbreviation: '',
      category: '',
      baseUnit: '',
      conversionFactor: '',
      description: ''
    });
  };

  const baseUnits = uoms.filter(u => !u.baseUnit).map(u => u.abbreviation);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Unit of Measurement Configuration</h3>
          <p className="text-sm text-gray-600">Create and manage units of measurement with conversion settings</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add UOM
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Unit of Measurement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Cartons"
                  />
                </div>
                <div>
                  <Label htmlFor="abbreviation">Abbreviation</Label>
                  <Input
                    id="abbreviation"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData(prev => ({ ...prev, abbreviation: e.target.value }))}
                    placeholder="e.g., ctn"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="baseUnit">Base Unit (Optional)</Label>
                  <Select value={formData.baseUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, baseUnit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select base unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {baseUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="conversionFactor">Conversion Factor</Label>
                  <Input
                    id="conversionFactor"
                    type="number"
                    value={formData.conversionFactor}
                    onChange={(e) => setFormData(prev => ({ ...prev, conversionFactor: e.target.value }))}
                    placeholder="e.g., 12"
                    disabled={!formData.baseUnit}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., 1 carton = 12 bottles"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create UOM</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Units of Measurement</CardTitle>
          <CardDescription>Manage all units of measurement and their conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Abbreviation</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uoms.map((uom) => (
                <TableRow key={uom.id}>
                  <TableCell className="font-medium">{uom.name}</TableCell>
                  <TableCell>{uom.abbreviation}</TableCell>
                  <TableCell>{uom.category}</TableCell>
                  <TableCell>
                    {uom.baseUnit && uom.conversionFactor 
                      ? `1 ${uom.abbreviation} = ${uom.conversionFactor} ${uom.baseUnit}`
                      : 'Base unit'
                    }
                  </TableCell>
                  <TableCell>{uom.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(uom)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(uom.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Unit of Measurement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-abbreviation">Abbreviation</Label>
                <Input
                  id="edit-abbreviation"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData(prev => ({ ...prev, abbreviation: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-baseUnit">Base Unit (Optional)</Label>
                <Select value={formData.baseUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, baseUnit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {baseUnits.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-conversionFactor">Conversion Factor</Label>
                <Input
                  id="edit-conversionFactor"
                  type="number"
                  value={formData.conversionFactor}
                  onChange={(e) => setFormData(prev => ({ ...prev, conversionFactor: e.target.value }))}
                  disabled={!formData.baseUnit}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
              <Button onClick={handleUpdate}>Update UOM</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UOMConfiguration;