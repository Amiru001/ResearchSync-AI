import {
  MessageCircle,
  CalendarDays,
  FileText,
  Bell,
  Info,
  CheckCircle2,
} from "lucide-react";


const SupervisorUpdates = ({
  messages = [],
  result = null,
}) => {

  // ============================================================
  // ICONS FOR NORMAL MESSAGES
  // ============================================================

  const getIcon = (index) => {

    const icons = [
      CalendarDays,
      FileText,
      Bell,
    ];

    return icons[index % icons.length];
  };


  // ============================================================
  // SUPERVISOR COMMENT
  // ============================================================

  const supervisorComment =
    result?.supervision?.supervisor_comment?.trim() || "";

  const supervisorName =
    result?.supervision?.supervisor_name ||
    "Supervisor";


  // ============================================================
  // CHECK IF SUPERVISOR IS ASSIGNED
  // ============================================================

  const isAssigned =
    result?.supervision?.status?.toLowerCase() === "accepted";


  return (

    <div
      className="
        h-full
        bg-[#111827]
        border
        border-gray-500
        rounded-2xl
        p-6
      "
    >

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <h2 className="text-[20px] font-bold text-white">
            Supervisor Updates
          </h2>

          <Info
            size={15}
            className="text-gray-500"
          />

        </div>


        <button
          className="
            text-[12px]
            font-medium
            text-purple-400
            hover:text-purple-300
            transition
            cursor-pointer
          "
        >
          View all
        </button>

      </div>


      {/* ================================================== */}
      {/* UPDATES */}
      {/* ================================================== */}

      <div className="mt-5 space-y-3">


        {/* ================================================== */}
        {/* SUPERVISOR COMMENT */}
        {/* ================================================== */}

        {supervisorComment && isAssigned && (

          <div
            className="
              relative
              rounded-xl
              bg-[#1F2937]
              border
              border-purple-500/30
              p-4
              hover:bg-[#263244]
              transition
            "
          >

            <div className="flex gap-3">

              {/* ICON */}

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-purple-500/10
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >

                <CheckCircle2
                  size={18}
                  className="text-purple-400"
                />

              </div>


              {/* COMMENT */}

              <div className="min-w-0 pr-4">

                <h3
                  className="
                    text-[13px]
                    font-semibold
                    text-white
                  "
                >
                  Supervisor Comment
                </h3>


                <p
                  className="
                    mt-1
                    text-[12px]
                    text-gray-300
                    leading-5
                  "
                >
                  {supervisorComment}
                </p>


                <p
                  className="
                    mt-2
                    text-[11px]
                    text-gray-500
                  "
                >
                  {supervisorName}
                </p>

              </div>

            </div>


            {/* COMMENT DOT */}

            <span
              className="
                absolute
                top-4
                right-4
                w-2
                h-2
                rounded-full
                bg-purple-500
              "
            />

          </div>

        )}


        {/* ================================================== */}
        {/* NORMAL SUPERVISOR MESSAGES */}
        {/* ================================================== */}

        {messages.length === 0 && !supervisorComment ? (

          <div
            className="
              rounded-xl
              bg-[#1F2937]
              border
              border-gray-700
              p-5
              text-center
            "
          >

            <MessageCircle
              size={24}
              className="mx-auto text-gray-500"
            />

            <p
              className="
                mt-3
                text-[13px]
                text-gray-400
              "
            >
              No supervisor updates yet.
            </p>

          </div>

        ) : (

          messages
            .slice(0, supervisorComment ? 2 : 3)
            .map((message, index) => {

              const Icon = getIcon(index);

              return (

                <div
                  key={message._id || index}
                  className="
                    relative
                    rounded-xl
                    bg-[#1F2937]
                    border
                    border-gray-700
                    p-4
                    hover:bg-[#263244]
                    transition
                  "
                >

                  <div className="flex gap-3">

                    {/* ICON */}

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-purple-500/10
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >

                      <Icon
                        size={18}
                        className="text-purple-400"
                      />

                    </div>


                    {/* MESSAGE */}

                    <div className="min-w-0 pr-4">

                      <h3
                        className="
                          text-[13px]
                          font-semibold
                          text-white
                        "
                      >
                        Supervisor Update
                      </h3>


                      <p
                        className="
                          mt-1
                          text-[12px]
                          text-gray-300
                          leading-5
                        "
                      >
                        {message.message}
                      </p>


                      <p
                        className="
                          mt-2
                          text-[11px]
                          text-gray-500
                        "
                      >
                        {message.sender?.name ||
                          "Supervisor"}
                      </p>

                    </div>

                  </div>


                  {/* UNREAD DOT */}

                  {!message.read && (

                    <span
                      className="
                        absolute
                        top-4
                        right-4
                        w-2
                        h-2
                        rounded-full
                        bg-purple-500
                      "
                    />

                  )}

                </div>

              );

            })

        )}

      </div>


      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      {(messages.length > 0 || supervisorComment) && (

        <div className="mt-5 text-center">

          <button
            className="
              text-[12px]
              text-purple-400
              hover:text-purple-300
              transition
              cursor-pointer
            "
          >
            View all messages →
          </button>

        </div>

      )}

    </div>

  );
};


export default SupervisorUpdates;