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
      {/* 👇 Duplicate Dashboard title + New Quotation button hata diya */}
      <div className="card p-6 overflow-hidden">
        <DashboardTable rows={rows} />
      </div>
    </div>
  );
}
