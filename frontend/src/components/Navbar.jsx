import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-900 tracking-tight"
        >
          Gundam TCG
        </Link>
        <div className="space-x-8 text-lg">
          <Link
            to="/"
            className="text-gray-700 hover:text-teal-600 transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            to="/search"
            className="text-gray-700 hover:text-teal-600 transition-colors duration-300"
          >
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
}
