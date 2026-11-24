import {
  FaShieldAlt,
  FaBrain,
  FaSearch,
  FaRobot,
  FaUserGraduate,
} from "react-icons/fa";

const features = [
  "Research Topic Classification",
  "Semantic Similarity Detection",
  "AI Content Detection",
  "Supervisor Recommendation",
];

const icons = [
  <FaBrain />,
  <FaSearch />,
  <FaRobot />,
  <FaUserGraduate />,
];

const AuthLeftPanel = () => {
  return (
    <div
      className="
      hidden
      lg:flex
      relative
      w-[45%]
      px-14
      py-12
      text-white
      overflow-hidden
      "
    >
      {/* Background Glow */}

      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-[140px]" />

      {/* Content */}

      <div className="relative z-10 flex flex-col h-full">

        {/* Logo */}

        <div className="flex items-center gap-3 mb-16">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">

            <FaShieldAlt className="text-white text-xl" />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              ResearchSync AI
            </h2>

            <p className="text-blue-300 text-sm mt-1">
              Intelligent Research Management
            </p>

          </div>

        </div>

        {/* Heading */}

        <div>

          <h1 className="text-[32px] font-bold leading-tight max-w-[500px]">

            Empowering
            <br />
            Research with
            <br />
            Artificial Intelligence

          </h1>

          <p className="mt-6 text-gray-400 text-[15px] leading-8 max-w-[520px]">

            ResearchSync AI helps universities classify
            research topics, detect AI-generated content,
            analyse semantic similarity and recommend the
            most suitable research supervisor.

          </p>

        </div>

        {/* Features */}

        <div className="mt-12 space-y-4">

          {features.map((item, index) => (

            <div
              key={index}
              className="
              flex
              items-center
              gap-4
              bg-white/5
              border
              border-white/10
              rounded-2xl
              px-5
              py-3
              backdrop-blur-md
              hover:bg-white/10
              transition-all
              duration-300
              "
            >

              <div className="text-blue-400 text-base">

                {icons[index]}

              </div>

              <span className="text-gray-200 text-[15px]">

                {item}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default AuthLeftPanel;