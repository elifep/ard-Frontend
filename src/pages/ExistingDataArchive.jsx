import React, { useEffect, useMemo, useState } from "react";
import useIncidentStore from "../stores/incidentStore";
import useRequestStore from "../stores/requestStore";
import DataTable from "../components/Table/DataTable";
import Loading from "../components/Loading";
import { FaFileAlt, FaFolderOpen, FaUniversity, FaBuilding, FaSearch } from "react-icons/fa";
import IncidentDetailsModal from "../components/Modals/Details/IncidentDetailsModal";
import categoryFields from "../components/categoryFields/categoryField";

const IncidentTable = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { incidents, fetchIncidents, fetchIncidentById, incident, loading, error } = useIncidentStore();
  const { fetchRequestById, request } = useRequestStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const commonFields = [
    { name: "eventCategory", label: "Olay Kategorisi", required: true },
    { name: "eventSummary", label: "Olay Özeti", required: true },
    { name: "scanPeriod", label: "Tarama Dönemi", required: true },
    { name: "link", label: "Link", required: true },
  ];

  const categoryTranslations = {
    All: "Tümü",
    MediaScan: "Medya Taraması",
    STK: "STK",
    BaroCommissions: "Baro Komisyonları",
    PublicInstitutions: "Kamu Kurumları",
  };

  const categories = [
    { value: "All", label: "Tümü" },
    { value: "MediaScan", label: "Medya Taraması", icon: <FaSearch className="text-bordo text-2xl" /> },
    { value: "STK", label: "STK", icon: <FaFolderOpen className="text-green-600 text-2xl" /> },
    { value: "BaroCommissions", label: "Baro Komisyonları", icon: <FaUniversity className="text-blue-600 text-2xl" /> },
    { value: "PublicInstitutions", label: "Kamu Kurumları", icon: <FaBuilding className="text-orange-500 text-2xl" /> },
  ];

  const categoryCounts = useMemo(() => {
    const counts = categories.reduce((acc, category) => {
      acc[category.value] = incidents.filter(
        (incident) => incident.category === category.value
      ).length;
      return acc;
    }, {});
    return counts;
  }, [incidents]);

  const filteredIncidents = incidents
    .filter(
      (incident) =>
        selectedCategory === "All" || incident.category === selectedCategory
    )
    .filter(
      (incident) =>
        incident.eventSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.source.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleViewDetails = async (incidentId, relatedRequestId) => {
    await fetchIncidentById(incidentId);
    if (relatedRequestId) {
      await fetchRequestById(relatedRequestId);
    }
    setIsModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Kategorİ",
        cell: ({ getValue }) =>
          categoryTranslations[getValue()] || getValue(),
      },
      {
        accessorKey: "eventSummary",
        header: "Olay Özetİ",
        cell: ({ getValue }) =>
          getValue()?.length > 30
            ? `${getValue().substring(0, 30)}...`
            : getValue(),
      },
      {
        accessorKey: "scanPeriod",
        header: "Tarama Dönemİ",
      },
      {
        accessorKey: "eventCategory",
        header: "Olay Kategorİsİ",
      },
      {
        accessorKey: "Detay",
        header: "Detaylar",
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original._id, row.original.relatedRequest)}
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
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      {/* İkonlu Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
  {categories
    .filter((category) => category.value !== "All")
    .map((category) => (
      <div
        key={category.value}
        className="p-4 rounded shadow text-center bg-gradient-to-r from-bordo to-gray-800 text-white flex flex-col items-center"
      >
        <div className="mb-2 text-3xl">
          {category.value === "MediaScan" && <FaSearch />}
          {category.value === "STK" && <FaFolderOpen />}
          {category.value === "BaroCommissions" && <FaUniversity />}
          {category.value === "PublicInstitutions" && <FaBuilding />}
        </div>
        <h3 className="text-lg font-semibold">{category.label}</h3>
        <p className="text-4xl font-bold">{categoryCounts[category.value]}</p>
      </div>
    ))}
</div>

      {/* Data Table */}
      <DataTable
        data={filteredIncidents}
        columns={columns}
        title="Hak İhlali Veri"
        actions={
          <div className="flex items-center gap-2">
            <label>Kategori Seçin:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-bordo bg-white"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Modal */}
      <IncidentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incident={incident}
        request={request}
        categoryFields={categoryFields}
        commonFields={commonFields}
      />
    </div>
  );
};

export default IncidentTable;
