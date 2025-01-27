import React, { useState } from "react";
import Modal from "./Modal";
import useUserStore from "../../../stores/userStore";
import { toast } from "react-toastify";

const defaultNewUser = {
  fullName: "",
  telephone: "",
  email: "",
  password: "",
  role: "lawyer",
  baroRegistrationNumber: "",
};

const UserCreateModal = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { createUser } = useUserStore();

  const [newUser, setNewUser] = useState(defaultNewUser);
  const [newUserErrors, setNewUserErrors] = useState({});

  const handleCreateUser = async () => {
    const errors = {};

    if (!newUser.fullName) errors.fullName = "Ad Soyad zorunludur.";
    if (!newUser.email) errors.email = "E-posta zorunludur.";
    if (!newUser.password) errors.password = "Şifre zorunludur.";
    if (!newUser.telephone) errors.telephone = "Telefon zorunludur.";
    if (newUser.role === "lawyer" && !newUser.baroRegistrationNumber) {
      errors.baroRegistrationNumber = "Baro Sicil Numarası zorunludur.";
    }

    if (Object.keys(errors).length > 0) {
      setNewUserErrors(errors);
      return;
    }

    try {
      await createUser(newUser);
      toast.success("Kullanıcı başarıyla eklenmiştir!");
      handleClose(); // Modalı kapat ve state'i sıfırla
    } catch (err) {
      setNewUserErrors({
        email: err.response?.data?.error || "E-posta zaten kayıtlı.",
      });
    }
  };

  const handleClose = () => {
    setNewUser(defaultNewUser); // State sıfırlama
    setNewUserErrors({}); // Hataları sıfırlama
    onClose(); // Modalı kapatma
  };

  if (!isOpen) return null;

  return (
    <Modal title="Yeni Kullanıcı Ekle" onClose={handleClose}>
      <div className="flex flex-col gap-4">
        {/* Ad Soyad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            placeholder="Örn: Ahmet Yılmaz"
            value={newUser.fullName}
            onChange={(e) => {
              setNewUser({ ...newUser, fullName: e.target.value });
              setNewUserErrors({ ...newUserErrors, fullName: "" });
            }}
            className={`border rounded px-4 py-2 w-full ${
              newUserErrors.fullName ? "border-red-500" : ""
            }`}
          />
          {newUserErrors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {newUserErrors.fullName}
            </p>
          )}
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefon
          </label>
          <input
            type="tel"
            placeholder="Örn: 0555555555"
            value={newUser.telephone}
            onChange={(e) => {
              setNewUser({ ...newUser, telephone: e.target.value });
              setNewUserErrors({ ...newUserErrors, telephone: "" });
            }}
            maxLength="11"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "");
            }}
            className={`border rounded px-4 py-2 w-full ${
              newUserErrors.telephone ? "border-red-500" : ""
            }`}
          />
          {newUserErrors.telephone && (
            <p className="text-red-500 text-sm mt-1">
              {newUserErrors.telephone}
            </p>
          )}
        </div>

        {/* E-posta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-posta
          </label>
          <input
            type="email"
            placeholder="Örn: ornek@example.com"
            value={newUser.email}
            onChange={(e) => {
              setNewUser({ ...newUser, email: e.target.value });
              setNewUserErrors({ ...newUserErrors, email: "" });
            }}
            className={`border rounded px-4 py-2 w-full ${
              newUserErrors.email ? "border-red-500" : ""
            }`}
            autoComplete="off"
          />
          {newUserErrors.email && (
            <p className="text-red-500 text-sm mt-1">{newUserErrors.email}</p>
          )}
        </div>

        {/* Şifre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Şifrenizi girin"
              value={newUser.password}
              onChange={(e) => {
                setNewUser({ ...newUser, password: e.target.value });
                setNewUserErrors({ ...newUserErrors, password: "" });
              }}
              className={`border rounded px-4 py-2 w-full ${
                newUserErrors.password ? "border-red-500" : ""
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {newUserErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {newUserErrors.password}
            </p>
          )}
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border rounded px-4 py-2 w-full"
          >
            <option value="lawyer">Avukat</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Baro Sicil No */}
        {newUser.role === "lawyer" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Baro Sicil No
            </label>
            <input
              type="number"
              placeholder="Örn: 123456"
              value={newUser.baroRegistrationNumber}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  baroRegistrationNumber: e.target.value,
                })
              }
              className={`border rounded px-4 py-2 w-full ${
                newUserErrors.baroRegistrationNumber ? "border-red-500" : ""
              }`}
            />
            {newUserErrors.baroRegistrationNumber && (
              <p className="text-red-500 text-sm mt-1">
                {newUserErrors.baroRegistrationNumber}
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleCreateUser}
          className="bg-bordo text-white px-4 py-2 rounded-lg hover:bg-dark-bordo transition"
        >
          Kullanıcı Ekle
        </button>
      </div>
    </Modal>
  );
};

export default UserCreateModal;