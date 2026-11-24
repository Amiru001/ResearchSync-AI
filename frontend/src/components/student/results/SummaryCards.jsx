import {
  BrainCircuit,
  Percent,
  UserRound,
} from "lucide-react";


const SummaryCards = ({ result }) => {

  // ============================================================
  // SIMILARITY LEVEL
  // ============================================================

  const similarityLevel =
    result.similarity >= 80
      ? {
          label: "Very High Similarity",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-300",
        }
      : result.similarity >= 60
      ? {
          label: "High Similarity",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
          text: "text-orange-300",
        }
      : result.similarity >= 30
      ? {
          label: "Moderate Similarity",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          text: "text-yellow-300",
        }
      : {
          label: "Low Similarity",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-300",
        };


  // ============================================================
  // SUPERVISOR STATUS
  // ============================================================

  const isAssigned =
    result.supervisionStatus?.toLowerCase() === "accepted";


  return (

    <section
      className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-4
      "
    >

      {/* ====================================================== */}
      {/* DOMAIN CARD */}
      {/* ====================================================== */}

      <div
        className="
          bg-[#111827]
          border
          border-gray-500
          rounded-xl
          px-5
          py-5
          transition-all
          duration-300
          hover:bg-[#151e2e]
          hover:border-purple-500/30
        "
      >

        <div className="flex items-start gap-3 h-full">

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
            <BrainCircuit
              size={21}
              className="text-purple-400"
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
              flex
              flex-col
            "
          >

            <p
              className="
                text-[12px]
                sm:text-[14px]
                font-medium
                text-gray-400
                leading-5
              "
            >
              Research Domain
            </p>


            <div className="mt-1 min-h-[42px]">

              <h2
                className="
                  text-[19px]
                  font-semibold
                  text-purple-400
                  leading-tight
                  break-words
                  line-clamp-2
                "
              >
                {result.domain}
              </h2>

            </div>


            <div className="mt-auto pt-2">

              <div className="flex items-center justify-between">

                <span className="text-[12px] text-gray-500">
                  Confidence
                </span>

                <span className="text-[13px] font-semibold text-purple-300">
                  {result.confidence}%
                </span>

              </div>


              <div
                className="
                  mt-1.5
                  w-full
                  h-1.5
                  rounded-full
                  bg-gray-800
                  overflow-hidden
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-purple-600
                    to-purple-400
                  "
                  style={{
                    width: `${Math.min(
                      Math.max(result.confidence, 0),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================== */}
      {/* SIMILARITY CARD */}
      {/* ====================================================== */}

      <div
        className="
          bg-[#111827]
          border
          border-gray-500
          rounded-xl
          px-5
          py-5
          transition-all
          duration-300
          hover:bg-[#151e2e]
          hover:border-green-500/30
        "
      >

        <div className="flex items-start gap-3 h-full">

          <div
            className="
              w-10
              h-10
              rounded-lg
              bg-green-500/10
              border
              border-green-500/20
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <Percent
              size={21}
              className="text-green-400"
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
              flex
              flex-col
            "
          >

            <p
              className="
                text-[12px]
                sm:text-[14px]
                font-medium
                text-gray-400
                leading-5
              "
            >
              Topic Similarity
            </p>


            <div className="mt-1 min-h-[42px]">

              <h2
                className="
                  text-[22px]
                  sm:text-[23px]
                  font-semibold
                  text-green-400
                  leading-tight
                "
              >
                {result.similarity}%
              </h2>

            </div>


            <div className="mt-auto pt-2">

              <span
                className={`
                  inline-flex
                  px-2.5
                  py-1
                  rounded-md
                  border
                  text-[12px]
                  font-medium
                  ${similarityLevel.bg}
                  ${similarityLevel.border}
                  ${similarityLevel.text}
                `}
              >
                {similarityLevel.label}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================== */}
      {/* SUPERVISOR CARD */}
      {/* ====================================================== */}

      <div
        className={`
          bg-[#111827]
          border
          rounded-xl
          px-5
          py-5
          transition-all
          duration-300
          hover:bg-[#151e2e]
          ${
            isAssigned
              ? "border-blue-500/40 hover:border-blue-500/60"
              : "border-red-500/30 hover:border-red-500/50"
          }
        `}
      >

        <div className="flex items-start gap-3 h-full">

          <div
            className="
              w-10
              h-10
              rounded-lg
              bg-blue-500/10
              border
              border-blue-500/20
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <UserRound
              size={21}
              className="text-blue-400"
            />
          </div>


          <div
            className="
              min-w-0
              flex-1
              flex
              flex-col
            "
          >

            {/* ================================================== */}
            {/* TITLE */}
            {/* ================================================== */}

            <p
              className="
                text-[12px]
                sm:text-[14px]
                font-medium
                text-gray-400
                leading-5
              "
            >
              {isAssigned
                ? "Assigned Supervisor"
                : "Recommended Supervisor"}
            </p>


            {/* ================================================== */}
            {/* NAME */}
            {/* ================================================== */}

            <div className="mt-1 min-h-[42px]">

              <h2
                className="
                  text-[19px]
                  sm:text-[19px]
                  font-semibold
                  text-blue-400
                  leading-5
                  break-words
                  line-clamp-2
                "
              >
                {isAssigned
                  ? result.assignedSupervisor
                  : result.recommendedSupervisor}
              </h2>

            </div>


            {/* ================================================== */}
            {/* STATUS MESSAGE */}
            {/* ================================================== */}

            <div className="mt-auto pt-2">

              {isAssigned ? (

                <span
                  className="
                    inline-flex
                    px-2.5
                    py-1
                    rounded-md
                    bg-blue-500/10
                    border
                    border-blue-500/20
                    text-[12px]
                    font-medium
                    text-blue-300
                  "
                >
                  Supervisor accepted
                </span>

              ) : (

<p
  className="
    text-[12px]
    sm:text-[14px]
    font-medium
    leading-5
    text-red-500
    animate-pulse
  "
>
  Please wait until the recommended supervisor
  accepts your research idea.
</p>

              )}

            </div>

          </div>

        </div>

      </div>

    </section>

  );
};

export default SummaryCards;