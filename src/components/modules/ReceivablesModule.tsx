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
import PaymentHistory from '@/components/receivables/PaymentHistory';

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: 'Cash' | 'POS' | 'Transfer';
  reference?: string;
  recordedBy: string;
}

interface Receivable {
  id: string;
  cashierName: string;
  customerName: string;
  originalAmount: number;
  creationDate: string;
  status: 'Unsettled' | 'Partially Paid' | 'Fully Paid';
  paymentHistory: PaymentRecord[];
}

const ReceivablesModule: React.FC = () => {
  const [receivables, setReceivables] = useState<Receivable[]>([
    {
      id: '1',
      cashierName: 'John Doe',
      customerName: 'ABC Company',
      originalAmount: 15000,
      creationDate: '2024-01-15',
      status: 'Partially Paid',
      paymentHistory: [
        { id: '1', amount: 5000, date: '2024-01-20', method: 'Cash', recordedBy: 'Super Admin' }
      ]
    },
    {
      id: '2',
      cashierName: 'Jane Smith',
      customerName: 'XYZ Corp',
      originalAmount: 25000,
      creationDate: '2024-01-16',
      status: 'Unsettled',
      paymentHistory: []
    }
  ]);

  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [isSettling, setIsSettling] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<Receivable | null>(null);

  const getTotalPaid = (receivable: Receivable) => {
    return receivable.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getRemainingBalance = (receivable: Receivable) => {
    return receivable.originalAmount - getTotalPaid(receivable);
  };

  const handleRecordPayment = () => {
    if (!selectedReceivable || !paymentAmount || !paymentMethod) return;

    const amount = parseFloat(paymentAmount);
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString().split('T')[0],
      method: paymentMethod as 'Cash' | 'POS' | 'Transfer',
      reference: paymentReference || undefined,
      recordedBy: 'Super Admin'
    };

    const updatedReceivables = receivables.map(r => {
      if (r.id === selectedReceivable.id) {
        const updatedPaymentHistory = [...r.paymentHistory, newPayment];
        const totalPaid = updatedPaymentHistory.reduce((sum, p) => sum + p.amount, 0);
        const newStatus = totalPaid >= r.originalAmount ? 'Fully Paid' : 
                         totalPaid > 0 ? 'Partially Paid' : 'Unsettled';
        
        return {
          ...r,
          paymentHistory: updatedPaymentHistory,
          status: newStatus as 'Unsettled' | 'Partially Paid' | 'Fully Paid'
        };
      }
      return r;
    });

    setReceivables(updatedReceivables);
    setIsSettling(false);
    setPaymentAmount('');
    setPaymentMethod('');
    setPaymentReference('');
    setSelectedReceivable(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Fully Paid':
        return <Badge className="bg-green-100 text-green-800">Fully Paid</Badge>;
      case 'Partially Paid':
        return <Badge className="bg-yellow-100 text-yellow-800">Partially Paid</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Unsettled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Receivables Management</h2>
          <p className="text-gray-600">Track and manage customer debts and outstanding invoices</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Receivables</CardTitle>
          <CardDescription>All customer debts with cashier/waitstaff information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cashier/Waitstaff</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Original Amount</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remaining Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivables.map((receivable) => (
                <React.Fragment key={receivable.id}>
                  <TableRow>
                    <TableCell className="font-medium">{receivable.cashierName}</TableCell>
                    <TableCell>{receivable.customerName}</TableCell>
                    <TableCell>₦{receivable.originalAmount.toLocaleString()}</TableCell>
                    <TableCell>{receivable.creationDate}</TableCell>
                    <TableCell>{getStatusBadge(receivable.status)}</TableCell>
                    <TableCell className="font-semibold">
                      ₦{getRemainingBalance(receivable).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewingHistory(receivable)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedReceivable(receivable);
                            setIsSettling(true);
                          }}
                          disabled={receivable.status === 'Fully Paid'}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {viewingHistory?.id === receivable.id && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-0">
                        <PaymentHistory 
                          payments={receivable.paymentHistory}
                          totalAmount={receivable.originalAmount}
                          remainingBalance={getRemainingBalance(receivable)}
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
              <Label>Customer: {selectedReceivable?.customerName}</Label>
              <p className="text-sm text-gray-600">
                Outstanding Balance: ₦{selectedReceivable ? getRemainingBalance(selectedReceivable).toLocaleString() : 0}
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
            <Button onClick={handleRecordPayment} className="w-full">
              Record Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceivablesModule;