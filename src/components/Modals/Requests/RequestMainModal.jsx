import React from "react";

const RequestMainModal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Modal İçeriği */}
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            ✖
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default RequestMainModal;