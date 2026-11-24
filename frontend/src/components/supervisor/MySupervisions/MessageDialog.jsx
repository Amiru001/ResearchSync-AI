import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

const MessageDialog = ({
  studentName,
  onClose,
  onSend,
}) => {
  const [message, setMessage] = useState("");

  // ============================================================
  // MESSAGE RECIPIENT
  // ============================================================

  const [sendTo, setSendTo] = useState("student");

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSend = () => {
    if (!message.trim()) {
      return;
    }

    // Send both message and selected recipient
    onSend(message, sendTo);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">

      <div className="w-full max-w-lg rounded-2xl bg-[#111827] border border-gray-700">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center">

              <MessageCircle
                size={20}
                className="text-white"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                Send Message
              </h2>

              <p className="text-sm text-gray-400">
                {studentName}
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="cursor-pointer"
          >

            <X
              className="text-gray-400 hover:text-white transition"
            />

          </button>

        </div>


        {/* ================================================== */}
        {/* BODY */}
        {/* ================================================== */}

        <div className="p-6">

          {/* Message label + dropdown */}

          <div className="flex items-center justify-between mb-2">

            <label className="text-sm text-gray-300">
              Message
            </label>


            {/* Recipient dropdown */}

            <select
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className="
                bg-[#1F2937]
                border
                border-gray-700
                rounded-lg
                px-3
                py-2
                text-[12px]
                text-gray-300
                outline-none
                focus:border-purple-500
                cursor-pointer
              "
            >

              <option value="student">
                This Student
              </option>

              <option value="all">
                All Students
              </option>

            </select>

          </div>


          {/* Textarea */}

          <textarea
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="
              w-full
              rounded-xl
              bg-[#1F2937]
              border
              border-gray-700
              p-4
              text-white
              outline-none
              focus:border-purple-500
              resize-none
            "
          />

        </div>


        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-700">

          <button
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


          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="
              px-6
              h-11
              rounded-xl
              bg-gradient-to-r
              from-purple-600
              to-purple-500
              text-white
              hover:brightness-110
              transition
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Send Message
          </button>

        </div>

      </div>

    </div>
  );
};

export default MessageDialog;