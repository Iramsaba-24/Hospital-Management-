import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Sidebar from "../constants/layout/Sidebar";
import Navbar from "../constants/layout/Navbar";

// Add new pages here as you create them
const Dashboard  = lazy(() => import("../page/home/Dashboard"));
const Patient    = lazy(() => import("../page/home/Patient/PatientList"));
// const Appointment = lazy(() => import("./pages/Appointment"));
// const Billing    = lazy(() => import("./pages/Billing"));

// Simple loading fallback shown while a page loads
const PageLoader = () => (
  <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
    Loading...
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"            element={<Dashboard />} />
                <Route path="/patient"     element={<Patient />} />
                {/* <Route path="/appointment" element={<Appointment />} /> */}
                {/* <Route path="/billing"     element={<Billing />} /> */}
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;