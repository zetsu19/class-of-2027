"use client";

import { useEffect, useState } from "react";
import { Plus, User, Camera, Sparkles, X } from "lucide-react";

type Member = {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  createdAt: string;
};

export default function ClassMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", image: "", description: "" });

  const fetchMembers = async () => {
    const res = await fetch("/api/class-members");
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/class-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: "", image: "", description: "" });
      setShowForm(false);
      fetchMembers();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 p-8">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Class of '26
          </h1>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
            The Digital Yearbook
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="group flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full font-bold hover:scale-105 transition-all active:scale-95 shadow-xl shadow-black/10"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? "Close" : "Add Profile"}</span>
        </button>
      </nav>

      <main className="max-w-6xl mx-auto">
        {showForm && (
          <div className="mb-16 bg-white border-2 border-black rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-400 fill-yellow-400" size={20} />
              <h2 className="text-xl font-black italic uppercase">
                Create your entry
              </h2>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-gray-100 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                required
              />
              <input
                type="text"
                placeholder="Image Link"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="bg-gray-100 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
              <textarea
                placeholder="Short bio..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="bg-gray-100 border-none p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium md:col-span-2"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-indigo-700 transition-colors"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
          {members.map((m) => (
            <div
              key={m.id}
              className="break-inside-avoid group relative bg-white border border-gray-200 rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-6">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                    <Camera size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <p className="text-white text-xs font-bold uppercase tracking-widest leading-none">
                    View Profile
                  </p>
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                  {m.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {m.description || "Building something cool."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
