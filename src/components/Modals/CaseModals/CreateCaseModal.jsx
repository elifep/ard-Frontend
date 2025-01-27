import React, { useState, useEffect } from "react";
import FormInput from "../../Form/IndexForm";

const CreateCaseModal = ({ isOpen, onClose, onSubmit, request }) => {
  const [caseData, setCaseData] = useState({
    partyName: "",
    lawyer: request?.assignedLawyerName || "",
    caseSubject: "",
    caseLawyer: "",
    fileNumber: "",
    court: "",
    indictment: "",
    courtFileNumber: "",
    resultDescription: "",
    resultStage: "",
    relatedRequest: request?._id || "",
  });

  const [files, setFiles] = useState({
    hearingReports: [],
    petitions: [],
    hearingMinutes: [],
  });

  useEffect(() => {
    if (request) {
      setCaseData((prev) => ({
        ...prev,
        partyName: `${request.name} ${request.surname}` || "",
        lawyer: request.assignedLawyerName || "Belirtilmemiş",
        relatedRequest: request._id || "",
      }));
    }
  }, [request]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (fieldName, fileList) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: Array.from(fileList),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(caseData, files);
  };

  if (!isOpen) return null;

  return (
    <div
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
          Dava Oluştur
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mt-6 bg-gray-100 p-4 rounded-lg hover:shadow-lg transition-shadow duration-500">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormInput
                  label="Taraf Adı Soyadı"
                  name="partyName"
                  value={caseData.partyName}
                  // onChange={handleChange}
                  required
                  readOnly
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
                  // onChange={handleChange}
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
          </div>
          {/* File Upload Section */}
          <div className="grid grid-cols-1 gap-4 mt-6 bg-gray-100 p-4 rounded-lg hover:shadow-lg transition-shadow duration-500">
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
              <label className="block text-sm font-bold mb-2">Dilekçeler</label>
              <input
                type="file"
                name="petitions"
                multiple
                onChange={(e) => handleFileChange("petitions", e.target.files)}
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
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseModal;