# 📒 BillBook — Smart Business Billing App

A complete, production-ready billing and accounting web app for small businesses.
Inspired by MyBillBook. Built with React + Vite. **No backend required** — all data stored in `localStorage`.

---

## ✨ Features

- **Dashboard** — Sales KPIs, quick actions, recent invoices
- **Sales Invoices** — Create/edit/delete with multi-item rows, GST tax, discounts, due dates
- **Purchase Bills** — Track supplier/purchase bills separately
- **Customers** — Full CRUD, auto-fill in invoices, billing stats per customer
- **Products & Services** — Catalog with SKU, stock management, low-stock alerts
- **Expenses** — Track by category with visual breakdown
- **Reports** — Monthly P&L, top customers, invoice status overview
- **Settings** — Business profile (shown on invoices), export/import backup
- **Print-ready Invoices** — Professional invoice view with print/PDF support
- **GST Support** — 0%, 5%, 12%, 18%, 28% tax rates

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5173

### Build for Production

```bash
npm run build
```
Output is in the `dist/` folder — ready to deploy!

---

## 🌐 Hosting Guide

### Option 1: Netlify (Recommended — Free)
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → New site → Deploy manually
3. Drag & drop the `dist/` folder
4. Done! You get a live URL instantly.

Or connect your GitHub repo and it auto-deploys on every push.

### Option 2: Vercel (Free)
```bash
npm install -g vercel
vercel
```
Follow the prompts — it detects Vite automatically.

### Option 3: GitHub Pages
```bash
# In vite.config.js, add: base: '/your-repo-name/'
npm run build
# Upload dist/ contents to gh-pages branch
```

### Option 4: Any Static Host
Just upload the contents of `dist/` to any web host (Hostinger, cPanel, S3, Firebase Hosting, etc.)

---

## 📁 Project Structure

```
billbook/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Shared UI primitives (Card, Btn, Input, etc.)
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Dashboard.jsx    # Home dashboard
│   │   ├── InvoiceForm.jsx  # Create/edit invoice
│   │   ├── InvoiceView.jsx  # Print-ready invoice view
│   │   ├── InvoicesList.jsx # Invoices & Purchases list
│   │   ├── Customers.jsx    # Customer management
│   │   ├── Products.jsx     # Product catalog
│   │   ├── Expenses.jsx     # Expense tracking
│   │   ├── Reports.jsx      # Analytics & reports
│   │   └── Settings.jsx     # Business settings + backup
│   ├── utils/
│   │   ├── helpers.js       # Formatting, calculations
│   │   └── storage.js       # localStorage helpers
│   ├── constants.js         # Colors, tax rates, categories
│   ├── App.jsx              # Root component + routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 💾 Data Storage

All data is stored in the browser's `localStorage` under the key `billbook_data_v1`.
Use **Settings → Export Backup** to download a JSON backup file regularly.
Use **Settings → Import Backup** to restore from a backup.

---

## 🖨️ Printing Invoices

Open any invoice → click **Print / Download PDF**.
The sidebar and controls are hidden during print for a clean output.
Use your browser's "Save as PDF" option to generate PDFs.

---

## 🛠️ Tech Stack

- **React 18** — UI
- **Vite 5** — Build tool
- **localStorage** — Data persistence (no backend needed)
- Pure CSS-in-JS (no external CSS library)

---

## 📝 License

MIT — free for personal and commercial use.
