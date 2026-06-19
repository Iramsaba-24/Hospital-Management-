import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import Button from "../../../../components/controlled/Button"; // Adjust this relative path according to your workspace directory setup

// ── Types ──────────────────────────────────────────────────────────────────────
type VisitType = "OPD" | "IPD";

interface TimelineEntry {
  id: number;
  type: VisitType;
  title: string;
  date: string;
  subtitle: string;
  amount: number;
}

interface PatientData {
  id: string;
  name: string;
  uhid: string;
  gender: string;
  age: number;
  bloodGroup: string;
  totalVisits: number;
  opdVisits: number;
  ipdAdmissions: number;
  outstanding: number;
}

// ── Static Patient Data (shared with Patient list) ─────────────────────────────
const allPatients: PatientData[] = [
  { id: "PI000234", name: "Ramesh Patil",   uhid: "UHD-000234", gender: "Male",   age: 45, bloodGroup: "B+", totalVisits: 24, opdVisits: 18, ipdAdmissions: 6, outstanding: 12450 },
  { id: "PI000235", name: "Sunita Sharma", uhid: "UHD-000235", gender: "Female", age: 32, bloodGroup: "A+", totalVisits: 10, opdVisits: 7,  ipdAdmissions: 3, outstanding: 5200  },
  { id: "PI000236", name: "Amit Desai",    uhid: "UHD-000236", gender: "Male",   age: 55, bloodGroup: "O+", totalVisits: 18, opdVisits: 14, ipdAdmissions: 4, outstanding: 8750  },
  { id: "PI000237", name: "Priya Joshi",   uhid: "UHD-000237", gender: "Female", age: 28, bloodGroup: "B-", totalVisits: 3,  opdVisits: 3,  ipdAdmissions: 0, outstanding: 0     },
  { id: "PI000238", name: "Ravi Kumar",    uhid: "UHD-000238", gender: "Male",   age: 60, bloodGroup: "AB+",totalVisits: 20, opdVisits: 14, ipdAdmissions: 6, outstanding: 19800 },
];

const timeline: TimelineEntry[] = [
  { id: 1, type: "OPD", title: "OPD Visit",      date: "12 Feb 2026", subtitle: "Dr. Amit Singh • Viral Fever",      amount: 850   },
  { id: 2, type: "IPD", title: "IPD Admission",   date: "05 Jan 2026", subtitle: "Dengue • 4 Days Stay • General Ward",       amount: 24500 },
  { id: 3, type: "OPD", title: "OPD Visit",       date: "10 Dec 2025", subtitle: "Hypertension Follow-up",                    amount: 600   },
];

const tabs = ["Overview", "OPD History", "IPD History", "Pharmacy", "Lab", "Radiology", "Billing"];

const dotColor: Record<VisitType, string> = {
  OPD: "bg-blue-500",
  IPD: "bg-green-500",
};

const formatCurrency = (n: number) => "₹ " + n.toLocaleString("en-IN");

const fallbackPatient: PatientData = {
  id: "",
  name: "Unknown Patient",
  uhid: "—",
  gender: "—",
  age: 0,
  bloodGroup: "—",
  totalVisits: 0,
  opdVisits: 0,
  ipdAdmissions: 0,
  outstanding: 0,
};

interface PatientDetailsProps {
  patientId: string;
  onBack: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────
const PatientDetails = ({ patientId, onBack }: PatientDetailsProps) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const patient = allPatients.find((p) => p.id === patientId) ?? fallbackPatient;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">

      {/* ── Page header with back button ─────────────────────────── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <MdArrowBack size={18} />
          Back
        </button>
        <span className="text-gray-300">|</span>
        <h1 className="text-xl font-bold text-gray-800">Patient Details</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {patient.uhid} • {patient.gender} • {patient.age} Years • {patient.bloodGroup}
            </p>
          </div>
          
          {/* Replaced standard HTML buttons with your custom <Button /> Component */}
          <div className="flex gap-2">
            <Button
              name="Edit"
              type="button"
              loading={false}
              clr="#3b82f6" // Tailwind's blue-500 hexadecimal color code value
              showAlways={true}
              onClick={() => alert("Edit action clicked")}
            />
            <Button
              name="Admit"
              type="button"
              loading={false}
              clr="#22c55e" // Tailwind's green-500 hexadecimal color code value
              showAlways={true}
              onClick={() => alert("Admit action clicked")}
            />
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Visits",     value: patient.totalVisits },
            { label: "OPD Visits",      value: patient.opdVisits },
            { label: "IPD Admissions", value: patient.ipdAdmissions },
            { label: "Outstanding",    value: formatCurrency(patient.outstanding), highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="bg-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-xl font-bold ${highlight ? "text-red-500" : "text-gray-800"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Tabs ────────────────────────────────────────────────── */}
        <div className="border-b border-gray-100 mb-6">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px cursor-pointer ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-500"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Timeline (Overview tab) ──────────────────────────────── */}
        {activeTab === "Overview" && (
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gray-200" />

            <div className="flex flex-col gap-3">
              {timeline.map((entry) => (
                <div key={entry.id} className="relative">
                  <span
                    className={`absolute -left-8 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${dotColor[entry.type]}`}
                  />

                  <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {entry.title}{" "}
                        <span className="font-normal text-gray-500">• {entry.date}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{entry.subtitle}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 shrink-0 ml-4">
                      {formatCurrency(entry.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Other tabs placeholder ───────────────────────────────── */}
        {activeTab !== "Overview" && (
          <div className="flex items-center justify-center h-40 text-gray-300 text-sm">
            No data available for {activeTab}.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;