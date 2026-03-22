"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  createdAt: string;
};

export default function ClassMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
  });

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
    setLoading(true);

    const res = await fetch("/api/class-members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", image: "", description: "" });
      fetchMembers();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Class Members</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8 border p-4 rounded-xl"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Member"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((m) => (
          <div key={m.id} className="border p-4 rounded-xl shadow-sm">
            {m.image && (
              <img
                src={m.image}
                alt={m.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h2 className="text-lg font-semibold">{m.name}</h2>
            <p className="text-sm text-gray-600">{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
