import React, { useState, useEffect } from "react";
import useRequestStore from "../stores/requestStore";
import userStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../components/Process/ProgressBar";
import Case1 from "../components/Process/Case1";
import Case2 from "../components/Process/Case2";
import categoryFields from "../components/categoryFields/categoryField";

import { ToastContainer, toast } from "react-toastify"; // Toastify dahil edildi
import "react-toastify/dist/ReactToastify.css"; // Toastify stilleri
const BasvuruEkle = () => {
  const { createRequest, loading } = useRequestStore();
  const { users, fetchUsers } = userStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
    tckn: "",
    requestNumber: "",
    applicantType: "",
    receivedBy: "",
    assignedLawyer: "",
    complaintReason: "",
    Incidents: {
      category: "MediaScan", // Varsayılan kategori
      eventCategory: "",
      eventSummary: "",
      scanPeriod: "",
      link: "",
    },
    submissions: [{ document: null, documentDescription: "" }],
  });

  const [errors, setErrors] = useState({});
  const steps = ["Kişisel Bilgiler", "Kategori Bilgileri"];

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validateStep = () => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.name) stepErrors.name = "Ad zorunludur.";
      if (!formData.surname) stepErrors.surname = "Soyad zorunludur.";
      if (!formData.email) stepErrors.email = "E-mail zorunludur.";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        stepErrors.email = "Geçerli bir e-mail adresi giriniz.";
      if (!formData.tckn) stepErrors.tckn = "TC Kimlik Numarası zorunludur.";
      if (!formData.telephone) stepErrors.telephone = "Telefon numarası zorunludur.";
      else if (!/^05\d{9}$/.test(formData.telephone))
        stepErrors.telephone = "Geçerli bir telefon numarası giriniz (05XXXXXXXXX).";
      if (!formData.requestNumber)
        stepErrors.requestNumber = "Başvuru numarası zorunludur.";
      if (!formData.applicantType)
        stepErrors.applicantType = "Başvuran türü zorunludur.";
      // if (!formData.receivedBy)
      //   stepErrors.receivedBy = "Başvuruyu alan kişi seçilmelidir.";
      // if (!formData.assignedLawyer)
      //   stepErrors.assignedLawyer = "Avukat seçilmelidir.";
      if (!formData.complaintReason)
        stepErrors.complaintReason = "Yakınma nedeni zorunludur.";
    } else if (step === 2) {
      // Ortak alanları kontrol et
      ["eventCategory", "eventSummary", "scanPeriod", "link"].forEach(
        (field) => {
          if (!formData.Incidents[field]) {
            stepErrors[field] = `${field} zorunludur.`;
          }
        }
      );

      // Kategoriye özel alanları kontrol et
      const fields = categoryFields[formData.Incidents.category] || [];
      fields.forEach((field) => {
        if (field.required && !formData.Incidents[field.name]) {
          stepErrors[field.name] = `${field.label} zorunludur.`;
        }
      });
    }
    console.log("Validation errors:", stepErrors); // Eklenen log
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  const handleKategoriChange = (e) => {
    setFormData({
      ...formData,
      Incidents: { ...formData.Incidents, category: e.target.value },
    });
  };

  const handleIncidentInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Incidents: {
        ...prevData.Incidents,
        [name]: value,
      },
    }));
  };

  // Yeni adıma geçerken önceki hataları temizle
  const handleNext = () => {
    if (validateStep()) {
      setErrors({}); // Önceki hataları temizler
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      console.log("Gönderilen veriler:", formData);
      try {
        const submissionData = {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          tckn: formData.tckn,
          telephone: formData.telephone,
          requestNumber: formData.requestNumber,
          applicantType: formData.applicantType,
          receivedBy: formData.receivedBy,
          assignedLawyer: formData.assignedLawyer,
          complaintReason: formData.complaintReason,
          Incidents: formData.Incidents, // Eğer `_id` varsa sadece onu gönder
          submissions: formData.submissions.map((submission) => ({
            documentDescription: submission.documentDescription || "",
            document: submission.document || "",
          })),
        };
        console.log("Gönderilen Incidents verisi:", formData.Incidents);
        console.log("Gönderilen veri:", submissionData); // Gönderilen veriyi kontrol edin
        await createRequest(submissionData); // Backend'e gönderim
        toast.success("Başvuru başarıyla oluşturuldu!", { // Toastify ile başarı mesajı
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {// Sayfa yenileme
          navigate("/basvurular");
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Hata:", error);  // Hata mesajı
        toast.error("Başvuru oluşturulurken bir hata oluştu!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer /> {/* Toastify Konteyneri */}
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-8">
        <h1 className="text-3xl text-gray-800 font-extrabold text-center mb-6">Başvuru Ekle</h1>

        <ProgressBar step={step} steps={steps} />

        <div className="mt-6">
          {step === 1 && (
            <Case1
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
              users={users}
              errors={errors}
            />
          )}
          {step === 2 && (
            <Case2
              formData={formData}
              handleKategoriChange={handleKategoriChange}
              handleIncidentInputChange={handleIncidentInputChange}
              setFormData={setFormData}
              errors={errors}
              loading={loading}
            />
          )}
        </div>

        {/* Alt Butonlar */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${step === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-600"
              }`}
          >
            Geri
          </button>
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800"
            >
              İleri
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800"
                disabled={loading}
              >
                Kaydet
              </button>
              <button
                onClick={() => navigate("/basvurular")}
                className="bg-bordo text-white px-6 py-2 rounded-lg font-semibold hover:bg-dark-bordo"
              >
                İptal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasvuruEkle;