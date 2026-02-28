import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BusinessRegistryData {
  name: string;
  type: string;
  contactName: string;
  email: string;
  password?: string;
  registrationNo: string;
  nif: string;
  description: string;
  specializations: string[];
  laboratoryCategoryId: number | null;
  businessCategoryId: number | null;
  wilayaId: number | null;
  address: string;
  logo?: string;
  certificate?: string;
}

interface BusinessRegistryContextType {
  formData: BusinessRegistryData;
  setField: (field: keyof BusinessRegistryData, value: any) => void;
  resetForm: () => void;
}

const initialData: BusinessRegistryData = {
  name: 'Bizz',
  type: '',
  contactName: 'jerv',
  email: 'bizz@gmail.com',
  password: 'password',
  registrationNo: '1234',
  nif: '1234',
  description: '1234',
  specializations: [],
  laboratoryCategoryId: null,
  businessCategoryId: null,
  wilayaId: null,
  address: '',
};

const BusinessRegistryContext = createContext<BusinessRegistryContextType | undefined>(undefined);

export const BusinessRegistryProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<BusinessRegistryData>(initialData);

  const setField = (field: keyof BusinessRegistryData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      contactName: '',
      email: '',
      password: '',
      registrationNo: '',
      nif: '',
      description: '',
      specializations: [],
      laboratoryCategoryId: null,
      businessCategoryId: null,
      wilayaId: null,
      address: '',
    });
  };

  return (
    <BusinessRegistryContext.Provider value={{ formData, setField, resetForm }}>
      {children}
    </BusinessRegistryContext.Provider>
  );
};

export const useBusinessRegistry = () => {
  const context = useContext(BusinessRegistryContext);
  if (context === undefined) {
    throw new Error('useBusinessRegistry must be used within a BusinessRegistryProvider');
  }
  return context;
};
