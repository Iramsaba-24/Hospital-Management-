import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Shared Custom Component Imports
import Button from "../../../components/controlled/Button"; 
import TextField from "../../../components/controlled/TextField"; 
import Controltable, { type Column } from "../../../components/controlled/Controltable"; // Imported Column type
import AddPatientForm from "./Addpatientform";
import PatientDetails from "../Patient/PatientDetails/PatientDetails";

// ── Types ──────────────────────────────────────────────────────────────────────
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

// ── Initial data ───────────────────────────────────────────────────────────────
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

// ── Main Page Component ────────────────────────────────────────────────────────
const Patient = () => {
  const [patients, setPatients]         = useState<PatientData[]>(initialPatients);
  const [search, setSearch]             = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm]   = useState(false);
  const [isSaving, setIsSaving]         = useState(false); 

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);

  // Initialize React Hook Form for Edit Modal inputs
  const { control, handleSubmit, reset } = useForm<PatientData>();

  // Sync form values whenever a different user item is loaded into the editor
  useEffect(() => {
    if (editingPatient) {
      reset(editingPatient);
    }
  }, [editingPatient, reset]);

  if (selectedPatientId !== null) {
    return (
      <PatientDetails
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  // ── Filter Data ───────────────────────────────────────────────────────────
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

  // ── Action Handlers ───────────────────────────────────────────────────────
  const handleEdit = (id: string | number) => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) return;
    setEditingPatient(patient);
  };

  const handleEditClose = () => {
    setEditingPatient(null);
    reset();
  };

  const handleEditSave = (data: PatientData) => {
    setIsSaving(true);
    setTimeout(() => {
      setPatients((prev) => prev.map((p) => (p.id === data.id ? { ...data } : p)));
      toast.success(`${data.name}'s details updated successfully.`);
      setIsSaving(false);
      handleEditClose();
    }, 400);
  };

  const handleDelete = (id: string | number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDeleteMultiple = (ids: (string | number)[]) => {
    const idSet = new Set(ids);
    setPatients((prev) => prev.filter((p) => !idSet.has(p.id)));
  };

  const handleAddPatient = (newPatient: Omit<PatientData, "id">) => {
    const nextUhid = generateUhid(patients);
    setPatients((prev) => [...prev, { ...newPatient, id: nextUhid, uhid: nextUhid }]);
  };

  // Fixed Column signature typing mismatch to line up precisely with Controltable definitions
  const columns: Column<PatientData>[] = [
    { key: "uhid", label: "UHID" },
    {
      key: "name",
      label: "Patient",
      render: (v, row) => (
        <button
          type="button"
          onClick={() => setSelectedPatientId(row.id)}
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
        >
          {String(v)}
        </button>
      ),
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

  return (
    <div className="p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* ── Add Patient Modal ── */}
      {showAddForm && (
        <AddPatientForm
          onClose={() => setShowAddForm(false)}
          onSave={handleAddPatient}
          nextUhid={generateUhid(patients)}
        />
      )}

      {/* ── Edit Patient Modal ── */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleEditClose} />
          
          <form 
            onSubmit={handleSubmit(handleEditSave)} 
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 z-10"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Edit Patient</h3>
              <button
                type="button"
                onClick={handleEditClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="col-span-2">
                <TextField
                  name="name"
                  label="Full Name"
                  control={control}
                  required
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Gender</label>
                <select
                  {...control.register("gender")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <TextField
                  name="age"
                  label="Age"
                  type="number"
                  control={control}
                  required
                />
              </div>

              <div>
                <TextField
                  name="mobile"
                  label="Mobile"
                  control={control}
                  required
                />
              </div>

              <div>
                <TextField
                  name="city"
                  label="City"
                  control={control}
                  required
                />
              </div>

              <div className="col-span-2">
                <TextField
                  name="lastVisit"
                  label="Last Visit"
                  control={control}
                  required
                />
              </div>

              <div className="col-span-2 mt-1">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select
                  {...control.register("status")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Critical">Critical</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleEditClose}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              
              <Button
                name="Save Changes"
                type="submit"
                loading={isSaving}
                showAlways={true}
              />
            </div>
          </form>
        </div>
      )}

      {/* Explicitly passing <PatientData> generic constraints down to cleanly align with columns data values */}
      <Controltable<PatientData>
        title="Patient List"
        totalLabel={`${patients.length} Patients`}
        columns={columns}
        data={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
        deleteMultipleLabel="Delete Selected"
        addButtonLabel="+ Add Patient"
        onAddClick={() => setShowAddForm(true)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by UHID, name, mobile"
        filterSlot={
          <>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-600 bg-white cursor-pointer"
            >
              <option value="All">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-600 bg-white cursor-pointer"
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