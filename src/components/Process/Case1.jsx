import React, { useState } from "react";

const Case1 = ({ formData, setFormData, handleInputChange, users, errors }) => {

  // Dosya seçimini işler
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setFormData((prevData) => {
      const newSubmissions = [...prevData.submissions];
      newSubmissions[index] = {
        document: file,
        documentDescription: newSubmissions[index]?.documentDescription || "",
      };
      return { ...prevData, submissions: newSubmissions };
    });
  };

  const handleDescriptionChange = (e, index) => {
    const description = e.target.value;
    setFormData((prevData) => {
      const newSubmissions = [...prevData.submissions];
      newSubmissions[index] = {
        document: newSubmissions[index]?.document || null,
        documentDescription: description,
      };
      return { ...prevData, submissions: newSubmissions };
    });
  };

  const addFileInput = () => {
    setFormData((prevData) => ({
      ...prevData,
      submissions: [
        ...prevData.submissions,
        { document: null, documentDescription: "" },
      ],
    }));
  };

  return (
    <div>
      <h2 className="text-2xl text-gray-800 font-bold mb-4">Kişisel Bilgiler</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ad<span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="name"
            placeholder="Örnek: Ahmet"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Soyad<span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="surname"
            placeholder="Örnek: Yılmaz"
            value={formData.surname || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.surname && (
            <p className="text-red-500 text-sm">{errors.surname}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-mail<span className="text-red-500">*</span>:
          </label>
          <input
            type="email"
            name="email"
            placeholder="Örnek: ahmet@gmail.com"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            T.C. Kimlik Numarası<span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="tckn"
            placeholder="Örnek: 12345678901"
            value={formData.tckn || ""}
            onChange={handleInputChange}
            maxLength="11" // Maksimum 11 karakter
            onInput={(e) => {
              // Sadece rakamlara izin ver
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.tckn && <p className="text-red-500 text-sm">{errors.tckn}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefon<span className="text-red-500">*</span>:
          </label>
          <input
            type="tel"
            name="telephone"
            placeholder="Örnek: 0500 000 0000"
            value={formData.telephone || ""}
            onChange={handleInputChange}
            maxLength="11"
            onInput={(e) => {
              // Sadece rakamlara izin ver
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.telephone && (
            <p className="text-red-500 text-sm">{errors.telephone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Başvuru Numarası<span className="text-red-500">*</span>:
          </label>
          <input
            type="number"
            name="requestNumber"
            placeholder="Örnek: 12345"
            value={formData.requestNumber}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.requestNumber && (
            <p className="text-red-500 text-sm">{errors.requestNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Başvuruyu Alan:
          </label>
          <select
            name="receivedBy"
            value={formData.receivedBy}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Başvuruyu Alan Kişiyi Seçin</option>
            {users
              .filter((user) => user.role === "admin")
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
          </select>
          {/* {errors.receivedBy && (
            <p className="text-red-500 text-sm">{errors.receivedBy}</p>
          )} */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Takip Eden Avukat:
          </label>
          <select
            name="assignedLawyer"
            value={formData.assignedLawyer}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Takip Eden Avukatı Seçin</option>
            {users
              .filter((user) => user.role === "lawyer")
              .map((lawyer) => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.fullName}
                </option>
              ))}
          </select>
          {/* {errors.assignedLawyer && (
            <p className="text-red-500 text-sm">{errors.assignedLawyer}</p>
          )} */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Başvuran Türü<span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            name="applicantType"
            placeholder="Örnek: Vatandaş"
            value={formData.applicantType}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.applicantType && (
            <p className="text-red-500 text-sm">{errors.applicantType}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Yakınma/İhlal Nedeni<span className="text-red-500">*</span>:
          </label>
          <textarea
            name="complaintReason"
            placeholder="Örnek: Alım satımda dolandırıcılık."
            value={formData.complaintReason}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.complaintReason && (
            <p className="text-red-500 text-sm">{errors.complaintReason}</p>
          )}
        </div>

        <div className="mt-4 col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Dosya Yükleme<span className="text-gray-500">(Opsiyonel)</span>:
          </label>
          {formData.submissions.map((submission, index) => (
            <div key={index} className="flex items-center space-x-4 mt-2">
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                className="border rounded-lg px-4 py-2 w-1/2"
              />
              <input
                type="text"
                placeholder="Açıklama"
                value={submission.documentDescription}
                onChange={(e) => handleDescriptionChange(e, index)}
                className="border rounded px-4 py-2 w-1/2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addFileInput}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Dosya Ekle
          </button>
          <div className="mt-3 p-3 border-l-4 border-yellow-400 bg-yellow-100 text-yellow-800 text-sm">
            {
              "Dosya seçin ve açıklama ekleyin. PDF, PNG ve JPEG dosyaları desteklenmektedir."
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Case1;