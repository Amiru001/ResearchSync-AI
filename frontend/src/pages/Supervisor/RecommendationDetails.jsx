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
import ActionButtons from "../../components/supervisor/RecommendationDetails/ActionButtons";

import {
  getResearchIdeaDetails,
} from "../../services/supervisorService";


const RecommendationDetails = () => {

  // ============================================================
  // GET RESEARCH ID FROM URL
  // ============================================================

  const { id } = useParams();


  // ============================================================
  // STATE
  // ============================================================

  const [proposal, setProposal] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ============================================================
  // LOAD PROPOSAL
  // ============================================================

  useEffect(() => {

    const loadProposal = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getResearchIdeaDetails(id);

        console.log(
          "Research Proposal Details:",
          data
        );


        // Backend may return an error message

        if (data?.message) {

          setError(data.message);

          return;
        }


        setProposal(data);

      } catch (error) {

        console.error(
          "Failed to load research proposal:",
          error
        );

        setError(
          "Failed to load research proposal."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {

      loadProposal();

    } else {

      setError(
        "Research proposal ID is missing."
      );

      setLoading(false);

    }

  }, [id]);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <SupervisorLayout>

        <div className="flex items-center justify-center min-h-[500px]">

          <p className="text-gray-400">

            Loading research proposal...

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

        <div className="flex items-center justify-center min-h-[500px]">

          <div className="text-center">

            <h2 className="text-xl font-semibold text-white">

              Research Proposal Not Found

            </h2>

            <p className="text-gray-400 mt-2">

              {error ||
                "Unable to load this research proposal."}

            </p>

          </div>

        </div>

      </SupervisorLayout>

    );

  }


  // ============================================================
  // PREPARE OBJECTIVES
  // ============================================================

  let objectives = [];

  if (Array.isArray(proposal.objectives)) {

    objectives = proposal.objectives;

  } else if (proposal.objectives) {

    objectives = proposal.objectives
      .split("\n")
      .map((item) =>
        item
          .replace(/^\d+[\.\)]\s*/, "")
          .trim()
      )
      .filter(Boolean);

  }


  // ============================================================
  // FINAL PROPOSAL DATA
  // ============================================================

  const proposalData = {

    ...proposal,

    objectives,

  };


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <SupervisorLayout>

      <div className="space-y-4">


        {/* ================================================== */}
        {/* Back Button */}
        {/* ================================================== */}

        <BackButton
          label="Back to Recommended Ideas"
          to="/supervisor/recommendations"
        />


        {/* ================================================== */}
        {/* Proposal Header */}
        {/* ================================================== */}

        <ProposalHeader
          proposal={proposalData}
        />


        {/* ================================================== */}
        {/* Student + Proposal Information */}
        {/* ================================================== */}

        <div className="grid grid-cols-12 gap-4">


          {/* Student */}

          <div className="col-span-4">

            <StudentCard
              student={proposalData.student}
            />

          </div>


          {/* Proposal Information */}

          <div className="col-span-8">

            <ProposalInfoCard
              proposal={proposalData}
            />

          </div>


        </div>


        {/* ================================================== */}
        {/* Main Content */}
        {/* ================================================== */}

        <div className="grid grid-cols-12 gap-4">


          {/* ================================================== */}
          {/* Left Side */}
          {/* ================================================== */}

          <div className="col-span-7 space-y-4">

            <ResearchDescriptionCard

              description={
                proposalData.description
              }

              problemStatement={
                proposalData.problemStatement
              }

              objectives={
                proposalData.objectives
              }

            />

          </div>


          {/* ================================================== */}
          {/* Right Side */}
          {/* ================================================== */}

          <div className="col-span-5 space-y-4">


            {/* Keywords */}

            <KeywordsCard
              keywords={
                proposalData.keywords
              }
            />


            {/* Topic Similarity */}

            <TopicSimilarityCard
              similarity={
                proposalData.similarity
              }
            />


          </div>


        </div>


        {/* ================================================== */}
        {/* Action Buttons */}
        {/* ================================================== */}

        <ActionButtons
          proposalId={proposal.id}
        />


      </div>

    </SupervisorLayout>

  );

};


export default RecommendationDetails;