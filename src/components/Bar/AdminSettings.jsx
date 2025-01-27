import React, { useState, useEffect } from "react";
import useAuthStore from "../../stores/authStore";
import UserEditModal from "../Modals/UserModals/UserEditModal";

const AdminSettings = () => {
  const [admin, setAdmin] = useState(null); // Store logged-in admin's details
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Control modal visibility
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const { verifyUser } = useAuthStore();

  // Fetch logged-in admin's details
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminData = await verifyUser(); // Fetch admin data
        setAdmin(adminData);
      } catch (err) {
        console.error("Error fetching admin details:", err.message || err);
        setError("Yönetici bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // Show loading or error states
  if (loading) return <div className="flex justify-center items-center h-screen text-xl text-gray-600">Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ayarlar</h1>

      {/* Admin Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-3/4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profil Bilgileri</h2>
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-700 font-semibold">Ad Soyad:</label>
            <input
              type="text"
              value={admin?.fullName || ""}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 focus:outline-none"
            />
          </div>
          {/* Email */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-700 font-semibold">E-posta:</label>
            <input
              type="email"
              value={admin?.email || ""}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 focus:outline-none"
            />
          </div>
          {/* Role */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-gray-700 font-semibold">Rol:</label>
            <input
              type="text"
              value={admin?.role || ""}
              readOnly
              className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 focus:outline-none capitalize"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-bordo text-white py-2 px-6 rounded-lg hover:bg-dark-bordo transition duration-300"
          >
            Profil Düzenle
          </button>
        </div>
      </div>

      {/* User Edit Modal */}
      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={admin}
      />
    </div>
  );
};

export default AdminSettings;
