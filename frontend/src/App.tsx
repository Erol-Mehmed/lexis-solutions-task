import "./App.scss";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import Footer from "./components/layout/Footer";
import ImportUploader from "./components/ImportUploader";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { useEffect } from "react";
import { useAuthStore } from "./store/auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column">
        <Header />

        <Container className="min-vh-100">
          <main className="py-5">
            <Routes>
              {/* Protected route */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <ImportUploader />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </Container>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
