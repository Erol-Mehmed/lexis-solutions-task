import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/auth-card/AuthCard.tsx";
import { useAuthStore } from "../store/auth.ts";
import { getErrorMessage } from "../utils/errors.ts";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const clearErrorOnChange = () => {
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await login(username, password);
      setError(null);
      navigate("/");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Login failed"));
    }
  };

  return (
    <AuthCard
      title="Login"
      subtitle="Welcome back! Please sign in to continue."
      error={error}
      submitLabel="Login"
      onSubmit={handleSubmit}
      footer={
        <>
          Don&apos;t have an account? <Link to="/register">Register</Link>
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
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          clearErrorOnChange();
          setPassword(e.target.value);
        }}
      />
    </AuthCard>
  );
}
