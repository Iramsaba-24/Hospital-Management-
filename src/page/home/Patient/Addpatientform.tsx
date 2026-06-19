import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdClose, MdCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import AadharField from "../../../components/controlled/AadharField";
import BirthDateField from "../../../components/controlled/BirthDateField";
import Dropdown from "../../../components/controlled/Dropdown";
import EmailField from "../../../components/controlled/EmailField";
import MobileField from "../../../components/controlled/MobileField";
import NameField from "../../../components/controlled/NameField";

type Patient = {
  uhid: string;
  name: string;
  gender: string;
  age: number;
  mobile: string;
  city: string;
  lastVisit: string;
  status: string;
  visits: number;
};

type Props = {
  onClose: () => void;
  onSave: (patient: Patient) => void;
  nextUhid: string;
};

interface FormData {
  fullName: string;
  guardianName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  maritalStatus: string;
  photo: File | null;
  mobile: string;
  email: string;
  address: string;
  allergies: string;
  remarks: string;
  tpaProvider: string;
  tpaId: string;
  tpaValidity: string;
  nationalId: string;
}

const AddPatientForm = ({ onClose, onSave, nextUhid }: Props) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const methods = useForm<FormData>({
    defaultValues: {
      fullName: "",
      guardianName: "",
      gender: "",
      dob: "",
      bloodGroup: "",
      maritalStatus: "",
      photo: null,
      mobile: "",
      email: "",
      address: "",
      allergies: "",
      remarks: "",
      tpaProvider: "",
      tpaId: "",
      tpaValidity: "",
      nationalId: "",
    },
  });

  const { handleSubmit, setValue, control } = methods;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("photo", file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = (data: FormData) => {
    const today = new Date();
    const birth = new Date(data.dob);
    const age = today.getFullYear() - birth.getFullYear();

    const newPatient: Patient = {
      uhid: nextUhid,
      name: data.fullName,
      gender: data.gender,
      age: age,
      mobile: data.mobile,
      city: data.address.split(",").pop()?.trim() || "—",
      lastVisit: today.toLocaleDateString("en-GB").replace(/\//g, "/"),
      status: "Active",
      visits: 1,
    };

    onSave(newPatient);
    // Toast is fired from parent (Patient.tsx) after onSave completes
    onClose();
  };

  const onError = () => {
    toast.error("Please fill in all required fields.");
  };

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const tpaProviderOptions = [
    "Star Health",
    "ICICI Lombard",
    "HDFC Ergo",
    "Bajaj Allianz",
    "New India",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-gray-800">Add New Patient</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdClose size={22} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="px-6 pb-6 space-y-4">
            {/* ── Personal Information ──────────────────────────────── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Personal Information
              </h3>

              {/* Row 1: UHID, Full Name, Guardian Name */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">UHID *</label>
                  <input
                    type="text"
                    value={nextUhid}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <NameField
                    name="fullName"
                    label="Full Name"
                    required={true}
                    control={control as any}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <NameField
                    name="guardianName"
                    label="Guardian Name"
                    required={false}
                    control={control as any}
                    placeholder="Enter guardian name"
                  />
                </div>
              </div>

              {/* Row 2: Gender, DOB, Blood Group, Marital Status, Photo */}
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <Dropdown
                    name="gender"
                    label="Gender"
                    required={true}
                    control={control as any}
                    options={["Male", "Female", "Other"]}
                  />
                </div>
                <div>
                  <BirthDateField
                    name="dob"
                    label="Date of Birth"
                    required={true}
                    control={control as any}
                  />
                </div>
                <div>
                  <Dropdown
                    name="bloodGroup"
                    label="Blood Group"
                    required={false}
                    control={control as any}
                    options={bloodGroupOptions}
                  />
                </div>
                <div>
                  <Dropdown
                    name="maritalStatus"
                    label="Marital Status"
                    required={false}
                    control={control as any}
                    options={maritalStatusOptions}
                  />
                </div>
                {/* Photo upload */}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Patient Photo</label>
                  <label
                    className="w-full border border-gray-200 rounded-lg text-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                    style={{ minHeight: "66px" }}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-16 object-cover rounded-lg" />
                    ) : (
                      <span className="flex flex-col items-center gap-1 py-2 text-gray-400">
                        <MdCloudUpload size={18} />
                        <span className="text-xs">Upload</span>
                      </span>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  </label>
                </div>
              </div>
            </div>

            {/* ── Contact Information ───────────────────────────────── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <MobileField
                    name="mobile"
                    label="Mobile Number"
                    required={true}
                    control={control as any}
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <EmailField
                    name="email"
                    label="Email"
                    required={false}
                    control={control as any}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <NameField
                    name="address"
                    label="Address"
                    required={false}
                    control={control as any}
                    placeholder="Street, City"
                  />
                </div>
              </div>
            </div>

            {/* ── Medical Information ───────────────────────────────── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Medical Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <NameField
                    name="allergies"
                    label="Known Allergies"
                    required={false}
                    control={control as any}
                    placeholder="e.g. Penicillin, Dust"
                  />
                </div>
                <div>
                  <NameField
                    name="remarks"
                    label="Remarks"
                    required={false}
                    control={control as any}
                    placeholder="Any notes"
                  />
                </div>
              </div>
            </div>

            {/* ── Insurance / TPA ───────────────────────────────────── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Insurance / TPA
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Dropdown
                    name="tpaProvider"
                    label="TPA Provider"
                    required={false}
                    control={control as any}
                    options={tpaProviderOptions}
                  />
                </div>
                <div>
                  <NameField
                    name="tpaId"
                    label="TPA ID"
                    required={false}
                    control={control as any}
                    placeholder="TPA card number"
                  />
                </div>
                <div>
                  <BirthDateField
                    name="tpaValidity"
                    label="TPA Validity"
                    required={false}
                    control={control as any}
                  />
                </div>
              </div>
            </div>

            {/* ── Identification ────────────────────────────────────── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Identification
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AadharField
                    name="nationalId"
                    label="National ID / Aadhaar"
                    required={false}
                    control={control as any}
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end mt-5">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Save Patient
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddPatientForm;