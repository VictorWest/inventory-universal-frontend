import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Phone, Mail, MapPin, TrendingUp, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  rating: number;
  status: 'active' | 'inactive';
}

interface MarketPriceItem {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  supplier: string;
  location: string;
  lastUpdated: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  unit: string;
}

const VendorsModule: React.FC = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'ABC Suppliers Ltd',
      contactPerson: 'John Smith',
      phone: '+234-801-234-5678',
      email: 'john@abcsuppliers.com',
      address: '123 Business District, Lagos',
      category: 'Electronics',
      rating: 4.5,
      status: 'active'
    }
  ]);

  const [marketPrices, setMarketPrices] = useState<MarketPriceItem[]>([
    {
      id: '1',
      name: 'Laptop Computer',
      category: 'Electronics',
      currentPrice: 450000,
      previousPrice: 420000,
      supplier: 'ABC Suppliers Ltd',
      location: 'Lagos',
      lastUpdated: '2024-01-15',
      availability: 'in-stock',
      unit: 'pcs'
    }
  ]);

  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    category: ''
  });

  const categories = ['Electronics', 'Raw Materials', 'Furniture', 'Stationery', 'Food & Beverages'];

  const addSupplier = () => {
    if (!newSupplier.name || !newSupplier.contactPerson || !newSupplier.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      ...newSupplier,
      rating: 0,
      status: 'active'
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({ name: '', contactPerson: '', phone: '', email: '', address: '', category: '' });
    setShowAddSupplier(false);
    
    toast({ title: "Success", description: "Supplier added successfully." });
  };

  const contactAdmin = (item: MarketPriceItem) => {
    toast({
      title: "Contact Request Sent",
      description: `Admin notified about ${item.name} from ${item.supplier}.`
    });
  };

  const getPriceChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : 'down',
      color: change > 0 ? 'text-red-600' : 'text-green-600'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendors & Suppliers</h2>
          <p className="text-muted-foreground">Manage suppliers and track market prices</p>
        </div>
        <Button onClick={() => setShowAddSupplier(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Suppliers</p>
                <p className="text-2xl font-bold">{suppliers.filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Market Items</p>
                <p className="text-2xl font-bold">{marketPrices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Suppliers List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="border rounded p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{supplier.name}</h4>
                      <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                    </div>
                    <Badge className={supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {supplier.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span>{supplier.email}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{supplier.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketPrices.map((item) => {
                const priceChange = getPriceChange(item.currentPrice, item.previousPrice);
                return (
                  <div key={item.id} className="border rounded p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.supplier} - {item.location}</p>
                      </div>
                      <Badge className={item.availability === 'in-stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {item.availability.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold">₦{item.currentPrice.toLocaleString()}</p>
                        <p className={`text-sm ${priceChange.color}`}>
                          {priceChange.direction === 'up' ? '↑' : '↓'} {priceChange.percentage}%
                        </p>
                      </div>
                      <Button size="sm" onClick={() => contactAdmin(item)}>
                        Contact Admin
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddSupplier} onOpenChange={setShowAddSupplier}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Supplier Name *</Label>
                <Input
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <Label>Contact Person *</Label>
                <Input
                  value={newSupplier.contactPerson}
                  onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
                  placeholder="Enter contact person"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone *</Label>
                <Input
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                placeholder="Enter full address"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select 
                value={newSupplier.category} 
                onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddSupplier(false)}>
                Cancel
              </Button>
              <Button onClick={addSupplier}>
                Add Supplier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorsModule;