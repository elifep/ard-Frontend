import React from "react";

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
    if (!isOpen || !request) return null;

    const {
        name,
        surname,
        email,
        telephone,
        tckn,
        applicantType,
        complaintReason,
        receivedBy,
        assignedLawyer,
        status,
        requestNumber,
    } = request;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Mapping for Turkish translation of status
    const statusTranslations = {
        pending: "Beklemede",
        approved: "Onaylandı",
        rejected: "Reddedildi",
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    X
                </button>

                {/* Modal Header */}
                <h2 className="text-2xl font-bold mb-6 text-center text-bordo">
                    Başvuru Detayları
                </h2>

                {/* Form Content */}
                <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Ad
                            </label>
                            <input
                                type="text"
                                value={name || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Soyad
                            </label>
                            <input
                                type="text"
                                value={surname || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Telefon
                            </label>
                            <input
                                type="text"
                                value={telephone || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                TC Kimlik No
                            </label>
                            <input
                                type="text"
                                value={tckn || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Başvuru Numarası
                            </label>
                            <input
                                type="text"
                                value={requestNumber || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Başvuran Türü
                            </label>
                            <input
                                type="text"
                                value={applicantType || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Durum
                            </label>
                            <input
                                type="text"
                                value={statusTranslations[status] || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Başvuruyu Alan
                            </label>
                            <input
                                type="text"
                                value={receivedBy?.fullName || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Atanan Avukat
                            </label>
                            <input
                                type="text"
                                value={assignedLawyer?.fullName || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 focus:outline-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Şikayet Nedeni
                            </label>
                            <textarea
                                value={complaintReason || "N/A"}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2 bg-gray-100 resize-none focus:outline-none"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailsModal;