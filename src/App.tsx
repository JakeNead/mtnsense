import { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import RogersPass from "./RogersPass";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route index element={<RogersPass />} />
          <Route index path="/rogerspass" element={<RogersPass />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
