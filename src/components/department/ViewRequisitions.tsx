import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface Requisition {
  id: string;
  fromDepartment: string;
  toDepartment: string;
  items: Array<{
    sku: string;
    name: string;
    requestedQty: number;
    unit: string;
    approvedQty?: number;
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: string;
  expectedDate: string;
  notes?: string;
  approvedBy?: string;
}

interface ViewRequisitionsProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  userRole: string;
}

const ViewRequisitions: React.FC<ViewRequisitionsProps> = ({ isOpen, onClose, departmentName, userRole }) => {
  const [requisitions] = useState<Requisition[]>([
    {
      id: 'REQ-001',
      fromDepartment: 'Sales Department',
      toDepartment: 'Main Store',
      items: [
        { sku: 'SKU001', name: 'Sample Item 1', requestedQty: 10, unit: 'pcs', approvedQty: 10 },
        { sku: 'SKU002', name: 'Sample Item 2', requestedQty: 5, unit: 'kg', approvedQty: 3 }
      ],
      status: 'approved',
      requestDate: '2024-01-10',
      expectedDate: '2024-01-15',
      notes: 'Urgent requirement for sales floor',
      approvedBy: 'Store Manager'
    },
    {
      id: 'REQ-002',
      fromDepartment: 'Production',
      toDepartment: 'Main Store',
      items: [
        { sku: 'SKU003', name: 'Raw Material A', requestedQty: 20, unit: 'kg' }
      ],
      status: 'pending',
      requestDate: '2024-01-12',
      expectedDate: '2024-01-18',
      notes: 'For production batch 001'
    }
  ]);

  const [selectedReq, setSelectedReq] = useState<Requisition | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'fulfilled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (reqId: string) => {
    console.log('Approving requisition:', reqId);
  };

  const handleReject = (reqId: string) => {
    console.log('Rejecting requisition:', reqId);
  };

  const handleFulfill = (reqId: string) => {
    console.log('Fulfilling requisition:', reqId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Requisitions - {departmentName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{requisitions.filter(r => r.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{requisitions.filter(r => r.status === 'approved').length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{requisitions.filter(r => r.status === 'fulfilled').length}</p>
                  <p className="text-sm text-muted-foreground">Fulfilled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{requisitions.filter(r => r.status === 'rejected').length}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Requisitions List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Req ID</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>{req.fromDepartment}</TableCell>
                      <TableCell>{req.toDepartment}</TableCell>
                      <TableCell>{req.items.length} items</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{req.requestDate}</TableCell>
                      <TableCell>{req.expectedDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReq(req)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {userRole === 'admin' && req.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(req.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(req.id)}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                          {userRole === 'admin' && req.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFulfill(req.id)}
                            >
                              <Clock className="h-4 w-4 text-blue-600" />
                            </Button>
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

        {/* Requisition Details Modal */}
        {selectedReq && (
          <Dialog open={!!selectedReq} onOpenChange={() => setSelectedReq(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Requisition Details - {selectedReq.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">From Department:</p>
                    <p className="text-sm text-muted-foreground">{selectedReq.fromDepartment}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">To Department:</p>
                    <p className="text-sm text-muted-foreground">{selectedReq.toDepartment}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Request Date:</p>
                    <p className="text-sm text-muted-foreground">{selectedReq.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected Date:</p>
                    <p className="text-sm text-muted-foreground">{selectedReq.expectedDate}</p>
                  </div>
                </div>
                
                {selectedReq.notes && (
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-muted-foreground">{selectedReq.notes}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium mb-2">Requested Items:</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Requested</TableHead>
                        <TableHead>Approved</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedReq.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.requestedQty}</TableCell>
                          <TableCell>{item.approvedQty || '-'}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRequisitions;