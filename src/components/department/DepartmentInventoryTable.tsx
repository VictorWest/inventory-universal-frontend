import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Package, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface InventoryItem {
  sku: string;
  itemName: string;
  opening: number;
  added: number;
  total: number;
  out: number;
  closing: number;
  unit: string;
  costPrice: number;
  sellingPrice?: number;
  category: string;
}

interface DepartmentInventoryTableProps {
  items: InventoryItem[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showPrices?: boolean;
  onItemClick?: (item: InventoryItem) => void;
}

const DepartmentInventoryTable: React.FC<DepartmentInventoryTableProps> = ({
  items,
  searchTerm,
  onSearchChange,
  showPrices = true,
  onItemClick
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (closing: number) => {
    if (closing === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (closing < 10) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    if (onItemClick) onItemClick(item);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Department Inventory
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by item name or SKU..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-center">Opening</TableHead>
                  <TableHead className="text-center">Added</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Out</TableHead>
                  <TableHead className="text-center">Closing</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  {showPrices && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => {
                  const stockStatus = getStockStatus(item.closing);
                  return (
                    <TableRow 
                      key={index} 
                      className={showPrices ? "cursor-pointer hover:bg-muted/50" : ""}
                      onClick={() => showPrices && handleItemClick(item)}
                    >
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell className="text-center">{item.opening}</TableCell>
                      <TableCell className="text-center">
                        {item.added > 0 && (
                          <span className="text-green-600 flex items-center justify-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            +{item.added}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">{item.total}</TableCell>
                      <TableCell className="text-center">
                        {item.out > 0 && (
                          <span className="text-red-600 flex items-center justify-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            -{item.out}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold">{item.closing}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      {showPrices && (
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleItemClick(item)}>
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No items found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Item Details - {selectedItem.itemName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SKU</p>
                  <p className="font-mono">{selectedItem.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cost Price</p>
                  <p className="font-bold text-green-600">₦{selectedItem.costPrice.toLocaleString()}</p>
                </div>
                {selectedItem.sellingPrice && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Selling Price</p>
                    <p className="font-bold text-blue-600">₦{selectedItem.sellingPrice.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Stock</p>
                  <p className="font-bold">{selectedItem.closing} {selectedItem.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Status</p>
                  <Badge className={getStockStatus(selectedItem.closing).color}>
                    {getStockStatus(selectedItem.closing).status}
                  </Badge>
                </div>
              </div>
              
              {selectedItem.sellingPrice && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
                  <p className="font-bold text-purple-600">
                    ₦{(selectedItem.sellingPrice - selectedItem.costPrice).toLocaleString()}
                    {' '}({(((selectedItem.sellingPrice - selectedItem.costPrice) / selectedItem.costPrice) * 100).toFixed(1)}%)
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DepartmentInventoryTable;