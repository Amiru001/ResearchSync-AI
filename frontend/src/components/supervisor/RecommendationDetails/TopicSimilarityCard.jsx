import { GitCompare } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TopicSimilarityCard = ({ similarity }) => {
  const similarityLevel =
    similarity.score < 30
      ? "Low Similarity"
      : similarity.score < 70
      ? "Medium Similarity"
      : "High Similarity";

  return (
    <div className="bg-[#111827] border border-gray-700 rounded-xl p-6">

      {/* Header */}

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-lg bg-purple-600 flex items-center justify-center">

          <GitCompare
            size={20}
            className="text-white"
          />

        </div>

        <h2 className="text-[16px] font-semibold text-white">
          Topic Similarity
        </h2>

      </div>

      {/* Top */}

      <div className="flex items-center gap-6 mt-7">

        <div className="w-36 h-36">

          <CircularProgressbar
            value={similarity.score}
            text={`${similarity.score}%`}
            styles={buildStyles({
              pathColor: "#22C55E",
              trailColor: "#143325",
              textColor: "#4ADE80",
              textSize: "14px",
            })}
          />

        </div>

        <div>

          <h3 className="text-[18px] font-semibold text-green-400">
            {similarityLevel}
          </h3>

          <p className="mt-3 text-[13px] leading-5 text-gray-400">
            This topic is relatively unique compared to existing research in
            the system.
          </p>

        </div>

      </div>

      {/* Divider */}

      <div className="border-t border-gray-700 my-1"></div>

      {/* Bottom */}

      <div>

        <p className="text-[15px] text-gray-400">
          Closest Match
        </p>

        <h3 className="mt-2 text-[16px] font-semibold text-white">
          {similarity.closestTopic}
        </h3>

        <div className="flex justify-between items-center mt-8">

          <p className="text-[14px] text-gray-400">
            Similarity Score
          </p>

          <span className="text-[22px] font-bold text-green-400">
            {similarity.score}%
          </span>

        </div>

      </div>

    </div>
  );
};

export default TopicSimilarityCard;