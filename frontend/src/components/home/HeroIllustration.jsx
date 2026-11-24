import LaptopSVG from "./LaptopSVG";

const HeroIllustration = () => {
  return (
    <div className="relative flex items-center justify-center h-[440px]">

      {/* Laptop */}

      <div
className="
relative
w-[80%]
animate-float
"
>

        <LaptopSVG />

      </div>

      {/* Animated Signal Dots */}

      <span className="signal-dot s1"></span>

      <span className="signal-dot s2"></span>

      <span className="signal-dot s3"></span>

    </div>
  );
};

export default HeroIllustration;