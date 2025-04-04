export const Button = ({ children, className = "", onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-2 bg-[#e0491f] text-white font-semibold rounded-lg hover:bg-[#e03c1f] transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};