import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../Modals/UserModals/ConfirmModal";
import useAuthStore from "../../stores/authStore";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logoutAdmin } = useAuthStore();

  const handleLogout = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = async () => {
    await logoutAdmin();
    navigate("/admin-login");
  };

  return (
    <>
      <button
        onClick={handleLogout}
        title="Çıkış Yap"
        className="ml-2 px-1 py-1 text-white hover:bg-gray-200 hover:text-gray-800 transition-all rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M2 4.75A2.75 2.75 0 0 1 4.75 2h3a2.75 2.75 0 0 1 2.75 2.75v.5a.75.75 0 0 1-1.5 0v-.5c0-.69-.56-1.25-1.25-1.25h-3c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h3c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 1 1.5 0v.5A2.75 2.75 0 0 1 7.75 14h-3A2.75 2.75 0 0 1 2 11.25v-6.5Zm9.47.47a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H5.25a.75.75 0 0 1 0-1.5h7.19l-.97-.97a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmLogout}
        onCancel={() => setIsModalOpen(false)}
        message="Çıkış yapmak istediğinize emin misiniz?"
      />
    </>
  );
};

export default LogoutButton;