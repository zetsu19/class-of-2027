"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Camera,
  Plus,
  Sparkles,
  User,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Member = {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  createdAt: string;
};

export default function ClassMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/class-members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleConfirmEntry = async () => {
    if (!form.name || !file) {
      setToast({ message: "Name and Photo are required!", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error();
      const { url } = await uploadRes.json();

      await fetch("/api/class-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image: url }),
      });

      setToast({
        message: "You're on the wall, Class of '27!",
        type: "success",
      });
      setForm({ name: "", description: "", image: "" });
      setFile(null);
      setPreview(null);
      setShowForm(false);
      fetchMembers();
    } catch {
      setToast({ message: "Upload failed. Try again!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,500;0,700;1,300;1,700&display=swap');

        :root {
          --ink: #0f0e0e;
          --cream: #f0ebe4;
          --blush: #f5e6e0;
          --rose: #e8325a;
          --rose-light: #ff6b8a;
          --gold: #f2c14e;
          --card-shadow: 8px 8px 0px var(--ink);
          --card-shadow-hover: 14px 14px 0px var(--ink);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
        }

        /* Grain overlay */
        .page-root {
          min-height: 100vh;
          position: relative;
          padding: 2.5rem clamp(1.5rem, 5vw, 4rem);
          background-color: var(--cream);
          background-image:
            radial-gradient(ellipse at 10% 0%, rgba(242,193,78,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 100%, rgba(232,50,90,0.12) 0%, transparent 50%);
        }

        .page-root::before {
          content: '';
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 50;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px 128px;
          opacity: 0.5;
        }

        /* ── TOAST ── */
        .toast {
          position: fixed;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.75rem;
          border: 3px solid var(--ink);
          box-shadow: 5px 5px 0 var(--ink);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
          animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .toast-success { background: var(--rose); color: #fff; }
        .toast-error   { background: #c23b5a; color: #fff; }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-24px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }

        /* ── HEADER ── */
        header {
          max-width: 1400px;
          margin: 0 auto 4rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
          }
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          background: var(--ink);
          color: var(--rose);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .display-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(5rem, 14vw, 10rem);
          line-height: 0.85;
          letter-spacing: 0.02em;
          color: var(--ink);
        }

        .display-title .outline {
          -webkit-text-stroke: 2px var(--ink);
          color: transparent;
        }

        /* ── ADD BUTTON ── */
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1.1rem 2.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--rose);
          color: #fff;
          border: 3px solid var(--ink);
          box-shadow: var(--card-shadow);
          cursor: pointer;
          transition: box-shadow 0.15s ease, transform 0.15s ease, background 0.2s;
          align-self: flex-start;
        }
        .add-btn:hover {
          box-shadow: 4px 4px 0 var(--ink);
          transform: translate(4px, 4px);
          background: #c41f44;
        }

        /* ── LAYOUT ── */
        .main-wrap {
          max-width: 1400px;
          margin: 0 auto;
        }

        .content-row {
          display: flex;
          gap: 3rem;
          align-items: flex-start;
          flex-direction: column;
        }

        @media (min-width: 1024px) {
          .content-row { flex-direction: row; }
        }

        /* ── FORM PANEL ── */
        .form-panel {
          width: 100%;
          flex-shrink: 0;
          animation: slideInLeft 0.45s cubic-bezier(0.34,1.3,0.64,1) both;
        }

        @media (min-width: 1024px) {
          .form-panel { width: 400px; }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .form-card {
          background: #fff;
          border: 3px solid var(--ink);
          box-shadow: 10px 10px 0 var(--rose);
          padding: 2rem;
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1.25rem;
          margin-bottom: 1.75rem;
          border-bottom: 3px solid var(--ink);
        }

        .form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.05em;
          color: var(--ink);
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--ink);
          display: flex;
          padding: 0.25rem;
          transition: color 0.2s, transform 0.2s;
        }
        .close-btn:hover { color: var(--rose); transform: rotate(90deg); }

        /* Photo upload area */
        .photo-upload {
          aspect-ratio: 4/3;
          width: 100%;
          background: var(--blush);
          border: 3px dashed var(--ink);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background 0.2s, border-style 0.2s;
          position: relative;
          margin-bottom: 1.5rem;
        }
        .photo-upload:hover { background: #ead9d2; border-style: solid; }
        .photo-upload img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
        }

        .photo-upload-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.5;
        }

        /* Form fields */
        .field-group { margin-bottom: 1.5rem; }

        .field-label {
          display: block;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
          color: var(--ink);
          opacity: 0.5;
        }

        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2.5px solid var(--ink);
          padding: 0.5rem 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--ink);
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input::placeholder { color: var(--ink); opacity: 0.2; }
        .field-input:focus { border-color: var(--rose); }

        textarea.field-input {
          resize: none;
          font-size: 1rem;
          font-weight: 500;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          background: var(--ink);
          color: #fff;
          border: 3px solid var(--ink);
          padding: 1.1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: background 0.2s, color 0.2s;
          margin-top: 1.75rem;
        }
        .submit-btn:hover:not(:disabled) { background: var(--rose); }
        .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* ── GRID ── */
        .members-grid {
          flex: 1;
          display: grid;
          gap: 1.75rem;
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 640px) {
          .members-grid:not(.grid-compact) { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .members-grid:not(.grid-compact) { grid-template-columns: repeat(4, 1fr); }
        }
        @media (min-width: 640px) {
          .members-grid.grid-compact { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── MEMBER CARD ── */
        .member-card {
          background: var(--ink);
          border: 3px solid var(--ink);
          overflow: hidden;
          cursor: default;
          box-shadow: 5px 5px 0 rgba(15,14,14,0.25);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .member-card:hover {
          box-shadow: 10px 10px 0 var(--rose);
          transform: translate(-2px, -2px);
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-img-wrap {
          aspect-ratio: 4/5;
          background: var(--blush);
          position: relative;
          overflow: hidden;
        }
        .card-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: filter 0.6s ease;
        }
        .member-card:hover .card-img-wrap img { filter: grayscale(0%); }

        .card-no-img {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink); opacity: 0.2;
        }

        .card-tag {
          position: absolute;
          bottom: 0.75rem; left: 0.75rem;
          background: var(--gold);
          color: var(--ink);
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border: 2px solid var(--ink);
        }

        .card-body {
          padding: 1rem 1.1rem 1.25rem;
        }

        .card-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.04em;
          color: var(--cream);
          transition: color 0.2s;
          line-height: 1;
          margin-bottom: 0.4rem;
        }
        .member-card:hover .card-name { color: var(--rose-light); }

        .card-desc {
          font-size: 0.72rem;
          font-weight: 300;
          font-style: italic;
          color: rgba(240,235,228,0.5);
          line-height: 1.45;
        }

        /* Empty state */
        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 2rem;
          border: 3px dashed rgba(15,14,14,0.2);
          color: rgba(15,14,14,0.3);
        }
        .empty-state p {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--cream); }
        ::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 0; }
      `}</style>

      <div className="page-root">
        {toast && (
          <div
            className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toast.message}
          </div>
        )}
        <header>
          <div>
            <div className="badge">
              <Sparkles size={12} fill="currentColor" />
              Digital Archive v2.7
            </div>
            <h1 className="display-title">
              CLASS OF <span className="outline">'27</span>
            </h1>
          </div>

          {!showForm && (
            <button className="add-btn" onClick={() => setShowForm(true)}>
              <Plus size={20} strokeWidth={2.5} />
              Add Your Card
            </button>
          )}
        </header>
        <main className="main-wrap">
          <div className="content-row">
            {showForm && (
              <div className="form-panel">
                <div className="form-card">
                  <div className="form-header">
                    <span className="form-title">New Profile</span>
                    <button
                      className="close-btn"
                      onClick={() => setShowForm(false)}
                    >
                      <X size={26} strokeWidth={2.5} />
                    </button>
                  </div>
                  <div
                    className="photo-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" />
                    ) : (
                      <>
                        <Camera size={40} style={{ opacity: 0.35 }} />
                        <span className="photo-upload-label">
                          Click to upload photo
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Full Name</label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Bio / Legacy</label>
                    <textarea
                      className="field-input"
                      rows={2}
                      placeholder="What defines you?"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <button
                    className="submit-btn"
                    onClick={handleConfirmEntry}
                    disabled={loading}
                  >
                    {loading ? (
                      "Processing…"
                    ) : (
                      <>
                        <span>Save Entry</span> <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            <div className={`members-grid ${showForm ? "grid-compact" : ""}`}>
              {members.length === 0 ? (
                <div className="empty-state">
                  <User size={48} strokeWidth={1} />
                  <p>No members yet — be the first</p>
                </div>
              ) : (
                members.map((m, i) => (
                  <div
                    key={m.id}
                    className="member-card"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="card-img-wrap">
                      {m.image ? (
                        <img src={m.image} alt={m.name} />
                      ) : (
                        <div className="card-no-img">
                          <User size={64} strokeWidth={1} />
                        </div>
                      )}
                      <span className="card-tag">Class of '27</span>
                    </div>
                    <div className="card-body">
                      <p className="card-name">{m.name}</p>
                      <p className="card-desc">
                        "{m.description || "The future is ours."}"
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
