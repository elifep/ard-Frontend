import React from "react";
import { Link } from "react-router-dom";
import { FaFileAlt, FaUserCircle, FaCog, FaTasks, FaHome } from "react-icons/fa";

const LawyerSidebar = ({ isCollapsed, setIsCollapsed }) => {

    return (
        <div
            className={`${isCollapsed ? "w-14" : "w-56"
                } h-full flex flex-col justify-between transition-all duration-300 shadow-4xl bg-bordo text-white rounded-lg`}
        >
            {/* Collapse Button */}
            <button
                className="p-4 focus:outline-none hover:bg-dark-bordo rounded-lg transition-all"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                ☰
            </button>

            {/* Profile Section */}
            <div
                className={`flex flex-col items-center py-6 border-b transition-all ${isCollapsed ? "justify-center" : "gap-2"
                    }`}
            >
                {isCollapsed ? (
                    <FaUserCircle className="text-3xl text-white" />
                ) : (
                    <>
                        <FaUserCircle className="text-6xl text-white" />
                        <div className="text-center">
                            <p className="text-lg text-bold text-gray-200">Avukat Paneli</p>
                        </div>
                    </>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col mt-4 flex-grow gap-2">
                <Link to="/lawyer-dashboard" className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all">
                    <FaHome className="text-lg" />
                    {!isCollapsed && <span>Anasayfa</span>}
                </Link>
                <Link
                    to="/lawyer-applications"
                    className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
                >
                    <FaFileAlt className="text-lg" />
                    {!isCollapsed && <span>Başvurular</span>}
                </Link>
                <Link
                    to="/lawyer-cases"
                    className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
                >
                    <FaTasks className="text-lg" />
                    {!isCollapsed && <span>Davalar</span>}
                </Link>
            </nav>

            {/* Settings Link */}
            <div className="border-t border-gray-200 mt-4 pt-4">
                <Link
                    to="/lawyer-settings"
                    className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
                >
                    <FaCog className="text-lg" />
                    {!isCollapsed && <span>Ayarlar</span>}
                </Link>
            </div>
        </div>
    );
};

export default LawyerSidebar;