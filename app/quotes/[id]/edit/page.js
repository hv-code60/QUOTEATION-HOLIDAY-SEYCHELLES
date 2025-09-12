
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import QuoteForm from "@/components/quote-form";

export default async function EditQuote({ params }) {
  const { id } = await params;
  await dbConnect();
  const q = await Quotation.findById(id).lean();
  if (!q) return <div>Not found</div>;

  // Ensure only plain JSON values cross the RSC boundary
  q._id = q._id?.toString();
  if (q.createdAt) q.createdAt = new Date(q.createdAt).toISOString();
  if (q.updatedAt) q.updatedAt = new Date(q.updatedAt).toISOString();

  q.items = (q.items || []).map((it) => {
    const out = {
      ...it,
      // Normalize dates to YYYY-MM-DD strings for inputs
      checkIn: it.checkIn ? new Date(it.checkIn).toISOString().slice(0, 10) : "",
      checkOut: it.checkOut ? new Date(it.checkOut).toISOString().slice(0, 10) : "",
      startDate: it.startDate ? new Date(it.startDate).toISOString().slice(0, 10) : "",
      endDate: it.endDate ? new Date(it.endDate).toISOString().slice(0, 10) : "",
      cancellationBefore: it.cancellationBefore ? new Date(it.cancellationBefore).toISOString().slice(0, 10) : "",
    };
    // Remove mongoose subdocument _id (ObjectId) to keep it plain
    if (out._id && typeof out._id === "object") delete out._id;
    return out;
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Quotation</h1>
      <QuoteForm initial={q} />
    </div>
  );
}
