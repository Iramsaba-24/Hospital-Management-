import { useState } from "react";
import Controltable from "../../../components/controlled/Controltable";
import ViewPathologyTest from "./ViewPathologyTest";
import AddPathologyTest from "./AddPathologyTest";
import { pathologyTests } from "./PathologyTestData";

export interface PathologyTestData { 
  id: number;
  testName: string;
  sortName: string;
  testType: string;
  category: string;
  subCategory: string;
  method: string;
  reportsDay: number;  
  tax: string;
  charge: number;
  amount: number;
  chargeCategory?: string;
  taxCategory?: string;
  parameterName?: string;
  referenceRange?: string;
  unit?: string;
}

const PathologyTest = () => {
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<PathologyTestData | null>(null);
  const [tests, setTests] = useState(pathologyTests);

  const columns = [
    { key: "testName", label: "Test Name" },
    { key: "sortName", label: "Sort Name" },
    { key: "testType", label: "Test Type" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub Category" },
    { key: "method", label: "Method" },
    { key: "reportsDay", label: "Reports Day" },
    { key: "tax", label: "Tax" },
    { key: "charge", label: "Charge" },
    { key: "amount", label: "Amount" },
  ];

  const handleAddTest = () => {
    setSelectedTest(null);
    setOpenAddDialog(true);
  };

  const handleRowClick = (row: PathologyTestData) => {
    // Find the latest version of the data from pathologyBills
    const latestData = tests.find(item => item.id === row.id);
    setSelectedTest(latestData || row);
    setOpenViewDialog(true);
  };

  const handleUpdate = (updatedData: PathologyTestData) => {
    // Update the pathologyBills array
    setTests(prev => 
      prev.map(item => item.id === updatedData.id ? updatedData : item)
    );
  
    // Update the selectedTest with the new data
    setSelectedTest(updatedData);
    
    alert(`Test "${updatedData.testName}" updated successfully!`);
  };

  const handleDelete = (id: number) => {
    const deletedItem = tests.find(item => item.id === id);
    setTests(prev => prev.filter(item => item.id !== id));
    
    // Clear selected test if it was the deleted one
    if (selectedTest?.id === id) {
      setSelectedTest(null);
    }
    
    alert(`Test "${deletedItem?.testName}" deleted successfully!`);
  };

  const handleAddSave = (newData: Omit<PathologyTestData, "id">) => {
    const newId = Math.max(...tests.map(item => item.id)) + 1;
    const newTest = { ...newData, id: newId };
    setTests([...tests, newTest]);
    alert(`Test "${newTest.testName}" added successfully!`);
  };

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="font-bold text-lg">Pathology Test</h2>

        <button
          onClick={handleAddTest}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-bold"
        >
          + Add Pathology Test
        </button>
      </div>

      <Controltable
        columns={columns}
        data={tests}
        title=""
        onRowClick={handleRowClick}
      />

      <ViewPathologyTest
        open={openViewDialog}
        onClose={() => {
          setOpenViewDialog(false);
          // Clear selected test when closing
          setSelectedTest(null);
        }}
        data={selectedTest}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <AddPathologyTest
        open={openAddDialog}
        onClose={() => {
          setOpenAddDialog(false);
          setSelectedTest(null);
        }}
        data={null}
        onSave={handleAddSave}
      />
    </div>
  );
};

export default PathologyTest;

