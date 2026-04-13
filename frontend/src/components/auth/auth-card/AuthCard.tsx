import React from "react";
import styles from "./AuthCard.module.scss";

type AuthCardProps = {
  title: string;
  subtitle: string;
  error?: string | null;
  submitLabel: string;
  footer: React.ReactNode;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  error,
  submitLabel,
  footer,
  onSubmit,
  children,
}: AuthCardProps) {
  return (
    <div className={styles.page}>
      <form onSubmit={onSubmit} className={styles.card}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.fields}>{children}</div>

        <button type="submit" className={styles.button}>
          {submitLabel}
        </button>

        <p className={styles.footerText}>{footer}</p>
      </form>
    </div>
  );
}
