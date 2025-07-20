import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Card from "./pages/Card";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/search">Search</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/card/:id" element={<Card />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
