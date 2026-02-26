import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FormPage } from "./pages/FormPage";
import { ManagementPage } from "./pages/ManagementPage";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./pages/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/formPage" element={<FormPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <ManagementPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;