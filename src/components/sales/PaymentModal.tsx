import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Banknote, Smartphone, Printer } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (paymentData: PaymentData) => void;
  saleData: {
    subtotal: number;
    discount: number;
    total: number;
    items: any[];
    table?: string;
    waiter?: string;
    customer?: string;
  };
}

interface PaymentData {
  method: 'cash' | 'card' | 'transfer' | 'mobile';
  amount: number;
  reference?: string;
  notes?: string;
  printReceipt: boolean;
  showVoidedItems: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPayment,
  saleData
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'card' | 'transfer' | 'mobile'>('cash');
  const [amountReceived, setAmountReceived] = useState(saleData.total);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [printReceipt, setPrintReceipt] = useState(true);
  const [showVoidedItems, setShowVoidedItems] = useState(false);

  const change = amountReceived - saleData.total;

  const handlePayment = () => {
    const paymentData: PaymentData = {
      method: selectedMethod,
      amount: amountReceived,
      reference: reference || undefined,
      notes: notes || undefined,
      printReceipt,
      showVoidedItems
    };
    
    onPayment(paymentData);
    onClose();
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-500' },
    { id: 'card', label: 'Card/POS', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'transfer', label: 'Bank Transfer', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'mobile', label: 'Mobile Money', icon: Smartphone, color: 'bg-orange-500' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sale Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₦{saleData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-₦{saleData.discount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₦{saleData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={selectedMethod === method.id ? 'default' : 'outline'}
                    className="h-16 flex flex-col"
                    onClick={() => setSelectedMethod(method.id as any)}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <Label htmlFor="amount">Amount Received</Label>
            <Input
              id="amount"
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(Number(e.target.value))}
              step="0.01"
              min={saleData.total}
            />
            {selectedMethod === 'cash' && change > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                Change: ₦{change.toFixed(2)}
              </p>
            )}
          </div>

          {/* Reference (for non-cash payments) */}
          {selectedMethod !== 'cash' && (
            <div>
              <Label htmlFor="reference">Reference/Transaction ID</Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter transaction reference"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              rows={2}
            />
          </div>

          {/* Print Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="print"
                checked={printReceipt}
                onCheckedChange={setPrintReceipt}
              />
              <Label htmlFor="print" className="flex items-center">
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showVoided"
                checked={showVoidedItems}
                onCheckedChange={setShowVoidedItems}
              />
              <Label htmlFor="showVoided">Show voided/cancelled items on receipt</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={selectedMethod !== 'cash' && amountReceived < saleData.total}
            >
              Process Payment
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;