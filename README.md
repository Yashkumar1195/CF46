# CashFlow Saathi 🤝
> *"Know your money. Plan your next move."*  
> **Kalpvruksh 2.0 Mini Hackathon | Team 46 (CF46)**  
> **Problem Statement ID: 1.5** — Fragmented Cashflow Visibility For Vendors  
> **Domain:** FinTech

---

## 🚀 Quick Start (Instant Run)

### Method 1: Using Python (Recommended)
From PowerShell / Command Prompt:
```powershell
cd c:\Users\syb11\OneDrive\Desktop\hackathon\cashflow-saathi
python server.py
```
*The server will start at `http://localhost:5173` and automatically open your web browser!*

### Method 2: Direct Browser Launch (Zero Installation)
Simply double-click `index.html` or open it in Google Chrome, Microsoft Edge, or Firefox.  
The prototype runs 100% client-side with full `localStorage` persistence!

---

## 🎯 12 Core Features (Directly from PDF Presentation)

| # | Feature | Live Implementation in Prototype |
|---|---------|----------------------------------|
| **0** | **Demo Login & Merchant Personas** | Dedicated onboarding screen with 1-click launch for **Ramesh Bhai (Shree Snacks)**, alternative persona **Priya Sharma (Sharmaji Kirana)**, or custom store creator. |
| **1** | **One Simple Money View** | Shows **Total Funds (Available Now): ₹12,480** with real-time breakdown: Cash (₹3,200), Bank (₹5,800), UPI (₹2,100), Card (₹380), and Customer Khata Credit (₹1,000). |
| **2** | **Settlement-Aware Cash Flow** | Models payment settlement lags: Cash (0d), UPI (Instant/0d), Card Swipe (T+1), Bank Transfer (T+2), Khata Credit (Due date). |
| **3** | **Safe-to-Spend** | Calculates **₹4,650** using the transparent formula: `Available Cash − Upcoming Essential Payments − Safety Buffer`. |
| **4** | **Cash Health Score** | Visual gauge score **78/100 Good** ("You're on track!") based on liquidity ratio and settlement risk. |
| **5** | **7-Day Cash Flow Forecast** | Interactive line chart projecting day-by-day cash balance over 7 days with custom tooltips. |
| **6** | **Early Shortage Alert Engine** | Highlights **⚠️ Cash pressure expected in 3 days** due to the upcoming ₹4,530 wholesale supplier bill. |
| **7** | **Ask Saathi (AI Guidance)** | Rule-based conversational assistant answering queries like *"Can I buy ₹8,000 stock today?"*, *"Why is my cash low?"*, and supplier dues questions. |
| **8** | **Smart Restock** | Dynamic inventory ordering table that strictly enforces the **Safe-to-Spend limit** so vendors never over-purchase. |
| **9** | **English + Hindi + Gujarati** | Instant trilingual toggle (`English`, `हिन्दी`, `ગુજરાતી`) for all labels, cards, and alerts. |
| **10** | **Immutable Audit Trail** | Timestamped chronological log of all transactions, edits, and reconciliation actions with CSV export. |
| **11** | **Future-Ready UPI & Bank Hub** | Simulated Soundbox QR receive voice alert (+₹500 test button) and Bank Account Aggregator auto-reconcile. |
| **12** | **Government Schemes Layer** | Curated guides for PM SVANidhi (street vendor loan), MUDRA (PMMY), Udyam MSME, and GST Composition Scheme. |
| **13** | **Store & Financial Settings** | Live safety buffer slider (adjusting buffer dynamically recalculates Safe-to-Spend in real-time), store profile manager, language controls, and data backup. |

---

## 🎤 2-Minute Hackathon Demo Script (For Judges)

1. **The Hook (30 sec)**:
   - *"Respected judges, Indian micro-vendors receive payments through Cash, UPI, Cards, and Khata credit, but **sales do not equal available cash**. Digital receipts settle late, and suppliers demand payment before funds clear."*
   - Show the header: *"Namaste, Ramesh Bhai (Shree Snacks & General Store) - Total Funds: ₹12,480"*.
2. **The Core Innovation — Safe-to-Spend (30 sec)**:
   - *"Instead of complicated accounting jargon, CashFlow Saathi gives vendors one golden number: **Safe to Spend Today = ₹4,650**."*
   - Point out the formula: `₹12,480 (Funds) − ₹6,330 (Upcoming Dues) − ₹1,500 (Safety Buffer) = ₹4,650`.
3. **The 7-Day Forecast & Shortage Alert (30 sec)**:
   - Point to the red pulse banner: *"⚠️ Cash pressure expected in 3 days"*.
   - *"The system projects that in 3 days, a ₹4,530 wholesale supplier payment will cause cash tightness. It advises Ramesh Bhai to collect ₹1,000 from Joshi Kaka's khata before the weekend."*
4. **Interactive Ask Saathi & Smart Restock (30 sec)**:
   - Click **Ask Saathi** → Tap *"Can I buy ₹8,000 of stock today?"* → Saathi answers: *"⚠️ Not recommended. Safe-to-Spend is ₹4,650. Spending ₹8,000 would cause supplier default in 3 days."*
   - Click **Smart Restock** → Show that items within ₹4,650 are approved, while large bulk orders are flagged as "Exceeds Safe Limit".
   - Switch language to **हिन्दी** or **ગુજરાતી** to demonstrate inclusivity!
   - Tap **Simulate UPI Payment (+₹500)** → Watch the balance and Safe-to-Spend update reactively with soundbox alert!

---

## 💻 Tech Architecture

- **Frontend:** HTML5 + Tailwind CSS (via CDN) + Chart.js + Lucide Icons + Vanilla ES6 JS.
- **Cash-Flow Engine:** Dedicated deterministic finance engine calculating settlement lags, coverage ratios, and forecasts.
- **Persistence:** Offline-first `localStorage` with initial seed data restore.
- **Server:** Zero-dependency Python 3 standard library (`http.server`).

*Built with ❤️ by Team 46 for Kalpvruksh 2.0 Mini Hackathon.*

