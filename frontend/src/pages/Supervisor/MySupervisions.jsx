import { useEffect, useState } from "react";

import SupervisorLayout from "../../layouts/SupervisorLayout";

import SearchBar from "../../components/supervisor/RecommendedIdeas/SearchBar";
import SupervisionTable from "../../components/supervisor/MySupervisions/SupervisionTable";
import Pagination from "../../components/supervisor/RecommendedIdeas/Pagination";

import {
  getMySupervisions,
} from "../../services/supervisorService";


const MySupervisions = () => {

  const [proposals, setProposals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;


  // ============================================================
  // LOAD MY SUPERVISIONS
  // ============================================================

  useEffect(() => {

    const loadSupervisions = async () => {

      try {

        const data = await getMySupervisions();

        console.log(
          "My Supervisions:",
          data
        );

        setProposals(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(
          "Failed to load my supervisions:",
          error
        );

        setProposals([]);

      } finally {

        setLoading(false);

      }

    };

    loadSupervisions();

  }, []);


  // ============================================================
  // PAGINATION
  // ============================================================

  const totalItems = proposals.length;

  const totalPages =
    Math.ceil(
      totalItems / pageSize
    );

  const startIndex =
    (currentPage - 1) * pageSize;

  const currentProposals =
    proposals.slice(
      startIndex,
      startIndex + pageSize
    );


  const handlePageChange = (page) => {

    setCurrentPage(page);

  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <SupervisorLayout>

        <div className="flex justify-center items-center h-[400px]">

          <p className="text-white text-lg">

            Loading my supervisions...

          </p>

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
        {/* PAGE HEADER */}
        {/* ================================================== */}

        <div>

          <h1 className="text-[28px] font-bold text-white">

            My Supervisions

          </h1>

          <p className="mt-1 text-sm text-gray-400">

            Manage the research projects assigned to you.

          </p>

        </div>


        {/* ================================================== */}
        {/* SEARCH */}
        {/* ================================================== */}

        <SearchBar />


        {/* ================================================== */}
        {/* EMPTY STATE */}
        {/* ================================================== */}

        {proposals.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-gray-700
              bg-[#111827]
              py-16
              text-center
            "
          >

            <p className="text-gray-400 text-sm">

              No research projects have been assigned to you yet.

            </p>

          </div>

        ) : (

          <>

            {/* ================================================== */}
            {/* TABLE */}
            {/* ================================================== */}

            <SupervisionTable
              proposals={currentProposals}
            />


            {/* ================================================== */}
            {/* PAGINATION */}
            {/* ================================================== */}

            {totalPages > 1 && (

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />

            )}

          </>

        )}

      </div>

    </SupervisorLayout>

  );

};

export default MySupervisions;