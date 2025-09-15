import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import House from "./component/hr/house/House";
import AddHouse from "./component/hr/add-house/AddHouse";
import ViewHouse from "./component/hr/view-house/ViewHouseDetails";

import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

import EmployeeOnboarding from "./pages/EmployeeOnboarding";
import HROnboarding from "./pages/HROnboarding";
import PersonalInfo from "./pages/PersonalInfo";

import { getToken, isHR } from "./lib/jwt";

// Small router that decides the landing page after login
function AfterLoginRouter() {
  const t = getToken();
  if (!t) return <Navigate to="/login" replace />;
  return isHR(t)
    ? <Navigate to="/hr/onboarding" replace />
    : <Navigate to="/onboarding" replace />;
}

function AdminPage() {
  return <div>Admin page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root decides based on token/role */}
        <Route path="/" element={<AfterLoginRouter />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Some public HR demo pages you had */}
        <Route path="/house" element={<House />} />
        <Route path="/add-house" element={<AddHouse />} />
        <Route path="/house/:id" element={<ViewHouse />} />

        {/* Protected (must be logged in) */}
        <Route element={<PrivateRoute />}>
          {/* Employee */}
          <Route path="/onboarding" element={<EmployeeOnboarding />} />
          <Route path="/personal-info" element={<PersonalInfo />} />

          {/* HR */}
          <Route path="/hr/onboarding" element={<HROnboarding />} />

          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}







































