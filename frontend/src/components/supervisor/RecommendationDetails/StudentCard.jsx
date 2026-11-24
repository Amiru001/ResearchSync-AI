import { GraduationCap } from "lucide-react";

const StudentCard = ({ student }) => {
  // Generate initials from student's name
  const initials = student.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#111827] border border-gray-900 rounded-xl p-6 h-[105px] flex items-center">

      {/* Initials Circle */}

      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0">

        <span className="text-white text-[22px] font-bold">
          {initials}
        </span>

      </div>

      {/* Student Details */}

      <div className="ml-5">

        <h2 className="text-[16.5px] font-semibold text-white">
          {student.name}
        </h2>

        <p className="mt-1 text-[13px] text-gray-400">
          {student.registrationNumber}
        </p>

        <div className="mt-3 flex items-center gap-2">

          <GraduationCap
            size={16}
            className="text-purple-400"
          />

          <span className="text-[13px] text-gray-300">
            {student.degree}
          </span>

        </div>

      </div>

    </div>
  );
};

export default StudentCard;