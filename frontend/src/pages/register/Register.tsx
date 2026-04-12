import React, { useState } from "react";
import { useAuthStore } from "../../store/auth.ts";
import { useNavigate, Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/errors.ts";
import styles from "./Register.module.scss";

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
    <div className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>Register</h2>

        <p className={styles.subtitle}>Create your account to get started.</p>

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
          placeholder="Email"
          value={email}
          onChange={(e) => {
            clearErrorOnChange();
            setEmail(e.target.value);
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

        <input
          className={styles.input}
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => {
            clearErrorOnChange();
            setConfirmPassword(e.target.value);
          }}
        />

        <button type="submit" className={styles.button}>
          Register
        </button>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
