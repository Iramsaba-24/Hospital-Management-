import { useState } from "react";
import { MdClose, MdCloudUpload } from "react-icons/md";

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

const emptyForm = {
  fullName: "",
  guardianName: "",
  gender: "",
  dob: "",
  bloodGroup: "",
  maritalStatus: "",
  photo: null as File | null,
  mobile: "",
  email: "",
  address: "",
  allergies: "",
  remarks: "",
  tpaProvider: "",
  tpaId: "",
  tpaValidity: "",
  nationalId: "",
};

const AddPatientForm = ({ onClose, onSave, nextUhid }: Props) => {
  const [form, setForm] = useState(emptyForm);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim())  newErrors.fullName = "Full name is required";
    if (!form.gender)           newErrors.gender   = "Gender is required";
    if (!form.dob)              newErrors.dob      = "Date of birth is required";
    if (!form.mobile.trim())    newErrors.mobile   = "Mobile number is required";
    return newErrors;
  };

  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calculate age from DOB
    const today = new Date();
    const birth = new Date(form.dob);
    const age = today.getFullYear() - birth.getFullYear();

    // Build patient object matching the Patient type in the list
    const newPatient: Patient = {
      uhid:      nextUhid,
      name:      form.fullName,
      gender:    form.gender,
      age:       age,
      mobile:    form.mobile,
      city:      form.address.split(",").pop()?.trim() || "—",
      lastVisit: today.toLocaleDateString("en-GB").replace(/\//g, "/"),
      status:    "Active",
      visits:    1,
    };

    onSave(newPatient);
    onClose();
  };

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

        <div className="px-6 pb-6 space-y-4">

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
                <label className="text-xs font-medium text-gray-500 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 ${errors.fullName ? "border-red-400" : "border-gray-200"}`}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Guardian Name</label>
                <input
                  type="text"
                  value={form.guardianName}
                  onChange={(e) => handleChange("guardianName", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="Enter guardian name"
                />
              </div>
            </div>

            {/* Row 2: Gender, DOB, Blood Group, Marital Status, Photo */}
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Gender *</label>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700 ${errors.gender ? "border-red-400" : "border-gray-200"}`}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Date of Birth *</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 ${errors.dob ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => handleChange("bloodGroup", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700"
                >
                  <option value="">Select</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Marital Status</label>
                <select
                  value={form.maritalStatus}
                  onChange={(e) => handleChange("maritalStatus", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              {/* Photo upload */}
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Patient Photo</label>
                <label className="w-full border border-gray-200 rounded-lg text-sm flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden"
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
                <label className="text-xs font-medium text-gray-500 mb-1 block">Mobile Number *</label>
                <input
                  type="text"
                  value={form.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 ${errors.mobile ? "border-red-400" : "border-gray-200"}`}
                  placeholder="10-digit number"
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="example@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
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
                <label className="text-xs font-medium text-gray-500 mb-1 block">Known Allergies</label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => handleChange("allergies", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="e.g. Penicillin, Dust"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
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
                <label className="text-xs font-medium text-gray-500 mb-1 block">TPA Provider</label>
                <select
                  value={form.tpaProvider}
                  onChange={(e) => handleChange("tpaProvider", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="Star Health">Star Health</option>
                  <option value="ICICI Lombard">ICICI Lombard</option>
                  <option value="HDFC Ergo">HDFC Ergo</option>
                  <option value="Bajaj Allianz">Bajaj Allianz</option>
                  <option value="New India">New India</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">TPA ID</label>
                <input
                  type="text"
                  value={form.tpaId}
                  onChange={(e) => handleChange("tpaId", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="TPA card number"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">TPA Validity</label>
                <input
                  type="date"
                  value={form.tpaValidity}
                  onChange={(e) => handleChange("tpaValidity", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
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
                <label className="text-xs font-medium text-gray-500 mb-1 block">National ID / Aadhaar</label>
                <input
                  type="text"
                  value={form.nationalId}
                  onChange={(e) => handleChange("nationalId", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="12-digit Aadhaar number"
                />
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end mt-5">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Save Patient
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddPatientForm;