import { useEffect, useState } from "react";

import SupervisorLayout from "../../layouts/SupervisorLayout";

import DashboardHeader from "../../components/supervisor/Dashboard/DashboardHeader";
import SummaryCards from "../../components/supervisor/Dashboard/SummaryCards";
import RecommendationOverview from "../../components/supervisor/Dashboard/RecommendationOverview";
import WorkloadSummary from "../../components/supervisor/Dashboard/WorkloadSummary";

import {
  getSupervisorDashboard,
} from "../../services/supervisorService";


const Dashboard = () => {

  // ============================================================
  // STATE
  // ============================================================

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ============================================================
  // LOAD DASHBOARD
  // ============================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        setError("");

        console.log(
          "Loading supervisor dashboard..."
        );

        const data =
          await getSupervisorDashboard();

        console.log(
          "Dashboard data:",
          data
        );

        setDashboardData(data);

      }

      catch (error) {

        console.error(
          "Failed to load dashboard:",
          error
        );

        setError(
          error?.message ||
          "Unable to load dashboard."
        );

      }

      finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <SupervisorLayout>

        <div className="
          flex
          justify-center
          items-center
          h-[400px]
        ">

          <p className="text-white text-lg">

            Loading dashboard...

          </p>

        </div>

      </SupervisorLayout>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error || !dashboardData) {

    return (

      <SupervisorLayout>

        <div className="
          rounded-xl
          border
          border-red-500/30
          bg-[#111827]
          py-16
          text-center
        ">

          <p className="text-red-400">

            {error ||
              "Unable to load dashboard."}

          </p>

        </div>

      </SupervisorLayout>

    );

  }


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <SupervisorLayout>

      <div className="space-y-6">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <DashboardHeader
          supervisor={
            dashboardData.supervisor
          }
        />


        {/* ================================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================================== */}

        <SummaryCards
          statistics={
            dashboardData.statistics
          }
        />


        {/* ================================================== */}
        {/* OVERVIEW + WORKLOAD */}
        {/* ================================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">


          {/* Recommendation Overview */}

          <RecommendationOverview
            recommendations={
              dashboardData.recommendations
            }
          />


          {/* Workload Summary */}

          <WorkloadSummary
            workload={{

              current:
                dashboardData.statistics
                  .currentWorkload,

              maximum:
                dashboardData.statistics
                  .maximumWorkload,

            }}
          />

        </div>

      </div>

    </SupervisorLayout>

  );

};


export default Dashboard;