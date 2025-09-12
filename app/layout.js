import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "QuoteGen",
  description: "High-speed travel quotation generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
