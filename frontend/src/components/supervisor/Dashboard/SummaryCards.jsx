import {
  ClipboardList,
  Users,
  TrendingUp,
  BriefcaseBusiness,
} from "lucide-react";

const SummaryCards = ({ statistics }) => {
  const cards = [
    {
      title: "Pending Research\nRequests",
      value: statistics.pendingRequests,
      subtitle: "New proposals recommended",
      icon: ClipboardList,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      subtitleColor: "text-purple-400",
    },
    {
      title: "Accepted Supervisions",
      value: statistics.acceptedSupervisions,
      subtitle: "Currently supervising",
      icon: Users,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      subtitleColor: "text-green-400",
    },
    {
      title: "Average Matching\nScore",
      value: `${statistics.averageMatchingScore}%`,
      subtitle: "Across all recommendations",
      icon: TrendingUp,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      subtitleColor: "text-blue-400",
    },
    {
      title: "Available Slots",
      value: statistics.availableSlots,
      subtitle: `Out of ${statistics.maximumWorkload} maximum`,
      icon: BriefcaseBusiness,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
      subtitleColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
  key={card.title}
  className="bg-[#111827] border border-gray-600 rounded-xl px-5 py-5 h-[170px] flex flex-col"
>

  {/* Top */}

  <div className="flex items-start gap-4">

    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}
    >
      <Icon
        size={20}
        className={card.iconColor}
      />
    </div>

    <h3 className="text-[16px] font-semibold leading-7 text-white whitespace-pre-line">
      {card.title}
    </h3>

  </div>

  {/* Middle */}

  <div className="ml-16 ">

    <h2 className="text-[34px] font-bold leading-none text-white">
      {card.value}
    </h2>

  </div>

  {/* Bottom */}

  <p
    className={`ml-16 mt-auto text-[12px] font-medium ${card.subtitleColor}`}
  >
    {card.subtitle}
  </p>

</div>
        );
      })}
    </div>
  );
};

export default SummaryCards;