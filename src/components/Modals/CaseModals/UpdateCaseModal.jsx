import React, { useState, useEffect } from "react";
import FormInput from "../../Form/IndexForm";
import { FaFolderOpen } from "react-icons/fa";
import useAuthStore from "../../../stores/authStore";

const UpdateCaseModal = ({ isOpen, onClose, onSubmit, caseItem }) => {
  const { user } = useAuthStore();
  const [caseData, setCaseData] = useState({
    partyName: "",
    lawyer: "",
    caseSubject: "",
    caseLawyer: "",
    fileNumber: "",
    court: "",
    indictment: "",
    courtFileNumber: "",
    resultDescription: "",
    resultStage: "",
  });

  const [files, setFiles] = useState({
    hearingReports: [],
    petitions: [],
    hearingMinutes: [],
  });

  useEffect(() => {
    if (caseItem) {
      setCaseData({
        partyName: caseItem.partyName || "",
        lawyer: caseItem.lawyer?.fullName || "",
        caseSubject: caseItem.caseSubject || "",
        caseLawyer: caseItem.caseLawyer || "",
        fileNumber: caseItem.fileNumber || "",
        court: caseItem.court || "",
        indictment: caseItem.indictment || "",
        courtFileNumber: caseItem.courtFileNumber || "",
        resultDescription: caseItem.resultDescription || "",
        resultStage: caseItem.resultStage || "",
      });
      setFiles({
        hearingReports: caseItem.documents?.hearingReports || [],
        petitions: caseItem.documents?.petitions || [],
        hearingMinutes: caseItem.documents?.hearingMinutes || [],
      });
    }
  }, [caseItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (fieldName, fileList) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), ...Array.from(fileList)],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kullanıcı ID'sini `lawyer` alanına ekle
    const dataToSubmit = {
      ...caseData,
      lawyer: user?.id, // Otomatik olarak giriş yapan avukatın ID'sini ata
    };

    onSubmit(dataToSubmit, files);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto"
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
          Dava Güncelle
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div>
              <FormInput
                label="Taraf Adı Soyadı"
                name="partyName"
                value={caseData.partyName}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Mahkeme"
                name="court"
                value={caseData.court}
                onChange={handleChange}
                required
                placeholder="Örn: Ankara 3. Asliye Hukuk Mahkemesi"
              />
              <FormInput
                label="Dava Konusu"
                name="caseSubject"
                value={caseData.caseSubject}
                onChange={handleChange}
                required
                placeholder="Örn: Tazminat Davası"
              />
              <FormInput
                label="Sonuç Aşama"
                name="resultStage"
                value={caseData.resultStage}
                onChange={handleChange}
                placeholder="Örn: Karar aşamasında"
              />
            </div>

            {/* Right Column */}
            <div>
              <FormInput
                label="Dosya No"
                name="fileNumber"
                value={caseData.fileNumber}
                onChange={handleChange}
                required
                placeholder="Örn: 12345"
              />
              <FormInput
                label="Taraf Avukatı"
                name="lawyer"
                value={caseData.lawyer}
                onChange={handleChange}
                required
                readOnly
              />
              <FormInput
                label="Mahkeme Dosya No"
                name="courtFileNumber"
                value={caseData.courtFileNumber}
                onChange={handleChange}
                required
                placeholder="Örn: 2023/101"
              />
              <FormInput
                label="İddianame"
                name="indictment"
                value={caseData.indictment}
                onChange={handleChange}
                required
                placeholder="İddianame detayı girin"
              />
              <FormInput
                label="Davayı Takip Eden Avukat"
                name="caseLawyer"
                value={caseData.caseLawyer}
                onChange={handleChange}
                required
                placeholder="Örn: Mehmet Yılmaz"
              />
            </div>
          </div>

          {/* Result Description */}
          <div className="col-span-2">
            <FormInput
              label="Sonuç Açıklama"
              name="resultDescription"
              value={caseData.resultDescription}
              onChange={handleChange}
              type="textarea"
              placeholder="Dava sonucu hakkında açıklama"
            />
          </div>

          {/* File Upload Section */}
          {/* File Upload Section */}
          <div className="flex gap-6 mt-6 bg-gray-100 p-4 rounded-lg">
            {/* File Upload Section */}
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-4">Dosya Yükleme</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Duruşma Raporları
                  </label>
                  <input
                    type="file"
                    name="hearingReports"
                    multiple
                    onChange={(e) =>
                      handleFileChange("hearingReports", e.target.files)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Dilekçeler
                  </label>
                  <input
                    type="file"
                    name="petitions"
                    multiple
                    onChange={(e) =>
                      handleFileChange("petitions", e.target.files)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Duruşma Tutanakları
                  </label>
                  <input
                    type="file"
                    name="hearingMinutes"
                    multiple
                    onChange={(e) =>
                      handleFileChange("hearingMinutes", e.target.files)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-300"></div>

            {/* Existing Files Section */}
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-4">Mevcut Dosyalar</h3>
              <ul className="space-y-3">
                {files.hearingReports.map((file, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaFolderOpen className="text-gray-600 text-2xl" />
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bordo underline hover:text-dark-bordo"
                    >
                      Duruşma Raporu {index + 1}
                    </a>
                  </li>
                ))}
                {files.petitions.map((file, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaFolderOpen className="text-gray-600 text-2xl" />
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bordo underline hover:text-dark-bordo"
                    >
                      Dilekçe {index + 1}
                    </a>
                  </li>
                ))}
                {files.hearingMinutes.map((file, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaFolderOpen className="text-gray-600 text-2xl" />
                    <a
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bordo underline hover:text-dark-bordo"
                    >
                      Duruşma Tutanağı {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="bg-bordo text-white px-4 py-2 rounded-lg hover:bg-dark-bordo transition"
            >
              Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCaseModal;