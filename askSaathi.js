/**
 * CashFlow Saathi - "Ask Saathi 🤝" Conversational Guidance Engine
 * Implements Slide 2 (#7), Slide 3 (Cash-Flow Engine -> Ask Saathi)
 * Rule-based, deterministic, zero external LLM dependencies, 100% reliable for hackathon demo!
 */

class AskSaathiEngine {
  constructor(getStateFn) {
    this.getState = getStateFn;
  }

  /**
   * Process a user question and generate plain-language, helpful fintech advice
   */
  respond(queryText) {
    const state = this.getState();
    const metrics = state.metrics;
    const safeToSpend = metrics.safeToSpend;
    const totalFunds = metrics.totalFunds;
    const upcomingPayments = metrics.upcomingEssentialPayments;
    const buffer = state.vendor.safetyBuffer;
    const language = state.settings.language || 'en';

    const cleanQuery = queryText.toLowerCase().trim();

    // 1. Stock / Purchase amount inquiry: e.g. "Can I buy ₹8,000 of stock today?"
    const amountMatch = cleanQuery.match(/(?:buy|spend|purchase|order|afford|khareed).*?(?:₹|rs\.?|inr)?\s*(\d+[\d,]*)/i) 
      || cleanQuery.match(/(\d+[\d,]*)\s*(?:₹|rs\.?|rupees)?.*?(?:buy|spend|purchase|order|stock)/i)
      || cleanQuery.match(/₹\s*(\d+[\d,]*)/i);

    if (amountMatch) {
      const requestedAmount = parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(requestedAmount)) {
        return this.generatePurchaseAdvice(requestedAmount, safeToSpend, upcomingPayments, buffer, language);
      }
    }

    // 2. "Will I have enough money for my supplier?" / "Supplier payment"
    if (cleanQuery.includes('supplier') || cleanQuery.includes('vendor') || cleanQuery.includes('wholesaler') || cleanQuery.includes('due') || cleanQuery.includes('amul')) {
      return this.generateSupplierAdvice(metrics, language);
    }

    // 3. "How much can I safely spend?" / "Safe to spend"
    if (cleanQuery.includes('safely spend') || cleanQuery.includes('safe to spend') || cleanQuery.includes('how much can i spend') || cleanQuery.includes('limit')) {
      return this.generateSafeToSpendExplanation(metrics, language);
    }

    // 4. "Why is my cash low?" / "Why low" / "Shortage reason"
    if (cleanQuery.includes('why') && (cleanQuery.includes('low') || cleanQuery.includes('tight') || cleanQuery.includes('pressure') || cleanQuery.includes('cash'))) {
      return this.generateWhyCashIsLow(metrics, language);
    }

    // 5. Card / UPI / Settlement timings
    if (cleanQuery.includes('card') || cleanQuery.includes('settle') || cleanQuery.includes('settlement') || cleanQuery.includes('bank transfer')) {
      return this.generateSettlementExplanation(metrics, language);
    }

    // 6. Customer credit / Khata collections
    if (cleanQuery.includes('credit') || cleanQuery.includes('khata') || cleanQuery.includes('customer') || cleanQuery.includes('receivable') || cleanQuery.includes('joshi')) {
      return this.generateCreditAdvice(metrics, language);
    }

    // 7. Government schemes / Loans / MUDRA / SVANidhi
    if (cleanQuery.includes('scheme') || cleanQuery.includes('loan') || cleanQuery.includes('mudra') || cleanQuery.includes('svanidhi') || cleanQuery.includes('government') || cleanQuery.includes('subsidy')) {
      return this.generateSchemesAdvice(language);
    }

    // 8. General Financial Health check
    if (cleanQuery.includes('health') || cleanQuery.includes('score') || cleanQuery.includes('how am i doing')) {
      return this.generateHealthAdvice(metrics, language);
    }

    // Fallback friendly guidance
    return {
      text: language === 'hi' 
        ? `नमस्ते रमेश भाई! मैं आपका कैशफ्लो साथी हूँ। आप आज ₹${safeToSpend.toLocaleString('en-IN')} सुरक्षित रूप से खर्च कर सकते हैं। आप मुझसे स्टॉक खरीदने, सप्लायर के बकाए या 7-दिन के पूर्वानुमान के बारे में पूछ सकते हैं!`
        : language === 'gu'
        ? `નમસ્તે રમેશ ભાઈ! હું તમારો કેશફ્લો સાથી છું. આજે તમે ₹${safeToSpend.toLocaleString('en-IN')} સુરક્ષિત રીતે ખર્ચી શકો છો. તમે મને સ્ટોક, સપ્લાયર પેમેન્ટ અથવા કેશ આગાહી વિશે પૂછી શકો છો!`
        : `Namaste Ramesh Bhai! I'm your CashFlow Saathi. Today your Safe-to-Spend limit is ₹${safeToSpend.toLocaleString('en-IN')}. You can ask me questions like: "Can I buy ₹8,000 of stock today?", "Will I have enough for suppliers?", or "Why is my cash low?".`,
      suggestedQuestions: [
        "Can I buy ₹8,000 of stock today?",
        "Will I have enough money for my supplier?",
        "How much can I safely spend?",
        "Why is my cash low?"
      ]
    };
  }

  generatePurchaseAdvice(amount, safeToSpend, upcoming, buffer, lang) {
    if (amount <= safeToSpend) {
      const remaining = safeToSpend - amount;
      return {
        isApproved: true,
        text: lang === 'hi'
          ? `✅ हाँ, आप आज ₹${amount.toLocaleString('en-IN')} का सामान आराम से खरीद सकते हैं। इस खरीद के बाद भी आपके पास ₹${remaining.toLocaleString('en-IN')} का सुरक्षित खर्च मार्जिन बचेगा और सप्लायर के बकाए सुरक्षित रहेंगे।`
          : lang === 'gu'
          ? `✅ હા, તમે આજે ₹${amount.toLocaleString('en-IN')} નો માલ ખરીદી શકો છો. આ ખરીદી પછી પણ તમારી પાસે ₹${remaining.toLocaleString('en-IN')} ની સેફ મર્યાદા રહેશે અને સપ્લાયરના નાણાં સુરક્ષિત રહેશે.`
          : `✅ Yes, you can afford ₹${amount.toLocaleString('en-IN')} today! Your Safe-to-Spend limit is ₹${safeToSpend.toLocaleString('en-IN')}. Even after this purchase, you will retain ₹${remaining.toLocaleString('en-IN')} in free liquidity while safeguarding your upcoming supplier dues.`,
        suggestedQuestions: ["Show restock recommendations", "What are my upcoming payments?"]
      };
    } else {
      const excess = amount - safeToSpend;
      return {
        isApproved: false,
        text: lang === 'hi'
          ? `⚠️ बिल्कुल अनुशंसित नहीं है! आप आज केवल ₹${safeToSpend.toLocaleString('en-IN')} तक ही सुरक्षित खर्च कर सकते हैं। ₹${amount.toLocaleString('en-IN')} खर्च करने पर ₹${excess.toLocaleString('en-IN')} की कमी होगी, जिससे 3 दिनों में महालक्ष्मी ट्रेडर्स (थोक सप्लायर) का ₹4,530 भुगतान अटक सकता है।`
          : lang === 'gu'
          ? `⚠️ ખરીદી સલાહભરેલી નથી! તમે આજે માત્ર ₹${safeToSpend.toLocaleString('en-IN')} સુધી જ સુરક્ષિત ખર્ચ કરી શકો છો. ₹${amount.toLocaleString('en-IN')} ખર્ચવાથી ₹${excess.toLocaleString('en-IN')} ની ઘટ પડશે અને 3 દિવસમાં મહાલક્ષ્મી ટ્રેડર્સનું પેમેન્ટ અટકી શકે છે.`
          : `⚠️ Not recommended today. You can safely spend up to ₹${safeToSpend.toLocaleString('en-IN')} right now. Spending ₹${amount.toLocaleString('en-IN')} exceeds your safe limit by ₹${excess.toLocaleString('en-IN')} and will endanger your upcoming ₹4,530 wholesale supplier payment in 3 days.`,
        suggestedQuestions: [
          `Can I buy ₹${safeToSpend} of stock instead?`,
          "Why is my cash low?",
          "How to collect customer khata credit?"
        ]
      };
    }
  }

  generateSupplierAdvice(metrics, lang) {
    const upcoming = metrics.upcomingEssentialPayments;
    const safe = metrics.safeToSpend;
    return {
      text: lang === 'hi'
        ? `आपके अगले 7 दिनों में कुल ₹${upcoming.toLocaleString('en-IN')} के आवश्यक भुगतान हैं:
1. अमूल एजेंसी (डेयरी): ₹1,800 (कल)
2. महालक्ष्मी ट्रेडर्स (किराना थोक): ₹4,530 (3 दिन बाद)

अच्छी खबर यह है कि आपके पास ₹12,480 का फंड है। इन दोनों भुगतानों और ₹1,500 के रिज़र्व को सुरक्षित रखने के बाद भी आप ₹${safe.toLocaleString('en-IN')} खर्च कर सकते हैं!`
        : lang === 'gu'
        ? `આવતા 7 દિવસમાં કુલ ₹${upcoming.toLocaleString('en-IN')} ના ચૂકવણાં છે:
1. અમૂલ એજન્સી (દૂધ): ₹1,800 (આવતીકાલે)
2. મહાલક્ષ્મી ટ્રેડર્સ (જથ્થાબંધ): ₹4,530 (3 દિવસમાં)

સારા સમાચાર એ છે કે તમારી પાસે ₹12,480 ફંડ છે. આ ચૂકવ્યા પછી પણ તમારી પાસે ₹${safe.toLocaleString('en-IN')} સેફ બેલેન્સ રહેશે!`
        : `You have ₹${upcoming.toLocaleString('en-IN')} in scheduled supplier commitments over the next 7 days:
• Tomorrow: ₹1,800 for Amul Agency (Milk & Butter)
• Day 3: ₹4,530 for Mahalaxmi Traders (Wholesale Spices & Oil)

Good news: Your current total funds (₹${metrics.totalFunds.toLocaleString('en-IN')}) safely cover both payments, leaving you with ₹${safe.toLocaleString('en-IN')} Safe-to-Spend.`,
      suggestedQuestions: ["Can I buy ₹8,000 of stock today?", "7-Day Forecast"]
    };
  }

  generateSafeToSpendExplanation(metrics, lang) {
    return {
      text: lang === 'hi'
        ? `💡 आपका 'सेफ-टू-स्पेंड' गणित बहुत सीधा और पारदर्शी है:
• कुल उपलब्ध फंड: ₹${metrics.totalFunds.toLocaleString('en-IN')}
• माइनस: आगामी आवश्यक खर्च: -₹${metrics.upcomingEssentialPayments.toLocaleString('en-IN')}
• माइनस: इमरजेंसी सेफ्टी बफर: -₹${metrics.safetyBuffer.toLocaleString('en-IN')}
==============================
= आज सुरक्षित खर्च सीमा: ₹${metrics.safeToSpend.toLocaleString('en-IN')}

इसका मतलब है कि जब तक आप ₹${metrics.safeToSpend.toLocaleString('en-IN')} से कम खर्च करते हैं, आपके सप्लायर, किराया और दुकान का बफर 100% सुरक्षित है!`
        : lang === 'gu'
        ? `💡 તમારું 'સેફ-ટુ-સ્પેન્ડ' ગણિત ખૂબ સરળ છે:
• કુલ ઉપલબ્ધ ફંડ: ₹${metrics.totalFunds.toLocaleString('en-IN')}
• બાદ: આગામી જરૂરી પેમેન્ટ: -₹${metrics.upcomingEssentialPayments.toLocaleString('en-IN')}
• બાદ: ઇમરજન્સી સેફ્ટી બફર: -₹${metrics.safetyBuffer.toLocaleString('en-IN')}
==============================
= આજે સુરક્ષિત ખર્ચ મર્યાદા: ₹${metrics.safeToSpend.toLocaleString('en-IN')}

આનો અર્થ એ છે કે તમે ₹${metrics.safeToSpend.toLocaleString('en-IN')} સુધીનો માલ કોઈ પણ ચિંતા વગર ખરીદી શકો છો!`
        : `💡 Here is how your Safe-to-Spend is calculated:
• Total Available Funds: ₹${metrics.totalFunds.toLocaleString('en-IN')}
• Minus Upcoming Essential Dues: -₹${metrics.upcomingEssentialPayments.toLocaleString('en-IN')}
• Minus Emergency Safety Buffer: -₹${metrics.safetyBuffer.toLocaleString('en-IN')}
==============================
= Safe-to-Spend Today: ₹${metrics.safeToSpend.toLocaleString('en-IN')}

As long as you stay within ₹${metrics.safeToSpend.toLocaleString('en-IN')}, all your supplier dues, rent, and emergency cash are completely safe!`,
      suggestedQuestions: ["Show restock recommendations", "Why is my cash low?"]
    };
  }

  generateWhyCashIsLow(metrics, lang) {
    const credit = metrics.breakdown.credit;
    return {
      text: lang === 'hi'
        ? `🔍 आपकी बिक्री अच्छी है, लेकिन इन 3 कारणों से नकदी में दबाव दिखता है:
1. आगामी थोक बिल: 3 दिनों में ₹4,530 का बड़ा सप्लायर भुगतान देय है।
2. ग्राहकों पर उधारी (खाता): जोशी काका पर ₹${credit.toLocaleString('en-IN')} की उधारी बाकी है।
3. सेटलमेंट देरी: कार्ड स्वाइप का ₹380 कल बैंक में क्रेडिट होगा।

सुझाव: जोशी काका से ₹1,000 की उधारी कलेक्ट करने के लिए एक मैत्रीपूर्ण WhatsApp रिमाइंडर भेजें!`
        : lang === 'gu'
        ? `🔍 તમારું વેચાણ સારું છે, પરંતુ આ 3 કારણોસર રોકડ ટાઈટ લાગે છે:
1. આગામી બિલ: 3 દિવસમાં ₹4,530 નું હોલસેલ પેમેન્ટ ચૂકવવાનું છે.
2. ગ્રાહક ઉધાર (ખાતાવહી): જોશી કાકા પાસે ₹${credit.toLocaleString('en-IN')} બાકી છે.
3. સેટલમેન્ટ સાયકલ: કાર્ડના ₹380 આવતીકાલે બેંકમાં જમા થશે.

સલાહ: જોશી કાકા પાસેથી ₹1,000 ઉઘરાવવા માટે વોટ્સએપ રીમાઇન્ડર મોકલો!`
        : `🔍 Your sales are healthy, but your cash is temporarily tied up due to three factors:
1. Scheduled Supplier Dues: ₹4,530 is due to Mahalaxmi Traders in 3 days.
2. Customer Credit (Khata): ₹${credit.toLocaleString('en-IN')} is pending collection from Joshi Kaka.
3. Settlement Latency: Card swipes (₹380) settle to your bank account tomorrow (T+1).

Recommended Action: Send a quick WhatsApp reminder to collect the ₹1,000 Khata credit before the weekend.`,
      suggestedQuestions: ["Send Khata payment reminder", "Can I buy ₹8,000 of stock today?"]
    };
  }

  generateSettlementExplanation(metrics, lang) {
    return {
      text: `⏱️ Settlement Rules in CashFlow Saathi:
• Cash: Instant (₹${metrics.breakdown.cash.toLocaleString('en-IN')} available in drawer)
• UPI (QR / Soundbox): Instant / Same-Day (₹${metrics.breakdown.upi.toLocaleString('en-IN')} in Bank)
• Card Swipe (POS): T+1 Day (₹${metrics.breakdown.card.toLocaleString('en-IN')} settles tomorrow morning)
• Bank Transfer: T+1 to T+2 Days
• Khata Credit: Settles when customer pays (₹${metrics.breakdown.credit.toLocaleString('en-IN')} due Sep 15)

The app automatically factors in these timelines so you never write a cheque against money that hasn't cleared!`,
      suggestedQuestions: ["How much can I safely spend?", "Why is my cash low?"]
    };
  }

  generateCreditAdvice(metrics, lang) {
    return {
      text: `📒 Customer Khata (Credit) Status:
• Joshi Kaka (Flat 302): ₹1,000 due on Sep 15
Collecting this ₹1,000 will instantly increase your Safe-to-Spend from ₹${metrics.safeToSpend.toLocaleString('en-IN')} to ₹${(metrics.safeToSpend + 1000).toLocaleString('en-IN')}!`,
      suggestedQuestions: ["Can I buy ₹8,000 of stock today?", "7-Day Forecast"]
    };
  }

  generateSchemesAdvice(lang) {
    return {
      text: `🏛️ Top Government Schemes for Your Shop:
1. PM SVANidhi: ₹10,000 to ₹50,000 working capital loan with 7% interest rebate for digital payments.
2. MUDRA (Shishu/Kishor): Up to ₹5 Lakh collateral-free loan for refrigeration & bulk purchase.
3. Udyam MSME: Free instant certificate that gives 45-day payment security.
4. GST Composition: Flat 1% tax, no complicated invoicing.

Check the 'Government Policies' tab in the navigation to learn more!`,
      suggestedQuestions: ["What is PM SVANidhi?", "How much can I safely spend?"]
    };
  }

  generateHealthAdvice(metrics, lang) {
    const health = metrics.healthScore;
    return {
      text: `📊 Your Cash Health Score is ${health.score}/100 (${health.status}: "${health.statusText}").
Your funds cover current commitments 1.9x times over. If you collect pending customer credits and hold non-essential stock orders until Day 4, your score will jump to 88/100!`,
      suggestedQuestions: ["Why is my cash low?", "Can I buy ₹8,000 of stock today?"]
    };
  }
}
