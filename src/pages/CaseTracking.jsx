import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCaseStore from "../stores/caseStore";
import DataTable from "../components/Table/DataTable";
import AdminCaseModal from "../components/Modals/AdminCaseModal";
import AdminCreateCaseModal from "../components/Modals/CaseModals/AdminCreateCaseModal"; // Yeni modal import edildi
import Loading from "../components/Loading";
import { FaFileAlt } from "react-icons/fa";

const CaseTable = () => {
  const { cases, fetchCases, loading, message, createCase } = useCaseStore();
  const [isModalOpen, setIsModalOpen] = useState(false); // Detay modalı
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Dava ekleme modalı
  const [selectedCase, setSelectedCase] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  const handleCreateCase = (caseData) => {
    createCase(caseData); // Yeni dava ekleme işlemi
    setIsCreateModalOpen(false);
  };

  const columns = useMemo(
    () => [
      { accessorKey: "partyName", header: "Taraf Adı Soyadı" },
      { accessorKey: "caseSubject", header: "Dava Konusu" },
      {
        accessorKey: "lawyer.fullName",
        header: "Avukat İsmi",
        cell: ({ getValue }) => getValue() || "Avukat atanmadı",
      },
      { accessorKey: "fileNumber", header: "Dosya No" },
      { accessorKey: "court", header: "Mahkeme" },
      { accessorKey: "resultStage", header: "Sonuç Aşama" },
      {
        id: "details",
        header: "Detay",
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            title="Detayları Gör"
          >
            <FaFileAlt />
          </button>
        ),
      },
    ],
    []
  );

  if (loading) return <Loading />;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <DataTable
        data={cases}
        columns={columns}
        title="Dava Listesi"
        actions={
          <>
            <button
              onClick={() => setIsCreateModalOpen(true)} // Dava Ekle modalını açar
              className="bg-bordo text-white px-4 py-2 rounded-md"
            >
              + Dava Ekle
            </button>
          </>
        }
      />
      {/* Detay Modal */}
      <AdminCaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={selectedCase}
      />
      {/* Dava Ekleme Modal */}
      <AdminCreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(caseData, files) => useCaseStore.getState().createCase(caseData, files)} // Yeni dava ekleme işlemi burada tanımlandı
      />
    </div>
  );
};

export default CaseTable;