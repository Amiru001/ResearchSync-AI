const meetings = [
  {
    title: "Supervisor Meeting",
    date: "15 July",
    time: "10:00 AM",
  },
  {
    title: "Proposal Review",
    date: "18 July",
    time: "2:30 PM",
  },
  {
    title: "Final Presentation",
    date: "25 July",
    time: "9:00 AM",
  },
];

const UpcomingMeetings = () => {
  return (
    <div className="bg-[#111827] rounded-xl border border-gray-800 p-5">

      <h2 className="text-xl text-white font-semibold mb-4">
        Upcoming Meetings
      </h2>

      <div className="space-y-3">

        {meetings.map((meeting, index) => (

          <div
            key={index}
            className="bg-[#1F2937] rounded-lg p-3"
          >

            <h3 className="text-white text-sm font-semibold">
              {meeting.title}
            </h3>

            <p className="text-gray-400 text-sm">
              {meeting.date}
            </p>

            <p className="text-blue-400 text-sm">
              {meeting.time}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default UpcomingMeetings;