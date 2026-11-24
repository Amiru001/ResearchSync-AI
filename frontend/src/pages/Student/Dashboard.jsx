import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCards from "../../components/dashboard/DashboardCard";
import ProgressChart from "../../components/dashboard/ProgressChart";
import SupervisorUpdates from "../../components/dashboard/SupervisorUpdates";

import {
  getLatestResearch,
  getSupervisorMessages,
} from "../../services/researchService";

import { getCurrentUser } from "../../utils/auth";

import {
  XCircle,
} from "lucide-react";


const Dashboard = () => {

  const [result, setResult] = useState(null);

  const [messages, setMessages] = useState([]);


  // ============================================================
  // CURRENT USER
  // ============================================================

  const user = getCurrentUser();


  // ============================================================
  // LOAD LATEST RESEARCH
  // ============================================================

  useEffect(() => {
    loadResearch();
  }, []);


  const loadResearch = async () => {

    try {

      const data = await getLatestResearch();

      console.log("Latest Research:", data);


      // No research submitted by this student

      if (data?.message === "No research found.") {

        setResult(null);

        return;
      }


      setResult(data);

    } catch (error) {

      console.error(
        "Failed to load research:",
        error
      );

      setResult(null);

    }

  };


  // ============================================================
  // LOAD SUPERVISOR MESSAGES
  // ============================================================

  useEffect(() => {
    loadSupervisorMessages();
  }, []);


  const loadSupervisorMessages = async () => {

    try {

      const data = await getSupervisorMessages();

      console.log(
        "Supervisor Messages:",
        data
      );


      setMessages(
        Array.isArray(data?.messages)
          ? data.messages
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load supervisor messages:",
        error
      );

      setMessages([]);

    }

  };


  // ============================================================
  // CURRENT DATE + TIME
  // ============================================================

  const [currentTime, setCurrentTime] = useState(
    new Date()
  );


  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);


    return () => clearInterval(timer);

  }, []);


  const dateText =
    currentTime.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );


  const timeText =
    currentTime.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );


  // ============================================================
  // REJECTION STATUS
  // ============================================================

  const isRejected =
    result?.supervision?.status === "Rejected";


  const rejectionReason =
    result?.supervision?.supervisor_comment?.trim() ||
    "No reason was provided by the supervisor.";


  const rejectedBy =
    result?.supervision?.supervisor_name ||
    "Supervisor";


  // ============================================================
  // UI
  // ============================================================

  return (

    <DashboardLayout>

      <div className="space-y-6">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex items-start justify-between gap-5">

          <div className="min-w-0">

            <p className="text-[14px] text-gray-400">
              Welcome back,
            </p>


            <h1
              className="
                mt-1
                text-[30px]
                sm:text-[28px]
                lg:text-[35px]
                font-bold
                text-white
                leading-tight
                break-words
              "
            >
              {user?.full_name || "Student"}
            </h1>


            {!isRejected && (

              <p className="mt-1 text-[13px] text-gray-400">
                Here's what's happening with your research.
              </p>

            )}

          </div>


          {/* ================================================= */}
          {/* DATE / TIME CARD */}
          {/* ================================================= */}

          {!isRejected && (

            <div
              className="
                hidden
                md:flex
                w-[200px]
                lg:w-[210px]
                h-[85px]
                lg:h-[95px]
                rounded-xl
                bg-[#111827]
                border
                border-gray-600
                flex-col
                items-center
                justify-center
                flex-shrink-0
              "
            >

              {/* Date */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-gray-400
                  text-[13px]
                  lg:text-[12px]
                "
              >

                <span className="text-purple-400">
                  📅
                </span>

                <span>
                  {dateText}
                </span>

              </div>


              {/* Time */}

              <h2
                className="
                  mt-1.5
                  text-[23px]
                  lg:text-[25px]
                  font-bold
                  text-white
                  leading-none
                "
              >
                {timeText}
              </h2>

            </div>

          )}

        </div>


        {/* ================================================== */}
        {/* REJECTED STATE */}
        {/* ================================================== */}

        {isRejected ? (

          <div
            className="
              w-full
              rounded-2xl
              border
              border-red-500/40
              bg-red-500/5
              p-6
              sm:p-8
            "
          >

            <div className="flex items-start gap-4">

              {/* Rejection Icon */}

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >

                <XCircle
                  size={26}
                  className="text-red-400"
                />

              </div>


              {/* Content */}

              <div className="min-w-0 flex-1">

                <h2
                  className="
                    text-[20px]
                    sm:text-[22px]
                    font-semibold
                    text-red-400
                  "
                >
                  Research Proposal Rejected
                </h2>


                <p
                  className="
                    mt-2
                    text-[14px]
                    sm:text-[15px]
                    text-red-300
                    leading-6
                  "
                >
                  Your research proposal has been rejected
                  by {rejectedBy}.
                </p>


                {/* ================================================== */}
                {/* REASON */}
                {/* ================================================== */}

                <div
                  className="
                    mt-4
                    rounded-xl
                    bg-red-500/5
                    border
                    border-red-500/20
                    p-4
                  "
                >

                  <p
                    className="
                      text-[12px]
                      font-semibold
                      text-red-400
                    "
                  >
                    Supervisor Reason
                  </p>


                  <p
                    className="
                      mt-1
                      text-[14px]
                      text-red-200
                      leading-6
                    "
                  >
                    {rejectionReason}
                  </p>

                </div>


                {/* ================================================== */}
                {/* NEXT ACTION */}
                {/* ================================================== */}

                <p
                  className="
                    mt-5
                    text-[14px]
                    sm:text-[15px]
                    font-semibold
                    text-red-400
                  "
                >
                  Please submit another research idea to
                  continue the research allocation process.
                </p>

              </div>

            </div>

          </div>

        ) : (

          /* ================================================== */
          /* NORMAL DASHBOARD */
          /* ================================================== */

          <>

            {/* ================================================== */}
            {/* SUMMARY CARDS */}
            {/* ================================================== */}

            <DashboardCards
              result={result}
            />


            {/* ================================================== */}
            {/* WORKFLOW + SUPERVISOR UPDATES */}
            {/* ================================================== */}

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-5
                gap-5
              "
            >

              {/* WORKFLOW */}

              <div className="xl:col-span-3">

                <ProgressChart
                  result={result}
                />

              </div>


              {/* SUPERVISOR UPDATES */}

              <div className="xl:col-span-2">

                <SupervisorUpdates
                  messages={messages}
                  result={result}
                />

              </div>

            </div>

          </>

        )}

      </div>

    </DashboardLayout>

  );
};


export default Dashboard;