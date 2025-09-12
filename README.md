
# QuoteGen – Client PDF (v1.2.1)
- Global currency selector (applies to all items)
- Footer/Brand on its own card
- Notes: choose default or custom; PDF always titled **Important Notes**
- Accommodation (island→hotel), Transfers, Activities
- Client-side PDF via html2pdf.js

## Run
npm install
cp .env.local.example .env.local  # fill MONGO_URI, JWT_SECRET, ADMIN_*
npm run dev
