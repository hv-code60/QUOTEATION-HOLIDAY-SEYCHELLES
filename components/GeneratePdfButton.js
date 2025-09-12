
"use client";
import { useState } from "react";
import { quoteToHtml } from "@/lib/pdf-template-client";
export default function GeneratePdfButton({ id }){
  function sanitizeFileName(name){
    if(!name) return "quote";
    const s = name.toString().trim().replace(/[\/:*?\"<>|]+/g, " ");
    return s.replace(/\s+/g, "_").slice(0,120);
  }
  const [loading,setLoading]=useState(false);
  async function generate(){
    try{
      setLoading(true);
      const res = await fetch(`/api/quotes/${id}`);
      const q = await res.json();
      const html = quoteToHtml(q);
      const html2pdf = (await import("html2pdf.js")).default;
      const fname = sanitizeFileName(q.agentSubject || q.subject || `quote_${id}`) + ".pdf";
      const opt = { margin:10, filename: fname, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true}, jsPDF:{unit:'mm',format:'a4',orientation:'portrait'} };
      await html2pdf().from(html).set(opt).save();
    } finally { setLoading(false); }
  }
  return (<button className="btn btn-ghost" type="button" onClick={generate} disabled={loading}>{loading ? "Generating..." : "Download PDF"}</button>);
}
