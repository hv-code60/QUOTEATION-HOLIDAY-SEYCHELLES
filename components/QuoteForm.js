
<Card>
  <div className="grid md:grid-cols-4 gap-4">
    <div><div className="label">Destination</div><Input {...form.register("destination")} placeholder="e.g., Seychelles" /></div>
    <div><div className="label">Start</div><Input type="date" {...form.register("travelStart")} /></div>
    <div><div className="label">End</div><Input type="date" {...form.register("travelEnd")} /></div>
    <CurrencySelect value={form.watch("currency")} onChange={(v) => form.setValue("currency", v)} />
  </div>
</Card>
<Card>
  <div className="grid md:grid-cols-4 gap-4">
    <div className="md:col-span-2"><div className="label">Footer / Brand</div>
      <select className="input" {...form.register("footerBrand")}>
        <option value="holidays_seychelle">Holidays Seychelle</option>
        <option value="oceanic_travel">Oceanic Travel Co. (dummy)</option>
        <option value="sunrise_journeys">Sunrise Journeys (dummy)</option>
      </select>
    </div>
  </div>
</Card>
