import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl px-4 py-3">

      <div className="flex items-center gap-4">

        {/* Search Box */}

        <div className="flex-1">

          <div className="flex items-center gap-3 bg-[#1F2937] rounded-lg px-4 h-10">

            <Search
              size={16}
              className="text-gray-500"
            />

            <input
              type="text"
              placeholder="Search by title, student name, or keywords..."
              className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
            />

          </div>

        </div>

        {/* Filter Button */}

        <button
          className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-600 bg-[#1F2937] hover:bg-[#273244] transition"
        >

          <SlidersHorizontal
            size={15}
            className="text-gray-400"
          />

          <span className="text-sm text-gray-300">

            Filter

          </span>

          <ChevronDown
            size={15}
            className="text-gray-400"
          />

        </button>

      </div>

    </div>
  );
};

export default SearchBar;