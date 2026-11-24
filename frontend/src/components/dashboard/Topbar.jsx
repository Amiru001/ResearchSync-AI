import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

import { getCurrentUser } from "../../utils/auth";

const Topbar = () => {

  const user = getCurrentUser();

  return (

    <header className="sticky top-0 z-40 bg-[#0B1120]/80 backdrop-blur-xl border-b border-gray-800">

      <div className="flex items-center justify-between px-6 py-3">

        {/* Search Bar */}

        <div className="relative w-80">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search research, proposals..."
            className="
              w-full
              bg-[#1E293B]
              text-white
              text-sm
              rounded-lg
              py-2.5
              pl-10
              pr-4
              border
              border-gray-700
              outline-none
              focus:border-blue-500
              transition
            "
          />

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-4">

          {/* Notification */}

          <button className="relative p-2.5 rounded-lg bg-[#1E293B] hover:bg-[#273449] transition">

            <Bell
              size={18}
              className="text-white"
            />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>

          </button>

          {/* Profile */}

          <div className="flex items-center gap-2.5">

            <UserCircle
              size={36}
              className="text-blue-400"
            />

            <div>

              <h3 className="text-white font-semibold text-sm">
                {user?.full_name || "Student"}
              </h3>

              <p className="text-xs text-gray-400 capitalize">
                {user?.role || "Student"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>

  );

};

export default Topbar;