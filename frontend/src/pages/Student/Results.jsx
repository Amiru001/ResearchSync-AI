import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import ResultHeader from "../../components/student/results/ResultHeader";
import SummaryCards from "../../components/student/results/SummaryCards";
import SupervisorSection from "../../components/student/results/SupervisorSection";
import DomainAnalysis from "../../components/student/results/DomainAnalysis";
import SimilarityAnalysis from "../../components/student/results/SimilarityAnalysis";

import { getLatestResearch } from "../../services/researchService";

const Results = () => {

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadResearch();
  }, []);

  const loadResearch = async () => {

    try {

      const data = await getLatestResearch();
      console.log("Latest Research:", data);

      setResult(data);

    } catch (error) {

      console.error(error);

    }

  };

  if (!result) {

    return (

      <DashboardLayout>

        <div className="max-w-6xl mx-auto py-10">

          <h2 className="text-white text-xl">

            Loading...

          </h2>

        </div>

      </DashboardLayout>

    );

  }

  // Supervisor list from backend

  const supervisors =
    result.recommended_supervisor?.top_supervisors ?? [];

  const displayData = {
  title: result.research_title,

  date: new Date(result.created_at).toLocaleString(),

  status: result.status,

  domain: result.domain?.primary_domain ?? "Pending",

  confidence: result.domain?.confidence ?? 0,

  similarity:
    result.similarity_score?.similarity_percentage ?? 0,

  matchedTopic:
    result.similarity_score?.matched_title ??
    "No matching proposal found",

  similarityResult:
    result.similarity_score,

  // ----------------------------------------------------------
  // SUPERVISION STATUS
  // ----------------------------------------------------------

  supervisionStatus:
    result.supervision?.status ?? "Pending",

  // ----------------------------------------------------------
  // RECOMMENDED SUPERVISOR
  // ----------------------------------------------------------

  recommendedSupervisor:
    supervisors.length > 0
      ? supervisors[0].supervisor_name
      : "Recommendation Pending",

  // ----------------------------------------------------------
  // ACTUAL ASSIGNED SUPERVISOR
  // ----------------------------------------------------------

  assignedSupervisor:
    result.supervision?.status === "Accepted"
      ? result.supervision?.supervisor_name
      : null,
};

  return (

    <DashboardLayout>

      <div className="max-w-6xl mx-auto space-y-4">

        <div>

          <h1 className="text-3xl font-bold text-white">

            AI Analysis Results

          </h1>

          <p className="text-sm text-gray-400 mt-1">

            AI powered insights for your research idea.

          </p>

        </div>

        <ResultHeader result={displayData} />

        <SummaryCards result={displayData} />

        <SupervisorSection
          supervisors={supervisors}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

  <DomainAnalysis
    domains={result.domain.all_domains}
  />

  <SimilarityAnalysis
    result={displayData}
  />

</div>

      </div>

    </DashboardLayout>

  );

  

};

export default Results;