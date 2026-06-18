import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../containers/layout/Navbar";
import Sidebar from "../containers/layout/Sidebar";

const Dashboard   = lazy(() => import("../page/home/Dashboard"));
const Patient     = lazy(() => import("../page/home/Patient/PatientList"));
// const Appointment = lazy(() => import("../page/home/Patient/AddPatientForm"));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
    Loading...
  </div>
);

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
                <Route path="/"            element={<Dashboard />} />
                <Route path="/patient"     element={<Patient />} />
                {/* <Route path="/appointment" element={<Appointment onClose={function (): void {
                  throw new Error("Function not implemented.");
                } } onSave={function (): void {
                  throw new Error("Function not implemented.");
                } } nextUhid={""} />} /> */}
              </Routes>

            </Suspense>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;