import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Dropdown from "../../../components/controlled/Dropdown";
import DateField from "../../../components/controlled/DateField";
import Controltable, { type Column } from "../../../components/controlled/Controltable";
import Button from "../../../components/controlled/Button";
// Importing your newly created components
import TimeField from "../../../components/controlled/TimeField"; 
import TextareaField from "../../../components/controlled/TextareaField"; 
import { SaveIcon, SearchIcon } from "lucide-react";

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
];

const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  "Present",
  "Late",
  "Absent",
  "Half Day",
  "Holiday",
  "Second Shift",
];

const StaffAttendance: React.FC<StaffAttendanceProps> = ({ onClose, onSave }) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tableData, setTableData] = useState<StaffRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      role: "",
      attendanceDate: (() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      })(),
    },
  });

  // Inline table row change handlers
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

  // Dummy hook forms created strictly to satisfy the <Controller /> inside the table row fields
  const { control: entryTimeControl } = useForm<{ entryTime: string }>();
  const { control: exitTimeControl } = useForm<{ exitTime: string }>();
  const { control: noteControl } = useForm<{ note: string }>();

  // Handle Search Submission
  const onSearchSubmit = (data: FormValues) => {
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

  const handleSaveAttendance = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSave(tableData);
      setShowSuccessAlert(true);
      setHasSearched(false);
      setTableData([]);
      setIsSubmitting(false);
    }, 600);
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
        <TimeField
          name="entryTime"
          control={entryTimeControl}
          value={String(value)}
          onChange={(e) => handleRowFieldChange(row.id, "entryTime", e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-400 mt-0"
        />
      ),
    },
    {
      key: "exitTime",
      label: "Exit",
      render: (value, row) => (
        <TimeField
          name="exitTime"
          control={exitTimeControl}
          value={String(value)}
          onChange={(e) => handleRowFieldChange(row.id, "exitTime", e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 outline-none focus:border-blue-400 mt-0"
        />
      ),
    },
    {
      key: "note",
      label: "Note",
      render: (value, row) => (
        <TextareaField
          name="note"
          control={noteControl}
          value={String(value)}
          rows={1}
          placeholder="Add custom note..."
          onChange={(e) => handleRowFieldChange(row.id, "note", e.target.value)}
          className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 w-full min-w-32 outline-none focus:border-blue-400 mt-0 resize-y"
        />
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-blend-color-burn bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4 ">
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full">
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
                <Button 
                  type="submit" 
                  name="Search" 
                  icon={<SearchIcon size={16} />}
                  loading={false} 
                  showAlways={true}
                />
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

                <Button
                  type="button"
                  name="Save Attendance"
                  icon={<SaveIcon />}
                  loading={isSubmitting}
                  onClick={handleSaveAttendance}
                  showAlways={true}
                />
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