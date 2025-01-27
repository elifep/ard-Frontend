import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaGavel,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBalanceScale,
  FaClipboardList,
} from "react-icons/fa";
import useUserStore from "../stores/userStore";
import useRequestStore from "../stores/requestStore";
import useCaseStore from "../stores/caseStore";
import Loading from "../components/Loading";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalCases: 0,
    activeCases: 0,
    inactiveCases: 0,
    lawyers: 0,
    admins: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  const { fetchUsers, users } = useUserStore();
  const { fetchRequests, requests } = useRequestStore();
  const { fetchCases, cases } = useCaseStore();

  const fetchData = async () => {
    setLoading(true);

    try {
      await Promise.all([fetchUsers(), fetchRequests(), fetchCases()]);

      const lawyers = users.filter((user) => user.role === "lawyer").length;
      const admins = users.filter((user) => user.role === "admin").length;

      const pendingRequests = requests.filter(
        (req) => req.status === "pending"
      ).length;
      const approvedRequests = requests.filter(
        (req) => req.status === "approved"
      ).length;
      const rejectedRequests = requests.filter(
        (req) => req.status === "rejected"
      ).length;

      const activeCases = cases.filter((c) => c.status === "active").length;
      const inactiveCases = cases.filter((c) => c.status === "inactive").length;

      setStats({
        totalUsers: users.length,
        totalRequests: requests.length,
        totalCases: cases.length,
        activeCases,
        inactiveCases,
        lawyers,
        admins,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Hoşgeldiniz Mesajı */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-bordo">Hoş Geldiniz, Admin!</h1>
        <p className="text-gray-600">
          Yönetim paneline hoş geldiniz. Buradan sistemdeki tüm verileri ve
          işlemleri yönetebilirsiniz.
        </p>
      </div>

      {/* Büyük Kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <LargeCard
          icon={<FaUsers size={48} />}
          title="Toplam Kullanıcılar"
          value={`${stats.totalUsers}`}
          bgColor="bg-indigo-500"
        >
          <div className="grid grid-cols-1 gap-2 mt-4">
            <MiniCard
              icon={<FaGavel size={20} />}
              title="Avukatlar"
              value={`${stats.lawyers} Avukat`}
              bgColor="bg-blue-500"
            />
            <MiniCard
              icon={<FaUser size={20} />}
              title="Adminler"
              value={`${stats.admins} Admin`}
              bgColor="bg-yellow-500"
            />
          </div>
        </LargeCard>

        <LargeCard
          icon={<FaClipboardList size={48} />}
          title="Toplam Başvurular"
          value={`${stats.totalRequests}`}
          bgColor="bg-blue-500"
        >
          <div className="grid grid-cols-1 gap-2 mt-4">
            <MiniCard
              icon={<FaClock size={20} />}
              title="Bekleyen Başvurular"
              value={`${stats.pendingRequests} Başvuru`}
              bgColor="bg-orange-500"
            />
            <MiniCard
              icon={<FaCheckCircle size={20} />}
              title="Onaylanan Başvurular"
              value={`${stats.approvedRequests} Başvuru`}
              bgColor="bg-green-500"
            />
            <MiniCard
              icon={<FaTimesCircle size={20} />}
              title="Reddedilen Başvurular"
              value={`${stats.rejectedRequests} Başvuru`}
              bgColor="bg-red-500"
            />
          </div>
        </LargeCard>

        <LargeCard
          icon={<FaBalanceScale size={48} />}
          title="Toplam Davalar"
          value={`${stats.totalCases}`}
          bgColor="bg-purple-500"
        >
          <div className="grid grid-cols-1 gap-2 mt-4">
            <MiniCard
              icon={<FaCheckCircle size={20} />}
              title="Aktif Davalar"
              value={`${stats.activeCases} Dava`}
              bgColor="bg-green-500"
            />
            <MiniCard
              icon={<FaTimesCircle size={20} />}
              title="Pasif Davalar"
              value={`${stats.inactiveCases} Dava`}
              bgColor="bg-gray-500"
            />
          </div>
        </LargeCard>
      </div>
    </div>
  );
};

// Büyük Kart Bileşeni
const LargeCard = ({ icon, title, value, bgColor, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <div className={`flex-shrink-0 ${bgColor} text-white p-6 rounded-full`}>
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-xl text-gray-600">{value}</p>
        </div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

// Mini Kart Bileşeni
const MiniCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center">
      <div className={`flex-shrink-0 ${bgColor} text-white p-4 rounded-full`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;