import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdPerson,
  MdCalendarMonth,
  MdReceiptLong,
} from "react-icons/md";

const navItems = [
  { path: "/",            label: "Dashboard",   icon: <MdDashboard    size={20} /> },
  { path: "/patient",     label: "Patient",     icon: <MdPerson       size={20} /> },
  { path: "/appointment", label: "Appointment", icon: <MdCalendarMonth size={20} /> },
  { path: "/billing",     label: "Billing",     icon: <MdReceiptLong  size={20} /> },
];

const Sidebar = () => {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <span className="text-blue-600 font-bold text-lg">🏥 SmartHosp</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;