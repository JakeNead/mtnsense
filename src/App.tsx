import "./App.css";
import Header from "./Header";
import RogersPass from "./routes/RogersPass";
import GrandTeton from "./routes/GrandTeton";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "./components/ui/provider";
import { Box, Center, Container, Flex } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Provider>
        <BrowserRouter>
          <Box>
            <Flex
              flexDir="column"
              align="center"
              padding="0rem 1rem"
              gap="1rem"
            >
              <Header />
              <Routes>
                <Route index element={<RogersPass />} />
                <Route index path="rogerspass" element={<RogersPass />} />
                <Route index path="grandteton" element={<GrandTeton />} />
              </Routes>
            </Flex>
          </Box>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
