import Controltable, {
  type Column,
} from "../../../../components/controlled/Controltable";

type Status = "Done" | "Pending" | "Cancelled";

interface Visit {
  id: string;
  visitId: string;
  date: string;
  doctor: string;
  diagnosis: string;
  amount: number;
  status: Status;
}

const visits: Visit[] = [
  {
    id: "OPD-23045",
    visitId: "OPD-23045",
    date: "12 Feb 2026",
    doctor: "Dr. Amit Singh",
    diagnosis: "Viral Fever",
    amount: 850,
    status: "Done",
  },
  {
    id: "OPD-22891",
    visitId: "OPD-22891",
    date: "10 Dec 2025",
    doctor: "Dr. Amit Singh",
    diagnosis: "Hypertension",
    amount: 600,
    status: "Done",
  },
];

const statusClass = {
  Done: "bg-green-50 text-green-600",
  Pending: "bg-yellow-50 text-yellow-600",
  Cancelled: "bg-red-50 text-red-600",
};

export default function OpdVisitHistory() {
  const columns: Column<Visit>[] = [
    { key: "visitId", label: "Visit ID" },
    { key: "date", label: "Date" },
    { key: "doctor", label: "Doctor" },
    { key: "diagnosis", label: "Diagnosis" },
    {
      key: "amount",
      label: "Amount",
      render: (value) => `₹ ${value}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-md text-sm font-medium ${statusClass[value as Status]}`}
        >
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4 font-medium">
        Total Visits: {visits.length}
      </div>

      <Controltable<Visit>
        title="OPD Visit History"
        columns={columns}
        data={visits}
        itemsPerPage={10}
      />
    </div>
  );
}