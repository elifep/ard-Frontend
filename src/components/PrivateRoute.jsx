import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, verifyUser } = useAuthStore();

  console.log("Authenticated user:", user);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await verifyUser(); // Kullanıcıyı doğrula
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [verifyUser]);

  if (isLoading) {
    return <div>Loading...</div>; // Yüklenme durumunda bir spinner gösterilebilir
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />; // Kullanıcı yoksa login sayfasına yönlendir
  }

  if (!allowedRoles.includes(user.role)) {
    console.log("Unauthorized access attempt:", user.role);
    return <Navigate to="/forbidden" replace />; // Yetkisiz erişim için yönlendirme yap
  }

  return children; // Korunan rotayı render et
};

export default PrivateRoute;