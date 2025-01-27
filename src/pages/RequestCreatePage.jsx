import React, { useEffect, useState } from "react";
import useRequestStore from "../stores/requestStore";
import useUserStore from "../stores/userStore";
import { useNavigate } from "react-router-dom";

const RequestCreatePage = () => {
  const { createRequest } = useRequestStore();
  const { fetchAdminUsers, fetchLawyerUsers, adminUsers, lawyerUsers } =
    useUserStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    applicantType: "",
    complaintReason: "",
    receivedBy: "",
    assignedLawyer: "",
    submissions: [],
    incidents: {
      category: "",
      scanPeriod: "",
      eventCategory: "",
      eventSummary: "",
      source: "",
      link: "",
      notificationAgency: "",
      commission: "",
      uploadedFile: null,
    },
  });

  const [fileInputs, setFileInputs] = useState([
    { document: null, documentDescription: "" },
  ]);

  useEffect(() => {
    fetchAdminUsers();
    fetchLawyerUsers();
  }, [fetchAdminUsers, fetchLawyerUsers]);

  // Input değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIncidentChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      incidents: { ...formData.incidents, [name]: value },
    });
  };

  const handleFileChange = (e, index) => {
    const newFileInputs = [...fileInputs];
    newFileInputs[index][e.target.name] = e.target.files
      ? e.target.files[0]
      : e.target.value;
    setFileInputs(newFileInputs);
  };

  const handleIncidentFileChange = (e) => {
    setFormData({
      ...formData,
      incidents: { ...formData.incidents, uploadedFile: e.target.files[0] },
    });
  };

  const addFileInput = () => {
    setFileInputs([...fileInputs, { document: null, documentDescription: "" }]);
  };

  const removeFileInput = (index) => {
    const newFileInputs = [...fileInputs];
    newFileInputs.splice(index, 1);
    setFileInputs(newFileInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();

    // Temel alanlar
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("surname", formData.surname);
    formDataToSubmit.append("applicantType", formData.applicantType);
    formDataToSubmit.append("complaintReason", formData.complaintReason);
    formDataToSubmit.append("receivedBy", formData.receivedBy);
    formDataToSubmit.append("assignedLawyer", formData.assignedLawyer);

    // Submissions (dosyalar)
    fileInputs.forEach((input, index) => {
      if (input.document) {
        formDataToSubmit.append("files", input.document);
        formDataToSubmit.append(
          `descriptions[${index}]`,
          input.documentDescription || ""
        );
      }
    });

    // Incident JSON ve dosyasını ekle
    formDataToSubmit.append("Incidents", JSON.stringify(formData.incidents));

    if (formData.incidents.uploadedFile) {
      formDataToSubmit.append("files", formData.incidents.uploadedFile);
    }

    console.log("Gönderilen FormData:");
    for (let pair of formDataToSubmit.entries()) console.log(pair[0], pair[1]);

    try {
      await createRequest(formDataToSubmit);
      alert("Başvuru başarıyla oluşturuldu!");

      // Yönlendirme
      navigate("/Basvurular");
    } catch (error) {
      console.error("Hata:", error);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6">Create Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Alanları */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />

        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formData.surname}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />

        <textarea
          name="complaintReason"
          placeholder="Complaint Reason"
          value={formData.complaintReason}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        ></textarea>

        {/* Dropdownlar */}
        <select
          name="receivedBy"
          value={formData.receivedBy}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Received By</option>
          {adminUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName}
            </option>
          ))}
        </select>

        <select
          name="assignedLawyer"
          value={formData.assignedLawyer}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Assigned Lawyer</option>
          {lawyerUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.fullName}
            </option>
          ))}
        </select>

        {/* Dosya Yükleme */}
        <div>
          <h3 className="font-semibold mb-2">Submissions</h3>
          {fileInputs.map((input, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="file"
                name="document"
                onChange={(e) => handleFileChange(e, index)}
                className="p-2 border"
              />
              <input
                type="text"
                name="documentDescription"
                placeholder="Document Description"
                value={input.documentDescription}
                onChange={(e) => handleFileChange(e, index)}
                className="p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => removeFileInput(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFileInput}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add File
          </button>
        </div>

        {/* Incident Alanları */}
        <div>
          <h3 className="font-semibold mb-2">Incident Details</h3>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.incidents.category}
            onChange={handleIncidentChange}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            name="scanPeriod"
            placeholder="Scan Period"
            value={formData.incidents.scanPeriod}
            onChange={handleIncidentChange}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            name="eventCategory"
            placeholder="Event Category"
            value={formData.incidents.eventCategory}
            onChange={handleIncidentChange}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="file"
            onChange={handleIncidentFileChange}
            className="p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestCreatePage;
