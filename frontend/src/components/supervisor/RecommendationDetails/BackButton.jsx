import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  label = "Back",
  to = -1,
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
    >
      <ChevronLeft
        size={18}
        className="transition-transform duration-200 group-hover:-translate-x-1"
      />

      <span className="text-[14px] font-medium">
        {label}
      </span>
    </button>
  );
};

export default BackButton;