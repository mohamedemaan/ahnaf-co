import { Navigate } from "react-router-dom";

function AdminProtected({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (
    user?.email !== "mohamedemaan.a@gmail.com"
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminProtected;