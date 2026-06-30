import { useForm, useWatch } from "react-hook-form";
import Dropdown from "../../../components/controlled/Dropdown";
import TextField from "../../../components/controlled/TextField";
import DateField from "../../../components/controlled/DateField";
import { useState } from "react";
import type { PathologyBill } from "./Pathology";
import type { PathologyTestData } from "./PathologyTest";
import AddPatientForm from "../Patient/Addpatientform";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (bill: PathologyBill) => void;
  tests: PathologyTestData[];
}


const GenerateBillDialog = ({
  open,
  onClose,
  onSave,
  tests,
}: Props) => {
  const {
    control,
    getValues,
    setValue,
    reset
  } = useForm();


  const [rows, setRows] = useState([0]);

  const [showPatientForm, setShowPatientForm] = useState(false);

  const [patients, setPatients] = useState([
    { name: "John Marshall" },
    { name: "Rahul Patil" },
    { name: "Pranjali Patil" },
  ]);

  const handleAdd = () => {
    setRows((prev) => [...prev, prev.length]);
  };

  const handleRemove = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTestChange = (value: string | number, index: number) => {
    const selected = tests.find(
      (test) => test.testName === value
    );

    if (!selected) return;

    setValue(`reportDays_${index}`, selected.reportsDay);
    setValue(`tax_${index}`, selected.tax);
    setValue(`amount_${index}`, selected.amount);
  };

  const values = useWatch({
    control,
  });

  if (!open) return null;

  const total = rows.reduce((sum, _, index) => {
    return sum + Number(values[`amount_${index}`] || 0);
  }, 0);

  const gst = rows.reduce((sum, _, index) => {
    const tax = Number(
      String(values[`tax_${index}`] || "0").replace("%", "")
    );

    const amount = Number(values[`amount_${index}`] || 0);

    if (isNaN(tax)) return sum;

    return sum + (amount * tax) / 100;
  }, 0);

  const netAmount = total + gst;


  const handleSaveAndPrint = () => {
    handleSave();

    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleClose = () => {
    reset();
    setRows([0]);
    onClose();
  };

  const handleSave = () => {
    const data = getValues();

    // const amount = Number(data.paymentAmount || 0);


    const uuid = crypto.randomUUID().replace(/-/g, "");

    const billNumber = uuid.slice(0, 5).toUpperCase();
    const visitId = uuid.slice(5, 9).toUpperCase();

    const newBill: PathologyBill = {
      id: Number.parseInt(uuid.slice(0, 8), 16),
      billNo: `PATH${billNumber}`,
      visitId,
      date: new Date().toLocaleString(),
      patientName: data.patientName || "",
      generatedBy: "Admin",
      doctor: data.doctorName || "",
      amount: total,
      discount: "0%",
      tax: gst.toFixed(2),
      netAmount: netAmount,
      paidAmount: Number(data.paymentAmount || 0),
      refund: 0,
      balanceAmount: 0,
    };

    onSave(newBill);
    reset();
    setRows([0]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[96%] sm:w-[94%] md:w-[90%] lg:w-[85%] max-w-6xl rounded-lg max-h-[95vh] overflow-y-auto  text-xs ">

        {/* Header */}
        <div className="bg-blue-500 p-4 flex flex-col md:flex-row md:items-center md:justify-between md:gap-3">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full">
            <div className="w-full sm:w-64">
              <Dropdown
                name="patientName"
                control={control}
                options={patients.map((p) => p.name)} label={"Patient Name"} />
            </div>

            <button
              type="button"
              className="text-white font-medium"
              onClick={() => setShowPatientForm(true)}
            >
              + New Patient
            </button>
            {showPatientForm && (
              <AddPatientForm
                onClose={() => setShowPatientForm(false)}
                onSave={(patient) => {
                  setPatients((prev) => [...prev, patient]);
                  setValue("patientName", patient.name);
                  setShowPatientForm(false);
                }}
                nextUhid="UH001"
              />
            )}
            <input
              type="text"
              placeholder="Prescription No"
              className="p-2 rounded"
            />

            <label className="flex items-center gap-2 text-white">
              <input type="checkbox" />
              Apply TPA
            </label>
          </div>

          <button
            onClick={handleClose}
            className="text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          {rows.map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4 items-end"
            >
              <Dropdown
                name={`testName_${index}`}
                label="Test Name"
                control={control}
                options={tests.map((item) => item.testName)}
                onChange={(value) => handleTestChange(value, index)}
              />

              <TextField
                name={`reportDays_${index}`}
                label="Report Days"
                control={control}
              />

              <DateField
                name={`reportDate_${index}`}
                label="Report Date"
                control={control}
              />

              <TextField
                name={`tax_${index}`}
                label="Tax"
                control={control}
              />

              <TextField
                name={`amount_${index}`}
                label="Amount"
                control={control}
              />

              <div className="flex items-end h-full -mt-15">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded w-full font-bold"
                  >
                    -
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            + Add
          </button>

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div>
              <TextField
                name="hospitalDoctor"
                label="Hospital Doctor"
                control={control}
              />

              <TextField
                name="doctorName"
                label="Doctor Name"
                control={control}
              />

              <TextField
                name="notes"
                label="Notes"
                control={control}
              />
            </div>

            <div className="border p-4 rounded">
              <div className="flex justify-between mb-2">
                <span>Total ₹</span>
                <span>{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Discount ₹</span>
                <span>0</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>GST ₹</span>
                <span>{gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Net Amount ₹</span>
                <span>{netAmount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="paymentMode"
                  label="Payment Mode"
                  control={control}
                />

                <TextField
                  name="paymentAmount"
                  label="Payment Amount"
                  control={control}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleSaveAndPrint}
              className="bg-blue-500 text-white px-6 py-2 rounded"
            >
              Save & Print
            </button>
          </div>

        </div>
      </div>
    </div >
  );
};

export default GenerateBillDialog;





