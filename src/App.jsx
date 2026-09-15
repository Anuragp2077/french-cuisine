import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import History from "./pages/History";
import Regions from "./pages/Regions";
import Dishes from "./pages/Dishes";
import Cooking from "./pages/Cooking";
import Pastries from "./pages/Pastries";
import Vocabulary from "./pages/Vocabulary";

import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="app">
          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/regions" element={<Regions />} />
              <Route path="/dishes" element={<Dishes />} />
              <Route path="/cooking" element={<Cooking />} />
              <Route path="/pastries" element={<Pastries />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
            </Routes>
          </main>
        </div>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;