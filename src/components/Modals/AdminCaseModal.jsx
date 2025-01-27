import React, { useRef } from "react";

const AdminCaseModal = ({ isOpen, onClose, data }) => {
  const modalRef = useRef();

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const renderCaseDetails = () => (
    <div className="bg-gray-100 p-4 rounded-md mb-4 border shadow-sm">
      <h2 className="text-bordo font-bold text-lg border-b pb-2 mb-4">
        Dava Bilgileri
      </h2>
      <div className="grid grid-cols-2 gap-y-4 text-gray-800">
        <div>
          <span className="font-semibold">Taraf Adı:</span>{" "}
          {data?.partyName || "Belirtilmemiş"}
        </div>
        <div>
          <span className="font-semibold">Dava Konusu:</span>{" "}
          {data?.caseSubject || "Belirtilmemiş"}
        </div>
        <div>
          <span className="font-semibold">Avukat İsmi:</span>{" "}
          {data?.lawyer?.fullName || "Avukat atanmadı"}
        </div>
      </div>
    </div>
  );

  const renderRelatedRequest = () => (
    <div className="bg-gray-100 p-4 rounded-md border shadow-sm">
      <h2 className="text-bordo font-bold text-lg border-b pb-2 mb-4">
        İlişkili Başvuru
      </h2>
      {data?.relatedRequest ? (
        <div className="grid grid-cols-2 gap-y-4 text-gray-800">
          <p>
            <span className="font-semibold">Başvuru No:</span>{" "}
            {data.relatedRequest.requestNumber || "Belirtilmemiş"}
          </p>
          <p>
            <span className="font-semibold">Başvuran:</span>{" "}
            {`${data.relatedRequest.name || ""} ${data.relatedRequest.surname || ""
              }`.trim() || "Belirtilmemiş"}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 italic text-center">
          İlişkili başvuru bulunmamaktadır.
        </p>
      )}
    </div>
  );

  const renderAdditionalDetails = () => (
    <div className="bg-gray-100 p-4 rounded-md border shadow-sm">
      <h2 className="text-bordo font-bold text-lg border-b pb-2 mb-4">
        Ek Bilgiler
      </h2>
      <div className="grid grid-cols-2 gap-y-4 text-gray-800">
        {Object.entries(data?.additionalDetails || {}).map(([key, value]) => (
          <div key={key}>
            <span className="font-semibold">{key}:</span> {value || "Belirtilmemiş"}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h1 className="text-2xl font-bold text-bordo">Dava Detayları</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        {renderCaseDetails()}
        {renderRelatedRequest()}
        {data?.additionalDetails && renderAdditionalDetails()}

        {/* Footer */}
        <div className="flex justify-end mt-6 border-t pt-4">
          <button
            onClick={onClose}
            className="bg-bordo hover:bg-dark-bordo text-white px-6 py-2 rounded-md transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCaseModal;