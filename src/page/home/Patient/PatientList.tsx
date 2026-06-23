import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Controltable, { type Column } from "../../../components/controlled/Controltable";
import PatientDetails from "../Patient/PatientDetails/PatientDetails";
import AddPatientForm from "./Addpatientform";

type PatientData = {
  id: string;
  uhid: string;
  name: string;
  gender: string;
  age: number;
  mobile: string;
  city: string;
  lastVisit: string;
  status: string;
  visits: number;
};

const initialPatients: PatientData[] = [
  { id: "PI000234", uhid: "PI000234", name: "Ramesh Patil",  gender: "Male",   age: 45, mobile: "9876543210", city: "Pune",    lastVisit: "12/02/2026", status: "Active",   visits: 5 },
  { id: "PI000235", uhid: "PI000235", name: "Sunita Sharma", gender: "Female", age: 32, mobile: "9123456789", city: "Mumbai",  lastVisit: "14/02/2026", status: "Critical", visits: 3 },
  { id: "PI000236", uhid: "PI000236", name: "Amit Desai",    gender: "Male",   age: 55, mobile: "9988776655", city: "Nashik",  lastVisit: "10/02/2026", status: "Active",   visits: 8 },
  { id: "PI000237", uhid: "PI000237", name: "Priya Joshi",   gender: "Female", age: 28, mobile: "9870001234", city: "Pune",    lastVisit: "15/02/2026", status: "Inactive", visits: 1 },
  { id: "PI000238", uhid: "PI000238", name: "Ravi Kumar",    gender: "Male",   age: 60, mobile: "9765432100", city: "Solapur", lastVisit: "11/02/2026", status: "Critical", visits: 6 },
];

const statusColors: Record<string, string> = {
  Active:   "bg-green-100 text-green-700",
  Critical: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-500",
};

const genderColors: Record<string, string> = {
  Male:   "bg-blue-100 text-blue-700",
  Female: "bg-pink-100 text-pink-700",
};

const generateUhid = (patients: PatientData[]) => {
  const last = patients[patients.length - 1]?.uhid ?? "PI000233";
  return `PI${String(parseInt(last.replace("PI", "")) + 1).padStart(6, "0")}`;
};

const Patient = () => {

  const [patients, setPatients]         = useState<PatientData[]>(initialPatients);
  const [search, setSearch]             = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm]   = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);


  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.includes(search) ||
      p.mobile.includes(search);
    return (
      matchSearch &&
      (genderFilter === "All" || p.gender === genderFilter) &&
      (statusFilter === "All" || p.status === statusFilter)
    );
  });

  const handleEdit = (id: string | number) => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) {
      toast.error("Could not find that patient to edit.");
      return;
    }
    setEditingPatient(patient);
  };

  const handleEditSave = (updatedData: Omit<PatientData, "id">) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === editingPatient?.id ? { ...p, ...updatedData, id: p.id } : p
      )
    );
    toast.success(`${updatedData.name}'s details updated successfully.`);
    setEditingPatient(null);
  };

  const handleDelete = (id: string | number) => {
    const patient = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (patient) {
      toast.success(`${patient.name} was removed from the patient list.`);
    }
  };

  const handleDeleteMultiple = (ids: (string | number)[]) => {
    if (ids.length === 0) {
      toast.warn("Select at least one patient to delete.");
      return;
    }
    const idSet = new Set(ids);
    setPatients((prev) => prev.filter((p) => !idSet.has(p.id)));
    toast.success(`${ids.length} patient${ids.length > 1 ? "s" : ""} deleted.`);
  };

  const handleAddPatient = (newPatient: Omit<PatientData, "id">) => {
    const nextUhid = generateUhid(patients);
    setPatients((prev) => [...prev, { ...newPatient, id: nextUhid, uhid: nextUhid }]);
    toast.success(`${newPatient.name} added with UHID ${nextUhid}.`);
  };

  const columns: Column<PatientData>[] = [
    { key: "uhid", label: "UHID" },
    {
      key: "name",
      label: "Patient",
      render: (v) => <span className="font-semibold text-gray-800">{String(v)}</span>,
    },
    {
      key: "gender",
      label: "Gender",
      render: (v) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${genderColors[String(v)] ?? "bg-gray-100 text-gray-600"}`}>
          {String(v)}
        </span>
      ),
    },
    { key: "age",       label: "Age" },
    { key: "mobile",    label: "Mobile" },
    { key: "city",      label: "City" },
    { key: "lastVisit", label: "Last Visit" },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[String(v)] ?? "bg-gray-100 text-gray-500"}`}>
          {String(v)}
        </span>
      ),
    },
    { key: "visits", label: "Visits" },
  ];

  if (selectedPatientId !== null) {
    return (
      <PatientDetails
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  return (
   <div className="p-3 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {showAddForm && (
        <AddPatientForm
          onClose={() => setShowAddForm(false)}
          onSave={handleAddPatient}
          nextUhid={generateUhid(patients)}
        />
      )}

      {editingPatient && (
        <AddPatientForm
          onClose={() => setEditingPatient(null)}
          onSave={handleEditSave}
          nextUhid={editingPatient.uhid}
          initialData={editingPatient}
        />
      )}

      <Controltable<PatientData>
        title="Patient List"
        totalLabel={`${patients.length} Patients`}
        columns={columns}
        data={filtered}
        onRowClick={(row) => setSelectedPatientId(row.id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
        deleteMultipleLabel="Delete Selected"
        addButtonLabel="Add Patient"
        onAddClick={() => setShowAddForm(true)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by UHID, name, mobile"
        filterSlot={
          <>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
            >
              <option value="All">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white"
            >
              <option value="All">Status</option>
              <option value="Active">Active</option>
              <option value="Critical">Critical</option>
              <option value="Inactive">Inactive</option>
            </select>
          </>
        }
        itemsPerPage={10}
        emptyMessage="No patients found."
      />
    </div>
  );
};

export default Patient;