import { useState } from "react";

import {
  FileText,
  CircleAlert,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import EditProposalDialog from "./EditProposalDialog";


const ResearchDescriptionCard = ({
  description,
  problemStatement,
  objectives,
  editable = false,
  onSave,
}) => {

  const [showDialog, setShowDialog] = useState(false);


  // ============================================================
  // SAFELY HANDLE OBJECTIVES
  // ============================================================

  const safeObjectives = Array.isArray(objectives)
    ? objectives
    : objectives
      ? [objectives]
      : [];


  // ============================================================
  // PROPOSAL DATA
  // ============================================================

  const proposal = {
    description,
    problemStatement,
    objectives: safeObjectives,
  };


  // ============================================================
  // HANDLE SAVE
  // ============================================================

  const handleSave = async (updatedProposal) => {

  try {

    await onSave(updatedProposal);

    setShowDialog(false);

  } catch (error) {

    console.error(
      "Failed to save proposal:",
      error
    );

  }

};


  return (
    <>

      {/* ================================================== */}
      {/* RESEARCH PROPOSAL CARD */}
      {/* ================================================== */}

      <div
        className="
          rounded-xl
          border
          border-gray-700
          bg-[#111827]
          p-8
        "
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className="
                w-11
                h-11
                rounded-lg
                bg-purple-600
                flex
                items-center
                justify-center
              "
            >

              <FileText
                size={20}
                className="text-white"
              />

            </div>


            <h2 className="text-[18px] font-semibold text-white">
              Research Proposal
            </h2>

          </div>


          {/* ================================================== */}
          {/* EDIT BUTTON */}
          {/* ================================================== */}

          {editable && (

            <button
              type="button"
              onClick={() => setShowDialog(true)}
              className="
                flex
                items-center
                gap-2
                px-2
                h-8
                rounded-lg
                border
                border-purple-500/30
                bg-purple-500/10
                text-purple-300
                text-[13px]
                font-medium
                hover:bg-purple-500/20
                hover:border-purple-500/50
                transition-all
                duration-300
                cursor-pointer
              "
            >

              <Pencil size={14} />

              <span>
                Edit
              </span>

            </button>

          )}

        </div>


        {/* ================================================== */}
        {/* RESEARCH DESCRIPTION */}
        {/* ================================================== */}

        <div className="mt-8">

          <h3 className="text-[15px] font-semibold text-white">
            Research Description
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-gray-300">
            {description || "No research description available."}
          </p>

        </div>


        <div className="border-t border-gray-700 my-8"></div>


        {/* ================================================== */}
        {/* PROBLEM STATEMENT */}
        {/* ================================================== */}

        <div>

          <div className="flex items-center gap-2">

            <CircleAlert
              size={17}
              className="text-orange-400"
            />

            <h3 className="text-[15px] font-semibold text-white">
              Problem Statement
            </h3>

          </div>

          <p className="mt-3 text-[15px] leading-7 text-gray-300">
            {problemStatement ||
              "No problem statement available."}
          </p>

        </div>


        <div className="border-t border-gray-700 my-8"></div>


        {/* ================================================== */}
        {/* RESEARCH OBJECTIVES */}
        {/* ================================================== */}

        <div>

          <h3 className="text-[15px] font-semibold text-white">
            Research Objectives
          </h3>

          <div className="mt-4 space-y-3">

            {safeObjectives.length > 0 ? (

              safeObjectives.map((objective, index) => (

                <div
                  key={index}
                  className="flex items-start gap-3"
                >

                  <CheckCircle2
                    size={18}
                    className="
                      text-green-400
                      mt-1
                      flex-shrink-0
                    "
                  />

                  <p className="text-[15px] leading-7 text-gray-300">
                    {objective}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-[15px] leading-7 text-gray-500">
                No research objectives available.
              </p>

            )}

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* EDIT DIALOG */}
      {/* ================================================== */}

      {showDialog && (

        <EditProposalDialog
          proposal={proposal}
          onClose={() => setShowDialog(false)}
          onSave={handleSave}
        />

      )}

    </>
  );
};


export default ResearchDescriptionCard;