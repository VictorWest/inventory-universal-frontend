import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileX, Plus, Check, X } from 'lucide-react';

interface WriteOffRequest {
  id: string;
  itemName: string;
  quantity: number;
  reason: string;
  requestedBy: string;
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

const WriteOffRequests: React.FC = () => {
  const [requests, setRequests] = useState<WriteOffRequest[]>([
    {
      id: '1',
      itemName: 'Paracetamol Tablets',
      quantity: 50,
      reason: 'Expired medication',
      requestedBy: 'John Doe',
      requestDate: '2024-01-15',
      status: 'pending'
    },
    {
      id: '2',
      itemName: 'Coca Cola 50cl',
      quantity: 20,
      reason: 'Damaged packaging',
      requestedBy: 'Jane Smith',
      requestDate: '2024-01-14',
      approvedBy: 'Super Admin',
      approvalDate: '2024-01-16',
      status: 'approved'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    reason: '',
    comments: ''
  });

  const reasons = [
    'Expired',
    'Damaged',
    'Defective',
    'Contaminated',
    'Obsolete',
    'Lost',
    'Stolen',
    'Other'
  ];

  const handleCreateRequest = () => {
    if (!formData.itemName || !formData.quantity || !formData.reason) return;

    const newRequest: WriteOffRequest = {
      id: Date.now().toString(),
      itemName: formData.itemName,
      quantity: parseInt(formData.quantity),
      reason: formData.reason,
      requestedBy: 'Current User', // In real app, get from auth context
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      comments: formData.comments
    };

    setRequests([...requests, newRequest]);
    setIsCreating(false);
    setFormData({ itemName: '', quantity: '', reason: '', comments: '' });
  };

  const handleApproveRequest = (id: string) => {
    const updatedRequests = requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'approved' as const,
          approvedBy: 'Super Admin',
          approvalDate: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    });
    setRequests(updatedRequests);
  };

  const handleRejectRequest = (id: string) => {
    const updatedRequests = requests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'rejected' as const,
          approvedBy: 'Super Admin',
          approvalDate: new Date().toISOString().split('T')[0]
        };
      }
      return r;
    });
    setRequests(updatedRequests);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const rejectedRequests = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingRequests}</p>
              </div>
              <FileX className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedRequests}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedRequests}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Write-Off Requests</h3>
          <p className="text-sm text-gray-600">Manage requests for damaged or unusable inventory</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Write-Off Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity to Write Off</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason for Write-Off</Label>
                <Select value={formData.reason} onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  placeholder="Enter additional details..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={handleCreateRequest}>Submit Request</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Write-Off Requests</CardTitle>
          <CardDescription>All requests for writing off damaged or unusable inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.itemName}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default" 
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <div className="text-sm text-gray-500">
                        {request.approvedBy} on {request.approvalDate}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WriteOffRequests;