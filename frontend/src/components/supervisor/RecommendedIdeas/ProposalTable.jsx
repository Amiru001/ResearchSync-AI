import ProposalRow from "./ProposalRow";

const ProposalTable = ({ proposals }) => {
  return (
    <div>

      {/* Table Header */}

      <div className="grid grid-cols-12 px-6 py-4 border-b border-gray-700 bg-[#0F172A]">

        <div className="col-span-3">
          <h3 className="text-[13px] font-semibold text-gray-300">
            Research Title
          </h3>
        </div>

        <div className="col-span-2">
          <h3 className="text-[13px] font-semibold text-gray-300">
            Student
          </h3>
        </div>

        <div className="col-span-2">
          <h3 className="text-[13px] font-semibold text-gray-300">
            Domain
          </h3>
        </div>

        <div className="col-span-2 text-center">
          <h3 className="text-[13px] font-semibold text-gray-300">
            Matching Score
          </h3>
        </div>

        <div className="col-span-2">
          <h3 className="text-[13px] font-semibold text-gray-300">
            Submitted On
          </h3>
        </div>

        <div className="col-span-1 text-center">
          <h3 className="text-[13px] font-semibold text-gray-300">
            Actions
          </h3>
        </div>

      </div>

      {/* Table Rows */}

      <div>

        {proposals.map((proposal) => (

          <ProposalRow
            key={proposal.id}
            proposal={proposal}
          />

        ))}

      </div>

    </div>
  );
};

export default ProposalTable;