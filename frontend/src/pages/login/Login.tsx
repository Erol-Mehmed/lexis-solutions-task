import React, { useState } from "react";
import { useAuthStore } from "../../store/auth.ts";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/errors.ts";
import styles from "./Login.module.scss";

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
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <p className={styles.subtitle}>
          Welcome back! Please sign in to continue.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <input
          className={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => {
            clearErrorOnChange();
            setUsername(e.target.value);
          }}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            clearErrorOnChange();
            setPassword(e.target.value);
          }}
        />

        <button type="submit" className={styles.button}>
          Login
        </button>

        <p className={styles.footerText}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
