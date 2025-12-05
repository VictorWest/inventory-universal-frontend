import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings } from 'lucide-react';

interface ThresholdSetting {
  id: string;
  itemName: string;
  currentStock: number;
  reorderLevel: number;
  minStockLevel: number;
  maxStockLevel: number;
  autoAlerts: boolean;
  status: 'normal' | 'low' | 'critical';
}

const ThresholdSettings: React.FC = () => {
  const [thresholds, setThresholds] = useState<ThresholdSetting[]>([
    {
      id: '1',
      itemName: 'Paracetamol Tablets',
      currentStock: 50,
      reorderLevel: 100,
      minStockLevel: 20,
      maxStockLevel: 500,
      autoAlerts: true,
      status: 'critical'
    },
    {
      id: '2',
      itemName: 'Coca Cola 50cl',
      currentStock: 150,
      reorderLevel: 100,
      minStockLevel: 50,
      maxStockLevel: 300,
      autoAlerts: true,
      status: 'normal'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    reorderLevel: '',
    minStockLevel: '',
    maxStockLevel: '',
    autoAlerts: false
  });

  const handleEdit = (threshold: ThresholdSetting) => {
    setEditingId(threshold.id);
    setEditForm({
      reorderLevel: threshold.reorderLevel.toString(),
      minStockLevel: threshold.minStockLevel.toString(),
      maxStockLevel: threshold.maxStockLevel.toString(),
      autoAlerts: threshold.autoAlerts
    });
  };

  const handleSave = () => {
    if (!editingId) return;

    const updatedThresholds = thresholds.map(t => {
      if (t.id === editingId) {
        const updated = {
          ...t,
          reorderLevel: parseInt(editForm.reorderLevel),
          minStockLevel: parseInt(editForm.minStockLevel),
          maxStockLevel: parseInt(editForm.maxStockLevel),
          autoAlerts: editForm.autoAlerts
        };
        
        // Update status based on current stock
        if (updated.currentStock <= updated.minStockLevel) {
          updated.status = 'critical';
        } else if (updated.currentStock <= updated.reorderLevel) {
          updated.status = 'low';
        } else {
          updated.status = 'normal';
        }
        
        return updated;
      }
      return t;
    });

    setThresholds(updatedThresholds);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ reorderLevel: '', minStockLevel: '', maxStockLevel: '', autoAlerts: false });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'low':
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge variant="default">Normal</Badge>;
    }
  };

  const criticalItems = thresholds.filter(t => t.status === 'critical').length;
  const lowStockItems = thresholds.filter(t => t.status === 'low').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Items</p>
                <p className="text-2xl font-bold text-red-600">{criticalItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">{thresholds.length}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Threshold Settings</CardTitle>
          <CardDescription>Configure stock levels and alerts for inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Max Stock</TableHead>
                <TableHead>Auto Alerts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {thresholds.map((threshold) => (
                <TableRow key={threshold.id}>
                  <TableCell className="font-medium">{threshold.itemName}</TableCell>
                  <TableCell>{threshold.currentStock}</TableCell>
                  <TableCell>
                    {editingId === threshold.id ? (
                      <Input
                        type="number"
                        value={editForm.reorderLevel}
                        onChange={(e) => setEditForm(prev => ({ ...prev, reorderLevel: e.target.value }))}
                        className="w-20"
                      />
                    ) : (
                      threshold.reorderLevel
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === threshold.id ? (
                      <Input
                        type="number"
                        value={editForm.minStockLevel}
                        onChange={(e) => setEditForm(prev => ({ ...prev, minStockLevel: e.target.value }))}
                        className="w-20"
                      />
                    ) : (
                      threshold.minStockLevel
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === threshold.id ? (
                      <Input
                        type="number"
                        value={editForm.maxStockLevel}
                        onChange={(e) => setEditForm(prev => ({ ...prev, maxStockLevel: e.target.value }))}
                        className="w-20"
                      />
                    ) : (
                      threshold.maxStockLevel
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === threshold.id ? (
                      <Switch
                        checked={editForm.autoAlerts}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, autoAlerts: checked }))}
                      />
                    ) : (
                      <Switch checked={threshold.autoAlerts} disabled />
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(threshold.status)}</TableCell>
                  <TableCell>
                    {editingId === threshold.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(threshold)}>
                        Edit
                      </Button>
                    )}
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

export default ThresholdSettings;