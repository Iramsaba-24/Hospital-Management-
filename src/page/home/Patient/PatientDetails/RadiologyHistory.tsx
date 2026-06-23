import { useState } from "react";
import Controltable, {
  type Column,
} from "../../../../components/controlled/Controltable";

interface RadiologyBill {
  id: string;
  billNo: string;
  visitId: string;
  radiologyType: string;
  sacCode: string;
  date: string;
  patientName: string;
  doctorName: string;
  gross: string;
  cgst: string;
  sgst: string;
  net: string;
  paid: string;
  balance: string;
  paymentMethod: string;
  insurance: string;
}

const HOSPITAL_INFO = {
  name: "SMART HOSPITAL & RESEARCH CENTER",
  gstin: "27ABCDE1234F1Z5",
  address: "25 Kings Street, Mumbai, Maharashtra",
};

const radiologyBills: RadiologyBill[] = [
  {
    id: "B10557",
    billNo: "RAD-2026-0557",
    visitId: "OPD-2026-115",
    radiologyType: "CT Scan - Chest",
    sacCode: "999316",
    date: "25 Jan 2026",
    patientName: "Ramesh Patil",
    doctorName: "Dr. Amit Singh",
    gross: "₹ 330.00",
    cgst: "₹ 29.70",
    sgst: "₹ 29.70",
    net: "₹ 389.40",
    paid: "₹ 250",
    balance: "₹ 139.40",
    paymentMethod: "UPI",
    insurance: "TPA - MediCare",
  },
];

function InvoiceModal({
  bill,
  onClose,
}: {
  bill: RadiologyBill;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-3 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-5 md:p-8 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-700 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <h1 className="text-lg md:text-2xl font-bold text-gray-900">{HOSPITAL_INFO.name}</h1>
        <p className="text-xs text-gray-500 mt-1">GSTIN: {HOSPITAL_INFO.gstin}</p>
        <p className="text-xs text-gray-500">{HOSPITAL_INFO.address}</p>

        <hr className="my-3 md:my-4 border-gray-400" />

        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-bold text-sm tracking-wide">RADIOLOGY TAX INVOICE</p>
            <p className="text-sm mt-3">Patient: {bill.patientName}</p>
            <p className="text-sm">Visit ID: {bill.visitId}</p>
            <p className="text-sm">Doctor: {bill.doctorName}</p>
          </div>
          <div className="text-sm md:text-right">
            <p>Invoice No: {bill.billNo}</p>
            <p>Date: {bill.date}</p>
          </div>
        </div>

        <hr className="my-3 md:my-4 border-gray-400" />

        {/* Service table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-semibold">
                <th className="pb-2">Service</th>
                <th className="pb-2">SAC</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">{bill.radiologyType}</td>
                <td className="py-1">{bill.sacCode}</td>
                <td className="py-1">{bill.gross}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="text-sm space-y-1 w-40 md:w-48">
            <div className="flex justify-between">
              <span>CGST 9%</span>
              <span>{bill.cgst}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST 9%</span>
              <span>{bill.sgst}</span>
            </div>
            <div className="flex justify-between font-bold pt-1">
              <span>Total</span>
              <span>{bill.net}</span>
            </div>
          </div>
        </div>

        <hr className="my-3 md:my-4 border-gray-400" />

        <p className="text-sm">Payment Mode: {bill.paymentMethod}</p>
        <p className="text-sm">Insurance: {bill.insurance}</p>

        <hr className="my-3 md:my-4 border-gray-400" />

        <p className="text-xs italic text-gray-500">
          This is a system generated invoice.
        </p>
      </div>
    </div>
  );
}

export default function RadiologyHistory() {
  const [selectedBill, setSelectedBill] = useState<RadiologyBill | null>(null);

  const handleView = (id: string | number) => {
    const bill = radiologyBills.find((b) => b.id === id) ?? null;
    setSelectedBill(bill);
  };

  const columns: Column<RadiologyBill>[] = [
    { key: "billNo",        label: "Bill No"        },
    { key: "visitId",       label: "Visit ID"       },
    { key: "radiologyType", label: "Radiology Type" },
    { key: "date",          label: "Date"           },
    { key: "gross",         label: "Gross"          },
    { key: "cgst",          label: "CGST (9%)"      },
    { key: "sgst",          label: "SGST (9%)"      },
    {
      key: "net",
      label: "Net Amount",
      render: (value) => (
        <span className="font-semibold text-gray-900">{String(value)}</span>
      ),
    },
    { key: "paid", label: "Paid" },
    {
      key: "balance",
      label: "Balance",
      render: (value) => (
        <span className="text-red-500 font-medium">{String(value)}</span>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (value) => (
        <span className="text-green-600 font-medium">{String(value)}</span>
      ),
    },
    {
      key: "insurance",
      label: "Insurance",
      render: (value) => (
        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
          {String(value)}
        </span>
      ),
    },
  ];

  const totalOutstanding = radiologyBills.reduce(
    (sum, item) => sum + Number(item.balance.replace(/[₹,\s]/g, "")),
    0
  );

  return (
    <div className="bg-white rounded-lg p-3 md:p-4">

      <div className="mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Radiology History</h2>
        <div className="text-xs md:text-sm text-gray-600 mt-1">
          Total Bills: {radiologyBills.length} | Outstanding: ₹ {totalOutstanding.toFixed(2)}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Controltable<RadiologyBill>
          title=""
          columns={columns}
          data={radiologyBills}
          itemsPerPage={10}
          onView={handleView}
        />
      </div>

      {selectedBill && (
        <InvoiceModal bill={selectedBill} onClose={() => setSelectedBill(null)} />
      )}

    </div>
  );
}