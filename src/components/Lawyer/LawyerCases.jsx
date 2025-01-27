import React, { useEffect, useState } from "react";
import useLawyerStore from "../../stores/lawyerStore";
import ViewCaseModal from "../../components/Modals/CaseModals/ViewCaseModal";
import UpdateCaseModal from "../../components/Modals/CaseModals/UpdateCaseModal";
import ConfirmModal from "../../components/Modals/UserModals/ConfirmModal";
import { FaFolderOpen, FaEdit, FaTrashAlt } from "react-icons/fa";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

const LawyerCases = () => {
    const { cases, updateCase, loading, error, fetchCases, deleteCase } = useLawyerStore();
    const [selectedCase, setSelectedCase] = useState(null);
    const [isViewCaseModalOpen, setIsViewCaseModalOpen] = useState(false);
    const [isUpdateCaseModalOpen, setIsUpdateCaseModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [caseToDelete, setCaseToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCases(); // Giriş yapan avukatın davalarını getir
    }, [fetchCases]);

    const handleViewCase = (caseItem) => {
        setSelectedCase(caseItem);
        setIsViewCaseModalOpen(true);
    };

    const handleUpdateCase = (caseItem) => {
        setSelectedCase(caseItem);
        setIsUpdateCaseModalOpen(true);
    };
    const handleSubmitUpdateCase = async (caseData, files) => {
        setIsSubmitting(true);
        try {
            if (selectedCase) {
                console.log("Gönderilen Case Data:", caseData);
                console.log("Gönderilen Files:", files);
                await updateCase(selectedCase._id, caseData, files);
            }
            setIsUpdateCaseModalOpen(false);
            fetchCases();
        } catch (error) {
            console.error("Error updating case:", error);
            toast.error("Güncelleme başarısız!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCase = async () => {
        setIsSubmitting(true);
        try {
            if (caseToDelete) {
                await deleteCase(caseToDelete); // LawyerStore'dan deleteCase çağrılıyor 
            }
        } catch (error) {
            console.error("Error deleting case:", error);
            toast.error("Dava silinirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
            setIsConfirmModalOpen(false);
            setCaseToDelete(null);
        }
    };

    const confirmDeleteCase = (caseId) => {
        setCaseToDelete(caseId);
        setIsConfirmModalOpen(true); // Modalı açıyoruz
    };

    if (loading) return <div className="text-center text-lg mt-8"><Loading /></div>;
    if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Davalar</h1>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full border-collapse border">
                    <thead className="bg-bordo text-white uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-6 text-left">Dosya No</th>
                            <th className="py-3 px-6 text-left">Dava Konusu</th>
                            <th className="py-3 px-6 text-left">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 text-sm">
                        {cases.length > 0 ? (
                            cases.map((caseItem) => (
                                <tr key={caseItem._id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{caseItem.fileNumber}</td>
                                    <td className="py-3 px-6">{caseItem.caseSubject}</td>
                                    <td className="py-3 px-6 flex gap-4">
                                        {/* <button
                                            onClick={() => handleViewCase(caseItem)}
                                            className="text-gray-500 hover:text-gray-700 text-2xl"
                                            title="Gör"
                                        >
                                            <FaFolderOpen />
                                        </button> */}
                                        <button
                                            onClick={() => handleUpdateCase(caseItem)}
                                            className="text-gray-500 hover:text-gray-700 text-2xl"
                                            title="Güncelle"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => confirmDeleteCase(caseItem._id)}
                                            className="text-gray-500 hover:text-gray-700 text-2xl"
                                            title="Sil"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-3">
                                    Henüz dava bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <ViewCaseModal
                isOpen={isViewCaseModalOpen} 
                onClose={() => setIsViewCaseModalOpen(false)}
                caseItem={selectedCase}
            />
            <UpdateCaseModal
                isOpen={isUpdateCaseModalOpen}
                onClose={() => setIsUpdateCaseModalOpen(false)}
                onSubmit={handleSubmitUpdateCase} // Güncelleme için doğru fonksiyon
                caseItem={selectedCase} // Güncellenen dava
                isSubmitting={isSubmitting} // Gönderim durumu
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={handleDeleteCase}
                onCancel={() => setIsConfirmModalOpen(false)}
                message="Bu davayı silmek istediğinizden emin misiniz?"
            />
        </div>
    );
};

export default LawyerCases;