import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import StaffDirectory from "../page/home/Staff/StaffDirectory";

const Dashboard = lazy(() => import("../page/home/Dashboard"));
const Patient = lazy(() => import("../page/home/Patient/PatientList"));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
    Loading...
  </div>
);

const MainRouting = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient" element={<Patient />} />
       <Route path="/all-staff" element={<StaffDirectory />} />
      </Routes>
    </Suspense>
  );
};

export default MainRouting;