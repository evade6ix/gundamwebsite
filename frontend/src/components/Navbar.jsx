import { Link } from "react-router-dom";
import { getUserName, logout } from "../utils/auth";

export default function Navbar() {
  const userName = getUserName();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Gundam TCG
        </Link>
        <div className="space-x-6 text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/search" className="hover:text-blue-600">Search</Link>
          {userName ? (
            <>
              <Link to="/account" className="hover:text-blue-600">
                {userName}
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/"; // Force refresh to clear state
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
