import HeroContent from "./HeroContent";
import HeroIllustration from "./HeroIllustration";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#080C18] min-h-screen">

      {/* Grid Background */}
      <div
        className="
        absolute inset-0 opacity-50
        bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)]
        bg-[size:46px_46px]
        "
      />

      {/* Blue Glow */}
      <div className="absolute top-0 right-0 w-[900px] h-[500px] bg-blue-600/20 blur-[180px]" />

      {/* Purple Glow */}
      <div className="absolute bottom-0 left-0 w-[700px] h-[450px] bg-violet-600/10 blur-[180px]" />

      {/* Hero */}
      <div
        className="
        relative
        max-w-[1550px]
        mx-auto
        px-17
        min-h-screen
        grid
        grid-cols-[1.05fr_.95fr]
        gap-10
        items-center
        "
      >
        <HeroContent />

        <HeroIllustration />

      </div>

    </section>
  );
};

export default Hero;