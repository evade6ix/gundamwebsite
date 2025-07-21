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
import Collection from "./pages/Collection"; // 🟢 New
import CollectionView from "./pages/CollectionView"; // 🟢 New
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
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/collection" element={<Collection />} /> {/* 🟢 User Collection */}
          <Route path="/collection/view/:shareId" element={<CollectionView />} /> {/* 🟢 Shared View */}
          <Route path="/collection/add" element={<CollectionAdd />} />
          <Route path="/decks/new" element={<DeckBuilder />} />
          <Route path="/decks/:deckName" element={<DeckDetail />} />
          <Route path="/decks/edit/:deckName" element={<DeckBuilder />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
