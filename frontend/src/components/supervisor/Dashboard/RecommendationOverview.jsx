import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { Info } from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip
);

const RecommendationOverview = ({
  recommendations = [],
}) => {

  // ============================================================
  // OUR 5 MAIN RESEARCH DOMAINS
  // ============================================================

  const mainDomains = [
    {
      domain: "Artificial Intelligence",
      color: "#7C3AED",
    },
    {
      domain: "Data Science",
      color: "#22C55E",
    },
    {
      domain: "Cybersecurity",
      color: "#F59E0B",
    },
    {
      domain: "Software Engineering",
      color: "#EF4444",
    },
    {
      domain: "Networking",
      color: "#60A5FA",
    },
  ];


  // ============================================================
  // PREPARE DYNAMIC DATA
  // ============================================================

  const totalCount = mainDomains.reduce(
    (total, mainDomain) => {

      const found = recommendations.find(
        (item) =>
          item.domain === mainDomain.domain
      );

      return total + (found?.count || 0);

    },
    0
  );


  const overviewData = mainDomains.map(
    (mainDomain) => {

      const found = recommendations.find(
        (item) =>
          item.domain === mainDomain.domain
      );

      const count = found?.count || 0;

      const percentage =
        totalCount > 0
          ? Number(
              (
                (count / totalCount) *
                100
              ).toFixed(1)
            )
          : 0;

      return {
        domain: mainDomain.domain,
        count,
        percentage,
        color: mainDomain.color,
      };

    }
  );


  // ============================================================
  // DOUGHNUT DATA
  // ============================================================

  const data = {

    labels: overviewData.map(
      (item) => item.domain
    ),

    datasets: [

      {
        data: overviewData.map(
          (item) => item.count
        ),

        backgroundColor: overviewData.map(
          (item) => item.color
        ),

        borderWidth: 0,

        cutout: "62%",
      },

    ],

  };


  // ============================================================
  // CHART OPTIONS
  // ============================================================

  const options = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,
      },

    },

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <div
      className="
        bg-[#111827]
        border
        border-gray-600
        rounded-xl
        px-5
        py-5
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center gap-2">

        <h2 className="text-[16px] font-semibold text-white">

          Recommendation Overview

        </h2>

        <Info
          size={15}
          className="text-gray-500"
        />

      </div>


      {/* ================================================== */}
      {/* BODY */}
      {/* ================================================== */}

      <div className="flex items-center justify-between h-[280px] mt-3 px-2">


        {/* ================================================== */}
        {/* CHART */}
        {/* ================================================== */}

        <div className="w-[220px] h-[220px] ml-5">

          <Doughnut
            data={data}
            options={options}
          />

        </div>


        {/* ================================================== */}
        {/* LEGEND */}
        {/* ================================================== */}

        <div className="space-y-4 w-[220px]">

          {overviewData.map((item) => (

            <div
              key={item.domain}
              className="flex items-center justify-between"
            >

              <div className="flex items-center gap-3">

                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      item.color,
                  }}
                />

                <span className="text-[13px] text-gray-300">

                  {item.domain}

                </span>

              </div>


              <span className="text-[13px] text-gray-400">

                {item.count} ({item.percentage}%)

              </span>

            </div>

          ))}

        </div>


      </div>

    </div>

  );

};

export default RecommendationOverview;