import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./pages/dashboard/Dashboard";
import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/signUp";
import FileManagement from "./pages/dashboard/FileManagement";
import UserManagement from "./pages/dashboard/UserManagement";
import NotFound from "./components/NotFound";
import { initializeSocketListeners } from "./socket/socketEvents";
import { useEffect } from "react";
import AllNotifications from "./pages/dashboard/AllNotifications";
import { toast } from "react-toastify";

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

const RoleGuard = ({ allowedRoles }) => {
  const role = useSelector((state) => state.auth.user?.role);
  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/dashboard/file-management" replace />;
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      initializeSocketListeners(dispatch, user, toast);
    }
  }, [dispatch, user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/file-management" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route element={<Dashboard />}>

            <Route index element={<Navigate to="file-management" replace />} />
            <Route path="file-management" element={<FileManagement />} />

            <Route element={<RoleGuard allowedRoles={["admin"]} />}>
              <Route path="user-management" element={<UserManagement />} />
            </Route>

              <Route path="view-all-notifications" element={<AllNotifications />} />

          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
