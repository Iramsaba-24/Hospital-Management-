import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Navbar from "../containers/layout/Navbar";
import Sidebar from "../containers/layout/Sidebar";
import MainRouting from "../routes/MainRoutes";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

        <div className="relative z-40">
          <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-white/30 backdrop-blur-sm z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div
            className={`
              fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
              md:static md:top-auto md:h-auto md:z-auto
              transition-transform duration-300
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
          >
            <Sidebar
              isOpen={sidebarOpen}
              onNavClick={() => {
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
            />
          </div>

          <main className="flex-1 overflow-y-auto">
            <MainRouting />
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;