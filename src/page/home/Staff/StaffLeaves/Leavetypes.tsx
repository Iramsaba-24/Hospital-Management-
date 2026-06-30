export const LEAVE_TYPES = [
  "Casual Leave",
  "Privilege Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Fever Leave",
];

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRecord {
  id: string;
  staff: string;
  staffId: string;
  leaveType: string;
  leaveFromDate: string;
  leaveToDate: string;
  days: number;
  applyDate: string;
  status: LeaveStatus;
  approvedBy?: string;
  reason?: string;
  statusDate?: string;
  submittedBy?: string;
  note?: string;
}