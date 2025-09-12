"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Textarea from "@/components/ui/textarea";
import AccommodationItem from "@/components/items/AccommodationItem";
import TransferItem from "@/components/items/TransferItem";
import ActivityItem from "@/components/items/ActivityItem";
import CurrencySelect from "@/components/ui/currency-select";
import { AGENT_DEFAULT } from "@/lib/constants";

const ItemSchema = z.object({
  type: z.string().optional(),
  island: z.string().optional(),
  customIsland: z.string().optional(),
  hotelProperty: z.string().optional(),
  roomCount: z.coerce.number().optional(),
  roomDetails: z.string().optional(),
  adults: z.coerce.number().optional(),
  children: z.coerce.number().optional(),
  guests: z.coerce.number().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  transferType: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  details: z.string().optional(),
  members: z.coerce.number().optional(),
  itemTitle: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pickupTime: z.string().optional(),
  dropoffTime: z.string().optional(),
  carType: z.string().optional(),
  bikeType: z.string().optional(),
  customCarType: z.string().optional(),
  customBikeType: z.string().optional(),
  customTransferType: z.string().optional(),
  currency: z.string().optional(),
  basePrice: z.coerce.number().optional(),
  markupPercent: z.coerce.number().optional(),
  totalPrice: z.coerce.number().optional(),
  cancellationBefore: z.string().optional(),
  // optional extras (for "Other" UX), harmless if unused
  customActivity: z.string().optional(),
});

const QuoteSchema = z.object({
  currency: z.string().optional().default("INR"),
  agentName: z.string().optional(),
  agentPhone: z.string().optional(),
  agentEmail: z.string().optional(),
  agentSubject: z.string().optional(),
  items: z.array(ItemSchema).optional(),
  subtotal: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  grandTotal: z.coerce.number().optional(),
  status: z.string().optional(),
  footerBrand: z.string().optional(),
  notesPreset: z.string().optional().default("custom"),
  notesCustom: z.string().optional(),

  hidePricingColumn: z.boolean().optional().default(false),
  hideGrandTotal: z.boolean().optional().default(false),
});

export default function QuoteForm({ initial }) {
  const form = useForm({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      currency: initial?.currency ?? "INR",
      footerBrand: initial?.footerBrand ?? "holidays_seychelle",
      notesPreset: initial?.notesPreset ?? "custom",
      notesCustom: initial?.notesCustom ?? "",

      hidePricingColumn: initial?.hidePricingColumn ?? false,
      hideGrandTotal: initial?.hideGrandTotal ?? false,

      agentName: initial?.agentName ?? AGENT_DEFAULT.name,
      agentPhone: initial?.agentPhone ?? AGENT_DEFAULT.phone,
      agentEmail: initial?.agentEmail ?? AGENT_DEFAULT.email,
      agentSubject: initial?.agentSubject ?? AGENT_DEFAULT.subject,

      ...(initial || {}),
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  function addAccommodation() { append({ type: "accommodation", island: "mahe" }); }
  function addTransfer() { append({ type: "transfer", transferType: "airport" }); }
  function addActivity() { append({ type: "activity" }); }

  function computeTotals() {
    const items = form.getValues("items") || [];
    const globalCur = form.getValues("currency") || "INR";
    items.forEach((it, i) => form.setValue(`items.${i}.currency`, globalCur));
    const subtotal = items.reduce((sum, it) => {
      const t = Number(it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100)));
      return sum + (isFinite(t) ? t : 0);
    }, 0);
    form.setValue("subtotal", +subtotal.toFixed(2));
    const discount = Number(form.getValues("discount") || 0);
    form.setValue("grandTotal", Math.max(0, subtotal - discount));
  }

  function onCurrencyChange(v) {
    form.setValue("currency", v);
    const items = form.getValues("items") || [];
    items.forEach((_, i) => form.setValue(`items.${i}.currency`, v));
  }

  async function onSubmit(values) {
    computeTotals();
    const res = await fetch(initial ? `/api/quotes/${initial._id}` : "/api/quotes", {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (res.ok) { window.location.href = `/quotes/${data._id}`; } else { alert(data.error || "Error"); }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* 1) Global Currency (unchanged) */}
      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <CurrencySelect value={form.watch("currency")} onChange={onCurrencyChange} />
        </div>
      </Card>

      {/* 2) NEW: Agent Details */}
      <Card>
        <div className="section-title">Agent Details</div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="label">Contact Person</div>
            <Input {...form.register("agentName")} placeholder={AGENT_DEFAULT.name} />
          </div>
          <div>
            <div className="label">Mobile Number</div>
            <Input {...form.register("agentPhone")} placeholder={AGENT_DEFAULT.phone} />
          </div>
          <div>
            <div className="label">E Mail</div>
            <Input type="email" {...form.register("agentEmail")} placeholder={AGENT_DEFAULT.email} />
          </div>
          <div className="md:col-span-2">
            <div className="label">Subject</div>
            <Input {...form.register("agentSubject")} placeholder={AGENT_DEFAULT.subject} />
          </div>
        </div>
      </Card>

      {/* 3) Accommodation */}
      <Card>
        <div className="flex items-center justify-between mb-3 flex-wrap">
          <div className="section-title">Accommodation</div>
          <Button type="button" onClick={addAccommodation}>Add Accommodation</Button>
        </div>
        <div className="space-y-4">
          {fields.map((f, i) => f.type === "accommodation" && (
            <div key={f.id} className="border border-white/10 rounded-2xl p-4">
              <AccommodationItem index={i} form={form} />
              <div className="flex justify-between mt-3">
                <div className="text-white/60">Item #{i + 1}</div>
                <Button type="button" variant="ghost" onClick={() => remove(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 4) Transfers */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="section-title">Transfers</div>
          <Button type="button" onClick={addTransfer}>Add Transfer</Button>
        </div>
        <div className="space-y-4">
          {fields.map((f, i) => f.type === "transfer" && (
            <div key={f.id} className="border border-white/10 rounded-2xl p-4">
              <TransferItem index={i} form={form} />
              <div className="flex justify-between mt-3">
                <div className="text-white/60">Item #{i + 1}</div>
                <Button type="button" variant="ghost" onClick={() => remove(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5) Activities */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="section-title">Activities</div>
          <Button type="button" onClick={addActivity}>Add Activity</Button>
        </div>
        <div className="space-y-4">
          {fields.map((f, i) => f.type === "activity" && (
            <div key={f.id} className="border border-white/10 rounded-2xl p-4">
              <ActivityItem index={i} form={form} />
              <div className="flex justify-between mt-3">
                <div className="text-white/60">Item #{i + 1}</div>
                <Button type="button" variant="ghost" onClick={() => remove(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 6) Totals & Status */}
      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <div><div className="label">Subtotal</div><Input type="number" step="0.01" {...form.register("subtotal")} /></div>
          <div><div className="label">Discount</div><Input type="number" step="0.01" {...form.register("discount", { onChange: computeTotals })} /></div>
          <div><div className="label">Grand Total</div><Input type="number" step="0.01" {...form.register("grandTotal")} /></div>
          <div><div className="label">Status</div>
            <select className="input" {...form.register("status")}>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 7) Notes */}
      <Card>
        <div className="section-title">Important Notes</div>
        <div className="mt-2">
          <div className="label">Enter important notes (Markdown supported)</div>
          <Textarea placeholder="Write notes in Markdown (headings, lists, **bold**, _italic_)..." {...form.register("notesCustom")} />
          <div className="text-white/50 text-xs mt-1">Tip: Supports headings (#), bulleted (-, *), numbered (1.), **bold**, _italic_, tables, and more.</div>
        </div>
      </Card>

      {/* 8) Footer / Brand */}{/* 8) Footer / Brand */}
      <Card>
        <div className="section-title">Document Footer</div>
        <div className="md:w-1/2">
          <div className="label">Footer / Brand</div>
          <select className="input" {...form.register("footerBrand")}>
            <option value="holidays_seychelle">Holidays Seychelle</option>
            <option value="oceanic_travel">Traveon</option>
            <option value="sunrise_journeys">Sunrise Journeys (dummy)</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="section-title">Display Options</div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" {...form.register("hidePricingColumn")} /><span>Hide pricing column</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" {...form.register("hideGrandTotal")} /><span>Hide grand total</span></label>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" onClick={computeTotals}>Save</Button>
        <Button type="button" variant="ghost" onClick={computeTotals}>Recalculate</Button>
      </div>
    </form>
  );
}
