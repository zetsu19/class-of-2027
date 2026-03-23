"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Loader2,
  User,
  Camera,
  X,
  Users,
  GraduationCap,
} from "lucide-react";

type Member = {
  id: string;
  name?: string;
  image?: string;
  description?: string;
  gender?: "MALE" | "FEMALE";
  role?: "TEACHER" | "STUDENT";
  instagram?: string;
  createdAt: string;
};

type FilterRole = "ALL" | "TEACHER" | "STUDENT";

export default function StudentGalleryPage() {
  const [fetching, setFetching] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterRole>("ALL");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/class-members");
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Archive Error:", err);
    } finally {
      setTimeout(() => setFetching(false), 1200);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    if (activeFilter === "ALL") return true;
    return m.role === activeFilter;
  });

  return (
    <div className="min-h-screen bg-[#f0ebe4] relative selection:bg-[#e8325a] selection:text-white overflow-x-hidden">
      <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        :root {
          --ink: #0f0e0e;
          --cream: #f0ebe4;
          --mythic-gold: #f2c14e;
          --mythic-red: #e8325a;
        }
        .bebas {
          font-family: "Bebas Neue", sans-serif;
        }
        .dm-sans {
          font-family: "DM Sans", sans-serif;
        }

        .page-noise::before {
          content: "";
          pointer-events: none;
          position: fixed;
          inset: 0;
          z-index: 50;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        @keyframes mythic-glow {
          0% {
            border-color: var(--mythic-red);
            box-shadow: 0 0 10px var(--mythic-red);
          }
          50% {
            border-color: var(--mythic-gold);
            box-shadow: 0 0 25px var(--mythic-gold);
          }
          100% {
            border-color: var(--mythic-red);
            box-shadow: 0 0 10px var(--mythic-red);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }

        .mythic-frame {
          border: 6px solid var(--mythic-red);
          animation: mythic-glow 3s infinite ease-in-out;
          position: relative;
          overflow: hidden;
        }

        .mythic-shimmer::after {
          content: "";
          position: absolute;
          top: -100%;
          left: -100%;
          width: 50%;
          height: 300%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shine 4s infinite;
          pointer-events: none;
        }
      `}</style>

      {fetching && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--cream)]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[var(--ink)]" size={48} />
            <span className="text-[var(--ink)] font-bold uppercase tracking-widest opacity-70 dm-sans">
              Loading
            </span>
          </div>
        </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0f0e0e]/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className={`bg-[#f0ebe4] border-[6px] shadow-[20px_20px_0px_0px_rgba(232,50,90,1)] max-w-2xl w-full relative p-6 md:p-10 animate-in zoom-in-95 duration-300 min-h-fit ${
              selectedMember.role === "TEACHER"
                ? "mythic-frame"
                : "border-[#0f0e0e]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute -top-6 -right-6 bg-[#e8325a] text-white border-4 border-[#0f0e0e] p-2 hover:scale-110 transition-transform z-[110]"
            >
              <X size={32} strokeWidth={3} />
            </button>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              {/* Profile Image */}
              <div className="w-64 h-80 bg-[#0f0e0e] border-4 border-[#0f0e0e] overflow-hidden shrink-0 shadow-[8px_8px_0px_0px_rgba(15,14,14,0.2)]">
                {selectedMember.image ? (
                  <img
                    src={selectedMember.image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <User size={80} />
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="flex-1 text-center md:text-left min-w-0">
                <div className="bebas text-2xl text-[#e8325a] mb-2 tracking-widest uppercase flex items-center justify-center md:justify-start gap-2">
                  {selectedMember.role === "TEACHER" && (
                    <Sparkles size={18} className="animate-pulse" />
                  )}
                  {selectedMember.role || "Member"}
                </div>

                {/* FIXED NAME BOX: Changed leading and added break-words */}
                <h2 className="bebas text-6xl md:text-8xl text-[#0f0e0e] leading-[0.9] mb-6 uppercase break-words overflow-visible">
                  {selectedMember.name}
                </h2>

                <p className="dm-sans text-xl italic text-[#0f0e0e]/80 leading-relaxed max-w-prose">
                  "{selectedMember.description || "Living the dream."}"
                </p>

                <div className="mt-8 pt-6 border-t-4 border-[#0f0e0e] inline-block">
                  <span className="bebas text-3xl text-[#0f0e0e]">
                    CLASS OF 2027
                  </span>
                </div>
              </div>
            </div>

            {selectedMember.role === "TEACHER" && (
              <div className="mythic-shimmer" />
            )}
          </div>
        </div>
      )}

      <main className="page-noise p-6 md:p-12 max-w-[1400px] mx-auto relative z-10">
        <header className="mb-12">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0f0e0e] text-[#e8325a] font-black text-[10px] uppercase tracking-widest mb-4 dm-sans">
              <Sparkles size={12} fill="currentColor" /> Archive v2.7
            </div>
            <h1 className="bebas text-7xl md:text-9xl leading-[0.8] text-[#0f0e0e] uppercase">
              Class of{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #0f0e0e" }}
              >
                '27
              </span>
            </h1>
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            {(["ALL", "TEACHER", "STUDENT"] as FilterRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setActiveFilter(role)}
                className={`bebas text-2xl px-8 py-2 border-4 border-[#0f0e0e] transition-all duration-200 ${
                  activeFilter === role
                    ? "bg-[#e8325a] text-white shadow-[4px_4px_0px_0px_rgba(15,14,14,1)] -translate-y-1"
                    : "bg-white text-[#0f0e0e] hover:bg-[#f2c14e]"
                }`}
              >
                {role}S
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {!fetching &&
            filteredMembers.map((member, i) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`group cursor-pointer bg-white transition-all duration-300 animate-in fade-in zoom-in-95 relative ${
                  member.role === "TEACHER"
                    ? "mythic-frame scale-105 z-10"
                    : "border-4 border-[#0f0e0e] shadow-[8px_8px_0px_0px_rgba(15,14,14,1)] hover:shadow-[16px_16px_0px_0px_rgba(232,50,90,1)] hover:-translate-x-2 hover:-translate-y-2"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {member.role === "TEACHER" && (
                  <div className="mythic-shimmer" />
                )}
                <div className="aspect-[3/4] bg-[#f5e6e0] border-b-4 border-[#0f0e0e] relative overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#0f0e0e]/10">
                      <User size={100} />
                    </div>
                  )}
                  <div
                    className={`absolute top-4 left-4 border-2 border-[#0f0e0e] px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(15,14,14,1)] dm-sans flex items-center gap-2 ${
                      member.role === "TEACHER"
                        ? "bg-[#e8325a] text-white"
                        : "bg-[#f2c14e] text-[#0f0e0e]"
                    }`}
                  >
                    {member.role === "TEACHER" ? (
                      <GraduationCap size={12} />
                    ) : (
                      <Users size={12} />
                    )}
                    {member.role || "Member"}
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="bebas text-4xl text-[#0f0e0e] leading-none mb-2 truncate">
                    {member.name || "Anonymous"}
                  </h3>
                  <p className="dm-sans text-sm text-[#0f0e0e]/50 font-medium italic line-clamp-1 uppercase tracking-tight">
                    {member.description || "Living the dream."}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {!fetching && filteredMembers.length === 0 && (
          <div className="text-center py-40 border-[10px] border-dashed border-[#0f0e0e]/5 rounded-[60px]">
            <Camera size={80} className="mx-auto text-[#0f0e0e]/10 mb-8" />
            <h2 className="bebas text-6xl text-[#0f0e0e]/20 tracking-widest uppercase">
              No {activeFilter}s Found
            </h2>
          </div>
        )}
      </main>

      <footer className="p-12 border-t-8 border-[#0f0e0e] mt-20 bg-[#f2c14e]">
        <div className="flex justify-between items-center max-w-[1400px] mx-auto">
          <div className="bebas text-4xl text-[#0f0e0e]">
            © 2027 ARCHIVE CORP
          </div>
          <div className="bebas text-4xl text-[#0f0e0e] hidden md:block">
            PRODUCED BY ZETSU
          </div>
        </div>
      </footer>
    </div>
  );
}
