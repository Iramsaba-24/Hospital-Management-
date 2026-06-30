export interface ReferralPayment {
  id: number;
  patient: string;
  patientType: string;
  billNo: string;
  billAmount: number;
  payee: string;
  commissionPercentage: number;
  commissionAmount: number;
}

export interface ModuleCommission {
  module: string;
  percentage: number;
}

export interface ReferralPerson {
  id: number;
  referralName: string;
  category: string;
  contact: string;
  contactPerson: string;
  contactPersonPhone: string;
  address: string;
  standardCommission: number;
  modules: ModuleCommission[];
}