import { useForm, useWatch, type FieldValues } from "react-hook-form";
import Dropdown from "../../../components/controlled/Dropdown";
import TextField from "../../../components/controlled/TextField";
import type { PathologyTestData } from "./PathologyTest";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  data: PathologyTestData | null;
  onSave?: (data: Omit<PathologyTestData, "id">) => void;
}

const AddPathologyTest = ({ open, onClose, data, onSave }: Props) => {
  const {
    control,
    reset,
    handleSubmit,
    setValue,
  } = useForm();

  const values = useWatch({
    control,
  });

  const [parameters, setParameters] = useState([0]);

  const addParameter = () => {
    setParameters((prev) => [...prev, prev.length]);
  };

  const removeParameter = (index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const charge = Number(values.standardCharge || 0);
    const tax = Number(values.tax || 0);

    if (charge > 0) {
      const amount = charge + (charge * tax) / 100;

      setValue("testAmount", amount.toFixed(2));
    }
  }, [values.standardCharge, values.tax, setValue]);
  useEffect(() => {
    if (data) {
      reset({
        testName: data.testName,
        shortName: data.sortName,
        testType: data.testType,
        category: data.category,
        subCategory: data.subCategory,
        testMethod: data.method,
        reportDeliveryDays: data.reportsDay,
        chargeCategory: data.chargeCategory || "Cytopathology",
        taxCategory: data.taxCategory || "Pathology Tax",
        tax: data.tax ? parseFloat(data.tax) : 18,
        standardCharge: data.charge,
        testAmount: data.amount,
        parameterName: data.parameterName || "Liver Function Test",
        referenceRange: data.referenceRange || "7 to 55 units per liter",
        unit: data.unit || "(U/L)",
      });
    } else {
      reset({
        testName: "",
        shortName: "",
        testType: "",
        category: "",
        subCategory: "",
        testMethod: "",
        reportDeliveryDays: "",
        chargeCategory: "",
        taxCategory: "",
        tax: "",
        standardCharge: "",
        testAmount: "",
        parameterName: "",
        referenceRange: "",
        unit: "",
      });
    }
  }, [data, reset]);

  const onSubmit = (formData: FieldValues) => {
    const newData: Omit<PathologyTestData, "id"> = {
      testName: formData.testName,
      sortName: formData.shortName,
      testType: formData.testType,
      category: formData.category,
      subCategory: formData.subCategory,
      method: formData.testMethod,
      reportsDay: Number(formData.reportDeliveryDays),
      tax: formData.tax + "%",
      charge: Number(formData.standardCharge),
      amount: Number(formData.testAmount),
      chargeCategory: formData.chargeCategory,
      taxCategory: formData.taxCategory,
      parameterName: formData.parameterName,
      referenceRange: formData.referenceRange,
      unit: formData.unit,
    };

    if (onSave) {
      onSave(newData);
    }
    onClose();
  };

  if (!open) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-xs">
        <div className="bg-white w-[95%] max-w-6xl rounded max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="bg-blue-500 p-4 flex justify-between items-center rounded-t">
            <div className="flex gap-3 w-full">
              <div className="text-white font-bold">
                {data ? "Edit Pathology Test" : "Add Pathology Test"}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-white text-2xl hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-6">

            {/* Row 1 - Test Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <TextField
                name="testName"
                label="Test Name"
                control={control}
                required
              />

              <TextField
                name="shortName"
                label="Short Name"
                control={control}
                required
              />

              <TextField
                name="testType"
                label="Test Type"
                control={control}
                required
              />

              <Dropdown
                name="category"
                label="Category"
                control={control}
                options={["Clinical Microbiology", "Hematology", "Biochemistry", "Radiology"]}
                required
              />
            </div>

            {/* Row 2 - Test Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <TextField
                name="subCategory"
                label="Sub Category"
                control={control}
                required
              />

              <TextField
                name="testMethod"
                label="Test Method"
                control={control}
                required
              />

              <TextField
                name="reportDeliveryDays"
                label="Report Delivery Days"
                type="number"
                control={control}
                required
              />

              <Dropdown
                name="chargeCategory"
                label="Charge Category"
                control={control}
                options={["Cytopathology", "Surgical Pathology", "Clinical Pathology"]}
                required
              />
            </div>

            {/* Row 3 - Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Dropdown
                name="taxCategory"
                label="Tax Category"
                control={control}
                options={["Pathology Tax", "Radiology Tax", "No Tax"]}
                required
              />

              <TextField
                name="tax"
                label="Tax (%)"
                type="number"
                control={control}
                required
              />

              <TextField
                name="standardCharge"
                label="Standard Charges (₹)"
                type="number"
                control={control}
                required
              />

              <TextField
                name="testAmount"
                label="Test Amount"
                type="number"
                control={control}
                required
              />
            </div>

            {/* Row 4 - Test Parameters */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Test Parameters
              </h3>

              {parameters.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 items-end"
                >
                  <Dropdown
                    name={`parameterName_${index}`}
                    label="Parameter Name"
                    control={control}
                    options={[
                      "Liver Function Test",
                      "Kidney Function Test",
                      "Lipid Profile",
                      "Complete Blood Count",
                    ]}
                    required
                  />

                  <TextField
                    name={`referenceRange_${index}`}
                    label="Reference Range"
                    control={control}
                    required
                  />

                  <TextField
                    name={`unit_${index}`}
                    label="Unit"
                    control={control}
                    required
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addParameter}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      +
                    </button>

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeParameter(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        -
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                {data ? "Update Test" : "Save Test"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddPathologyTest;





