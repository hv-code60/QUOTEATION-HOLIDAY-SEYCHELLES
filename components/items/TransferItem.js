
"use client";
import Input from "@/components/ui/input";
import { CAR_TYPES, BIKE_TYPES } from "@/lib/constants";
export default function TransferItem({ index, form }) {
  const typePath = `items.${index}.transferType`;
  const recalc = () => {
    const base = Number(form.getValues(`items.${index}.basePrice`) || 0);
    const m = Number(form.getValues(`items.${index}.markupPercent`) || 0);
    const total = base * (1 + m / 100);
    form.setValue(`items.${index}.totalPrice`, +total.toFixed(2));
  };
  const duplicateReturn = () => {
    const it = form.getValues(`items.${index}`);
    const copy = { ...it, startDate: "", from: it.to, to: it.from };
    const arr = [...(form.getValues("items") || [])];
    arr.splice(index + 1, 0, copy);
    form.setValue("items", arr);
  };
  const t = form.watch(typePath) || "airport";
  const isFerry = t === "ferry";
  const leftLabel = isFerry ? "From Port" : "Source";
  const rightLabel = isFerry ? "To Port" : "Destination";
  const globalCurrency = form.watch("currency") || "INR";
  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div><div className="label">Transfer Type</div>
        <select className="input" {...form.register(typePath)}>
          <option value="airport">Airport Transfer</option>
          <option value="intercity">Intercity Transfer</option>
          <option value="ferry">Ferry Transfer</option>
          <option value="car_rental">Car Rental</option>
          <option value="bike_rental">Bike Rental</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div><div className="label">{leftLabel}</div><Input {...form.register(`items.${index}.from`)} placeholder={isFerry ? "e.g., Mahe Jetty" : "e.g., Au Cap"} /></div>
      <div><div className="label">{rightLabel}</div><Input {...form.register(`items.${index}.to`)} placeholder={isFerry ? "e.g., Praslin Port" : "e.g., Victoria"} /></div>
      <div className="md:col-span-2"><div className="label">Details</div><Input {...form.register(`items.${index}.details`)} placeholder="Seat-in-coach / Private car / vessel class etc." /></div>
      {t === "intercity" && (<div><div className="label">Members</div><Input type="number" step="1" {...form.register(`items.${index}.members`)} placeholder="e.g., 2" /></div>)}
      {t === "car_rental" && (<><div className="md:col-span-2"><div className="label">Car Type</div><select className="input" {...form.register(`items.${index}.carType`)} onChange={(e)=>{const v=e.target.value; form.setValue(`items.${index}.carType`, v); if(v!=="Other") form.setValue(`items.${index}.customCarType`, ""); }}> <option value="">Select car type</option>{CAR_TYPES.map((c,i)=>(<option key={i} value={c}>{c}</option>))}<option value="Other">Other</option></select></div>{form.watch(`items.${index}.carType`)==="Other" && (<div className="md:col-span-2"><div className="label">Enter car type</div><Input {...form.register(`items.${index}.customCarType`)} placeholder="e.g., Custom car"/></div>)}<div><div className="label">Members</div><Input type="number" min="0" {...form.register(`items.${index}.members`)} placeholder="e.g., 2" /></div><div><div className="label">Pickup Date</div><Input type="date" {...form.register(`items.${index}.startDate`)} /></div><div><div className="label">Pickup Time</div><Input type="time" {...form.register(`items.${index}.pickupTime`)} /></div><div><div className="label">Drop-off Date</div><Input type="date" {...form.register(`items.${index}.endDate`)} /></div><div><div className="label">Drop-off Time</div><Input type="time" {...form.register(`items.${index}.dropoffTime`)} /></div></>)}{t === "bike_rental" && (<><div className="md:col-span-2"><div className="label">Bike Type</div><select className="input" {...form.register(`items.${index}.bikeType`)} onChange={(e)=>{const v=e.target.value; form.setValue(`items.${index}.bikeType`, v); if(v!=="Other") form.setValue(`items.${index}.customBikeType`, ""); }}> <option value="">Select bike type</option>{BIKE_TYPES.map((c,i)=>(<option key={i} value={c}>{c}</option>))}<option value="Other">Other</option></select></div>{form.watch(`items.${index}.bikeType`)==="Other" && (<div className="md:col-span-2"><div className="label">Enter bike type</div><Input {...form.register(`items.${index}.customBikeType`)} placeholder="e.g., Custom bike"/></div>)}<div><div className="label">Members</div><Input type="number" min="0" {...form.register(`items.${index}.members`)} placeholder="e.g., 2" /></div><div><div className="label">Pickup Date</div><Input type="date" {...form.register(`items.${index}.startDate`)} /></div><div><div className="label">Pickup Time</div><Input type="time" {...form.register(`items.${index}.pickupTime`)} /></div><div><div className="label">Drop-off Date</div><Input type="date" {...form.register(`items.${index}.endDate`)} /></div><div><div className="label">Drop-off Time</div><Input type="time" {...form.register(`items.${index}.dropoffTime`)} /></div></>)}{t === "other" && (<><div className="md:col-span-2"><div className="label">Transfer Type</div><Input {...form.register(`items.${index}.customTransferType`)} placeholder="e.g., Helicopter, Charter, etc."/></div></>)}<div><div className="label">Date</div><Input type="date" {...form.register(`items.${index}.startDate`)} /></div>
      <div><div className="label">Currency</div><Input disabled value={globalCurrency} /></div>
      <div><div className="label">Price</div><Input type="number" step="0.01" {...form.register(`items.${index}.basePrice`, { onChange: recalc })} /></div>
      <div><div className="label">Markup %</div><Input type="number" step="0.01" {...form.register(`items.${index}.markupPercent`, { onChange: recalc })} /></div>
      <div><div className="label">Total (auto)</div><Input type="number" step="0.01" {...form.register(`items.${index}.totalPrice`)} /></div>
      <div className="md:col-span-2"><div className="label">Cancellation Policy</div>
        <div className="grid grid-cols-2 gap-2">
          <Input disabled value="Free Cancellation before" />
          <Input type="date" {...form.register(`items.${index}.cancellationBefore`)} />
        </div>
      </div>
      <div className="md:col-span-2 flex items-end gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" onChange={(e) => e.target.checked && duplicateReturn()} />
          <span>Add return segment (duplicates & flips Source/Destination)</span>
        </label>
      </div>
    </div>
  );
}
