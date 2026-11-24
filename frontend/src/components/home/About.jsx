const technologies = [
  "Topic Classification",
  "Similarity Detection",
  "AI Content Detection",
  "Supervisor Allocation",
  "Explainable Results",
  "Workload Balancing",
];

const About = () => {
  return (
    <section
      id="about"
      className="bg-white py-28"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">

        <p
          data-aos="fade-up"
          className="uppercase tracking-[4px] text-blue-600 font-bold text-sm"
        >
          ABOUT RESEARCHSYNC AI
        </p>

        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-5xl font-extrabold text-gray-900 mt-5 leading-tight"
        >
          Intelligent Research
          <br />
          Management Platform
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-10 text-lg leading-10 text-gray-600"
        >
          ResearchSync AI is an intelligent research management
          platform developed to assist universities in classifying
          research topics, detecting semantic similarity,
          identifying AI-generated content and recommending the most
          suitable research supervisor based on expertise and
          workload.
        </p>

        <p
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-6 text-lg leading-10 text-gray-600"
        >
          The platform improves fairness, transparency and
          efficiency throughout the research allocation process by
          combining multiple intelligent services into one
          explainable system.
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="400"
          className="w-28 h-[2px] bg-blue-200 mx-auto mt-12 mb-12"
        />

        <div
          data-aos="fade-up"
          data-aos-delay="500"
          className="flex flex-wrap justify-center gap-4"
        >
          {technologies.map((item, index) => (
            <span
              key={index}
              className="
                px-5
                py-2
                rounded-full
                bg-blue-50
                border
                border-blue-100
                text-slate-700
                text-sm
                font-medium
                hover:bg-blue-600
                hover:text-white
                transition-all
                duration-300
              "
            >
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;