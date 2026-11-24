import { useEffect, useState } from "react";

import SupervisorLayout from "../../layouts/SupervisorLayout";

import SearchBar from "../../components/supervisor/RecommendedIdeas/SearchBar";
import ProposalTable from "../../components/supervisor/RecommendedIdeas/ProposalTable";
import Pagination from "../../components/supervisor/RecommendedIdeas/Pagination";

import {
  getRecommendations,
} from "../../services/api";

const RecommendedIdeas = () => {

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {

    try {

      const response = await getRecommendations();

      console.log(response);

      if (response.status === 200) {

        setProposals(response.data);

      } else {

        console.error("Failed to fetch recommendations.");

      }

    } catch (error) {

      console.error("Failed to load recommendations:", error);

    } finally {

      setLoading(false);

    }

  };

  const handlePageChange = (page) => {

    setCurrentPage(page);

  };

  const totalItems = proposals.length;

  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const currentProposals = proposals.slice(
    startIndex,
    startIndex + pageSize
  );

  if (loading) {

    return (
      <SupervisorLayout>

        <div className="flex justify-center items-center h-[400px]">

          <p className="text-white text-lg">
            Loading recommendations...
          </p>

        </div>

      </SupervisorLayout>
    );

  }

  return (

    <SupervisorLayout>

      <div className="space-y-5">

        {/* Page Header */}

        <div>

          <h1 className="text-[28px] font-bold text-white">
            Recommended Research Ideas
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Research ideas recommended for you based on your expertise and workload.
          </p>

        </div>

        <SearchBar />

        <ProposalTable
          proposals={currentProposals}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />

      </div>

    </SupervisorLayout>

  );

};

export default RecommendedIdeas;