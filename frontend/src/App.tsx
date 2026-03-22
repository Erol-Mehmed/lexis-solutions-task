import "./App.scss";
import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import Footer from "./components/layout/Footer";
import ImportUploader from "./components/ImportUploader.tsx";

function App() {
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
