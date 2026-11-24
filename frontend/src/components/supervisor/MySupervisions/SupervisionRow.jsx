import { MessageCircle } from "lucide-react";
import MatchScore from "../RecommendedIdeas/MatchScore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MessageDialog from "./MessageDialog";

import {
  sendSupervisorMessage
} from "../../../services/supervisorService";

const SupervisionRow = ({ proposal }) => {

  const navigate = useNavigate();

  const [showMessageDialog, setShowMessageDialog] =
    useState(false);


  // ============================================================
  // DOMAIN STYLE
  // ============================================================

  const getDomainStyle = (domain) => {

    switch (domain) {

      case "Artificial Intelligence":
        return "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20";

      case "Data Science":
        return "bg-green-500/15 text-green-300 border border-green-500/20";

      case "Cybersecurity":
        return "bg-orange-500/15 text-orange-300 border border-orange-500/20";

      case "Software Engineering":
        return "bg-pink-500/15 text-pink-300 border border-pink-500/20";

      default:
        return "bg-gray-700 text-gray-300";
    }

  };


  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage = async (
    message,
    sendTo
  ) => {

    try {

      console.log(
        "Sending supervisor message..."
      );

      console.log(
        "Research ID:",
        proposal.id
      );

      console.log(
        "Message:",
        message
      );

      console.log(
        "Send To:",
        sendTo
      );

      console.log(
        "Student:",
        proposal.student.name
      );

      console.log(
        "Student Registration:",
        proposal.student.registration
      );


      // --------------------------------------------------------
      // SEND TO BACKEND
      // --------------------------------------------------------

      const result =
        await sendSupervisorMessage(
          proposal.id,
          message,
          sendTo
        );


      console.log(
        "Message sent successfully:",
        result
      );


      // --------------------------------------------------------
      // CLOSE DIALOG
      // --------------------------------------------------------

      setShowMessageDialog(false);


      // --------------------------------------------------------
      // SUCCESS MESSAGE
      // --------------------------------------------------------

      alert(
        result.message ||
        "Message sent successfully."
      );


    } catch (error) {

      console.error(
        "Failed to send message:",
        error
      );


      alert(
        error.message ||
        "Failed to send message."
      );

    }

  };


  return (

    <>

      {/* ===================================================== */}
      {/* DESKTOP / TABLET */}
      {/* ===================================================== */}

      <div className="hidden md:grid grid-cols-12 px-6 py-5 border-b border-gray-700 hover:bg-[#182131] transition">


        {/* Research Title */}

        <div className="col-span-3">

          <h3 className="text-[14px] font-semibold text-white leading-6">
            {proposal.title}
          </h3>

          <div className="flex flex-wrap gap-2 mt-2">

            {(proposal.keywords || []).map((keyword) => (

              <span
                key={keyword}
                className="px-2 py-1 rounded-md bg-[#1F2937] text-[11px] text-gray-400"
              >
                {keyword}
              </span>

            ))}

          </div>

        </div>


        {/* Student */}

        <div className="col-span-2 flex flex-col justify-center">

          <h3 className="text-[13px] font-medium text-white">
            {proposal.student.name}
          </h3>

          <p className="text-[12px] text-gray-500 mt-1">
            {proposal.student.registration}
          </p>

        </div>


        {/* Domain */}

        <div className="col-span-2 flex items-center">

          <span
            className={`px-3 py-1 rounded-md text-[11px] font-medium ${getDomainStyle(
              proposal.domain
            )}`}
          >
            {proposal.domain}
          </span>

        </div>


        {/* Matching Score */}

        <div className="col-span-2 flex justify-center items-center">

          <MatchScore
            score={proposal.matchingScore}
          />

        </div>


        {/* Message */}

        <div className="col-span-1 flex justify-center items-center">

          <button
            onClick={() =>
              setShowMessageDialog(true)
            }
            className="
              w-10
              h-10
              rounded-lg
              border
              border-purple-500/40
              bg-purple-500/10
              hover:bg-purple-500/20
              transition-all
              duration-300
              cursor-pointer
              flex
              items-center
              justify-center
            "
          >

            <MessageCircle
              size={18}
              className="text-purple-400"
            />

          </button>

        </div>


        {/* Actions */}

        <div className="col-span-2 flex justify-center items-center">

          <button
            onClick={() =>
              navigate(
                `/supervisor/supervisions/${proposal.id}`
              )
            }
            className="
              px-4
              h-9
              rounded-lg
              bg-gradient-to-r
              from-purple-600
              to-purple-500
              text-white
              text-[12px]
              font-medium
              transition-all
              duration-300
              hover:brightness-110
              cursor-pointer
            "
          >
            View Details
          </button>

        </div>

      </div>


      {/* ===================================================== */}
      {/* MOBILE CARD */}
      {/* ===================================================== */}

      <div className="md:hidden p-5 border-b border-gray-700">

        <h3 className="text-[15px] font-semibold text-white">
          {proposal.title}
        </h3>


        <div className="flex flex-wrap gap-2 mt-3">

          {(proposal.keywords || []).map((keyword) => (

            <span
              key={keyword}
              className="px-2 py-1 rounded-md bg-[#1F2937] text-[11px] text-gray-400"
            >
              {keyword}
            </span>

          ))}

        </div>


        <div className="mt-5 space-y-3 text-[13px]">

          <div className="flex justify-between">

            <span className="text-gray-500">
              Student
            </span>

            <span className="text-white">
              {proposal.student.name}
            </span>

          </div>


          <div className="flex justify-between">

            <span className="text-gray-500">
              Registration
            </span>

            <span className="text-white">
              {proposal.student.registration}
            </span>

          </div>


          <div className="flex justify-between items-center">

            <span className="text-gray-500">
              Domain
            </span>

            <span
              className={`px-2 py-1 rounded-md text-[11px] font-medium ${getDomainStyle(
                proposal.domain
              )}`}
            >
              {proposal.domain}
            </span>

          </div>


          <div className="flex justify-between">

            <span className="text-gray-500">
              Matching
            </span>

            <span className="text-green-400 font-semibold">
              {proposal.matchingScore.toFixed(0)}%
            </span>

          </div>

        </div>


        <div className="mt-5 grid grid-cols-2 gap-3">

          <button
            onClick={() =>
              setShowMessageDialog(true)
            }
            className="
              h-10
              rounded-lg
              border
              border-purple-500/40
              bg-purple-500/10
              hover:bg-purple-500/20
              transition-all
              duration-300
              cursor-pointer
              flex
              items-center
              justify-center
              text-purple-400
              text-sm
            "
          >

            Message

          </button>


          <button
            onClick={() =>
              navigate(
                `/supervisor/supervisions/${proposal.id}`
              )
            }
            className="
              h-10
              rounded-lg
              bg-gradient-to-r
              from-purple-600
              to-purple-500
              text-white
              text-sm
              font-medium
              hover:brightness-110
              transition-all
              duration-300
              cursor-pointer
            "
          >
            View Details
          </button>

        </div>

      </div>


      {/* ===================================================== */}
      {/* MESSAGE DIALOG */}
      {/* ===================================================== */}

      {showMessageDialog && (

        <MessageDialog

          studentName={
            proposal.student.name
          }

          onClose={() =>
            setShowMessageDialog(false)
          }

          onSend={
            handleSendMessage
          }

        />

      )}

    </>

  );

};


export default SupervisionRow;