import React, { useEffect, useState } from "react";
import useLawyerStore from "../../stores/lawyerStore";
import useCaseStore from "../../stores/caseStore";
import RequestDetailsModal from "../../components/Lawyer/RequestDetailsModal";
import CreateCaseModal from "../../components/Modals/CaseModals/CreateCaseModal";
import { FaFileAlt, FaPlusSquare } from "react-icons/fa";
import Loading from "../Loading";

const LawyerApplications = () => {
  const { requests, loading, error, fetchRequests, clearError } = useLawyerStore();
  const { createCase, fetchCases, loading: caseLoading } = useCaseStore(); // Store'dan createCase'i aldık
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchCases();
  }, [fetchRequests]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleCreateCase = (request) => {
    setSelectedRequest(request);
    setIsCreateCaseModalOpen(true);
  };

  const handleSubmitCase = async (caseData, files) => {
    setIsSubmitting(true);
    try {
      console.log("Gönderilen Case Data:", caseData);
      console.log("Gönderilen Files:", files);
      await createCase(caseData, files); // Store'dan gelen createCase fonksiyonu
      setIsCreateCaseModalOpen(false);
    } catch (error) {
      console.error("Error creating case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center text-lg mt-8">Loading...</p>;
  if (loading && caseLoading) return <p className="text-center text-lg mt-8"><Loading /></p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-8">
        {error}{" "}
        <button onClick={clearError} className="text-blue-500">
          Clear Error
        </button>
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Başvurular</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse border">
          <thead className="bg-bordo text-white uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Ad Soyad</th>
              <th className="py-3 px-6 text-left">Şikayet Nedeni</th>
              <th className="py-3 px-6 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{request.name} {request.surname}</td>
                  <td className="py-3 px-6">{request.complaintReason}</td>
                  <td className="py-3 px-6 flex gap-4">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                      title="Detayları Gör"
                    >
                      <FaFileAlt />
                    </button>
                    <button
                      onClick={() => handleCreateCase(request)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                      title="Dava Oluştur"
                    >
                      <FaPlusSquare />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-3">
                  Henüz Başvuru bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <RequestDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        request={selectedRequest}
      />
      <CreateCaseModal
        isOpen={isCreateCaseModalOpen}
        onClose={() => setIsCreateCaseModalOpen(false)}
        onSubmit={handleSubmitCase}
        request={selectedRequest}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LawyerApplications;