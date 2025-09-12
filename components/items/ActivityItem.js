
"use client";
import Input from "@/components/ui/input";
import SelectNative from "@/components/ui/select-native";
import { ISLANDS } from "@/lib/properties";
import { useMemo } from "react";

const ACTIVITY_MAP = {
  mahe: [
    "Private Charter - Zephir", "Group Outing", "Tour Guiding", "Sunset on the Rocks at Cap Lazare Nature Reserve", "Visit Craft Village", "Gallery Domaine",
    "Mahe Island Discovery Shared Tour", "Island tour", "Ste Anne Marine Park (Day trip)", "Private Charter Zekler", "Nature Trail - Copolia", "Sunseekers Tours",
    "Private Full Day Island Tours", "Discovery Tour of Mahe - Without Guide (Full Day)", "Discovery Tour of Mahe - Without Guide (Half Day)", "Sun Strokes Art Tour"
  ],
  praslin: [
    "Vallee De Mai (World Heritage site)", "La Digue Island Boat & Bike", "Curieuse and St Pierre Islands", "Nature Trail - Fond Ferdinand",
    "Discovery Tour of Praslin Island - Without Guide (Half Day)", "Discovery Tour of Praslin Island - Without Guide (Full Day)", "Private Charter Catamaran Oplezir",
    "Curieuse & St Pierre Glass Bottom Boat trip and Snorkeling", "Praslin Island Discovery Shared Tour"
  ],
  ladigue: [
    "La Digue Island Boat & Bike (From Mahe Island)", "La Digue Island Boat & Bike (From Praslin Island)", "Coco, Sister & Felicite islands",
    "Coco & Felicite Islands (From La Digue)", "Curieuse and St Pierre Islands", "La Digue Island Discovery Shared Tour", "Gesima Combo", "Ile de Palmes Discovery",
    "Just Married", "Discovery of Turtle Island", "Reef Classico", "Half Day La Digue Excursion (Afternoon)"
  ]
};

export default function ActivityItem({ index, form }) {
  const island = form.watch(`items.${index}.island`) || "mahe";
  const activityValue = form.watch(`items.${index}.itemTitle`) || "";
  const options = useMemo(() => (ACTIVITY_MAP[island] || []), [island]);

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
            form.setValue(`items.${index}.itemTitle`, "");
            form.setValue(`items.${index}.customActivity`, "");
            if (e.target.value === "other") { form.setValue(`items.${index}.itemTitle`, ""); }
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
            <div className="label">Enter Activity Name</div>
            <Input {...form.register(`items.${index}.itemTitle`)} placeholder="Type activity name..." />
          </div>
        </>
      )}
      {island !== "other" && (
        <div>
          <div className="label">Activity</div>
          <SelectNative
            {...form.register(`items.${index}.itemTitle`)}
            onChange={(e) => {
              const value = e.target.value;
              form.setValue(`items.${index}.itemTitle`, value);
              if (value !== "Other") form.setValue(`items.${index}.customActivity`, "");
              if (e.target.value === "other") { form.setValue(`items.${index}.itemTitle`, ""); }
            }}
          >
            <option value="">Select activity</option>
            {options.map(a => <option key={a} value={a}>{a}</option>)}
            <option value="Other">Other</option>
          </SelectNative>
        </div>
      )}

      {activityValue === "Other" && (
        <div>
          <div className="label">Enter Custom Activity</div>
          <Input {...form.register(`items.${index}.customActivity`)} placeholder="Type activity name..." />
        </div>
      )}

      <div><div className="label">Details</div><Input {...form.register(`items.${index}.description`)} placeholder="e.g., Seat in coach tour..." /></div>
      <div><div className="label">From (time)</div><Input type="time" {...form.register(`items.${index}.startTime`)} /></div>
      <div><div className="label">To (time)</div><Input type="time" {...form.register(`items.${index}.endTime`)} /></div>
      <div><div className="label">Date</div><Input type="date" {...form.register(`items.${index}.startDate`)} /></div>

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
