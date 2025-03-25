import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { StockProvider } from "./context/StockContext";
import { MantineProvider, Container, Center, Title, Text, Stack } from "@mantine/core";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductsPage";
import StockPage from "./pages/StockPage";
import SuppliersPage from "./pages/SuppliersPage";

const HomePage = () => (
  <Container size="md">
    <Center style={{ height: "100vh" }}>
      <Stack align="center">
        <Title order={1} color="blue">Welcome to Inventory System</Title>
        <Text size="lg" color="gray">
          Manage your products, stock levels, and suppliers easily.
        </Text>
      </Stack>
    </Center>
  </Container>
);

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AuthProvider>
        <ProductProvider>
          <StockProvider>
            <Router>
              <Navbar />
              <Container className = "container">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/stock" element={<StockPage />} />
                  <Route path="/suppliers" element={<SuppliersPage />} />
                </Routes>
              </Container>
            </Router>
          </StockProvider>
        </ProductProvider>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;