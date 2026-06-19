import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Controltable from "../../../components/controlled/Controltable";
import AddPatientForm from "./Addpatientform";

// ── Type ───────────────────────────────────────────────────────────────────────

type Patient = {
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

const initialPatients: Patient[] = [
  { id: "PI000234", uhid: "PI000234", name: "Ramesh Patil",  gender: "Male",   age: 45, mobile: "9876543210", city: "Pune",    lastVisit: "12/02/2026", status: "Active",   visits: 5 },
  { id: "PI000235", uhid: "PI000235", name: "Sunita Sharma", gender: "Female", age: 32, mobile: "9123456789", city: "Mumbai",  lastVisit: "14/02/2026", status: "Critical", visits: 3 },
  { id: "PI000236", uhid: "PI000236", name: "Amit Desai",    gender: "Male",   age: 55, mobile: "9988776655", city: "Nashik",  lastVisit: "10/02/2026", status: "Active",   visits: 8 },
  { id: "PI000237", uhid: "PI000237", name: "Priya Joshi",   gender: "Female", age: 28, mobile: "9870001234", city: "Pune",    lastVisit: "15/02/2026", status: "Inactive", visits: 1 },
  { id: "PI000238", uhid: "PI000238", name: "Ravi Kumar",    gender: "Male",   age: 60, mobile: "9765432100", city: "Solapur", lastVisit: "11/02/2026", status: "Critical", visits: 6 },
];

// ── Badge helpers ──────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  Active:   "bg-green-100 text-green-700",
  Critical: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-500",
};

const genderColors: Record<string, string> = {
  Male:   "bg-blue-100 text-blue-700",
  Female: "bg-pink-100 text-pink-700",
};

// ── UHID generator ─────────────────────────────────────────────────────────────

const generateUhid = (patients: Patient[]) => {
  const last = patients[patients.length - 1]?.uhid ?? "PI000233";
  return `PI${String(parseInt(last.replace("PI", "")) + 1).padStart(6, "0")}`;
};

// ── Page ───────────────────────────────────────────────────────────────────────

const Patient = () => {
  const [patients, setPatients]         = useState<Patient[]>(initialPatients);
  const [search, setSearch]             = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm]   = useState(false);

  // Edit modal
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [form, setForm]                     = useState<Patient | null>(null);

  // ── Filter ────────────────────────────────────────────────────────────────
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

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const handleEdit = (id: string | number) => {
    const patient = patients.find((p) => p.id === id);
    if (!patient) return;
    setEditingPatient(patient);
    setForm({ ...patient });
  };

  const handleEditClose = () => {
    setEditingPatient(null);
    setForm(null);
  };

  const handleEditSave = () => {
    if (!form) return;
    setPatients((prev) => prev.map((p) => (p.id === form.id ? { ...form } : p)));
    toast.success(`${form.name}'s details updated successfully.`);
    handleEditClose();
  };

  const handleFormChange = (field: keyof Patient, value: string | number) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  // ── Single delete ─────────────────────────────────────────────────────────
  const handleDelete = (id: string | number) => {
    const patient = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    toast.error(`${patient?.name ?? "Patient"} removed.`);
  };

  // ── Multiple delete ───────────────────────────────────────────────────────
  const handleDeleteMultiple = (ids: (string | number)[]) => {
    const idSet = new Set(ids);
    setPatients((prev) => prev.filter((p) => !idSet.has(p.id)));
    toast.error(`${ids.length} patient${ids.length > 1 ? "s" : ""} removed.`);
  };

  // ── Add patient ───────────────────────────────────────────────────────────
  const handleAddPatient = (newPatient: Omit<Patient, "id">) => {
    const nextUhid = generateUhid(patients);
    setPatients((prev) => [...prev, { ...newPatient, id: nextUhid, uhid: nextUhid }]);
    toast.success(`${newPatient.name} added successfully.`);
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    { key: "uhid",      label: "UHID" },
    {
      key: "name", label: "Patient",
      render: (v: string) => <span className="font-semibold text-gray-800">{v}</span>,
    },
    {
      key: "gender", label: "Gender",
      render: (v: string) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${genderColors[v] ?? "bg-gray-100 text-gray-600"}`}>
          {v}
        </span>
      ),
    },
    { key: "age",       label: "Age" },
    { key: "mobile",    label: "Mobile" },
    { key: "city",      label: "City" },
    { key: "lastVisit", label: "Last Visit" },
    {
      key: "status", label: "Status",
      render: (v: string) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[v] ?? "bg-gray-100 text-gray-500"}`}>
          {v}
        </span>
      ),
    },
    { key: "visits", label: "Visits" },
  ];

  return (
    <div className="p-6">

      {/* ── Toast Container ──────────────────────────────────────── */}
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

      {/* ── Add Patient Modal ────────────────────────────────────── */}
      {showAddForm && (
        <AddPatientForm
          onClose={() => setShowAddForm(false)}
          onSave={handleAddPatient}
          nextUhid={generateUhid(patients)}
        />
      )}

      {/* ── Edit Patient Modal ───────────────────────────────────── */}
      {editingPatient && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleEditClose}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Edit Patient</h3>
              <button
                onClick={handleEditClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => handleFormChange("gender", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => handleFormChange("age", Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Mobile</label>
                <input
                  type="text"
                  value={form.mobile}
                  onChange={(e) => handleFormChange("mobile", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => handleFormChange("city", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Last Visit</label>
                <input
                  type="text"
                  value={form.lastVisit}
                  onChange={(e) => handleFormChange("lastVisit", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700"
                >
                  <option value="Active">Active</option>
                  <option value="Critical">Critical</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleEditClose}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Controltable
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
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-600"
            >
              <option value="All">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-600"
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
