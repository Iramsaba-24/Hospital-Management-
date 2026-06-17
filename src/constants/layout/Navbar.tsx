import { MdSearch, MdNotifications, MdAccountCircle } from "react-icons/md";

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
        <MdSearch size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-gray-700">
          <MdNotifications size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2">
          <MdAccountCircle size={32} className="text-gray-400" />
          <div className="text-sm">
            <p className="font-medium text-gray-800">Admin</p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;