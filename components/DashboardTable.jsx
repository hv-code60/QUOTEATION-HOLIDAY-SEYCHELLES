
"use client";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function DashboardTable({ rows }) {
  const [confirmId, setConfirmId] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [localRows, setLocalRows] = useState(rows || []);

  const onDelete = (id) => {
    setConfirmId(id);
  };

  const doDelete = async () => {
    if (!confirmId) return;
    try {
      const res = await fetch(`/api/quotes/${confirmId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      // Optimistically remove from UI
      setLocalRows(prev => prev.filter(r => r.id !== confirmId));
      setConfirmId(null);
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  };

  return (
    <div className="relative">
      <div className="table-wrap">
<table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Created</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {localRows.map((r) => (
            <tr key={r.id}>
              <td className="whitespace-nowrap">{r.name || "-"}</td>
              <td className="max-w-[380px]">
                <span className="inline-block align-middle truncate" title={r.subject || ""} style={{ maxWidth: "360px" }}>
                  {r.subject || "-"}
                </span>
              </td>
              <td className="whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
              <td className="capitalize whitespace-nowrap">{r.status}</td>
              <td className="text-right whitespace-nowrap">
                <Link href={`/quotes/${r.id}`} className="btn btn-ghost mr-2">View</Link>
                <Link href={`/quotes/${r.id}/edit`} className="btn btn-ghost mr-2 text-primary">Edit</Link>
                <button type="button" className="btn btn-ghost text-red-400" onClick={() => onDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>

      {/* Simple confirmation dialog (shadcn-like styling) */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <div className="text-lg font-semibold mb-2">Delete quote?</div>
            <div className="text-white/70 mb-6">This action cannot be undone. The quote will be permanently deleted.</div>
            <div className="flex justify-end gap-3">
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button type="button" className="btn bg-red-500" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
