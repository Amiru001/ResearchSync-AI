import { useState } from "react";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

import ConfirmationDialog from "./ConfirmationDialog";

import {
  acceptResearchProposal,
  rejectResearchProposal,
} from "../../../services/supervisorService";

const ActionButtons = ({ proposalId }) => {

  const [dialog, setDialog] = useState(null);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("success");

  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] = useState(false);


  // ============================================================
  // SHOW POPUP MESSAGE
  // ============================================================

  const showMessage = (text, type = "success") => {

    setMessage(text);

    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);

  };


  // ============================================================
  // CONFIRM ACCEPT / REJECT
  // ============================================================

  const handleConfirm = async (reason) => {

    if (!proposalId) {

      showMessage(
        "Research proposal ID is missing.",
        "error"
      );

      return;
    }


    setLoading(true);


    try {

      let result = null;


      // ========================================================
      // ACCEPT
      // ========================================================

      if (dialog === "accept") {

        result = await acceptResearchProposal(
          proposalId,
          reason
        );

      }


      // ========================================================
      // REJECT
      // ========================================================

      else if (dialog === "reject") {

        result = await rejectResearchProposal(
          proposalId,
          reason
        );

      }


      // ========================================================
      // SUCCESS
      // ========================================================

      if (result?.success === true) {

        showMessage(
  result.message ||
    (
      dialog === "accept"
        ? "Proposal accepted successfully."
        : "Proposal rejected successfully."
    ),
  dialog === "accept" ? "success" : "error"
);

        // Prevent another action
        setCompleted(true);

      }


      // ========================================================
      // BACKEND ERROR
      // ========================================================

      else {

        showMessage(
          result?.message ||
            "Something went wrong.",
          "error"
        );

      }

    }

    catch (error) {

      console.error(
        "Accept/Reject error:",
        error
      );


      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail;


      showMessage(
        backendMessage ||
          "Unable to process the request.",
        "error"
      );

    }

    finally {

      setLoading(false);

      setDialog(null);

    }

  };


  return (
    <>

      {/* ================================================== */}
      {/* TOP LEFT POPUP */}
      {/* ================================================== */}

      {message && (

        <div
          className={`
            fixed
            top-6
            right-6
            z-[99999]
            min-w-[320px]
            max-w-[420px]
            px-5
            py-4
            rounded-xl
            border
            shadow-2xl
            text-white
            text-[14px]
            font-medium
            transition-all
            duration-300

            ${
              messageType === "success"
                ? "bg-[#052E16] border-green-500/50"
                : "bg-[#450A0A] border-red-500/50"
            }
          `}
        >

          <div className="flex items-center gap-3">

            {/* SUCCESS ICON */}

            {messageType === "success" ? (

              <CheckCircle2
                size={21}
                className="text-green-400 shrink-0"
              />

            ) : (

              /* ERROR / REJECT ICON */

              <XCircle
                size={21}
                className="text-red-400 shrink-0"
              />

            )}

            <span>
              {message}
            </span>

          </div>

        </div>

      )}


      {/* ================================================== */}
      {/* ACTION BUTTONS */}
      {/* ================================================== */}

      <div className="grid grid-cols-2 gap-4">


        {/* ================================================== */}
        {/* REJECT */}
        {/* ================================================== */}

        <button
          type="button"

          disabled={
            loading ||
            completed
          }

          onClick={() => {

            if (!loading && !completed) {
              setDialog("reject");
            }

          }}

          className="
            h-[60px]
            rounded-xl
            border
            border-red-500
            bg-red-500/10
            hover:bg-red-500/20
            transition-all
            duration-300
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex
            items-center
            justify-center
            gap-3
          "
        >

          <XCircle
            size={20}
            className="text-red-400"
          />

          <span
            className="
              text-[15px]
              font-semibold
              text-red-400
            "
          >

            {loading && dialog === "reject"
              ? "Rejecting..."
              : "Reject Proposal"}

          </span>

        </button>


        {/* ================================================== */}
        {/* ACCEPT */}
        {/* ================================================== */}

        <button
          type="button"

          disabled={
            loading ||
            completed
          }

          onClick={() => {

            if (!loading && !completed) {
              setDialog("accept");
            }

          }}

          className="
            h-[60px]
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-purple-500
            hover:brightness-110
            transition-all
            duration-300
            cursor-pointer
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex
            items-center
            justify-center
            gap-3
          "
        >

          <CheckCircle2
            size={20}
            className="text-white"
          />

          <span
            className="
              text-[15px]
              font-semibold
              text-white
            "
          >

            {loading && dialog === "accept"
              ? "Accepting..."
              : "Accept Supervision"}

          </span>

        </button>

      </div>


      {/* ================================================== */}
      {/* CONFIRMATION DIALOG */}
      {/* ================================================== */}

      {dialog && (

        <ConfirmationDialog

          type={dialog}

          onClose={() => {

            if (!loading) {
              setDialog(null);
            }

          }}

          onConfirm={handleConfirm}

        />

      )}

    </>
  );

};

export default ActionButtons;