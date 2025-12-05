import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventoryList from '@/components/inventory/InventoryList';
import ThresholdSettings from '@/components/inventory/ThresholdSettings';
import UOMConfiguration from '@/components/inventory/UOMConfiguration';
import WriteOffRequests from '@/components/inventory/WriteOffRequests';
import CategoryManagement from '@/components/inventory/CategoryManagement';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings, DollarSign, Package, AlertTriangle, Ruler, Trash2, Tags } from 'lucide-react';

const InventoryModule: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState('NGN');
  const [currencySymbol, setCurrencySymbol] = useState('₦');
  const [isEditingCurrency, setIsEditingCurrency] = useState(false);

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (currency) {
      setBaseCurrency(currency.code);
      setCurrencySymbol(currency.symbol);
      setIsEditingCurrency(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-gray-600">Manage your inventory items, settings, and configurations</p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="threshold">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Thresholds
          </TabsTrigger>
          <TabsTrigger value="uom">
            <Ruler className="h-4 w-4 mr-2" />
            UOM
          </TabsTrigger>
          <TabsTrigger value="writeoff">
            <Trash2 className="h-4 w-4 mr-2" />
            Write-Off
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tags className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="currency">
            <DollarSign className="h-4 w-4 mr-2" />
            Currency
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <InventoryList />
        </TabsContent>
        
        <TabsContent value="threshold">
          <Card>
            <CardHeader>
              <CardTitle>Threshold Settings</CardTitle>
              <CardDescription>Configure reorder levels and stock thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <ThresholdSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="uom">
          <Card>
            <CardHeader>
              <CardTitle>Unit of Measurement Configuration</CardTitle>
              <CardDescription>Manage units of measurement and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <UOMConfiguration />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="writeoff">
          <Card>
            <CardHeader>
              <CardTitle>Write-Off Requests</CardTitle>
              <CardDescription>Manage damaged stock write-off requests</CardDescription>
            </CardHeader>
            <CardContent>
              <WriteOffRequests />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Manage inventory and supplier categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Base Currency Configuration</span>
              </CardTitle>
              <CardDescription>Configure the default currency for your system (Super Admin only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Current Base Currency</h4>
                    <p className="text-lg font-bold text-blue-600">
                      {currencySymbol} - {currencies.find(c => c.code === baseCurrency)?.name}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditingCurrency(!isEditingCurrency)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              </div>
              
              {isEditingCurrency && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="currency-select">Select New Base Currency</Label>
                    <Select value={baseCurrency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger id="currency-select">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency.code} value={currency.code || 'default'}>
                            {currency.symbol} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning:</strong> Changing the base currency will affect all pricing throughout the system. 
                      This action should only be performed by the Super Admin.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => setIsEditingCurrency(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={() => handleCurrencyChange(baseCurrency)}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryModule;