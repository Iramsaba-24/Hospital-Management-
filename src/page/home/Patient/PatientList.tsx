import { useState } from "react";
import { MdEdit, MdDelete, MdPersonAdd } from "react-icons/md";

const patients = [
  { uhid: "PI000234", name: "Ramesh Patil", gender: "Male", age: 45, mobile: "9876543210", city: "Pune", lastVisit: "12/02/2026", status: "Active", visits: 5 },
  { uhid: "PI000235", name: "Sunita Sharma", gender: "Female", age: 32, mobile: "9123456789", city: "Mumbai", lastVisit: "14/02/2026", status: "Critical", visits: 3 },
  { uhid: "PI000236", name: "Amit Desai", gender: "Male", age: 55, mobile: "9988776655", city: "Nashik", lastVisit: "10/02/2026", status: "Active", visits: 8 },
  { uhid: "PI000237", name: "Priya Joshi", gender: "Female", age: 28, mobile: "9870001234", city: "Pune", lastVisit: "15/02/2026", status: "Inactive", visits: 1 },
  { uhid: "PI000238", name: "Ravi Kumar", gender: "Male", age: 60, mobile: "9765432100", city: "Solapur", lastVisit: "11/02/2026", status: "Critical", visits: 6 },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Critical: "bg-yellow-100 text-yellow-700",
  Inactive: "bg-gray-100 text-gray-500",
};

const genderColors: Record<string, string> = {
  Male: "bg-blue-100 text-blue-700",
  Female: "bg-pink-100 text-pink-700",
};

const Patient = () => {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.includes(search) ||
      p.mobile.includes(search);
    const matchGender = genderFilter === "All" || p.gender === genderFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchGender && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">Patient List</h2>
            <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              {patients.length} Patients
            </span>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <MdPersonAdd size={18} />
            Add Patient
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <input
            type="text"
            placeholder="Search by UHID, name, mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 outline-none focus:border-blue-400"
          />

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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-left">
                <th className="pb-3 font-medium">UHID</th>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Gender</th>
                <th className="pb-3 font-medium">Age</th>
                <th className="pb-3 font-medium">Mobile</th>
                <th className="pb-3 font-medium">City</th>
                <th className="pb-3 font-medium">Last Visit</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Visits</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-gray-500">{p.uhid}</td>
                  <td className="py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${genderColors[p.gender]}`}>
                      {p.gender}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{p.age}</td>
                  <td className="py-3 text-gray-600">{p.mobile}</td>
                  <td className="py-3 text-gray-600">{p.city}</td>
                  <td className="py-3 text-gray-500">{p.lastVisit}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-center text-gray-600">{p.visits}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors">
                        <MdEdit size={16} />
                      </button>
                      <button className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors">
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">No patients found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patient;