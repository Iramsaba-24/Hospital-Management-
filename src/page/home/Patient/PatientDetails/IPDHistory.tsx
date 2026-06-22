import Controltable, {
  type Column,
} from "../../../../components/controlled/Controltable";

type Status = "Discharged" | "Admitted" | "Pending";

interface Admission {
  id: string;
  visitId: string;
  admissionDate: string;
  doctor: string;
  stay: string;
  amount: string;
  status: Status;
}

const admissions: Admission[] = [
  {
    id: "IPD-1082",
    visitId: "IPD-1082",
    admissionDate: "05 Jan 2026",
    doctor: "Dr. Neha Joshi",
    stay: "4 Days",
    amount: "₹ 24,500",
    status: "Discharged",
  },
];

const statusClass = {
  Discharged: "bg-green-50 text-green-600",
  Admitted: "bg-blue-50 text-blue-600",
  Pending: "bg-yellow-50 text-yellow-600",
};

export default function IPDHistory() {
  const columns: Column<Admission>[] = [
    { key: "visitId", label: "Visit ID" },
    { key: "admissionDate", label: "Admission Date" },
    { key: "doctor", label: "Doctor" },
    { key: "stay", label: "Stay" },
    { key: "amount", label: "Amount" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            statusClass[value as Status]
          }`}
        >
          {String(value)}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="mb-4 font-medium">
        Total Admissions: {admissions.length}
      </div>

      <Controltable<Admission>
        title="IPD History"
        columns={columns}
        data={admissions}
        itemsPerPage={10}
      />
    </div>
  );
}