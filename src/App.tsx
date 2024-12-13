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
          <Flex minW="100%" minH="100%" justifyContent="center">
            <Flex
              flexDir="column"
              align="center"
              gap="1rem"
              maxW={"1024px"}
              grow="1"
            >
              <Header />
              <Routes>
                <Route index element={<RogersPass />} />
                <Route index path="rogerspass" element={<RogersPass />} />
                <Route index path="grandteton" element={<GrandTeton />} />
              </Routes>
            </Flex>
          </Flex>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
