import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaFilePdf, FaImage, FaChevronDown, FaChevronUp } from "react-icons/fa";

const IncidentDetailsModal = ({ isOpen, onClose, incident, categoryFields, commonFields }) => {
    if (!isOpen || !incident) return null;

    const [isFileListExpanded, setIsFileListExpanded] = useState(false);

    // Dinamik olarak gösterilecek alanları belirle
    const fieldsToDisplay = [
        ...commonFields,
        ...(categoryFields[incident.category] || []),
    ];

    // Dosya türünü belirlemek için yardımcı fonksiyon
    const renderFileLink = (fileUrl) => {
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 underline">
                    <FaImage className="mr-2 text-xl" />
                    Görseli Görüntüle
                </a>
            );
        } else if (fileExtension === 'pdf') {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 underline">
                    <FaFilePdf className="mr-2 text-xl text-red-500" />
                    PDF Dosyasını Görüntüle
                </a>
            );
        } else {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 underline">
                    Diğer Dosya
                </a>
            );
        }
    };

    // Modal dışına tıklanınca kapat
    const handleBackdropClick = (e) => {
        if (e.target.id === "modal-backdrop") {
            onClose();
        }
    };

    return (
        <div
            id="modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto"
            onClick={handleBackdropClick}
        >
            <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full relative">
                <h2 className="text-2xl font-bold text-bordo mb-4 border-b pb-2">Olay Detayları</h2>
                <div className="grid grid-cols-1 gap-y-4 gap-x-8">
                    {fieldsToDisplay.map((field) => (
                        <div key={field.name} className="flex items-center">
                            <label className="font-semibold w-1/3">{field.label}:</label>
                            {incident[field.name] ? (
                                field.name === "link" || field.name === "imageLink" ? (
                                    <a
                                        href={incident[field.name]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline w-2/3"
                                    >
                                        {field.label === "Görsel Link" ? "Görseli Görüntüle" : incident[field.name]}
                                    </a>
                                ) : (
                                    <input
                                        type="text"
                                        value={incident[field.name]}
                                        readOnly
                                        className="w-2/3 border px-4 py-2 rounded bg-gray-100"
                                    />
                                )
                            ) : (
                                <span className="text-gray-500 w-2/3">Belirtilmemiş</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Yüklenen Dosyalar */}
                <div className="mt-6 grid grid-cols-2 gap-y-4">
                    <label className="font-semibold mb-2">Yüklenen Dosyalar:</label>
                    {incident.uploadedFile && incident.uploadedFile.length > 0 ? (
                        <div>
                            <div className="space-y-2">
                                {incident.uploadedFile.slice(0, isFileListExpanded ? undefined : 2).map((fileUrl, index) => (
                                    <div key={index}>
                                        {renderFileLink(fileUrl)}
                                    </div>
                                ))}
                            </div>
                            {incident.uploadedFile.length > 2 && (
                                <button
                                    onClick={() => setIsFileListExpanded(!isFileListExpanded)}
                                    className="flex items-center text-blue-500 underline mt-2"
                                >
                                    {isFileListExpanded ? (
                                        <>
                                            <FaChevronUp className="mr-2" />
                                            Daha Az Göster
                                        </>
                                    ) : (
                                        <>
                                            <FaChevronDown className="mr-2" />
                                            Daha Fazla Göster ({incident.uploadedFile.length - 2})
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    ) : (
                        <span className="text-gray-500">Yüklenen dosya bulunamadı.</span>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-bordo text-white rounded hover:bg-dark-bordo"
                >
                    Kapat
                </button>
            </div>
        </div>
    );
};

IncidentDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    incident: PropTypes.object,
    categoryFields: PropTypes.object.isRequired,
    commonFields: PropTypes.array.isRequired,
};

export default IncidentDetailsModal;