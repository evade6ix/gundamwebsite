import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-extrabold text-secondary mb-4">
        Gundam TCG Database
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Search, explore, and collect all Gundam TCG cards.
      </p>
      <a
        href="/search"
        className="bg-secondary text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-accent hover:text-black transition"
      >
        Start Searching
      </a>
    </div>
  );
}
