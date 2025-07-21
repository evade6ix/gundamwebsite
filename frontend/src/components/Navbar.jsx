import { Link } from "react-router-dom";

export default function Navbar() {
  const userName = localStorage.getItem("userName");

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Gundam TCG
        </Link>
        <div className="space-x-6 text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/search" className="hover:text-blue-600">Search</Link>

          {/* 🟢 Show user's name if logged in */}
          {userName ? (
            <Link to="/account" className="hover:text-blue-600 font-semibold">
              {userName.split(" ")[0]} {/* Show first name only */}
            </Link>
          ) : (
            <Link to="/account" className="hover:text-blue-600">Account</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
