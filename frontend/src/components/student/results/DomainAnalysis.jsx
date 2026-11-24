import {
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

const colors = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
];

const DomainAnalysis = ({ domains = [] }) => {

  if (domains.length === 0) {
    return null;
  }

  const topDomain = domains[0];

  return (
    <div
      className="
        bg-[#111827]
        border
        border-gray-700
        rounded-xl
        p-5
        h-full
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center gap-3 mb-5">

        <div
          className="
            w-10
            h-10
            rounded-xl
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
            size={20}
            className="text-purple-400"
          />
        </div>

        <div className="min-w-0">

          <h2 className="text-[19px] font-semibold text-white">
            Research Domain Classification
          </h2>

          <p className="mt-1 text-[12px] text-gray-400">
            AI confidence across all research domains
          </p>

        </div>

      </div>


      {/* ================================================== */}
      {/* DOMAIN BARS */}
      {/* ================================================== */}

      <div className="space-y-3.5">

        {domains.map((domain, index) => (

          <div key={domain.domain}>

            {/* Label + Score */}

            <div className="flex items-center justify-between mb-1.5">

              <span className="text-[12px] text-gray-300">
                {domain.domain}
              </span>

              <span className="text-[12px] font-medium text-white">
                {domain.score.toFixed(2)}%
              </span>

            </div>


            {/* Progress */}

            <div
              className="
                w-full
                h-1.5
                rounded-full
                bg-[#1F2937]
                overflow-hidden
              "
            >

              <div
                className={`
                  h-full
                  rounded-full
                  ${colors[index % colors.length]}
                `}
                style={{
                  width: `${Math.min(
                    Math.max(domain.score, 0),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>


      {/* ================================================== */}
      {/* CLASSIFICATION RESULT */}
      {/* ================================================== */}

      <div
        className="
          mt-5
          rounded-lg
          bg-purple-500/5
          border
          border-purple-500/15
          p-4
        "
      >

        <div className="flex items-start gap-3">

          <div
            className="
              w-8
              h-8
              rounded-md
              bg-purple-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <CheckCircle2
              size={15}
              className="text-green-400"
            />

          </div>


          <div className="min-w-0">

            <h2 className="text-[13px] font-semibold text-white">
              Classification Result
            </h2>

            <p className="mt-1.5 text-[12px] text-gray-400 leading-5">

              Your research proposal has the strongest relationship
              with the{" "}

              <span className="text-purple-400 font-medium">
                {topDomain.domain}
              </span>

              {" "}research domain with a confidence of{" "}

              <span className="text-green-400 font-medium">
                {topDomain.score.toFixed(2)}%
              </span>

              . The remaining domains received lower confidence
              scores, indicating that the proposal primarily belongs
              to the{" "}

              <span className="text-purple-400 font-medium">
                {topDomain.domain}
              </span>

              {" "}research area.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DomainAnalysis;