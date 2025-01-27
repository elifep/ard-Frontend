import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaHome,
  FaFolderOpen,
  FaTasks,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import useAuthStore from "../../stores/authStore";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const { verifyUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const verifiedUser = await verifyUser();
        setUser(verifiedUser);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      className={`${
        isCollapsed ? "w-14" : "w-56"
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
        className={`flex flex-col items-center py-6 border-b transition-all ${
          isCollapsed ? "justify-center" : "gap-2"
        }`}
      >
        {isCollapsed ? (
          <FaUserCircle className="text-3xl text-white" />
        ) : (
          <>
            <FaUserCircle className="text-6xl text-white" />
            <div className="text-center">
              <p className="text-lg font-semibold">
                {user?.fullName || "Admin"}
              </p>
              <p className="text-sm text-gray-200">{user?.role || ""}</p>
            </div>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col mt-4 flex-grow gap-2">
        <Link
          to="/admin-dashboard"
          className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
        >
          <FaHome className="text-lg" />
          {!isCollapsed && <span>Anasayfa</span>}
        </Link>
        <Link
          to="/Basvurular"
          className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
        >
          <FaFileAlt className="text-lg" />
          {!isCollapsed && <span>Başvurular</span>}
        </Link>
        <Link
          to="/ExistingDataArchive"
          className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
        >
          <FaFolderOpen className="text-lg" />
          {!isCollapsed && <span>Hak İhlali Veri</span>}
        </Link>
        <Link
          to="/CaseTracking"
          className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
        >
          <FaTasks className="text-lg" />
          {!isCollapsed && <span>Dava Takibi</span>}
        </Link>
      </nav>

      {/* Settings Link */}
      <div className="border-t border-gray-200 mt-4 pt-4">
        <Link
          to="/admin-settings"
          className="flex items-center gap-3 py-3 px-4 hover:bg-dark-bordo rounded-lg transition-all"
        >
          <FaCog className="text-lg" />
          {!isCollapsed && <span>Ayarlar</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
