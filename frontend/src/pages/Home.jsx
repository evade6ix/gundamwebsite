import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="w-full text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Gundam TCG Hub
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Build decks, share collections, and explore all Gundam TCG cards in one place.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
          {/* My Profile */}
          <Link
            to="/account"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out p-4 block"
          >
            <img
              src="/images/one.PNG" // ✅ Profile Page
              alt="My Profile"
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-teal-600">
              My Profile
            </h2>
            <p className="text-gray-600">
              View all your saved decks and manage them easily.
            </p>
          </Link>

          {/* Collection Builder */}
          <Link
            to="/collection"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out p-4 block"
          >
            <img
              src="/images/three.PNG" // ✅ Collection Page
              alt="Collection Builder"
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-teal-600">
              Collection Builder
            </h2>
            <p className="text-gray-600">
              Search and track every Gundam TCG card you own. Build your dream collection with ease.
            </p>
          </Link>

          {/* Deck Builder */}
          <Link
            to="/decks/new"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out p-4 block"
          >
            <img
              src="/images/five.PNG" // ✅ Deck Editor
              alt="Deck Builder"
              className="w-full rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-teal-600">
              Deck Builder
            </h2>
            <p className="text-gray-600">
              Design powerful decks, save them online, and edit anytime.
            </p>
          </Link>
        </div>
      </header>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-400 border-t">
        &copy; {new Date().getFullYear()} Karl @ Game 3 INC. All rights reserved.
      </footer>
    </div>
  );
}
