import React from "react";

const Status = ({ formData, setFormData }) => {
    return (
        <div className="mt-6">
            <div className="relative flex items-center w-80 h-12 bg-gray-200 rounded-full shadow-inner">
                {/* Switch Slider */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 w-1/3 h-10 bg-white bg-opacity-70 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${formData.status === "approved"
                            ? "translate-x-[calc(200%)]"
                            : formData.status === "pending"
                                ? "translate-x-[calc(100%)]"
                                : "translate-x-0"
                        }`}
                ></div>

                {/* Rejected */}
                <button
                    onClick={() => setFormData((prev) => ({ ...prev, status: "rejected" }))}
                    className={`flex-1 text-center text-sm truncate z-10 ${formData.status === "rejected"
                            ? "text-red-600 font-bold"
                            : "text-gray-500"
                        }`}
                >
                    Reddedildi
                </button>

                {/* Pending */}
                <button
                    onClick={() => setFormData((prev) => ({ ...prev, status: "pending" }))}
                    className={`flex-1 text-center text-sm truncate z-10 ${formData.status === "pending"
                            ? "text-gray-600 font-bold"
                            : "text-gray-500"
                        }`}
                >
                    Beklemede
                </button>

                {/* Approved */}
                <button
                    onClick={() => setFormData((prev) => ({ ...prev, status: "approved" }))}
                    className={`flex-1 text-center text-sm truncate z-10 ${formData.status === "approved"
                            ? "text-green-600 font-bold"
                            : "text-gray-500"
                        }`}
                >
                    Onaylandı
                </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
                Seçilen Durum:{" "}
                <span
                    className={`font-semibold ${formData.status === "approved"
                            ? "text-green-600"
                            : formData.status === "rejected"
                                ? "text-red-600"
                                : "text-gray-600"
                        }`}
                >
                    {formData.status === "approved"
                        ? "Onaylandı"
                        : formData.status === "rejected"
                            ? "Reddedildi"
                            : "Beklemede"}
                </span>
            </p>
        </div>
    );
};

export default Status;