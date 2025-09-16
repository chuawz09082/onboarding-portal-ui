import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

// ===== Public / Auth pages =====
import Login from "./pages/Login";
import Register from "./pages/Register";

// ===== Existing HR demo pages (public) =====
import House from "./component/hr/house/House";
import AddHouse from "./component/hr/add-house/AddHouse";
import ViewHouse from "./component/hr/view-house/ViewHouseDetails";

// ===== Protected pages (require login) =====
import EmployeeOnboarding from "./pages/EmployeeOnboarding";
import HROnboarding from "./pages/HROnboarding";
import PersonalInfo from "./pages/PersonalInfo";

// ===== New layout + pages from teammate =====
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import EmployeeDetail from './components/EmployeeDetail';
import MainContent from "./components/MainContent";
import Home from "./pages/Home";
import Employee from "./pages/Employee";
import Application from "./pages/Application";
import Housing from "./pages/Housing";

// ===== Auth utils / guard =====
import PrivateRoute from "./components/PrivateRoute";
import { getToken, isHR } from "./lib/jwt";

// Decides landing page after login based on role
function AfterLoginRouter() {
  const t = getToken();
  if (!t) return <Navigate to="/login" replace />;
  return isHR(t) ? <Navigate to="/hr/onboarding" replace /> : <Navigate to="/onboarding" replace />;
}

// A shell shown on authenticated pages (adds Sidebar/Topbar/MainContent)
function AppShell() {
  return (
    <>
      <Sidebar />
      <Topbar />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
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

        {/* Public auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public HR demo pages */}
        <Route path="/house" element={<House />} />
        <Route path="/add-house" element={<AddHouse />} />
        <Route path="/house/:id" element={<ViewHouse />} />

        {/* Protected area */}
        <Route element={<PrivateRoute />}>
          {/* Everything inside uses the authenticated layout */}
          <Route element={<AppShell />}>
            {/* Existing protected pages */}
            <Route path="/onboarding" element={<EmployeeOnboarding />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/hr/onboarding" element={<HROnboarding />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Teammate’s new pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/application" element={<Application />} />
            <Route path="/housing" element={<Housing />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}