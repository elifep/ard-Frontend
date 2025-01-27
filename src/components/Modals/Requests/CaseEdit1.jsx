import React, { useEffect } from "react";
import FormInput from "../../Form/IndexForm";
import Status from "./Status";
import FileDisplay from "./FileDisplay";

const CaseEdit1 = ({
  formData,
  handleInputChange,
  handleRemoveFile,
  setFormData,
  admins,
  lawyers,
  errors,
}) => {
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles || [],
    }));
  }, []);

  // Yeni dosya ekleme alanını işle
  const handleNewFileChange = (e, index) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles
        ? [
            ...prevData.newFiles.slice(0, index),
            { document: file, documentDescription: "" },
            ...prevData.newFiles.slice(index + 1),
          ]
        : [{ document: file, documentDescription: "" }],
    }));
  };

  const handleNewFileDescriptionChange = (e, index) => {
    const description = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles.map((file, i) =>
        i === index ? { ...file, documentDescription: description } : file
      ),
    }));
  };

  const handleAddNewFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles
        ? [...prevData.newFiles, { document: null, documentDescription: "" }]
        : [{ document: null, documentDescription: "" }],
    }));
  };

  const handleRemoveNewFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      newFiles: prevData.newFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Başvuran Bilgileri Kartı */}
      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Başvuran Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Ad"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            error={errors.name} // Hata mesajını geçir
          />
          <FormInput
            label="Soyad"
            name="surname"
            value={formData.surname || ""}
            onChange={handleInputChange}
            error={errors.surname} // Hata mesajını geçir
          />
          <FormInput
            label="E-mail"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            error={errors.email} // Hata mesajını geçir
          />
          <FormInput
            label="TC Kimlik Numarası"
            name="tckn"
            value={formData.tckn || ""}
            onChange={handleInputChange}
            maxLength="11" // Maksimum 11 karakter
            onInput={(e) => {
              // Sadece rakamlara izin ver
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            error={errors.tckn} // Hata mesajını geçir
          />
          <FormInput
            label="Telefon Numarası"
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleInputChange}
            maxLength="11"
            onInput={(e) => {
              // Sadece rakamlara izin ver
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            error={errors.telephone} // Hata mesajını geçir
          />
          <FormInput
            label="Başvuru Numarası"
            name="requestNumber"
            value={formData.requestNumber || ""}
            onChange={handleInputChange}
            error={errors.requestNumber} // Hata mesajını geçir
          />
        </div>
      </div>
      {/* Başvuru Detayları Kartı */}
      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Başvuru Detayları</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Başvuran Türü ve Şikayet Nedeni Yan Yana */}
          <FormInput
            label="Başvuran Türü"
            name="applicantType"
            value={formData.applicantType}
            onChange={handleInputChange}
            error={errors.applicantType}
          />
          <FormInput
            label="Şikayet Nedeni"
            name="complaintReason"
            value={formData.complaintReason}
            onChange={handleInputChange}
            type="textarea"
            placeholder="Lütfen şikayet nedenini yazınız..."
            error={errors.complaintReason}
          />

          {/* Dropdownlar Alt Alta */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Başvuruyu Alan
            </label>
            <select
              name="receivedBy"
              value={formData.receivedBy}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Başvuruyu Alan Kişiyi Seçin</option>
              {admins.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">
              Takip Eden Avukat
            </label>
            <select
              name="assignedLawyer"
              value={formData.assignedLawyer}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Takip Eden Avukatı Seçin</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Yeni Dosya Yükleme */}
      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Yeni Dosya Yükleme</h3>
        {formData.newFiles?.map((newFile, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <input
              type="file"
              onChange={(e) => handleNewFileChange(e, index)}
              className="border rounded-lg px-4 py-2 w-1/2"
            />
            <input
              type="text"
              placeholder="Dosya Açıklaması"
              value={newFile.documentDescription || ""}
              onChange={(e) => handleNewFileDescriptionChange(e, index)}
              className="border rounded px-4 py-2 w-1/2"
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
      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Yüklenen Dosyalar</h3>
        <FileDisplay
          submissions={formData.submissions || []}
          onRemove={handleRemoveFile}
        />
      </div>

      <div className="bg-gray-50 hover:shadow-lg shadow rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Durum</h3>
        <Status formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
};

export default CaseEdit1;
