/**
 * CashFlow Saathi - Trilingual Localization (i18n)
 * Slide 2 (#9): English + Hindi + Gujarati
 */

const TRANSLATIONS = {
  en: {
    appName: "CashFlow Saathi",
    tagline: "Know your money. Plan your next move.",
    greeting: "Namaste, Ramesh Bhai",
    subGreeting: "Your business, your control.",
    
    // Nav items
    navHome: "Home",
    navTransactions: "Transactions",
    navRestock: "Restock",
    navAskSaathi: "Ask Saathi",
    navForecast: "Forecast",
    navSchemes: "Govt Schemes",
    navAudit: "Audit Trail",
    navReconcile: "Bank & UPI",
    navSettings: "Settings",
    navMore: "More",

    // Dashboard Cards
    healthScoreTitle: "Cash Health Score",
    healthStatusGood: "Good",
    healthStatusSubtitle: "You're on track!",
    totalFundsTitle: "Total Funds (Available Now)",
    cashLabel: "Cash",
    bankLabel: "Bank",
    upiLabel: "UPI",
    cardLabel: "Card",
    creditLabel: "Credit",
    
    forecastCardTitle: "7-Day Forecast",
    forecastAlertTitle: "Cash pressure expected in 3 days",
    viewDetails: "View details →",
    
    safeToSpendTitle: "Safe to Spend Today",
    recommendedLimit: "Recommended limit",
    formulaExplanation: "Formula: Available Cash − Upcoming Essential Payments − Safety Buffer",

    // Action buttons
    btnAddTransaction: "Add Transaction",
    btnSimulateUPI: "Simulate UPI Payment",
    btnAskSaathi: "Ask Saathi",
    btnRestock: "Smart Restock",
    btnExportCSV: "Export CSV",
    btnResetData: "Reset Demo Data",

    // Transactions Table
    recentTransactions: "Recent Transactions",
    allTransactions: "All Transactions",
    colDate: "Date",
    colCategory: "Category / Description",
    colParty: "Party",
    colMethod: "Method",
    colAmount: "Amount",
    colStatus: "Settlement Status",
    filterAll: "All",
    filterIncome: "Income",
    filterExpense: "Expense",
    filterReceivable: "Credit (Khata)",

    // Smart Restock
    smartRestockTitle: "Smart Restock & Inventory",
    smartRestockSubtitle: "Recommendations automatically respect your Safe-to-Spend limit.",
    colProduct: "Product Item",
    colCurrentStock: "Current Stock",
    colSales7d: "7-Day Sales",
    colRecommendedOrder: "Recommended Order",
    colEstimatedCost: "Estimated Cost",
    colCanBuy: "Can Buy Today?",
    affordableBadge: "Within Safe Limit",
    unaffordableBadge: "Exceeds Safe Limit",

    // Ask Saathi
    askSaathiHeader: "Ask Saathi 🤝",
    askSaathiSubheader: "Your personal financial companion. Clear, plain-language kirana guidance.",
    inputPlaceholder: "Ask Saathi anything (e.g. Can I buy ₹8,000 stock?)...",
    quickPromptsTitle: "Quick questions to try:",

    // Schemes
    schemesTitle: "Government Schemes & Compliance Readiness",
    schemesSubtitle: "Prepared for micro-enterprises, kirana shops, and vendors across India.",
    disclaimer: "Notice: Informational guide for demonstration purposes based on official GOI schemes.",

    // Settings & Login
    settingsTitle: "Store & Financial Settings",
    settingsSubtitle: "Customize financial guardrails, profile, language & voice alerts.",
    loginTitle: "Demo Login & Profiles",
    loginSubtitle: "Experience CashFlow Saathi with realistic Indian merchant personas.",
    safetyBufferLabel: "Emergency Safety Buffer",
    saveChanges: "Save Profile & Parameters",
    logoutBtn: "Switch Store / Logout"
  },

  hi: {
    appName: "कैशफ्लो साथी",
    tagline: "अपने पैसे को समझें। अगला कदम तय करें।",
    greeting: "नमस्ते, रमेश भाई",
    subGreeting: "आपका व्यापार, आपका नियंत्रण।",
    
    // Nav items
    navHome: "होम",
    navTransactions: "लेन-देन",
    navRestock: "स्टॉक आर्डर",
    navAskSaathi: "साथी से पूछें",
    navForecast: "पूर्वानुमान",
    navSchemes: "सरकारी योजनाएं",
    navAudit: "ऑडिट रिकॉर्ड",
    navReconcile: "बैंक व UPI",
    navSettings: "सेटिंग्स",
    navMore: "अन्य",

    // Dashboard Cards
    healthScoreTitle: "कैश हेल्थ स्कोर",
    healthStatusGood: "उत्कृष्ट",
    healthStatusSubtitle: "आपकी स्थिति सुरक्षित है!",
    totalFundsTitle: "कुल उपलब्ध फंड (अभी उपलब्ध)",
    cashLabel: "नकद",
    bankLabel: "बैंक",
    upiLabel: "UPI",
    cardLabel: "कार्ड",
    creditLabel: "उधारी (खाता)",
    
    forecastCardTitle: "7-दिन का कैश पूर्वानुमान",
    forecastAlertTitle: "3 दिनों में कैश की कमी हो सकती है",
    viewDetails: "विवरण देखें →",
    
    safeToSpendTitle: "आज सुरक्षित खर्च सीमा",
    recommendedLimit: "अनुशंसित सुरक्षित सीमा",
    formulaExplanation: "सूत्र: कुल उपलब्ध फंड − आगामी आवश्यक भुगतान − इमरजेंसी रिजर्व",

    // Action buttons
    btnAddTransaction: "लेन-देन जोड़ें",
    btnSimulateUPI: "UPI पेमेंट टेस्ट करें",
    btnAskSaathi: "साथी से पूछें",
    btnRestock: "स्मार्ट रीस्टॉक",
    btnExportCSV: "CSV डाउनलोड",
    btnResetData: "डेमो रीसेट करें",

    // Transactions Table
    recentTransactions: "हालिया लेन-देन",
    allTransactions: "सभी लेन-देन",
    colDate: "तारीख",
    colCategory: "विवरण / श्रेणी",
    colParty: "पक्ष (पार्टी)",
    colMethod: "माध्यम",
    colAmount: "राशि",
    colStatus: "सेटलमेंट स्थिति",
    filterAll: "सभी",
    filterIncome: "आमदनी",
    filterExpense: "खर्च",
    filterReceivable: "उधारी (खाता)",

    // Smart Restock
    smartRestockTitle: "स्मार्ट रीस्टॉक और स्टॉक योजना",
    smartRestockSubtitle: "सुझाव आपके सेफ-टू-स्पेंड बजट की सीमा के भीतर तैयार किए जाते हैं।",
    colProduct: "सामग्री / उत्पाद",
    colCurrentStock: "मौजूदा स्टॉक",
    colSales7d: "7-दिन की बिक्री",
    colRecommendedOrder: "अनुशंसित आर्डर",
    colEstimatedCost: "अनुमानित लागत",
    colCanBuy: "क्या आज खरीद सकते हैं?",
    affordableBadge: "सुरक्षित बजट में",
    unaffordableBadge: "बजट से अधिक",

    // Ask Saathi
    askSaathiHeader: "साथी से पूछें 🤝",
    askSaathiSubheader: "आपका व्यक्तिगत वित्तीय सलाहकार। सरल और सीधी व्यापारिक सलाह।",
    inputPlaceholder: "साथी से कुछ भी पूछें (उदा. क्या मैं ₹8,000 का सामान खरीद सकता हूँ?)...",
    quickPromptsTitle: "पूछने के लिए सुझाव:",

    // Schemes
    schemesTitle: "सरकारी योजनाएं और अनुपालन",
    schemesSubtitle: "भारत के किराना और सूक्ष्म व्यापारियों के लिए विशेष योजनाएं।",
    disclaimer: "सूचना: यह जानकारी केवल डेमो और जागरूकता हेतु भारत सरकार की योजनाओं पर आधारित है।",

    // Settings & Login
    settingsTitle: "दुकान एवं वित्तीय सेटिंग्स",
    settingsSubtitle: "सुरक्षा रिजर्व, दुकान प्रोफाइल और भाषा बदलें।",
    loginTitle: "डेमो लॉगिन व प्रोफाइल",
    loginSubtitle: "भारतीय व्यापारी प्रोफाइल के साथ कैशफ्लो साथी का अनुभव करें।",
    safetyBufferLabel: "इमरजेंसी सुरक्षा बफर",
    saveChanges: "सेटिंग्स सहेजें",
    logoutBtn: "दुकान बदलें / लॉगआउट"
  },

  gu: {
    appName: "કેશફ્લો સાથી",
    tagline: "તમારા નાણાંને સમજો. યોગ્ય નિર્ણય લો.",
    greeting: "નમસ્તે, રમેશ ભાઈ",
    subGreeting: "તમારો વ્યવસાય, તમારું નિયંત્રણ.",
    
    // Nav items
    navHome: "હોમ",
    navTransactions: "વ્યવહારો",
    navRestock: "સ્ટોક ખરીદી",
    navAskSaathi: "સાથીને પૂછો",
    navForecast: "આગાહી",
    navSchemes: "સરકારી યોજના",
    navAudit: "ઓડિટ હિસાબ",
    navReconcile: "બેંક અને UPI",
    navSettings: "સેટિંગ્સ",
    navMore: "વધુ",

    // Dashboard Cards
    healthScoreTitle: "કેશ હેલ્થ સ્કોર",
    healthStatusGood: "સારું",
    healthStatusSubtitle: "તમે સાચી દિશામાં છો!",
    totalFundsTitle: "કુલ ઉપલબ્ધ ફંડ (હાલમાં)",
    cashLabel: "રોકડ",
    bankLabel: "બેંક",
    upiLabel: "UPI",
    cardLabel: "કાર્ડ",
    creditLabel: "ઉધાર (ખાતાવહી)",
    
    forecastCardTitle: "7-દિવસની કેશ આગાહી",
    forecastAlertTitle: "3 દિવસમાં રોકડની ખેંચ થઈ શકે છે",
    viewDetails: "વિગત જુઓ →",
    
    safeToSpendTitle: "આજે સુરક્ષિત ખર્ચ મર્યાદા",
    recommendedLimit: "ભલામણ કરેલ લિમિટ",
    formulaExplanation: "ગણતરી: ઉપલબ્ધ રોકડ − આગામી જરૂરી ચૂકવણી − સેફ્ટી બફર",

    // Action buttons
    btnAddTransaction: "વ્યવહાર ઉમેરો",
    btnSimulateUPI: "UPI પેમેન્ટ ટેસ્ટ",
    btnAskSaathi: "સાથીને પૂછો",
    btnRestock: "સ્માર્ટ સ્ટોક",
    btnExportCSV: "CSV ડાઉનલોડ",
    btnResetData: "ડેમો રીસેટ",

    // Transactions Table
    recentTransactions: "તાજેતરના વ્યવહારો",
    allTransactions: "બધા વ્યવહારો",
    colDate: "તારીખ",
    colCategory: "કેટેગરી / વિગત",
    colParty: "ગ્રાહક / વેપારી",
    colMethod: "માધ્યમ",
    colAmount: "રકમ",
    colStatus: "સેટલમેન્ટ સ્ટેટસ",
    filterAll: "બધા",
    filterIncome: "આવક",
    filterExpense: "ખર્ચ",
    filterReceivable: "ઉધાર (ખાતાવહી)",

    // Smart Restock
    smartRestockTitle: "સ્માર્ટ સ્ટોક ખરીદી સલાહ",
    smartRestockSubtitle: "તમારી સેફ-ટુ-સ્પેન્ડ લિમિટને ધ્યાનમાં રાખીને આપોઆપ સલાહ.",
    colProduct: "વસ્તુ / પ્રોડક્ટ",
    colCurrentStock: "હાલનો સ્ટોક",
    colSales7d: "7-દિવસનું વેચાણ",
    colRecommendedOrder: "જરૂરી ખરીદી",
    colEstimatedCost: "અંદાજિત ખર્ચ",
    colCanBuy: "આજે ખરીદી શકાય?",
    affordableBadge: "બજેટમાં છે",
    unaffordableBadge: "બજેટ બહાર છે",

    // Ask Saathi
    askSaathiHeader: "સાથીને પૂછો 🤝",
    askSaathiSubheader: "તમારો પર્સનલ ફાઇનાન્સિયલ સાથીદાર. દેશી અને સરળ માર્ગદર્શન.",
    inputPlaceholder: "સાથીને કંઈપણ પૂછો (દા.ત. શું હું ₹8,000 નો માલ ખરીદી શકું?)...",
    quickPromptsTitle: "આવા પ્રશ્નો પૂછી જુઓ:",

    // Schemes
    schemesTitle: "સરકારી યોજનાઓ અને નિયમો",
    schemesSubtitle: "ગુજરાત અને ભારતના નાના વેપારીઓ માટે સરકારી સહાય.",
    disclaimer: "સૂચના: આ માહિતી સરકારી યોજનાઓ આધારિત ફક્ત પ્રદર્શન અને માહિતી માટે છે.",

    // Settings & Login
    settingsTitle: "દુકાન અને નાણાકીય સેટિંગ્સ",
    settingsSubtitle: "સુરક્ષા રિઝર્વ, પ્રોફાઇલ અને ભાષા પસંદગી.",
    loginTitle: "ડેમો લૉગિન અને પ્રોફાઇલ",
    loginSubtitle: "ભારતીય વેપારીઓની વાસ્તવિક પ્રોફાઇલ સાથે ડેમો શરૂ કરો.",
    safetyBufferLabel: "ઇમરજન્સી સુરક્ષા બફર",
    saveChanges: "સેટિંગ્સ સાચવો",
    logoutBtn: "દુકાન બદલો / લોગઆઉટ"
  }
};

function t(key, lang = 'en') {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return dict[key] || TRANSLATIONS['en'][key] || key;
}
