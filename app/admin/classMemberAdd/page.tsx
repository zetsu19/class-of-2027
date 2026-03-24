"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldAlert, Sparkles, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [input, setInput] = useState({ username: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (input.username === "admin" && input.password === "1234") {
      setError(false);
      router.push("/admin/memberAdd");
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="login-viewport">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,500;0,700;1,300;1,700&display=swap');

        :root {
          --ink: #0f0e0e;
          --cream: #f0ebe4;
          --blush: #f5e6e0;
          --rose: #e8325a;
          --gold: #f2c14e;
        }

        .login-viewport {
          min-height: 100vh;
          background-color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          background-image:
            radial-gradient(ellipse at 10% 0%, rgba(242,193,78,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 100%, rgba(232,50,90,0.12) 0%, transparent 50%);
        }

        /* Grainy Texture Overlay exactly like main page */
        .login-viewport::before {
          content: '';
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        .login-card {
          position: relative;
          z-index: 2;
          background: white;
          border: 4px solid var(--ink);
          padding: 3.5rem 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 15px 15px 0px var(--ink); /* Matches your member-card shadow style */
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 5rem;
          line-height: 0.85;
          color: var(--ink);
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }

        .badge {
          display: inline-flex;
          items-center: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: var(--ink);
          color: var(--rose);
          font-weight: 800;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 1rem;
        }

        .field-input {
          width: 100%;
          border: none;
          border-bottom: 3px solid var(--ink);
          padding: 1rem 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          outline: none;
          margin-bottom: 1rem;
          background: transparent;
          transition: all 0.2s;
        }

        .field-input:focus {
          border-bottom-color: var(--rose);
          padding-left: 10px;
        }

        .error-box {
          background: var(--rose);
          color: white;
          padding: 0.75rem;
          border: 3px solid var(--ink);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 4px 4px 0 var(--ink);
        }

        .submit-btn {
          width: 100%;
          background: var(--ink);
          color: white;
          padding: 1.2rem;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.15s ease;
          box-shadow: 6px 6px 0 var(--rose);
        }

        .submit-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0 var(--rose);
          background: var(--rose);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div className="login-card">
        <div className="login-header">
          <div className="badge">
            <Sparkles size={12} fill="currentColor" /> System Auth
          </div>
          <h1 className="login-title">
            RESTRICTED
            <br />
            <span
              style={{
                WebkitTextStroke: "1.5px var(--ink)",
                color: "transparent",
              }}
            >
              ACCESS
            </span>
          </h1>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="USERNAME"
            className="field-input"
            value={input.username}
            required
            onChange={(e) => setInput({ ...input, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="PASSWORD"
            className="field-input"
            value={input.password}
            required
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />

          {error && (
            <div className="error-box">
              <ShieldAlert size={18} />
              Invalid Credentials
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Unlock Archive <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
