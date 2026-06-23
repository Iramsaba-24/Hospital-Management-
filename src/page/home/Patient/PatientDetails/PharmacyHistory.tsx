import Controltable, {
  type Column,
} from "../../../../components/controlled/Controltable";

type Status = "Paid" | "Due" | "Partial";

interface PharmacyBill {
  id: string;
  billNo: string;
  date: string;
  doctor: string;
  netAmount: string;
  paid: string;
  balance: string;
  status: Status;
}

const pharmacyBills: PharmacyBill[] = [
  {
    id: "PHARM-539",
    billNo: "PHARM-539",
    date: "30 Jan 2026",
    doctor: "Dr. Gomez",
    netAmount: "₹ 558.23",
    paid: "₹ 420.00",
    balance: "₹ 138.23",
    status: "Due",
  },
  {
    id: "PHARM-533",
    billNo: "PHARM-533",
    date: "01 Jan 2026",
    doctor: "Dr. Gomez",
    netAmount: "₹ 470.81",
    paid: "₹ 470.81",
    balance: "₹ 0",
    status: "Paid",
  },
  {
    id: "PHARM-525",
    billNo: "PHARM-525",
    date: "20 Dec 2025",
    doctor: "Dr. Patel",
    netAmount: "₹ 170.10",
    paid: "₹ 170.10",
    balance: "₹ 0",
    status: "Paid",
  },
];

const statusClass = {
  Paid:    "bg-green-100 text-green-700",
  Due:     "bg-orange-100 text-orange-700",
  Partial: "bg-amber-100 text-amber-700",
};

export default function PharmacyHistory() {
  const columns: Column<PharmacyBill>[] = [
    { key: "billNo",    label: "Bill No"    },
    { key: "date",      label: "Date"       },
    { key: "doctor",    label: "Doctor"     },
    { key: "netAmount", label: "Net Amount" },
    { key: "paid",      label: "Paid"       },
    { key: "balance",   label: "Balance"    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`px-2 py-1 rounded-md text-xs md:text-sm font-medium ${statusClass[value as Status]}`}>
          {String(value)}
        </span>
      ),
    },
  ];

  const totalSpend = pharmacyBills.reduce(
    (sum, bill) => sum + Number(bill.netAmount.replace(/[₹,\s]/g, "")),
    0
  );

  return (
    <div className="bg-white rounded-lg p-3 md:p-4">

      <div className="mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Pharmacy History</h2>
        <div className="text-xs md:text-sm text-gray-600 mt-1">
          Total Bills: {pharmacyBills.length} | Total Spend: ₹ {totalSpend.toFixed(2)}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Controltable<PharmacyBill>
          title=""
          columns={columns}
          data={pharmacyBills}
          itemsPerPage={10}
        />
      </div>

    </div>
  );
}