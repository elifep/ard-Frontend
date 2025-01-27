import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgUrfaLogo from "../assets/UrfaLogo.png";
import useAuthStore from "../stores/authStore";
import Hukuk from "../assets/Hukuk.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { loginAdmin } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAdmin(email, password);
      console.log("response", response);
      if (response?.user) {
        const { user } = response;
        console.log("response", response);
        if (user.role === "admin") {
          navigate("/Basvurular");
        } else if (user.role === "lawyer") {
          navigate("/lawyer-dashboard");
        } else {
          setError("Bilinmeyen bir rol tespit edildi.");
        }
      } else {
        setError("Giriş başarısız mı. Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <style type="text/css">{`body { background-image: url(${Hukuk}); background-size: cover; }`}</style>
      {/* Giriş Kartı */}
      <div className="bg-gray-100 bg-opacity-85 p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Logo ve Başlık */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={imgUrfaLogo}
            alt="Hukuk Yönetim Sistemi"
            className="w-24 h-24 mb-4"
          />
          <h1 className="text-2xl font-bold text-bordo mb-2">
            Hukuk Yönetim Sistemi
          </h1>
          <p className="text-gray-600 text-center">
            Yönetim Paneli'ne erişmek için giriş yapın
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              E-posta Adresi
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bordo"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Şifre
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Şifrenizi girin"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bordo"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-bordo text-white font-bold rounded-lg hover:bg-dark-bordo transition duration-300"
          >
            Giriş Yap
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </form>
        {/* <p className="text-center text-gray-500 text-sm mt-6">
          Şifrenizi mi unuttunuz?{" "}
          <a href="/reset" className="text-bordo hover:underline">
            Buradan sıfırlayın
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;