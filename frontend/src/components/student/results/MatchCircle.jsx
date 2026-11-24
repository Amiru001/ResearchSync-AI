const MatchCircle = ({ score = 0, color = "#3B82F6" }) => {

  const radius = 30;
  const stroke = 5;

  const normalizedRadius = radius - stroke;

  const circumference =
    normalizedRadius * 2 * Math.PI;

  const safeScore = Math.min(
    Math.max(Number(score) || 0, 0),
    100
  );

  const strokeDashoffset =
    circumference -
    (safeScore / 100) * circumference;

  return (
    <div className="relative w-[70px] h-[70px]">

      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="
          w-full
          h-full
          -rotate-90
        "
      >

        {/* Background circle */}

        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress circle */}

        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition:
              "stroke-dashoffset 0.5s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

      </svg>


      {/* Centered percentage */}

      <div className="
        absolute
        inset-0
        flex
        items-center
        justify-center
      ">
        <span className="
          text-white
          font-semibold
          text-[13px]
          leading-none
          whitespace-nowrap
        ">
          {safeScore}%
        </span>
      </div>

    </div>
  );
};

export default MatchCircle;