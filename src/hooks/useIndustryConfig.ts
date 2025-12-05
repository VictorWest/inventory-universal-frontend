import { useMemo } from 'react';
import { getIndustryConfig, IndustryConfig } from '@/config/industryConfig';
import { useAppContext } from '@/contexts/AppContext';

export const useIndustryConfig = (): IndustryConfig => {
  const { selectedIndustry } = useAppContext();
  
  return useMemo(() => {
    return getIndustryConfig(selectedIndustry);
  }, [selectedIndustry]);
};

export const useIndustryFeatures = () => {
  const config = useIndustryConfig();
  
  return useMemo(() => ({
    hasExpiryTracking: config.features.expiryTracking,
    hasBatchTracking: config.features.batchTracking,
    hasSellingPrice: config.features.sellingPrice,
    hasTableService: config.features.tableService,
    hasBarcodeScanning: config.features.barcodeScanning,
    hasRequisitionFlow: config.features.requisitionFlow,
    hasPatientTracking: config.features.patientTracking,
    hasBomTracking: config.features.bomTracking,
    hasAssetTracking: config.features.assetTracking,
    workflowType: config.workflowType,
    categories: config.categories,
    departments: config.departments,
    uoms: config.uoms,
    defaultRoles: config.defaultRoles
  }), [config]);
};