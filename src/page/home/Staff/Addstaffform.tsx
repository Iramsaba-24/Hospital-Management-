import { FormProvider, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import AadharField from "../../../components/controlled/AadharField";
import BirthDateField from "../../../components/controlled/BirthDateField";
import Dropdown from "../../../components/controlled/Dropdown";
import EmailField from "../../../components/controlled/EmailField";
import FileUploadField from "../../../components/controlled/FileUploadField";
// import MobileField from "../../../components/controlled/MobileField";
import NameField from "../../../components/controlled/NameField";
import NumberField from "../../../components/controlled/NumberField";
import TextField from "../../../components/controlled/TextField";
import URLInput from "../../../components/controlled/URLInput";
// import DateField from "../../../components/controlled/DateField";
import PhoneNumberField from "../../../components/controlled/PhoneNumberField";

interface StaffFormData {
  // Basic Information
  staffId: string;
  role: string;
  designation: string;
  department: string;
  specialist: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  dob: string;
  dateOfJoining: string;
  phone: string;
  emergencyContact: string;
  email: string;
  photo: File | null;
  currentAddress: string;
  permanentAddress: string;
  qualification: string;
  workExperience: string;
  specialization: string;
  note: string;
  panNumber: string;
  nationalId: string;
  localId: string;
  // Payroll
  epfNo: string;
  contractType: string;
  basicSalary: string;
  workShift: string;
  workLocation: string;
  dateOfLeaving: string;
  // Leaves
  casualLeave: string;
  privilegeLeave: string;
  sickLeave: string;
  maternityLeave: string;
  paternityLeave: string;
  feverLeave: string;
  // Bank Account
  accountTitle: string;
  bankAccountNumber: string;
  bankName: string;
  ifscCode: string;
  bankBranchName: string;
  // Social Media
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

type Props = {
  onClose: () => void;
  onSave: (data: StaffFormData) => void;
  nextStaffId: string;
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const AddStaffForm = ({ onClose, onSave, nextStaffId }: Props) => {
  const methods = useForm<StaffFormData>({
    defaultValues: {
      staffId: nextStaffId,
      role: "",
      designation: "",
      department: "",
      specialist: "",
      firstName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      gender: "",
      maritalStatus: "",
      bloodGroup: "",
      dob: "",
      dateOfJoining: "",
      phone: "",
      emergencyContact: "",
      email: "",
      photo: null,
      currentAddress: "",
      permanentAddress: "",
      qualification: "",
      workExperience: "",
      specialization: "",
      note: "",
      panNumber: "",
      nationalId: "",
      localId: "",
      epfNo: "",
      contractType: "",
      basicSalary: "",
      workShift: "",
      workLocation: "",
      dateOfLeaving: "",
      casualLeave: "",
      privilegeLeave: "",
      sickLeave: "",
      maternityLeave: "",
      paternityLeave: "",
      feverLeave: "",
      accountTitle: "",
      bankAccountNumber: "",
      bankName: "",
      ifscCode: "",
      bankBranchName: "",
      facebookUrl: "",
      twitterUrl: "",
      linkedinUrl: "",
      instagramUrl: "",
    },
  });

  const { handleSubmit, control } = methods;

  const onSubmit = (data: StaffFormData) => {
    onSave(data);
    onClose();
  };

  const roleOptions = [
    "Super Admin",
    "Doctor",
    "Nurse",
    "Pharmacist",
    "Admin",
    "Receptionist",
    "Accountant",
    "Radiologist",
    "Pathologist",
  ];
  const genderOptions = ["Male", "Female", "Other"];
  const maritalOptions = ["Single", "Married", "Divorced", "Widowed"];
  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const contractOptions = ["Full Time", "Part Time", "Contract", "Internship"];
  const shiftOptions = ["Morning", "Evening", "Night", "Rotating"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-100 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-gray-800">Add New Staff</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdClose size={22} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 pb-6 space-y-4"
          >
            <Section title="Basic Information">
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Staff ID *
                  </label>
                  <input
                    type="text"
                    value={nextStaffId}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <Dropdown
                  name="role"
                  label="Role"
                  required
                  control={control}
                  options={roleOptions}
                />
                <NameField
                  name="designation"
                  label="Designation"
                  control={control}
                  placeholder="Select"
                />
                <NameField
                  name="department"
                  label="Department"
                  control={control}
                  placeholder="Select"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <NameField
                  name="specialist"
                  label="Specialist"
                  control={control}
                  placeholder="Select Specialist"
                />
                <NameField
                  name="firstName"
                  label="First Name"
                  required
                  control={control}
                  placeholder="First Name"
                />
                <NameField
                  name="lastName"
                  label="Last Name"
                  control={control}
                  placeholder="Last Name"
                />
                <NameField
                  name="fatherName"
                  label="Father Name"
                  control={control}
                  placeholder="Father Name"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <NameField
                  name="motherName"
                  label="Mother Name"
                  control={control}
                  placeholder="Mother Name"
                />
                <Dropdown
                  name="gender"
                  label="Gender"
                  required
                  control={control}
                  options={genderOptions}
                />
                <Dropdown
                  name="maritalStatus"
                  label="Marital Status"
                  control={control}
                  options={maritalOptions}
                />
                <Dropdown
                  name="bloodGroup"
                  label="Blood Group"
                  control={control}
                  options={bloodGroupOptions}
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <BirthDateField
                  name="dob"
                  label="Date of Birth"
                  required
                  control={control}
                />
                <BirthDateField
                  name="dateOfJoining"
                  label="Date of Joining"
                  control={control}
                />
                <PhoneNumberField
                  name="phone"
                  label="Phone"
                  required
                  placeholder="Enter phone number"
                />

                <PhoneNumberField
                  name="emergencyContact"
                  label="Emergency Contact"
                  placeholder="Enter emergency contact"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="col-span-1">
                  <EmailField
                    name="email"
                    label="Email"
                    required
                    control={control}
                    placeholder="admin@gmail.com"
                  />
                </div>
                <div className="col-span-1">
                  <FileUploadField<StaffFormData>
                    name="photo"
                    label="Photo"
                    control={control}
                    accept="image/*"
                    maxSizeInMB={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <NameField
                  name="currentAddress"
                  label="Current Address"
                  control={control}
                  placeholder="Current Address"
                />
                <NameField
                  name="permanentAddress"
                  label="Permanent Address"
                  control={control}
                  placeholder="Permanent Address"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <NameField
                  name="qualification"
                  label="Qualification"
                  control={control}
                  placeholder="e.g. MS"
                />
                <NameField
                  name="workExperience"
                  label="Work Experience"
                  control={control}
                  placeholder="e.g. 10"
                />
                <NameField
                  name="specialization"
                  label="Specialization"
                  control={control}
                  placeholder="Specialization"
                />
                <NameField
                  name="note"
                  label="Note"
                  control={control}
                  placeholder="Note"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <NumberField
                  name="panNumber"
                  label="Pan Number"
                  control={control}
                  placeholder="PAN Number"
                />
                <AadharField
                  name="nationalId"
                  label="National Identification Number"
                  control={control}
                  placeholder="Aadhaar / National ID"
                />
                <NumberField
                  name="localId"
                  label="Local Identification Number"
                  control={control}
                  placeholder="Local ID"
                />
              </div>
            </Section>

            <Section title="Payroll">
              <div className="grid grid-cols-4 gap-4 mb-3">
                <NumberField
                  name="epfNo"
                  label="EPF No"
                  control={control}
                  placeholder="EPF Number"
                />
                <Dropdown
                  name="contractType"
                  label="Contract Type"
                  control={control}
                  options={contractOptions}
                />
                <NumberField
                  name="basicSalary"
                  label="Basic Salary"
                  control={control}
                  placeholder="Salary amount"
                />
                <Dropdown
                  name="workShift"
                  label="Work Shift"
                  control={control}
                  options={shiftOptions}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <NameField
                  name="workLocation"
                  label="Work Location"
                  control={control}
                  placeholder="Location"
                />
                <BirthDateField
                  name="dateOfLeaving"
                  label="Date of Leaving"
                  control={control}
                />
              </div>
            </Section>

            <Section title="Leaves">
              <div className="grid grid-cols-6 gap-4">
                <NumberField
                  name="casualLeave"
                  label="Casual Leave"
                  control={control}
                  placeholder="0"
                />
                <NumberField
                  name="privilegeLeave"
                  label="Privilege Leave"
                  control={control}
                  placeholder="0"
                />
                <NumberField
                  name="sickLeave"
                  label="Sick Leave"
                  control={control}
                  placeholder="0"
                />
                <NumberField
                  name="maternityLeave"
                  label="Maternity Leave"
                  control={control}
                  placeholder="0"
                />
                <NumberField
                  name="paternityLeave"
                  label="Paternity Leave"
                  control={control}
                  placeholder="0"
                />
                <NumberField
                  name="feverLeave"
                  label="Fever Leave"
                  control={control}
                  placeholder="0"
                />
              </div>
            </Section>

            <Section title="Bank Account Details">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <NameField
                  name="accountTitle"
                  label="Account Title"
                  control={control}
                  placeholder="Account Title"
                />
                <TextField
                  name="bankAccountNumber"
                  label="Bank Account Number"
                  control={control}
                  placeholder="Account Number"
                />
                <NameField
                  name="bankName"
                  label="Bank Name"
                  control={control}
                  placeholder="Bank Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="ifscCode"
                  label="IFSC Code"
                  control={control}
                  placeholder="IFSC Code"
                />
                <NameField
                  name="bankBranchName"
                  label="Bank Branch Name"
                  control={control}
                  placeholder="Branch Name"
                />
              </div>
            </Section>

            <Section title="Social Media Links">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <URLInput
                  name="facebookUrl"
                  label="Facebook URL"
                  control={control}
                  placeholder="https://facebook.com/..."
                />
                <URLInput
                  name="twitterUrl"
                  label="Twitter URL"
                  control={control}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <URLInput
                  name="linkedinUrl"
                  label="LinkedIn URL"
                  control={control}
                  placeholder="https://linkedin.com/..."
                />
                <URLInput
                  name="instagramUrl"
                  label="Instagram URL"
                  control={control}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </Section>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
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

export default AddStaffForm;
