
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
export async function GET(_req, ctx){ const { id } = await ctx.params; await dbConnect(); const q=await Quotation.findById(id).lean(); return Response.json(q||{}); }
export async function PATCH(req, ctx){ const { id } = await ctx.params; await dbConnect(); const body=await req.json(); computeTotals(body); const q=await Quotation.findByIdAndUpdate(id, body, { new: true }); return Response.json(q); }
export async function DELETE(_req, ctx){ const { id } = await ctx.params; await dbConnect(); await Quotation.findByIdAndDelete(id); return new Response(null,{status:204}); }
