import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

export default function Header() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-primary shadow text-white border-bottom py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <h1 className="m-0 fs-3 text-start">
          <Link to="/" className="text-white text-decoration-none">
            CSV Import
          </Link>
        </h1>

        {!isLoading && (
          <div className="d-flex gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/register" className="btn btn-outline-light btn-sm">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-light btn-sm">
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
