import React from "react";

const ProgressBar = ({ step, steps }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((label, index) => (
        <div key={index} className="relative flex-1">
          {/* Çubuk */}
          <div
            className={`h-2 ${
              index <= step - 1 ? "bg-green-700" : "bg-gray-200"
            } rounded-full`}
          ></div>

          {/* Adım Numarası */}
          <div
            className={`absolute inset-0 flex items-center justify-center h-8 w-8 mx-auto -mt-3 rounded-full text-white font-bold ${
              index <= step - 1 ? "bg-green-700" : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>

          {/* Adım Etiketi */}
          <div className="text-center mt-3 text-xs font-semibold text-gray-700">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;