const HeroContent = () => {
  return (
    <div className="pt-12">

      <p className="uppercase tracking-[4px] text-blue-300 font-bold text-sm mb-8">
        BERT Powered Academic Platform
      </p>

      <h1
        className="
        text-[54px]
        leading-[1.08]
        font-extrabold
        tracking-[-0.02em]
        text-white
        max-w-[650px]
        "
      >
        AI Powered Research
        <br />
        Management System
      </h1>

      <p
        className="
        mt-8
        max-w-[520px]
        text-[17px]
        leading-8
        text-[#A7B0CC]
        "
      >
        Classify research topics, detect plagiarism, identify AI-generated
        content and recommend the best supervisor — all in one explainable
        pipeline.
      </p>

      <div className="flex gap-5 mt-10">

        <button className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          Get Started
        </button>

        <button className="px-8 py-4 rounded-xl border border-gray-500 text-white hover:bg-white/10">
          Learn More
        </button>

      </div>

    </div>
  );
};

export default HeroContent;