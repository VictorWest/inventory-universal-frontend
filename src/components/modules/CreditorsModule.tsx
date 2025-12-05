import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Eye } from 'lucide-react';
import SettlementHistory from '@/components/creditors/SettlementHistory';

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
  creationDate: string;
  status: 'Unpaid' | 'Partially Paid' | 'Fully Paid';
  settlementHistory: SettlementRecord[];
}

const CreditorsModule: React.FC = () => {
  const [creditors, setCreditors] = useState<Creditor[]>([
    {
      id: '1',
      supplierName: 'ABC Food Supplies',
      originalAmount: 50000,
      creationDate: '2024-01-10',
      status: 'Partially Paid',
      settlementHistory: [
        { id: '1', amount: 20000, date: '2024-01-15', method: 'Transfer', reference: 'TXN123456', recordedBy: 'Procurement Officer' }
      ]
    },
    {
      id: '2',
      supplierName: 'XYZ Equipment Ltd',
      originalAmount: 75000,
      creationDate: '2024-01-12',
      status: 'Unpaid',
      settlementHistory: []
    }
  ]);

  const [selectedCreditor, setSelectedCreditor] = useState<Creditor | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<Creditor | null>(null);

  const getTotalPaid = (creditor: Creditor) => {
    return creditor.settlementHistory.reduce((sum, settlement) => sum + settlement.amount, 0);
  };

  const getRemainingBalance = (creditor: Creditor) => {
    return creditor.originalAmount - getTotalPaid(creditor);
  };

  const handleRecordPayment = () => {
    if (!selectedCreditor || !paymentAmount || !paymentMethod) return;

    const amount = parseFloat(paymentAmount);
    const newSettlement: SettlementRecord = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod as 'Cash' | 'POS' | 'Transfer' | 'Cheque',
      reference: paymentReference || undefined,
      recordedBy: 'Procurement Officer',
      notes: paymentNotes || undefined
    };

    const updatedCreditors = creditors.map(c => {
      if (c.id === selectedCreditor.id) {
        const updatedSettlementHistory = [...c.settlementHistory, newSettlement];
        const totalPaid = updatedSettlementHistory.reduce((sum, s) => sum + s.amount, 0);
        const newStatus = totalPaid >= c.originalAmount ? 'Fully Paid' : 
                         totalPaid > 0 ? 'Partially Paid' : 'Unpaid';
        
        return {
          ...c,
          settlementHistory: updatedSettlementHistory,
          status: newStatus as 'Unpaid' | 'Partially Paid' | 'Fully Paid'
        };
      }
      return c;
    });

    setCreditors(updatedCreditors);
    setIsSettling(false);
    setPaymentAmount('');
    setPaymentMethod('');
    setPaymentReference('');
    setPaymentNotes('');
    setSelectedCreditor(null);
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
              {creditors.map((creditor) => (
                <React.Fragment key={creditor.id}>
                  <TableRow>
                    <TableCell className="font-medium">{creditor.supplierName}</TableCell>
                    <TableCell>₦{creditor.originalAmount.toLocaleString()}</TableCell>
                    <TableCell>{creditor.creationDate}</TableCell>
                    <TableCell>{getStatusBadge(creditor.status)}</TableCell>
                    <TableCell className="font-semibold">
                      ₦{getRemainingBalance(creditor).toLocaleString()}
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
                  {viewingHistory?.id === creditor.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <SettlementHistory 
                          settlements={creditor.settlementHistory}
                          totalAmount={creditor.originalAmount}
                          remainingBalance={getRemainingBalance(creditor)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
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