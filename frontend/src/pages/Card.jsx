import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Card() {
  const { id } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/card/${id}`);
        const data = await res.json();
        setCard(data);
      } catch (err) {
        console.error("Failed to fetch card:", err);
      }
    }
    fetchCard();
  }, [id]);

  if (!card) {
    return <div className="text-center mt-10 text-lg text-gray-500">Loading card...</div>;
  }

  const {
    name,
    rarity,
    color,
    cardType,
    effect,
    ap,
    hp,
    sourceTitle,
    set,
    images,
    cost,
    level,
    zone,
    trait,
    link
  } = card;

  return (
    <div className="container mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-lg p-6">
        {/* Card Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          {images?.large ? (
            <img
              src={images.large}
              alt={name}
              className="rounded-lg shadow max-h-[500px]"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        {/* Card Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{name}</h1>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-700">
            <p><span className="font-semibold">Rarity:</span> {rarity || "N/A"}</p>
            <p><span className="font-semibold">Color:</span> {color || "N/A"}</p>
            <p><span className="font-semibold">Type:</span> {cardType || "N/A"}</p>
            <p><span className="font-semibold">Cost:</span> {cost || "N/A"}</p>
            <p><span className="font-semibold">Level:</span> {level || "N/A"}</p>
            <p><span className="font-semibold">AP:</span> {ap || "N/A"}</p>
            <p><span className="font-semibold">HP:</span> {hp || "N/A"}</p>
            <p><span className="font-semibold">Zone:</span> {zone || "N/A"}</p>
            <p><span className="font-semibold">Trait:</span> {trait || "N/A"}</p>
            <p><span className="font-semibold">Link:</span> {link || "N/A"}</p>
            <p><span className="font-semibold">Set:</span> {set?.name || "N/A"}</p>
            <p><span className="font-semibold">Source:</span> {sourceTitle || "N/A"}</p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Card Text</h2>
            <p className="bg-gray-50 p-4 rounded-lg text-gray-800">
              {effect ? (
                <span dangerouslySetInnerHTML={{ __html: effect }} />
              ) : (
                "No description available."
              )}
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="inline-block mt-8 px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
          >
            Back to Search
          </button>

        </div>
      </div>
    </div>
  );
}
