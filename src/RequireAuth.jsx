import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // ⏳ Wait until /user/me finishes
  if (loading) return null; // or a spinner

  // ❌ Not logged in
  if (!isAuthenticated) {
    // console.log("Not authenticated, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return children;
};

export default RequireAuth;
