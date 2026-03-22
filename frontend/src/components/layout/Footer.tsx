import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-top bg-dark shadow text-white">
      <Container>
        <div className="py-4 text-center small">
          &copy; {new Date().getFullYear()} Lexis Solutions. All rights
          reserved.
        </div>
      </Container>
    </footer>
  );
}
