import React, { useEffect } from "react";
import categoryFields from "../../categoryFields/categoryField";
import FileDisplay from "./FileDisplay";
// Kategori isimlerini çevirme nesnesi
const categoryTranslations = {
  MediaScan: "Medya Taraması",
  STK: "STK",
  BaroCommissions: "Baro Komisyonları",
  PublicInstitutions: "Kamu Kurumları",
};

const CaseEdit2 = ({ formData, setFormData, handleRemoveFile, handleFileChange, handleIncidentInputChange, handleKategoriChange, errors }) => {
  useEffect(() => {
    console.log("CaseEdit2 içinde formData:", formData);
  }, [formData]);
  // Kategoriye özel alanlar
  const fields = categoryFields[formData.Incidents.category] || [];

  // Ortak alanlar (tüm kategorilerde görünen)
  const commonFields = [
    { name: "eventCategory", label: "Olay Kategorisi", required: true },
    { name: "eventSummary", label: "Olay Özeti", required: true },
    { name: "scanPeriod", label: "Tarama Dönemi", required: true },
    { name: "link", label: "Link", required: true },
  ];

  const handleAddNewFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles
        ? [...prevData.newFiles, { document: null, documentDescription: "" }]
        : [{ document: null, documentDescription: "" }],
    }));
  };

  const handleNewFileChange = (e, index) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles
        ? [...prevData.newFiles.slice(0, index), { document: file, documentDescription: "" }, ...prevData.newFiles.slice(index + 1)]
        : [{ document: file, documentDescription: "" }],
    }));
  };

  const handleRemoveNewFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <h2 className="text-2xl font-bold mb-4">Kategori Bilgileri</h2>

      {/* Kategori seçimi */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">
          Kategori
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
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>

      {/* Ortak alanlar */}
      <div className="grid grid-cols-2 gap-4">
        {commonFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-bold mb-2">
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
            {/* Hata mesajı */}
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}
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
            {/* Hata mesajı */}
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Yeni Dosya Yükleme */}
      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold m8">Yeni Dosya Yükleme</h3>
        {formData.newFiles?.map((newFile, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <input
              type="file"
              onChange={(e) => handleNewFileChange(e, index)}
              className="border rounded-lg px-4 py-2 w-1/2"
            />
            <button
              onClick={() => handleRemoveNewFile(index)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Kaldır
            </button>
          </div>
        ))}
        <button
          onClick={handleAddNewFile}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          + Dosya Ekle
        </button>
      </div>
      {/* Yüklenen Dosyalar */}
      {/* <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Yüklenen Dosyalar</h3>
        {formData.Incidents.uploadedFile && formData.Incidents.uploadedFile.length > 0 ? (
          <FileDisplay
            submissions={formData.Incidents.uploadedFile}
            onRemove={(index) => {
              // Dosya kaldırma işlemi
              setFormData((prev) => ({
                ...prev,
                Incidents: {
                  ...prev.Incidents,
                  uploadedFile: prev.Incidents.uploadedFile.filter((_, i) => i !== index),
                },
              }));
            }}
          />
        ) : (
          <p className="text-gray-500 text-sm">Henüz yüklenmiş bir dosya yok.</p>
        )}
      </div> */}

      {/* Dosya yükleme alanı */}
      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6 mt-4">
        {/* <div className="mb-4">
          <br />
          <label className="block text-sm font-bold mb-2">
            Dosya Yükleme<span className="text-gray-500">(Opsiyonel)</span>:
          </label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          /> */}
        {/* Dosya yükleme için hata mesajı (örnek ekledim, gerekirse kaldırılabilir) */}
        {/* {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}
        </div> */}
        <div>
          <h3 className="text-lg font-bold m8">Yüklenen Dosyalar</h3>
          <ul className="list-disc pl-5 my-3">
            {formData.Incidents.uploadedFile.map((file, index) => (
              <li key={index} className="flex items-center gap-2">
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {`File ${index + 1}`}
                </a>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      Incidents: {
                        ...prev.Incidents,
                        uploadedFile: prev.Incidents.uploadedFile.filter(
                          (_, i) => i !== index
                        ),
                      },
                    }))
                  }
                >
                  ✖ Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaseEdit2;