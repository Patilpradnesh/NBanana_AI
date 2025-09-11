import React from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { GenerateImg } from "./pages/GenerateImg";
import { GenerateAnimation } from "./pages/GenerateAnimation";
import { CartoonStory } from "./pages/CartoonStory";
import { GenerateAD } from "./pages/GenerateAD";
import { TransformPhoto } from "./pages/TransformPhoto";
import Error from "./pages/Error";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cartoon-studio" element={<CartoonStory />} />
          <Route path="/ad-maker" element={<GenerateAD />} />
          <Route path="/time-travel" element={<TransformPhoto />} />
          <Route path="/generate-image" element={<GenerateImg />} />
          <Route path="/generate-animation" element={<GenerateAnimation />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
