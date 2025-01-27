import React from "react";

const Case3 = ({ formData, handleDavaBilgiChange, errors }) => {
    return (
        <div>
        <h2 className="text-2xl font-bold mb-4">Dava Bilgileri</h2>
        {/* Progress Bar */}
        <div className="progress-bar-container">
            <div className="progress-bar step-3"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
            {["dosyaNo", "mahkeme", "mahkemeDosyaNo", "sonucAciklama", "sonucAsama"].map(
                (field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700">
                            {field}<span className="text-red-500">*</span>:
                        </label>
                        <input
                            type="text"
                            name={field}
                            placeholder={`Örnek: ${field}`}
                            value={formData.davaBilgileri[field] || ""}
                            onChange={handleDavaBilgiChange}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors[field] && (
                            <p className="text-red-500 text-sm">{errors[field]}</p>
                        )}
                    </div>
                )
            )}
            </div>
        </div>
    );
};

export default Case3;
