import { getCurrentUser } from "../../utils/auth";
import { Sparkles } from "lucide-react";

const WelcomeBanner = () => {

  const user = getCurrentUser();

  return (

    <section
      className="
        flex
        items-center
        justify-between
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-700
        px-6
        py-5
        shadow-lg
      "
    >

      {/* Left */}

      <div>

        <div className="flex items-center gap-2 mb-1">

          <Sparkles
            size={18}
            className="text-yellow-300"
          />

          <h1 className="text-2xl font-bold text-white">

            Welcome back,

            <span className="ml-2">
              {user?.full_name || "Student"} 👋
            </span>

          </h1>

        </div>

        <p className="text-sm text-blue-100">

          Ready to continue your research today? Track your progress, submit new ideas and collaborate with your supervisor.

        </p>

      </div>

      {/* Right */}

      <div className="hidden lg:flex flex-col items-end">

        <span className="text-xs uppercase tracking-widest text-blue-200">
          Logged in as
        </span>

        <span className="text-lg font-semibold text-white capitalize">
          {user?.role || "Student"}
        </span>

      </div>

    </section>

  );

};

export default WelcomeBanner;