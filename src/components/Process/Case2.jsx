import React from "react";
import categoryFields from "../categoryFields/categoryField";
import Loading from "../Loading";

// Kategori isimlerini çevirme nesnesi
const categoryTranslations = {
  MediaScan: "Medya Taraması",
  STK: "STK",
  BaroCommissions: "Baro Komisyonları",
  PublicInstitutions: "Kamu Kurumları",
};

const Case2 = ({ formData, setFormData, handleKategoriChange, handleIncidentInputChange, errors, loading }) => {
  // Kategoriye özel alanlar
  const fields = categoryFields[formData.Incidents.category] || [];

  // Ortak alanlar (tüm kategorilerde görünen)
  const commonFields = [
    { name: "eventCategory", label: "Olay Kategorisi", required: true },
    { name: "eventSummary", label: "Olay Özeti", required: true },
    { name: "scanPeriod", label: "Tarama Dönemi", required: true },
    { name: "link", label: "Link", required: true },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="text-2xl tex-gray-800 font-bold mb-4">Kategori Bilgileri</h2>
      {/* Kategori seçimi */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Kategori<span className="text-red-500">*</span>:
        </label>
        <select
          name="category"
          value={formData.Incidents.category}
          onChange={handleKategoriChange}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {Object.keys(categoryFields).map((cat) => (
            <option key={cat} value={cat}>
              {categoryTranslations[cat] || cat} {/* Türkçe kategori ismi */}
            </option>
          ))}
        </select>
        <div className="mt-3 p-3 border-l-4 border-yellow-400 bg-yellow-100 text-yellow-800 text-sm">
          {formData.Incidents.category === "MediaScan"
            ? "Seçili kategori: Medya Taraması. Bu kategori medya analizlerine yönelik işlemleri kapsar."
            : `Seçili kategori: ${categoryTranslations[formData.Incidents.category] || formData.Incidents.category}.`}
        </div>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category}</p>
        )}
      </div>

      {/* Ortak alanlar */}
      <div className="grid grid-cols-2 gap-4">
        {commonFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData.Incidents[field.name] || ""}
              onChange={handleIncidentInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Dosya yükleme alanı */}
      <div className="col-span-2">
        <br />
        <label className="block text-sm font-medium text-gray-700">
          Dosya Yükleme<span className="text-gray-500">(Opsiyonel)</span>:
        </label>

        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files).map((file) => ({
              document: file,
            }));
            setFormData((prevData) => ({
              ...prevData,
              Incidents: {
                ...prevData.Incidents,
                files: files,
              },
            }));
          }}
          className="border rounded px-4 py-2 w-1/2"
        />
      </div>

      {/* Kategoriye özel alanlar */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={field.name}
              value={formData.Incidents[field.name] || ""}
              onChange={handleIncidentInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Case2;
