import {
  FileText,
  Brain,
  Users,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Submit Topic",
    description:
      "Student submits the research title and proposal through the ResearchSync AI portal.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "The system classifies the topic using BERT, checks similarity and detects AI-generated content.",
  },
  {
    icon: Users,
    title: "Supervisor Allocation",
    description:
      "The best supervisor is recommended based on expertise, interests and current workload.",
  },
  {
    icon: ShieldCheck,
    title: "Review & Approve",
    description:
      "The administrator reviews the recommendation and confirms the supervisor allocation.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="workflow"
      className="bg-[#F8FAFC] py-28"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div
          className="text-center mb-24"
          data-aos="fade-up"
        >
          <p className="uppercase tracking-[4px] text-blue-600 font-bold text-sm mb-4">
            HOW IT WORKS
          </p>

          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Simple steps to smarter
            <br />
            research management
          </h2>
        </div>

        {/* Timeline */}

        <div className="relative">

          {/* Dashed line */}

          <div className="hidden lg:block absolute top-10 left-0 w-full border-t-2 border-dashed border-blue-200"></div>

          <div className="grid lg:grid-cols-4 gap-12 relative">

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                  className="text-center"
                >
                  <div className="mx-auto w-20 h-20 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center relative z-10">

                    <Icon
                      size={32}
                      className="text-blue-600"
                    />

                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {index + 1}. {step.title}
                  </h3>

                  <p className="text-gray-600 leading-8 text-[17px]">
                    {step.description}
                  </p>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;