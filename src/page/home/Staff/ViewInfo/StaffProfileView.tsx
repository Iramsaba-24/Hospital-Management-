import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Import your custom standardized form inputs
import TextField from '../../../../components/controlled/TextField';
import EmailField from '../../../../components/controlled/EmailField';
import MobileField from '../../../../components/controlled/MobileField';
import NumberField from '../../../../components/controlled/NumberField';

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  image: string;
}

interface StaffProfileViewProps {
  member: StaffMember;
  onClose: () => void;
}

// Interface to type our read-only form structure
interface ProfileFormValues {
  phone: string;
  email: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  qualification: string;
  experience: string;
  panCardNo: string;
  currentAddress: string;
  permanentAddress: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

// Custom configuration to strip default styling wrappers from your inputs to maintain UI integrity
const innerInputStyles = "mt-0 block w-full px-0 py-0 border-0 rounded-none shadow-none bg-transparent text-sm text-gray-800 font-normal leading-5 focus:ring-0 focus:outline-none disabled:bg-transparent disabled:opacity-100 disabled:cursor-text";
const labelStyles = "w-40 shrink-0 text-xs text-gray-400 font-normal leading-5 mt-0.5";

const StaffProfileView = ({ member, onClose }: StaffProfileViewProps) => {
  // Initialize the form values using the member prop data
  const { control } = useForm<ProfileFormValues>({
    defaultValues: {
      phone: member.phone,
      email: `${member.name.split(' ')[0].toLowerCase()}@gmail.com`,
      gender: "Male",
      bloodGroup: "O+",
      dateOfBirth: "30 Jan 1990",
      qualification: "MS",
      experience: "7 Years",
      panCardNo: "FGFDG56657",
      currentAddress: "927 New Moon Apartment, CA",
      permanentAddress: "India",
      accountName: member.name,
      accountNumber: "57678878776",
      bankName: "IDBI Bank",
      ifscCode: "567576",
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-gray-100 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-lg shadow-2xl relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Close"
        >
          <X size={14} />
        </button>

        <div className="p-4 space-y-1">

          {/* ── HEADER HERO CARD ── */}
          <div className="bg-white rounded-md border-l-4 border-blue-500 px-6 py-5 flex flex-col md:flex-row items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
            </div>

            {/* Name + meta grid */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 mb-3">{member.name}</h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1.5 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Department</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">{member.role}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Staff ID</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">{member.id}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Work Shift</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">{member.id}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Contract Type</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">Permanent</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Role</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">{member.role}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Work Location</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">{member.role}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Designation</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">Administrator</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 text-xs w-24 shrink-0 leading-5">Date Of Joining</span>
                  <span className="text-gray-800 text-xs font-medium leading-5">09/14/2021</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── TABS BAR ── */}
          <div className="bg-white px-6 flex gap-0 text-sm border-b border-gray-200">
            {['Profile', 'Payroll', 'Leaves', 'Attendance', 'Documents', 'Timeline'].map((tab) => (
              <button
                key={tab}
                className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === 'Profile'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── SECTION 1: CORE INFO ── */}
          <div className="bg-white rounded-md px-6 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              <div>
                <MobileField 
                  name="phone" 
                  control={control} 
                  label="Phone" 
                  disabled 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="gender" 
                  control={control} 
                  label="Gender" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="dateOfBirth" 
                  control={control} 
                  label="Date Of Birth" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="experience" 
                  control={control} 
                  label="Experience" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 mb-0" 
                />
              </div>
              <div>
                <EmailField 
                  name="email" 
                  control={control} 
                  label="Email" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 

                />
                <TextField 
                  name="bloodGroup" 
                  control={control} 
                  label="Blood Group" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="qualification" 
                  control={control} 
                  label="Qualification" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="panCardNo" 
                  control={control} 
                  label="pan card No" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 mb-0" 
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 2: ADDRESS ── */}
          <div className="bg-white rounded-md px-6 py-3">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              <div>
                <TextField 
                  name="currentAddress" 
                  control={control} 
                  label="Current Address" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 mb-0" 
                />
              </div>
              <div>
                <TextField 
                  name="permanentAddress" 
                  control={control} 
                  label="Permanent Address" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 mb-0" 
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 3: BANK DETAILS ── */}
          <div className="bg-white rounded-md px-6 py-3">
            <h2 className="text-sm font-bold text-gray-800 mb-1">Bank Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              <div>
                <TextField 
                  name="accountName" 
                  control={control} 
                  label="Account Name" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="bankName" 
                  control={control} 
                  label="Bank" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 mb-0" 
                />
              </div>
              <div>
                <NumberField 
                  name="accountNumber" 
                  control={control} 
                  label="Account Number" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 border-b border-gray-100 mb-0" 
                />
                <TextField 
                  name="ifscCode" 
                  control={control} 
                  label="IFSC Code" 
                  disabled 
                  labelClassName={labelStyles} 
                  inputClassName={innerInputStyles} 
                  className="flex items-start py-2.5 mb-0" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffProfileView;