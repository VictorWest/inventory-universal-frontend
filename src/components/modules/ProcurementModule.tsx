import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, Check, X, History } from 'lucide-react';

interface ProcurementRequest {
  id: string;
  department: string;
  items: Array<{
    name: string;
    requestedQty: number;
    approvedQty?: number;
    estimatedCost: number;
    adjustedCost?: number;
  }>;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestDate: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

const ProcurementModule: React.FC = () => {
  const [requests, setRequests] = useState<ProcurementRequest[]>([
    {
      id: 'PR001',
      department: 'Kitchen',
      items: [
        { name: 'Rice 50kg', requestedQty: 10, estimatedCost: 50000 },
        { name: 'Cooking Oil 25L', requestedQty: 5, estimatedCost: 25000 }
      ],
      status: 'Pending',
      requestDate: '2024-01-15'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);
  const [editingRequest, setEditingRequest] = useState<ProcurementRequest | null>(null);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status: 'Approved' as const, approvedBy: 'Super Admin', approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { ...req, status: 'Rejected' as const, approvedBy: 'Super Admin', approvedDate: new Date().toISOString().split('T')[0] }
        : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Procurement Management</h2>
          <p className="text-gray-600">Review and approve procurement requests</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Procurement Requests</CardTitle>
          <CardDescription>Manage all procurement requests from departments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.items.length} items</TableCell>
                  <TableCell>
                    ₦{request.items.reduce((sum, item) => sum + (item.adjustedCost || item.estimatedCost), 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Procurement Request Details - {selectedRequest?.id}</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Department</Label>
                                  <p className="font-medium">{selectedRequest.department}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge className={getStatusColor(selectedRequest.status)}>
                                    {selectedRequest.status}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label>Items Requested</Label>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>Requested Qty</TableHead>
                                      <TableHead>Approved Qty</TableHead>
                                      <TableHead>Estimated Cost</TableHead>
                                      <TableHead>Adjusted Cost</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedRequest.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.requestedQty}</TableCell>
                                        <TableCell>{item.approvedQty || '-'}</TableCell>
                                        <TableCell>₦{item.estimatedCost.toLocaleString()}</TableCell>
                                        <TableCell>₦{(item.adjustedCost || item.estimatedCost).toLocaleString()}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {request.status === 'Pending' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setEditingRequest(request)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleApprove(request.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleReject(request.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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

export default ProcurementModule;