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
import { Eye, Edit, Check, X, History, Plus } from 'lucide-react';
import { GET_PROCUREMENTS_LIST, ADD_PROCUREMENT } from '@/shared/constants';

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
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [refreshItems, setRefreshItems] = useState(false);

  // Add dialog state
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newEstimatedCost, setNewEstimatedCost] = useState('');

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

  // Fetch procurements from backend and normalize numeric fields
  React.useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(GET_PROCUREMENTS_LIST, { credentials: 'include' });
        if (!resp.ok) return;
        const { data } = await resp.json();
        const normalized = (data || []).map((r: any) => {
          const items = (r.items || []).map((it: any) => ({
            ...it,
            requestedQty: Number(it.requestedQty) || 0,
            approvedQty: it.approvedQty == null ? undefined : Number(it.approvedQty),
            estimatedCost: Number(it.estimatedCost) || 0,
            adjustedCost: it.adjustedCost == null ? undefined : Number(it.adjustedCost)
          }));

          return {
            ...r,
            items,
            requestDate: r.requestDate || (new Date().toISOString().split('T')[0]),
            status: r.status || 'Pending'
          } as ProcurementRequest;
        });

        setRequests(normalized);
      } catch (err) {
        console.error('Failed to fetch procurements', err);
      }
    })();
  }, [refreshItems]);

  const handleAddRequest = async () => {
    if (!newDepartment || !newItemName || !newItemQty || !newEstimatedCost) return;

    try {
      const body = {
        department: newDepartment,
        items: [
          {
            name: newItemName,
            requestedQty: Number(newItemQty),
            estimatedCost: Number(newEstimatedCost)
          }
        ],
        requestDate: new Date().toISOString().split('T')[0]
      };

      const resp = await fetch(ADD_PROCUREMENT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Add procurement failed', text);
        alert('Failed to add procurement');
        return;
      }

      // refresh list
      setRefreshItems(prev => !prev);
      setIsAddingRequest(false);
      setNewDepartment('');
      setNewItemName('');
      setNewItemQty('');
      setNewEstimatedCost('');
    } catch (err) {
      console.error(err);
      alert('Error adding procurement');
    }
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
        <div>
          <Dialog open={isAddingRequest} onOpenChange={setIsAddingRequest}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Procurement Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dept">Department</Label>
                  <Input id="dept" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="item">Item Name</Label>
                  <Input id="item" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="qty">Quantity</Label>
                  <Input id="qty" type="number" value={newItemQty} onChange={(e) => setNewItemQty(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="cost">Estimated Cost</Label>
                  <Input id="cost" type="number" value={newEstimatedCost} onChange={(e) => setNewEstimatedCost(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleAddRequest}>Create Request</Button>
              </div>
            </DialogContent>
          </Dialog>
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