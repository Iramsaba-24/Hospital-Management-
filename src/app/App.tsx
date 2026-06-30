import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

import Navbar from "../containers/layout/Navbar";
import Sidebar from "../containers/layout/Sidebar";
import Pathology from "../page/home/Pathology/Pathology";
import Referral from "../page/home/Referral/ReferralPayment"

const Dashboard = lazy(() => import("../page/home/Dashboard"));
const Patient = lazy(() => import("../page/home/Patient/PatientList"));
// const Appointment = lazy(() => import("../page/home/Patient/AddPatientForm"));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
    Loading...
  </div>
);
import MainRouting from "../routes/MainRoutes";
import PathologyTest from "../page/home/Pathology/PathologyTest";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} />

          <main className="flex-1 overflow-y-auto">
            <Suspense fallback={<PageLoader />}>

              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/patient" element={<Patient />} />
                {/* <Route path="/appointment" element={<Appointment onClose={function (): void {
                  throw new Error("Function not implemented.");
                } } onSave={function (): void {
                  throw new Error("Function not implemented.");
                } } nextUhid={""} />} /> */}
                <Route path="/pathology" element={<Pathology />} />
                <Route path="/PathologyTest" element={<PathologyTest />} />
                <Route path="/referral" element={<Referral />} />
              </Routes>

            </Suspense>
            <MainRouting />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;