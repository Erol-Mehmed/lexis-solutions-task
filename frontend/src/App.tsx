import "./App.scss";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import Footer from "./components/layout/Footer";
import ImportUploader from "./components/ImportUploader.tsx";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.ts";

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    void (async () => {
      try {
        await fetchMe();
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    })();
  }, [fetchMe]);

  return (
    <div className="d-flex flex-column">
      <Header />

      <Container className="min-vh-100">
        <main className="py-5">
          <ImportUploader />
        </main>
      </Container>

      <Footer />
    </div>
  );
}

export default App;
