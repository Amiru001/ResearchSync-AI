import { FaBrain } from "react-icons/fa";
import FloatingCard from "./FloatingCard";

const HeroImage = () => {
  return (
    <div className="flex-1 relative flex items-center justify-center min-h-[650px]">

      {/* Glow */}

      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

      {/* Main Glass Card */}

      <div className="relative w-[500px] h-[500px] rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.25)]">

        <div className="w-72 h-72 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center animate-pulse shadow-2xl">

          <FaBrain
            className="text-white"
            size={110}
          />

        </div>

      </div>

      <FloatingCard
        icon="🤖"
        title="Topic Classification"
        value="96%"
        className="top-10 left-0 animate-bounce"
      />

      <FloatingCard
        icon="📑"
        title="Similarity"
        value="92.4%"
        className="bottom-10 left-10"
      />

      <FloatingCard
        icon="👨‍🏫"
        title="Supervisor"
        value="Matched"
        className="top-32 right-0"
      />

    </div>
  );
};

export default HeroImage;