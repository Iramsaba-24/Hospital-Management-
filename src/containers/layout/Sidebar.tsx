import React from "react";
import * as FaIcons from "react-icons/fa";
import { NavLink } from "react-router-dom";

interface IconFieldProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const IconField: React.FC<IconFieldProps> = ({
  name,
  size = 20,
  color = "inherit",
  className = "",
  onClick,
}) => {
  const DynamicIcon = FaIcons[name as keyof typeof FaIcons];

  if (!DynamicIcon) {
    console.warn(`Icon "${name}" not found in react-icons/fa`);
    return null;
  }

  return (
    <DynamicIcon
      size={size}
      color={color}
      className={className}
      onClick={onClick}
    />
  );
};

type Props = {
  isOpen: boolean;
  onNavClick?: () => void;
};

const navItems = [
  { path: "/",              label: "Dash Board",    icon: "FaTachometerAlt"         },
  { path: "/patient",       label: "Patient",       icon: "FaUserNurse"             },
  { path: "/appointment",   label: "Appointment",   icon: "FaCalendarCheck"         },
  { path: "/billing",       label: "Billing",       icon: "FaFileInvoiceDollar"     },
  { path: "/opd-patient",   label: "OPD Patient",   icon: "FaStethoscope"           },
  { path: "/ipd-patient",   label: "IPD Patient",   icon: "FaBed"                   },
  { path: "/pharmacy",      label: "Pharmacy",      icon: "FaPrescriptionBottleAlt" },
  { path: "/pathology",     label: "Pathology",     icon: "FaFlask"                 },
  { path: "/radiology",     label: "Radiology",     icon: "FaRadiation"             },
  { path: "/blood-bank",    label: "Blood Bank",    icon: "FaTint"                  },
  { path: "/ambulance",     label: "Ambulance",     icon: "FaAmbulance"             },
  { path: "/front-office",  label: "Front Office",  icon: "FaBuilding"              },
  { path: "/birth-death",   label: "Birth & Death", icon: "FaBaby"                  },
  { path: "/all-staff",     label: "All Staff",     icon: "FaUserFriends"           },
  { path: "/qr-attendance", label: "QR Attendance", icon: "FaQrcode"                },
  { path: "/duty-roster",   label: "Duty Roster",   icon: "FaRegClock"              },
  { path: "/calendar",      label: "Calender",      icon: "FaRegCalendarAlt"        },
  { path: "/referral",      label: "Referral",      icon: "FaUserPlus"              },
  { path: "/tpa-team",      label: "TPA Team",      icon: "FaUmbrella"              },
  { path: "/finance",       label: "Finance",       icon: "FaChartLine"             },
  { path: "/messaging",     label: "messaging",     icon: "FaCommentDots"           },
  { path: "/inventory",     label: "inventory",     icon: "FaBoxOpen"               },
  { path: "/certificate",   label: "certificate",   icon: "FaFileAlt"               },
  { path: "/reports",       label: "Reports",       icon: "FaChartBar"              },
  { path: "/setup",         label: "Setup",         icon: "FaCog"                   },
];

const Sidebar = ({ isOpen, onNavClick }: Props) => {
  return (
    <div
      className={`
        bg-white border-r border-gray-200 shrink-0 h-full overflow-hidden
        transition-all duration-300
        ${isOpen ? "w-56" : "w-0"}
      `}
    >
      <nav className="px-3 py-3 space-y-0.5 overflow-y-auto h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <IconField
                  name={item.icon}
                  size={18}
                  color={isActive ? "#ffffff" : "currentColor"}
                />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;