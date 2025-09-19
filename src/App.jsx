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
import EmployeeOnboarding from "./component/user/onboarding/EmployeeOnboarding";
import PersonalInfo from "./pages/PersonalInfo";
import OnboardingDocuments from "./components/OnboardingDocuments";

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
import VisaStatus from "./pages/VisaStatus";
import ApplicationStatus from './pages/ApplicationStatus';
import ApplicationDetail from "./pages/ApplicationDetail";
import VisaStatusManagementHR from './pages/VisaStatusManagementHR';

// ===== Auth utils / guard =====
import PrivateRoute from "./components/PrivateRoute";
import { getToken, isHR } from "./lib/jwt";

// ===== New state-based guards =====
import {
  RequireRegistered,
  RequireOnboarding,
  AfterLoginLanding,
} from "./routes/guards/RequireState";
import RequireEmployee from './routes/guards/RequireEmployee';
import RequireHR from './routes/guards/RequireHR';


// Optional: you can remove this if not used elsewhere
function AdminPage() {
  return <div>Admin page</div>;
}

// Authenticated layout shell
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root: decide landing page based on role/state */}
        <Route path="/" element={<AfterLoginLanding />} />

        {/* Public auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Public HR demo pages (leave public if you want them visible without auth) */}
        {/* Protected area (must be logged in) */}
        <Route element={<PrivateRoute />}>


          {/* Onboarding-only area */}
          <Route element={<RequireOnboarding />}>
            <Route path="/onboarding" element={<EmployeeOnboarding />} />
          </Route>


          {/* Main app: registered users (and HR) */}
          <Route element={<RequireRegistered />}>

            <Route element={<AppShell />}>
              <Route path="/home" element={<Home />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route element={<RequireHR />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/hr/visa" element={<VisaStatusManagementHR />} />
              <Route path="/house" element={<House />} />
              <Route path="/add-house" element={<AddHouse />} />
              <Route path="/house/:id" element={<ViewHouse />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/employee/:id" element={<EmployeeDetail />} />
              <Route path="/registration-token" element={<RegistrationToken />} />
              <Route path="/application" element={<Application />} />
              <Route path="/application/:awfId" element={<ApplicationDetail />} />
              </Route>
              <Route element={<RequireEmployee />}>
                <Route path="/visa-status" element={<VisaStatus />} />
                <Route path="/application/status" element={<ApplicationStatus />} />
                <Route path="/housing" element={<Housing />} />
              </Route>
            </Route>

          </Route>
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}