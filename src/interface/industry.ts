export interface Industry {
    inventoryCategories: string[];
    defaultDepartments: string[];
    unitsOfMeasurement: string[];
    userRoles: string[];
    enabledFeatures: Array<{ feature: string; enabled: boolean}>;
    workflowType: { name: string; description: string }
}

export type IndustryName =
    | "hospitality"
    | "retail"
    | "healthcare"
    | "education"
    | "office"
    | "agriculture"
    | "manufacturing"
    | "general";

export const INDUSTRY_CONFIG: Record<IndustryName, Industry> = {
    hospitality: {
        inventoryCategories: ["Food Items", "Beverages", "Disposables", "Cleaning Supplies"],
        defaultDepartments: ["Kitchen", "Bar", "Restaurant", "Housekeeping", "Reception"],
        unitsOfMeasurement: ["portions", "packs", "litres", "kg", "cartons", "bottles"],
        userRoles: ["Manager", "Waiter", "Chef", "Bartender", "Cashier"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: true },
            { feature: "Batch Tracking", enabled: true} , 
            { feature: "Selling Price Managemenfeature: t", enabled: true },
            { feature: "Table Service", enabled: true} , 
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: false },
            { feature: "Asset Tracking", enabled: false },
        ],
        workflowType: {
            name: "Sales-Focused Workflow",
            description: "Optimized for customer-facing sales operations"
        }
    },

    retail: {
        inventoryCategories: ["Groceries", "Electronics", "Clothing", "Household Items"],
        defaultDepartments: ["Sales Floor", "Warehouse", "Cashier", "Customer Service"],
        unitsOfMeasurement: ["pieces", "packs", "kg", "litres", "cartons", "boxes"],
        userRoles: ["Store Manager", "Cashier", "Stock Clerk", "Sales Associate"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: true },
            { feature: "Batch Tracking", enabled: true },
            { feature: "Selling Price Management", enabled: true },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: false },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Sales-Focused Workflow",
            description: "Optimized for customer-facing sales operations"
        }
    },

    healthcare: {
        inventoryCategories: ["Medications", "Medical Supplies", "Equipment", "Consumables"],
        defaultDepartments: ["Pharmacy", "Ward", "ICU", "Laboratory", "Emergency"],
        unitsOfMeasurement: ["tablets", "vials", "bottles", "boxes", "units", "ml"],
        userRoles: ["Pharmacist", "Nurse", "Doctor", "Lab Technician"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: true },
            { feature: "Batch Tracking", enabled: true },
            { feature: "Selling Price Management", enabled: true },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: true },
            { feature: "Bill of Materials", enabled: false },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Requisition-Based Workflow",
            description: "Designed for internal requisition and distribution"
        }
    },

    education: {
        inventoryCategories: ["Stationery", "Equipment", "Books", "Supplies"],
        defaultDepartments: ["Administration", "Library", "Laboratory", "Maintenance"],
        unitsOfMeasurement: ["pieces", "packs", "reams", "boxes", "units"],
        userRoles: ["Administrator", "Teacher", "Librarian", "Maintenance Staff"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: false },
            { feature: "Batch Tracking", enabled: false },
            { feature: "Selling Price Management", enabled: false },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: false },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: false },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Requisition-Based Workflow",
            description: "Designed for internal requisition and distribution"
        }
    },

    general: {
        inventoryCategories: ["Consumables", "Equipment", "Supplies", "Assets"],
        defaultDepartments: ["Store", "Operations", "Administration"],
        unitsOfMeasurement: ["pieces", "units", "kg", "litres", "boxes", "packs"],
        userRoles: ["Manager", "Operator", "Admin", "User"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: true },
            { feature: "Batch Tracking", enabled: true },
            { feature: "Selling Price Management", enabled: true },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: false },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Hybrid Workflow (Sales + Requisition)",
            description: "Supports both sales and internal requisition workflows"
        }
    },

    agriculture: {
        inventoryCategories: ["Seeds", "Fertilizers", "Chemicals", "Tools", "Animal Feed"],
        defaultDepartments: ["Farm Store", "Field Operations", "Livestock", "Processing"],
        unitsOfMeasurement: ["bags", "litres", "kg", "drums", "sacks", "tonnes"],
        userRoles: ["Farm Manager", "Field Worker", "Veterinarian", "Store Keeper"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: true },
            { feature: "Batch Tracking", enabled: true },
            { feature: "Selling Price Management", enabled: false },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: true },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Requisition-Based Workflow",
            description: "Designed for internal requisition and distribution"
        }
    },

    manufacturing: {
        inventoryCategories: ["Raw Materials", "Tools", "Spare Parts", "Finished Goods"],
        defaultDepartments: ["Production Floor", "Quality Control", "Maintenance", "Warehouse"],
        unitsOfMeasurement: ["kg", "sheets", "rolls", "meters", "litres", "pieces"],
        userRoles: ["Production Manager", "Operator", "Quality Inspector", "Maintenance Tech"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: true },
            { feature: "Batch Tracking", enabled: true },
            { feature: "Selling Price Management", enabled: false },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: true },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Requisition-Based Workflow",
            description: "Designed for internal requisition and distribution"
        }
    },

    office: {
        inventoryCategories: ["Stationery", "Office Supplies", "Equipment", "Assets"],
        defaultDepartments: ["Administration", "Human Resources", "IT Support", "Procurement"],
        unitsOfMeasurement: ["pieces", "packs", "boxes", "units", "reams"],
        userRoles: ["Office Manager", "Administrator", "IT Staff", "Employee"],
        enabledFeatures: [
            { feature: "Expiry Tracking", enabled: false },
            { feature: "Batch Tracking", enabled: false },
            { feature: "Selling Price Management", enabled: false },
            { feature: "Table Service", enabled: false },
            { feature: "Barcode Scanning", enabled: true },
            { feature: "Requisition Flow", enabled: true },
            { feature: "Patient Tracking", enabled: false },
            { feature: "Bill of Materials", enabled: false },
            { feature: "Asset Tracking", enabled: true }
        ],
        workflowType: {
            name: "Requisition-Based Workflow",
            description: "Designed for internal requisition and efficient office operations"
        }
    }
}