import "./App.css";
import Header from "./Header";
import RogersPass from "./routes/RogersPass";
import GrandTeton from "./routes/GrandTeton";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "./components/ui/provider";

function App() {
  return (
    <>
      <Provider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route index element={<RogersPass />} />
            <Route index path="/rogerspass" element={<RogersPass />} />
            <Route index path="/grandteton" element={<GrandTeton />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
