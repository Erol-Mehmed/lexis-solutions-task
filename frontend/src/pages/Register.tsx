import { useState } from "react";
import { useAuthStore } from "../store/auth";

export default function Register() {
  const register = useAuthStore((s) => s.register);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(username, password);
      alert("User created");

      window.location.href = "/login";
    } catch {
      alert("Register failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}
