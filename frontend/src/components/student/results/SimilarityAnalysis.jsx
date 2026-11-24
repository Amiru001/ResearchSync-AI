import {
  Percent,
  FileSearch,
  CheckCircle2,
} from "lucide-react";

const SimilarityAnalysis = ({ result }) => {

  // ============================================================
  // SIMILARITY LEVEL
  // ============================================================

  const similarityLevel =
    result.similarity >= 80
      ? {
          label: "Very High Similarity",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-300",
        }
      : result.similarity >= 60
      ? {
          label: "High Similarity",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
          text: "text-orange-300",
        }
      : result.similarity >= 30
      ? {
          label: "Moderate Similarity",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          text: "text-yellow-300",
        }
      : {
          label: "Low Similarity",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-300",
        };


  // ============================================================
  // EXPLANATION
  // ============================================================

  const getExplanation = () => {

    if (result.similarity >= 80) {

      return (
        "The submitted proposal has a very high semantic similarity "
        + "with an existing research proposal. This indicates "
        + "substantial overlap in research concepts. The proposal "
        + "should be carefully reviewed to ensure sufficient "
        + "originality before approval."
      );

    }

    if (result.similarity >= 60) {

      return (
        "The submitted proposal has a high semantic similarity "
        + "with an existing research proposal. While the research "
        + "idea may still contain novel contributions, additional "
        + "review is recommended to confirm its uniqueness."
      );

    }

    if (result.similarity >= 30) {

      return (
        "The submitted proposal shares several research concepts "
        + "with previously submitted proposals. However, the overall "
        + "similarity remains moderate, suggesting that the research "
        + "still demonstrates originality while requiring normal "
        + "academic review."
      );

    }

    return (
      "The submitted proposal has low semantic similarity with "
      + "previously submitted research proposals. This indicates "
      + "that the proposed research appears to be sufficiently "
      + "novel and demonstrates a high level of originality."
    );
  };


  return (
    <div
      className="
        bg-[#111827]
        border
        border-gray-700
        rounded-xl
        p-5
        h-full
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center gap-3 mb-5">

        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-green-500/10
            border
            border-green-500/20
            flex
            items-center
            justify-center
            flex-shrink-0
          "
        >
          <Percent
            size={20}
            className="text-green-400"
          />
        </div>

        <div className="min-w-0">

          <h2 className="text-[19px] font-semibold text-white">
            Topic Similarity Analysis
          </h2>

          <p className="mt-1 text-[12px] text-gray-400">
            Semantic comparison against previously submitted research proposals
          </p>

        </div>

      </div>


      {/* ================================================== */}
      {/* SCORE + CLOSEST TOPIC */}
      {/* ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-3
        "
      >

        {/* SIMILARITY SCORE */}

        <div
          className="
            rounded-lg
            bg-[#1F2937]
            border
            border-green-500/10
            p-4
          "
        >

          <p className="text-[11px] text-gray-400">
            Similarity Score
          </p>


          <h2 className="mt-2 text-[30px] font-semibold text-green-400 leading-none">
            {result.similarity}%
          </h2>


          <span
            className={`
              inline-flex
              mt-4
              px-2.5
              py-1
              rounded-md
              border
              text-[11px]
              font-medium
              ${similarityLevel.bg}
              ${similarityLevel.border}
              ${similarityLevel.text}
            `}
          >
            {similarityLevel.label}
          </span>

        </div>


        {/* CLOSEST EXISTING TOPIC */}

        <div
          className="
            rounded-lg
            bg-[#1F2937]
            border
            border-blue-500/10
            p-4
          "
        >

          <div className="flex items-center gap-2">

            <FileSearch
              size={17}
              className="text-blue-400"
            />

            <p className="text-[11px] text-gray-400">
              Closest Existing Topic
            </p>

          </div>


          <h3
            className="
              mt-3
              text-[14px]
              font-semibold
              text-white
              leading-5
              break-words
            "
          >
            {result.matchedTopic}
          </h3>


          <p className="mt-3 text-[11px] text-gray-500">
            Similarity : {result.similarity}%
          </p>

        </div>

      </div>


      {/* ================================================== */}
      {/* EXPLANATION */}
      {/* ================================================== */}

      <div
        className="
          mt-4
          rounded-lg
          bg-green-500/5
          border
          border-green-500/15
          p-4
        "
      >

        <div className="flex items-start gap-3">

          <div
            className="
              w-8
              h-8
              rounded-md
              bg-green-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <CheckCircle2
              size={15}
              className="text-green-400"
            />

          </div>


          <div className="min-w-0">

            <h3 className="text-[13px] font-semibold text-white">
              Similarity Explanation
            </h3>

            <p className="mt-1.5 text-[12px] text-gray-400 leading-5">
              {getExplanation()}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SimilarityAnalysis;