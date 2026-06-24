import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../../../components/controlled/BackButton";
import Overview from "./OverView";
import OPDHistory from "./OpdHistory";
import IPDHistory from "./IPDHistory";
import Pharmacy from "./PharmacyHistory";
import Radiology from "./RadiologyHistory";
import Billing from "./Bill";

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

interface PatientDetailsLocationState {
  patientId?: string;
  activeTab?: string;
}

const allPatients: PatientData[] = [
  { id: "PI000234", name: "Ramesh Patil",  uhid: "UHD-000234", gender: "Male",   age: 45, bloodGroup: "B+",  totalVisits: 24, opdVisits: 18, ipdAdmissions: 6, outstanding: 12450 },
  { id: "PI000235", name: "Sunita Sharma", uhid: "UHD-000235", gender: "Female", age: 32, bloodGroup: "A+",  totalVisits: 10, opdVisits: 7,  ipdAdmissions: 3, outstanding: 5200  },
  { id: "PI000236", name: "Amit Desai",    uhid: "UHD-000236", gender: "Male",   age: 55, bloodGroup: "O+",  totalVisits: 18, opdVisits: 14, ipdAdmissions: 4, outstanding: 8750  },
  { id: "PI000237", name: "Priya Joshi",   uhid: "UHD-000237", gender: "Female", age: 28, bloodGroup: "B-",  totalVisits: 3,  opdVisits: 3,  ipdAdmissions: 0, outstanding: 0     },
  { id: "PI000238", name: "Ravi Kumar",    uhid: "UHD-000238", gender: "Male",   age: 60, bloodGroup: "AB+", totalVisits: 20, opdVisits: 14, ipdAdmissions: 6, outstanding: 19800 },
];

const tabs = ["Overview", "OPD History", "IPD History", "Pharmacy", "Radiology", "Billing"];

const formatCurrency = (n: number) => "₹ " + n.toLocaleString("en-IN");

const fallbackPatient: PatientData = {
  id: "", name: "Unknown Patient", uhid: "—", gender: "—", age: 0,
  bloodGroup: "—", totalVisits: 0, opdVisits: 0, ipdAdmissions: 0, outstanding: 0,
};

interface PatientDetailsProps {
  patientId?: string;
  onBack?: () => void;
}

const PatientDetails = ({ patientId: propPatientId, onBack }: PatientDetailsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navState = location.state as PatientDetailsLocationState | null;
  const patientId = navState?.patientId ?? propPatientId ?? "";

  const [activeTab, setActiveTab] = useState<string>(() => {
    const tab = navState?.activeTab;
    if (tab && tabs.includes(tab)) return tab;
    return "Overview";
  });

  const patient = allPatients.find((p) => p.id === patientId) ?? fallbackPatient;

  const renderSelectedTab = () => {
    switch (activeTab) {
      case "Overview":    return <Overview />;
      case "OPD History": return <OPDHistory />;
      case "IPD History": return <IPDHistory />;
      case "Pharmacy":    return <Pharmacy />;
      case "Radiology":   return <Radiology />;
      case "Billing":     return <Billing />;
      default:
        return (
          <div className="flex items-center justify-center h-40 text-gray-300 text-sm">
            No data available for {activeTab}.
          </div>
        );
    }
  };

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6 font-sans">

      <div className="flex items-center gap-3 mb-4 md:mb-5">
        <BackButton onClick={handleBack} label="Back" showAlways={true} clr="#6b7280" />
      </div>

      <div className="w-full mx-auto bg-white p-4 md:p-6 rounded-xl shadow-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-5 md:mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {patient.uhid} • {patient.gender} • {patient.age} Years • {patient.bloodGroup}
            </p>
          </div>

          {/* <div className="flex gap-2">
            <Button name="Edit"  type="button" loading={false} showAlways={true} onClick={() => alert("Edit action clicked")} />
            <Button name="Admit" type="button" loading={false} clr="#22c55e" showAlways={true} onClick={() => alert("Admit action clicked")} />
          </div> */}
        </div>

        {/* Stats — mobile 2 cols, desktop 4 cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 md:mb-6">
          {[
            { label: "Total Visits",    value: patient.totalVisits },
            { label: "OPD Visits",      value: patient.opdVisits },
            { label: "IPD Admissions",  value: patient.ipdAdmissions },
            { label: "Outstanding",     value: formatCurrency(patient.outstanding), highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="bg-gray-100 rounded-xl p-3 md:p-4">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg md:text-xl font-bold ${highlight ? "text-red-500" : "text-gray-800"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="border-b border-gray-100 mb-5 md:mb-6">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px cursor-pointer ${
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

        {renderSelectedTab()}
      </div>
    </div>
  );
};

export default PatientDetails;