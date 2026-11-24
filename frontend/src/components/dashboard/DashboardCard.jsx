import {
  FileCheck,
  Percent,
  BrainCircuit,
  UserCheck,
} from "lucide-react";

const DashboardCards = ({ result }) => {
  const similarity =
    result?.similarity_score?.similarity_percentage ?? 0;

  // ============================================================
  // SIMILARITY STYLE
  // ============================================================

  const getSimilarityStyle = () => {
    if (similarity >= 80) {
      return {
        color: "text-red-400",
        bg: "bg-red-500/10",
        subtitle: "Very High Similarity",
      };
    }

    if (similarity >= 60) {
      return {
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        subtitle: "High Similarity",
      };
    }

    if (similarity >= 30) {
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        subtitle: "Moderate Similarity",
      };
    }

    return {
      color: "text-green-400",
      bg: "bg-green-500/10",
      subtitle: "Low Similarity",
    };
  };

  const similarityStyle = getSimilarityStyle();

  // ============================================================
  // CARDS
  // ============================================================

  const cards = [
{
  title: "Proposal Status",

  value:
    result?.status ?? "Not Submitted",

  subtitle:
    result?.status === "Accepted"
      ? "Proposal approved"
      : result?.status === "Rejected"
      ? "Proposal rejected"
      : result
      ? "Awaiting review"
      : "No research submitted",

  icon: FileCheck,

  iconColor: "text-purple-400",
  iconBg: "bg-purple-500/10",

  subtitleColor: "text-purple-400",
},

    {
      title: "Similarity Score",

      value: `${similarity}%`,

      subtitle: similarityStyle.subtitle,

      icon: Percent,

      iconColor: similarityStyle.color,
      iconBg: similarityStyle.bg,

      subtitleColor: similarityStyle.color,
    },

    {
      title: "Research Domain",

      value:
        result?.domain?.primary_domain ?? "Pending",

      subtitle: "Predicted by AI",

      icon: BrainCircuit,

      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",

      subtitleColor: "text-purple-400",
    },

    {
      title: "Supervisor",

      // ========================================================
      // ACTUAL ASSIGNED SUPERVISOR
      // ========================================================

      value:
        result?.supervision?.supervisor_name ?? "Pending",

      subtitle:
        result?.supervision?.status === "Accepted"
          ? "Supervisor assigned"
          : result?.supervision?.status === "Rejected"
          ? "Supervisor rejected"
          : "Allocation in progress",

      icon: UserCheck,

      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10",

      subtitleColor: "text-orange-400",
    },
  ];

  return (
    <section
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-3
        sm:gap-4
      "
    >
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              min-h-[135px]
              sm:min-h-[145px]
              xl:min-h-[150px]

              bg-[#111827]

              border
              border-gray-500

              rounded-xl

              px-4
              py-4
              sm:px-5
              sm:py-5

              transition-all
              duration-300

              hover:bg-[#151e2e]
            "
          >
            <div className="flex items-start gap-3 h-full">

              {/* ================================================== */}
              {/* ICON */}
              {/* ================================================== */}

              <div
                className={`
                  w-10
                  h-10
                  sm:w-11
                  sm:h-11
                  rounded-lg
                  ${card.iconBg}
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                `}
              >
                <Icon
                  size={19}
                  className={card.iconColor}
                />
              </div>

              {/* ================================================== */}
              {/* CONTENT */}
              {/* ================================================== */}

              <div
                className="
                  min-w-0
                  flex-1
                  flex
                  flex-col
                "
              >

                {/* TITLE */}

                <p
                  className="
                    text-[12px]
                    sm:text-[13px]
                    font-medium
                    text-gray-400
                    leading-5
                    min-h-[20px]
                  "
                >
                  {card.title}
                </p>

                {/* VALUE */}

                <div
                  className="
                    mt-1
                    min-h-[52px]
                    flex
                    items-start
                  "
                >
                  <h2
                    className={`
                      font-bold
                      text-white
                      leading-tight
                      break-words
                      line-clamp-2

                      ${
                        card.title === "Supervisor"
                          ? "text-[17px] sm:text-[18px]"
                          : card.title === "Research Domain"
                          ? "text-[18px] sm:text-[19px]"
                          : card.title === "Proposal Status"
                          ? "text-[18px] sm:text-[20px]"
                          : "text-[21px] sm:text-[23px]"
                      }
                    `}
                  >
                    {card.value}
                  </h2>
                </div>

                {/* SUBTITLE */}

                <p
                  className={`
                    mt-auto
                    pt-1
                    text-[11px]
                    sm:text-[12px]
                    font-medium
                    ${card.subtitleColor}
                  `}
                >
                  {card.subtitle}
                </p>

              </div>

            </div>
          </div>
        );
      })}
    </section>
  );
};

export default DashboardCards;