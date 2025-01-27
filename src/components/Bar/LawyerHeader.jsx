import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Buttons/LogoutButton";
import imgUrfaLogo from "../../assets/UrfaLogo.png";

const LawyerHeader = ({ setIsCollapsed, isCollapsed }) => {
    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between bg-bordo text-white px-6 h-16 shadow-md rounded-b-lg">
            {/* Sol Kısım - Logo ve Başlık */}
            <div className="flex items-center gap-4">
                <img
                    src={imgUrfaLogo}
                    alt="Logo"
                    className="w-12 h-12 cursor-pointer"
                    onClick={() => navigate("/admin-dashboard")}
                />
                <h1 className="text-xl font-semibold tracking-wide">
                    Hukuk Yönetim Sistemi
                </h1>
            </div>

            {/* Sağ Kısım - Bildirimler, Profil ve Çıkış */}
            <div className="flex items-center gap-6">
                <FaBell
                    className="text-xl cursor-pointer hover:text-gray-200"
                    title="Bildirimler"
                />
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-gray-200"
                    onClick={() => navigate("/lawyer-settings")}
                >
                    <FaUserCircle className="text-2xl" title="Profil" />
                    <span className="text-sm">Avukat Paneli</span>
                </div>
                <LogoutButton />
            </div>
        </header>
    );
};

export default LawyerHeader;