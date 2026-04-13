import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/auth-card/AuthCard.tsx";
import { useAuthStore } from "../store/auth.ts";
import { getErrorMessage } from "../utils/errors.ts";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const clearErrorOnChange = () => {
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      await login(username, password);
      setError(null);
      navigate("/");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Register failed"));
    }
  };

  return (
    <AuthCard
      title="Register"
      subtitle="Create your account to get started."
      error={error}
      submitLabel="Register"
      onSubmit={handleSubmit}
      footer={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    >
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => {
          clearErrorOnChange();
          setUsername(e.target.value);
        }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => {
          clearErrorOnChange();
          setEmail(e.target.value);
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          clearErrorOnChange();
          setPassword(e.target.value);
        }}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => {
          clearErrorOnChange();
          setConfirmPassword(e.target.value);
        }}
      />
    </AuthCard>
  );
}
