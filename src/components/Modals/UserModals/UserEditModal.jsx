import React, { useState, useEffect } from "react";
import useUserStore from "../../../stores/userStore";
import Modal from "./Modal";

const UserEditModal = ({ isOpen, onClose, user }) => {
  const { updateUserById } = useUserStore();
  const [editUser, setEditUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Modal açıldığında kullanıcı bilgilerini al
      setEditUser({ ...user, password: "" }); // Şifreyi boş başlat
    } else {
      // Modal kapatıldığında state sıfırla
      setEditUser(null);
    }
  }, [isOpen, user]);

  const handleChange = (e) =>
    setEditUser({ ...editUser, [e.target.name]: e.target.value });

  const handleUpdateUser = async () => {
    if (
      !editUser.fullName ||
      !editUser.email ||
      !editUser.telephone
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    // Şifre boşsa backend'e gönderme
    if (!editUser.password) {
      delete editUser.password;
    }
    if (editUser.role === "lawyer" && !editUser.baroRegistrationNumber) {
      alert("Lawyer rolü için Baro Sicil Numarası zorunludur.");
      return;
    }
    try {
      await updateUserById(editUser._id, editUser);
      onClose(); // Modalı kapat
    } catch {
      alert("Kullanıcı güncellenirken hata oluştu.");
    }
  };

  const renderInput = (label, name, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={editUser?.[name] || ""}
        onChange={handleChange}
        className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  const renderPasswordInput = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Şifre
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Şifrenizi girin"
          value={editUser?.password || ""}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  );

  if (!isOpen || !editUser) return null;

  return (
    <Modal title="Kullanıcıyı Düzenle" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {renderInput("Ad Soyad", "fullName", "text", "Örn: Ahmet Yılmaz")}
        {renderInput("E-posta", "email", "email", "Örn: ornek@example.com")}
        {renderPasswordInput()}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            name="role"
            value={editUser?.role || ""}
            onChange={handleChange}
            className="border rounded px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="lawyer">Avukat</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {editUser?.role === "lawyer" &&
          renderInput(
            "Baro Sicil No",
            "baroRegistrationNumber",
            "number",
            "Örn: 123456"
          )}
        <button
          onClick={handleUpdateUser}
          className="bg-bordo text-white px-4 py-2 rounded hover:bg-dark-bordo transition duration-300"
        >
          Kullanıcıyı Güncelle
        </button>
      </div>
    </Modal>
  );
};

export default UserEditModal;