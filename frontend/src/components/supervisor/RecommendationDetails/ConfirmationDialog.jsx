import { useState } from "react";

const ConfirmationDialog = ({
  type,
  onClose,
  onConfirm,
}) => {

  const [reason, setReason] = useState("");

  const isReject = type === "reject";


  // ============================================================
  // HANDLE CONFIRM
  // ============================================================

  const handleConfirm = () => {

    // Reject requires a reason
    if (isReject && reason.trim() === "") {
      return;
    }

    // Send the entered message/reason
    onConfirm(reason.trim());

  };


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          bg-[#111827]
          border
          border-gray-700
          p-6
          shadow-2xl
        "
      >

        {/* ================================================== */}
        {/* TITLE */}
        {/* ================================================== */}

        <h2 className="text-xl font-semibold text-white">

          {isReject
            ? "Reject Proposal"
            : "Accept Supervision"}

        </h2>


        {/* ================================================== */}
        {/* DESCRIPTION */}
        {/* ================================================== */}

        <p className="mt-3 text-gray-400 leading-6">

          {isReject
            ? "Please provide a reason before rejecting this proposal."
            : "Are you sure you want to accept this supervision request? You may also send a message to the student."}

        </p>


        {/* ================================================== */}
        {/* MESSAGE / REASON */}
        {/* ================================================== */}

        <div className="mt-5">

          <label
            className="
              block
              text-sm
              text-gray-300
              mb-2
            "
          >

            {isReject
              ? "Reason (Required)"
              : "Message to Student (Optional)"}

          </label>


          <textarea
            rows={5}
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            placeholder={
              isReject
                ? "Enter rejection reason..."
                : "Write a message for the student..."
            }
            className="
              w-full
              rounded-xl
              bg-[#1F2937]
              border
              border-gray-700
              p-4
              text-white
              placeholder-gray-500
              outline-none
              focus:border-purple-500
              resize-none
              transition
            "
          />

        </div>


        {/* ================================================== */}
        {/* BUTTONS */}
        {/* ================================================== */}

        <div className="mt-6 flex justify-end gap-3">

          {/* Cancel */}

          <button
            type="button"
            onClick={onClose}
            className="
              px-5
              h-11
              rounded-xl
              border
              border-gray-700
              text-gray-300
              hover:bg-[#1F2937]
              transition
              cursor-pointer
            "
          >
            Cancel
          </button>


          {/* Confirm */}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              isReject &&
              reason.trim() === ""
            }
            className={`
              px-6
              h-11
              rounded-xl
              text-white
              transition
              cursor-pointer

              ${
                isReject
                  ? "bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500"
              }
            `}
          >

            {isReject
              ? "Reject"
              : "Accept"}

          </button>

        </div>

      </div>

    </div>

  );
};

export default ConfirmationDialog;