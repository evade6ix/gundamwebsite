import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Card from "./pages/Card";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import CollectionAdd from "./pages/CollectionAdd";
import DeckBuilder from "./pages/DeckBuilder";
import DeckDetail from "./pages/DeckDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/card/:id" element={<Card />} />
          <Route path="/login" element={<Login />} /> {/* 🟢 Login moved to /login */}
          <Route path="/account" element={<Account />} /> {/* 🟢 Account is now correct */}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/collection/add" element={<CollectionAdd />} />
          <Route path="/decks/new" element={<DeckBuilder />} />
          <Route path="/decks/:deckName" element={<DeckDetail />} />
          <Route path="/decks/edit/:deckName" element={<DeckBuilder />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
