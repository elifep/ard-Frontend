import ReactDOM from "react-dom";
import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";

const StatusColumnHeader = ({ title, onFilterChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const handleFilter = (status) => {
    onFilterChange(status);
    setDropdownOpen(false);
  };

  const handleDropdownToggle = (e) => {
    const rect = e.target.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom, left: rect.left });
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Dropdown'u kapat
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative flex items-center">
      <span className="text-white text-sm font-bold">{title}</span>

      <div
        className="relative flex items-center justify-between cursor-pointer p-2 rounded-md"
        onClick={(e) => handleDropdownToggle(e)}
      >
        <FaEllipsisV className="ml-2" />
      </div>

      {dropdownOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef} // Dropdown referansı
            className="dropdown-menu bg-white border rounded shadow-lg z-50"
            style={{
              position: "absolute",
              top: dropdownPosition.top + "px",
              left: dropdownPosition.left + "px",
              minWidth: "150px",
            }}
          >
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 hover:bg-bordo hover:text-white cursor-pointer"
                onClick={() => handleFilter("")}
              >
                Tümü
              </li>
              <li
                className="px-4 py-2 hover:bg-bordo hover:text-white cursor-pointer"
                onClick={() => handleFilter("approved")}
              >
                Onaylananlar
              </li>
              <li
                className="px-4 py-2 hover:bg-bordo hover:text-white cursor-pointer"
                onClick={() => handleFilter("pending")}
              >
                Beklemede
              </li>
              <li
                className="px-4 py-2 hover:bg-bordo hover:text-white cursor-pointer"
                onClick={() => handleFilter("rejected")}
              >
                Reddedilenler
              </li>

            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};

export default StatusColumnHeader;