import {
  LayoutDashboard,
  BrainCircuit,
  GraduationCap,
  User,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { getCurrentUser, logout } from "../../../utils/auth";


const menuItems = [
  {
    title: "Supervisor Dashboard",
    icon: LayoutDashboard,
    path: "/supervisor/dashboard",
  },
  {
    title: "Recommended Research Ideas",
    icon: BrainCircuit,
    path: "/supervisor/recommendations",
  },
  {
    title: "My Supervisions",
    icon: GraduationCap,
    path: "/supervisor/supervisions",
  },
  {
    title: "Profile",
    icon: User,
    path: "/supervisor/profile",
  },
];


const SupervisorSidebar = () => {

  const navigate = useNavigate();

  const user = getCurrentUser();


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {

    logout();

    navigate("/login");
  };


  return (

    <aside className="w-64 h-screen bg-[#0F172A] border-r border-gray-800 flex flex-col">

      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

      <div className="px-5 py-6">

        <div className="flex items-center gap-3">

          <div className="
            w-11
            h-11
            rounded-xl
            bg-gradient-to-br
            from-blue-500
            to-purple-600
            flex
            items-center
            justify-center
            flex-shrink-0
          ">

            <BrainCircuit
              size={22}
              className="text-white"
            />

          </div>


          <div className="leading-tight">

            <h1 className="text-white font-bold text-[17px]">
              ResearchSync AI
            </h1>

            <p className="text-xs text-gray-400 mt-0.5">
              Supervisor Portal
            </p>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* SUPERVISOR PROFILE */}
      {/* ================================================== */}

      <div className="px-5">

        <div className="flex items-center gap-3">

          {/* Profile Image */}

          {user?.image ? (

            <img
              src={user.image}
              alt="Supervisor"
              className="
                w-12
                h-12
                rounded-full
                object-cover
                border
                border-gray-700
              "
            />

          ) : (

            <div
              className="
                w-12
                h-12
                rounded-full
                bg-gradient-to-br
                from-blue-500
                to-purple-600
                flex
                items-center
                justify-center
                text-white
                font-semibold
                text-sm
              "
            >
              {user?.full_name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "SU"}
            </div>

          )}


          <div className="leading-tight min-w-0">

            <h2 className="
              text-[14.5px]
              font-semibold
              text-white
              truncate
            ">
              {user?.full_name || "Supervisor"}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Supervisor
            </p>

          </div>

        </div>

      </div>


      <div className="mx-5 my-6 border-b border-gray-800"></div>


      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <nav className="flex-1 px-4">

        <div className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-[#1F2937] hover:text-white"
                  }`
                }
              >

                <Icon
                  size={19}
                  strokeWidth={2}
                />

                <span>{item.title}</span>

              </NavLink>

            );

          })}

        </div>

      </nav>


      {/* ================================================== */}
      {/* LOGOUT */}
      {/* ================================================== */}

      <div className="p-5 border-t border-gray-800">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            text-sm
            font-medium
            text-red-400
            hover:bg-red-500/10
            transition-all
          "
        >

          <LogOut
            size={19}
            strokeWidth={2}
          />

          Logout

        </button>

      </div>

    </aside>
  );
};


export default SupervisorSidebar;