import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Controltable, { type ActionButton, type Column } from "../../../../components/controlled/Controltable";
import LeaveDetailsModal from "../../Staff/StaffLeaves/Leavedetailsmodal";
import { type LeaveRecord, type LeaveStatus } from "../StaffLeaves/Leavetypes";

type Props = {
  records: LeaveRecord[];
  onAddLeaveRequest: () => void;
  onUpdateStatus: (id: string, status: LeaveStatus, note: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
};

const statusStyle = (status: LeaveStatus) => {
  if (status === "Approved") return "bg-green-500 text-white";
  if (status === "Rejected") return "bg-red-500 text-white";
  return "bg-orange-400 text-white";
};

const statusLabel = (r: LeaveRecord) => {
  if (r.status === "Approved" && r.approvedBy) return `Approve By ${r.approvedBy}`;
  if (r.status === "Rejected" && r.approvedBy) return `Disapproved By ${r.approvedBy}`;
  return "Pending Approval";
};

const fmt = (d?: string) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "2-digit", day: "2-digit", year: "numeric",
  });
};

const ApproveLeaveRequest = ({
  records,
  onAddLeaveRequest,
  onUpdateStatus,
  onDelete,
  onBack,
}: Props) => {
  const [search,         setSearch]         = useState("");
  const [selectedRecord, setSelectedRecord] = useState<LeaveRecord | null>(null);

  const columns: Column<LeaveRecord>[] = [
    {
      key: "staff",
      label: "Staff",
      render: (_, r) => `${r.staff} (${r.staffId})`,
    },
    { key: "leaveType", label: "Leave Type" },
    {
      key: "leaveFromDate",
      label: "Leave Date",
      render: (_, r) => (
        <span className="text-xs text-gray-600">
          {fmt(r.leaveFromDate)} – {fmt(r.leaveToDate)}
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
      render: (_, r) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${statusStyle(r.status)}`}>
          {statusLabel(r)}
        </span>
      ),
    },
    {
      key: "statusDate",
      label: "Status Date",
      render: (v) => fmt(v as string | undefined),
    },
  ];

  const actions: ActionButton<LeaveRecord>[] = [
    {
      label: "Edit",
      icon: <MdEdit size={13} />,
      onClick: (row) => setSelectedRecord(row),
      className: "w-6 h-6 rounded border border-green-400 bg-green-50 flex items-center justify-center text-green-500 hover:bg-green-100 transition-colors",
    },
    {
      label: "Delete",
      icon: <MdDelete size={13} />,
      onClick: (row) => onDelete(row.id as string),
      className: "w-6 h-6 rounded border border-red-300 bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors",
    },
  ];

  const filtered = records.filter((r) =>
    r.staff.toLowerCase().includes(search.toLowerCase()) ||
    r.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 md:p-6 min-h-full bg-gray-50">

      {/* Header — mobile stack, desktop row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <button
          onClick={onBack}
          className="text-sm text-blue-500 hover:underline self-start"
        >
          Back to My Leaves
        </button>
        <button
          onClick={onAddLeaveRequest}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded transition-colors self-start md:self-auto"
        >
          Add Leave Request
        </button>
      </div>

      <div className="overflow-x-auto">
        <Controltable
          title="Approve Leave Request"
          columns={columns}
          data={filtered}
          actions={actions}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search..."
          emptyMessage="No leave requests found."
          itemsPerPage={10}
        />
      </div>

      {selectedRecord && (
        <LeaveDetailsModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSave={(id, status, note) => {
            onUpdateStatus(id, status, note);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default ApproveLeaveRequest;