import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import House from "./component/hr/house/House";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AddHouse from "./component/hr/add-house/AddHouse";
import ViewHouse from "./component/hr/view-house/ViewHouseDetails";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import PersonalInfo from "./pages/PersonalInfo";
import Register from "./pages/Register";

function AdminPage() {
  return <div>Admin page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/house" element={<House />} />
        <Route path="/add-house" element={<AddHouse />} />
        <Route path="/house/:id" element={<ViewHouse />} />
        {/* Protected (everything inside requires login) */}
        <Route element={<PrivateRoute />}>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
