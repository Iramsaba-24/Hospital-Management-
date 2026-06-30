// import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import RadioButton from "../../../../components/controlled/RadioButton";
import { type LeaveRecord, type LeaveStatus } from "./Leavetypes";

type Props = {
  record: LeaveRecord;
  onClose: () => void;
  onSave: (id: string, status: LeaveStatus, note: string) => void;
};

type FormValues = {
  status: LeaveStatus;
  note: string;
};

const fmt = (d?: string) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "2-digit", day: "2-digit", year: "numeric",
  });
};

const STATUS_OPTIONS = [
  { label: "Pending",  value: "Pending"  },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const LeaveDetailsModal = ({ record, onClose, onSave }: Props) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      status: record.status,
      note:   record.note ?? "",
    },
  });

  const formatDateRange = () => {
    const from = fmt(record.leaveFromDate);
    const to   = fmt(record.leaveToDate);
    return `${from} - ${to} (${record.days} Days)`;
  };

  const onSubmit = (data: FormValues) => {
    onSave(record.id, data.status, data.note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden max-h-[95vh] overflow-y-auto">

        <div className="bg-blue-500 px-4 md:px-5 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Details</h2>
          <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-5">

          <div className="space-y-3 text-sm">

            {/* Row 1 — mobile stack, desktop row */}
            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 w-28 shrink-0">Name</span>
                <span className="text-gray-800">{record.staff} ({record.staffId})</span>
              </div>
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 w-24 shrink-0">Leave Type</span>
                <span className="text-gray-800">{record.leaveType}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 w-28 shrink-0">Submitted By</span>
                <span className="text-gray-800">
                  {record.submittedBy ?? record.staff} ({record.staffId})
                </span>
              </div>
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 w-24 shrink-0">Date</span>
                <span className="text-gray-800">{fmt(record.applyDate)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 w-28 shrink-0">Leave</span>
                <span className="text-gray-800">{formatDateRange()}</span>
              </div>
              <div className="flex gap-3 flex-1">
                <span className="text-gray-400 w-24 shrink-0">Reason</span>
                <span className="text-gray-800">{record.reason || "—"}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-3">
              <span className="text-gray-400 w-28 shrink-0 pt-1">Status</span>
              <div className="flex-1">
                <RadioButton<FormValues>
                  name="status"
                  label=""
                  control={control}
                  options={STATUS_OPTIONS}
                  required={false}
                />
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <span className="text-gray-400 w-28 shrink-0">Download</span>
              <span className="text-gray-400 text-xs">No document</span>
            </div>

          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Note (Only display for admin)
            </label>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit(onSubmit)}
              className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LeaveDetailsModal;