import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import House from './component/hr/house/House';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonalInfo from './pages/PersonalInfo';
import Onboarding from './pages/Onboarding';
import PrivateRoute from './components/PrivateRoute';
import './App.css';


function AdminPage() { return <div>Admin page</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/house' element={<House />} />

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
