import { CalendarDays } from "lucide-react";

const DashboardHeader = ({ supervisor }) => {
  const now = new Date();

  const formattedDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex items-start justify-between">

      {/* Left */}

      <div>

        <p className="text-sm text-gray-300">

          Welcome back,

        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">

          {supervisor.name}

        </h1>

        <p className="mt-2 text-sm text-gray-400">

          Here's what's happening with your research supervision.

        </p>

      </div>

      {/* Right */}

      <div className="bg-[#111827] border border-gray-600 rounded-2xl px-8 py-4 min-w-[240px]">

        <div className="flex items-center justify-center gap-2 text-gray-400 mb-3">

          <CalendarDays size={16} />

          <span className="text-sm">

            {formattedDate}

          </span>

        </div>

        <h2 className="text-3xl font-bold text-white text-center">

          {formattedTime}

        </h2>

      </div>

    </div>
  );
};

export default DashboardHeader;