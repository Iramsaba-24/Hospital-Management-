import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdClose, MdCloudUpload } from "react-icons/md";
import AadharField from "../../../components/controlled/AadharField";
import BirthDateField from "../../../components/controlled/BirthDateField";
import Dropdown from "../../../components/controlled/Dropdown";
import EmailField from "../../../components/controlled/EmailField";
import MobileField from "../../../components/controlled/MobileField";
import NameField from "../../../components/controlled/NameField";
import Button from "../../../components/controlled/Button";

type PatientData = {
  uhid: string;
  name: string;
  gender: string;
  age: number;
  mobile: string;
  city: string;
  lastVisit: string;
  status: string;
  visits: number;
  guardianName?: string;
  dob?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  email?: string;
  allergies?: string;
  remarks?: string;
  tpaProvider?: string;
  tpaId?: string;
  tpaValidity?: string;
  nationalId?: string;
};

type Props = {
  onClose: () => void;
  onSave: (patient: Omit<PatientData, "id">) => void;
  nextUhid: string;
  initialData?: PatientData | null;
};

interface FormData {
  fullName: string;
  guardianName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  maritalStatus: string;
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

const AddPatientForm = ({ onClose, onSave, nextUhid, initialData }: Props) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [, setPhotoFile] = useState<File | null>(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData;

  const methods = useForm<FormData>({
    defaultValues: {
      fullName: "",
      guardianName: "",
      gender: "",
      dob: "",
      bloodGroup: "",
      maritalStatus: "",
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

  const { handleSubmit, control, register, reset } = methods;

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.name || "",
        gender: initialData.gender || "",
        mobile: initialData.mobile || "",
        address: initialData.city || "",
        guardianName: initialData.guardianName || "",
        dob: initialData.dob || "",
        bloodGroup: initialData.bloodGroup || "",
        maritalStatus: initialData.maritalStatus || "",
        email: initialData.email || "",
        allergies: initialData.allergies || "",
        remarks: initialData.remarks || "",
        tpaProvider: initialData.tpaProvider || "",
        tpaId: initialData.tpaId || "",
        tpaValidity: initialData.tpaValidity || "",
        nationalId: initialData.nationalId || "",
      });
    }
  }, [initialData, reset]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const today = new Date();
      let age = 0;

      if (data.dob) {
        const birth = new Date(data.dob);
        const yearDiff = today.getFullYear() - birth.getFullYear();
        const notYetHadBirthday =
          today.getMonth() < birth.getMonth() ||
          (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
        age = notYetHadBirthday ? yearDiff - 1 : yearDiff;
      } else if (isEditMode && initialData?.age) {
        age = initialData.age;
      }

      const compiledData: Omit<PatientData, "id"> = {
        uhid: nextUhid,
        name: data.fullName,
        gender: data.gender,
        age,
        mobile: data.mobile,
        city: data.address,
        lastVisit: initialData?.lastVisit || today.toLocaleDateString("en-GB"),
        status: initialData?.status || "Active",
        visits: initialData?.visits ?? 1,
        guardianName: data.guardianName,
        dob: data.dob,
        bloodGroup: data.bloodGroup,
        maritalStatus: data.maritalStatus,
        email: data.email,
        allergies: data.allergies,
        remarks: data.remarks,
        tpaProvider: data.tpaProvider,
        tpaId: data.tpaId,
        tpaValidity: data.tpaValidity,
        nationalId: data.nationalId,
      };

      onSave(compiledData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bloodGroupOptions = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
  const tpaProviderOptions = ["Star Health", "ICICI Lombard", "Bajaj Allianz", "HDFC Ergo", "New India Assurance"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-100 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Modify Patient Details" : "Add New Patient"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdClose size={22} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">

            {/* ── Personal Information ── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">UHID </label>
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
                    control={control}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <NameField
                    name="guardianName"
                    label="Guardian Name"
                    required={false}
                    control={control}
                    placeholder="Enter guardian name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div>
                  <Dropdown
                    name="gender"
                    label="Gender"
                    required={true}
                    control={control}
                    options={["Male", "Female", "Other"]}
                  />
                </div>
                <div>
                  <BirthDateField
                    name="dob"
                    label="Date of Birth"
                    required={!isEditMode}
                    control={control}
                  />
                </div>
                <div>
                  <Dropdown
                    name="bloodGroup"
                    label="Blood Group"
                    required={false}
                    control={control}
                    options={bloodGroupOptions}
                  />
                </div>
                <div>
                  <Dropdown
                    name="maritalStatus"
                    label="Marital Status"
                    required={false}
                    control={control}
                    options={maritalStatusOptions}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Patient Photo</label>
                  <label
                    className="w-full border border-gray-200 rounded-lg text-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
                    style={{ minHeight: "66px" }}
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="preview"
                        className="w-full h-16 object-cover rounded-lg"
                      />
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
                    control={control}
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <EmailField
                    name="email"
                    label="Email"
                    required={false}
                    control={control}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <NameField
                    name="address"
                    label="Address"
                    required={false}
                    control={control}
                    placeholder="Street, City"
                  />
                </div>
              </div>
            </div>

            {/* ── Medical Information ── */}
            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Medical Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Known Allergies</label>
                  <input
                    type="text"
                    {...register("allergies")}
                    placeholder="e.g. Penicillin, Pollen"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Remarks</label>
                  <input
                    type="text"
                    {...register("remarks")}
                    placeholder="Any additional notes"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Insurance/TPA
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Dropdown
                    name="tpaProvider"
                    label="TPA Provider"
                    required={false}
                    control={control}
                    options={tpaProviderOptions}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">TPA ID</label>
                  <input
                    type="text"
                    {...register("tpaId")}
                    placeholder="Enter TPA ID"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">TPA Validity</label>
                  <input
                    type="date"
                    {...register("tpaValidity")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                Identification
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <AadharField
                    name="nationalId"
                    control={control}
                    label="National ID / Aadhaar"
                    required={false}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 flex justify-end gap-3">
              <Button
                name="Cancel"
                type="button"
                clr="#64748b"
                loading={false}
                onClick={onClose}
                showAlways={true}
              />
              <Button
                name={isEditMode ? "Update" : "Save Patient"}
                type="submit"
                loading={isSubmitting}
                showAlways={true}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddPatientForm;