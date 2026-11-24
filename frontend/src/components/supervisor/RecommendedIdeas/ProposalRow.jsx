import { MoreVertical } from "lucide-react";
import MatchScore from "./MatchScore";
import { useNavigate } from "react-router-dom";

const ProposalRow = ({ proposal }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/supervisor/recommendations/${proposal.id}`);
  };

  const getDomainStyle = (domain) => {
    switch (domain) {
      case "Artificial Intelligence":
        return "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20";

      case "Data Science":
        return "bg-green-500/15 text-green-300 border border-green-500/20";

      case "Cybersecurity":
        return "bg-orange-500/15 text-orange-300 border border-orange-500/20";

      case "Software Engineering":
        return "bg-pink-500/15 text-pink-300 border border-pink-500/20";

      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <>
      {/* ===================== */}
      {/* Desktop / Tablet */}
      {/* ===================== */}

      <div
        onClick={handleViewDetails}
        className="hidden md:grid grid-cols-12 px-6 py-5 border-b border-gray-700 hover:bg-[#182131] transition cursor-pointer"
      >
        {/* Research Title */}

        <div className="col-span-3 flex items-center">
          <h3 className="text-[14px] font-semibold text-white leading-6">
            {proposal.title}
          </h3>
        </div>

        {/* Student */}

        <div className="col-span-2 flex flex-col justify-center">
          <h3 className="text-[13px] font-medium text-white">
            {proposal.student.name}
          </h3>

          <p className="text-[12px] text-gray-500 mt-1">
            {proposal.student.registration}
          </p>
        </div>

        {/* Domain */}

        <div className="col-span-2 flex items-center">
          <span
            className={`px-3 py-1 rounded-md text-[11px] font-medium ${getDomainStyle(
              proposal.domain
            )}`}
          >
            {proposal.domain}
          </span>
        </div>

        {/* Matching Score */}

        <div className="col-span-2 flex justify-center items-center">
          <MatchScore score={proposal.matchingScore} />
        </div>

        {/* Submitted */}

        <div className="col-span-2 flex flex-col justify-center">
          <span className="text-[13px] text-white">
            {proposal.submittedDate}
          </span>

          <span className="text-[12px] text-gray-500 mt-1">
            {proposal.submittedTime}
          </span>
        </div>

        {/* Actions */}

        <div className="col-span-1 flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="
              px-4
              h-9
              rounded-lg
              bg-gradient-to-r
              from-purple-600
              to-purple-500
              text-white
              text-[12px]
              font-medium
              transition-all
              duration-300
              hover:from-purple-500
              hover:to-purple-400
              cursor-pointer
            "
          >
            View Details
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-lg border border-gray-700 bg-[#1F2937] flex items-center justify-center hover:bg-[#273244]"
          >
            <MoreVertical
              size={16}
              className="text-gray-400"
            />
          </button>
        </div>
      </div>

      {/* ===================== */}
      {/* Mobile Card */}
      {/* ===================== */}

      <div
        onClick={handleViewDetails}
        className="md:hidden p-5 border-b border-gray-700 cursor-pointer"
      >
        <h3 className="text-[15px] font-semibold text-white">
          {proposal.title}
        </h3>

        <div className="mt-5 space-y-3 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Student
            </span>

            <span className="text-white">
              {proposal.student.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Registration
            </span>

            <span className="text-white">
              {proposal.student.registration}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">
              Domain
            </span>

            <span
              className={`px-2 py-1 rounded-md text-[11px] font-medium ${getDomainStyle(
                proposal.domain
              )}`}
            >
              {proposal.domain}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Matching
            </span>

            <span className="text-green-400 font-semibold">
              {Number(proposal.matchingScore || 0).toFixed(0)}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Submitted
            </span>

            <span className="text-white">
              {proposal.submittedDate}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
          className="mt-5 w-full h-10 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white text-[12px] font-medium"
        >
          View Details
        </button>
      </div>
    </>
  );
};

export default ProposalRow;