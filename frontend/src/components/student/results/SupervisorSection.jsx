import { Clock3, Star } from "lucide-react";
import SupervisorCard from "./SupervisorCard";

const SupervisorSection = ({ supervisors }) => {

  // ============================================================
  // EMPTY STATE
  // ============================================================

  if (!supervisors || supervisors.length === 0) {
    return (
      <div
        className="
          bg-[#111827]
          border
          border-gray-700
          rounded-xl
          p-5
        "
      >

        {/* Header */}

        <div className="flex items-start gap-3">

          <div
            className="
              w-10
              h-10
              rounded-lg
              bg-purple-500/10
              border
              border-purple-500/20
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <Star
              size={19}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-[17px] font-semibold text-white">
              Top Recommended Supervisors
            </h2>

            <p className="mt-1 text-[12px] text-gray-400">
              Ranked according to research domain relevance and supervisor workload.
            </p>

          </div>

        </div>


        {/* Empty State */}

        <div
          className="
            mt-5
            rounded-xl
            border
            border-dashed
            border-gray-700
            bg-[#1F2937]/70
            px-6
            py-10
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-full
              bg-blue-500/10
              border
              border-blue-500/20
              flex
              items-center
              justify-center
            "
          >
            <Clock3
              size={22}
              className="text-blue-400"
            />
          </div>

          <h3 className="mt-4 text-[15px] font-semibold text-white">
            Recommendation Pending
          </h3>

          <p className="mt-2 max-w-lg text-[12px] leading-5 text-gray-400">
            The AI Supervisor Recommendation module has not been executed yet.
            Recommended supervisors will automatically appear here once the
            allocation engine finishes analysing your research proposal.
          </p>

        </div>

      </div>
    );
  }


  // ============================================================
  // SUPERVISOR RESULTS
  // ============================================================

  return (
    <div
      className="
        bg-[#111827]
        border
        border-gray-500
        rounded-xl
        p-5
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

        <div className="flex items-start gap-3">

          <div
            className="
              w-10
              h-10
              rounded-lg
              bg-purple-500/10
              border
              border-purple-500/20
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <Star
              size={19}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-[20px] font-semibold text-white">
              Top 2 Recommended Supervisors
            </h2>

            <p className="mt-1 text-[13px] text-gray-400">
              Ranked according to research domain relevance and supervisor workload.
            </p>

          </div>

        </div>

        

      </div>


      {/* ================================================== */}
      {/* CARDS */}
      {/* ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-4
          mt-5
        "
      >

        {supervisors.slice(0, 2).map((supervisor, index) => (

          <SupervisorCard
            key={index}
            supervisor={supervisor}
            best={index === 0}
          />

        ))}

      </div>

    </div>
  );
};

export default SupervisorSection;