import type { ReferralPayment, ReferralPerson } from "./types";

export const paymentData: ReferralPayment[] = [
  {
    id: 1,
    patient: "Ramesh Patil",
    patientType: "OPD",
    billNo: "OPDN18",
    billAmount: 20000,
    payee: "Apolline",
    commissionPercentage: 5,
    commissionAmount: 1000,
  },
  {
    id: 2,
    patient: "Yogesh Patil",
    patientType: "Pharmacy",
    billNo: "PHARM349",
    billAmount: 10000,
    payee: "Suresh Verma",
    commissionPercentage: 5,
    commissionAmount: 500,
  },
];

export const referralPersons: ReferralPerson[] = [
  {
    id: 1,
    referralName: "Bandana",
    category: "OPD Department",
    contact: "98656578887",
    contactPerson: "Ajay",
    contactPersonPhone: "98656578887",
    address: "Pune",
    standardCommission: 30,
    modules: [
      { module: "OPD", percentage: 30 },
      { module: "IPD", percentage: 20 },
      { module: "Pharmacy", percentage: 30 },
      { module: "Pathology", percentage: 20 },
      { module: "Radiology", percentage: 30 },
      { module: "Blood Bank", percentage: 20 },
      { module: "Ambulance", percentage: 10 },
    ],
  },
];