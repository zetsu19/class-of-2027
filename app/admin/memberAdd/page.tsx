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
  Loader2,
  MoreVertical,
  Edit3,
  Trash2,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Member = {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  gender?: "MALE" | "FEMALE";
  createdAt: string;
  role?: "TEACHER" | "STUDENT";
  instagram?: string;
};

export default function ClassMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    gender: "",
    role: "",
    instagram: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      setFetching(true);
      const res = await fetch("/api/class-members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setFetching(false), 600);
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
    if (!form.name || (!editingId && !file)) {
      setToast({ message: "Name and Photo are required!", type: "error" });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = form.image;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      let instaUrl = form.instagram.trim();
      if (instaUrl && !instaUrl.startsWith("http")) {
        instaUrl = `https://instagram.com/${instaUrl.replace("@", "")}`;
      }

      const payload = {
        ...form,
        image: imageUrl,
        instagram: instaUrl || undefined,
        gender: form.gender || undefined,
        role: form.role || undefined,
      };

      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId
        ? `/api/class-members/${editingId}`
        : "/api/class-members";

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setToast({
        message: editingId ? "Updated!" : "Welcome to the wall!",
        type: "success",
      });
      setShowForm(false);
      setEditingId(null);
      fetchMembers();
    } catch (err) {
      setToast({ message: "Save failed!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/class-members/${id}`, {
        method: "DELETE",
      });

      setMembers((prev) => prev.filter((m) => m.id !== id));

      setToast({ message: "Deleted successfully", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const handleEdit = (member: Member) => {
    setForm({
      name: member.name || "",
      description: member.description || "",
      image: member.image || "",
      gender: member.gender || "",
      role: member.role || "",
      instagram: member.instagram || "",
    });

    setPreview(member.image || null);
    setShowForm(true);
    setSelectedMember(null);

    setEditingId(member.id);
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
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background-color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
        }

        .page-root {
          min-height: 100vh;
          position: relative;
          padding: 2.5rem clamp(1.5rem, 5vw, 4rem);
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
          opacity: 0.5;
        }

        /* ── LOADING SKELETON ── */
        .skeleton-card {
          aspect-ratio: 4/6;
          background: white;
          border: 3px solid var(--ink);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-img {
          flex: 1;
          background: var(--blush);
          border: 2px solid var(--ink);
        }

        .skeleton-text {
          height: 20px;
          background: var(--ink);
          opacity: 0.1;
          width: 80%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.98); }
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
          font-weight: 700;
          text-transform: uppercase;
          background: var(--rose);
          color: #fff;
          animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-24px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
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
          header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
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

        /* ── BUTTONS ── */
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 1.1rem 2.2rem;
          font-weight: 700;
          text-transform: uppercase;
          background: var(--rose);
          color: #fff;
          border: 3px solid var(--ink);
          box-shadow: var(--card-shadow);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .add-btn:hover {
          box-shadow: 4px 4px 0 var(--ink);
          transform: translate(4px, 4px);
        }

        /* ── GRID ── */
        .members-grid {
          flex: 1;
          display: grid;
          gap: 1.75rem;
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 768px) {
          .members-grid:not(.grid-compact) { grid-template-columns: repeat(3, 1fr); }
          .members-grid.grid-compact { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1280px) {
          .members-grid:not(.grid-compact) { grid-template-columns: repeat(4, 1fr); }
        }

        .member-card {
          background: var(--ink);
          border: 3px solid var(--ink);
          overflow: hidden;
          box-shadow: 5px 5px 0 rgba(15,14,14,0.1);
          transition: all 0.3s ease;
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .member-card:hover {
          box-shadow: 10px 10px 0 var(--rose);
          transform: translate(-4px, -4px);
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-img-wrap { aspect-ratio: 4/5; background: var(--blush); position: relative; overflow: hidden; }
        .card-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .member-card:hover .card-img-wrap img { filter: grayscale(0%); transform: scale(1.05); }

        .card-body { padding: 1.25rem; }
        .card-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.75rem; color: var(--cream); margin-bottom: 0.25rem; }
        .card-desc { font-size: 0.75rem; color: rgba(240,235,228,0.6); font-style: italic; }

        /* Form Side Styling */
        .form-panel { width: 100%; max-width: 400px; flex-shrink: 0; animation: slideIn 0.4s ease-out; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        
        .form-card { background: white; border: 3px solid var(--ink); padding: 2rem; box-shadow: 10px 10px 0 var(--rose); }
        .field-input { width: 100%; border: none; border-bottom: 3px solid var(--ink); padding: 0.75rem 0; font-family: inherit; font-weight: 700; outline: none; margin-bottom: 1.5rem; }
        .submit-btn { width: 100%; background: var(--ink); color: white; padding: 1rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5); /* dark semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: var(--cream);
  padding: 2rem;
  border: 3px solid var(--ink);
  max-width: 500px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 10px 10px 0 var(--ink);
}

.modal-card img {
  max-width: 100%;
  max-height: 70vh; /* so it doesn't overflow the screen */
  object-fit: cover;
  margin-bottom: 1rem;
}

.modal-card h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.modal-card p {
  font-size: 0.9rem;
  color: rgba(15,14,14,0.7);
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
}
/* ── BRUTALIST DROPDOWN OVERRIDES ── */
[data-radix-popper-content-wrapper] {
  z-index: 150 !important;
}

.brutalist-menu-content {
  background: var(--cream) !important;
  border: 3px solid var(--ink) !important;
  border-radius: 0 !important;
  box-shadow: 5px 5px 0 var(--ink) !important;
  min-width: 140px !important;
  padding: 0 !important;
  overflow: hidden;
}

.brutalist-menu-item {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.2rem;
  padding: 0.75rem 1rem !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  transition: all 0.1s ease;
  color: var(--ink);
  border-bottom: 2px solid var(--ink);
}

.brutalist-menu-item:last-child {
  border-bottom: none;
}

.brutalist-menu-item:hover, 
.brutalist-menu-item:focus {
  background: var(--rose) !important;
  color: white !important;
  outline: none;
}

.brutalist-trigger {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--gold) !important;
  border: 2px solid var(--ink) !important;
  border-radius: 0 !important;
  height: 32px !important;
  width: 32px !important;
  padding: 0 !important;
  box-shadow: 3px 3px 0 var(--ink);
  transition: all 0.1s;
}

.brutalist-trigger:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--ink);
}
  .ig-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  z-index: 40;
  background: var(--ink);
  color: white;
  padding: 6px;
  border: 2px solid var(--ink);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ig-btn:hover {
  background: var(--rose);
  transform: scale(1.1) rotate(-5deg);
  border-color: var(--ink);
}

      `}</style>

      <div className="page-root">
        {fetching && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--cream)]"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-[var(--ink)]" size={48} />
              <span className="text-[var(--ink)] font-bold uppercase tracking-widest opacity-70">
                Loading
              </span>
            </div>
          </div>
        )}
        {toast && (
          <div
            className={`toast ${toast.type === "error" ? "bg-red-600" : ""}`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toast.message}
          </div>
        )}
        {selectedMember && (
          <div className="modal-bg" onClick={() => setSelectedMember(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={() => setSelectedMember(null)}
              >
                <X size={24} />
              </button>

              {selectedMember.image ? (
                <img src={selectedMember.image} alt={selectedMember.name} />
              ) : (
                <User size={100} />
              )}
              <h2>{selectedMember.name}</h2>
              <p>{selectedMember.description || "Living the dream."}</p>
            </div>
          </div>
        )}
        <header>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-[#e8325a] font-bold text-[10px] uppercase tracking-widest mb-4">
              <Sparkles size={12} fill="currentColor" /> Archive v2.7
            </div>
            <h1 className="display-title">
              CLASS OF <span className="outline">'27</span>
            </h1>
          </div>

          {!showForm && (
            <button className="add-btn" onClick={() => setShowForm(true)}>
              <Plus size={20} /> Add Your Card
            </button>
          )}
        </header>
        <main className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {showForm && (
              <div className="form-panel">
                <div className="form-card">
                  <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                    <span className="font-black uppercase text-xl italic tracking-tighter">
                      New Entry
                    </span>
                    <button
                      onClick={() => setShowForm(false)}
                      className="hover:text-[#e8325a] transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div
                    className="aspect-[4/3] bg-[#f5e6e0] border-2 border-dashed border-black mb-6 cursor-pointer flex flex-col items-center justify-center gap-2 overflow-hidden relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    ) : (
                      <>
                        <Camera size={32} className="opacity-30" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                          Upload Photo
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

                  <input
                    className="field-input"
                    placeholder="FULL NAME"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <textarea
                    className="field-input resize-none"
                    placeholder="BRIEF BIO / QUOTE"
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <select
                    className="field-input"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="">SELECT GENDER</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                  <select
                    className="field-input"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="">SELECT ROLE</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="TEACHER">TEACHER</option>
                  </select>

                  <input
                    className="field-input"
                    placeholder="INSTAGRAM LINK OR USERNAME"
                    value={form.instagram}
                    onChange={(e) =>
                      setForm({ ...form, instagram: e.target.value })
                    }
                  />

                  <button
                    className="submit-btn"
                    onClick={handleConfirmEntry}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        SAVE TO WALL <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className={`members-grid ${showForm ? "grid-compact" : ""}`}>
              {fetching ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton-card"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="skeleton-img" />
                    <div className="skeleton-text" />
                    <div className="skeleton-text" style={{ width: "60%" }} />
                  </div>
                ))
              ) : members.length === 0 ? (
                <div className="col-span-full py-20 border-2 border-dashed border-black/10 flex flex-col items-center opacity-30">
                  <User size={48} />
                  <p className="font-bold uppercase tracking-widest mt-4">
                    The wall is empty.
                  </p>
                </div>
              ) : (
                members.map((m, i) => (
                  <div
                    key={m.id}
                    className="member-card cursor-pointer"
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => setSelectedMember(m)}
                  >
                    <div className="card-img-wrap">
                      {m.image ? (
                        <img src={m.image} alt={m.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={48} className="opacity-10" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#f2c14e] border-2 border-black px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter shadow-sm">
                        Class of '27
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="card-name">{m.name}</p>
                      <p className="card-desc">
                        "{m.description || "Living the dream."}"
                      </p>
                    </div>
                    {m.instagram && m.instagram.trim() !== "" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = m.instagram!.startsWith("http")
                            ? m.instagram!
                            : `https://instagram.com/${m.instagram!.replace("@", "")}`;
                          window.open(url, "_blank");
                        }}
                        className="ig-btn"
                      >
                        <Instagram size={18} />
                      </button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 h-10 w-10 z-30 !rounded-none border-3 !border-black !bg-[#f2c14e] !text-black p-0 hover:!bg-black hover:!text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-none"
                        >
                          <span className="text-xl font-black">...</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => handleEdit(m)}>
                          <span>Edit Entry</span>
                          <span className="ml-auto">→</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(m.id)}
                        >
                          <span>Delete</span>
                          <span className="ml-auto">×</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
