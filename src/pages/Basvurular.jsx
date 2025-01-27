import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../components/Table/DataTable";
import useRequestStore from "../stores/requestStore";
import EditModal from "../components/Modals/Requests/EditModal";
import Loading from "../components/Loading";
import { FaCheckCircle, FaEdit, FaPlus, FaClock, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import StatusColumnHeader from "../components/Table/StatusColumnHeader";

const RequestTable = () => {
  const { requests, fetchRequests, loading } = useRequestStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState(""); // Filtre durumu için state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false); // Yeni state


  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditModalOpen) {
      fetchRequests()
    }
  }, [isEditModalOpen, fetchRequests]);

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  };


  // const handleDeleteRequest = async (request) => {
  //   if (
  //     window.confirm(
  //       `Başvuru "${request.requestNumber}" silinecek. Emin misiniz?`
  //     )
  //   ) {
  //     try {
  //       await useRequestStore.getState().deleteRequest(request._id);
  //       toast.success("Başvuru başarıyla silindi.");
  //     } catch (error) {
  //       console.error("Başvuru silme hatası:", error);
  //       toast.error("Başvuru silinirken bir hata oluştu.");
  //     }
  //   }
  // };

  const columns = useMemo(
    () => [
      {
        id: "status",
        header: () => (
          <StatusColumnHeader
            onFilterChange={(status) => setFilterStatus(status)}
            onHeaderClick={() => setIsStatusModalOpen(true)} // Status modalını aç
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status || "pending";
          return (
            <div className="flex justify-center items-center">
              {status === "approved" && <FaCheckCircle className="text-green-500" />}
              {status === "rejected" && <FaTimesCircle className="text-red-500" />}
              {status === "pending" && <FaClock className="text-yellow-500" />}
            </div>
          );
        },
      },
      {
        accessorKey: "requestNumber",
        header: "Başvuru No",
      },
      {
        accessorKey: "name",
        header: "Başvuran Adı",
      },
      {
        accessorKey: "surname",
        header: "Başvuran Soyadı",
      },
      {
        accessorKey: "createdAt",
        header: "Başvuru TarİHİ",
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return date.toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        },
      },
      {
        accessorKey: "applicantType",
        header: "Başvuran Türü",
      },
      {
        id: "actions",
        header: "Düzenle",
        cell: ({ row }) => (
          <>
            <div
              className="flex justify-center items-center cursor-pointer text-gray-600 hover:text-gray-700 text-2xl"
              onClick={() => handleEditRequest(row.original)}
            >
              <FaEdit />
            </div>
            {/* <div
              className="cursor-pointer text-red-600 hover:text-red-700 text-2xl"
              onClick={() => handleDeleteRequest(row.original)}
              title="Sil"
            >
              🗑️
            </div> */}
          </>
        ),
      },
    ],
    [filterStatus]
  );

  if (loading) return <Loading />;

  return (
    <>
      {loading ? ( // Yüklenme durumu
        <Loading />
      ) : (
        <DataTable
          data={requests.filter((request) => {
            if (!filterStatus) return true; // Tümü seçildiğinde tüm veriler gösterilir
            return request.status === filterStatus; // Duruma göre filtreleme
          })}
          columns={columns}
          title="Başvuru Listesi"
          actions={
            <button
              onClick={() => {
                navigate("/basvuru-ekle");
                toast.info("Başvuru oluşturma ekranına yönlendiriliyorsunuz...");
              }}
              className="flex items-center bg-bordo hover:bg-dark-bordo text-white py-2 px-4 rounded">
              <FaPlus className="mr-2" />
              Başvuru Ekle
            </button>
          }
        />
      )}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedRequest}
        fetchRequests={fetchRequests}
      />
      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default RequestTable;
