const LaptopSVG = () => {
  return (
    <svg
      viewBox="0 0 520 400"
      className="w-full h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Screen */}

      <rect
        x="90"
        y="30"
        width="340"
        height="230"
        rx="14"
        fill="#0F1830"
        stroke="#2A3B66"
        strokeWidth="2"
      />

      <rect
        x="106"
        y="46"
        width="308"
        height="198"
        rx="6"
        fill="#0A1224"
      />

      {/* AI Brain */}

      <g
        className="brain-glow"
        transform="translate(180,80)"
      >
        <path
          d="M80 10C60 2 38 8 30 26C14 26 4 38 6 52C-4 60 -4 76 6 84C4 98 16 110 30 108C36 122 56 128 72 118C88 128 108 122 114 108C128 110 140 98 138 84C148 76 148 60 138 52C140 38 130 26 114 26C106 8 84 2 80 10Z"
          fill="none"
          stroke="#6FA0FF"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        <circle cx="30" cy="52" r="2.6" fill="#9CC2FF" />
        <circle cx="70" cy="40" r="2.6" fill="#9CC2FF" />
        <circle cx="110" cy="60" r="2.6" fill="#9CC2FF" />
        <circle cx="50" cy="90" r="2.6" fill="#9CC2FF" />
        <circle cx="95" cy="92" r="2.6" fill="#9CC2FF" />

        <path
          d="M30 52L70 40M70 40L110 60M50 90L30 52M50 90L95 92M95 92L110 60"
          stroke="#6FA0FF"
          strokeWidth="1.2"
          opacity=".7"
        />
      </g>

      {/* Circuit Lines */}

      <path
        d="M106 140H40M40 140V180M40 180H0"
        stroke="#2A3B66"
        strokeWidth="2"
      />

      <path
        d="M414 100H470M470 100V60M470 60H520"
        stroke="#2A3B66"
        strokeWidth="2"
      />

      <path
        d="M300 244V300"
        stroke="#2A3B66"
        strokeWidth="2"
      />

      <circle cx="40" cy="180" r="4" fill="#6FA0FF" />
      <circle cx="470" cy="60" r="4" fill="#B79CFB" />

      {/* Laptop Base */}

      <path
        d="M60 262H460L488 340H32L60 262Z"
        fill="#132038"
        stroke="#2A3B66"
        strokeWidth="2"
      />

      <rect
        x="220"
        y="284"
        width="80"
        height="8"
        rx="4"
        fill="#1E2E52"
      />
    </svg>
  );
};

export default LaptopSVG;