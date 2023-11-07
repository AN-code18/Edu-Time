import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "../src/pages/Home.jsx";
import Header from "./components/common/Header";
import Catalog from "./pages/Catalog";
import About from "./pages/About";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
