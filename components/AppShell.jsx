"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/sidebar";

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // close drawer on route change
  useEffect(() => {
    if (open) setOpen(false);
  }, [pathname]);

  const handleNavClick = (e) => {
    const el = e.target;
    if (el && el.closest && el.closest("a")) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r border-white/10">
        <div className="h-full drawer-sidebar">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur border-b border-white/10">
        <div className="h-14 flex items-center justify-between px-4">
          {/* Menu button */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-xl h-10 w-10 border border-white/10 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {/* Hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
            >
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"></path>
            </svg>
          </button>

          <div className="font-semibold tracking-wide">QuoteGen</div>

          {/* Logout button (mobile) */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Drawer (mobile) */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-80 bg-zinc-950 border-r border-white/10 transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          {/* Drawer Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
            <div className="font-semibold">Menu</div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-xl h-10 w-10 border border-white/10 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.3l6.3 6.3 6.29-6.3z"></path>
              </svg>
            </button>
          </div>

          {/* Drawer Buttons */}
          <div className="p-4 border-b border-white/10 flex flex-col gap-3">
            <Link
              href="/quotes/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow inline-flex items-center justify-center w-full text-center"
              onClick={() => setOpen(false)}
            >
              + New Quotation
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow w-full"
            >
              Logout
            </button>
          </div>

          <div
            className="overflow-y-auto h-[calc(100%-9rem)] drawer-sidebar"
            onClick={handleNavClick}
          >
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 md:px-6 py-20 md:py-6 container">
        {/* Header Row (desktop) */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Dashboard</h1>

          <div className="flex gap-3">
            <Link
              href="/quotes/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow inline-flex items-center justify-center"
            >
              + New Quotation
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
            >
              Logout
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
