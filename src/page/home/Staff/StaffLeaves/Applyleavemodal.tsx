import { FormProvider, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import DateField from "../../../../components/controlled/DateField";
import Dropdown from "../../../../components/controlled/Dropdown";
import TextField from "../../../../components/controlled/TextField";
import FileUploadField from "../../../../components/controlled/FileUploadField";
import { LEAVE_TYPES, type LeaveRecord } from "../StaffLeaves/Leavetypes";

interface ApplyLeaveFormData {
  applyDate: string;
  leaveType: string;
  leaveFromDate: string;
  leaveToDate: string;
  reason: string;
  document: File | null;
}

type Props = {
  onClose: () => void;
  onSave: (record: Omit<LeaveRecord, "id">) => void;
  staffName: string;
  staffId: string;
};

const ApplyLeaveModal = ({ onClose, onSave, staffName, staffId }: Props) => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "2-digit", day: "2-digit", year: "numeric",
  });

  const methods = useForm<ApplyLeaveFormData>({
    defaultValues: {
      applyDate: new Date().toISOString().split("T")[0],
      leaveType: "",
      leaveFromDate: "",
      leaveToDate: "",
      reason: "",
      document: null,
    },
  });

  const { handleSubmit, control } = methods;

  const calcDays = (from: string, to: string) => {
    if (!from || !to) return 0;
    const diff = new Date(to).getTime() - new Date(from).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const onSubmit = (data: ApplyLeaveFormData) => {
    onSave({
      staff: staffName,
      staffId,
      leaveType: data.leaveType,
      leaveFromDate: data.leaveFromDate,
      leaveToDate: data.leaveToDate,
      days: calcDays(data.leaveFromDate, data.leaveToDate),
      applyDate: data.applyDate,
      status: "Pending",
      reason: data.reason,
      submittedBy: staffName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl z-10 overflow-hidden max-h-[95vh] overflow-y-auto">

        <div className="bg-blue-500 px-4 md:px-5 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-base">Add Details</h2>
          <button onClick={onClose} className="text-white hover:text-blue-100 transition-colors">
            <MdClose size={20} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5 space-y-4">

            {/* Apply Date + Leave Type — mobile stack, desktop row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Apply Date
                </label>
                <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500 bg-gray-50">
                  {today}
                </div>
              </div>
              <Dropdown
                name="leaveType"
                label="Leave Type"
                required
                control={control}
                options={LEAVE_TYPES}
              />
            </div>

            {/* From Date + To Date — mobile stack, desktop row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateField<ApplyLeaveFormData>
                name="leaveFromDate"
                label="Leave From Date"
                required
                control={control}
              />
              <DateField<ApplyLeaveFormData>
                name="leaveToDate"
                label="Leave To Date"
                required
                control={control}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Reason
              </label>
              <TextField
                name="reason"
                control={control}
                placeholder=""
                inputClassName="min-h-[60px]"
              />
            </div>

            <FileUploadField<ApplyLeaveFormData>
              name="document"
              label="Attach Document"
              control={control}
              accept=".pdf,.doc,.docx,.jpg,.png"
              maxSizeInMB={5}
            />

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors"
              >
                Save
              </button>
            </div>

          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;