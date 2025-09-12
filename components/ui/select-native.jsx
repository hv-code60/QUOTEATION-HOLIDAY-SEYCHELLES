
"use client";
import React from "react";

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Accessible native select with calmer dark styling */
export default function SelectNative({ className = "", children, ...props }) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className={[
          "h-10 w-full appearance-none rounded-xl px-3 pr-9",
          "bg-zinc-900/70 text-zinc-100 placeholder:text-zinc-400",
          "border border-white/10 outline-none ring-0",
          "focus:border-sky-500/60 focus:ring-2 focus:ring-sky-500/40",
          "transition-colors"
        ].join(" ")}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}
