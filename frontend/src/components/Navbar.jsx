import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutUtil } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loginUser, logoutUser } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Gundam TCG
        </Link>
        <div className="space-x-6 text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/search" className="hover:text-blue-600">Search</Link>
          {user ? (
            <>
              <Link to="/collection" className="hover:text-blue-600">
                My Collection
              </Link>
              <Link to="/account" className="hover:text-blue-600">
                {user}
              </Link>
              <button
                onClick={() => {
                  logoutUtil();
                  logoutUser(); // Update context state
                  navigate("/"); // Go home without page reload
                }}
                className="hover:text-red-600 ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
