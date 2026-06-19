import { BrowserRouter } from "react-router-dom";
import { useState } from "react";

import Navbar from "../containers/layout/Navbar";
import Sidebar from "../containers/layout/Sidebar";
import MainRouting from "../routes/MainRoutes";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} />

          <main className="flex-1 overflow-y-auto">
            <MainRouting />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;