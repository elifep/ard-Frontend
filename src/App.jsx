import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import DataArchiveTable from "./pages/ExistingDataArchive";
import CaseTable from "./pages/CaseTracking";
import RequestTable from "./pages/Basvurular";
import BasvuruEkle from "./pages/BasvuruEkle";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./components/AdminDashboard";
import AdminSettings from "./components/Bar/AdminSettings";

import LawyerDashboard from "./pages/LawyerPage";
import LawyerApplications from "./components/Lawyer/LawyerApplications";
import LawyerCases from "./components/Lawyer/LawyerCases";
import LawyerSettings from "./components/Lawyer/LawyerSettings";

import AppLayout from "./components/Bar/AppLayout";
import LawyerLayout from "./components/Bar/LawyerLayout";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/ForbiddenPage";

const AuthLayout = ({ children }) => (
  <div className="min-h-screen">{children}</div>
);

function App() {
  return (
    <>
      <Routes>
        {/* Auth rotaları (Sidebar ve Header olmadan) */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <Home />
            </AuthLayout>
          }
        />
        <Route
          path="/admin-login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        {/* App rotaları (Sidebar ve Header ile) */}
        <Route
          path="/ExistingDataArchive"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <DataArchiveTable />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/CaseTracking"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <CaseTable />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Basvurular"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <RequestTable />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/basvuru-ekle"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <BasvuruEkle />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <AdminPanel />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-settings"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AppLayout>
                <AdminSettings />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "lawyer"]}>
              <LawyerLayout>
                <LawyerDashboard />
              </LawyerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer-applications"
          element={
            <PrivateRoute allowedRoles={["admin", "lawyer"]}>
              <LawyerLayout>
                <LawyerApplications />
              </LawyerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer-cases"
          element={
            <PrivateRoute allowedRoles={["admin", "lawyer"]}>
              <LawyerLayout>
                <LawyerCases />
              </LawyerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lawyer-settings"
          element={
            <PrivateRoute allowedRoles={["admin", "lawyer"]}>
              <LawyerLayout>
                <LawyerSettings />
              </LawyerLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} /> {/* 404 sayfası */}
        <Route path="/forbidden" element={<Forbidden />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;