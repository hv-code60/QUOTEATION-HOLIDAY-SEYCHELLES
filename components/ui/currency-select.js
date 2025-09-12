
"use client";
import { useMemo, useState, useEffect } from "react";
import Input from "./input";
const CURRENCIES = [
  ["INR","Indian Rupee"],["EUR","Euro"],["USD","US Dollar"],["OMR","Omani Rial"],
  ["AED","UAE Dirham"],["GBP","Pound Sterling"],["SGD","Singapore Dollar"],
  ["THB","Thai Baht"],["LKR","Sri Lankan Rupee"],["MUR","Mauritian Rupee"]
];
export default function CurrencySelect({ value, onChange, placeholder="Search currency…" }){
  const [query,setQuery]=useState(""); const [open,setOpen]=useState(false);
  useEffect(()=>{ if(!value) onChange?.("INR"); },[value,onChange]);
  const filtered = useMemo(()=>{
    const q=query.trim().toLowerCase(); if(!q) return CURRENCIES;
    return CURRENCIES.filter(([c,n])=>c.toLowerCase().includes(q)||n.toLowerCase().includes(q));
  },[query]);
  const selected = CURRENCIES.find(([c])=>c===value);
  return (
    <div className="relative">
      <div className="label">Global Currency</div>
      <Input onFocus={()=>setOpen(true)} value={selected?`${selected[0]} — ${selected[1]}`:query}
             onChange={e=>setQuery(e.target.value)} placeholder={placeholder}/>
      {open&&(
        <div className="absolute z-20 mt-2 w-full card p-0 max-h-64 overflow-auto">
          {filtered.map(([code,name])=>(
            <button key={code} type="button" className="w-full text-left px-3 py-2 hover:bg-white/10"
              onClick={()=>{onChange?.(code); setOpen(false); setQuery('');}}>
              {code} — {name}
            </button>
          ))}
          {filtered.length===0&&<div className="px-3 py-2 text-white/60">No match</div>}
        </div>
      )}
    </div>
  );
}
