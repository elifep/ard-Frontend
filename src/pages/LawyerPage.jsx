import React, { useEffect } from "react";
import useLawyerStore from "../stores/lawyerStore";
import { FaGavel, FaFileAlt } from "react-icons/fa";

const LawyerDashboard = () => {
  const { requests, cases, fetchCases, fetchRequests, loading, error } = useLawyerStore();

  const assignedLawyerName = requests.length > 0 ? requests[0].assignedLawyerName : "Avukat";

  useEffect(() => {
    fetchRequests();
    fetchCases();
  }, [fetchRequests, fetchCases]);

  if (loading) return <div className="text-center text-lg mt-8">Yükleniyor...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Hoş geldin, {assignedLawyerName}!
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Başvurularınız ve davalarınıza ilişkin özet bilgileri aşağıda bulabilirsiniz.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Toplam Davalar */}
        <div className="bg-gray-600 text-white rounded-lg shadow-md p-6 flex items-center hover:bg-gray-800 transition duration-300 ease-in-out">
          <FaGavel className="text-4xl mr-4" />
          <div>
            <h2 className="text-xl font-bold">Toplam Davalar</h2>
            <p className="text-4xl font-semibold">{cases.length}</p>
          </div>
        </div>

        {/* Toplam Başvurular */}
        <div className="bg-dark-bordo text-white rounded-lg shadow-md p-6 flex items-center hover:bg-bordo transition duration-300 ease-in-out">
          <FaFileAlt className="text-4xl mr-4" />
          <div>
            <h2 className="text-xl font-bold">Toplam Başvurular</h2>
            <p className="text-4xl font-semibold">{requests.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;
