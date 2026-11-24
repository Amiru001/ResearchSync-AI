import { Tag } from "lucide-react";

const KeywordsCard = ({ keywords }) => {
  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-6">

      {/* Header */}

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-lg bg-purple-600 flex items-center justify-center">

          <Tag
            size={20}
            className="text-white"
          />

        </div>

        <h2 className="text-[16px] font-semibold text-white">
          Keywords
        </h2>

      </div>

      {/* Keywords */}

      <div className="flex flex-wrap gap-3 mt-6">

        {keywords.map((keyword) => (

          <span
            key={keyword}
            className="px-4 py-2 rounded-lg bg-[#1B2334] border border-indigo-500/20 text-[13px] text-indigo-300"
          >
            {keyword}
          </span>

        ))}

      </div>

    </div>
  );
};

export default KeywordsCard;