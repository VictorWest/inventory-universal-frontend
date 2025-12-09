import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Settings } from 'lucide-react';
import { ADD_THRESHOLD, deleteThresholdsList, GET_THRESHOLDS_LIST } from '@/shared/constants';

interface ThresholdSetting {
  id: string;
  itemName: string;
  currentStock: number;
  reorderLevel: number;
  minStock: number;
  maxStock: number;
  autoAlerts: boolean;
  status: 'normal' | 'low' | 'critical';
}

const ThresholdSettings: React.FC = () => {
  const [thresholds, setThresholds] = useState<ThresholdSetting[]>([]);
  const [refreshItems, setRefreshItems] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    reorderLevel: '',
    minStock: '',
    maxStock: '',
    autoAlerts: false
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(GET_THRESHOLDS_LIST)

      if (response.ok){
        const { data } = await response.json()
        setThresholds(data)
      }
    })()
  }, [refreshItems])
  

  const handleEdit = (threshold: ThresholdSetting) => {
    setEditingId(threshold.id);
    setEditForm({
      reorderLevel: threshold.reorderLevel.toString(),
      minStock: threshold.minStock.toString(),
      maxStock: threshold.maxStock.toString(),
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
          minStock: parseInt(editForm.minStock),
          maxStock: parseInt(editForm.maxStock),
          autoAlerts: editForm.autoAlerts
        };
        
        // Update status based on current stock
        if (updated.currentStock <= updated.minStock) {
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

  useEffect(() => {
    (async () => {
      thresholds.forEach(async (item, index) => {
        const response = await fetch(deleteThresholdsList(index), {
          method: "DELETE"
        })
      })

      const response = await fetch (ADD_THRESHOLD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(thresholds)
      })
      
    })()
  }, [thresholds])

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ reorderLevel: '', minStock: '', maxStock: '', autoAlerts: false });
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
                        value={editForm.minStock}
                        onChange={(e) => setEditForm(prev => ({ ...prev, minStock: e.target.value }))}
                        className="w-20"
                      />
                    ) : (
                      threshold.minStock
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === threshold.id ? (
                      <Input
                        type="number"
                        value={editForm.maxStock}
                        onChange={(e) => setEditForm(prev => ({ ...prev, maxStock: e.target.value }))}
                        className="w-20"
                      />
                    ) : (
                      threshold.maxStock
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