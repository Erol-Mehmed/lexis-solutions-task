import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../utils/errors.ts";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Frontend validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(username, email, password);
      setError(null);
      navigate("/login")
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Register failed"));
    }
  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button type="submit">Register</button>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}
