import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, DollarSign, Eye } from 'lucide-react';
import SettlementHistory from '@/components/creditors/SettlementHistory';
import { GET_CREDITORS_LIST, ADD_CREDITOR, UPDATE_CREDITOR } from '@/shared/constants';

interface SettlementRecord {
  id: string;
  amount: number;
  date: string;
  method: 'Cash' | 'POS' | 'Transfer' | 'Cheque';
  reference?: string;
  recordedBy: string;
  notes?: string;
}

interface Creditor {
  id: string;
  supplierName: string;
  originalAmount: number;
  remainingBalance: number;
  creationDate: string;
  status: 'Unpaid' | 'Partially Paid' | 'Fully Paid';
  settlementHistory: SettlementRecord[];
}

const CreditorsModule: React.FC = () => {
  const [creditors, setCreditors] = useState<Creditor[]>([]);

  const [selectedCreditor, setSelectedCreditor] = useState<Creditor | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<Creditor | null>(null);
  const [refreshItems, setRefreshItems] = useState(false)
  const [isAddingCreditor, setIsAddingCreditor] = useState(false);
  const [newCreditorName, setNewCreditorName] = useState('');
  const [newCreditorAmount, setNewCreditorAmount] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch(GET_CREDITORS_LIST)

      if (response.ok){
        const { data } = await response.json()
        // Normalize numeric fields coming from backend (sometimes sent as strings)
        const normalized = (data || []).map((c: any) => {
          const settlements = (c.settlementHistory || []).map((s: any) => ({
            ...s,
            amount: Number(s.amount) || 0
          }));

          const originalAmount = Number(c.originalAmount) || 0;
          const totalPaid = settlements.reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0);
          const remainingBalance = Number(c.remainingBalance) || Math.max(0, originalAmount - totalPaid);

          return {
            ...c,
            originalAmount,
            remainingBalance,
            settlementHistory: settlements,
            // keep status in sync if backend didn't
            status: remainingBalance === 0 ? 'Fully Paid' : (totalPaid > 0 ? 'Partially Paid' : 'Unpaid')
          } as Creditor;
        });

        setCreditors(normalized)
      }
    })()
  }, [refreshItems])

  const getTotalPaid = (creditor: Creditor) => {
    const arr = creditor.settlementHistory || [];
    return arr.reduce((sum, settlement) => sum + Number(settlement.amount || 0), 0);
  };

  const getRemainingBalance = (creditor: Creditor) => {
    return creditor.originalAmount - getTotalPaid(creditor);
  };

  const handleRecordPayment = async () => {
    if (!selectedCreditor || !paymentAmount || !paymentMethod) return;

    const amount = parseFloat(paymentAmount);

    const payment = {
          originalBalance: selectedCreditor.originalAmount,
          remainingBalance: selectedCreditor.remainingBalance - amount,
          method: paymentMethod,
          reference: paymentReference || undefined,
          notes: paymentNotes || undefined
        }
    try {
      // POST settlement to backend
      const resp = await fetch(UPDATE_CREDITOR(selectedCreditor.supplierName), {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Settlement failed', text);
        alert('Failed to record settlement');
        return;
      }

      // Refresh creditors from backend
      const listResp = await fetch(GET_CREDITORS_LIST, { credentials: 'include' });
      if (listResp.ok) {
        const { data } = await listResp.json();
        setCreditors(data);
      } else {
        setRefreshItems(prev => !prev);
      }

      setIsSettling(false);
      setPaymentAmount('');
      setPaymentMethod('');
      setPaymentReference('');
      setPaymentNotes('');
      setSelectedCreditor(null);
    } catch (err) {
      console.error(err);
      alert('Error recording settlement');
    }
  };

  const handleAddCreditor = async () => {
    if (!newCreditorName || !newCreditorAmount) return;

    try {
      const resp = await fetch(ADD_CREDITOR, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supplierName: newCreditorName,
          originalAmount: parseFloat(newCreditorAmount),
          creationDate: new Date().toISOString().split('T')[0]
        })
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Add creditor failed', text);
        alert('Failed to add creditor');
        return;
      }

      // Refresh creditors from backend
      const listResp = await fetch(GET_CREDITORS_LIST, { credentials: 'include' });
      if (listResp.ok) {
        const { data } = await listResp.json();
        setCreditors(data);
      } else {
        setRefreshItems(prev => !prev);
      }

      setIsAddingCreditor(false);
      setNewCreditorName('');
      setNewCreditorAmount('');
    } catch (err) {
      console.error(err);
      alert('Error adding creditor');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Fully Paid':
        return <Badge className="bg-green-100 text-green-800">Fully Paid</Badge>;
      case 'Partially Paid':
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Paid</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Unpaid</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Creditors Management</h2>
          <p className="text-gray-600">Track and manage outstanding balances owed to suppliers</p>
        </div>
        <Dialog open={isAddingCreditor} onOpenChange={setIsAddingCreditor}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Creditor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Creditor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="creditor-name">Supplier/Vendor Name</Label>
                <Input
                  id="creditor-name"
                  placeholder="Enter supplier name"
                  value={newCreditorName}
                  onChange={(e) => setNewCreditorName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="creditor-amount">Amount Owed</Label>
                <Input
                  id="creditor-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={newCreditorAmount}
                  onChange={(e) => setNewCreditorAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCreditor} className="w-full">
                Add Creditor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Creditors</CardTitle>
          <CardDescription>All outstanding balances owed to suppliers and vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier/Vendor Name</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remaining Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creditors?.map((creditor) => (
                <React.Fragment key={creditor.id}>
                  <TableRow>
                    <TableCell className="font-medium">{creditor.supplierName}</TableCell>
                    <TableCell>₦{creditor.originalAmount.toLocaleString()}</TableCell>
                    <TableCell>{creditor.creationDate}</TableCell>
                    <TableCell>{getStatusBadge(creditor.status)}</TableCell>
                    <TableCell className="font-semibold">
                      ₦{creditor.remainingBalance?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewingHistory(creditor)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedCreditor(creditor);
                            setIsSettling(true);
                          }}
                          disabled={creditor.status === 'Fully Paid'}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* {viewingHistory?.id === creditor.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <SettlementHistory 
                          settlements={creditor.settlementHistory}
                          totalAmount={creditor.originalAmount}
                          remainingBalance={getRemainingBalance(creditor)}
                        />
                      </TableCell>
                    </TableRow>
                  )} */}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isSettling} onOpenChange={setIsSettling}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Supplier: {selectedCreditor?.supplierName}</Label>
              <p className="text-sm text-gray-600">
                Outstanding Balance: ₦{selectedCreditor ? getRemainingBalance(selectedCreditor).toLocaleString() : 0}
              </p>
            </div>
            <div>
              <Label htmlFor="payment-amount">Payment Amount</Label>
              <Input
                id="payment-amount"
                type="number"
                placeholder="Enter payment amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="POS">POS</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment-reference">Reference (Optional)</Label>
              <Input
                id="payment-reference"
                placeholder="Enter reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment-notes">Notes (Optional)</Label>
              <Input
                id="payment-notes"
                placeholder="Enter payment notes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
            <Button onClick={handleRecordPayment} className="w-full">
              Record Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditorsModule;