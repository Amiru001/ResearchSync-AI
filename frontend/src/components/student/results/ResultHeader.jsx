import {
  FileText,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

const ResultHeader = ({ result }) => {
  return (
    <div
      className="
        bg-[#111827]
        border
        border-gray-500
        rounded-xl
        px-5
        py-4
      "
    >

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        {/* ================================================== */}
        {/* LEFT SIDE */}
        {/* ================================================== */}

        <div className="flex items-center gap-3 min-w-0">

          {/* Icon */}

          <div
            className="
              w-12
              h-12
              rounded-xl
              bg-purple-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >
            <FileText
              size={22}
              className="text-purple-400"
            />
          </div>


          {/* Proposal Details */}

          <div className="min-w-0">

            {/* Label */}

            <p
              className="
                text-[15px]
                font-medium
                uppercase
                tracking-wider
                text-purple-400
              "
            >
              Research Proposal
            </p>


            {/* Title */}

            <h2
              className="
                mt-1
                text-[17px]
                sm:text-[20px]
                font-semibold
                text-white
                leading-6
                break-words
              "
            >
              {result.title}
            </h2>


            {/* Date */}

            <div
              className="
                flex
                items-center
                gap-1.5
                mt-1.5
              "
            >
              <CalendarDays
                size={14}
                className="text-gray-500"
              />

              <p className="text-[12px] text-gray-400">
                Submitted on {result.date}
              </p>
            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* STATUS */}
        {/* ================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            self-start
            md:self-center
            px-3.5
            py-2
            rounded-full
            bg-green-500/10
            border
            border-green-500/20
            flex-shrink-0
          "
        >

          <CheckCircle2
            size={15}
            className="text-green-400"
          />

          <span
            className="
              text-[12px]
              font-medium
              text-green-400
            "
          >
            {result.status}
          </span>

        </div>

      </div>

    </div>
  );
};

export default ResultHeader;