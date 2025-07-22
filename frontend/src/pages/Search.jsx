import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Search() {
  const [cards, setCards] = useState([]);
  const [filters, setFilters] = useState({ sets: [], types: [], rarities: [] });
  const [selectedFilters, setSelectedFilters] = useState({
    sets: [],
    types: [],
    rarities: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [pagination, setPagination] = useState({
    current: page,
    totalPages: 1,
  });

  // 🟢 Fetch filters on first load
  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/filters`);
        const data = await res.json();
        setFilters(data);
      } catch (err) {
        console.error("Failed to fetch filters:", err);
      }
    }
    fetchFilters();
  }, []);

  useEffect(() => {
  fetchCards(1);
}, [query, selectedFilters]);


  async function fetchCards(pageNumber = 1) {
    setLoading(true);

    const params = new URLSearchParams();
    if (query) params.append("name", query);
    params.append("page", pageNumber);
    params.append("limit", 30);

    if (selectedFilters.sets.length) params.append("set", selectedFilters.sets.join(","));
    if (selectedFilters.types.length) params.append("type", selectedFilters.types.join(","));
    if (selectedFilters.rarities.length) params.append("rarity", selectedFilters.rarities.join(","));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cards?${params.toString()}`);
      const data = await res.json();
      setCards(data.cards || []);
      setPagination({
        current: data.page,
        totalPages: data.totalPages,
      });
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    const value = e.target.search.value.trim();
    if (value) setSearchParams({ q: value, page: 1 });
  }

  function changePage(newPage) {
    setSearchParams({ q: query, page: newPage });
  }

  function toggleFilter(category, value) {
  setSelectedFilters((prev) => {
    const updated = { ...prev };
    if (updated[category].includes(value)) {
      updated[category] = updated[category].filter((v) => v !== value);
    } else {
      updated[category] = [...updated[category], value];
    }
    return updated;
  });
  setSearchParams({ q: query, page: 1 });
}


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Filters */}
<aside className="w-72 bg-white p-4 border-r hidden md:block">
  <h2 className="text-xl font-bold mb-4">Filters</h2>

  {/* Helper Component for filter groups */}
  {["sets", "types", "rarities"].map((category) => (
    <div key={category} className="mb-6">
      <h3 className="font-semibold mb-2 capitalize">{category}</h3>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {filters[category].map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-100 cursor-pointer transition"
          >
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={selectedFilters[category].includes(option)}
              onChange={() => toggleFilter(category, option)}
            />
            <span className="text-gray-800">{option}</span>
          </label>
        ))}
      </div>
    </div>
  ))}
</aside>


      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <form
          onSubmit={handleSearch}
          className="flex justify-center mb-8 gap-2"
        >
          <input
            type="text"
            name="search"
            placeholder="Search for a card"
            defaultValue={query}
            className="w-full p-3 rounded-l border border-gray-300 outline-none text-gray-900 bg-white"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center text-lg text-gray-600">Loading cards...</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {cards.map((card) => (
            <Link
              key={card.id}
              to={`/card/${card.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <img
                src={card.image_url}
                alt={card.name}
                className="rounded-t-lg w-full h-60 object-contain p-2"
                loading="lazy"
              />
              <div className="p-3">
                <h2 className="font-semibold text-gray-800">{card.name}</h2>
                <p className="text-sm text-gray-500">
                  {card.rarity} • {card.color}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => changePage(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          ).map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`px-4 py-2 rounded ${
                p === pagination.current
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 text-blue-700"
              } hover:bg-blue-600 hover:text-white transition`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => changePage(pagination.current + 1)}
            disabled={pagination.current === pagination.totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
