const FloatingCard = ({ icon, title, value, className = "" }) => {
  return (
    <div
      className={`absolute bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-2xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>

        <div>
          <p className="text-gray-300 text-sm">{title}</p>

          <h3 className="text-white font-bold text-lg">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FloatingCard;