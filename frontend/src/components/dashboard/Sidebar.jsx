import {
  LayoutDashboard,
  Lightbulb,
  BarChart3,
  User,
  HelpCircle,
  LogOut,
  BrainCircuit,
  FileSearch,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/student/dashboard",
  },
  {
    name: "Submit Research Idea",
    icon: Lightbulb,
    path: "/student/submit-idea",
  },
    {
    name: "Results",
    icon: BarChart3,
    path: "/student/results",
  },
  {
    name: "Plagiarism Checker",
    icon: FileSearch,
    path: "/student/plagiarism",
  },
  {
    name: "Profile",
    icon: User,
    path: "/student/profile",
  },
];

const Sidebar = () => {
  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-[#0F172A]
        border-r
        border-gray-800
        flex
        flex-col
      "
    >
      {/* Logo */}

      <div className="px-5 py-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">

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

              Student Portal

            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-3 mt-2">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                mb-2
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-[#1F2937] hover:text-white"
                }
                `
              }
            >
              <Icon size={18} />

              {item.name}
            </NavLink>

          );

        })}

      </nav>

      {/* Bottom */}

      <div className="border-t border-gray-800 px-3 py-4">

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            text-sm
            text-gray-300
            hover:bg-[#1F2937]
            transition
          "
        >
          <HelpCircle size={18} />

          Help & Support
        </button>

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            text-sm
            text-red-400
            hover:bg-red-500/10
            transition
          "
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;