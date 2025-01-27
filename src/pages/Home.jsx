// src/pages/Home.js
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/Loading";

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = setTimeout(() => {
      navigate("/admin-login");
    }, 1000); // 1 saniye bekleyip yönlendirme yapıyoruz

    return () => clearTimeout(redirect);
  }, [navigate]);

  return <Loading />;
};

export default Home;