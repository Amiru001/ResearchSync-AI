import {
  FaShieldAlt,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#080C18] border-t border-white/10">

      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-16">

          {/* ================= Logo ================= */}

          <div>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">

                <FaShieldAlt className="text-white text-xl" />

              </div>

              <div>

                <h2 className="text-[30px] font-bold text-white leading-none">
                  ResearchSync AI
                </h2>

                <p className="text-blue-300 text-sm mt-2">
                  Intelligent Research Management
                </p>

              </div>

            </div>

            <p className="mt-8 text-gray-400 leading-8 text-[15px] max-w-[360px]">
              ResearchSync AI is an AI-powered research management
              platform that classifies research topics, detects
              semantic similarity, identifies AI-generated content,
              and recommends the most suitable research supervisor.
            </p>

            {/* Social Icons */}

            <div className="flex gap-4 mt-8">

              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/80 border border-white/10 hover:bg-blue-600 hover:border-blue-600 transition flex items-center justify-center"
              >
                <FaGithub />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/80 border border-white/10 hover:bg-blue-600 hover:border-blue-600 transition flex items-center justify-center"
              >
                <FaLinkedin />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-xl bg-white/80 border border-white/10 hover:bg-blue-600 hover:border-blue-600 transition flex items-center justify-center"
              >
                <FaEnvelope />
              </a>

            </div>

          </div>

          {/* ================= Quick Links ================= */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-7">
              Quick Links
            </h3>

            <ul className="space-y-5">

              <li>
                <a href="#home" className="text-gray-400 hover:text-blue-400 transition">
                  Home
                </a>
              </li>

              <li>
                <a href="#features" className="text-gray-400 hover:text-blue-400 transition">
                  Features
                </a>
              </li>

              <li>
                <a href="#research" className="text-gray-400 hover:text-blue-400 transition">
                  Research Areas
                </a>
              </li>

              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition">
                  How It Works
                </a>
              </li>

              <li>
                <a href="#about" className="text-gray-400 hover:text-blue-400 transition">
                  About
                </a>
              </li>

              <li>
                <a href="#contact" className="text-gray-400 hover:text-blue-400 transition">
                  Contact
                </a>
              </li>

            </ul>

          </div>

          {/* ================= Technologies ================= */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-7">
              Technologies
            </h3>

            <div className="flex flex-wrap gap-3">

              {[
                "React",
                "Node.js",
                "Express",
                "MongoDB",
                "BERT",
                "Tailwind CSS",
              ].map((tech) => (

                <span
                  key={tech}
                  className="
                  px-4
                  py-2
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  text-sm
                  text-gray-300
                  hover:bg-blue-600
                  hover:border-blue-600
                  transition-all
                  duration-300
                  "
                >
                  {tech}
                </span>

              ))}

            </div>

          </div>

          {/* ================= Contact ================= */}

          <div>

            <h3 className="text-xl font-semibold text-white mb-7">
              Contact
            </h3>

            <div className="space-y-7">

              <div>

                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <p className="text-gray-300 mt-2">
                  researchsync.ai@gmail.com
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  University
                </p>

                <p className="text-gray-300 mt-2">
                  SLIIT City Uni
                </p>

              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Project
                </p>

                <p className="text-gray-300 mt-2">
                  Final Year Research Project
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Bottom ================= */}

      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-8 py-7 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-500 text-sm">
            © 2026 ResearchSync AI. All Rights Reserved.
          </p>

          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            Built with React • Node.js • Express • MongoDB • BERT
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;