
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import DashboardTable from "@/components/DashboardTable";
export default async function Dashboard() {
  await dbConnect();
  const quotes = await Quotation.find().sort({ createdAt: -1 }).limit(50).lean();
  const rows = quotes.map((q) => ({
    id: q._id?.toString(),
    name: q.agentName || "",
    subject: q.agentSubject || "",
    createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : "",
    status: q.status,
  }));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/quotes/new" className="btn btn-primary">New Quotation</Link>
      </div>
      <div className="card p-6 overflow-hidden">
        <DashboardTable rows={rows} />
      </div>
    </div>
  );
}
