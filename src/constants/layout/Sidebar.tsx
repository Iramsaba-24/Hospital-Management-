import { NavLink } from "react-router-dom";
import {
  MdDashboard, MdPerson, MdCalendarMonth, MdReceiptLong,
  MdLocalHospital, MdHotel, MdLocalPharmacy, MdScience,
  MdRadio, MdOpacity, MdDirectionsCar, MdApartment,
  MdCardMembership, MdGroup, MdQrCode, MdSchedule,
  MdEvent, MdPersonAdd, MdSecurity, MdShowChart,
  MdMessage, MdInventory, MdDescription, MdBarChart,
  MdSettings,
} from "react-icons/md";

const navItems = [
  { path: "/",              label: "Dashboard",    icon: <MdDashboard     size={18} /> },
  { path: "/patient",       label: "Patient",      icon: <MdPerson        size={18} /> },
  { path: "/appointment",   label: "Appointment",  icon: <MdCalendarMonth size={18} /> },
  { path: "/billing",       label: "Billing",      icon: <MdReceiptLong   size={18} /> },
  { path: "/opd-patient",   label: "OPD Patient",  icon: <MdLocalHospital size={18} /> },
  { path: "/ipd-patient",   label: "IPD Patient",  icon: <MdHotel         size={18} /> },
  { path: "/pharmacy",      label: "Pharmacy",     icon: <MdLocalPharmacy size={18} /> },
  { path: "/pathology",     label: "Pathology",    icon: <MdScience       size={18} /> },
  { path: "/radiology",     label: "Radiology",    icon: <MdRadio         size={18} /> },
  { path: "/blood-bank",    label: "Blood Bank",   icon: <MdOpacity       size={18} /> },
  { path: "/ambulance",     label: "Ambulance",    icon: <MdDirectionsCar size={18} /> },
  { path: "/front-office",  label: "Front Office", icon: <MdApartment     size={18} /> },
  { path: "/birth-death",   label: "Birth & Death",icon: <MdCardMembership size={18} /> },
  { path: "/all-staff",     label: "All Staff",    icon: <MdGroup         size={18} /> },
  { path: "/qr-attendance", label: "QR Attendance",icon: <MdQrCode        size={18} /> },
  { path: "/duty-roster",   label: "Duty Roster",  icon: <MdSchedule      size={18} /> },
  { path: "/calendar",      label: "Calendar",     icon: <MdEvent         size={18} /> },
  { path: "/referral",      label: "Referral",     icon: <MdPersonAdd     size={18} /> },
  { path: "/tpa-team",      label: "TPA Team",     icon: <MdSecurity      size={18} /> },
  { path: "/finance",       label: "Finance",      icon: <MdShowChart     size={18} /> },
  { path: "/messaging",     label: "Messaging",    icon: <MdMessage       size={18} /> },
  { path: "/inventory",     label: "Inventory",    icon: <MdInventory     size={18} /> },
  { path: "/certificate",   label: "Certificate",  icon: <MdDescription   size={18} /> },
  { path: "/reports",       label: "Reports",      icon: <MdBarChart      size={18} /> },
  { path: "/setup",         label: "Setup",        icon: <MdSettings      size={18} /> },
];

const Sidebar = () => {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-gray-200 shrink-0">
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-sm">
          +
        </div>
        <span className="text-sm font-semibold text-gray-800">
          Smart<span className="text-blue-600">Hosp</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
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