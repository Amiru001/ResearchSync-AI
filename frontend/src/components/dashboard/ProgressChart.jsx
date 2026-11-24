import {
  CheckCircle2,
  Circle,
  LoaderCircle,
} from "lucide-react";


const ProgressChart = ({ result }) => {

  // ============================================================
  // DYNAMIC STATUS CHECKS
  // ============================================================

  const hasResearch = !!result;

  const domainCompleted =
    !!result?.domain?.primary_domain;

  const similarityCompleted =
    result?.similarity_score?.status === "Completed";

  // ============================================================
  // PLAGIARISM
  // NOT BUILT YET
  // ============================================================

  /*
  const plagiarismCompleted =
    result?.plagiarism_score !== null &&
    result?.plagiarism_score !== undefined;
  */

  const supervisorAccepted =
    result?.supervision?.status === "Accepted";

  const proposalApproved =
  result?.status === "Approved" ||
  result?.supervision?.status === "Accepted";


  // ============================================================
  // FIND CURRENT STEP
  // ============================================================

  let currentStep = 0;

  if (!hasResearch) {
    currentStep = 0;
  } else if (!domainCompleted) {
    currentStep = 1;
  } else if (!similarityCompleted) {
    currentStep = 2;
  } else if (!supervisorAccepted) {
    currentStep = 3;
  } else if (!proposalApproved) {
    currentStep = 4;
  }


  // ============================================================
  // WORKFLOW STEPS
  // ============================================================

  const steps = [
    {
      title: "Submitted",
      status: hasResearch ? "completed" : "active",
    },

    {
      title: "Domain",
      status: domainCompleted
        ? "completed"
        : currentStep === 1
        ? "active"
        : "pending",
    },

    {
      title: "Similarity",
      status: similarityCompleted
        ? "completed"
        : currentStep === 2
        ? "active"
        : "pending",
    },

    // ==========================================================
    // PLAGIARISM
    // NOT BUILT YET
    // ==========================================================

    /*
    {
      title: "Plagiarism",
      status: plagiarismCompleted
        ? "completed"
        : currentStep === 3
        ? "active"
        : "pending",
    },
    */

    {
      title: "Supervisor",
      status: supervisorAccepted
        ? "completed"
        : currentStep === 3
        ? "active"
        : "pending",
    },

    {
      title: "Approved",
      status: proposalApproved
        ? "completed"
        : currentStep === 4
        ? "active"
        : "pending",
    },
  ];


  // ============================================================
  // CURRENT STATUS MESSAGE
  // ============================================================

  const getCurrentStatus = () => {

    if (!result) {
      return "No research proposal has been submitted yet.";
    }

    if (!domainCompleted) {
      return "Your research proposal has been submitted and is waiting for domain classification.";
    }

    if (!similarityCompleted) {
      return "Your research domain has been classified. Similarity analysis is currently in progress.";
    }

    if (!supervisorAccepted) {
      return "Your proposal has passed AI classification and similarity analysis. It is currently waiting for supervisor allocation.";
    }

    if (!proposalApproved) {
      return "Your supervisor has been assigned. Your research proposal is currently waiting for final approval.";
    }

    return "Your research proposal has been approved successfully.";
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="bg-[#111827] rounded-xl border border-gray-500 p-5">

      <h2 className="text-xl font-bold text-white">
        Research Workflow
      </h2>

      <p className="text-sm text-gray-400 mt-1 mb-8">
        Track the current stage of your research proposal
      </p>


      {/* Workflow */}

      <div className="relative">

        {/* Horizontal Line */}

        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-700 rounded-full">
        </div>


        <div className="relative flex justify-between">

          {steps.map((step, index) => (

            <div
              key={index}
              className="flex flex-col items-center w-24"
            >

              {/* Circle */}

              {step.status === "completed" && (

                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10">

                  <CheckCircle2
                    size={17}
                    className="text-white"
                  />

                </div>

              )}


              {step.status === "active" && (

                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center animate-pulse z-10">

                  <LoaderCircle
                    size={17}
                    className="text-white animate-spin"
                  />

                </div>

              )}


              {step.status === "pending" && (

                <div className="w-8 h-8 rounded-full bg-[#1E293B] border-2 border-gray-600 flex items-center justify-center z-10">

                  <Circle
                    size={14}
                    className="text-gray-500"
                  />

                </div>

              )}


              {/* Text */}

              <h3 className="text-white text-xs font-semibold mt-3 text-center">
                {step.title}
              </h3>


              <span
                className={`text-[11px] mt-1 ${
                  step.status === "completed"
                    ? "text-green-400"
                    : step.status === "active"
                    ? "text-yellow-400"
                    : "text-gray-500"
                }`}
              >
                {step.status === "completed"
                  ? "Done"
                  : step.status === "active"
                  ? "Current"
                  : "Pending"}
              </span>

            </div>

          ))}

        </div>

      </div>


      {/* Status */}

      <div className="mt-8 rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">

        <h3 className="text-white text-sm font-semibold mb-2">
          Current Status
        </h3>

        <p className="text-gray-300 text-sm leading-6">
          {getCurrentStatus()}
        </p>

      </div>

    </div>
  );
};


export default ProgressChart;