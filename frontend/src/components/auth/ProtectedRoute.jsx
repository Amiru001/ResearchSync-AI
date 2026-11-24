import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRole,
}) => {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    || "null"
  );


  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ============================================================
  // WRONG ROLE
  // ============================================================

  if (
    allowedRole &&
    user.role !== allowedRole
  ) {

    if (user.role === "student") {

      return (
        <Navigate
          to="/student/dashboard"
          replace
        />
      );

    }

    if (user.role === "supervisor") {

      return (
        <Navigate
          to="/supervisor/dashboard"
          replace
        />
      );

    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return children;
};

export default ProtectedRoute;