import React, { useEffect, useRef } from "react";

const Modal = ({ title, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            ×
          </button>
        </div>
        {/* Modal İçerik */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;