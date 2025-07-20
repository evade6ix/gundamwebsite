import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Card from "./pages/Card";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/card/:id" element={<Card />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
