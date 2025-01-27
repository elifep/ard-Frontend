import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBan } from "react-icons/fa";

const Forbidden = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FaBan className="text-red-600 text-8xl mb-6" />
      <h1 className="text-4xl font-bold text-gray-800">Erişim Reddedildi</h1>
      <p className="text-lg text-gray-600 mt-4">
        Bu sayfaya erişim izniniz bulunmamaktadır.
      </p>
      <p className="text-lg text-gray-600 mt-2">
        Ana sayfaya yönlendiriliyorsunuz...
      </p>
      <a
        href="/"
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
      >
        Ana Sayfaya Git
      </a>
    </div>
  );
};

export default Forbidden;