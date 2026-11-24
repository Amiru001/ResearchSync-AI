import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SupervisorLayout from "../../layouts/SupervisorLayout";

import BackButton from "../../components/supervisor/RecommendationDetails/BackButton";
import ProposalHeader from "../../components/supervisor/RecommendationDetails/ProposalHeader";
import StudentCard from "../../components/supervisor/RecommendationDetails/StudentCard";
import ProposalInfoCard from "../../components/supervisor/RecommendationDetails/ProposalInfoCard";
import ResearchDescriptionCard from "../../components/supervisor/RecommendationDetails/ResearchDescriptionCard";
import KeywordsCard from "../../components/supervisor/RecommendationDetails/KeywordsCard";
import TopicSimilarityCard from "../../components/supervisor/RecommendationDetails/TopicSimilarityCard";

import {
  getMySupervisionDetails,
  updateMySupervisionDetails,
} from "../../services/supervisorService";


const SupervisionDetails = () => {

  // ============================================================
  // GET ID FROM URL
  // ============================================================

  const { id } = useParams();


  // ============================================================
  // STATE
  // ============================================================

  const [proposal, setProposal] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // LOAD SUPERVISION DETAILS
  // ============================================================

  useEffect(() => {

    const loadSupervisionDetails = async () => {

      try {

        setLoading(true);

        setError("");


        console.log(
          "Loading supervision ID:",
          id
        );


        const data =
          await getMySupervisionDetails(id);


        console.log(
          "Supervision details:",
          data
        );


        // --------------------------------------------------------
        // BACKEND ERROR
        // --------------------------------------------------------

        if (data?.success === false) {

          setError(
            data.message ||
            "Unable to load supervision details."
          );

          return;

        }


        // --------------------------------------------------------
        // SUCCESS
        // --------------------------------------------------------

        setProposal(data);

      }

      catch (error) {

        console.error(
          "Failed to load supervision details:",
          error
        );


        setError(
          error?.message ||
          "Unable to load supervision details."
        );

      }

      finally {

        setLoading(false);

      }

    };


    if (id) {

      loadSupervisionDetails();

    }

  }, [id]);


  // ============================================================
  // SAVE EDITED PROPOSAL
  // ============================================================

  const handleProposalSave = async (updatedProposal) => {

    try {

      console.log(
        "Saving proposal:",
        updatedProposal
      );


      // --------------------------------------------------------
      // UPDATE DATABASE
      // --------------------------------------------------------

      const response =
        await updateMySupervisionDetails(
          id,
          updatedProposal
        );


      console.log(
        "Update response:",
        response
      );


      // --------------------------------------------------------
      // CHECK RESPONSE
      // --------------------------------------------------------

      if (!response?.success) {

        throw new Error(
          response?.message ||
          "Failed to update proposal."
        );

      }


      // --------------------------------------------------------
      // LOAD UPDATED DATA FROM DATABASE
      // --------------------------------------------------------

      const updatedData =
        await getMySupervisionDetails(id);


      console.log(
        "Updated supervision details:",
        updatedData
      );


      // --------------------------------------------------------
      // UPDATE PAGE
      // --------------------------------------------------------

      setProposal(updatedData);


      console.log(
        "Proposal updated successfully."
      );

    }

    catch (error) {

      console.error(
        "Failed to update proposal:",
        error
      );


      throw error;

    }

  };

  const handleTitleSave = async (updatedTitle) => {

  try {

    console.log(
      "Saving title:",
      updatedTitle
    );


    const response =
      await updateMySupervisionDetails(
        id,
        {
          title: updatedTitle.title,

          // Keep existing proposal data
          // so other fields are not overwritten.
          description:
            proposal.description,

          problemStatement:
            proposal.problemStatement,

          objectives:
            proposal.objectives,
        }
      );


    if (!response?.success) {

      throw new Error(
        response?.message ||
        "Failed to update research title."
      );

    }


    // Refresh data from MongoDB

    const updatedData =
      await getMySupervisionDetails(id);


    setProposal(updatedData);


    console.log(
      "Research title updated successfully:",
      updatedData
    );

  } catch (error) {

    console.error(
      "Failed to update research title:",
      error
    );

    throw error;

  }

};


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <SupervisorLayout>

        <div className="flex justify-center items-center h-[400px]">

          <p className="text-white text-lg">

            Loading supervision details...

          </p>

        </div>

      </SupervisorLayout>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error || !proposal) {

    return (

      <SupervisorLayout>

        <div className="space-y-5">

          <BackButton
            label="Back to My Supervisions"
            to="/supervisor/supervisions"
          />


          <div
            className="
              rounded-xl
              border
              border-red-500/30
              bg-[#111827]
              py-16
              text-center
            "
          >

            <p className="text-red-400 text-sm">

              {error ||
                "Supervision details not found."}

            </p>

          </div>

        </div>

      </SupervisorLayout>

    );

  }


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <SupervisorLayout>

      <div className="space-y-5">


        {/* ================================================== */}
        {/* BACK BUTTON */}
        {/* ================================================== */}

        <BackButton
          label="Back to My Supervisions"
          to="/supervisor/supervisions"
        />


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <ProposalHeader
  proposal={proposal}
  onSave={handleTitleSave}
/>


        {/* ================================================== */}
        {/* STUDENT + PROPOSAL INFO */}
        {/* ================================================== */}

        <div className="grid grid-cols-12 gap-4">


          {/* Student */}

          <div className="col-span-4">

            <StudentCard
              student={proposal.student}
            />

          </div>


          {/* Proposal Info */}

          <div className="col-span-8">

            <ProposalInfoCard
              proposal={proposal}
            />

          </div>


        </div>


        {/* ================================================== */}
        {/* MAIN CONTENT */}
        {/* ================================================== */}

        <div className="grid grid-cols-12 gap-4">


          {/* ================================================== */}
          {/* LEFT SIDE */}
          {/* ================================================== */}

          <div className="col-span-7 space-y-4">

            <ResearchDescriptionCard

              description={
                proposal.description
              }

              problemStatement={
                proposal.problemStatement
              }

              objectives={
                proposal.objectives
              }

              editable={true}

              onSave={
                handleProposalSave
              }

            />

          </div>


          {/* ================================================== */}
          {/* RIGHT SIDE */}
          {/* ================================================== */}

          <div className="col-span-5 space-y-4">


            {/* Keywords */}

            <KeywordsCard
              keywords={
                proposal.keywords || []
              }
            />


            {/* Topic Similarity */}

            <TopicSimilarityCard
              similarity={
                proposal.similarity
              }
            />


          </div>


        </div>


        {/* ================================================== */}
        {/* SUPERVISOR COMMENT */}
        {/* ================================================== */}

        {proposal.supervisor?.comment && (

          <div
            className="
              rounded-xl
              border
              border-gray-700
              bg-[#111827]
              p-5
            "
          >

            <h3
              className="
                text-[15px]
                font-semibold
                text-white
                mb-3
              "
            >

              Supervisor Comment

            </h3>


            <p
              className="
                text-[14px]
                leading-7
                text-gray-300
              "
            >

              {proposal.supervisor.comment}

            </p>

          </div>

        )}

      </div>

    </SupervisorLayout>

  );

};


export default SupervisionDetails;