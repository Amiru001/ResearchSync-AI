import { Info } from "lucide-react";

const WorkloadSummary = ({ workload }) => {
  const percentage = Math.round(
    (workload.current / workload.maximum) * 100
  );

  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-5 h-[360px]">

      {/* Header */}

      <div className="flex items-center gap-2">

        <h2 className="text-[16px] font-semibold text-white">

          Workload Summary

        </h2>

        <Info
          size={15}
          className="text-gray-500"
        />

      </div>

      {/* Current Workload */}

      <div className="mt-10 flex items-center justify-between">

        <p className="text-[14px] text-gray-300">

          Current Workload

        </p>

        <h2 className="text-[30px] font-bold text-white leading-none">

          {workload.current}

          <span className="text-[18px] text-gray-400">

            {" "}
            / {workload.maximum}

          </span>

        </h2>

      </div>

      {/* Progress */}

      <div className="mt-8">

        <div className="w-full h-4 rounded-full bg-gray-700 overflow-hidden">

          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}

      <div className="mt-10 flex items-end justify-between">

        <div>

          <p className="text-[13px] text-gray-400 leading-6">

            You can supervise up to

          </p>

          <p className="text-[13px] text-gray-400">

            {workload.maximum} research projects

          </p>

        </div>

        <h2 className="text-[32px] font-bold text-purple-400">

          {percentage}%

        </h2>

      </div>

    </div>
  );
};

export default WorkloadSummary;