import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-secondary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Gundam TCG
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-accent">Home</Link>
          <Link to="/search" className="hover:text-accent">Search</Link>
        </div>
      </div>
    </nav>
  );
}
