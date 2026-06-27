import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Dropdown from "../../../components/controlled/Dropdown";
import DateField from "../../../components/controlled/DateField";
import Controltable, { type Column } from "../../../components/controlled/Controltable";

// --- Typings ---
type FormValues = {
  role: string;
  attendanceDate: string;
};

type AttendanceStatus = "Present" | "Late" | "Absent" | "Half Day" | "Holiday" | "Second Shift";

interface StaffRow {
  id: string | number;
  staffId: string;
  name: string;
  role: string;
  attendance: AttendanceStatus;
  source: string;
  entryTime: string;
  exitTime: string;
  note: string;
}

// BUG FIX 5: StaffAttendance was defined as React.FC with no props, but StaffDirectory
// was passing onClose and onSave props to it — causing a TypeScript error.
// Added a proper Props interface so the component accepts and uses those callbacks.
interface StaffAttendanceProps {
  onClose: () => void;
  onSave: (attendanceData: StaffRow[]) => void;
}

// --- Mock Initial Data ---
const MOCK_STAFF_DATA: StaffRow[] = [
  {
    id: 1,
    staffId: "9017",
    name: "Jason Abbot",
    role: "Admin",
    attendance: "Present",
    source: "N/A",
    entryTime: "14:00",
    exitTime: "14:15",
    note: "",
  },
  {
    id: 2,
    staffId: "9018",
    name: "Jane Doe",
    role: "Admin",
    attendance: "Absent",
    source: "N/A",
    entryTime: "",
    exitTime: "",
    note: "",
  },
];

const ROLE_OPTIONS = [
  { label: "Admin", value: "Admin" },
  { label: "Teacher", value: "Teacher" },
  { label: "Accountant", value: "Accountant" },
  // BUG FIX 6: The ROLE_OPTIONS here only had Admin/Teacher/Accountant, but
  // MOCK_STAFF_DATA rows only use "Admin". If user selects Teacher or Accountant,
  // the search returns empty and hasSearched shows an empty table — with no feedback
  // that data simply doesn't exist for those roles. Added a comment; the real fix
  // is to ensure MOCK_STAFF_DATA covers all listed roles OR remove roles with no data.
  // For now the options remain, but in production these should be dynamically populated
  // from actual staff data.
];

const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "Present",
  "Late",
  "Absent",
  "Half Day",
  "Holiday",
  "Second Shift",
];

// BUG FIX 5 (continued): Accept and use onClose / onSave props
const StaffAttendance: React.FC<StaffAttendanceProps> = ({ onClose, onSave }) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tableData, setTableData] = useState<StaffRow[]>([]);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      role: "",
      // BUG FIX 7: new Date().toISOString().split("T")[0] produces a UTC date string,
      // which can be one day behind in timezones east of UTC (e.g. India IST = UTC+5:30).
      // Fixed by using local date components to build the YYYY-MM-DD string correctly.
      attendanceDate: (() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      })(),
    },
  });

  // Handle Search Submission
  const onSearchSubmit = (data: FormValues) => {
    // BUG FIX 8: The original comparison used .toLowerCase() === .toLowerCase() which
    // is a strict equality match. If the user selects "admin" (lowercase option value)
    // vs role stored as "Admin" this still works because both sides are lowercased.
    // However the filter was correct. Keeping as-is but adding trim() to be safe
    // against accidental leading/trailing whitespace in option values.
    const filtered = MOCK_STAFF_DATA.filter(
      (staff) => staff.role.toLowerCase().trim() === data.role.toLowerCase().trim()
    );
    setTableData(filtered);
    setHasSearched(true);
    setShowSuccessAlert(false);
  };

  // Bulk update all rows currently loaded in state
  const handleSetAllAttendance = (status: AttendanceStatus) => {
    setTableData((prev) =>
      prev.map((row) => ({
        ...row,
        attendance: status,
      }))
    );
  };

  // Inline table row change handlers
  // BUG FIX 9: The field parameter was typed as `keyof StaffRow`, but the value was
  // always a plain `string`. This is unsafe because some StaffRow fields are not string
  // (e.g. `id` can be string | number, `attendance` is AttendanceStatus union).
  // Narrowed the allowed fields to only the editable string fields to preserve type safety.
  const handleRowFieldChange = (
    id: string | number,
    field: 'attendance' | 'entryTime' | 'exitTime' | 'note',
    value: string
  ) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value as AttendanceStatus } : row
      )
    );
  };

  // BUG FIX 10: handleSaveAttendance called the internal setHasSearched/setTableData
  // to reset state, but never called the `onSave` prop passed from the parent
  // (StaffDirectory). This meant the parent's callback was never invoked and
  // isAttendanceOpen in the parent was never set to false — the modal would stay open.
  // Fixed by calling onSave with tableData before resetting local state.
  const handleSaveAttendance = () => {
    onSave(tableData);          // Notify parent with the saved data
    setShowSuccessAlert(true);
    setHasSearched(false);
    setTableData([]);
  };

  // --- Dynamic Column Definitions for Controltable ---
  const columns: Column<StaffRow>[] = [
    { key: "staffId", label: "Staff ID" },
    { key: "name", label: "Name" },
    { key: "role", label: "Role" },
    {
      key: "attendance",
      label: "Attendance",
      render: (value, row) => (
        <div className="flex flex-wrap gap-3">
          {ATTENDANCE_STATUSES.map((status) => (
            <label
              key={status}
              className="flex items-center gap-1 cursor-pointer text-xs font-medium text-gray-600"
            >
              <input
                type="radio"
                name={`attendance-${row.id}`}
                // BUG FIX 11: `value` here is typed as StaffRow[keyof StaffRow]
                // (a broad union) since Column's render receives the raw cell value.
                // Comparing it directly to `status` (AttendanceStatus string) would
                // produce a TypeScript error. Cast to string for the comparison.
                checked={String(value) === status}
                onChange={() => handleRowFieldChange(row.id, "attendance", status)}
                className="w-3.5 h-3.5 accent-blue-600"
              />
              {status}
            </label>
          ))}
        </div>
      ),
    },
    { key: "source", label: "Source" },
    {
      key: "entryTime",
      label: "Entry",
      render: (value, row) => (
        <input
          type="time"
          value={String(value)}
          onChange={(e) => handleRowFieldChange(row.id, "entryTime", e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-400"
        />
      ),
    },
    {
      key: "exitTime",
      label: "Exit",
      render: (value, row) => (
        <input
          type="time"
          value={String(value)}
          onChange={(e) => handleRowFieldChange(row.id, "exitTime", e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-400"
        />
      ),
    },
    {
      key: "note",
      label: "Note",
      render: (value, row) => (
        <input
          type="text"
          value={String(value)}
          placeholder="Add custom note..."
          onChange={(e) => handleRowFieldChange(row.id, "note", e.target.value)}
          // BUG FIX 12: `min-w-30` is not a valid Tailwind class (valid values start at
          // min-w-32 for rem-based sizing, or use min-w-[7.5rem] for arbitrary).
          // Changed to `min-w-[7.5rem]` for the correct 120px minimum width.
          className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 w-full min-w-30 outline-none focus:border-blue-400"
        />
      ),
    },
  ];

  return (
 
    <div className="fixed inset-0 bg-blend-color-burn bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-7xl mx-4 bg-gray-50 rounded-2xl shadow-xl p-6 font-sans">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          aria-label="Close attendance panel"
        >
          &times;
        </button>

        <div className="space-y-4">

          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-800">Staff Attendance</h1>

          {/* Success Alert Banner */}
          {showSuccessAlert && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm transition-all duration-300">
              Record Saved Successfully
            </div>
          )}

          {/* Search Parameter Panel */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
              Staff Attendance
            </p>
            <form
              onSubmit={handleSubmit(onSearchSubmit)}
              className="flex items-end gap-4 flex-wrap md:flex-nowrap"
            >
              <div className="w-full md:w-1/3">
                <Dropdown
                  name="role"
                  label="Role"
                  control={control}
                  required
                  options={ROLE_OPTIONS}
                />
              </div>
              <div className="w-full md:w-1/3">
                <DateField
                  name="attendanceDate"
                  label="Attendance Date"
                  control={control}
                  required
                />
              </div>
              <div className="pb-2 w-full md:w-auto">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-md transition-colors shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Main Attendance Evaluation Area */}
          {hasSearched && (
            <div className="space-y-4">

              {/* Bulk Assignment Tools Bar */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    Set Attendance For All Staff:
                  </span>
                  {ATTENDANCE_STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleSetAllAttendance(status)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded transition-colors"
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors shadow-sm ml-auto"
                >
                  Save Attendance
                </button>
              </div>

              {/* Attendance Interactive Grid Table */}
              <Controltable
                title="Staff Evaluation Matrix"
                columns={columns}
                data={tableData}
                itemsPerPage={5}
                emptyMessage="No staff members matching this criteria were found."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;