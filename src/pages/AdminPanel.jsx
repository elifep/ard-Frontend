import React, { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import UserCreateModal from "../components/Modals/UserModals/UserCreateModal";
import UserEditModal from "../components/Modals/UserModals/UserEditModal";
import ConfirmModal from "../components/Modals/UserModals/ConfirmModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminPanel = () => {
  const { users, fetchUsersByRole, fetchUsers, deleteUserById } = useUserStore();
  const [selectedRole, setSelectedRole] = useState("all"); // Default: Tüm kullanıcılar
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    if (selectedRole === "all") {
      fetchUsers(); // Tüm kullanıcıları getirir
    } else {
      fetchUsersByRole(selectedRole); // Rol bazlı kullanıcıları getirir
    }
  }, [selectedRole, fetchUsersByRole, fetchUsers]);

  const handleDeleteUser = async () => {
    if (deleteUserId) {
      await deleteUserById(deleteUserId);
      setDeleteUserId(null);
      setIsConfirmModalOpen(false);
    }
  };

  const confirmDeleteUser = (id) => {
    setDeleteUserId(id);
    setIsConfirmModalOpen(true);
  };

  const roleTranslations = {
    lawyer: "Avukat",
    admin: "Admin",
    user: "Kullanıcı", // Ekleyebilirsiniz
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Paneli</h1>

      {/* Filtreleme Bölümü */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <label className="text-gray-800 font-bold">Rol Seçin:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-bordo"
          >
            <option value="all">Tüm Kullanıcılar</option>
            <option value="lawyer">Avukat</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-bordo hover:bg-dark-bordo text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-bordo"
        >
          Kullanıcı Ekle

        </button>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-bordo text-white uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Ad Soyad</th>
              <th className="py-3 px-6 text-left">E-maİl</th>
              <th className="py-3 px-6 text-center">Rol</th>
              <th className="py-3 px-6 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {user.fullName}
                </td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-center">{roleTranslations[user.role] || user.role}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setEditUser(user);
                        setIsEditUserModalOpen(true);
                      }}
                      className="text-2xl text-gray-600 hover:text-gray-800 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDeleteUser(user._id)}
                      className="text-2xl text-bordo hover:text-red-800 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <UserCreateModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
      <UserEditModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        user={editUser}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleDeleteUser}
        onCancel={() => setIsConfirmModalOpen(false)}
        message="Bu kullanıcıyı silmek istediğinize emin misiniz?"
      />
    </div>
  );
};

export default AdminPanel;