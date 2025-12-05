import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Edit } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  currentSale?: string;
}

interface TableManagementProps {
  onTableSelect: (table: Table) => void;
  selectedTable?: Table;
}

const TableManagement: React.FC<TableManagementProps> = ({ onTableSelect, selectedTable }) => {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', name: 'Table 1', capacity: 4, status: 'available' },
    { id: '2', name: 'Table 2', capacity: 2, status: 'occupied', currentSale: 'SALE-001' },
    { id: '3', name: 'VIP Table', capacity: 6, status: 'available' },
    { id: '4', name: 'Booth 1', capacity: 4, status: 'reserved' },
    { id: '5', name: 'Bar Counter', capacity: 8, status: 'available' },
  ]);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [isAddingTable, setIsAddingTable] = useState(false);

  const addTable = () => {
    if (newTableName.trim()) {
      const newTable: Table = {
        id: Date.now().toString(),
        name: newTableName,
        capacity: newTableCapacity,
        status: 'available'
      };
      setTables([...tables, newTable]);
      setNewTableName('');
      setNewTableCapacity(4);
      setIsAddingTable(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'occupied': return 'destructive';
      case 'reserved': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Table Management</CardTitle>
          <Dialog open={isAddingTable} onOpenChange={setIsAddingTable}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input
                    id="tableName"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="e.g., Table 1, VIP Booth"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newTableCapacity}
                    onChange={(e) => setNewTableCapacity(Number(e.target.value))}
                    min="1"
                    max="20"
                  />
                </div>
                <Button onClick={addTable} className="w-full">
                  Add Table
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <Button
              key={table.id}
              variant={selectedTable?.id === table.id ? 'default' : 'outline'}
              className="h-20 flex flex-col justify-center relative"
              onClick={() => onTableSelect(table)}
              disabled={table.status === 'occupied' && selectedTable?.id !== table.id}
            >
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(table.status)}`} />
              <span className="font-medium">{table.name}</span>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Users className="h-3 w-3 mr-1" />
                {table.capacity}
              </div>
              <Badge variant={getStatusVariant(table.status)} className="mt-1 text-xs">
                {table.status}
              </Badge>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TableManagement;