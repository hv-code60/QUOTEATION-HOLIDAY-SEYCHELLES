
"use client";
import Input from "@/components/ui/input";
import SelectNative from "@/components/ui/select-native";
import { ISLANDS, PROPERTIES } from "@/lib/properties";
import { useMemo } from "react";

export default function AccommodationItem({ index, form }) {
  const island = form.watch(`items.${index}.island`) || "mahe";
  const hotels = useMemo(() => (PROPERTIES[island] || []), [island]);
  const hotelValue = form.watch(`items.${index}.hotelProperty`) || "";

  const recalc = () => {
    const base = Number(form.getValues(`items.${index}.basePrice`) || 0);
    const m = Number(form.getValues(`items.${index}.markupPercent`) || 0);
    const total = base * (1 + m / 100);
    form.setValue(`items.${index}.totalPrice`, +total.toFixed(2));
  };

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div>
        <div className="label">Island</div>
        <SelectNative
          {...form.register(`items.${index}.island`)}
          onChange={(e) => {
            form.setValue(`items.${index}.island`, e.target.value);
            // reset hotel when island changes
            form.setValue(`items.${index}.hotelProperty`, "");
            form.setValue(`items.${index}.customHotelName`, "");
          }}
        >
          <option value="">Select island</option>
          {ISLANDS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </SelectNative>
      </div>


      {island === "other" && (
        <>
          <div>
            <div className="label">Enter Island Name</div>
            <Input {...form.register(`items.${index}.customIsland`)} placeholder="Type island name..." />
          </div>
          <div className="md:col-span-2">
            <div className="label">Enter Hotel / Property Name</div>
            <Input {...form.register(`items.${index}.hotelProperty`)} placeholder='e.g., "Hotel Name (Location)"' />
            <div className="text-xs text-white/60 mt-1">Tip: Use <span className="font-mono">Hotel Name (Location)</span> format for auto styling in PDF.</div>
          </div>
        </>
      )}
      {island !== "other" && (
        <div>
          <div className="label">Property</div>
          <SelectNative
            {...form.register(`items.${index}.hotelProperty`)}
            onChange={(e) => {
              const value = e.target.value;
              form.setValue(`items.${index}.hotelProperty`, value);
              if (value !== "Other") form.setValue(`items.${index}.customHotelName`, "");
            }}
          >
            <option value="">Select property</option>
            {hotels.map((h) => (<option key={h} value={h}>{h}</option>))}
            <option value="Other">Other</option>
          </SelectNative>
        </div>
      )}

      {island !== "other" && hotelValue === "Other" && (
        <div>
          <div className="label">Enter Hotel Name</div>
          <Input {...form.register(`items.${index}.customHotelName`)} placeholder="Type hotel name..." />
        </div>
      )}

      <div>
        <div className="label">Rooms</div>
        <Input type="number" min="1" {...form.register(`items.${index}.roomCount`)} placeholder="e.g., 1" />
      </div>

      <div className="md:col-span-2">
        <div className="label">Room Details</div>
        <Input {...form.register(`items.${index}.roomDetails`)} placeholder="e.g., Deluxe Room with Sea View" />
      </div>

      <div><div className="label">Adults</div><Input type="number" min="0" {...form.register(`items.${index}.adults`)} /></div>
      <div><div className="label">Children</div><Input type="number" min="0" {...form.register(`items.${index}.children`)} /></div>
      <div><div className="label">Guests</div><Input type="number" min="0" {...form.register(`items.${index}.guests`)} /></div>

      <div><div className="label">Check In</div><Input type="date" {...form.register(`items.${index}.checkIn`)} /></div>
      <div><div className="label">Check Out</div><Input type="date" {...form.register(`items.${index}.checkOut`)} /></div>

      <div><div className="label">Currency</div><Input disabled value={form.watch("currency") || "INR"} /></div>
      <div><div className="label">Price</div><Input type="number" step="0.01" {...form.register(`items.${index}.basePrice`, { onChange: recalc })} /></div>
      <div><div className="label">Markup %</div><Input type="number" step="0.01" {...form.register(`items.${index}.markupPercent`, { onChange: recalc })} /></div>
      <div><div className="label">Total (auto)</div><Input type="number" step="0.01" {...form.register(`items.${index}.totalPrice`)} /></div>

      <div className="md:col-span-2">
        <div className="label">Cancellation Policy</div>
        <div className="grid grid-cols-2 gap-2">
          <Input disabled value="Free Cancellation before" />
          <Input type="date" {...form.register(`items.${index}.cancellationBefore`)} />
        </div>
      </div>
    </div>
  );
}
