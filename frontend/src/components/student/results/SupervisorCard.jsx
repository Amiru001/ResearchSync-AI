import {
  Sparkles,
  CheckCircle2,
  Users,
  Clock3,
} from "lucide-react";

import MatchCircle from "./MatchCircle";

const SupervisorCard = ({ supervisor, best }) => {

  // ============================================================
  // INITIALS
  // ============================================================

  const initials = supervisor.supervisor_name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();


  // ============================================================
  // RESEARCH INTERESTS
  // ============================================================

  const interests = supervisor.research_interests
    ? supervisor.research_interests
        .split(",")
        .map((item) => item.trim())
        .slice(0, 4)
    : [];


  return (
    <div
      className={`
        relative
        rounded-xl
        border
        bg-[#111827]
        p-5
        pt-7
        transition-all
        duration-300

        ${
          best
            ? "border-purple-500/60 hover:border-purple-500/80"
            : "border-blue-500/40 hover:border-blue-500/60"
        }
      `}
    >

      {/* ================================================== */}
      {/* RANK RIBBON */}
      {/* ================================================== */}

      <div
        className={`
          absolute
          top-0
          left-0
          px-3
          py-1
          rounded-tl-xl
          rounded-br-lg
          text-[12px]
          font-semibold

          ${
            best
              ? "bg-purple-500 text-white"
              : "bg-blue-500 text-white"
          }
        `}
      >
        {best ? "#1" : "#2"}
      </div>


      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-start justify-between gap-4">

        {/* LEFT */}

        <div className="flex items-start gap-3 min-w-0">

          {/* Avatar */}

          <div
            className={`
              w-13
              h-13
              rounded-full
              flex
              items-center
              justify-center
              flex-shrink-0
              font-semibold
              text-[14px]

              ${
                best
                  ? "bg-purple-500 text-white"
                  : "bg-blue-500 text-white"
              }
            `}
          >
            {initials}
          </div>


          {/* Name + Domain + Interests */}

          <div className="min-w-0">

            <h3
              className={`
                text-[17px]
                sm:text-[18px]
                font-semibold
                leading-5
                break-words

                ${
                  best
                    ? "text-purple-400"
                    : "text-blue-400"
                }
              `}
            >
              {supervisor.supervisor_name}
            </h3>


            <p className="mt-1 text-[13px] text-gray-400">
              {supervisor.research_domain}
            </p>


            {/* INTEREST TAGS */}

            {interests.length > 0 && (

              <div className="flex flex-wrap gap-1.5 mt-3">

                {interests.map((tag) => (

                  <span
                    key={tag}
                    className="
                      px-2.5
                      py-1
                      rounded-md
                      bg-[#1F2937]
                      border
                      border-gray-700
                      text-[11px]
                      text-gray-300
                    "
                  >
                    {tag}
                  </span>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* ================================================== */}
        {/* SCORE CIRCLE */}
        {/* ================================================== */}

        <div
          className="
            flex-shrink-0
            scale-125
            origin-center
            mr-2
          "
        >

          <MatchCircle
            score={supervisor.overall_score}
            color={
              best
                ? "#A855F7"
                : "#3B82F6"
            }
          />

        </div>

      </div>


      {/* ================================================== */}
      {/* MATCHING DETAILS */}
      {/* ================================================== */}

      <div className="mt-6">

        <div className="space-y-3.5">

          {/* SEMANTIC */}

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 w-[140px] flex-shrink-0">

              <Sparkles
                size={15}
                className={
                  best
                    ? "text-purple-400"
                    : "text-blue-400"
                }
              />

              <span className="text-[12px] text-gray-400">
                Semantic Similarity
              </span>

            </div>


            <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">

              <div
                className={`
                  h-full
                  rounded-full
                  ${
                    best
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }
                `}
                style={{
                  width: `${Math.min(
                    Math.max(
                      supervisor.semantic_score,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>


            <span className="w-[50px] text-right text-[12px] font-medium text-white">
              {supervisor.semantic_score}%
            </span>

          </div>


          {/* DOMAIN */}

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 w-[140px] flex-shrink-0">

              <CheckCircle2
                size={15}
                className={
                  best
                    ? "text-purple-400"
                    : "text-blue-400"
                }
              />

              <span className="text-[12px] text-gray-400">
                Domain Match
              </span>

            </div>


            <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">

              <div
                className={`
                  h-full
                  rounded-full
                  ${
                    best
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }
                `}
                style={{
                  width: `${Math.min(
                    Math.max(
                      supervisor.domain_score,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>


            <span className="w-[50px] text-right text-[12px] font-medium text-white">
              {supervisor.domain_score}%
            </span>

          </div>


          {/* KEYWORD */}

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 w-[140px] flex-shrink-0">

              <Users
                size={15}
                className={
                  best
                    ? "text-purple-400"
                    : "text-blue-400"
                }
              />

              <span className="text-[12px] text-gray-400">
                Keyword Match
              </span>

            </div>


            <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">

              <div
                className={`
                  h-full
                  rounded-full
                  ${
                    best
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }
                `}
                style={{
                  width: `${Math.min(
                    Math.max(
                      supervisor.keyword_score,
                      0
                    ),
                    100
                  )}%`,
                }}
              />

            </div>


            <span className="w-[50px] text-right text-[12px] font-medium text-white">
              {supervisor.keyword_score}%
            </span>

          </div>


          {/* AVAILABILITY */}

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 w-[140px] flex-shrink-0">

              <CheckCircle2
                size={15}
                className="text-green-400"
              />

              <span className="text-[12px] text-gray-400">
                Availability
              </span>

            </div>


            <div className="flex-1" />

            <span className="w-[50px] text-right text-[12px] font-medium text-green-400">
              Available
            </span>

          </div>


          {/* OPEN SLOTS */}

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 w-[140px] flex-shrink-0">

              <Clock3
                size={15}
                className={
                  best
                    ? "text-purple-400"
                    : "text-blue-400"
                }
              />

              <span className="text-[12px] text-gray-400">
                Open Slots
              </span>

            </div>


            <div className="flex-1" />

            <span className="w-[50px] text-right text-[13px] font-bold text-white">
              3
            </span>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* WHY RECOMMENDED */}
      {/* ================================================== */}

      <div
        className={`
          mt-6
          rounded-lg
          p-4
          border

          ${
            best
              ? "bg-purple-500/5 border-purple-500/15"
              : "bg-blue-500/5 border-blue-500/15"
          }
        `}
      >

        <div className="flex items-start gap-3">

          <div
            className={`
              w-8
              h-8
              rounded-md
              flex
              items-center
              justify-center
              flex-shrink-0

              ${
                best
                  ? "bg-purple-500/10"
                  : "bg-blue-500/10"
              }
            `}
          >

            <Sparkles
              size={15}
              className={
                best
                  ? "text-purple-400"
                  : "text-blue-400"
              }
            />

          </div>


          <div className="min-w-0">

            <h4 className="text-[13px] font-semibold text-white">
              Why Recommended
            </h4>

            <p className="mt-1.5 text-[12px] text-gray-400 leading-5">
              {supervisor.reason}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SupervisorCard;