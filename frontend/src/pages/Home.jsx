import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Hero Section */}
      <header className="w-full text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Gundam TCG Database
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Search, explore, and collect all Gundam TCG cards in one place.
        </p>

        {/* Showcase Cards */}
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <img
            src="https://images.yourgundamapi.com/cards/sample1.jpg"
            alt="Gundam Card 1"
            className="w-40 md:w-48 rounded-lg shadow hover:scale-105 transition"
          />
          <img
            src="https://images.yourgundamapi.com/cards/sample2.jpg"
            alt="Gundam Card 2"
            className="w-40 md:w-48 rounded-lg shadow hover:scale-105 transition"
          />
          <img
            src="https://images.yourgundamapi.com/cards/sample3.jpg"
            alt="Gundam Card 3"
            className="w-40 md:w-48 rounded-lg shadow hover:scale-105 transition"
          />
        </div>

        {/* Call to Action Button */}
        <Link
          to="/search"
          className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow hover:bg-teal-700 transition duration-300"
        >
          Start Searching
        </Link>
      </header>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400 border-t">
        &copy; {new Date().getFullYear()} Gundam TCG. All rights reserved.
      </footer>
    </div>
  );
}
