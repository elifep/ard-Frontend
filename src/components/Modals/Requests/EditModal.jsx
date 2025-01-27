import React, { useState, useEffect } from "react";
import useUserStore from "../../../stores/userStore";
import useRequestStore from "../../../stores/requestStore";
import categoryFields from "../../categoryFields/categoryField";
import RequestMainModal from "./RequestMainModal"; // Genel Modal bileşeni
import CaseEdit1 from "./CaseEdit1"; // Request bölümü için ayrı bileşen
import CaseEdit2 from "./CaseEdit2"; // Incident bölümü için ayrı bileşen
import { toast } from "react-toastify";

const EditRequestModal = ({ isOpen, onClose, fetchRequests, data }) => {
  const { fetchAdminUsers, fetchLawyerUsers, adminUsers, lawyerUsers } =
    useUserStore();
  const { updateRequest } = useRequestStore();
  const [activeTab, setActiveTab] = useState("request");
  const [formData, setFormData] = useState({
    requestNumber: "",
    name: "",
    surname: "",
    email: "",
    tckn: "",
    telephone: "",
    applicantType: "",
    complaintReason: "",
    receivedBy: "",
    assignedLawyer: "",
    submissions: [],
    newFiles: [], // Varsayılan olarak boş bir dizi
    Incidents: {
      category: "MediaScan",
      scanPeriod: "",
      eventCategory: "",
      eventSummary: "",
      source: "",
      link: "",
      imageLink: "",
      notificationAgency: "",
      uploadedFile: "",
      commission: "",
      publicInstitution: "",
    },
    status: "pending",
  });

  const [errors, setErrors] = useState({}); // Hata state

  useEffect(() => {
    if (isOpen) {
      // Kullanıcıları ve diğer gerekli verileri modal açıldığında getir
      fetchAdminUsers();
      fetchLawyerUsers();

      // Form verilerini modal açıldığında sıfırla
      setFormData({
        ...data,
        receivedBy: data?.receivedBy?._id || "",
        assignedLawyer: data?.assignedLawyer?._id || "",
        submissions: data?.submissions || [],
        newFiles: [], // Yeni dosyaları sıfırla
        Incidents: {
          ...data?.Incidents,
          uploadedFile: data?.Incidents?.uploadedFile || [],
        },
      });
    }
  }, [isOpen, data, fetchAdminUsers, fetchLawyerUsers, setFormData]);

  const validateForm = () => {
    const stepErrors = {};

    console.log("Doğrulanan formData:", formData); // Formdaki mevcut verileri konsola yazdır

    // Request tabındaki zorunlu alanlar
    if (!formData.requestNumber) stepErrors.requestNumber = "Başvuru numarası gereklidir.";
    if (!formData.name) stepErrors.name = "Ad zorunludur.";
    if (!formData.surname) stepErrors.surname = "Soyad zorunludur.";
    if (!formData.email) stepErrors.email = "E-mail zorunludur.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      stepErrors.email = "Geçerli bir e-mail adresi giriniz.";
    if (!formData.telephone) stepErrors.telephone = "Telefon numarası gereklidir.";
    else if (!/^05\d{9}$/.test(formData.telephone))
      stepErrors.telephone = "Geçerli bir telefon numarası giriniz (05XXXXXXXXX).";
    if (!formData.applicantType) stepErrors.applicantType = "Başvuran türü gereklidir.";
    if (!formData.complaintReason) stepErrors.complaintReason = "Yakınma nedeni gereklidir.";

    // Incident tabındaki zorunlu alanlar
    if (activeTab === "incident") {
      if (!formData.Incidents.scanPeriod) stepErrors.scanPeriod = "Tarama dönemi gereklidir.";
      if (!formData.Incidents.eventCategory) stepErrors.eventCategory = "Olay kategorisi gereklidir.";
      if (!formData.Incidents.eventSummary) stepErrors.eventSummary = "Olay özeti gereklidir.";
      if (!formData.Incidents.link || !/^https?:\/\/[^\s$.?#].[^\s]*$/gm.test(formData.Incidents.link)) {
        stepErrors.link = "Geçerli bir bağlantı gereklidir.";
      }
    }
    // Kategoriye özel alanları kontrol et
    const fields = categoryFields[formData.Incidents.category] || [];
    fields.forEach((field) => {
      if (field.required && !formData.Incidents[field.name]) {
        stepErrors[field.name] = `${field.label} zorunludur.`;
      }
    });
    console.log("Validation Errors:", stepErrors); // Hata mesajlarını yazdır
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
  const getFileName = (fileUrl) => {
    // Eğer fileUrl bir File nesnesiyse, doğrudan dosya adını döndür
    if (fileUrl instanceof File) {
      return fileUrl.name;
    }
    // Aksi takdirde, URL'yi bölerek dosya adını döndür
    return fileUrl.split("/").pop();
  };
  const handleRemoveFile = (index) => {
    setFormData((prevData) => {
      const removedFile = prevData.submissions[index]?.document; // Silinen dosyayı al
      return {
        ...prevData,
        submissions: prevData.submissions.filter((_, i) => i !== index),
        removedFiles: removedFile
          ? [...(prevData.removedFiles || []), removedFile]
          : prevData.removedFiles || [],
      };
    });
  };

  const handleIncidentInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      Incidents: {
        ...prev.Incidents,
        [name]: value,
      },
    }));
  };

  const handleKategoriChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      Incidents: {
        ...prev.Incidents,
        category: value,
        eventCategory: "",
        eventSummary: "",
        scanPeriod: "",
        link: "",
      },
    }));
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const updatedData = {
        ...formData,
        submissions: formData.submissions.map((file) =>
          file.document instanceof File
            ? file
            : {
              document: file.document,
              documentDescription: file.documentDescription,
            }
        ),
        removedFiles: formData.removedFiles || [], // Silinecek dosyalar
        Incidents: {
          ...formData.Incidents,
          uploadedFile: formData.Incidents.uploadedFile.filter(
            (file) => typeof file === "string"
          ),
        },
      };

      console.log("Gönderilen Veri:", updatedData);

      // Backend'e güncelleme gönder
      await updateRequest(data._id, updatedData, {
        submissions: formData.newFiles,
      });

      // Yeni veriyi fetch ederek güncelle
      await fetchRequests();

      // Toastify ile başarılı mesajı göster
      toast.success("Başvuru başarıyla güncellendi!");
      // Modalı kapat
      onClose();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      // Hata mesajını göster
      toast.error("Başvuru güncellenirken bir hata oluştu!");
    }
  };

  if (!isOpen) return null;

  return (
    <RequestMainModal title="Başvuru Düzenle" onClose={onClose}>
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("request")}
          className={`px-4 py-2 ${activeTab === "request"
            ? "border-b-2 border-blue-500 font-bold"
            : ""
            }`}
        >
          Başvuru Detayları
        </button>
        <button
          onClick={() => setActiveTab("incident")}
          className={`px-4 py-2 ${activeTab === "incident"
            ? "border-b-2 border-blue-500 font-bold"
            : ""
            }`}
        >
          Veri Hakları İhlali
        </button>
      </div>

      {activeTab === "request" && (
        <CaseEdit1
          formData={formData}
          setFormData={setFormData}
          admins={adminUsers}
          lawyers={lawyerUsers}
          handleFileChange={handleFileChange}
          handleInputChange={handleInputChange}
          handleDescriptionChange={handleDescriptionChange}
          handleRemoveFile={handleRemoveFile}
          errors={errors}
          getFileName={getFileName}
        />
      )}

      {activeTab === "incident" && (
        <CaseEdit2
          formData={formData}
          setFormData={setFormData}
          handleIncidentInputChange={handleIncidentInputChange}
          handleKategoriChange={handleKategoriChange}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          errors={errors}
        />
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-bordo text-white px-4 py-2 rounded hover:bg-dark-bordo"
        >
          Update Request
        </button>
      </div>
    </RequestMainModal>
  );
};

export default EditRequestModal;