import React from "react";

const ViewCaseModal = ({ isOpen, onClose, caseItem }) => {
  if (!isOpen) return null;

  // Close modal when clicking on the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <h2 className="text-3xl font-bold text-center text-bordo mb-6">
          Dava Detayları
        </h2>

        {/* Case Details Form */}
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Taraf Adı Soyadı
              </label>
              <input
                type="text"
                value={caseItem.partyName || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Dava Konusu
              </label>
              <input
                type="text"
                value={caseItem.caseSubject || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Davayı Takip Eden Avukat
              </label>
              <input
                type="text"
                value={caseItem.caseLawyer || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Dosya No
              </label>
              <input
                type="text"
                value={caseItem.fileNumber || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mahkeme
              </label>
              <input
                type="text"
                value={caseItem.court || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mahkeme Dosya No
              </label>
              <input
                type="text"
                value={caseItem.courtFileNumber || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                İddianame
              </label>
              <textarea
                value={caseItem.indictment || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 resize-none focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Sonuç Açıklama
              </label>
              <textarea
                value={caseItem.resultDescription || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 resize-none focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Sonuç Aşama
              </label>
              <input
                type="text"
                value={caseItem.resultStage || "Bilgi Yok"}
                readOnly
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewCaseModal;