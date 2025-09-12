import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import Link from "next/link";
import GeneratePdfButton from "@/components/GeneratePdfButton";
import { AGENT_DEFAULT } from "@/lib/constants";

function formatMoney(v, cur = "INR") { const n = Number(v || 0); return `${cur} ${n.toFixed(2)}`; }
function splitHotelAndLocation(hotelProperty) { if (!hotelProperty) return { name: "", location: "" }; const m = hotelProperty.match(/^(.*?)\\s*\\((.+)\\)\\s*$/); if (m) return { name: m[1].trim(), location: m[2].trim() }; return { name: hotelProperty, location: "" }; }

export default async function QuoteView({ params }) {
  const { id } = await params;
  await dbConnect();
  const quote = await Quotation.findById(id).lean();
  if (!quote) return <div>Not found</div>;

  const hidePricingColumn = !!quote.hidePricingColumn;
  const hideGrandTotal = !!quote.hideGrandTotal;

  // Fallbacks for preview
  const agent = {
    name: quote.agentName || AGENT_DEFAULT.name,
    phone: quote.agentPhone || AGENT_DEFAULT.phone,
    email: quote.agentEmail || AGENT_DEFAULT.email,
    subject: quote.agentSubject || AGENT_DEFAULT.subject,
  };

  const allItems = (quote.items || []).slice();
  function ts(v) { try { return v ? new Date(v).getTime() : 0; } catch (e) { return 0; } }

  const acc = allItems.filter(it => it.type === "accommodation").map(it => {
    const cur = it.currency || quote.currency || "INR";
    const total = it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100));
    const { name, location } = splitHotelAndLocation(it.hotelProperty || "");
    const rn = it.roomCount ? `${it.roomCount} x` : "";
    const pax = [(it.adults || it.adults === 0) ? `${it.adults} Adults` : null, (it.children || it.children === 0) ? `${it.children} Children` : null, (it.guests || it.guests === 0) ? `${it.guests} Guests` : null].filter(Boolean).join(", ");
    const details = [location ? `(${location})` : "", [rn, it.roomDetails].filter(Boolean).join(" "), pax].filter(Boolean).join(" — ");
    return {
      _sort: ts(it.checkIn || it.startDate),
      name: name || "Hotel",
      details,
      date: `${it.checkIn ? new Date(it.checkIn).toLocaleDateString() : ""}${it.checkOut ? " - " + new Date(it.checkOut).toLocaleDateString() : ""}`,
      price: formatMoney(total, cur),
    };
  }).sort((a, b) => a._sort - b._sort);

  const trf = allItems.filter(it => it.type === "transfer").map(it => {
    const cur = it.currency || quote.currency || "INR";
    const total = it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100));
    const cancellationNote = it.cancellationBefore ? `Free cancellation before ${new Date(it.cancellationBefore).toLocaleDateString()}` : "";
    function splitHotelAndLocation(hotelProperty) {
      if (!hotelProperty) return { name: "", location: "" };
      const m = hotelProperty.match(/^(.*?)\s*\((.+)\)\s*$/);
      if (m) return { name: m[1].trim(), location: m[2].trim() };
      return { name: hotelProperty, location: "" };
    }
    let name = "", details = "", date = "", sortTs = it.startDate ? new Date(it.startDate).getTime() : 0;
    if (it.transferType === "car_rental") {
      const nm = splitHotelAndLocation(it.carType || it.customCarType || "");
      name = nm.name || "Car Rental";
      var subline = nm.location || "";
      const parts = [];
      if (it.members || it.members === 0) parts.push(`${it.members} Members`);
      parts.push(`Pickup ${it.from || ""}${it.pickupTime ? " at " + it.pickupTime : ""}`);
      if (it.to || it.dropoffTime) parts.push(`Drop-off ${it.to || ""}${it.dropoffTime ? " at " + it.dropoffTime : ""}`);
      details = parts.filter(Boolean).join(" — ");
      const d1 = it.startDate ? new Date(it.startDate).toLocaleDateString() : "";
      const d2 = it.endDate ? new Date(it.endDate).toLocaleDateString() : "";
      date = [d1, d2].filter(Boolean).join(" - ");
      sortTs = it.startDate ? new Date(it.startDate).getTime() : (it.endDate ? new Date(it.endDate).getTime() : 0);
    } else if (it.transferType === "bike_rental") {
      const nm = splitHotelAndLocation(it.bikeType || it.customBikeType || "");
      name = nm.name || "Bike Rental";
      var subline = nm.location || "";
      const parts = [];
      if (it.members || it.members === 0) parts.push(`${it.members} Members`);
      parts.push(`Pickup ${it.from || ""}${it.pickupTime ? " at " + it.pickupTime : ""}`);
      if (it.to || it.dropoffTime) parts.push(`Drop-off ${it.to || ""}${it.dropoffTime ? " at " + it.dropoffTime : ""}`);
      details = parts.filter(Boolean).join(" — ");
      const d1 = it.startDate ? new Date(it.startDate).toLocaleDateString() : "";
      const d2 = it.endDate ? new Date(it.endDate).toLocaleDateString() : "";
      date = [d1, d2].filter(Boolean).join(" - ");
      sortTs = it.startDate ? new Date(it.startDate).getTime() : (it.endDate ? new Date(it.endDate).getTime() : 0);
    } else if (it.transferType === "other") {
      var subline = "";
      name = (it.customTransferType || "Transfer").trim();
      details = `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`;
      date = it.startDate ? new Date(it.startDate).toLocaleDateString() : "";
      sortTs = it.startDate ? new Date(it.startDate).getTime() : 0;
    } else {
      var subline = "";
      const label = it.transferType === "ferry" ? "Ferry Transfer" : it.transferType === "intercity" ? "Intercity Transfer" : "Airport Transfer";
      name = `${label}${it.details ? " - " + it.details : ""}`.trim();
      details = `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`;
      date = it.startDate ? new Date(it.startDate).toLocaleDateString() : "";
      sortTs = it.startDate ? new Date(it.startDate).getTime() : 0;
    }
    return {
      _sort: sortTs,
      subline,
      name,
      details,
      cancel: cancellationNote,
      date,
      price: formatMoney(total, cur),
    };
  }).sort((a, b) => a._sort - b._sort);

  const act = allItems.filter(it => it.type === "activity").map(it => {
    const cur = it.currency || quote.currency || "INR";
    const total = it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100));

    if (it.type === "accommodation") {
      const { name, location } = splitHotelAndLocation(it.hotelProperty || "");
      const rn = it.roomCount ? `${it.roomCount} x` : "";
      const pax = [(it.adults || it.adults === 0) ? `${it.adults} Adults` : null, (it.children || it.children === 0) ? `${it.children} Children` : null, (it.guests || it.guests === 0) ? `${it.guests} Guests` : null].filter(Boolean).join(", ");
      return {
        _sort: ts(it.checkIn || it.startDate),
        name: name || "Hotel",
        details: [location ? `(${location})` : "", [rn, it.roomDetails].filter(Boolean).join(" "), pax].filter(Boolean).join(" — "),
        date: `${it.checkIn ? new Date(it.checkIn).toLocaleDateString() : ""}${it.checkOut ? " - " + new Date(it.checkOut).toLocaleDateString() : ""}`,
        price: formatMoney(total, cur),
      };
    } else if (it.type === "transfer") {
      const label = it.transferType === "ferry" ? "Ferry Transfer" : it.transferType === "intercity" ? "Intercity Transfer" : "Airport Transfer";
      return {
        _sort: ts(it.startDate),
        name: `${label}${it.details ? " - " + it.details : ""}`.trim(),
        details: `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`,
        date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "",
        price: formatMoney(total, cur)
      };
    } else if (it.type === "activity") {
      const fromTo = (it.startTime || it.endTime) ? `From ${it.startTime || "--"} to ${it.endTime || "--"}` : "";
      const mergedDetails = [it.description || "", fromTo].filter(Boolean).join(" — ");
      return {
        _sort: ts(it.startDate),
        name: it.itemTitle || it.customActivity || "Activity",
        details: mergedDetails,
        date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "",
        price: formatMoney(total, cur)
      };
    } else {
      return {
        _sort: ts(it.startDate),
        name: it.itemTitle || "Service",
        details: it.description || "",
        date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "",
        price: formatMoney(total, cur)
      };
    }
  }).sort((a, b) => a._sort - b._sort);

  // Normalize identifiers and timestamps to primitives to be safe for client usage
  const quoteIdStr = quote._id?.toString();
  const createdAtStr = quote.createdAt ? new Date(quote.createdAt).toISOString() : undefined;
  const updatedAtStr = quote.updatedAt ? new Date(quote.updatedAt).toISOString() : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quotation</h1>
        <div className="flex gap-2">
          <GeneratePdfButton id={quoteIdStr} />
          <Link className="btn btn-primary" href={`/quotes/${quoteIdStr}/edit`}>Edit</Link>
        </div>
      </div>

      {/* NEW: Agent Details preview */}
      <div className="card p-6">
        <div className="text-lg font-semibold mb-2">Agent Details</div>
        <div className="grid md:grid-cols-4 gap-2 text-sm">
          <div className="text-white/70">Contact Person</div><div>{agent.name}</div>
          <div className="text-white/70">Mobile Number</div><div>{agent.phone}</div>
          <div className="text-white/70">E Mail</div><div>{agent.email}</div>
          <div className="text-white/70">Subject</div><div className="md:col-span-3">{agent.subject}</div>
        </div>
      </div>

      <div className="card p-6 overflow-hidden space-y-6">

        {acc.length > 0 && (
          <div>
            <div className="text-lg font-semibold mb-2">Accommodation</div>
            <div className="table-wrap">
<table className="table w-full">
              {!hidePricingColumn ? (<thead><tr><th>Name</th><th>Details</th><th className="text-center whitespace-nowrap w-40">Date</th><th className="text-right">Pricing</th></tr></thead>) : (<thead><tr><th>Name</th><th>Details</th><th className="text-center whitespace-nowrap w-40">Date</th></tr></thead>)}
              <tbody>
                {acc.map((r, idx) => (
                  <tr key={`acc-${idx}`}>
                    <td>{r.name}{r.subline ? <div className="text-white/60 text-xs">{r.subline}</div> : null}</td>
                    <td className="text-white/80">{r.details}{r.cancel ? <div className="text-white/50 text-xs mt-1">{r.cancel}</div> : null}</td>
                    <td className="text-center whitespace-nowrap w-40">{r.date}</td>
                    {!hidePricingColumn && (<td className="text-right">{r.price}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
</div>
          </div>
        )}

        {trf.length > 0 && (
          <div>
            <div className="text-lg font-semibold mb-2">Transfers</div>
            <div className="table-wrap">
<table className="table w-full">
              {!hidePricingColumn ? (<thead><tr><th>Name</th><th>Details</th><th className="text-center whitespace-nowrap w-40">Date</th><th className="text-right">Pricing</th></tr></thead>) : (<thead><tr><th>Name</th><th>Details</th><th className="text-center whitespace-nowrap w-40">Date</th></tr></thead>)}
              <tbody>
                {trf.map((r, idx) => (
                  <tr key={`trf-${idx}`}>
                    <td>{r.name}{r.subline ? <div className="text-white/60 text-xs">{r.subline}</div> : null}</td>
                    <td className="text-white/80">{r.details}{r.cancel ? <div className="text-white/50 text-xs mt-1">{r.cancel}</div> : null}</td>
                    <td className="text-center whitespace-nowrap w-40">{r.date}</td>
                    {!hidePricingColumn && (<td className="text-right">{r.price}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
</div>
          </div>
        )}

        {act.length > 0 && (
          <div>
            <div className="text-lg font-semibold mb-2">Activities</div>
            <div className="table-wrap">
<table className="table w-full">
              {!hidePricingColumn ? (<thead><tr><th>Name</th><th>Details</th><th className="text-center whitespace-nowrap w-40">Date</th><th className="text-right">Pricing</th></tr></thead>) : (<thead><tr><th>Name</th><th>Details</th><th className="text-center whitespace-nowrap w-40">Date</th></tr></thead>)}
              <tbody>
                {act.map((r, idx) => (
                  <tr key={`act-${idx}`}>
                    <td>{r.name}{r.subline ? <div className="text-white/60 text-xs">{r.subline}</div> : null}</td>
                    <td className="text-white/80">{r.details}{r.cancel ? <div className="text-white/50 text-xs mt-1">{r.cancel}</div> : null}</td>
                    <td className="text-center whitespace-nowrap w-40">{r.date}</td>
                    {!hidePricingColumn && (<td className="text-right">{r.price}</td>)}
                  </tr>
                ))}
              </tbody>
              {!hideGrandTotal && (<tfoot>
                <tr>
                  <td colSpan={3} className="text-right">Subtotal</td>
                  <td className="text-right">{formatMoney(quote.subtotal, quote.currency || "INR")}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right">Total Discount</td>
                  <td className="text-right">-{formatMoney(quote.discount, quote.currency || "INR")}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right font-semibold">Grand Total</td>
                  <td className="text-right font-semibold">{formatMoney(quote.grandTotal, quote.currency || "INR")}</td>
                </tr>
              </tfoot>)}
            </table>
</div>
          </div>
        )}

      </div>
    </div>
  );
}
