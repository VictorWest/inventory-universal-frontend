export interface IndustryConfig {
  id: string;
  name: string;
  categories: string[];
  departments: string[];
  uoms: string[];
  features: {
    expiryTracking: boolean;
    batchTracking: boolean;
    sellingPrice: boolean;
    tableService: boolean;
    barcodeScanning: boolean;
    requisitionFlow: boolean;
    patientTracking: boolean;
    bomTracking: boolean;
    assetTracking: boolean;
  };
  defaultRoles: string[];
  workflowType: 'sales' | 'requisition' | 'hybrid';
}

export const industryConfigs: Record<string, IndustryConfig> = {
  hospitality: {
    id: 'hospitality',
    name: 'Hospitality',
    categories: ['Food Items', 'Beverages', 'Disposables', 'Cleaning Supplies'],
    departments: ['Kitchen', 'Bar', 'Restaurant', 'Housekeeping', 'Reception'],
    uoms: ['portions', 'packs', 'litres', 'kg', 'cartons', 'bottles'],
    features: {
      expiryTracking: true,
      batchTracking: true,
      sellingPrice: true,
      tableService: true,
      barcodeScanning: true,
      requisitionFlow: true,
      patientTracking: false,
      bomTracking: false,
      assetTracking: false
    },
    defaultRoles: ['Manager', 'Waiter', 'Chef', 'Bartender', 'Cashier'],
    workflowType: 'sales'
  },
  retail: {
    id: 'retail',
    name: 'Retail & Supermarket',
    categories: ['Groceries', 'Electronics', 'Clothing', 'Household Items'],
    departments: ['Sales Floor', 'Warehouse', 'Cashier', 'Customer Service'],
    uoms: ['pieces', 'packs', 'kg', 'litres', 'cartons', 'boxes'],
    features: {
      expiryTracking: true,
      batchTracking: true,
      sellingPrice: true,
      tableService: false,
      barcodeScanning: true,
      requisitionFlow: true,
      patientTracking: false,
      bomTracking: false,
      assetTracking: false
    },
    defaultRoles: ['Store Manager', 'Cashier', 'Stock Clerk', 'Sales Associate'],
    workflowType: 'sales'
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    categories: ['Medications', 'Medical Supplies', 'Equipment', 'Consumables'],
    departments: ['Pharmacy', 'Ward', 'ICU', 'Laboratory', 'Emergency'],
    uoms: ['tablets', 'vials', 'bottles', 'boxes', 'units', 'ml'],
    features: {
      expiryTracking: true,
      batchTracking: true,
      sellingPrice: true,
      tableService: false,
      barcodeScanning: true,
      requisitionFlow: true,
      patientTracking: true,
      bomTracking: false,
      assetTracking: true
    },
    defaultRoles: ['Pharmacist', 'Nurse', 'Doctor', 'Lab Technician'],
    workflowType: 'requisition'
  },
  education: {
    id: 'education',
    name: 'Education',
    categories: ['Stationery', 'Equipment', 'Books', 'Supplies'],
    departments: ['Administration', 'Library', 'Laboratory', 'Maintenance'],
    uoms: ['pieces', 'packs', 'reams', 'boxes', 'units'],
    features: {
      expiryTracking: false,
      batchTracking: false,
      sellingPrice: false,
      tableService: false,
      barcodeScanning: false,
      requisitionFlow: true,
      patientTracking: false,
      bomTracking: false,
      assetTracking: true
    },
    defaultRoles: ['Administrator', 'Teacher', 'Librarian', 'Maintenance Staff'],
    workflowType: 'requisition'
  },
  agriculture: {
    id: 'agriculture',
    name: 'Agriculture',
    categories: ['Seeds', 'Fertilizers', 'Chemicals', 'Tools', 'Animal Feed'],
    departments: ['Farm Store', 'Field Operations', 'Livestock', 'Processing'],
    uoms: ['bags', 'litres', 'kg', 'drums', 'sacks', 'tonnes'],
    features: {
      expiryTracking: true,
      batchTracking: true,
      sellingPrice: false,
      tableService: false,
      barcodeScanning: false,
      requisitionFlow: true,
      patientTracking: false,
      bomTracking: false,
      assetTracking: true
    },
    defaultRoles: ['Farm Manager', 'Field Worker', 'Veterinarian', 'Store Keeper'],
    workflowType: 'requisition'
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing',
    categories: ['Raw Materials', 'Tools', 'Spare Parts', 'Finished Goods'],
    departments: ['Production Floor', 'Quality Control', 'Maintenance', 'Warehouse'],
    uoms: ['kg', 'sheets', 'rolls', 'meters', 'litres', 'pieces'],
    features: {
      expiryTracking: false,
      batchTracking: true,
      sellingPrice: false,
      tableService: false,
      barcodeScanning: true,
      requisitionFlow: true,
      patientTracking: false,
      bomTracking: true,
      assetTracking: true
    },
    defaultRoles: ['Production Manager', 'Operator', 'Quality Inspector', 'Maintenance Tech'],
    workflowType: 'requisition'
  },
  general: {
    id: 'general',
    name: 'General Purpose',
    categories: ['Consumables', 'Equipment', 'Supplies', 'Assets'],
    departments: ['Store', 'Operations', 'Administration'],
    uoms: ['pieces', 'units', 'kg', 'litres', 'boxes', 'packs'],
    features: {
      expiryTracking: true,
      batchTracking: true,
      sellingPrice: true,
      tableService: false,
      barcodeScanning: true,
      requisitionFlow: true,
      patientTracking: false,
      bomTracking: false,
      assetTracking: true
    },
    defaultRoles: ['Manager', 'Operator', 'Admin', 'User'],
    workflowType: 'hybrid'
  }
};

export const getIndustryConfig = (industryId: string): IndustryConfig => {
  return industryConfigs[industryId] || industryConfigs.general;
};