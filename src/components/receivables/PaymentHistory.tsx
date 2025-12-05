import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: 'Cash' | 'POS' | 'Transfer';
  reference?: string;
  recordedBy: string;
}

interface PaymentHistoryProps {
  payments: PaymentRecord[];
  totalAmount: number;
  remainingBalance: number;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments, totalAmount, remainingBalance }) => {
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Cash': return <Banknote className="h-4 w-4" />;
      case 'POS': return <CreditCard className="h-4 w-4" />;
      case 'Transfer': return <Smartphone className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Cash': return 'bg-green-100 text-green-800';
      case 'POS': return 'bg-blue-100 text-blue-800';
      case 'Transfer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Payment History</span>
        </CardTitle>
        <div className="flex justify-between text-sm">
          <span>Original Amount: <strong>₦{totalAmount.toLocaleString()}</strong></span>
          <span>Total Paid: <strong className="text-green-600">₦{totalPaid.toLocaleString()}</strong></span>
          <span>Remaining: <strong className="text-red-600">₦{remainingBalance.toLocaleString()}</strong></span>
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No payments recorded yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    ₦{payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getMethodColor(payment.method)}>
                      <span className="flex items-center space-x-1">
                        {getPaymentIcon(payment.method)}
                        <span>{payment.method}</span>
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.reference || '-'}</TableCell>
                  <TableCell>{payment.recordedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;