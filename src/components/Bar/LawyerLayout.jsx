import React, { useState } from "react";
import LawyerSidebar from "./LawyerSidebar";
import LawyerHeader from "./LawyerHeader";

const LawyerLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed top-20 left-4 ${isCollapsed ? "w-14" : "w-56"
                    } h-[calc(100vh-6rem)] transition-all duration-300 z-30 bg-gray-100 shadow-lg rounded-lg`}
            >
                <LawyerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-14" : "ml-56"
                    }`}
            >
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 h-16 z-40 shadow-lg">
                    <LawyerHeader setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 mt-16">{children}</div>
            </div>
        </div>
    );
};

export default LawyerLayout;