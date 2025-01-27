import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3 text-center">
        {/* İkon ve mesaj */}
        <div className="flex flex-col items-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-4xl mb-2" />
          <p className="text-xl font-bold text-gray-800">
            {message || "Oturumdan çıkmak istediğinizden emin misiniz?"}
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex justify-around mt-6">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-gray-300 text-black font-semibold hover:bg-bordo hover:text-white transition-all"
          >
            Evet
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg bg-gray-300 text-black font-semibold hover:bg-bordo hover:text-white transition-all"
          >
            Hayır
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;