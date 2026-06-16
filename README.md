# Contacts Dashboard

A clean Next.js 14 + Tailwind CSS dashboard that reads data from your Google Sheet via Apps Script and displays it in a searchable, filterable table. Includes a one-click **Add Contact** button that opens your Google Form.

---

## Features

- 📊 Live data from Google Sheets (via Apps Script Web App)
- 🔍 Search by name, company, city, email, or phone
- 🏷️ Filter by Contact Type
- 📈 Summary stats — total contacts, companies, cities, types
- ➕ "Add Contact" button → opens your Google Form in a new tab
- 🔄 Manual refresh button
- 📱 Fully responsive (mobile-friendly)

---

## Project Structure

```
contacts-dashboard/
├── app/
│   ├── api/contacts/route.ts   ← Next.js API route (calls Apps Script)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Dashboard.tsx           ← Main UI component
│   ├── ContactsTable.tsx       ← Data table
│   ├── StatCard.tsx            ← Stats cards
│   └── Badge.tsx               ← Contact type badge
├── lib/
│   └── types.ts                ← TypeScript types
├── apps-script/
│   └── Code.gs                 ← Paste this into Google Apps Script
├── .env.example                ← Copy to .env.local and fill in
└── README.md
```

---

## Setup Guide

### Step 1 — Google Apps Script (backend)

1. Open your Google Sheet (the one with your contacts data)
2. Go to **Extensions → Apps Script**
3. Delete all existing code and paste the contents of `apps-script/Code.gs`
4. If your sheet tab is not named `Sheet1`, update the `SHEET_NAME` constant at the top
5. Press **Ctrl+S** to save
6. Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy** and **copy the Web App URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

> ⚠️ Every time you edit the script you must create a **New deployment** (not update) for changes to take effect.

### Step 2 — Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
NEXT_PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/YOUR_FORM_ID/viewform
```

### Step 3 — Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Google Sheet Column Headers

Your sheet's **first row** must have these exact headers (order doesn't matter):

| Column | Description |
|--------|-------------|
| Timestamp | Auto-filled by Google Forms or entered manually |
| Name | Contact's full name |
| Phone No | Phone number |
| Company Name | Company / organisation |
| Address | Street address |
| Email | Email address |
| City | City |
| Pincode | PIN / ZIP code |
| Contact Type | e.g. Client, Lead, Vendor, Partner |
| Remarks | Notes or follow-up comments |

---

## Deployment (Vercel)

```bash
npm run build   # verify no errors
```

Then push to GitHub and import into [vercel.com](https://vercel.com). Add the two environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## Development Notes

- Sample/mock data is shown automatically when `NEXT_PUBLIC_APPS_SCRIPT_URL` is not set — great for local development without needing a live sheet.
- The API route (`/api/contacts`) acts as a proxy to avoid CORS issues when calling Apps Script from the browser.
- Data is fetched fresh on every page load and on manual refresh (no caching).
