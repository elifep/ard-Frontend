import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa"; // Büyüteç ikonu için

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/admin-login", { replace: true });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FaSearch className="text-red-500 text-8xl mb-6" />
      <h1 className="text-4xl font-bold text-gray-800">
        404 - Sayfa Bulunamadı
      </h1>
      <p className="text-lg text-gray-600 mt-4">
        Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <p className="text-lg text-gray-600 mt-2">
        Giriş sayfasına yönlendiriliyorsunuz...
      </p>
      <a
        href="/admin-login"
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
      >
        Giriş Sayfasına Git
      </a>
    </div>
  );
};

export default NotFound;