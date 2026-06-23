import { MdSearch, MdNotifications, MdAccountCircle, MdMenu } from "react-icons/md";

type Props = {
  onToggleSidebar: () => void;
};

const Navbar = ({ onToggleSidebar }: Props) => {
  return (
    <div className="flex h-16 bg-white border-b border-gray-200 shrink-0 items-center px-4 gap-4 w-full">

      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
        title="Toggle Sidebar"
      >
        <MdMenu size={22} />
      </button>

      <span className="text-blue-600 font-bold text-base md:text-lg whitespace-nowrap">
        SmartHosp
      </span>

      {/* Search bar — mobile वर hidden */}
      <div className="flex-1 flex justify-center">
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-72">
          <MdSearch size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">

        <button className="md:hidden text-gray-500 hover:text-gray-700">
          <MdSearch size={22} />
        </button>

        <button className="relative text-gray-500 hover:text-gray-700">
          <MdNotifications size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Admin */}
        <div className="flex items-center gap-2">
          <MdAccountCircle size={32} className="text-gray-400" />
          <div className="hidden md:block text-sm">
            <p className="font-medium text-gray-800">Admin</p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Navbar;