import { Link } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-lg bg-[#08101f]/80 ">
<div className="max-w-[1550px] mx-auto flex items-center justify-between px-15 py-5">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <FaShieldAlt className="text-white text-lg" />
          </div>

          <div>
            <h1 className="text-white font-bold text-xl">
              ResearchSync AI
            </h1>

            <p className="text-xs text-blue-200">
              Intelligent Research Management
            </p>
          </div>
        </Link>

        {/* Menu */}

        <nav className="hidden lg:flex items-center gap-10">

          <a
            href="#"
            className="text-gray-300 hover:text-white duration-300"
          >
            Home
          </a>

          <a
            href="#features"
            className="text-gray-300 hover:text-white duration-300"
          >
            Features
          </a>

          <a
            href="#research"
            className="text-gray-300 hover:text-white duration-300"
          >
            Research Areas
          </a>

          <a
            href="#workflow"
            className="text-gray-300 hover:text-white duration-300"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="text-gray-300 hover:text-white duration-300"
          >
            About
          </a>

          <a
            href="#contact"
            className="text-gray-300 hover:text-white duration-300"
          >
            Contact
          </a>

        </nav>

        {/* Buttons */}

        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="px-6 py-2 rounded-lg border border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 duration-300"
          >
            Register
          </Link>

        </div>

      </div>
    </header>
  );
};

export default Navbar;