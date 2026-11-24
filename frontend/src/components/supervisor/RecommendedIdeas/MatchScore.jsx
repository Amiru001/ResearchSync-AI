const MatchScore = ({ score }) => {

  const radius = 26;

  const stroke = 5;

  const normalizedRadius = radius - stroke / 2;

  const circumference = normalizedRadius * 2 * Math.PI;

  const offset =
    circumference -
    (score / 100) * circumference;

  const getColor = () => {

    if (score >= 85)
      return "#22C55E";

    if (score >= 70)
      return "#F59E0B";

    return "#EF4444";

  };

  return (

    <div className="relative w-[58px] h-[58px]">

      <svg
        width="58"
        height="58"
        className="-rotate-90"
      >

        {/* Background */}

        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx="29"
          cy="29"
        />

        {/* Progress */}

        <circle
          stroke={getColor()}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx="29"
          cy="29"
        />

      </svg>

      <div className="absolute inset-0 flex items-center justify-center">

        <span className="text-[11px] font-semibold text-white">

          {score.toFixed(0)}%

        </span>

      </div>

    </div>

  );

};

export default MatchScore;