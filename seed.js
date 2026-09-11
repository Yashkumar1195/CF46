/**
 * CashFlow Saathi - Initial Seed Data
 * Tailored for Ramesh Bhai (Shree Snacks & General Store)
 * Team 46 | Kalpvruksh 2.0 Mini Hackathon
 */

const SEED_DATA = {
  vendor: {
    name: "Ramesh Bhai Patel",
    businessName: "Shree Snacks & General Store",
    city: "Ahmedabad, Gujarat",
    category: "Kirana & Snacks",
    upiId: "shreesnacks@okaxis",
    accountNumber: "•••• 4821",
    bankName: "State Bank of India",
    safetyBuffer: 1500, // ₹ Safety reserve
    currency: "₹"
  },
  
  // Balances as shown on PDF Slide 2 mockup
  initialBalances: {
    cash: 3200,
    bank: 5800,
    upi: 2100,
    card: 380,
    credit: 1000 // Customer credit / khata receivable
  },

  // Realistic transaction log
  transactions: [
    {
      id: "tx-101",
      date: "2026-09-11T09:15:00",
      type: "income",
      category: "Daily Sales",
      amount: 1450,
      method: "cash",
      status: "settled",
      settlementOffsetDays: 0,
      description: "Morning breakfast & tea counter sales",
      party: "Walk-in Customers"
    },
    {
      id: "tx-102",
      date: "2026-09-11T10:40:00",
      type: "income",
      category: "UPI Payment",
      amount: 2100,
      method: "upi",
      status: "settled",
      settlementOffsetDays: 0,
      description: "QR Code snacks & grocery purchases",
      party: "Various UPI Payers"
    },
    {
      id: "tx-103",
      date: "2026-09-11T11:20:00",
      type: "income",
      category: "Card Swipe",
      amount: 380,
      method: "card",
      status: "pending",
      settlementOffsetDays: 1,
      description: "POS swipe for premium packaged sweets",
      party: "Mr. Sharma"
    },
    {
      id: "tx-104",
      date: "2026-09-11T11:45:00",
      type: "receivable",
      category: "Customer Khata",
      amount: 1000,
      method: "credit",
      status: "pending",
      dueDate: "2026-09-15",
      description: "Weekly provision on credit (Khata book)",
      party: "Joshi Kaka (Flat 302)"
    },
    {
      id: "tx-105",
      date: "2026-09-10T17:00:00",
      type: "expense",
      category: "Personal Draw",
      amount: 500,
      method: "cash",
      status: "settled",
      settlementOffsetDays: 0,
      description: "Household vegetable & milk purchase",
      party: "Personal"
    },
    {
      id: "tx-106",
      date: "2026-09-10T14:30:00",
      type: "expense",
      category: "Shop Rent",
      amount: 2500,
      method: "bank",
      status: "settled",
      settlementOffsetDays: 0,
      description: "Monthly shop lease installment",
      party: "Landlord Trivedi Ji"
    },
    {
      id: "tx-107",
      date: "2026-09-12T16:00:00",
      type: "expense",
      category: "Dairy & Milk",
      amount: 1800,
      method: "upi",
      status: "upcoming",
      isEssential: true,
      description: "Amul Milk crates & butter delivery",
      party: "Amul Agency"
    },
    {
      id: "tx-108",
      date: "2026-09-14T11:00:00",
      type: "expense",
      category: "Wholesale Supplier",
      amount: 4530,
      method: "bank",
      status: "upcoming",
      isEssential: true,
      description: "Weekly grains, spices & cooking oil restock",
      party: "Mahalaxmi Traders"
    }
  ],

  // Inventory list for Smart Restock
  inventory: [
    {
      id: "inv-1",
      name: "Wagh Bakri Chai (Tea)",
      category: "Beverages",
      unit: "kg",
      stock: 3,
      minStock: 8,
      sales7Days: 16,
      unitCost: 80,
      recommendedQty: 15,
      totalCost: 1200,
      status: "low"
    },
    {
      id: "inv-2",
      name: "Madhur Pure Sugar",
      category: "Staples",
      unit: "kg",
      stock: 12,
      minStock: 25,
      sales7Days: 35,
      unitCost: 45,
      recommendedQty: 25,
      totalCost: 1125,
      status: "low"
    },
    {
      id: "inv-3",
      name: "Fortune Cottonseed Oil",
      category: "Oils",
      unit: "liters",
      stock: 4,
      minStock: 15,
      sales7Days: 22,
      unitCost: 140,
      recommendedQty: 18,
      totalCost: 2520,
      status: "critical"
    },
    {
      id: "inv-4",
      name: "Chana Besan (Gram Flour)",
      category: "Flours",
      unit: "kg",
      stock: 8,
      minStock: 15,
      sales7Days: 19,
      unitCost: 95,
      recommendedQty: 12,
      totalCost: 1140,
      status: "medium"
    },
    {
      id: "inv-5",
      name: "Parle-G & Marie Biscuits",
      category: "Snacks",
      unit: "packs",
      stock: 25,
      minStock: 40,
      sales7Days: 55,
      unitCost: 10,
      recommendedQty: 40,
      totalCost: 400,
      status: "good"
    },
    {
      id: "inv-6",
      name: "Thums Up & Limca 250ml",
      category: "Beverages",
      unit: "bottles",
      stock: 10,
      minStock: 30,
      sales7Days: 45,
      unitCost: 18,
      recommendedQty: 30,
      totalCost: 540,
      status: "low"
    }
  ],

  // Government & Compliance Schemes (Slide 4, Slide 6)
  schemes: [
    {
      id: "sch-1",
      title: "PM SVANidhi Scheme",
      ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
      badge: "Collateral Free",
      benefit: "₹10,000 to ₹50,000 Working Capital Loan",
      interest: "7% Interest Subsidy on regular digital repayments",
      eligibility: "Street vendors, hawkers, small food stall owners with vending cert/ID",
      summary: "Special micro-credit facility to help vendors restart and expand working capital with cash-back incentives for digital transactions.",
      status: "Recommended for You",
      tag: "Working Capital"
    },
    {
      id: "sch-2",
      title: "Pradhan Mantri MUDRA Yojana (PMMY)",
      ministry: "Ministry of Finance",
      badge: "Govt. Backed",
      benefit: "Shishu: Up to ₹50,000 | Kishor: Up to ₹5 Lakh",
      interest: "Competitive bank rates, zero collateral",
      eligibility: "Non-corporate, non-farm micro enterprises (Kirana, snack shops)",
      summary: "Institutional credit for micro-retailers to buy refrigeration, storage shelves, or bulk stock at wholesale rates.",
      status: "Eligible",
      tag: "Expansion Loan"
    },
    {
      id: "sch-3",
      title: "Udyam MSME Registration",
      ministry: "Ministry of Micro, Small and Medium Enterprises",
      badge: "Instant Free Certificate",
      benefit: "Priority sector bank lending, subsidy on patent/trademark, 45-day payment security",
      interest: "Free online registration via Aadhaar",
      eligibility: "Any micro-business with turnover up to ₹5 Crore",
      summary: "Formalizes your kirana store as a recognized Micro-Enterprise. Unlocks government supplier protections and interest rebates.",
      status: "High Priority",
      tag: "Formalization"
    },
    {
      id: "sch-4",
      title: "GST Composition Scheme (Section 10)",
      ministry: "GST Council / CBIC",
      badge: "Simplified Tax",
      benefit: "Pay only 1% flat tax on turnover, quarterly simple return (CMP-08)",
      interest: "No elaborate bookkeeping required",
      eligibility: "Small businesses with annual turnover under ₹1.5 Crore",
      summary: "Relieves vendors from maintaining detailed HSN invoices. File 1 single tax payment per quarter in less than 10 minutes.",
      status: "Informational",
      tag: "Compliance"
    }
  ],

  // Initial Audit Trail (Slide 2 #10, Slide 4)
  auditLog: [
    {
      id: "aud-1",
      timestamp: "2026-09-11 08:30:15",
      action: "System Startup & Seed State Loaded",
      category: "System",
      details: "Loaded Ramesh Bhai profile (Shree Snacks) with ₹12,480 base funds"
    },
    {
      id: "aud-2",
      timestamp: "2026-09-11 09:15:20",
      action: "Cash Inflow Recorded",
      category: "Inflow",
      details: "Added ₹1,450 walk-in sales (Immediate cash)"
    },
    {
      id: "aud-3",
      timestamp: "2026-09-11 10:40:11",
      action: "UPI Soundbox Payment Reconciled",
      category: "UPI",
      details: "Auto-reconciled ₹2,100 UPI payment from 14 transactions"
    },
    {
      id: "aud-4",
      timestamp: "2026-09-11 11:45:30",
      action: "Customer Khata Credit Extended",
      category: "Credit",
      details: "Recorded ₹1,000 receivable from Joshi Kaka due on Sep 15"
    }
  ]
};
