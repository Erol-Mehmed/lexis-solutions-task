"use client";

import Container from "./Container";

export default function Header() {
  return (
    <header className="bg-primary shadow text-white border-bottom">
      <Container>
        <h1>CSV Import</h1>
      </Container>
    </header>
  );
}
