import React, { useEffect, useState } from "react";
import useAuthStore from "../../stores/authStore";
import useUserStore from "../../stores/userStore";

const LawyerSettings = () => {
  const { user, verifyUser, loading: authLoading } = useAuthStore();
  console.log("user", user);
  const { updateUserById, loading: userLoading } = useUserStore();
  const [formData, setFormData] = useState(null);
  console.log("formData", formData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      try {
        if (!user) {
          const verifiedUser = await verifyUser(); // Kullanıcıyı doğrula
          setFormData(verifiedUser); // Kullanıcıyı formData'ya yükle
        } else {
          setFormData(user); // Doğrudan mevcut kullanıcıyı kullan
        }
      } catch (err) {
        setError("Kullanıcı bilgileri alınırken bir hata oluştu.");
        console.error(err);
      }
    };

    fetchAndSetUser();
  }, [user, verifyUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData || !formData.id) {
      setError("Kullanıcı bilgileri eksik.");
      return;
    }
    console.log("formData1", formData);

    try {
      await updateUserById(formData.id, formData);
    } catch (err) {
      setError("Bilgiler güncellenirken bir hata oluştu.");
      console.error(err);
    }
  };

  if (authLoading || userLoading || !formData) {
    return <div>Bilgiler yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-bordo mb-6 text-center">Ayarlar</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
      >
        {/* Profil Bilgileri */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Profil Bilgileri</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bordo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bordo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bordo"
              />
            </div>
          </div>
        </div>

        {/* Şifre Değiştir */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Şifre Değiştir</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-bordo"
            />
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-bordo text-white px-6 py-2 rounded-lg hover:bg-dark-bordo transition"
            disabled={authLoading || userLoading}
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default LawyerSettings;
