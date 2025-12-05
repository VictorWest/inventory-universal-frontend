import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Percent, Gift, Ban, Trash2 } from 'lucide-react';

interface SalesActionsProps {
  onDiscount: (itemId: string, discount: number) => void;
  onComplimentary: (itemId: string, reason: string) => void;
  onVoid: (itemId: string, reason: string) => void;
  onCancel: (itemId: string, reason: string) => void;
  itemId: string;
  itemName: string;
  disabled?: boolean;
}

const SalesActions: React.FC<SalesActionsProps> = ({
  onDiscount,
  onComplimentary,
  onVoid,
  onCancel,
  itemId,
  itemName,
  disabled = false
}) => {
  const [discountPercent, setDiscountPercent] = useState(0);
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [isComplimentaryOpen, setIsComplimentaryOpen] = useState(false);
  const [isVoidOpen, setIsVoidOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const voidReasons = [
    'Customer changed mind',
    'Kitchen/preparation error',
    'Item not available',
    'Quality issue',
    'Staff error',
    'Other'
  ];

  const cancelReasons = [
    'Customer request',
    'Out of stock',
    'Preparation time too long',
    'Price dispute',
    'Other'
  ];

  const complimentaryReasons = [
    'Customer complaint',
    'Promotional offer',
    'Staff courtesy',
    'Quality compensation',
    'Management decision',
    'Other'
  ];

  const handleDiscount = () => {
    if (discountPercent > 0 && discountPercent <= 100) {
      onDiscount(itemId, discountPercent);
      setDiscountPercent(0);
      setIsDiscountOpen(false);
    }
  };

  const handleComplimentary = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    if (finalReason) {
      onComplimentary(itemId, finalReason);
      setReason('');
      setSelectedReason('');
      setIsComplimentaryOpen(false);
    }
  };

  const handleVoid = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    if (finalReason) {
      onVoid(itemId, finalReason);
      setReason('');
      setSelectedReason('');
      setIsVoidOpen(false);
    }
  };

  const handleCancel = () => {
    const finalReason = selectedReason === 'Other' ? reason : selectedReason;
    if (finalReason) {
      onCancel(itemId, finalReason);
      setReason('');
      setSelectedReason('');
      setIsCancelOpen(false);
    }
  };

  return (
    <div className="flex space-x-1">
      {/* Discount */}
      <Dialog open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <Percent className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Applying discount to: {itemName}
            </p>
            <div>
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input
                id="discount"
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                placeholder="Enter discount %"
                min="0"
                max="100"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleDiscount} disabled={discountPercent <= 0}>
                Apply Discount
              </Button>
              <Button variant="outline" onClick={() => setIsDiscountOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complimentary */}
      <Dialog open={isComplimentaryOpen} onOpenChange={setIsComplimentaryOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <Gift className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Complimentary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Marking as complimentary: {itemName}
            </p>
            <div>
              <Label htmlFor="comp-reason">Reason</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {complimentaryReasons.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedReason === 'Other' && (
              <div>
                <Label htmlFor="custom-reason">Custom Reason</Label>
                <Textarea
                  id="custom-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter custom reason"
                />
              </div>
            )}
            <div className="flex space-x-2">
              <Button onClick={handleComplimentary} disabled={!selectedReason}>
                Mark Complimentary
              </Button>
              <Button variant="outline" onClick={() => setIsComplimentaryOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Void */}
      <AlertDialog open={isVoidOpen} onOpenChange={setIsVoidOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <Ban className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Void Item</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to void: {itemName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="void-reason">Reason for Void</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {voidReasons.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedReason === 'Other' && (
              <div>
                <Label htmlFor="void-custom">Custom Reason</Label>
                <Textarea
                  id="void-custom"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter custom reason"
                />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVoid} disabled={!selectedReason}>
              Void Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel */}
      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Item</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to cancel: {itemName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cancel-reason">Reason for Cancellation</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {cancelReasons.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedReason === 'Other' && (
              <div>
                <Label htmlFor="cancel-custom">Custom Reason</Label>
                <Textarea
                  id="cancel-custom"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter custom reason"
                />
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={!selectedReason}>
              Cancel Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalesActions;