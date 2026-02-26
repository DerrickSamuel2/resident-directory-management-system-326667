import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";

import { ResidentsListPage } from "./pages/ResidentsListPage";
import { ResidentDetailPage } from "./pages/ResidentDetailPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminResidentsPage } from "./pages/AdminResidentsPage";
import { AdminResidentCreatePage } from "./pages/AdminResidentCreatePage";
import { AdminResidentEditPage } from "./pages/AdminResidentEditPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// PUBLIC_INTERFACE
function App() {
  /** Root application with routing + auth provider. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ResidentsListPage />} />
            <Route path="/residents/:id" element={<ResidentDetailPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              path="/admin/residents"
              element={
                <RequireAuth>
                  <AdminResidentsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/residents/new"
              element={
                <RequireAuth>
                  <AdminResidentCreatePage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/residents/:id/edit"
              element={
                <RequireAuth>
                  <AdminResidentEditPage />
                </RequireAuth>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
