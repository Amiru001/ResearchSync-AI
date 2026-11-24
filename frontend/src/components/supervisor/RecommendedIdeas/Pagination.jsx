import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {

  const startItem = (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(
    currentPage * pageSize,
    totalItems
  );

  return (

    <div className="bg-[#111827] border border-gray-700 rounded-xl px-6 py-3">

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Results */}

        <p className="text-[13px] text-gray-400">

          Showing{" "}

          <span className="text-white font-medium">
            {startItem}-{endItem}
          </span>{" "}

          of{" "}

          <span className="text-white font-medium">
            {totalItems}
          </span>{" "}

          results

        </p>

        {/* Pagination */}

        <div className="flex items-center gap-2">

          {/* Previous */}

          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-lg border border-gray-700 bg-[#1F2937] flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#2B3648] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >

            <ChevronLeft size={16} />

          </button>

          {/* Page Numbers */}

          {Array.from(
            { length: totalPages },
            (_, index) => {

              const page = index + 1;

              return (

                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-9 h-9 rounded-lg text-[13px] font-medium transition-all duration-300 cursor-pointer ${
                    currentPage === page
                      ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                      : "bg-[#1F2937] border border-gray-700 text-gray-400 hover:bg-[#2B3648]"
                  }`}
                >

                  {page}

                </button>

              );

            }
          )}

          {/* Next */}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-lg border border-gray-700 bg-[#1F2937] flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#2B3648] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >

            <ChevronRight size={16} />

          </button>

        </div>

      </div>

    </div>

  );

};

export default Pagination;