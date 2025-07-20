import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">
        Welcome to <span className="text-accent">Gundam TCG</span>
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Search, browse, and explore all Gundam TCG cards. Built for collectors and players.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/search"
          className="bg-secondary text-white px-6 py-3 rounded hover:bg-accent transition"
        >
          🔎 Search Cards
        </Link>
        <Link
          to="/"
          className="bg-accent text-black px-6 py-3 rounded hover:bg-secondary hover:text-white transition"
        >
          🏠 Learn More
        </Link>
      </div>
    </div>
  );
}
