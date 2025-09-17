import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

// ===== Public / Auth pages =====
import Login from "./pages/Login";
import Register from "./pages/Register";

// ===== Existing HR demo pages (public) =====
import AddHouse from "./component/hr/add-house/AddHouse";
import House from "./component/hr/house/House";
import ViewHouse from "./component/hr/view-house/ViewHouseDetails";

// ===== Protected pages (require login) =====
import EmployeeOnboarding from "./pages/EmployeeOnboarding";
import PersonalInfo from "./pages/PersonalInfo";

// ===== New layout + pages from teammate =====
import Housing from "./component/user/Housing/Housing";
import EmployeeDetail from "./components/EmployeeDetail";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Application from "./pages/Application";
import Employee from "./pages/Employee";
import Home from "./pages/Home";
import RegistrationToken from "./pages/RegistrationToken";

// ===== Auth utils / guard =====
import PrivateRoute from "./components/PrivateRoute";
import { getToken, isHR } from "./lib/jwt";

import VisaStatus from "./pages/VisaStatus";

// Decides landing page after login based on role
function AfterLoginRouter() {
  const t = getToken();
  if (!t) return <Navigate to="/login" replace />;
  return isHR(t) ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/onboarding" replace />
  );
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
          <Route path="/onboarding" element={<EmployeeOnboarding />} />
          <Route element={<AppShell />}>
            {/* Existing protected pages */}
            
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/housing" element={<Housing />} />

            {/* Teammate’s new pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/registration-token" element={<RegistrationToken />} />
            <Route path="/application" element={<Application />} />

            {/* New Visa Status page */}
          <Route path="/visa-status" element={<VisaStatus />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
