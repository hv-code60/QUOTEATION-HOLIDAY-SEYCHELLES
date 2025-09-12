
import Link from "next/link";
export default function Sidebar(){
  const nav=[{href:"/dashboard",label:"Dashboard"},{href:"/quotes/new",label:"New Quote"}];
  return (<aside className="h-screen sticky top-0 w-60 bg-surface border-r border-white/10 p-4">
    <div className="text-xl font-bold mb-4">QuoteGen</div>
    <nav className="space-y-2">{nav.map(n=>(<Link key={n.href} href={n.href} className="block px-3 py-2 rounded-xl hover:bg-white/10">{n.label}</Link>))}</nav>
  </aside>);
}
