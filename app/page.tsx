"use client";

import { useRouter } from "next/navigation";

export default function ClassMembersPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <button
        onClick={() => router.push("/admin/classMemberAdd")}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Go to Class Member Create
      </button>
    </div>
  );
}
