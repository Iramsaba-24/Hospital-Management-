import { useState } from "react";
import type { PathologyTestData } from "./PathologyTest";

interface Props {
  open: boolean;
  onClose: () => void;
  data: PathologyTestData | null;
  onUpdate?: (data: PathologyTestData) => void;
  onDelete?: (id: number) => void;
}

const ViewPathologyTest = ({ open, onClose, data, onUpdate, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PathologyTestData | null>(data);
  const [showMenu, setShowMenu] = useState(false);

  // Update formData when data prop changes
  if (data && data.id !== formData?.id) {
    setFormData(data);
    setIsEditing(false);
    setShowMenu(false);
  }

  const handleInputChange = <K extends keyof PathologyTestData>(
    field: K, 
    value: PathologyTestData[K]
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && onUpdate) {
      onUpdate(formData);
      setIsEditing(false);
      setShowMenu(false);
    }
  };

  const handleDelete = () => {
    if (data && onDelete) {
      if (window.confirm(`Are you sure you want to delete "${data.testName}"?`)) {
        onDelete(data.id);
        onClose();
      }
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    setFormData(data);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
    setShowMenu(false);
  };

  if (!open) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[95%] max-w-4xl rounded max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="bg-blue-500 p-4 flex justify-between items-center rounded-t">
            <div className="flex gap-3 w-full items-center">
              <div className="text-white font-bold text-lg">
                {isEditing 
                  ? `Edit Test: ${formData?.testName || ""}` 
                  : `Test Details: ${data?.testName || ""}`
                }
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Menu Button with Three Dots */}
              {!isEditing && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ⋮
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                      
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="text-white text-2xl hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">

            {/* Test Details Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                Test Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Test Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.testName || ""}
                      onChange={(e) => handleInputChange("testName", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.testName || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Short Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.sortName || ""}
                      onChange={(e) => handleInputChange("sortName", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.sortName || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Category Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.category || ""}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.category || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Sub Category</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.subCategory || ""}
                      onChange={(e) => handleInputChange("subCategory", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.subCategory || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Method</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.method || ""}
                      onChange={(e) => handleInputChange("method", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.method || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Report Days</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData?.reportsDay || ""}
                      onChange={(e) => handleInputChange("reportsDay", Number(e.target.value))}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.reportsDay || "-"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Charge & Tax Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                Charge & Tax Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Charge Category</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.chargeCategory || "Cytopathology"}
                      onChange={(e) => handleInputChange("chargeCategory", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.chargeCategory || "Cytopathology"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Charge Name</label>
                  <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                    Surgical Pathology
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Tax Category</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.taxCategory || "Pathology Tax"}
                      onChange={(e) => handleInputChange("taxCategory", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.taxCategory || "Pathology Tax"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Tax (%)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.tax || ""}
                      onChange={(e) => handleInputChange("tax", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.tax || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Standard Charge</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={formData?.charge || ""}
                      onChange={(e) => handleInputChange("charge", Number(e.target.value))}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      ₹{formData?.charge?.toFixed(2) || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Amount</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={formData?.amount || ""}
                      onChange={(e) => handleInputChange("amount", Number(e.target.value))}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      ₹{formData?.amount?.toFixed(2) || "-"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Test Parameters Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                Charge Category Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Test Parameter Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.parameterName || "Liver Function Test"}
                      onChange={(e) => handleInputChange("parameterName", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.parameterName || "Liver Function Test"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Reference Range</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.referenceRange || "7 to 55 units per liter"}
                      onChange={(e) => handleInputChange("referenceRange", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.referenceRange || "7 to 55 units per liter"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Unit</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData?.unit || "(U/L)"}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      className="mt-1 w-full text-gray-900 bg-white p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded border">
                      {formData?.unit || "(U/L)"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show when editing */}
            {isEditing && (
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ViewPathologyTest;
