import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { getIndustryConfig } from '@/config/industryConfig';

interface IndustrySetupProps {
  industryId: string;
}

const IndustrySetup: React.FC<IndustrySetupProps> = ({ industryId }) => {
  const config = getIndustryConfig(industryId);

  const FeatureItem = ({ enabled, label }: { enabled: boolean; label: string }) => (
    <div className="flex items-center gap-2 py-1">
      {enabled ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <Circle className="h-4 w-4 text-gray-300" />
      )}
      <span className={enabled ? 'text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Industry Setup: {config.name}</h2>
        <p className="text-muted-foreground">
          Your system has been preconfigured for {config.name.toLowerCase()} operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Default Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.departments.map((dept) => (
                <Badge key={dept} variant="outline">
                  {dept}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Units of Measurement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.uoms.map((uom) => (
                <Badge key={uom} variant="default">
                  {uom}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {config.defaultRoles.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enabled Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FeatureItem enabled={config.features.expiryTracking} label="Expiry Tracking" />
              <FeatureItem enabled={config.features.batchTracking} label="Batch Tracking" />
              <FeatureItem enabled={config.features.sellingPrice} label="Selling Price Management" />
              <FeatureItem enabled={config.features.tableService} label="Table Service" />
              <FeatureItem enabled={config.features.barcodeScanning} label="Barcode Scanning" />
            </div>
            <div>
              <FeatureItem enabled={config.features.requisitionFlow} label="Requisition Flow" />
              <FeatureItem enabled={config.features.patientTracking} label="Patient Tracking" />
              <FeatureItem enabled={config.features.bomTracking} label="Bill of Materials" />
              <FeatureItem enabled={config.features.assetTracking} label="Asset Tracking" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Workflow Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="default" className="text-sm">
            {config.workflowType === 'sales' && 'Sales-Focused Workflow'}
            {config.workflowType === 'requisition' && 'Requisition-Based Workflow'}
            {config.workflowType === 'hybrid' && 'Hybrid Workflow (Sales + Requisition)'}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            {config.workflowType === 'sales' && 'Optimized for customer-facing sales operations'}
            {config.workflowType === 'requisition' && 'Designed for internal requisition and distribution'}
            {config.workflowType === 'hybrid' && 'Supports both sales and internal requisition workflows'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustrySetup;