
export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
function computeTotals(q) {
  const subtotal = (q.items || []).reduce((s, it) => {
    const total = Number(it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100)));
    return s + (isFinite(total) ? total : 0);
  }, 0);
  q.subtotal = +subtotal.toFixed(2);
  q.grandTotal = Math.max(0, q.subtotal - Number(q.discount || 0));
  return q;
}
export async function GET(){ await dbConnect(); const list=await Quotation.find().sort({createdAt:-1}).limit(100).lean(); return Response.json(list); }
export async function POST(req){ await dbConnect(); const body=await req.json(); computeTotals(body); const q=await Quotation.create(body); return Response.json(q); }
