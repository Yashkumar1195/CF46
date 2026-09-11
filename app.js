/**
 * CashFlow Saathi - Main UI Application Controller
 * Team 46 | Kalpvruksh 2.0 Mini Hackathon
 * Connects CashFlow Engine, Ask Saathi, Audit Manager, i18n & Chart.js
 */

class CashFlowSaathiApp {
  constructor() {
    this.storageKey = "cashflow_saathi_state_v1";
    this.state = this.loadInitialState();
    this.engine = new CashflowEngine(this.state);
    this.askSaathi = new AskSaathiEngine(() => this.state);
    this.audit = new AuditManager(
      () => this.state,
      (updates) => this.updateState(updates)
    );
    
    this.currentTab = "home"; // 'home' | 'transactions' | 'restock' | 'forecast' | 'askSaathi' | 'schemes' | 'reconcile' | 'audit' | 'settings' | 'login'
    this.viewMode = "mobile"; // 'mobile' | 'desktop'
    this.forecastChartInstance = null;
    this.chatMessages = [
      {
        sender: "saathi",
        time: "Just now",
        text: "Namaste Ramesh Bhai! 🙏 I'm your CashFlow Saathi. Ask me anything about your cash, supplier dues, or whether you can afford new stock today!"
      }
    ];

    this.recompute();
  }

  loadInitialState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load from localStorage, fallback to seed:", e);
    }

    return {
      isLoggedIn: true,
      activeProfile: "ramesh",
      vendor: { ...SEED_DATA.vendor },
      balances: { ...SEED_DATA.initialBalances },
      transactions: [...SEED_DATA.transactions],
      inventory: [...SEED_DATA.inventory],
      schemes: [...SEED_DATA.schemes],
      auditLog: [...SEED_DATA.auditLog],
      settings: {
        language: "en",
        safetyBuffer: 1500,
        voiceAlerts: true,
        shortageAlerts: true
      }
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }

  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.recompute();
    this.saveState();
  }

  recompute() {
    this.engine.state = this.state;
    this.state.metrics = this.engine.computeMetrics();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Nav links
    document.querySelectorAll("[data-nav]").forEach(el => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = el.getAttribute("data-nav");
        this.switchTab(targetTab);
      });
    });

    // Language Selector
    const langSelect = document.getElementById("langSelect");
    if (langSelect) {
      langSelect.value = this.state.settings.language || "en";
      langSelect.addEventListener("change", (e) => {
        this.setLanguage(e.target.value);
      });
    }

    // View Mode Toggle (Mobile / Desktop)
    const viewToggle = document.getElementById("viewModeToggle");
    if (viewToggle) {
      viewToggle.addEventListener("click", () => {
        this.toggleViewMode();
      });
    }

    // Modal close triggers
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.closeAllModals();
      });
    });

    // Add Transaction Form
    const txForm = document.getElementById("addTransactionForm");
    if (txForm) {
      txForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormAddTransaction(e.target);
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById("btnResetData");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset CashFlow Saathi to the original hackathon demo state?")) {
          this.resetToSeedData();
        }
      });
    }

    // Export CSV
    const exportBtn = document.getElementById("btnExportCSV");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.audit.exportTransactionsToCSV();
      });
    }

    // Quick Simulated UPI payment button
    const simUPIBtn = document.getElementById("btnSimulateUPI");
    if (simUPIBtn) {
      simUPIBtn.addEventListener("click", () => {
        this.simulateIncomingUPIPayment();
      });
    }

    // Chat form
    const chatForm = document.getElementById("chatForm");
    if (chatForm) {
      chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("chatInput");
        if (input && input.value.trim()) {
          this.sendChatMessage(input.value.trim());
          input.value = "";
        }
      });
    }
  }

  setLanguage(lang) {
    this.state.settings.language = lang;
    this.saveState();
    this.audit.log("Language Changed", "Settings", `UI switched to ${lang.toUpperCase()}`);
    this.render();
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "mobile" ? "desktop" : "mobile";
    const wrapper = document.getElementById("appSimulatorWrapper");
    const label = document.getElementById("viewModeLabel");
    const notch = document.getElementById("phoneNotch");
    const homeBar = document.getElementById("phoneHomeBar");

    if (wrapper) {
      if (this.viewMode === "mobile") {
        wrapper.classList.remove("desktop-mode");
        wrapper.classList.add("mobile-mode");
        if (label) label.textContent = "Switch to Desktop View 💻";
        if (notch) notch.style.display = "flex";
        if (homeBar) homeBar.style.display = "block";
      } else {
        wrapper.classList.remove("mobile-mode");
        wrapper.classList.add("desktop-mode");
        if (label) label.textContent = "Switch to Mobile Phone View 📱";
        if (notch) notch.style.display = "none";
        if (homeBar) homeBar.style.display = "none";
      }
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    // Update active state in bottom nav & desktop header
    document.querySelectorAll("[data-nav]").forEach(el => {
      if (el.getAttribute("data-nav") === tab) {
        el.classList.add("text-emerald-600", "font-bold");
        el.classList.remove("text-slate-500");
      } else {
        el.classList.remove("text-emerald-600", "font-bold");
        el.classList.add("text-slate-500");
      }
    });

    // Hide or show bottom nav when on login tab
    const bottomNav = document.querySelector("nav.fixed.bottom-0");
    if (bottomNav) {
      if (tab === "login") {
        bottomNav.classList.add("hidden");
      } else {
        bottomNav.classList.remove("hidden");
      }
    }

    this.renderTabContent();
  }

  render() {
    this.renderHeader();
    this.renderTabContent();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  renderHeader() {
    const lang = this.state.settings.language || "en";
    const greetingEl = document.getElementById("headerGreeting");
    const subGreetingEl = document.getElementById("headerSubGreeting");

    if (greetingEl) {
      greetingEl.textContent = this.state.vendor.name ? `Namaste, ${this.state.vendor.name.split(' ')[0]} Bhai` : t("greeting", lang);
    }
    if (subGreetingEl) {
      subGreetingEl.textContent = this.state.vendor.businessName || t("subGreeting", lang);
    }
  }

  renderTabContent() {
    const mainContent = document.getElementById("mainTabContent");
    if (!mainContent) return;

    switch (this.currentTab) {
      case "login":
        mainContent.innerHTML = this.getLoginViewHTML();
        this.bindLoginActions();
        break;
      case "home":
        mainContent.innerHTML = this.getHomeViewHTML();
        this.initForecastChart();
        this.bindHomeCards();
        break;
      case "transactions":
        mainContent.innerHTML = this.getTransactionsViewHTML();
        this.bindTransactionFilters();
        break;
      case "restock":
        mainContent.innerHTML = this.getRestockViewHTML();
        this.bindRestockActions();
        break;
      case "askSaathi":
        mainContent.innerHTML = this.getAskSaathiViewHTML();
        this.bindChatPrompts();
        break;
      case "forecast":
        mainContent.innerHTML = this.getDetailedForecastViewHTML();
        this.initDetailedForecastChart();
        break;
      case "schemes":
        mainContent.innerHTML = this.getSchemesViewHTML();
        break;
      case "reconcile":
        mainContent.innerHTML = this.getReconcileViewHTML();
        this.bindReconcileActions();
        break;
      case "audit":
        mainContent.innerHTML = this.getAuditViewHTML();
        break;
      case "settings":
        mainContent.innerHTML = this.getSettingsViewHTML();
        this.bindSettingsActions();
        break;
      default:
        mainContent.innerHTML = this.getHomeViewHTML();
        this.initForecastChart();
        this.bindHomeCards();
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /* ----------------------------------------------------
   * VIEW: Demo Login & Persona Switcher
   * ---------------------------------------------------- */
  getLoginViewHTML() {
    const lang = this.state.settings.language || "en";
    const v = this.state.vendor;

    return `
      <div class="space-y-4 pb-12 pt-2 animate-fadeIn">
        <!-- Logo & Branding -->
        <div class="text-center py-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg mb-2">
            ₹
          </div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight">${t("appName", lang)}</h2>
          <p class="text-xs text-slate-500 font-medium">${t("tagline", lang)}</p>
          <div class="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
            <i data-lucide="award" class="w-3 h-3"></i>
            <span>Kalpvruksh 2.0 Hackathon • Team 46</span>
          </div>
        </div>

        <!-- Section Title -->
        <div class="text-center">
          <h3 class="text-sm font-bold text-slate-800">${t("loginTitle", lang)}</h3>
          <p class="text-[11px] text-slate-500">${t("loginSubtitle", lang)}</p>
        </div>

        <!-- Persona 1: Ramesh Bhai (Primary PDF Persona) -->
        <div class="fintech-card p-4 border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/60 to-white shadow-md space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                RB
              </div>
              <div>
                <span class="text-xs font-black text-slate-900 block">Ramesh Bhai Patel</span>
                <span class="text-[11px] font-bold text-emerald-700">Shree Snacks & General Store</span>
                <span class="text-[10px] text-slate-400 block">Ahmedabad, Gujarat • Kirana & Snacks</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
              Primary Demo
            </span>
          </div>

          <!-- Quick Metrics Preview -->
          <div class="grid grid-cols-3 gap-1.5 py-1 text-center bg-white/80 rounded-xl p-2 border border-emerald-100 text-[10px]">
            <div>
              <span class="text-slate-400 block">Total Funds</span>
              <span class="font-extrabold text-slate-900">₹12,480</span>
            </div>
            <div>
              <span class="text-slate-400 block">Safe to Spend</span>
              <span class="font-extrabold text-emerald-700">₹4,650</span>
            </div>
            <div>
              <span class="text-slate-400 block">Health Score</span>
              <span class="font-extrabold text-emerald-600">78 / 100</span>
            </div>
          </div>

          <!-- Launch Button -->
          <button onclick="app.loginAsPersona('ramesh')" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98">
            <i data-lucide="log-in" class="w-4 h-4"></i>
            <span>Try Demo (Ramesh Bhai) 🚀</span>
          </button>
        </div>

        <!-- Persona 2: Priya Sharma (Alternative Merchant) -->
        <div class="fintech-card p-4 border border-slate-200 bg-white hover:border-slate-300 space-y-3">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                PS
              </div>
              <div>
                <span class="text-xs font-black text-slate-900 block">Priya Sharma</span>
                <span class="text-[11px] font-bold text-purple-700">Sharmaji Daily Kirana & Provisions</span>
                <span class="text-[10px] text-slate-400 block">Surat, Gujarat • General Store & Dairy</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              High Khata
            </span>
          </div>

          <!-- Quick Metrics Preview -->
          <div class="grid grid-cols-3 gap-1.5 py-1 text-center bg-slate-50 rounded-xl p-2 text-[10px]">
            <div>
              <span class="text-slate-400 block">Total Funds</span>
              <span class="font-extrabold text-slate-900">₹18,900</span>
            </div>
            <div>
              <span class="text-slate-400 block">Safe to Spend</span>
              <span class="font-extrabold text-purple-700">₹7,200</span>
            </div>
            <div>
              <span class="text-slate-400 block">Health Score</span>
              <span class="font-extrabold text-purple-600">84 / 100</span>
            </div>
          </div>

          <button onclick="app.loginAsPersona('priya')" class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
            <span>Launch Priya's Store 🛒</span>
          </button>
        </div>

        <!-- Custom Quick Store Setup Accordion -->
        <div class="fintech-card p-3 border border-dashed border-slate-300 bg-slate-50/50">
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer list-none text-xs font-bold text-slate-700">
              <span class="flex items-center gap-1.5">
                <i data-lucide="store" class="w-3.5 h-3.5 text-slate-500"></i>
                <span>Or Enter Custom Store Details</span>
              </span>
              <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform"></i>
            </summary>
            
            <form id="customLoginForm" class="space-y-2.5 pt-3">
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-0.5">Shop Name</label>
                <input type="text" name="businessName" placeholder="e.g. Mahadev Tea Stall" required class="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-0.5">Owner Name</label>
                <input type="text" name="name" placeholder="e.g. Suresh Patil" required class="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-slate-600 mb-0.5">Initial Cash (₹)</label>
                  <input type="number" name="initialCash" value="5000" min="0" class="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-slate-600 mb-0.5">Safety Buffer (₹)</label>
                  <input type="number" name="safetyBuffer" value="1000" min="0" class="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg" />
                </div>
              </div>
              <button type="submit" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-xs">
                Launch My Custom Store ✨
              </button>
            </form>
          </details>
        </div>

        <!-- Hackathon Core Value Pills -->
        <div class="p-3 bg-slate-100 rounded-2xl text-center space-y-1 text-[11px] text-slate-600">
          <p class="font-bold text-slate-800">"Accounting tells you what happened.<br/>CashFlow Saathi helps you decide what to do next."</p>
          <div class="flex flex-wrap items-center justify-center gap-2 pt-1 text-[10px] text-slate-500">
            <span>• Offline-first localStorage</span>
            <span>• Settlement-aware T+0/1/2</span>
            <span>• Tri-lingual (EN, HI, GU)</span>
          </div>
        </div>
      </div>
    `;
  }

  loginAsPersona(personaKey) {
    if (personaKey === 'ramesh') {
      this.state.vendor = { ...SEED_DATA.vendor };
      this.state.balances = { ...SEED_DATA.initialBalances };
      this.state.transactions = [...SEED_DATA.transactions];
      this.state.activeProfile = "ramesh";
      this.state.isLoggedIn = true;
      this.audit.log("Demo Login", "Auth", "Logged in as Ramesh Bhai (Shree Snacks & General Store)");
    } else if (personaKey === 'priya') {
      this.state.vendor = {
        name: "Priya Sharma",
        businessName: "Sharmaji Daily Kirana & Provisions",
        city: "Surat, Gujarat",
        category: "General Store & Dairy",
        upiId: "sharmakiran@okhdfc",
        accountNumber: "•••• 7319",
        bankName: "HDFC Bank",
        safetyBuffer: 2000,
        currency: "₹"
      };
      this.state.balances = {
        cash: 4500,
        bank: 8200,
        upi: 3800,
        card: 900,
        credit: 1500
      };
      this.state.activeProfile = "priya";
      this.state.isLoggedIn = true;
      this.audit.log("Demo Login", "Auth", "Logged in as Priya Sharma (Sharmaji Kirana)");
    }

    this.recompute();
    this.saveState();
    this.switchTab("home");
  }

  bindLoginActions() {
    const customForm = document.getElementById("customLoginForm");
    if (customForm) {
      customForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const bName = customForm.businessName.value;
        const oName = customForm.name.value;
        const cash = Number(customForm.initialCash.value) || 5000;
        const buffer = Number(customForm.safetyBuffer.value) || 1000;

        this.state.vendor = {
          name: oName,
          businessName: bName,
          city: "India",
          category: "Retail / Stall",
          upiId: `${oName.toLowerCase().replace(/\s/g, '')}@okbank`,
          accountNumber: "•••• 1122",
          bankName: "State Bank of India",
          safetyBuffer: buffer,
          currency: "₹"
        };
        this.state.balances = {
          cash: cash,
          bank: 3000,
          upi: 2000,
          card: 0,
          credit: 500
        };
        this.state.activeProfile = "custom";
        this.state.isLoggedIn = true;

        this.recompute();
        this.saveState();
        this.audit.log("Custom Store Created", "Auth", `Initialized store for ${oName} (${bName})`);
        this.switchTab("home");
      });
    }
  }

  /* ----------------------------------------------------
   * VIEW: Settings Tab (Slide 2, Slide 4)
   * ---------------------------------------------------- */
  getSettingsViewHTML() {
    const lang = this.state.settings.language || "en";
    const v = this.state.vendor;
    const s = this.state.settings;
    const m = this.state.metrics;

    return `
      <div class="space-y-4 pb-20 animate-fadeIn">
        <div>
          <h2 class="text-lg font-bold text-slate-800">${t("settingsTitle", lang)}</h2>
          <p class="text-xs text-slate-500">${t("settingsSubtitle", lang)}</p>
        </div>

        <!-- 1. Store Profile Settings -->
        <div class="fintech-card p-4 space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <i data-lucide="store" class="w-4 h-4"></i>
              </div>
              <h3 class="text-xs font-bold text-slate-800">Store & Merchant Profile</h3>
            </div>
            <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active Store
            </span>
          </div>

          <form id="updateProfileForm" class="space-y-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">Business / Shop Name</label>
              <input type="text" id="settingBusinessName" value="${v.businessName}" required class="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-900" />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Owner Name</label>
                <input type="text" id="settingOwnerName" value="${v.name}" required class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                <input type="text" id="settingLocation" value="${v.city || 'Ahmedabad'}" class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">UPI VPA ID</label>
                <input type="text" id="settingUpiId" value="${v.upiId}" class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-600" />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Bank Account</label>
                <input type="text" id="settingBankAcc" value="${v.bankName} (${v.accountNumber})" class="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-600" />
              </div>
            </div>

            <button type="submit" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition">
              ${t("saveChanges", lang)}
            </button>
          </form>
        </div>

        <!-- 2. Financial Guardrails & Safe-to-Spend Parameters -->
        <div class="fintech-card p-4 space-y-3 bg-gradient-to-br from-white to-emerald-50/40 border-emerald-200">
          <div class="flex items-center gap-2 border-b border-emerald-100 pb-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <i data-lucide="shield" class="w-4 h-4"></i>
            </div>
            <div>
              <h3 class="text-xs font-bold text-slate-800">Financial Guardrails (Safe-to-Spend)</h3>
              <p class="text-[10px] text-slate-500">Configures minimum safety reserves and settlement timing</p>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-bold text-slate-700">${t("safetyBufferLabel", lang)}:</label>
              <span class="text-sm font-extrabold text-emerald-700" id="displaySafetyBuffer">₹${v.safetyBuffer.toLocaleString('en-IN')}</span>
            </div>
            
            <input
              type="range"
              id="safetyBufferSlider"
              min="500"
              max="5000"
              step="100"
              value="${v.safetyBuffer}"
              class="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div class="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹500 (Lean)</span>
              <span>₹1,500 (Recommended)</span>
              <span>₹5,000 (Conservative)</span>
            </div>

            <p class="text-[11px] text-slate-600 mt-2 bg-white/80 p-2 rounded-lg border border-emerald-100">
              💡 <strong>Instant Effect:</strong> Changing your buffer from ₹${v.safetyBuffer} directly adjusts your Safe-to-Spend limit (currently <strong>₹${m.safeToSpend}</strong>) and triggers early shortage warning thresholds.
            </p>
          </div>

          <!-- Settlement Offsets Reference -->
          <div class="pt-2 border-t border-emerald-100">
            <span class="text-[11px] font-bold text-slate-700 block mb-1.5">Configured Settlement Offsets:</span>
            <div class="grid grid-cols-2 gap-1.5 text-[11px]">
              <div class="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                <span class="text-slate-500">Cash & UPI:</span>
                <span class="font-bold text-emerald-600">0 Days (Instant)</span>
              </div>
              <div class="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                <span class="text-slate-500">Card POS:</span>
                <span class="font-bold text-blue-600">T+1 Day</span>
              </div>
              <div class="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                <span class="text-slate-500">Bank Transfer:</span>
                <span class="font-bold text-indigo-600">T+2 Days</span>
              </div>
              <div class="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between">
                <span class="text-slate-500">Khata Credit:</span>
                <span class="font-bold text-amber-600">Due Date</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Language & Accessibility Preferences -->
        <div class="fintech-card p-4 space-y-2.5">
          <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <i data-lucide="globe" class="w-4 h-4"></i>
            </div>
            <h3 class="text-xs font-bold text-slate-800">Language Preference (Slide 2 #9)</h3>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button onclick="app.setLanguage('en')" class="p-2.5 rounded-xl border text-xs font-bold text-center ${s.language === 'en' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700'}">
              English
            </button>
            <button onclick="app.setLanguage('hi')" class="p-2.5 rounded-xl border text-xs font-bold text-center ${s.language === 'hi' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700'}">
              हिन्दी (Hindi)
            </button>
            <button onclick="app.setLanguage('gu')" class="p-2.5 rounded-xl border text-xs font-bold text-center ${s.language === 'gu' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-700'}">
              ગુજરાતી (Gujarati)
            </button>
          </div>
        </div>

        <!-- 4. Data Management & Demo Controls -->
        <div class="fintech-card p-4 space-y-2.5">
          <div class="flex items-center gap-2 border-b border-slate-100 pb-2">
            <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <i data-lucide="database" class="w-4 h-4"></i>
            </div>
            <h3 class="text-xs font-bold text-slate-800">Data Management & Controls</h3>
          </div>

          <div class="space-y-2 text-xs">
            <button onclick="app.audit.exportTransactionsToCSV()" class="w-full p-2 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 flex items-center justify-between border border-slate-200">
              <span class="flex items-center gap-2">
                <i data-lucide="download" class="w-4 h-4 text-slate-500"></i>
                <span>Download Transactions CSV</span>
              </span>
              <span class="text-[10px] text-slate-400">Excel / Ledger</span>
            </button>

            <button onclick="app.audit.exportAuditToCSV()" class="w-full p-2 bg-slate-50 hover:bg-slate-100 rounded-xl font-semibold text-slate-700 flex items-center justify-between border border-slate-200">
              <span class="flex items-center gap-2">
                <i data-lucide="file-text" class="w-4 h-4 text-slate-500"></i>
                <span>Download Audit Trail Log</span>
              </span>
              <span class="text-[10px] text-slate-400">Compliance</span>
            </button>

            <button onclick="app.resetToSeedData()" class="w-full p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold flex items-center justify-between border border-amber-200">
              <span class="flex items-center gap-2">
                <i data-lucide="rotate-ccw" class="w-4 h-4 text-amber-600"></i>
                <span>Reset Demo State to Original Seed</span>
              </span>
              <span class="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded font-semibold">Seed</span>
            </button>

            <!-- Switch Store / Logout Button -->
            <button onclick="app.switchTab('login')" class="w-full p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm mt-2">
              <i data-lucide="users" class="w-4 h-4"></i>
              <span>${t("logoutBtn", lang)}</span>
            </button>
          </div>
        </div>

        <!-- Hackathon Team Footer Note -->
        <div class="text-center py-2 text-[10px] text-slate-400">
          <p>CashFlow Saathi v1.0 • Kalpvruksh 2.0 Mini Hackathon</p>
          <p>Team 46 (CF46) • Silver Oak University</p>
        </div>
      </div>
    `;
  }

  bindSettingsActions() {
    // Safety buffer slider live update
    const slider = document.getElementById("safetyBufferSlider");
    const display = document.getElementById("displaySafetyBuffer");
    if (slider && display) {
      slider.addEventListener("input", (e) => {
        const val = Number(e.target.value);
        display.textContent = `₹${val.toLocaleString('en-IN')}`;
        this.state.vendor.safetyBuffer = val;
        this.recompute();
        this.saveState();
      });

      slider.addEventListener("change", (e) => {
        const val = Number(e.target.value);
        this.audit.log("Safety Buffer Adjusted", "Parameters", `Safety reserve changed to ₹${val}`);
        this.render();
      });
    }

    // Profile update form
    const profileForm = document.getElementById("updateProfileForm");
    if (profileForm) {
      profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const bName = document.getElementById("settingBusinessName")?.value;
        const oName = document.getElementById("settingOwnerName")?.value;
        const loc = document.getElementById("settingLocation")?.value;
        const upi = document.getElementById("settingUpiId")?.value;

        if (bName) this.state.vendor.businessName = bName;
        if (oName) this.state.vendor.name = oName;
        if (loc) this.state.vendor.city = loc;
        if (upi) this.state.vendor.upiId = upi;

        this.saveState();
        this.audit.log("Profile Updated", "Settings", `Updated profile for ${oName} (${bName})`);
        alert("✅ Store profile changes saved successfully!");
        this.render();
      });
    }
  }

  /* ----------------------------------------------------
   * VIEW: Home / Dashboard (Slide 2 Mockup Replica)
   * ---------------------------------------------------- */
  getHomeViewHTML() {
    const lang = this.state.settings.language || "en";
    const m = this.state.metrics;
    const b = m.breakdown;
    const h = m.healthScore;

    // Circumference for 40 radius circle = 2 * PI * 40 = 251.32
    const circleLength = 251.32;
    const strokeOffset = circleLength - (circleLength * h.score) / 100;

    return `
      <div class="space-y-4 pb-20">
        
        <!-- Cash Health Score Card (Slide 2 #4) -->
        <div class="fintech-card p-4 flex items-center justify-between cursor-pointer hover:border-emerald-300" onclick="app.switchTab('forecast')">
          <div class="flex items-center gap-3">
            <!-- Gauge SVG -->
            <div class="relative w-16 h-16 flex items-center justify-center">
              <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e2e8f0" stroke-width="9" fill="transparent"/>
                <circle cx="50" cy="50" r="40" stroke="#059669" stroke-width="9" fill="transparent"
                  stroke-dasharray="${circleLength}"
                  stroke-dashoffset="${strokeOffset}"
                  stroke-linecap="round"
                  class="health-gauge-circle"
                />
              </svg>
              <span class="absolute font-bold text-slate-800 text-sm">${h.score}</span>
              <span class="absolute text-[9px] text-slate-400 mt-5">/100</span>
            </div>

            <div>
              <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>${t("healthScoreTitle", lang)}</span>
              </div>
              <div class="text-base font-bold text-slate-800">${h.status}</div>
              <div class="text-xs text-emerald-600 font-medium">${h.statusText}</div>
            </div>
          </div>

          <i data-lucide="chevron-right" class="w-5 h-5 text-slate-400"></i>
        </div>

        <!-- Total Funds (Available Now) Card (Slide 2 #1) -->
        <div class="fintech-card p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs text-slate-300 font-medium uppercase tracking-wider">${t("totalFundsTitle", lang)}</span>
            <span class="bg-emerald-500/20 text-emerald-400 text-[11px] px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">Liquid Now</span>
          </div>

          <div class="text-3xl font-extrabold tracking-tight mb-4 text-emerald-400">
            ₹${m.totalFunds.toLocaleString('en-IN')}
          </div>

          <!-- Inflow Breakdown Grid -->
          <div class="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-700/60 text-center">
            <div class="p-1.5 bg-slate-800/80 rounded-lg">
              <div class="text-[10px] text-slate-400 mb-0.5">${t("cashLabel", lang)}</div>
              <div class="text-xs font-bold text-white">₹${b.cash.toLocaleString('en-IN')}</div>
            </div>
            <div class="p-1.5 bg-slate-800/80 rounded-lg">
              <div class="text-[10px] text-slate-400 mb-0.5">${t("bankLabel", lang)}</div>
              <div class="text-xs font-bold text-white">₹${b.bank.toLocaleString('en-IN')}</div>
            </div>
            <div class="p-1.5 bg-slate-800/80 rounded-lg">
              <div class="text-[10px] text-slate-400 mb-0.5">${t("upiLabel", lang)}</div>
              <div class="text-xs font-bold text-white">₹${b.upi.toLocaleString('en-IN')}</div>
            </div>
            <div class="p-1.5 bg-slate-800/80 rounded-lg">
              <div class="text-[10px] text-slate-400 mb-0.5">${t("cardLabel", lang)}</div>
              <div class="text-xs font-bold text-white">₹${b.card.toLocaleString('en-IN')}</div>
            </div>
            <div class="p-1.5 bg-slate-800/80 rounded-lg border border-amber-500/30">
              <div class="text-[10px] text-amber-300 mb-0.5">${t("creditLabel", lang)}</div>
              <div class="text-xs font-bold text-amber-400">₹${b.credit.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        <!-- 7-Day Forecast & Shortage Alert Banner (Slide 2 #5, #6) -->
        <div class="fintech-card p-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <i data-lucide="trending-up" class="w-4 h-4 text-emerald-600"></i>
              <span class="text-sm font-bold text-slate-800">${t("forecastCardTitle", lang)}</span>
            </div>
            <button onclick="app.switchTab('forecast')" class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-0.5">
              ${t("viewDetails", lang)}
            </button>
          </div>

          <!-- Shortage Warning Banner (Slide 2 Mockup Alert) -->
          ${m.shortageAlert.hasRisk ? `
            <div class="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 shortage-pulse">
              <div class="p-1.5 bg-rose-100 text-rose-600 rounded-lg mt-0.5">
                <i data-lucide="alert-triangle" class="w-4 h-4"></i>
              </div>
              <div class="flex-1">
                <div class="text-xs font-bold text-rose-800">${m.shortageAlert.message}</div>
                <div class="text-[11px] text-rose-700 mt-0.5">${m.shortageAlert.action}</div>
              </div>
            </div>
          ` : ''}

          <!-- Micro Chart Canvas -->
          <div class="h-28 w-full mt-1">
            <canvas id="homeForecastChart"></canvas>
          </div>
        </div>

        <!-- Safe to Spend Today Card (Slide 2 #3) -->
        <div class="fintech-card p-4 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-200 cursor-pointer hover:shadow-md" onclick="app.switchTab('restock')">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                <i data-lucide="banknote" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="text-xs text-slate-500 font-medium">${t("safeToSpendTitle", lang)}</span>
                <div class="text-2xl font-black text-emerald-700">₹${m.safeToSpend.toLocaleString('en-IN')}</div>
                <div class="text-[11px] text-emerald-600 font-medium">${t("recommendedLimit", lang)}</div>
              </div>
            </div>
            <i data-lucide="chevron-right" class="w-5 h-5 text-emerald-500"></i>
          </div>

          <!-- Formula Breakdown Pill -->
          <div class="mt-3 pt-2.5 border-t border-emerald-100/80 flex items-center justify-between text-[11px] text-slate-600">
            <span>₹${m.totalFunds} (Funds) − ₹${m.upcomingEssentialPayments} (Dues) − ₹${m.safetyBuffer} (Buffer)</span>
            <span class="font-bold text-emerald-800">= ₹${m.safeToSpend}</span>
          </div>
        </div>

        <!-- Quick Action Grid -->
        <div class="grid grid-cols-2 gap-3 pt-1">
          <button onclick="app.openAddTransactionModal()" class="fintech-card p-3 flex items-center gap-3 bg-white hover:bg-slate-50 text-left border-slate-200 shadow-sm">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <i data-lucide="plus-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">${t("btnAddTransaction", lang)}</div>
              <div class="text-[10px] text-slate-400">Sale, Expense, Khata</div>
            </div>
          </button>

          <button onclick="app.switchTab('askSaathi')" class="fintech-card p-3 flex items-center gap-3 bg-white hover:bg-slate-50 text-left border-slate-200 shadow-sm">
            <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <i data-lucide="message-square-heart" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">${t("btnAskSaathi", lang)}</div>
              <div class="text-[10px] text-slate-400">Instant kirana guidance</div>
            </div>
          </button>
        </div>

        <!-- Recent Transactions Section Header -->
        <div class="pt-2">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-800">${t("recentTransactions", lang)}</h3>
            <button onclick="app.switchTab('transactions')" class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
              ${t("allTransactions", lang)} →
            </button>
          </div>

          <div class="space-y-2">
            ${this.renderRecentTransactionsSnippet()}
          </div>
        </div>

      </div>
    `;
  }

  renderRecentTransactionsSnippet() {
    const list = this.state.transactions.slice(0, 4);
    return list.map(tx => {
      const isIncome = tx.type === 'income';
      const isCredit = tx.type === 'receivable';
      const sign = isIncome ? '+' : isCredit ? '±' : '−';
      const colorClass = isIncome ? 'text-emerald-600' : isCredit ? 'text-amber-600' : 'text-rose-600';
      const icon = isIncome ? 'arrow-down-left' : isCredit ? 'book-open' : 'arrow-up-right';
      const bgIcon = isIncome ? 'bg-emerald-100 text-emerald-600' : isCredit ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600';

      return `
        <div class="fintech-card p-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl ${bgIcon} flex items-center justify-center">
              <i data-lucide="${icon}" class="w-4 h-4"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">${tx.category}</div>
              <div class="text-[10px] text-slate-400">${tx.party || tx.description} • ${tx.method.toUpperCase()}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-bold ${colorClass}">${sign}₹${Number(tx.amount).toLocaleString('en-IN')}</div>
            <div class="text-[9px] text-slate-400 capitalize">${tx.status || 'settled'}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  initForecastChart() {
    const ctx = document.getElementById("homeForecastChart");
    if (!ctx) return;

    if (this.forecastChartInstance) {
      this.forecastChartInstance.destroy();
    }

    const forecast = this.state.metrics.forecast;
    const labels = forecast.map(f => f.dayLabel);
    const dataPoints = forecast.map(f => f.balance);
    const buffer = this.state.vendor.safetyBuffer;

    this.forecastChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Projected Cash (₹)",
          data: dataPoints,
          borderColor: "#059669",
          borderWidth: 2.5,
          backgroundColor: "rgba(5, 150, 105, 0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: (ctx) => {
            const index = ctx.dataIndex;
            return forecast[index]?.isShortage ? 5 : 3;
          },
          pointBackgroundColor: (ctx) => {
            const index = ctx.dataIndex;
            return forecast[index]?.isShortage ? "#ef4444" : "#059669";
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Balance: ₹${context.parsed.y.toLocaleString('en-IN')}`,
              afterLabel: (context) => {
                const item = forecast[context.dataIndex];
                return item.reason ? `Note: ${item.reason}` : '';
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 }, color: "#64748b" }
          },
          y: {
            grid: { color: "#f1f5f9" },
            ticks: {
              font: { size: 9 },
              color: "#64748b",
              callback: (v) => `₹${v / 1000}k`
            }
          }
        }
      }
    });
  }

  bindHomeCards() {}

  /* ----------------------------------------------------
   * VIEW: Transactions (Slide 2 #1, #2, #10)
   * ---------------------------------------------------- */
  getTransactionsViewHTML() {
    const lang = this.state.settings.language || "en";
    const txs = this.state.transactions;

    return `
      <div class="space-y-4 pb-20">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-800">${t("allTransactions", lang)}</h2>
            <p class="text-xs text-slate-500">Track Cash, UPI, Card, and Khata credit settlements</p>
          </div>
          <button onclick="app.openAddTransactionModal()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>${t("btnAddTransaction", lang)}</span>
          </button>
        </div>

        <!-- Filter pills -->
        <div class="flex gap-2 overflow-x-auto pb-1" id="txFilterContainer">
          <button data-filter="all" class="px-3 py-1 bg-slate-900 text-white text-xs rounded-full font-medium filter-btn-active">All</button>
          <button data-filter="income" class="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-full font-medium">Income</button>
          <button data-filter="expense" class="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-full font-medium">Expenses & Dues</button>
          <button data-filter="receivable" class="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs rounded-full font-medium">Khata Credit</button>
        </div>

        <!-- Transactions Container -->
        <div class="space-y-2.5" id="txListContent">
          ${this.renderFilteredTransactions("all")}
        </div>

        <!-- Bottom Tools -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-200">
          <button onclick="app.audit.exportTransactionsToCSV()" class="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Export to CSV</span>
          </button>
          <span class="text-xs text-slate-400">${txs.length} total entries</span>
        </div>
      </div>
    `;
  }

  renderFilteredTransactions(filterType) {
    let list = this.state.transactions;
    if (filterType !== 'all') {
      list = list.filter(t => t.type === filterType);
    }

    if (list.length === 0) {
      return `<div class="p-8 text-center text-slate-400 text-xs">No transactions in this category.</div>`;
    }

    return list.map(tx => {
      const isIncome = tx.type === 'income';
      const isCredit = tx.type === 'receivable';
      const sign = isIncome ? '+' : isCredit ? '±' : '−';
      const colorClass = isIncome ? 'text-emerald-600' : isCredit ? 'text-amber-600' : 'text-rose-600';
      const icon = isIncome ? 'arrow-down-left' : isCredit ? 'book-open' : 'arrow-up-right';
      const bgIcon = isIncome ? 'bg-emerald-100 text-emerald-600' : isCredit ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600';

      const dateStr = new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

      return `
        <div class="fintech-card p-3.5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ${bgIcon} flex items-center justify-center flex-shrink-0">
              <i data-lucide="${icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-800">${tx.category}</div>
              <div class="text-[11px] text-slate-600 font-medium">${tx.party || tx.description}</div>
              <div class="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>${dateStr}</span>
                <span>•</span>
                <span class="uppercase font-semibold text-slate-500">${tx.method}</span>
                ${tx.settlementOffsetDays > 0 ? `<span class="bg-blue-50 text-blue-600 px-1.5 py-0.2 rounded text-[9px]">T+${tx.settlementOffsetDays}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-black ${colorClass}">${sign}₹${Number(tx.amount).toLocaleString('en-IN')}</div>
            <span class="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-semibold ${tx.status === 'settled' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">
              ${tx.status || 'settled'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  bindTransactionFilters() {
    const container = document.getElementById("txFilterContainer");
    if (!container) return;

    container.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll("button").forEach(b => {
          b.classList.remove("bg-slate-900", "text-white");
          b.classList.add("bg-slate-100", "text-slate-700");
        });
        btn.classList.add("bg-slate-900", "text-white");
        btn.classList.remove("bg-slate-100", "text-slate-700");

        const filter = btn.getAttribute("data-filter");
        const listEl = document.getElementById("txListContent");
        if (listEl) {
          listEl.innerHTML = this.renderFilteredTransactions(filter);
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });
  }

  /* ----------------------------------------------------
   * VIEW: Smart Restock (Slide 2 #8)
   * ---------------------------------------------------- */
  getRestockViewHTML() {
    const lang = this.state.settings.language || "en";
    const m = this.state.metrics;
    const evaluatedInventory = this.engine.evaluateRestock(this.state.inventory, m.safeToSpend);

    return `
      <div class="space-y-4 pb-20">
        <div>
          <h2 class="text-lg font-bold text-slate-800">${t("smartRestockTitle", lang)}</h2>
          <p class="text-xs text-slate-500">${t("smartRestockSubtitle", lang)}</p>
        </div>

        <!-- Safe-to-Spend Limit Status Bar -->
        <div class="fintech-card p-4 bg-emerald-50/70 border-emerald-200">
          <div class="flex items-center justify-between">
            <span class="text-xs text-emerald-800 font-bold">Safe Purchasing Budget Available:</span>
            <span class="text-base font-black text-emerald-700">₹${m.safeToSpend.toLocaleString('en-IN')}</span>
          </div>
          <div class="w-full bg-emerald-200/60 rounded-full h-2 mt-2 overflow-hidden">
            <div class="bg-emerald-600 h-2 rounded-full" style="width: 70%"></div>
          </div>
          <div class="text-[11px] text-emerald-700 mt-1.5">
            Safe-to-Spend safeguards your upcoming supplier checks (₹${m.upcomingEssentialPayments.toLocaleString('en-IN')}) and safety buffer (₹${m.safetyBuffer.toLocaleString('en-IN')}).
          </div>
        </div>

        <!-- Inventory Restock Table -->
        <div class="space-y-3">
          ${evaluatedInventory.map(item => {
            const isAffordable = item.affordableIndividually;
            const badgeClass = isAffordable ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300';
            const icon = isAffordable ? 'check-circle' : 'alert-circle';
            const statusBadge = item.status === 'critical' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200';

            return `
              <div class="fintech-card p-3.5 space-y-2 border ${isAffordable ? 'border-slate-200' : 'border-rose-200'}">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-bold text-slate-900">${item.name}</span>
                    <span class="text-[10px] text-slate-400 block">${item.category} • Current Stock: ${item.stock} ${item.unit}</span>
                  </div>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusBadge}">
                    ${item.status} Stock
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-2 py-1.5 bg-slate-50 rounded-lg p-2 text-center text-xs">
                  <div>
                    <span class="text-[10px] text-slate-400 block">7-Day Sales</span>
                    <span class="font-bold text-slate-800">${item.sales7Days} ${item.unit}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">Recommended</span>
                    <span class="font-bold text-emerald-700">+${item.recommendedQty} ${item.unit}</span>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">Restock Cost</span>
                    <span class="font-bold text-slate-900">₹${item.totalCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center gap-1.5 text-xs font-semibold ${isAffordable ? 'text-emerald-700' : 'text-rose-700'}">
                    <i data-lucide="${icon}" class="w-4 h-4"></i>
                    <span>${isAffordable ? t("affordableBadge", lang) : t("unaffordableBadge", lang)}</span>
                  </div>

                  <button onclick="app.executeRestockPurchase('${item.id}')" class="px-3 py-1 rounded-lg text-xs font-semibold ${isAffordable ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}">
                    Order Stock
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  executeRestockPurchase(itemId) {
    const item = this.state.inventory.find(i => i.id === itemId);
    if (!item) return;

    if (item.totalCost > this.state.metrics.safeToSpend) {
      alert(`⚠️ Cannot order ${item.name}! The cost (₹${item.totalCost}) exceeds your Safe-to-Spend limit (₹${this.state.metrics.safeToSpend}). Ordering now would risk your scheduled supplier dues.`);
      return;
    }

    if (confirm(`Confirm restock order for ${item.name} (${item.recommendedQty} ${item.unit}) for ₹${item.totalCost}?`)) {
      // Add transaction
      const newTx = {
        id: `tx-restock-${Date.now()}`,
        date: new Date().toISOString(),
        type: "expense",
        category: "Stock Restock",
        amount: item.totalCost,
        method: "upi",
        status: "settled",
        settlementOffsetDays: 0,
        description: `Restocked ${item.recommendedQty} ${item.unit} ${item.name}`,
        party: "Wholesale Supplier"
      };

      // Update inventory stock
      item.stock += item.recommendedQty;
      item.status = "good";

      // Deduct from UPI balance
      const balances = { ...this.state.balances, upi: Math.max(0, this.state.balances.upi - item.totalCost) };
      const updatedTxs = [newTx, ...this.state.transactions];

      this.updateState({
        transactions: updatedTxs,
        balances
      });

      this.audit.log("Smart Restock Executed", "Restock", `Ordered ${item.name} for ₹${item.totalCost} within Safe-to-Spend limit`);
      alert(`✅ Success! Ordered ${item.recommendedQty} ${item.unit} of ${item.name}. Safe-to-Spend updated.`);
      this.render();
    }
  }

  bindRestockActions() {}

  /* ----------------------------------------------------
   * VIEW: Ask Saathi 🤝 (Slide 2 #7)
   * ---------------------------------------------------- */
  getAskSaathiViewHTML() {
    const lang = this.state.settings.language || "en";
    const suggested = [
      "Can I buy ₹8,000 of stock today?",
      "Will I have enough money for my supplier?",
      "How much can I safely spend?",
      "Why is my cash low?",
      "When will my card payments arrive?",
      "What government schemes can I get?"
    ];

    return `
      <div class="flex flex-col h-[calc(100vh-180px)] pb-14">
        <!-- Header -->
        <div class="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl mb-3 shadow-md">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              🤝
            </div>
            <div>
              <h2 class="text-sm font-bold">${t("askSaathiHeader", lang)}</h2>
              <p class="text-[10px] text-emerald-100">${t("askSaathiSubheader", lang)}</p>
            </div>
          </div>
        </div>

        <!-- Chat messages stream -->
        <div class="flex-1 overflow-y-auto space-y-3 px-1" id="chatMessageStream">
          ${this.chatMessages.map(msg => `
            <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[85%] p-3 rounded-2xl text-xs ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}">
                <div class="whitespace-pre-line leading-relaxed">${msg.text}</div>
                <div class="text-[9px] mt-1 text-right opacity-60">${msg.time}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick prompt chips -->
        <div class="pt-2 pb-1 overflow-x-auto flex gap-1.5 no-scrollbar">
          ${suggested.map(prompt => `
            <button onclick="app.sendChatMessage('${prompt}')" class="flex-shrink-0 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] rounded-full font-medium border border-emerald-200">
              ${prompt}
            </button>
          `).join('')}
        </div>

        <!-- Chat input bar -->
        <form id="chatForm" class="flex gap-2 pt-2">
          <input
            type="text"
            id="chatInput"
            placeholder="${t("inputPlaceholder", lang)}"
            class="flex-1 px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            autocomplete="off"
          />
          <button type="submit" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center shadow-md">
            <i data-lucide="send" class="w-4 h-4"></i>
          </button>
        </form>
      </div>
    `;
  }

  sendChatMessage(text) {
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    this.chatMessages.push({
      sender: "user",
      time: nowTime,
      text: text
    });

    this.renderTabContent();
    this.scrollToBottomChat();

    // Generate rule-based response
    setTimeout(() => {
      const response = this.askSaathi.respond(text);
      this.chatMessages.push({
        sender: "saathi",
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        text: response.text
      });

      this.audit.log("Ask Saathi Query", "AI-Guidance", `User asked: "${text}"`);
      this.renderTabContent();
      this.scrollToBottomChat();
    }, 400);
  }

  scrollToBottomChat() {
    const stream = document.getElementById("chatMessageStream");
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }
  }

  bindChatPrompts() {}

  /* ----------------------------------------------------
   * VIEW: 7-Day Forecast Detailed (Slide 2 #5, Slide 3)
   * ---------------------------------------------------- */
  getDetailedForecastViewHTML() {
    const lang = this.state.settings.language || "en";
    const m = this.state.metrics;
    const forecast = m.forecast;

    return `
      <div class="space-y-4 pb-20">
        <div>
          <h2 class="text-lg font-bold text-slate-800">7-Day Cash-Flow Prediction</h2>
          <p class="text-xs text-slate-500">Anticipates pending settlements, cash draws, and scheduled supplier invoices.</p>
        </div>

        <!-- Big Chart Card -->
        <div class="fintech-card p-4">
          <div class="h-44 w-full">
            <canvas id="detailedForecastChart"></canvas>
          </div>
        </div>

        <!-- Day-by-day table -->
        <div class="fintech-card p-4">
          <h3 class="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">Daily Projected Liquidity</h3>
          <div class="space-y-2">
            ${forecast.map(day => {
              const isShortage = day.isShortage;
              const badge = isShortage ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-emerald-100 text-emerald-700 border-emerald-200';

              return `
                <div class="p-2.5 rounded-xl border ${isShortage ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100 bg-slate-50'} flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-slate-800">${day.dayLabel}</div>
                    <div class="text-[10px] text-slate-500">${day.reason}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs font-black ${isShortage ? 'text-rose-600' : 'text-slate-800'}">₹${day.balance.toLocaleString('en-IN')}</div>
                    <span class="text-[9px] px-1.5 py-0.2 rounded-full font-semibold border ${badge}">
                      ${isShortage ? 'Tight Buffer' : 'Healthy'}
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Recommended Action Card -->
        <div class="fintech-card p-4 bg-amber-50 border-amber-200">
          <div class="flex items-start gap-2.5">
            <i data-lucide="lightbulb" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <h4 class="text-xs font-bold text-amber-900">How to eliminate Day-3 Cash Pressure:</h4>
              <p class="text-[11px] text-amber-800 mt-1">
                1. Collect ₹1,000 pending customer khata credit from Joshi Kaka.<br>
                2. Settle the ₹4,530 wholesale supplier invoice via partial payment (₹2,500 on Day 3, balance on Day 5).<br>
                3. Keep restock purchases strictly within ₹${m.safeToSpend.toLocaleString('en-IN')}!
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initDetailedForecastChart() {
    const ctx = document.getElementById("detailedForecastChart");
    if (!ctx) return;

    const forecast = this.state.metrics.forecast;
    new Chart(ctx, {
      type: "line",
      data: {
        labels: forecast.map(f => f.dayLabel),
        datasets: [{
          label: "Cash Projection (₹)",
          data: forecast.map(f => f.balance),
          borderColor: "#059669",
          borderWidth: 3,
          backgroundColor: "rgba(5, 150, 105, 0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 6,
          pointBackgroundColor: forecast.map(f => f.isShortage ? "#ef4444" : "#059669")
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            ticks: {
              callback: (v) => `₹${v.toLocaleString('en-IN')}`
            }
          }
        }
      }
    });
  }

  /* ----------------------------------------------------
   * VIEW: Government Schemes (Slide 2 #12, Slide 4, 6)
   * ---------------------------------------------------- */
  getSchemesViewHTML() {
    const lang = this.state.settings.language || "en";
    const schemes = this.state.schemes || SEED_DATA.schemes;

    return `
      <div class="space-y-4 pb-20">
        <div>
          <h2 class="text-lg font-bold text-slate-800">${t("schemesTitle", lang)}</h2>
          <p class="text-xs text-slate-500">${t("schemesSubtitle", lang)}</p>
        </div>

        <div class="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
          <i data-lucide="info" class="w-4 h-4 text-blue-600 flex-shrink-0"></i>
          <span>${t("disclaimer", lang)}</span>
        </div>

        <div class="space-y-3">
          ${schemes.map(s => `
            <div class="fintech-card p-4 space-y-2.5 border-l-4 border-l-emerald-600">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs font-bold text-slate-900 block">${s.title}</span>
                  <span class="text-[10px] text-slate-400">${s.ministry}</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ${s.badge}
                </span>
              </div>

              <div class="p-2 bg-slate-50 rounded-lg text-xs space-y-1">
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Financial Benefit:</span>
                  <span class="font-bold text-emerald-700">${s.benefit}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500 font-medium">Interest / Term:</span>
                  <span class="font-semibold text-slate-800">${s.interest}</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 leading-relaxed">${s.summary}</p>

              <div class="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span class="font-bold text-slate-700">Eligibility:</span> ${s.eligibility}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
   * VIEW: Bank & UPI Simulated Reconciliation (Slide 2 #11, Slide 4)
   * ---------------------------------------------------- */
  getReconcileViewHTML() {
    const v = this.state.vendor;
    const b = this.state.balances;

    return `
      <div class="space-y-4 pb-20">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Future-Ready UPI & Bank Hub</h2>
          <p class="text-xs text-slate-500">Simulated Account Aggregator and Soundbox QR integration</p>
        </div>

        <!-- Simulated UPI Soundbox Card -->
        <div class="fintech-card p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold">
                <i data-lucide="qr-code" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs font-bold block">Smart Soundbox Terminal</span>
                <span class="text-[10px] text-blue-200">VPA: ${v.upiId}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">CONNECTED</span>
          </div>

          <!-- Soundbox sound waves animation -->
          <div class="p-3 bg-blue-950/60 rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-1.5 h-6">
              <div class="w-1 bg-emerald-400 rounded-full wave-bar"></div>
              <div class="w-1 bg-emerald-400 rounded-full wave-bar"></div>
              <div class="w-1 bg-emerald-400 rounded-full wave-bar"></div>
              <div class="w-1 bg-emerald-400 rounded-full wave-bar"></div>
              <span class="text-xs text-emerald-300 font-medium ml-2">Soundbox ready for payments</span>
            </div>
            <button onclick="app.simulateIncomingUPIPayment()" class="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md">
              Test Receive ₹500
            </button>
          </div>
        </div>

        <!-- Bank Account Aggregator Simulation -->
        <div class="fintech-card p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <i data-lucide="building-2" class="w-5 h-5"></i>
              </div>
              <div>
                <span class="text-xs font-bold text-slate-900 block">${v.bankName}</span>
                <span class="text-[10px] text-slate-400">Account: ${v.accountNumber}</span>
              </div>
            </div>
            <span class="text-sm font-extrabold text-slate-900">₹${b.bank.toLocaleString('en-IN')}</span>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between text-slate-600">
            <span>Last automated sync:</span>
            <span class="font-semibold text-slate-800">Today at 11:20 AM</span>
          </div>

          <button onclick="app.reconcileAllTransactions()" class="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm">
            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
            <span>Reconcile All Payment Channels Now</span>
          </button>
        </div>
      </div>
    `;
  }

  simulateIncomingUPIPayment() {
    const amount = 500;
    const newTx = {
      id: `tx-upi-${Date.now()}`,
      date: new Date().toISOString(),
      type: "income",
      category: "UPI Soundbox",
      amount: amount,
      method: "upi",
      status: "settled",
      settlementOffsetDays: 0,
      description: "Customer QR payment for snacks",
      party: "QR Customer"
    };

    const balances = { ...this.state.balances, upi: this.state.balances.upi + amount };
    const updatedTxs = [newTx, ...this.state.transactions];

    this.updateState({
      balances,
      transactions: updatedTxs
    });

    this.audit.log("Simulated UPI Received", "UPI", `Received ₹${amount} via UPI Soundbox`);

    // Voice notification simulation using Web Speech API if enabled
    if (this.state.settings.voiceAlerts !== false) {
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Payment of five hundred rupees received on CashFlow Saathi");
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {
        console.log("Speech not supported:", e);
      }
    }

    alert(`🔔 Soundbox Alert: "₹500 received via UPI!"\nAvailable Cash and Safe-to-Spend updated.`);
    this.render();
  }

  reconcileAllTransactions() {
    this.audit.log("Reconciliation Completed", "Reconciliation", "All multi-channel streams matched with bank & cash registers");
    alert("✅ All 4 payment channels (Cash, Bank, UPI, Card) reconciled with zero discrepancy.");
    this.render();
  }

  bindReconcileActions() {}

  /* ----------------------------------------------------
   * VIEW: Audit Trail (Slide 2 #10, Slide 4)
   * ---------------------------------------------------- */
  getAuditViewHTML() {
    const logs = this.state.auditLog || [];

    return `
      <div class="space-y-4 pb-20">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-800">Immutable Audit Trail</h2>
            <p class="text-xs text-slate-500">Transparent timestamped logs for trust, tax & compliance</p>
          </div>
          <button onclick="app.audit.exportAuditToCSV()" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1">
            <i data-lucide="download" class="w-3.5 h-3.5"></i>
            <span>Export</span>
          </button>
        </div>

        <div class="space-y-2">
          ${logs.map(log => `
            <div class="fintech-card p-3 flex items-start justify-between">
              <div>
                <div class="text-xs font-bold text-slate-800">${log.action}</div>
                <div class="text-[11px] text-slate-600 mt-0.5">${log.details}</div>
                <span class="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-semibold">
                  ${log.category}
                </span>
              </div>
              <span class="text-[10px] text-slate-400 whitespace-nowrap">${log.timestamp}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ----------------------------------------------------
   * MODALS & TRANSACTION HANDLING
   * ---------------------------------------------------- */
  openAddTransactionModal() {
    const modal = document.getElementById("addTransactionModal");
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
  }

  handleFormAddTransaction(form) {
    const type = form.type.value;
    const amount = Number(form.amount.value);
    const method = form.method.value;
    const category = form.category.value;
    const party = form.party.value || "Walk-in";
    const description = form.description.value || category;

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type,
      category,
      amount,
      method,
      status: method === 'card' ? 'pending' : (type === 'receivable' ? 'pending' : 'settled'),
      settlementOffsetDays: method === 'card' ? 1 : (method === 'bank' ? 2 : 0),
      description,
      party
    };

    // Update balances dynamically
    const balances = { ...this.state.balances };
    if (type === 'income') {
      balances[method] = (balances[method] || 0) + amount;
    } else if (type === 'expense') {
      balances[method] = Math.max(0, (balances[method] || 0) - amount);
    } else if (type === 'receivable') {
      balances.credit = (balances.credit || 0) + amount;
    }

    const updatedTxs = [newTx, ...this.state.transactions];
    this.updateState({
      balances,
      transactions: updatedTxs
    });

    this.audit.log("Transaction Added", type.toUpperCase(), `${category}: ₹${amount} (${method.toUpperCase()})`);

    this.closeAllModals();
    form.reset();
    alert(`✅ Transaction added: ₹${amount.toLocaleString('en-IN')}! CashFlow Saathi has recomputed your Safe-to-Spend.`);
    this.render();
  }

  resetToSeedData() {
    localStorage.removeItem(this.storageKey);
    this.state = this.loadInitialState();
    this.recompute();
    this.chatMessages = [
      {
        sender: "saathi",
        time: "Just now",
        text: "Namaste Ramesh Bhai! 🙏 I'm your CashFlow Saathi. Ask me anything about your cash, supplier dues, or whether you can afford new stock today!"
      }
    ];
    this.audit.log("Demo Reset", "System", "Restored initial seed data for Shree Snacks");
    alert("🔄 Demo reset to initial Ramesh Bhai state (₹12,480 Total Funds, ₹4,650 Safe-to-Spend).");
    this.render();
  }
}

// Global App instantiation
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new CashFlowSaathiApp();
  app.init();
  window.app = app;
});
