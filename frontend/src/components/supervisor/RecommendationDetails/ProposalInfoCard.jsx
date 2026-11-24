import {
  CalendarDays,
  BrainCircuit,
} from "lucide-react";

const ProposalInfoCard = ({ proposal }) => {
  return (
    <div className="bg-[#111827] border border-gray-900 rounded-xl h-[105px] px-8 py-3">

      <div className="flex flex-col lg:flex-row lg:items-center">

        {/* Domain */}

        <div className="flex-1">

          <p className="text-[14px] text-gray-400 mb-3">
            Domain
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">

            <BrainCircuit
              size={16}
              className="text-indigo-400"
            />

            <span className="text-[13px] font-medium text-indigo-300">
              {proposal.domain}
            </span>

          </div>

        </div>

        {/* Divider */}

        <div className="hidden lg:block h-20 w-px bg-gray-700 mx-8" />

        <div className="block lg:hidden h-px bg-gray-700 my-5" />

        {/* Matching Score */}

        <div className="flex-1">

          <p className="text-[14px] text-gray-400 mb-3">
            Matching Score
          </p>

          <h2 className="text-[22px] font-bold text-green-400 leading-none">
            {proposal.matchingScore}%
          </h2>

        </div>

        {/* Divider */}

        <div className="hidden lg:block h-20 w-px bg-gray-700 mx-8" />

        <div className="block lg:hidden h-px bg-gray-700 my-5" />

        {/* Submitted */}

        <div className="flex-1">

          <p className="text-[14px] text-gray-400 mb-3">
            Submitted On
          </p>

          <div className="flex items-start gap-3">

            <CalendarDays
              size={18}
              className="text-gray-500 mt-1 flex-shrink-0"
            />

            <div>

              <p className="text-[16px] font-medium text-white">
                {proposal.submittedDate}
              </p>

              <p className="text-[13px] text-gray-400 mt-1">
                {proposal.submittedTime}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProposalInfoCard;