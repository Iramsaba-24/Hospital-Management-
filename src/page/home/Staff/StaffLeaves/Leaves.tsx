import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Controltable, { type ActionButton, type Column } from "../../../../components/controlled/Controltable";
import ApplyLeaveModal from "../StaffLeaves/Applyleavemodal";
import ApproveLeaveRequest from "../StaffLeaves/Approveleaverequest";
import { type LeaveRecord, type LeaveStatus } from "../StaffLeaves/Leavetypes";

const INITIAL_LEAVES: LeaveRecord[] = [
  {
    id: "L001", staff: "Super Admin", staffId: "9001",
    leaveType: "Fever Leave",
    leaveFromDate: "2026-03-30", leaveToDate: "2026-03-31",
    days: 2, applyDate: "2026-03-27", status: "Pending",
  },
  {
    id: "L002", staff: "Super Admin", staffId: "9001",
    leaveType: "Paternity Leave",
    leaveFromDate: "2026-03-23", leaveToDate: "2026-03-26",
    days: 4, applyDate: "2026-03-19", status: "Pending",
  },
  {
    id: "L003", staff: "Super Admin", staffId: "9001",
    leaveType: "Casual Leave",
    leaveFromDate: "2025-06-18", leaveToDate: "2025-06-20",
    days: 3, applyDate: "2025-06-18",
    status: "Approved",
    approvedBy: "Jason Abbot (9017)",
    statusDate: "2025-06-03",
    submittedBy: "Super Admin",
  },
];

const fmt = (d?: string) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "2-digit", day: "2-digit", year: "numeric",
  });
};

const StatusBadge = ({ r }: { r: LeaveRecord }) => {
  if (r.status === "Approved" && r.approvedBy)
    return (
      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium leading-tight text-center inline-block">
        Approved By<br />{r.approvedBy}
      </span>
    );
  if (r.status === "Rejected")
    return <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded font-medium">Rejected</span>;
  return <span className="bg-orange-400 text-white text-xs px-2.5 py-1 rounded font-medium">Pending</span>;
};

type View = "my-leaves" | "approve-request";

type Props = {
  defaultView?: View;
};

const Leaves = ({ defaultView = "my-leaves" }: Props) => {
  const [view,           setView]           = useState<View>(defaultView);
  const [leaves,         setLeaves]         = useState<LeaveRecord[]>(INITIAL_LEAVES);
  const [search,         setSearch]         = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleAddLeave = (record: Omit<LeaveRecord, "id">) => {
    const newId = `L${String(leaves.length + 1).padStart(3, "0")}`;
    setLeaves((prev) => [{ ...record, id: newId }, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: LeaveStatus, note: string) => {
    setLeaves((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r, status, note,
              approvedBy: status !== "Pending" ? "Jason Abbot (9017)" : r.approvedBy,
              statusDate: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
  };

  const handleDelete = (id: string) =>
    setLeaves((prev) => prev.filter((r) => r.id !== id));

  const columns: Column<LeaveRecord>[] = [
    {
      key: "staff",
      label: "Staff",
      render: (_, r) => <span>{r.staff} ({r.staffId})</span>,
    },
    {
      key: "leaveType",
      label: "Leave Type",
    },
    {
      key: "leaveFromDate",
      label: "Leave Date",
      render: (_, r) =>
        r.status === "Approved" ? (
          <span className="text-blue-500 underline cursor-pointer text-xs">
            {fmt(r.leaveFromDate)} - {fmt(r.leaveToDate)}
          </span>
        ) : (
          <span className="text-gray-600 text-xs">
            {fmt(r.leaveFromDate)} - {fmt(r.leaveToDate)}
          </span>
        ),
    },
    { key: "days",      label: "Days"       },
    {
      key: "applyDate",
      label: "Apply Date",
      render: (v) => fmt(v as string),
    },
    {
      key: "status",
      label: "Status",
      render: (_, r) => <StatusBadge r={r} />,
    },
  ];

  const actions: ActionButton<LeaveRecord>[] = [
    {
      label: "Edit",
      icon: <MdEdit size={13} />,
      onClick: () => {},
      className: "w-6 h-6 rounded border border-green-400 bg-green-50 flex items-center justify-center text-green-500 hover:bg-green-100 transition-colors",
    },
    {
      label: "Delete",
      icon: <MdDelete size={13} />,
      onClick: (row) => handleDelete(row.id as string),
      className: "w-6 h-6 rounded border border-red-300 bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors",
    },
  ];

  const filtered = leaves.filter((r) =>
    r.staff.toLowerCase().includes(search.toLowerCase()) ||
    r.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  if (view === "approve-request") {
    return (
      <>
        <ApproveLeaveRequest
          records={leaves}
          onAddLeaveRequest={() => setShowApplyModal(true)}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          onBack={() => setView("my-leaves")}
        />
        {showApplyModal && (
          <ApplyLeaveModal
            onClose={() => setShowApplyModal(false)}
            onSave={handleAddLeave}
            staffName="Super Admin"
            staffId="9001"
          />
        )}
      </>
    );
  }

  return (
    <div className="p-3 md:p-6 min-h-full bg-gray-50">

      {/* Header — mobile stack, desktop row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">My Leaves</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowApplyModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded transition-colors"
          >
            Apply Leave
          </button>
          <button
            onClick={() => setView("approve-request")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded transition-colors"
          >
            Approve Request
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Controltable
          title="Leave Records"
          columns={columns}
          data={filtered}
          actions={actions}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search..."
          emptyMessage="No leave records found."
          itemsPerPage={10}
        />
      </div>

      {showApplyModal && (
        <ApplyLeaveModal
          onClose={() => setShowApplyModal(false)}
          onSave={handleAddLeave}
          staffName="Super Admin"
          staffId="9001"
        />
      )}
    </div>
  );
};

export default Leaves;