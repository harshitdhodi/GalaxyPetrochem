import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-lg shadow-blue-300/60 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};


