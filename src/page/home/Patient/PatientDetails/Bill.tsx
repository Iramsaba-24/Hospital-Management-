import React from "react";

interface MedicineLineItem {
  category: string;
  name: string;
  batchNo: string;
  unit: string;
  expiryDate: string;
  quantity: number;
  taxAmount: number;
  taxPercent: number;
  discountPercent: number;
  amount: number;
}

interface HospitalInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface BillSummary {
  total: number;
  discount: number;
  discountPercent: number;
  tax: number;
  netAmount: number;
  paidAmount: number;
  refundAmount: number;
  dueAmount: number;
}

interface PharmacyBillProps {
  hospital?: HospitalInfo;
  billNo?: string;
  date?: string;
  patientName?: string;
  patientPhone?: string;
  doctorName?: string;
  visitId?: string;
  items?: MedicineLineItem[];
  collectedBy?: string;
  collectedById?: string;
  summary?: BillSummary;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

const defaultHospital: HospitalInfo = {
  name: "Hospital name & pharma name logo",
  address: "25 Kings Street, CA",
  phone: "8956243934",
  email: "smarthospitalrc@gmail.com",
  website: "www.smart-hospital.in",
};

const defaultItems: MedicineLineItem[] = [
  {
    category: "Syrup",
    name: "Alprovit",
    batchNo: "5673",
    unit: "ml",
    expiryDate: "Aug/2026",
    quantity: 3,
    taxAmount: 6.75,
    taxPercent: 5,
    discountPercent: 10,
    amount: 121.5,
  },
  {
    category: "Capsule",
    name: "WORMSTOP",
    batchNo: "7844",
    unit: "mg",
    expiryDate: "Oct/2026",
    quantity: 3,
    taxAmount: 33.75,
    taxPercent: 15,
    discountPercent: 12,
    amount: 198,
  },
];

const defaultSummary: BillSummary = {
  total: 319.5,
  discount: 0,
  discountPercent: 0,
  tax: 35.77,
  netAmount: 355.27,
  paidAmount: 397.8,
  refundAmount: 42.53,
  dueAmount: 0,
};

const tableHeaders = [
  "Medicine Category",
  "Medicine Name",
  "Batch No",
  "Unit",
  "Expiry Date",
  "Quantity",
  "Tax",
  "Discount",
  "Amount",
];

const PharmacyBill: React.FC<PharmacyBillProps> = ({
  hospital = defaultHospital,
  billNo = "PHARMAB501",
  date = "09/01/2025 12:00 PM",
  patientName = "Ramesh Patil",
  patientPhone = "7896541230",
  doctorName = "Reyan Jain",
  visitId = "115",
  items = defaultItems,
  collectedBy = "Harry Grant",
  collectedById = "9012",
  summary = defaultSummary,
}) => {
  const patientInfo = [
    { label: "Name",     value: patientName  },
    { label: "Phone",    value: patientPhone },
    { label: "Doctor",   value: doctorName   },
    { label: "Visit ID", value: visitId      },
  ];

  const summaryRows = [
    { label: "Total",         value: formatCurrency(summary.total)         },
    { label: "Discount",      value: `${formatCurrency(summary.discount)} (${summary.discountPercent}%)` },
    { label: "Tax",           value: formatCurrency(summary.tax)           },
    { label: "Net Amount",    value: formatCurrency(summary.netAmount)     },
    { label: "Paid Amount",   value: formatCurrency(summary.paidAmount)    },
    { label: "Refund Amount", value: formatCurrency(summary.refundAmount)  },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow rounded-lg overflow-hidden">

        {/* Top bar */}
        <div className="bg-blue-600 px-4 md:px-6 py-3 md:py-4">
          <h1 className="text-white font-semibold text-base md:text-lg">
            Pharmacy Bill Details
          </h1>
        </div>

        <div className="p-4 md:p-6">

          <div className="flex flex-col gap-3 md:flex-row md:justify-between border-b pb-4 md:pb-6">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                {hospital.name}
              </h2>
            </div>
            <div className="text-sm text-gray-600 md:text-right">
              <p>{hospital.address}</p>
              <p>{hospital.phone}</p>
              <p>{hospital.email}</p>
              <p>{hospital.website}</p>
            </div>
          </div>

          <div className="bg-gray-900 text-white text-center py-2 font-medium mt-4 md:mt-6 rounded text-sm md:text-base">
            Pharmacy Bill
          </div>

          <div className="flex flex-col gap-1 md:flex-row md:justify-between mt-4 md:mt-6 text-sm text-gray-600">
            <p>Bill No: <strong>{billNo}</strong></p>
            <p>Date: <strong>{date}</strong></p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6 text-sm">
            {patientInfo.map((item) => (
              <div key={item.label}>
                <span className="font-semibold">{item.label}: </span>
                {item.value}
              </div>
            ))}
          </div>

          <div className="overflow-x-auto mt-6 md:mt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {tableHeaders.map((header) => (
                    <th key={header} className="text-left py-2 md:py-3 px-2 font-semibold whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 md:py-3 px-2 whitespace-nowrap">{item.category}</td>
                    <td className="py-2 md:py-3 px-2 whitespace-nowrap">{item.name}</td>
                    <td className="py-2 md:py-3 px-2">{item.batchNo}</td>
                    <td className="py-2 md:py-3 px-2">{item.unit}</td>
                    <td className="py-2 md:py-3 px-2 whitespace-nowrap">{item.expiryDate}</td>
                    <td className="py-2 md:py-3 px-2">{item.quantity}</td>
                    <td className="py-2 md:py-3 px-2 whitespace-nowrap">
                      {formatCurrency(item.taxAmount)} ({item.taxPercent}%)
                    </td>
                    <td className="py-2 md:py-3 px-2">{item.discountPercent}%</td>
                    <td className="py-2 md:py-3 px-2 text-right whitespace-nowrap">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer — mobile stack, desktop row */}
          <div className="mt-6 md:mt-8 flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="text-sm">
              <span className="font-semibold">Collected By:</span>{" "}
              {collectedBy} ({collectedById})
            </div>

            {/* Summary box */}
            <div className="w-full md:max-w-sm border rounded-lg p-3 md:p-4">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex justify-between py-1.5 md:py-2 text-sm">
                  <span>{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 md:pt-3 flex justify-between font-bold text-sm">
                <span>Due Amount</span>
                <span>{formatCurrency(summary.dueAmount)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 border-t pt-3 md:pt-4">
            <p className="text-xs text-gray-500">
              This invoice is printed electronically, so no signature is required.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PharmacyBill;