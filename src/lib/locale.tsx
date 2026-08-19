import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale =
  | "en"
  | "hi"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "it"
  | "nl"
  | "ru"
  | "ja"
  | "ko"
  | "zh-CN"
  | "zh-TW"
  | "ar"
  | "tr"
  | "th"
  | "vi"
  | "id"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "pl"
  | "sv"
  | "fa";

export const SUPPORTED_LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "nl", label: "Dutch", native: "Nederlands" },
  { code: "pl", label: "Polish", native: "Polski" },
  { code: "sv", label: "Swedish", native: "Svenska" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "fa", label: "Persian", native: "فارسی" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
  { code: "zh-CN", label: "Chinese (Simplified)", native: "简体中文" },
  { code: "zh-TW", label: "Chinese (Traditional)", native: "繁體中文" },
  { code: "th", label: "Thai", native: "ไทย" },
  { code: "vi", label: "Vietnamese", native: "Tiếng Việt" },
  { code: "id", label: "Indonesian", native: "Bahasa Indonesia" },
];

const STORAGE_KEY = "unifiedqr:locale";
const CHOSEN_KEY = "unifiedqr:locale:chosen";

const messages = {
  en: {
    "nav.products": "Products",
    "nav.types": "QR Code types",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "nav.resources": "Resources",
    "nav.language": "Language",
    "header.signIn": "Sign in",
    "auth.title": "Welcome back",
    "auth.subtitle":
      "Sign in to your workspace to manage saved codes, dynamic links and scan analytics.",
    "auth.signInWith": "Continue with Google",
    "auth.busy": "Opening Google…",
    "auth.googleOnly": "Google is currently the only sign-in method.",
    "auth.back": "← Back to the free generator",
    "auth.brand.tagline": "One workspace for every QR Code you ship.",
    "auth.brand.dynamic": "Dynamic short links you can re-point after printing.",
    "auth.brand.analytics": "Scan tracking on every dynamic code, live from the first scan.",
    "auth.brand.templates": "13 studio templates, custom colours, PNG and SVG exports.",
    "auth.brand.secure": "Google-verified sign-in. No passwords stored.",
    "auth.error.notAuthorized": "This email isn't authorized to access the admin panel.",
    "auth.signOut": "Sign out",
    "pricing.title": "Pay only for what you use",
    "pricing.subtitle":
      "Every plan includes unlimited free static QR Codes. Upgrade when you need tracking, editable codes or team access.",
    "pricing.mostPopular": "Most popular",
    "pricing.perMonth": "per month",
    "pricing.forever": "forever",
    "pricing.startFree": "Start free",
    "pricing.chooseFlex": "Choose Flex",
    "pricing.choosePro": "Choose Pro",
    "pricing.freeFeatures": [
      "Unlimited static QR Codes",
      "2 dynamic QR Codes",
      "PNG & SVG downloads",
      "13 design templates",
      "Commercial use",
    ],
    "pricing.flexFeatures": [
      "Everything in Free",
      "25 dynamic QR Codes",
      "Scan analytics & locations",
      "Logo upload",
      "Email support",
    ],
    "pricing.proFeatures": [
      "Everything in Flex",
      "Unlimited dynamic QR Codes",
      "5 team members",
      "Bulk creation & API access",
      "Custom short domain",
      "24/7 priority support",
    ],
    "billing.title": "Billing",
    "billing.subtitle":
      "Plan limits, upgrades and invoices. Payments are processed securely by Cashfree.",
    "billing.current": "Current",
    "billing.upgrade": "Upgrade",
    "billing.yourPlan": "Your plan",
    "billing.checkout": "Starting checkout…",
    "billing.signInToUpgrade": "Sign in to upgrade your plan.",
    "footer.tagline":
      "All-in-one tool to create free QR Codes, edit them, and track campaign performance. Trusted by 4K+ users worldwide.",
    "footer.product": "Product",
    "footer.qrCodes": "QR Codes",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "admin.unauthorized": "This email isn't authorized to log in to the admin panel.",
    "admin.signInToContinue": "Sign in with Google to continue.",
    "visitor.today": "visitors today",
    "chooser.title": "Choose your language",
    "chooser.subtitle": "Select your preferred language to continue",
    "home.hero.title": "UnifiedQR — 100% Free QR Code Generator",
    "home.hero.subtitle":
      "One Platform for Every QR Need. Create, customize, download, and track QR codes for URLs, websites, PDFs, vCards, Wi-Fi, email, SMS, and more — customizable designs, multiple formats, scan tracking, all in one place.",
    "home.social.trusted": "Trusted by",
    "home.social.users": "4K+ users",
    "home.social.onGoogle": "on Google",
    "home.social.noCreditCard": "No credit card required",
    "home.social.signupFree": "Sign up free",
    "home.steps.title": "How to create a free QR Code in 3 simple steps",
    "home.steps.1.title": "Choose your QR Code type",
    "home.steps.1.body":
      "Choose your QR Code type (static or dynamic) based on what you want it to do: open a URL, share a PDF, display a menu, share contact details, and more.",
    "home.steps.2.title": "Customize it your way",
    "home.steps.2.body":
      "Add your details, change the color, style your QR Code, add a logo, and test it in real time before downloading.",
    "home.steps.3.title": "Download & share",
    "home.steps.3.body":
      "Pick your preferred format — PNG, SVG, JPG, WebP or PDF — hit download, and you're all set to share it anywhere!",
    "home.steps.cta": "Create a free QR Code",
    "home.explained.title": "QR Codes explained",
    "home.explained.what.title": "What is a QR Code?",
    "home.explained.what.body":
      "A QR Code is a two-dimensional barcode that stores information, such as URLs, contact details, payment data, or text, in a grid of black and white squares. It can be scanned with a smartphone camera to instantly access the stored content without typing.",
    "home.explained.why.title": "Why do so many people use QR Codes in 2026?",
    "home.explained.why.body":
      "QR Codes provide a quick, contactless and low-cost way to link offline experiences to digital content. Businesses rely on them for real-time updates and to reduce print waste while giving users instant access with just a smartphone camera.",
    "home.explained.how.title": "How do I scan one?",
    "home.explained.how.1":
      "Open the camera app on your smartphone or tablet. Most modern devices scan QR Codes automatically.",
    "home.explained.how.2":
      "Point your camera at the QR Code, making sure it's clearly visible within the frame.",
    "home.explained.how.3": "Hold steady for a few seconds until the camera recognizes the code.",
    "home.explained.how.4":
      "Tap the notification or link that appears to open the website, video or contact card.",
    "home.dashboard.title": "Manage all your QR Codes from one dashboard",
    "home.dashboard.body":
      "Create, edit and track unlimited QR Codes from a single, easy-to-use dashboard. Update destinations, view analytics and collaborate with your team.",
    "home.dashboard.cta": "Try it free now",
    "home.features.title": "Why 4,000+ users trust UnifiedQR for data-driven QR Code campaigns",
    "home.features.track.title": "Track every scan",
    "home.features.track.body":
      "Know how your QR Code campaign is performing with real-time insights. Get data on scans, unique users, locations and devices.",
    "home.features.dynamic.title": "Free dynamic QR Codes",
    "home.features.dynamic.body":
      "Create up to 2 dynamic QR Codes for free and update their content anytime.",
    "home.features.collab.title": "Collaborate with your team",
    "home.features.collab.body":
      "Invite up to 5 team members to manage and share QR Codes on one dashboard.",
    "home.features.support.title": "24/7 customer support",
    "home.features.support.body":
      "Our team is always ready to fix issues quickly, via email or call.",
    "home.features.pay.title": "Pay for what you use",
    "home.features.pay.body":
      "Flexible pricing — pay only for the features or extra codes you need.",
    "home.features.cta": "Explore Flex plans",
    "home.types.title": "What types of QR Codes can you create for free?",
    "home.types.cta": "See all QR Code types",
    "home.faq.title": "Frequently asked questions",
    "home.faq.1.q": "Are the QR Codes free forever?",
    "home.faq.1.a":
      "Yes. Every static QR Code you create here is free, has no expiry date and no scan limit. You can download it as PNG or SVG and use it commercially.",
    "home.faq.2.q": "What is the difference between static and dynamic QR Codes?",
    "home.faq.2.a":
      "A static QR Code stores the data directly inside the code, so it can never be changed. A dynamic QR Code points to a short link you control, so you can edit the destination and track scans at any time.",
    "home.faq.3.q": "Can I add my logo to a QR Code?",
    "home.faq.3.a":
      "Yes. Pick a template, adjust your colors, and add a logo in the customization panel. Keep the logo small so scanners can still read the code reliably.",
    "home.faq.4.q": "Which file format should I download?",
    "home.faq.4.a":
      "Use PNG for screens, social posts and documents. Use SVG for print, large-format signage or anywhere you need to resize without losing quality. JPG, WebP and PDF are also available for maximum compatibility.",
    "home.faq.5.q": "Do QR Codes expire?",
    "home.faq.5.a":
      "Static QR Codes never expire. Dynamic QR Codes stay active as long as your account is active, and you can update where they point at any time.",
    "home.community.title": "Help us build the best QR Code platform",
    "home.community.body":
      "Have feedback, feature requests or ideas to make UnifiedQR better? Our community is actively shaping the product — share your thoughts and help us build renowned solutions together.",
    "home.community.cta": "Join the community on GitHub",
    "home.community.email": "Or reach us at",
  },
  hi: {
    "nav.products": "उत्पाद",
    "nav.types": "QR कोड प्रकार",
    "nav.pricing": "मूल्य",
    "nav.contact": "संपर्क",
    "nav.resources": "संसाधन",
    "nav.language": "भाषा",
    "header.signIn": "साइन इन",
    "auth.title": "वापसी पर स्वागत है",
    "auth.subtitle":
      "अपने वर्कस्पेस में साइन इन करके सेव किए गए कोड, डायनामिक लिंक और स्कैन एनालिटिक्स प्रबंधित करें।",
    "auth.signInWith": "Google से जारी रखें",
    "auth.busy": "Google खुल रहा है…",
    "auth.googleOnly": "Google वर्तमान में एकमात्र साइन-इन विधि है।",
    "auth.back": "← मुफ्त जनरेटर पर वापस जाएँ",
    "auth.brand.tagline": "हर QR कोड के लिए एक वर्कस्पेस।",
    "auth.brand.dynamic": "डायनामिक शॉर्ट लिंक जिन्हें आप प्रिंट के बाद बदल सकते हैं।",
    "auth.brand.analytics": "हर डायनामिक कोड पर स्कैन ट्रैकिंग, पहले स्कैन से लाइव।",
    "auth.brand.templates": "13 स्टूडियो टेम्पलेट, कस्टम रंग, PNG और SVG एक्सपोर्ट।",
    "auth.brand.secure": "Google-सत्यापित साइन-इन। कोई पासवर्ड संग्रहीत नहीं।",
    "auth.error.notAuthorized": "यह ईमेल एडमिन पैनल तक पहुँचने के लिए अधिकृत नहीं है।",
    "auth.signOut": "साइन आउट",
    "pricing.title": "जो उपयोग करते हैं, उसके लिए ही भुगतान करें",
    "pricing.subtitle":
      "हर प्लान में असीमित मुफ्त स्टैटिक QR कोड शामिल हैं। ट्रैकिंग, एडिटेबल कोड या टीम एक्सेस की आवश्यकता होने पर अपग्रेड करें।",
    "pricing.mostPopular": "सबसे लोकप्रिय",
    "pricing.perMonth": "प्रति माह",
    "pricing.forever": "हमेशा के लिए",
    "pricing.startFree": "मुफ्त शुरू करें",
    "pricing.chooseFlex": "Flex चुनें",
    "pricing.choosePro": "Pro चुनें",
    "pricing.freeFeatures": [
      "असीमित स्टैटिक QR कोड",
      "2 डायनामिक QR कोड",
      "PNG और SVG डाउनलोड",
      "13 डिज़ाइन टेम्पलेट",
      "व्यावसायिक उपयोग",
    ],
    "pricing.flexFeatures": [
      "Free की सभी सुविधाएँ",
      "25 डायनामिक QR कोड",
      "स्कैन एनालिटिक्स और स्थान",
      "लोगो अपलोड",
      "ईमेल सहायता",
    ],
    "pricing.proFeatures": [
      "Flex की सभी सुविधाएँ",
      "असीमित डायनामिक QR कोड",
      "5 टीम सदस्य",
      "बल्क निर्माण और API एक्सेस",
      "कस्टम शॉर्ट डोमेन",
      "24/7 प्राथमिकता सहायता",
    ],
    "billing.title": "बिलिंग",
    "billing.subtitle":
      "प्लान सीमाएँ, अपग्रेड और इनवॉइस। भुगतान Cashfree द्वारा सुरक्षित रूप से संसाधित होते हैं।",
    "billing.current": "वर्तमान",
    "billing.upgrade": "अपग्रेड",
    "billing.yourPlan": "आपका प्लान",
    "billing.checkout": "चेकआउट शुरू हो रहा है…",
    "billing.signInToUpgrade": "प्लान अपग्रेड करने के लिए साइन इन करें।",
    "footer.tagline":
      "मुफ्त QR कोड बनाने, संपादित करने और कैंपेन प्रदर्शन ट्रैक करने का ऑल-इन-वन टूल। 4K+ उपयोगकर्ताओं का विश्वास।",
    "footer.product": "उत्पाद",
    "footer.qrCodes": "QR कोड",
    "footer.company": "कंपनी",
    "footer.legal": "कानूनी",
    "admin.unauthorized": "यह ईमेल एडमिन पैनल में लॉग इन करने के लिए अधिकृत नहीं है।",
    "admin.signInToContinue": "जारी रखने के लिए Google से साइन इन करें।",
    "visitor.today": "आज के आगंतुक",
    "chooser.title": "अपनी भाषा चुनें",
    "chooser.subtitle": "जारी रखने के लिए अपनी पसंदीदा भाषा चुनें",
    "home.hero.title": "UnifiedQR — मुफ़्त QR Code जनरेटर",
    "home.hero.subtitle":
      "वेबसाइट, PDF, संपर्क, SMS और अन्य के लिए मुफ़्त QR Code बनाएँ। रंग अनुकूलित करें, PNG या SVG में डाउनलोड करें और हर स्कैन को ट्रैक करें — सब एक डैशबोर्ड से।",
    "home.social.trusted": "इन पर भरोसा करते हैं",
    "home.social.users": "4K+ उपयोगकर्ता",
    "home.social.onGoogle": "Google पर",
    "home.social.noCreditCard": "क्रेडिट कार्ड की आवश्यकता नहीं",
    "home.social.signupFree": "मुफ़्त में साइन अप करें",
    "home.steps.title": "3 सरल चरणों में मुफ़्त QR Code कैसे बनाएँ",
    "home.steps.1.title": "अपना QR Code प्रकार चुनें",
    "home.steps.1.body":
      "अपना QR Code प्रकार (स्टैटिक या डायनामिक) इस आधार पर चुनें कि आप इसे क्या करना चाहते हैं: URL खोलें, PDF साझा करें, मेनू दिखाएँ, संपर्क विवरण साझा करें, और बहुत कुछ।",
    "home.steps.2.title": "इसे अपने तरीके से अनुकूलित करें",
    "home.steps.2.body":
      "अपना विवरण जोड़ें, रंग बदलें, अपने QR Code को स्टाइल करें, लोगो जोड़ें और डाउनलोड करने से पहले इसे वास्तविक समय में परखें।",
    "home.steps.3.title": "डाउनलोड और साझा करें",
    "home.steps.3.body":
      "PNG या SVG प्रारूप चुनें, डाउनलोड दबाएँ, और आप कहीं भी साझा करने के लिए तैयार हैं!",
    "home.steps.cta": "मुफ़्त QR Code बनाएँ",
    "home.explained.title": "QR Code समझाया गया",
    "home.explained.what.title": "QR Code क्या है?",
    "home.explained.what.body":
      "QR Code एक द्वि-आयामी बारकोड है जो URL, संपर्क विवरण, भुगतान डेटा या टेक्स्ट जैसी जानकारी काले और सफेद वर्गों के ग्रिड में संग्रहीत करता है। इसे स्मार्टफोन कैमरे से स्कैन करके बिना टाइप किए संग्रहीत सामग्री तुरंत एक्सेस की जा सकती है।",
    "home.explained.why.title": "2026 में इतने से लोग QR Code क्यों उपयोग करते हैं?",
    "home.explained.why.body":
      "QR Code ऑफलाइन अनुभवों को डिजिटल सामग्री से जोड़ने का एक त्वरित, संपर्करहित और कम लागत वाला तरीका प्रदान करते हैं। व्यवसाय वास्तविक समय अपडेट और प्रिंट अपशिष्ट को कम करने के लिए इन पर निर्भर करते हैं।",
    "home.explained.how.title": "मैं इसे कैसे स्कैन करूँ?",
    "home.explained.how.1":
      "अपने स्मार्टफोन या टैबलेट पर कैमरा ऐप खोलें। अधिकांश आधुनिक डिवाइस QR Code को स्वचालित रूप से स्कैन करते हैं।",
    "home.explained.how.2":
      "अपने कैमरे को QR Code की ओर निर्देशित करें, सुनिश्चित करें कि यह फ्रेम में स्पष्ट रूप से दिखाई दे।",
    "home.explained.how.3": "कैमरे द्वारा कोड को पहचानने तक कुछ सेकंड के लिए स्थिर रखें।",
    "home.explained.how.4":
      "वेबसाइट, वीडियो या संपर्ट कार्ड खोलने के लिए दिखाई देने वाली सूचना या लिंक पर टैप करें।",
    "home.dashboard.title": "एक डैशबोर्ड से सभी QR Code प्रबंधित करें",
    "home.dashboard.body":
      "एक ही सरल डैशबोर्ड से असीमित QR Code बनाएँ, संपादित करें और ट्रैक करें। गंतव्य अपडेट करें, एनालिटिक्स देखें और अपनी टीम के साथ सहयोग करें।",
    "home.dashboard.cta": "अभी मुफ़्त में आज़माएँ",
    "home.features.title":
      "4 हज़ार+ उपयोगकर्ता ROI-संचालित QR Code अभियानों के लिए UnifiedQR पर भरोसा क्यों करते हैं",
    "home.features.track.title": "हर स्कैन ट्रैक करें",
    "home.features.track.body":
      "वास्तविक समय की जानकारी से जानें कि आपका QR Code अभियान कैसा प्रदर्शन कर रहा है। स्कैन, अद्वितीय उपयोगकर्ता, स्थान और डिवाइस पर डेटा प्राप्त करें।",
    "home.features.dynamic.title": "मुफ़्त डायनामिक QR Code",
    "home.features.dynamic.body":
      "मुफ़्त में 2 डायनामिक QR Code बनाएँ और कभी भी उनकी सामग्री अपडेट करें।",
    "home.features.collab.title": "अपनी टीम के साथ सहयोग करें",
    "home.features.collab.body":
      "एक डैशबोर्ड पर QR Code प्रबंधित और साझा करने के लिए 5 टीम सदस्यों को आमंत्रित करें।",
    "home.features.support.title": "24/7 ग्राहक सहायता",
    "home.features.support.body":
      "हमारी टीम हमेशा ईमेल या कॉल के माध्यम से जल्द से जल्द समस्याओं को ठीक करने के लिए तैयार है।",
    "home.features.pay.title": "जो उपयोग करें उसके लिए भुगतान करें",
    "home.features.pay.body":
      "लचीली मूल्य निर्धारण — केवल उन सुविधाओं या अतिरिक्त कोड के लिए भुगतान करें जिनकी आपको आवश्यकता है।",
    "home.features.cta": "Flex प्लान देखें",
    "home.types.title": "आप मुफ़्त में किस प्रकार के QR Code बना सकते हैं?",
    "home.types.cta": "सभी QR Code प्रकार देखें",
    "home.faq.title": "अक्सर पूछे जाने वाले प्रश्न",
    "home.faq.1.q": "क्या QR Code हमेशा के लिए मुफ़्त हैं?",
    "home.faq.1.a":
      "हाँ। यहाँ बनाया गया हर स्टैटिक QR Code मुफ़्त है, इसकी कोई समाप्ति तिथि नहीं है और कोई स्कैन सीमा नहीं है। आप इसे PNG या SVG में डाउनलोड करके व्यावसायिक रूप से उपयोग कर सकते हैं।",
    "home.faq.2.q": "स्टैटिक और डायनामिक QR Code में क्या अंतर है?",
    "home.faq.2.a":
      "स्टैटिक QR Code डेटा सीधे कोड के अंदर संग्रहीत करता है, इसलिए इसे कभी बदला नहीं जा सकता। डायनामिक QR Code एक छोटे लिंक की ओर इशारा करता है जिसे आप नियंत्रित करते हैं, इसलिए आप कभी भी गंतव्य बदल सकते हैं और स्कैन ट्रैक कर सकते हैं।",
    "home.faq.3.q": "क्या मैं अपना लोगो QR Code में जोड़ सकता हूँ?",
    "home.faq.3.a":
      "हाँ। एक टेम्पलेट चुनें, अपने रंग समायोजित करें और अनुकूलन पैनल में लोगो जोड़ें। लोगो को छोटा रखें ताकि स्कैनर अभी भी कोड को विश्वसनीय रूप से पढ़ सकें।",
    "home.faq.4.q": "मुझे किस फ़ाइल प्रारूप में डाउनलोड करना चाहिए?",
    "home.faq.4.a":
      "स्क्रीन, सोशल पोस्ट और दस्तावेज़ों के लिए PNG का उपयोग करें। प्रिंट, बड़े प्रारूप के साइनेज या गुणवत्ता खोए बिना रीसाइज़ करने की आवश्यकता वाली किसी भी जगह के लिए SVG का उपयोग करें।",
    "home.faq.5.q": "क्या QR Code की समय सीमा होती है?",
    "home.faq.5.a":
      "स्टैटिक QR Code कभी समाप्त नहीं होते। डायनामिक QR Code आपके खाते के सक्रिय रहने तक सक्रिय रहते हैं, और आप कभी भी उनका गंतव्य बदल सकते हैं।",
  },
  bn: {
    "nav.products": "পণ্য",
    "nav.types": "QR কোড ধরন",
    "nav.pricing": "মূল্য",
    "nav.contact": "যোগাযোগ",
    "nav.resources": "সম্পদ",
    "nav.language": "ভাষা",
    "header.signIn": "সাইন ইন",
    "auth.title": "স্বাগতম",
    "auth.subtitle":
      "সংরক্ষিত কোড, ডায়নামিক লিঙ্ক এবং স্ক্যান অ্যানালিটিক্স পরিচালনা করতে আপনার ওয়ার্কস্পেসে সাইন ইন করুন।",
    "auth.signInWith": "Google দিয়ে চালিয়ে যান",
    "auth.busy": "Google খুলছে…",
    "auth.googleOnly": "Google বর্তমানে একমাত্র সাইন-ইন পদ্ধতি।",
    "auth.back": "← বিনামূল্যে জেনারেটরে ফিরে যান",
    "auth.brand.tagline": "প্রতিটি QR কোডের জন্য একটি ওয়ার্কস্পেস।",
    "auth.brand.dynamic": "ডায়নামিক শর্ট লিঙ্ক যা প্রিন্টের পরে পরিবর্তন করতে পারেন।",
    "auth.brand.analytics": "প্রতিটি ডায়নামিক কোডে স্ক্যান ট্র্যাকিং, প্রথম স্ক্যান থেকে লাইভ।",
    "auth.brand.templates": "13টি স্টুডিও টেমপ্লেট, কাস্টম রঙ, PNG এবং SVG এক্সপোর্ট।",
    "auth.brand.secure": "Google-যাচাইকৃত সাইন-ইন। কোনো পাসওয়ার্ড সংরক্ষিত নয়।",
    "auth.error.notAuthorized": "এই ইমেল অ্যাডমিন প্যানেলে প্রবেশের অনুমোদিত নয়।",
    "auth.signOut": "সাইন আউট",
    "pricing.title": "শুধুমাত্র যা ব্যবহার করেন তার জন্য অর্থ প্রদান করুন",
    "pricing.subtitle":
      "প্রতিটি পরিকল্পনায় অসীমিত বিনামূল্যে স্ট্যাটিক QR কোড অন্তর্ভুক্ত। ট্র্যাকিং, সম্পাদনযোগ্য কোড বা দল অ্যাক্সেসের প্রয়োজন হলে আপগ্রেড করুন।",
    "pricing.mostPopular": "সর্বাধিক জনপ্রিয়",
    "pricing.perMonth": "প্রতি মাসে",
    "pricing.forever": "চিরকাল",
    "pricing.startFree": "বিনামূল্যে শুরু করুন",
    "pricing.chooseFlex": "Flex বাছাই করুন",
    "pricing.choosePro": "Pro বাছাই করুন",
    "pricing.freeFeatures": [
      "অসীমিত স্ট্যাটিক QR কোড",
      "২টি ডায়নামিক QR কোড",
      "PNG ও SVG ডাউনলোড",
      "১৩টি ডিজাইন টেমপ্লেট",
      "বাণিজ্যিক ব্যবহার",
    ],
    "pricing.flexFeatures": [
      "Free-এর সব সুবিধা",
      "২৫টি ডায়নামিক QR কোড",
      "স্ক্যান অ্যানালিটিক্স ও অবস্থান",
      "লোগো আপলোড",
      "ইমেল সহায়তা",
    ],
    "pricing.proFeatures": [
      "Flex-এর সব সুবিধা",
      "অসীমিত ডায়নামিক QR কোড",
      "৫ দলের সদস্য",
      "বাল্ক তৈরি ও API অ্যাক্সেস",
      "কাস্টম শর্ট ডোমেইন",
      "২৪/৭ অগ্রাধিকার সহায়তা",
    ],
    "billing.title": "বিলিং",
    "billing.subtitle":
      "পরিকল্পনা সীমা, আপগ্রেড এবং চালান। অর্থপ্রদান Cashfree দ্বারা নিরাপদে প্রক্রিয়াকরণ করা হয়।",
    "billing.current": "বর্তমান",
    "billing.upgrade": "আপগ্রেড",
    "billing.yourPlan": "আপনার পরিকল্পনা",
    "billing.checkout": "চেকআউট শুরু হচ্ছে…",
    "billing.signInToUpgrade": "পরিকল্পনা আপগ্রেড করতে সাইন ইন করুন।",
    "footer.tagline":
      "বিনামূল্যে QR কোড তৈরি, সম্পাদনা এবং ক্যাম্পেইন কর্মদক্ষতা ট্র্যাক করার অল-ইন-ওয়ান টুল। বিশ্বজুড়ে ৪K+ ব্যবহারকারীর বিশ্বাস।",
    "footer.product": "পণ্য",
    "footer.qrCodes": "QR কোড",
    "footer.company": "কোম্পানি",
    "footer.legal": "আইনি",
    "admin.unauthorized": "এই ইমেল অ্যাডমিন প্যানেলে লগ ইনের অনুমোদিত নয়।",
    "admin.signInToContinue": "চালিয়ে যেতে Google দিয়ে সাইন ইন করুন।",
    "visitor.today": "আজকের দর্শক",
    "chooser.title": "আপনার ভাষা বাছাই করুন",
    "chooser.subtitle": "চালিয়ে যেতে আপনার পছন্দের ভাষা বাছাই করুন",
    "home.hero.title": "UnifiedQR — বিনামূল্যে QR Code জেনারেটর",
    "home.hero.subtitle":
      "ওয়েবসাইট, PDF, যোগাযোগ, SMS এবং আরও জন্য বিনামূল্যে QR Code তৈরি করুন। রঙ কাস্টমাইজ করুন, PNG বা SVG হিসাবে ডাউনলোড করুন এবং প্রতিটি স্ক্যান ট্র্যাক করুন — সব একটি ড্যাশবোর্ড থেকে।",
    "home.social.trusted": "এদের বিশ্বাস করেন",
    "home.social.users": "৪K+ ব্যবহারকারী",
    "home.social.onGoogle": "Google-এ",
    "home.social.noCreditCard": "ক্রেডিট কার্ডের প্রয়োজন নেই",
    "home.social.signupFree": "বিনামূল্যে সাইন আপ করুন",
    "home.steps.title": "৩টি সহজ ধাপে বিনামূল্যে QR Code কীভাবে তৈরি করবেন",
    "home.steps.1.title": "আপনার QR Code ধরন বাছাই করুন",
    "home.steps.1.body":
      "আপনার QR Code ধরন (স্ট্যাটিক বা ডায়নামিক) এর উপর ভিত্তি করে বাছাই করুন যেটি করতে চান: URL খুলুন, PDF শেয়ার করুন, মেনু দেখান, যোগাযোগের বিবরণ শেয়ার করুন এবং আরও অনেক কিছু।",
    "home.steps.2.title": "নিজের মতো করে কাস্টমাইজ করুন",
    "home.steps.2.body":
      "আপনার বিবরণ যোগ করুন, রঙ পরিবর্তন করুন, আপনার QR Code স্টাইল করুন, লোগো যোগ করুন এবং ডাউনলোড করার আগে বাস্তব সময়ে পরীক্ষা করুন।",
    "home.steps.3.title": "ডাউনলোড ও শেয়ার করুন",
    "home.steps.3.body":
      "PNG বা SVG ফরম্যাট বেছে নিন, ডাউনলোড চাপুন এবং আপনি যেকোনো জায়গায় শেয়ার করার জন্য প্রস্তুত!",
    "home.steps.cta": "বিনামূল্যে QR Code তৈরি করুন",
    "home.explained.title": "QR Code ব্যাখ্যা করা হয়েছে",
    "home.explained.what.title": "QR Code কী?",
    "home.explained.what.body":
      "QR Code একটি দ্বিমাত্রিক বারকোড যা URL, যোগাযোগের বিবরণ, পেমেন্ট ডেটা বা টেক্সট ইত্যাদি তথ্য কালো এবং সাদা বর্গের একটি গ্রিডে সংরক্ষণ করে। এটি একটি স্মার্টফোন ক্যামেরা দিয়ে স্ক্যান করা যায় এবং টাইপ না করেই সংরক্ষিত বিষয়বস্তু তাৎক্ষণিকভাবে অ্যাক্সেস করা যায়।",
    "home.explained.why.title": "২০২৬ সালে এত মানুষ QR Code কেন ব্যবহার করেন?",
    "home.explained.why.body":
      "QR Code অফলাইন অভিজ্ঞতাকে ডিজিটাল বিষয়বস্তুর সাথে সংযুক্ত করার একটি দ্রুত, নন-কন্ট্যাক্ট এবং কম খরচের উপায় প্রদান করে। ব্যবসাগুলি রিয়েল-টাইম আপডেট এবং প্রিন্ট অপচয় কমানোর জন্য এদের উপর নির্ভর করে।",
    "home.explained.how.title": "আমি একটি কীভাবে স্ক্যান করব?",
    "home.explained.how.1":
      "আপনার স্মার্টফোন বা ট্যাবলেটে ক্যামেরা অ্যাপ খুলুন। অধিকাংশ আধুনিক ডিভাইস QR Code স্বয়ংক্রিয়ভাবে স্ক্যান করে।",
    "home.explained.how.2":
      "আপনার ক্যামেরা QR Code-এর দিকে নির্দেশ করুন, নিশ্চিত করুন যে এটি ফ্রেমের মধ্যে স্পষ্টভাবে দৃশ্যমান।",
    "home.explained.how.3": "ক্যামেরা কোডটি চেনা না পর্যন্ত কয়েক সেকেন্ড স্থির রাখুন।",
    "home.explained.how.4":
      "ওয়েবসাইট, ভিডিও বা যোগাযোগ কার্ড খুলতে দেখা যাওয়া বিজ্ঞপ্তি বা লিঙ্কে ট্যাপ করুন।",
    "home.dashboard.title": "একটি ড্যাশবোর্ড থেকে সমস্ত QR Code পরিচালনা করুন",
    "home.dashboard.body":
      "একটি সহজ ড্যাশবোর্ড থেকে অসীমিত QR Code তৈরি, সম্পাদনা এবং ট্র্যাক করুন। গন্তব্য আপডেট করুন, অ্যানালিটিক্স দেখুন এবং আপনার দলের সাথে সহযোগিতা করুন।",
    "home.dashboard.cta": "এখনই বিনামূল্যে চেষ্টা করুন",
    "home.features.title":
      "৪ হাজার+ ব্যবহারকারী ROI-চালিত QR Code ক্যাম্পেইনের জন্য UnifiedQR-এ কেন বিশ্বাস করেন",
    "home.features.track.title": "প্রতিটি স্ক্যান ট্র্যাক করুন",
    "home.features.track.body":
      "রিয়েল-টাইম অন্তর্দৃষ্টি দিয়ে জানুন আপনার QR Code ক্যাম্পেইন কেমন পারফর্ম করছে। স্ক্যান, অদ্বিতীয় ব্যবহারকারী, অবস্থান এবং ডিভাইস সম্পর্কে ডেটা পান।",
    "home.features.dynamic.title": "বিনামূল্যে ডায়নামিক QR Code",
    "home.features.dynamic.body":
      "বিনামূল্যে ২টি ডায়নামিক QR Code তৈরি করুন এবং যেকোনো সময় তাদের বিষয়বস্তু আপডেট করুন।",
    "home.features.collab.title": "আপনার দলের সাথে সহযোগিতা করুন",
    "home.features.collab.body":
      "একটি ড্যাশবোর্ডে QR Code পরিচালনা ও শেয়ার করতে ৫ জন দল সদস্যকে আমন্ত্রণ জানান।",
    "home.features.support.title": "২৪/৭ গ্রাহক সহায়তা",
    "home.features.support.body":
      "আমাদের দল সবসময় ইমেল বা কলের মাধ্যমে দ্রুত সমস্যা সমাধান করতে প্রস্তুত।",
    "home.features.pay.title": "যা ব্যবহার করেন তার জন্য অর্থ প্রদান করুন",
    "home.features.pay.body":
      "নমনীয় মূল্য — শুধুমাত্র প্রয়োজনীয় বৈশিষ্ট্য বা অতিরিক্ত কোডের জন্য অর্থ প্রদান করুন।",
    "home.features.cta": "Flex পরিকল্পনা দেখুন",
    "home.types.title": "আপনি বিনামূল্যে কী ধরনের QR Code তৈরি করতে পারেন?",
    "home.types.cta": "সমস্ত QR Code ধরন দেখুন",
    "home.faq.title": "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    "home.faq.1.q": "QR Code কি সবসময়ের জন্য বিনামূল্যে?",
    "home.faq.1.a":
      "হ্যাঁ। এখানে তৈরি প্রতিটি স্ট্যাটিক QR Code বিনামূল্যে, কোনো মেয়াদ নেই এবং কোনো স্ক্যান সীমা নেই। আপনি এটি PNG বা SVG হিসাবে ডাউনলোড করে বাণিজ্যিকভাবে ব্যবহার করতে পারেন।",
    "home.faq.2.q": "স্ট্যাটিক এবং ডায়নামিক QR Code-এর মধ্যে পার্থক্য কী?",
    "home.faq.2.a":
      "স্ট্যাটিক QR Code তথ্য সরাসরি কোডের ভিতরে সংরক্ষণ করে, তাই এটি কখনই পরিবর্তন করা যায় না। ডায়নামিক QR Code একটি ছোট লিঙ্কের দিকে নির্দেশ করে যা আপনি নিয়ন্ত্রণ করেন, তাই আপনি যেকোনো সময় গন্তব্য সম্পাদনা এবং স্ক্যান ট্র্যাক করতে পারেন।",
    "home.faq.3.q": "আমি কি আমার QR Code-এ লোগো যোগ করতে পারি?",
    "home.faq.3.a":
      "হ্যাঁ। একটি টেমপ্লেট বেছে নিন, আপনার রঙ সামঞ্জস্য করুন এবং কাস্টমাইজেশন প্যানেলে লোগো যোগ করুন। স্ক্যানাররা এখনও কোডটি নির্ভরযোগ্যভাবে পড়তে পারে তাই লোগো ছোট রাখুন।",
    "home.faq.4.q": "আমি কোন ফাইল ফরম্যাটে ডাউনলোড করব?",
    "home.faq.4.a":
      "স্ক্রিন, সোশ্যাল পোস্ট এবং ডকুমেন্টের জন্য PNG ব্যবহার করুন। প্রিন্ট, বড় ফরম্যাটের সাইনেজ বা গুণমান হারাতে না গিয়ে রিসাইজ করার প্রয়োজন হয় এমন যেকোনো জায়গায় SVG ব্যবহার করুন।",
    "home.faq.5.q": "QR Code-এর মেয়াদ আছে কি?",
    "home.faq.5.a":
      "স্ট্যাটিক QR Code কখনই মেয়াদোত্তীর্ণ হয় না। ডায়নামিক QR Code আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত সক্রিয় থাকে এবং আপনি যেকোনো সময় তাদের গন্তব্য আপডেট করতে পারেন।",
  },
  ta: {
    "nav.products": "தயாரிப்புகள்",
    "nav.types": "QR குறியீடு வகைகள்",
    "nav.pricing": "விலை",
    "nav.contact": "தொடர்பு",
    "nav.resources": "வளங்கள்",
    "nav.language": "மொழி",
    "header.signIn": "உள்நுழை",
    "auth.title": "மீண்டும் வரவேற்கிறோம்",
    "auth.subtitle":
      "சேமிக்கப்பட்ட குறியீடுகள், டைனாமிக் இணைப்புகள் மற்றும் ஸ்கேன் பகுப்பாய்வுகளை நிர்வகிக்க உங்கள் பணியிடத்தில் உள்நுழையுங்கள்.",
    "auth.signInWith": "Google மூலம் தொடரவும்",
    "auth.busy": "Google திறக்கிறது…",
    "auth.googleOnly": "Google தற்போது ஒரே உள்நுழைவு முறை.",
    "auth.back": "← இலவச ஜெனரேட்டருக்குத் திரும்புங்கள்",
    "auth.brand.tagline": "ஒவ்வொரு QR குறியீட்டிற்கும் ஒரு பணியிடம்.",
    "auth.brand.dynamic": "அச்சிட்ட பிறகு மாற்றக்கூடிய டைனாமிக் குறுகிய இணைப்புகள்.",
    "auth.brand.analytics":
      "ஒவ்வொரு டைனாமிக் குறியீட்டிலும் ஸ்கேன் கண்காணிப்பு, முதல் ஸ்கேனிலிருந்து நேரலை.",
    "auth.brand.templates":
      "13 ஸ்டுடியோ வார்ப்புருக்கள், தனிப்பயன் வண்ணங்கள், PNG மற்றும் ஏற்றுமதிகள்.",
    "auth.brand.secure": "Google-சரிபார்க்கப்பட்ட உள்நுழைவு. கடவுச்சொற்கள் சேமிக்கப்படவில்லை.",
    "auth.error.notAuthorized": "இந்த மின்னஞ்சல் நிர்வாக பேனலை அணுக அனுமதிக்கப்படவில்லை.",
    "auth.signOut": "வெளியேறு",
    "pricing.title": "நீங்கள் பயன்படுத்துவதற்கு மட்டுமே பணம் செலுத்துங்கள்",
    "pricing.subtitle":
      "ஒவ்வொரு திட்டத்திலும் வரம்பற்ற இலவச நிலையான QR குறியீடுகள் அடங்கும். கண்காணிப்பு, திருத்தக்கூடிய குறியீடுகள் அல்லது குழு அணுகல் தேவைப்படும்போது மேம்படுத்தவும்.",
    "pricing.mostPopular": "மிகவும் பிரபலமானது",
    "pricing.perMonth": "மாதம்",
    "pricing.forever": "எப்போதும்",
    "pricing.startFree": "இலவசமாகத் தொடங்குங்கள்",
    "pricing.chooseFlex": "Flex தேர்ந்தெடுக்கவும்",
    "pricing.choosePro": "Pro தேர்ந்தெடுக்கவும்",
    "pricing.freeFeatures": [
      "வரம்பற்ற நிலையான QR குறியீடுகள்",
      "2 டைனாமிக் QR குறியீடுகள்",
      "PNG & SVG பதிவிறக்கங்கள்",
      "13 வடிவமைப்பு வார்ப்புருக்கள்",
      "வணிக பயன்பாடு",
    ],
    "pricing.flexFeatures": [
      "Free இல் உள்ள அனைத்தும்",
      "25 டைனாமிக் QR குறியீடுகள்",
      "ஸ்கேன் பகுப்பாய்வு & இடங்கள்",
      "லோகோ பதிவேற்றம்",
      "மின்னஞ்சல் ஆதரவு",
    ],
    "pricing.proFeatures": [
      "Flex இல் உள்ள அனைத்தும்",
      "வரம்பற்ற டைனாமிக் QR குறியீடுகள்",
      "5 குழு உறுப்பினர்கள்",
      "தொகுதி உருவாக்கம் & API அணுகல்",
      "தனிப்பயன் குறுகிய டொமைன்",
      "24/7 முன்னுரிமை ஆதரவு",
    ],
    "billing.title": "பில்லிங்",
    "billing.subtitle":
      "திட்ட வரம்புகள், மேம்படுத்தல்கள் மற்றும் விலைப்பட்டியல்கள். பணம் செலுத்தல்கள் Cashfree மூலம் பாதுகாப்பாக செயலாக்கப்படுகின்றன.",
    "billing.current": "தற்போதைய",
    "billing.upgrade": "மேம்படுத்தல்",
    "billing.yourPlan": "உங்கள் திட்டம்",
    "billing.checkout": "செக்அவுட் தொடங்குகிறது…",
    "billing.signInToUpgrade": "திட்டத்தை மேம்படுத்த உள்நுழையுங்கள்.",
    "footer.tagline":
      "இலவச QR குறியீடுகளை உருவாக்க, திருத்த மற்றும் பிரச்சார செயல்திறனை கண்காணிக்க ஒரே கருவி. உலகளாவிய 4K+ பயனர்களின் நம்பிக்கை.",
    "footer.product": "தயாரிப்பு",
    "footer.qrCodes": "QR குறியீடுகள்",
    "footer.company": "நிறுவனம்",
    "footer.legal": "சட்டரீதியான",
    "admin.unauthorized": "இந்த மின்னஞ்சல் நிர்வாக பேனலில் உள்நுழைய அனுமதிக்கப்படவில்லை.",
    "admin.signInToContinue": "தொடர Google மூலம் உள்நுழையுங்கள்.",
    "visitor.today": "இன்றைய பார்வையாளர்கள்",
    "chooser.title": "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    "chooser.subtitle": "தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    "home.hero.title": "UnifiedQR — இலவச QR Code ஜெனரேட்டர்",
    "home.hero.subtitle":
      "இணையதளங்கள், PDF, தொடர்புகள், SMS மற்றும் பலவற்றிற்கான இலவச QR Code-களை உருவாக்கவும். நிறங்களைத் தனிப்பயனாக்கவும், PNG அல்லது SVG ஆக பதிவிறக்கவும், ஒவ்வொரு ஸ்கேனையும் கண்காணிக்கவும் — அனைத்தும் ஒரே டாஷ்போர்டில் இருந்து.",
    "home.social.trusted": "நம்பிக்கை கொள்வோர்",
    "home.social.users": "4K+ பயனர்கள்",
    "home.social.onGoogle": "Google-ல்",
    "home.social.noCreditCard": "கிரெடிட் கார்ட் தேவையில்லை",
    "home.social.signupFree": "இலவசமாக பதிவு செய்யுங்கள்",
    "home.steps.title": "3 எளிய படிகளில் இலவச QR Code எவ்வாறு உருவாக்குவது",
    "home.steps.1.title": "உங்கள் QR Code வகையைத் தேர்ந்தெடுக்கவும்",
    "home.steps.1.body":
      "நீங்கள் என்ன செய்ய விரும்புகிறீர்கள் என்பதன் அடிப்படையில் உங்கள் QR Code வகையை (நிலையான அல்லது இயக்கவியல்) தேர்ந்தெடுக்கவும்: URL ஐத் திறக்கவும், PDF ஐப் பகிரவும், மெனுவைக் காட்டவும், தொடர்பு விவரங்களைப் பகிரவும், மேலும் பல.",
    "home.steps.2.title": "உங்கள் வழியில் தனிப்பயனாக்கவும்",
    "home.steps.2.body":
      "உங்கள் விவரங்களைச் சேர்க்கவும், நிறத்தை மாற்றவும், உங்கள் QR Code-ஐ ஸ்டைல் செய்யவும், லோகோவைச் சேர்க்கவும், பதிவிறக்குவதற்கு முன் நிகழ்நேரத்தில் சோதிக்கவும்.",
    "home.steps.3.title": "பதிவிறக்கம் & பகிர்வு",
    "home.steps.3.body":
      "PNG அல்லது SVG வடிவத்தைத் தேர்ந்தெடுக்கவும், பதிவிறக்கத்தை அழுத்தவும், எங்கும் பகிர நீங்கள் தயாராக இருக்கிறீர்கள்!",
    "home.steps.cta": "இலவச QR Code உருவாக்கவும்",
    "home.explained.title": "QR Code விளக்கப்பட்டது",
    "home.explained.what.title": "QR Code என்றால் என்ன?",
    "home.explained.what.body":
      "QR Code என்பது URL, தொடர்பு விவரங்கள், கட்டணத் தரவு அல்லது உரை போன்ற தகவல்களை கருப்பு மற்றும் வெள்ளை சதுரங்களின் வரைபடத்தில் சேமிக்கும் இரு-பரிமாண பார்கோட் ஆகும். இதை ஸ்மார்ட்போன் கேமராவால் ஸ்கேன் செய்து டைப் செய்யாமல் சேமிக்கப்பட்ட உள்ளடக்கத்தை உடனடியாக அணுகலாம்.",
    "home.explained.why.title": "2026-ல் ஏன் இவ்வளவு பேர் QR Code பயன்படுத்துகிறார்கள்?",
    "home.explained.why.body":
      "QR Code ஆன்லைன் அனுபவங்களை டிஜிட்டல் உள்ளடக்கத்துடன் இணைக்க ஒரு விரைவான, தொடர்பற்ற மற்றும் குறைந்த செலவிலான வழியை வழங்குகின்றன. நிறுவனங்கள் நிகழ்நேர புதுப்பிப்புகள் மற்றும் அச்சு கழிவுகளைக் குறைக்க இவற்றை நம்பியிருக்கின்றன.",
    "home.explained.how.title": "நான் ஒன்றை எவ்வாறு ஸ்கேன் செய்வது?",
    "home.explained.how.1":
      "உங்கள் ஸ்மார்ட்போன் அல்லது டேப்லெட்டில் கேமரா ஆப்பைத் திறக்கவும். பெரும்பாலான நவீன சாதனங்கள் QR Code-களை தானாகவே ஸ்கேன் செய்கின்றன.",
    "home.explained.how.2":
      "QR Code-ஐ நோக்கி உங்கள் கேமராவைச் சுட்டிக்காட்டவும், அது சட்டத்திற்குள் தெளிவாகத் தெரிவதை உறுதிசெய்யவும்.",
    "home.explained.how.3": "கேமரா குறியீட்டை அடையாளம் காணும் வரை சில விநாடிகள் நிலையாக இருங்கள்.",
    "home.explained.how.4":
      "இணையதளம், வீடியோ அல்லது தொடர்பு அட்டையைத் திறக்க தோன்றும் அறிவிப்பு அல்லது இணைப்பை ஆட் செய்யவும்.",
    "home.dashboard.title": "ஒரே டாஷ்போர்டில் அனைத்து QR Code-களையும் நிர்வகிக்கவும்",
    "home.dashboard.body":
      "ஒற்றை எளிதான டாஷ்போர்டில் வரம்பற்ற QR Code-களை உருவாக்கவும், திருத்தவும் மற்றும் கண்காணிக்கவும். இலக்குகளைப் புதுப்பிக்கவும், பகுப்பாய்வுகளைக் காணவும், உங்கள் குழுவுடன் ஒத்துழைக்கவும்.",
    "home.dashboard.cta": "இப்போது இலவசமாக முயற்சிக்கவும்",
    "home.features.title":
      "4 ஆயிரம்+ பயனர்கள் ROI இயக்கும் QR Code பிரச்சாரங்களுக்காக ஏன் UnifiedQR-ஐ நம்புகிறார்கள்",
    "home.features.track.title": "ஒவ்வொரு ஸ்கேனையும் கண்காணிக்கவும்",
    "home.features.track.body":
      "நிகழ்நேர நுண்ணறிவுகளுடன் உங்கள் QR Code பிரச்சாரம் எவ்வாறு செயல்படுகிறது என்பதை அறியவும். ஸ்கேன்கள், தனிப்பட்ட பயனர்கள், இடங்கள் மற்றும் சாதனங்கள் குறித்த தரவைப் பெறுங்கள்.",
    "home.features.dynamic.title": "இலவச இயக்கவியல் QR Code",
    "home.features.dynamic.body":
      "இலவசமாக 2 இயக்கவியல் QR Code-களை உருவாக்கி, எப்போது வேண்டுமானாலும் அவற்றின் உள்ளடக்கத்தைப் புதுப்பிக்கவும்.",
    "home.features.collab.title": "உங்கள் குழுவுடன் ஒத்துழைக்கவும்",
    "home.features.collab.body":
      "ஒரே டாஷ்போர்டில் QR Code-களை நிர்வகிக்கவும் பகிரவும் 5 குழு உறுப்பினர்களை அழைக்கவும்.",
    "home.features.support.title": "24/7 வாடிக்கையாளர் ஆதரவு",
    "home.features.support.body":
      "எங்கள் குழு எப்போதும் மின்னஞ்சல் அல்லது அழைப்பு மூலம் விரைவாக சிக்கல்களைச் சரிசெய்ய தயாராக உள்ளது.",
    "home.features.pay.title": "பயன்படுத்துவதற்கு மட்டுமே பணம் செலுத்துங்கள்",
    "home.features.pay.body":
      "நெகிழ்வான விலை நிர்ணயம் — தேவையான அம்சங்கள் அல்லது கூடுதல் குறியீடுகளுக்கு மட்டுமே பணம் செலுத்துங்கள்.",
    "home.features.cta": "Flex திட்டங்களை ஆராயுங்கள்",
    "home.types.title": "இலவசமாக எந்த வகையான QR Code-களை உருவாக்க முடியும்?",
    "home.types.cta": "அனைத்து QR Code வகைகளையும் காண்க",
    "home.faq.title": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "home.faq.1.q": "QR Code-கள் என்றும் இலவசமா?",
    "home.faq.1.a":
      "ஆம். இங்கே நீங்கள் உருவாக்கும் ஒவ்வொரு நிலையான QR Code-ம் இலவசம், காலாவதி தேதி இல்லை, ஸ்கேன் வரம்பும் இல்லை. அதை PNG அல்லது SVG ஆக பதிவிறக்கி வணிக ரீதியாகப் பயன்படுத்தலாம்.",
    "home.faq.2.q": "நிலையான மற்றும் இயக்கவியல் QR Code-களுக்கு இடையே என்ன வேறுபாடு?",
    "home.faq.2.a":
      "நிலையான QR Code தரவை நேரடியாகக் குறியீட்டிற்குள் சேமிக்கிறது, எனவே அதை ஒருபோதும் மாற்ற முடியாது. இயக்கவியல் QR Code நீங்கள் கட்டுப்படுத்தும் ஒரு குறுகிய இணைப்பை நோக்கி சுட்டிக்காட்டுகிறது, எனவே நீங்கள் எப்போது வேண்டுமானாலும் இலக்கைத் திருத்தி ஸ்கேன்களைக் கண்காணிக்கலாம்.",
    "home.faq.3.q": "QR Code-ல் எனது லோகோவைச் சேர்க்க முடியுமா?",
    "home.faq.3.a":
      "ஆம். ஒரு வார்ப்புருவைத் தேர்ந்தெடுத்து, உங்கள் நிறங்களைச் சரிசெய்து, தனிப்பயனாக்கல் பேனலில் லோகோவைச் சேர்க்கவும். ஸ்கேனர்கள் இன்னும் குறியீட்டை நம்பகமாகப் படிக்க முடியும் என்பதால் லோகோவை சிறியதாக வைக்கவும்.",
    "home.faq.4.q": "நான் எந்த கோப்பு வடிவத்தில் பதிவிறக்க வேண்டும்?",
    "home.faq.4.a":
      "திரைகள், சமூக இடுகைகள் மற்றும் ஆவணங்களுக்கு PNG ஐப் பயன்படுத்தவும். அச்சு, பெரிய வடிவ சைனேஜ் அல்லது தரத்தை இழக்காமல் மறுஅளவிட வேண்டிய இடங்களுக்கு SVG ஐப் பயன்படுத்தவும்.",
    "home.faq.5.q": "QR Code-களுக்கு காலாவதி உண்டா?",
    "home.faq.5.a":
      "நிலையான QR Code-கள் ஒருபோதும் காலாவதியாகாது. இயக்கவியல் QR Code-கள் உங்கள் கணக்கு செயலில் இருக்கும் வரை செயலில் இருக்கும், மேலும் அவை எங்கு சுட்டிக்காட்டுகின்றன என்பதை எப்போது வேண்டுமானாலும் புதுப்பிக்கலாம்.",
  },
  te: {
    "nav.products": "ఉత్పత్తులు",
    "nav.types": "QR కోడ్ రకాలు",
    "nav.pricing": "ధర",
    "nav.contact": "సంప్రదింపు",
    "nav.resources": "వనరులు",
    "nav.language": "భాష",
    "header.signIn": "సైన్ ఇన్",
    "auth.title": "తిరిగి స్వాగతం",
    "auth.subtitle":
      "సేవ్ చేసిన కోడ్‌లు, డైనమిక్ లింక్‌లు మరియు స్కాన్ అనలిటిక్స్ నిర్వహించడానికి మీ వర్క్‌స్పేస్‌లో సైన్ ఇన్ చేయండి.",
    "auth.signInWith": "Google తో కొనసాగించండి",
    "auth.busy": "Google తెరుస్తోంది…",
    "auth.googleOnly": "Google ప్రస్తుతం ఏకైక సైన్-ఇన్ పద్ధతి.",
    "auth.back": "← ఉచిత జెనరేటర్‌కి తిరిగి వెళ్ళండి",
    "auth.brand.tagline": "ప్రతి QR కోడ్‌కి ఒక వర్క్‌స్పేస్.",
    "auth.brand.dynamic": "ముద్రించిన తర్వాత మార్చగల డైనమిక్ షార్ట్ లింక్‌లు.",
    "auth.brand.analytics": "ప్రతి డైనమిక్ కోడ్‌లో స్కాన్ ట్రాకింగ్, మొదటి స్కాన్ నుండి లైవ్.",
    "auth.brand.templates": "13 స్టూడియో టెంప్లేట్‌లు, కస్టమ్ రంగులు, PNG మరియు SVG ఎగుమతులు.",
    "auth.brand.secure": "Google-ధృవీకరించబడిన సైన్-ఇన్. పాస్‌వర్డ్‌లు నిల్వ చేయబడవు.",
    "auth.error.notAuthorized": "ఈ ఇమెయిల్ అడ్మిన్ ప్యానెల్‌ను యాక్సెస్ చేయడానికి అనుమతించబడలేదు.",
    "auth.signOut": "సైన్ అవుట్",
    "pricing.title": "మీరు ఉపయోగించేదానికి మాత్రమే చెల్లించండి",
    "pricing.subtitle":
      "ప్రతి ప్లాన్‌లో అపరిమిత ఉచిత స్టాటిక్ QR కోడ్‌లు ఉన్నాయి. ట్రాకింగ్, ఎడిట్ చేయగల కోడ్‌లు లేదా టీమ్ యాక్సెస్ అవసరమైనప్పుడు అప్‌గ్రేడ్ చేయండి.",
    "pricing.mostPopular": "అత్యంత ప్రజాదరణ",
    "pricing.perMonth": "నెలకు",
    "pricing.forever": "ఎల్లప్పుడూ",
    "pricing.startFree": "ఉచితంగా ప్రారంభించండి",
    "pricing.chooseFlex": "Flex ఎంచుకోండి",
    "pricing.choosePro": "Pro ఎంచుకోండి",
    "pricing.freeFeatures": [
      "అపరిమిత స్టాటిక్ QR కోడ్‌లు",
      "2 డైనమిక్ QR కోడ్‌లు",
      "PNG & SVG డౌన్‌లోడ్‌లు",
      "13 డిజైన్ టెంప్లేట్‌లు",
      "వాణిజ్య ఉపయోగం",
    ],
    "pricing.flexFeatures": [
      "Free లో ఉన్నవన్నీ",
      "25 డైనమిక్ QR కోడ్‌లు",
      "స్కాన్ అనలిటిక్స్ & స్థానాలు",
      "లోగో అప్‌లోడ్",
      "ఇమెయిల్ మద్దతు",
    ],
    "pricing.proFeatures": [
      "Flex లో ఉన్నవన్నీ",
      "అపరిమిత డైనమిక్ QR కోడ్‌లు",
      "5 టీమ్ సభ్యులు",
      "బల్క్ సృష్టి & API యాక్సెస్",
      "కస్టమ్ షార్ట్ డొమైన్",
      "24/7 ప్రాధాన్య మద్దతు",
    ],
    "billing.title": "బిల్లింగ్",
    "billing.subtitle":
      "ప్లాన్ పరిమితులు, అప్‌గ్రేడ్‌లు మరియు ఇన్వాయిస్‌లు. చెల్లింపులు Cashfree ద్వారా సురక్షితంగా ప్రాసెస్ చేయబడతాయి.",
    "billing.current": "ప్రస్తుత",
    "billing.upgrade": "అప్‌గ్రేడ్",
    "billing.yourPlan": "మీ ప్లాన్",
    "billing.checkout": "చెక్అవుట్ ప్రారంభమవుతోంది…",
    "billing.signInToUpgrade": "ప్లాన్ అప్‌గ్రేడ్ చేయడానికి సైన్ ఇన్ చేయండి.",
    "footer.tagline":
      "ఉచిత QR కోడ్‌లను సృష్టించడానికి, సవరించడానికి మరియు క్యాంపెయిన్ పనితీరును ట్రాక్ చేయడానికి ఆల్-ఇన్-వన్ టూల్. ప్రపంచవ్యాప్తంగా 4K+ వినియోగదారుల నమ్మకం.",
    "footer.product": "ఉత్పత్తి",
    "footer.qrCodes": "QR కోడ్‌లు",
    "footer.company": "కంపెనీ",
    "footer.legal": "చట్టపరమైన",
    "admin.unauthorized": "ఈ ఇమెయిల్ అడ్మిన్ ప్యానెల్‌లో లాగిన్ అవడానికి అనుమతించబడలేదు.",
    "admin.signInToContinue": "కొనసాగించడానికి Google తో సైన్ ఇన్ చేయండి.",
    "visitor.today": "నేటి సందర్శకులు",
    "chooser.title": "మీ భాషను ఎంచుకోండి",
    "chooser.subtitle": "కొనసాగించడానికి మీకు ఇష్టమైన భాషను ఎంచుకోండి",
    "home.hero.title": "UnifiedQR — ఉచిత QR Code జెనరేటర్",
    "home.hero.subtitle":
      "వెబ్‌సైట్లు, PDF, కాంటాక్ట్‌లు, SMS మరియు మరిన్నింటి కోసం ఉచిత QR Code‌లను సృష్టించండి. రంగులను అనుకూలించండి, PNG లేదా SVG గా డౌన్‌లోడ్ చేసుకోండి మరియు ప్రతి స్కాన్‌ను ట్రాక్ చేయండి — అన్నీ ఒక డ్యాష్‌బోర్డ్ నుండి.",
    "home.social.trusted": "నమ్మకం",
    "home.social.users": "4K+ వినియోగదారులు",
    "home.social.onGoogle": "Google లో",
    "home.social.noCreditCard": "క్రెడిట్ కార్డ్ అవసరం లేదు",
    "home.social.signupFree": "ఉచితంగా సైన్ అప్ చేయండి",
    "home.steps.title": "3 సులభమైన దశల్లో ఉచిత QR Code ఎలా సృష్టించాలి",
    "home.steps.1.title": "మీ QR Code రకాన్ని ఎంచుకోండి",
    "home.steps.1.body":
      "మీ QR Code రకాన్ని (స్టాటిక్ లేదా డైనమిక్) మీరు ఏమి చేయాలనుకుంటున్నారు అనే దాని ఆధారంగా ఎంచుకోండి: URL తెరవండి, PDF షేర్ చేయండి, మెనూ చూపించండి, కాంటాక్ట్ వివరాలు షేర్ చేయండి మరియు మరిన్ని.",
    "home.steps.2.title": "మీ విధంగా అనుకూలించండి",
    "home.steps.2.body":
      "మీ వివరాలు జోడించండి, రంగు మార్చండి, మీ QR Code ను స్టైల్ చేయండి, లోగో జోడించండి మరియు డౌన్‌లోడ్ చేసే ముందు రియల్ టైంలో పరీక్షించండి.",
    "home.steps.3.title": "డౌన్‌లోడ్ & షేర్ చేయండి",
    "home.steps.3.body":
      "PNG లేదా SVG ఫార్మాట్ ఎంచుకోండి, డౌన్‌లోడ్ నొక్కండి మరియు మీరు ఎక్కడైనా షేర్ చేయడానికి సిద్ధంగా ఉన్నారు!",
    "home.steps.cta": "ఉచిత QR Code సృష్టించండి",
    "home.explained.title": "QR Code వివరించబడింది",
    "home.explained.what.title": "QR Code అంటే ఏమిటి?",
    "home.explained.what.body":
      "QR Code అనేది URL, కాంటాక్ట్ వివరాలు, చెల్లింపు డేటా లేదా టెక్స్ట్ వంటి సమాచారాన్ని నలుపు మరియు తెలుపు చతురస్రాల గ్రిడ్‌లో నిల్వ చేసే ద్విమాత్రిక బార్‌కోడ్. ఇది స్మార్ట్‌ఫోన్ కెమెరాతో స్కాన్ చేయవచ్చు మరియు టైప్ చేయకుండానే నిల్వ చేసిన కంటెంట్‌ను తక్షణమే యాక్సెస్ చేయవచ్చు.",
    "home.explained.why.title": "2026 లో ఎంతమంది QR Code లను ఎందుకు ఉపయోగిస్తున్నారు?",
    "home.explained.why.body":
      "QR Code లు ఆఫ్‌లైన్ అనుభవాలను డిజిటల్ కంటెంట్‌తో అనుసంధానించడానికి త్వరిత, కాంటాక్ట్‌లెస్ మరియు తక్కువ ఖర్చుతో కూడిన మార్గాన్ని అందిస్తాయి. వ్యాపారాలు రియల్-టైమ్ అప్‌డేట్‌లు మరియు ప్రింట్ వ్యర్థాన్ని తగ్గించడానికి వీటిపై ఆధారపడతాయి.",
    "home.explained.how.title": "నేను ఒకదాన్ని ఎలా స్కాన్ చేయగలను?",
    "home.explained.how.1":
      "మీ స్మార్ట్‌ఫోన్ లేదా టాబ్లెట్‌లో కెమెరా యాప్ తెరవండి. చాలా ఆధునిక పరికరాలు QR Code లను స్వయంచాలకంగా స్కాన్ చేస్తాయి.",
    "home.explained.how.2":
      "మీ కెమెరాను QR Code వైపు సూచించండి, అది ఫ్రేమ్‌లో స్పష్టంగా కనిపిస్తుందని నిర్ధారించుకోండి.",
    "home.explained.how.3": "కెమెరా కోడ్‌ను గుర్తించేవరకు కొన్ని సెకన్లు స్థిరంగా ఉండండి.",
    "home.explained.how.4":
      "వెబ్‌సైట్, వీడియో లేదా కాంటాక్ట్ కార్డ్ తెరవడానికి కనిపించే నోటిఫికేషన్ లేదా లింక్‌ను ట్యాప్ చేయండి.",
    "home.dashboard.title": "ఒక డ్యాష్‌బోర్డ్ నుండి అన్ని QR Code లను నిర్వహించండి",
    "home.dashboard.body":
      "ఒకే సులభమైన డ్యాష్‌బోర్డ్ నుండి అపరిమిత QR Code లను సృష్టించండి, సవరించండి మరియు ట్రాక్ చేయండి. గమ్యస్థానాలను అప్‌డేట్ చేయండి, అనలిటిక్స్ చూడండి మరియు మీ టీమ్‌తో సహకరించండి.",
    "home.dashboard.cta": "ఇప్పుడే ఉచితంగా ప్రయత్నించండి",
    "home.features.title":
      "4 వేలాది+ వినియోగదారులు ROI ఆధారిత QR Code క్యాంపెయిన్‌ల కోసం UnifiedQR ను ఎందుకు నమ్ముతున్నారు",
    "home.features.track.title": "ప్రతి స్కాన్ ను ట్రాక్ చేయండి",
    "home.features.track.body":
      "రియల్-టైమ్ అంతర్దృష్టులతో మీ QR Code క్యాంపెయిన్ ఎలా పనిచేస్తోందో తెలుసుకోండి. స్కాన్‌లు, యూనిక్ యూజర్లు, లొకేషన్లు మరియు పరికరాలపై డేటా పొందండి.",
    "home.features.dynamic.title": "ఉచిత డైనమిక్ QR Code లు",
    "home.features.dynamic.body":
      "ఉచితంగా 2 డైనమిక్ QR Code లను సృష్టించండి మరియు ఎప్పుడైనా వాటి కంటెంట్‌ను అప్‌డేట్ చేయండి.",
    "home.features.collab.title": "మీ టీమ్‌తో సహకరించండి",
    "home.features.collab.body":
      "ఒక డ్యాష్‌బోర్డ్‌లో QR Code లను నిర్వహించడానికి మరియు షేర్ చేయడానికి 5 టీమ్ సభ్యులను ఆహ్వానించండి.",
    "home.features.support.title": "24/7 కస్టమర్ సపోర్ట్",
    "home.features.support.body":
      "మా టీమ్ ఎల్లప్పుడూ ఇమెయిల్ లేదా కాల్ ద్వారా సమస్యలను త్వరగా పరిష్కరించడానికి సిద్ధంగా ఉంటుంది.",
    "home.features.pay.title": "మీరు ఉపయోగించేదానికి మాత్రమే చెల్లించండి",
    "home.features.pay.body":
      "ఫ్లెక్సిబుల్ ధర — మీకు అవసరమైన ఫీచర్లు లేదా అదనపు కోడ్‌లకు మాత్రమే చెల్లించండి.",
    "home.features.cta": "Flex ప్లాన్‌లను అన్వేషించండి",
    "home.types.title": "మీరు ఉచితంగా ఏ రకమైన QR Code లను సృష్టించవచ్చు?",
    "home.types.cta": "అన్ని QR Code రకాలను చూడండి",
    "home.faq.title": "తరచుగా అడిగే ప్రశ్నలు",
    "home.faq.1.q": "QR Code లు ఎల్లప్పుడూ ఉచితమా?",
    "home.faq.1.a":
      "అవును. ఇక్కడ మీరు సృష్టించే ప్రతి స్టాటిక్ QR Code ఉచితం, గడువు తేదీ లేదు మరియు స్కాన్ పరిమితి లేదు. దానిని PNG లేదా SVG గా డౌన్‌లోడ్ చేసి వాణిజ్యపరంగా ఉపయోగించవచ్చు.",
    "home.faq.2.q": "స్టాటిక్ మరియు డైనమిక్ QR Code ల మధ్య తేడా ఏమిటి?",
    "home.faq.2.a":
      "స్టాటిక్ QR Code డేటాను నేరుగా కోడ్ లోపల నిల్వ చేస్తుంది, కాబట్టి దానిని ఎప్పుడూ మార్చలేరు. డైనమిక్ QR Code మీరు నియంత్రించే షార్ట్ లింక్‌ను సూచిస్తుంది, కాబట్టి మీరు ఎప్పుడైనా గమ్యస్థానాన్ని సవరించవచ్చు మరియు స్కాన్‌లను ట్రాక్ చేయవచ్చు.",
    "home.faq.3.q": "QR Code కు నా లోగో జోడించవచ్చా?",
    "home.faq.3.a":
      "అవును. ఒక టెంప్లేట్ ఎంచుకోండి, మీ రంగులను సర్దుబాటు చేయండి మరియు కస్టమైజేషన్ ప్యానెల్‌లో లోగో జోడించండి. స్కానర్లు ఇప్పటికీ కోడ్‌ను నమ్మదగిన రీతిలో చదవగలిగేలా లోగోను చిన్నగా ఉంచండి.",
    "home.faq.4.q": "నేను ఏ ఫైల్ ఫార్మాట్ లో డౌన్‌లోడ్ చేయాలి?",
    "home.faq.4.a":
      "స్క్రీన్లు, సోషల్ పోస్ట్‌లు మరిియు పత్రాల కోసం PNG ఉపయోగించండి. ప్రింట్, పెద్ద ఫార్మాట్ సైనేజ్ లేదా నాణ్యతను కోల్పోకుండా రీసైజ్ చేయాల్సిన ఎక్కడైనా SVG ఉపయోగించండి.",
    "home.faq.5.q": "QR Code లకు గడువు ఉందా?",
    "home.faq.5.a":
      "స్టాటిక్ QR Code లు ఎప్పటికీ గడువు ముగియవు. డైనమిక్ QR Code లు మీ ఖాతా యాక్టివ్ గా ఉన్నంత వరకు యాక్టివ్ గా ఉంటాయి మరియు మీరు ఎప్పుడైనా వాటి గమ్యస్థానాన్ని అప్‌డేట్ చేయవచ్చు.",
  },
  mr: {
    "nav.products": "उत्पादने",
    "nav.types": "QR कोड प्रकार",
    "nav.pricing": "किंमत",
    "nav.contact": "संपर्क",
    "nav.resources": "संसाधने",
    "nav.language": "भाषा",
    "header.signIn": "साइन इन",
    "auth.title": "परत स्वागत आहे",
    "auth.subtitle":
      "जतन केलेले कोड, डायनामिक लिंक आणि स्कॅन विश्लेषण व्यवस्थापित करण्यासाठी आपल्या वर्कस्पेसमध्ये साइन इन करा.",
    "auth.signInWith": "Google सह सुरू ठेवा",
    "auth.busy": "Google उघडत आहे…",
    "auth.googleOnly": "Google सध्या एकमेव साइन-इन पद्धत आहे.",
    "auth.back": "← मोफत जनरेटरवर परत जा",
    "auth.brand.tagline": "प्रत्येक QR कोडसाठी एक वर्कस्पेस.",
    "auth.brand.dynamic": "प्रिंट केल्यानंतर बदलता येणाऱ्या डायनामिक शॉर्ट लिंक.",
    "auth.brand.analytics": "प्रत्येक डायनामिक कोडवर स्कॅन ट्रॅकिंग, पहिल्या स्कॅनपासून थेट.",
    "auth.brand.templates": "13 स्टुडिओ टेम्पलेट, कस्टम रंग, PNG आणि SVG एक्सपोर्ट.",
    "auth.brand.secure": "Google-सत्यापित साइन-इन. कोणतेही पासवर्ड जतन केलेले नाही.",
    "auth.error.notAuthorized": "हा ईमेल अॅडमिन पॅनेलमध्ये प्रवेश करण्यासाठी अधिकृत नाही.",
    "auth.signOut": "साइन आउट",
    "pricing.title": "फक्त जे वापरता त्यासाठीच पैसे भरा",
    "pricing.subtitle":
      "प्रत्येक योजनेत अमर्याद मोफत स्टॅटिक QR कोड समाविष्ट आहेत. ट्रॅकिंग, संपादनीय कोड किंवा टीम� ऍक्सेस आवश्यक असल्यास अपग्रेड करा.",
    "pricing.mostPopular": "सर्वाधिक लोकप्रिय",
    "pricing.perMonth": "दर महिन्याला",
    "pricing.forever": "नेहमीसाठी",
    "pricing.startFree": "मोफत सुरू करा",
    "pricing.chooseFlex": "Flex निवडा",
    "pricing.choosePro": "Pro निवडा",
    "pricing.freeFeatures": [
      "अमर्याद स्टॅटिक QR कोड",
      "२ डायनामिक QR कोड",
      "PNG आणि SVG डाउनलोड",
      "१३ डिझाइन टेम्पलेट",
      "व्यावसायिक वापर",
    ],
    "pricing.flexFeatures": [
      "Free मधील सर्व सुविधा",
      "२५ डायनामिक QR कोड",
      "स्कॅन विश्लेषण आणि स्थान",
      "लोगो अपलोड",
      "ईमेल सहाय्य",
    ],
    "pricing.proFeatures": [
      "Flex मधील सर्व सुविधा",
      "अमर्याद डायनामिक QR कोड",
      "५ टीम सदस्य",
      "बल्क निर्माण आणि API ऍक्सेस",
      "कस्टम शॉर्ट डोमेन",
      "२४/७ प्राधान्य सहाय्य",
    ],
    "billing.title": "बिलिंग",
    "billing.subtitle":
      "योजनेच्या मर्यादा, अपग्रेड आणि बिले. पेमेंट Cashfree द्वारे सुरक्षितपणे प्रक्रिया केली जातात.",
    "billing.current": "सध्याचे",
    "billing.upgrade": "अपग्रेड",
    "billing.yourPlan": "तुमची योजना",
    "billing.checkout": "चेकआउट सुरू होत आहे…",
    "billing.signInToUpgrade": "योजना अपग्रेड करण्यासाठी साइन इन करा.",
    "footer.tagline":
      "मोफत QR कोड तयार करण्यासाठी, संपादित करण्यासाठी आणि मोहीम कामगिरी ट्रॅक करण्यासाठी ऑल-इन-वन साधन. जगभरातील ४K+ वापरकर्त्यांचा विश्वास.",
    "footer.product": "उत्पादन",
    "footer.qrCodes": "QR कोड",
    "footer.company": "कंपनी",
    "footer.legal": "कायदेशीर",
    "admin.unauthorized": "हा ईमेल अॅडमिन पॅनेलमध्ये लॉग इन करण्यासाठी अधिकृत नाही.",
    "admin.signInToContinue": "सुरू ठेवण्यासाठी Google सह साइन इन करा.",
    "visitor.today": "आजचे अभ्यागत",
    "chooser.title": "तुमची भाषा निवडा",
    "chooser.subtitle": "सुरू ठेवण्यासाठी तुमची पसंतीची भाषा निवडा",
    "home.hero.title": "UnifiedQR — मोफत QR Code जनरेटर",
    "home.hero.subtitle":
      "वेबसाइट, PDF, संपर्क, SMS आणि अन्यासाठी मोफत QR Code तयार करा. रंग सानुकूलित करा, PNG किंवा SVG मध्ये डाउनलोड करा आणि प्रत्येक स्कॅन ट्रॅक करा — सर्व एका डॅशबोर्डवरून.",
    "home.social.trusted": "यांचा विश्वास",
    "home.social.users": "4K+ वापरकर्ते",
    "home.social.onGoogle": "Google वर",
    "home.social.noCreditCard": "क्रेडिट कार्ड आवश्यक नाही",
    "home.social.signupFree": "मोफत साइन अप करा",
    "home.steps.title": "3 सोप्या पायऱ्यांमध्ये मोफत QR Code कसा तयार करायचा",
    "home.steps.1.title": "तुमचा QR Code प्रकार निवडा",
    "home.steps.1.body":
      "तुमचा QR Code प्रकार (स्टॅटिक किंवा डायनामिक) तुम्हाला काय करायचे आहे त्यावर आधारित निवडा: URL उघडा, PDF शेअर करा, मेनू दाखवा, संपर्क तपशील शेअर करा आणि बरेच काही.",
    "home.steps.2.title": "तुमच्या मार्गाने सानुकूलित करा",
    "home.steps.2.body":
      "तुमचे तपशील जोडा, रंग बदला, तुमचे QR Code स्टाइल करा, लोगो जोडा आणि डाउनलोड करण्यापूर्वी रिअल टाइममध्ये चाचणी करा.",
    "home.steps.3.title": "डाउनलोड आणि शेअर करा",
    "home.steps.3.body":
      "PNG किंवा SVG स्वरूप निवडा, डाउनलोड दाबा आणि तुम्ही कुठेही शेअर करण्यासाठी तयार आहात!",
    "home.steps.cta": "मोफत QR Code तयार करा",
    "home.explained.title": "QR Code समजावून सांगितला",
    "home.explained.what.title": "QR Code म्हणजे काय?",
    "home.explained.what.body":
      "QR Code हा एक द्विमितीय बारकोड आहे जो URL, संपर्क तपशील, पेमेंट डेटा किंवा मजकूर यांसारखी माहिती काळ्या आणि पांढऱ्या चौकोनींच्या ग्रिडमध्ये साठवतो. त्याला स्मार्टफोन कॅमेऱ्याने स्कॅन करून टाइप न करता साठवलेल्या सामग्रीला त्वरित प्रवेश मिळवता येतो.",
    "home.explained.why.title": "2026 मध्ये इतके लोक QR Code का वापरतात?",
    "home.explained.why.body":
      "QR Code ऑफलाइन अनुभवांना डिजिटल सामग्रीशी जोडण्याचा एक जलद, कॉन्टॅक्टलेस आणि कमी खर्चाचा मार्ग प्रदान करतात. व्यवसाय रिअल-टाइम अपडेट आणि प्रिंट फिजूलखर्च कमी करण्यासाठी यांवर अवलंबून असतात.",
    "home.explained.how.title": "मी एक कसा स्कॅन करू?",
    "home.explained.how.1":
      "तुमच्या स्मार्टफोन किंवा टॅब्लेटवर कॅमेरा अॅप उघडा. बहुतेक आधुनिक उपकरणे QR Code स्वयंचलितपणे स्कॅन करतात.",
    "home.explained.how.2":
      "तुमचा कॅमेरा QR Code कडे निर्देश करा, तो फ्रेममध्ये स्पष्टपणे दिसत आहे हे सुनिश्चित करा.",
    "home.explained.how.3": "कॅमेऱ्याने कोड ओळखेपर्यंत काही सेकंद स्थिर ठेवा.",
    "home.explained.how.4":
      "वेबसाइट, व्हिडिओ किंवा संपर्क कार्ड उघडण्यासाठी दिसणाऱ्या सूचना किंवा लिंकवर टॅप करा.",
    "home.dashboard.title": "एका डॅशबोर्डवरून सर्व QR Code व्यवस्थापित करा",
    "home.dashboard.body":
      "एकाच सोप्या डॅशबोर्डवरून अमर्याद QR Code तयार करा, संपादित करा आणि ट्रॅक करा. गंतव्ये अपडेट करा, विश्लेषण पहा आणि तुमच्या संघासोबत सहकार्य करा.",
    "home.dashboard.cta": "आत्ताच मोफत वापरून पहा",
    "home.features.title":
      "4 हजार+ वापरकर्ते ROI-चालित QR Code मोहिमांसाठी UnifiedQR वर का विश्वास ठेवतात",
    "home.features.track.title": "प्रत्येक स्कॅन ट्रॅक करा",
    "home.features.track.body":
      "रिअल-टाइम अंतर्दृष्टीसह तुमची QR Code मोहीम कसे काम करते ते जाणून घ्या. स्कॅन, अद्वितीय वापरकर्ते, स्थान आणि उपकरणांवरील डेटा मिळवा.",
    "home.features.dynamic.title": "मोफत डायनामिक QR Code",
    "home.features.dynamic.body":
      "मोफत 2 डायनामिक QR Code तयार करा आणि कधीही त्यांची सामग्री अपडेट करा.",
    "home.features.collab.title": "तुमच्या संघासोबत सहकार्य करा",
    "home.features.collab.body":
      "एका डॅशबोर्डवर QR Code व्यवस्थापित आणि शेअर करण्यासाठी 5 संघ सदस्यांना आमंत्रित करा.",
    "home.features.support.title": "24/7 ग्राहक सहाय्य",
    "home.features.support.body":
      "आमचा संघ नेहमी ईमेल किंवा कॉल द्वारे जलद मुद्दे निराकरण्यासाठी तयार आहे.",
    "home.features.pay.title": "जे वापरता त्यासाठीच भरा",
    "home.features.pay.body":
      "लवचिक किंमत — फक्त आवश्यक वैशिष्ट्ये किंवा अतिरिक्त कोडसाठीच पैसे भरा.",
    "home.features.cta": "Flex योजना पहा",
    "home.types.title": "तुम्ही मोफत कोणत्या प्रकारचे QR Code तयार करू शकता?",
    "home.types.cta": "सर्व QR Code प्रकार पहा",
    "home.faq.title": "वारंवार विचारले जाणारे प्रश्न",
    "home.faq.1.q": "QR Code नेहमीसाठी मोफत आहेत का?",
    "home.faq.1.a":
      "होय. येथे तयार केलेला प्रत्येक स्टॅटिक QR Code मोफत आहे, कोणतीही मुदत नाही आणि कोणतीही स्कॅन मर्यादा नाही. तुम्ही त्याला PNG किंवा SVG मध्ये डाउनलोड करून व्यावसायिकरित्या वापरू शकता.",
    "home.faq.2.q": "स्टॅटिक आणि डायनामिक QR Code मध्ये काय फरक आहे?",
    "home.faq.2.a":
      "स्टॅटिक QR Code डेटा थेट कोडाच्या आत साठवतो, म्हणून त्याला कधीही बदलता येत नाही. डायनामिक QR Code तुम्ही नियंत्रित करत असलेल्या लहान लिंककडे सूचित करतो, म्हणून तुम्ही कधीही गंतव्य संपादित करू शकता आणि स्कॅन ट्रॅक करू शकता.",
    "home.faq.3.q": "मी माझा लोगो QR Code वर जोडू शकतो का?",
    "home.faq.3.a":
      "होय. एक टेम्पलेट निवडा, तुमचे रंग सानुकूलित करा आणि सानुकूलन पॅनेलमध्ये लोगो जोडा. स्कॅनर अजूनही कोड विश्वसनीयपणे वाचू शकतील म्हणून लोगो लहान ठेवा.",
    "home.faq.4.q": "मी कोणत्या फाइल स्वरूपात डाउनलोड करावा?",
    "home.faq.4.a":
      "स्क्रीन, सोशल पोस्ट आणि दस्तऐवजांसाठी PNG वापरा. प्रिंट, मोठ्या स्वरूपाच्या साइनेज किंवा गुणवत्ता गमावल्याशिवाय रीसाइज करायची आवश्यकता असलेल्या कुठेही SVG वापरा.",
    "home.faq.5.q": "QR Code ला मुदत असते का?",
    "home.faq.5.a":
      "स्टॅटिक QR Code कधीही कालबाह्य होत नाहीत. डायनामिक QR Code तुमचे खाते सक्रिय असेपर्यंत सक्रिय राहतात आणि तुम्ही कधीही त्यांचे गंतव्य अपडेट करू शकता.",
  },
  gu: {
    "nav.products": "ઉત્પાદનો",
    "nav.types": "QR કોડ પ્રકારો",
    "nav.pricing": "કિંમત",
    "nav.contact": "સંપર્ક",
    "nav.resources": "સંસાધનો",
    "nav.language": "ભાષા",
    "header.signIn": "સાઇન ઇન",
    "auth.title": "પાછા સ્વાગત છે",
    "auth.subtitle":
      "સાચવેલા કોડ, ડાયનામિક લિંક અને સ્કેન ઍનાલિટિક્સ મેનેજ કરવા તમારા વર્કસ્પેસમાં સાઇન ઇન કરો.",
    "auth.signInWith": "Google સાથે ચાલુ રાખો",
    "auth.busy": "Google ખોલી રહ્યું છે…",
    "auth.googleOnly": "Google હાલમાં એકમાત્ર સાઇન-ઇન પદ્ધતિ છે.",
    "auth.back": "← મફત જનરેટર પર પાછા જાઓ",
    "auth.brand.tagline": "દરેક QR કોડ માટે એક વર્કસ્પેસ.",
    "auth.brand.dynamic": "પ્રિન્ટ કર્યા પછી ફેરફાર કરી શકાય તેવા ડાયનામિક શોર્ટ લિંક.",
    "auth.brand.analytics": "દરેક ડાયનામિક કોડ પર સ્કેન ટ્રેકિંગ, પ્રથમ સ્કેનથી લાઈવ.",
    "auth.brand.templates": "13 સ્ટુડિયો ટેમ્પલેટ, કસ્ટમ રંગો, PNG અને SVG એક્સપોર્ટ.",
    "auth.brand.secure": "Google-ચકાસાયેલ સાઇન-ઇન. કોઈ પાસવર્ડ સંગ્રહિત નથી.",
    "auth.error.notAuthorized": "આ ઇમેઇલ ઍડમિન પેનલ ઍક્સેસ કરવા માટે અધિકૃત નથી.",
    "auth.signOut": "સાઇન આઉટ",
    "pricing.title": "માત્ર જે ઉપયોગ કરો છો તેના માટે ચૂકવણી કરો",
    "pricing.subtitle":
      "દરેક યોજનામાં અમર્યાદિત મફત સ્ટેટિક QR કોડ સામેલ છે. ટ્રેકિંગ, સંપાદનીય કોડ અથવા ટીમ ઍક્સેસની જરૂર પડે ત્યારે અપગ્રેડ કરો.",
    "pricing.mostPopular": "સૌથી લોકપ્રિય",
    "pricing.perMonth": "દર મહિને",
    "pricing.forever": "હંમેશા માટે",
    "pricing.startFree": "મફત શરૂ કરો",
    "pricing.chooseFlex": "Flex પસંદ કરો",
    "pricing.choosePro": "Pro પસંદ કરો",
    "pricing.freeFeatures": [
      "અમર્યાદિત સ્ટેટિક QR કોડ",
      "૨ ડાયનામિક QR કોડ",
      "PNG અને SVG ડાઉનલોડ",
      "૧૩ ડિઝાઇન ટેમ્પલેટ",
      "વ્યાવસાયિક ઉપયોગ",
    ],
    "pricing.flexFeatures": [
      "Free માંની બધી સુવિધાઓ",
      "૨૫ ડાયનામિક QR કોડ",
      "સ્કેન ઍનાલિટિક્સ અને સ્થાનો",
      "લોગો અપલોડ",
      "ઇમેઇલ સપોર્ટ",
    ],
    "pricing.proFeatures": [
      "Flex માંની બધી સુવિધાઓ",
      "અમર્યાદિત ડાયનામિક QR કોડ",
      "૫ ટીમ સભ્યો",
      "બલ્ક નિર્માણ અને API ઍક્સેસ",
      "કસ્ટમ શોર્ટ ડોમેન",
      "૨૪/૭ પ્રાથમિકતા સપોર્ટ",
    ],
    "billing.title": "બિલિંગ",
    "billing.subtitle":
      "યોજના મર્યાદાઓ, અપગ્રેડ અને ઇન્વોઇસ. ચુકવણીઓ Cashfree દ્વારા સુરક્ષિત રીતે પ્રક્રિયા થાય છે.",
    "billing.current": "વર્તમાન",
    "billing.upgrade": "અપગ્રેડ",
    "billing.yourPlan": "તમારી યોજના",
    "billing.checkout": "ચેકઆઉટ શરૂ થઈ રહ્યું છે…",
    "billing.signInToUpgrade": "યોજના અપગ્રેડ કરવા સાઇન ઇન કરો.",
    "footer.tagline":
      "મફત QR કોડ બનાવવા, સંપાદિત કરવા અને કેમ્પેઇન પ્રદર્શન ટ્રેક કરવાનું ઑલ-ઇન-વન ટૂલ. વિશ્વભરમાં ૪K+ વપરાશકર્તાઓનો વિશ્વાસ.",
    "footer.product": "ઉત્પાદન",
    "footer.qrCodes": "QR કોડ",
    "footer.company": "કંપની",
    "footer.legal": "કાયદેસર",
    "admin.unauthorized": "આ ઇમેઇલ ઍડમિન પેનલમાં લૉગ ઇન કરવા માટે અધિકૃત નથી.",
    "admin.signInToContinue": "ચાલુ રાખવા Google સાથે સાઇન ઇન કરો.",
    "visitor.today": "આજના મુલાકારીઓ",
    "chooser.title": "તમારી ભાષા પસંદ કરો",
    "chooser.subtitle": "ચાલુ રાખવા તમારી પસંદગીની ભાષા પસંદ કરો",
    "home.hero.title": "UnifiedQR — મફત QR Code જનરેટર",
    "home.hero.subtitle":
      "વેબસાઇટ, PDF, સંપર્ક, SMS અને વધુ માટે મફત QR Code બનાવો. રંગો કસ્ટમાઇઝ કરો, PNG અથવા SVG તરીકે ડાઉનલોડ કરો અને દરેક સ્કેન ટ્રેક કરો — બધું એક ડેશબોર્ડથી.",
    "home.social.trusted": "આ પર ભરોસો કરે છે",
    "home.social.users": "૪K+ વપરાશકર્તાઓ",
    "home.social.onGoogle": "Google પર",
    "home.social.noCreditCard": "ક્રેડિટ કાર્ડ જરૂરી નથી",
    "home.social.signupFree": "મફત સાઇન અપ કરો",
    "home.steps.title": "૩ સરળ પગલાંમાં મફત QR Code કેવી રીતે બનાવશો",
    "home.steps.1.title": "તમારો QR Code પ્રકાર પસંદ કરો",
    "home.steps.1.body":
      "તમારો QR Code પ્રકાર (સ્ટેટિક અથવા ડાયનામિક) તમે શું કરવા માંગો છો તેના આધારે પસંદ કરો: URL ખોલો, PDF શેર કરો, મેનૂ દર્શાવો, સંપર્ક વિગતો શેર કરો અને વધુ.",
    "home.steps.2.title": "તમારી રીતે કસ્ટમાઇઝ કરો",
    "home.steps.2.body":
      "તમારી વિગતો ઉમેરો, રંગ બદલો, તમારું QR Code સ્ટાઇલ કરો, લોગો ઉમેરો અને ડાઉનલોડ કરતા પહેલાં રીઅલ ટાઇમમાં તેને ચકાસો.",
    "home.steps.3.title": "ડાઉનલોડ અને શેર કરો",
    "home.steps.3.body":
      "PNG અથવા SVG ફોર્મેટ પસંદ કરો, ડાઉનલોડ દબાવો અને તમે ગમે ત્યાં શેર કરવા માટે તૈયાર છો!",
    "home.steps.cta": "મફત QR Code બનાવો",
    "home.explained.title": "QR Code સમજાવ્યું",
    "home.explained.what.title": "QR Code શું છે?",
    "home.explained.what.body":
      "QR Code એ એક દ્વિપરિમાણીય બારકોડ છે જે URL, સંપર્ક વિગતો, ચુકવણી ડેટા અથવા ટેક્સ્ટ જેવી માહિતી કાળા અને સફેદ ચોરસની ગ્રિડમાં સંગ્રહિત કરે છે. તેને સ્માર્ટફોન કૅમેરા વડે સ્કેન કરીને ટાઇપ કર્યા વિના સંગ્રહિત સામગ્રીને તરત જ ઍક્સેસ કરી શકાય છે.",
    "home.explained.why.title": "2026 માં આટલા બધા લોકો QR Code કેમ વાપરે છે?",
    "home.explained.why.body":
      "QR Code ઑફલાઇન અનુભવોને ડિજિટલ સામગ્રી સાથે જોડવાનો ઝડપી, કૉન્ટેક્ટલેસ અને ઓછી કિંમતનો રસ્તો પ્રદાન કરે છે. વ્યવસાયો રિઅલ-ટાઇમ અપડેટ્સ અને પ્રિન્ટ કચરો ઘટાડવા માટે તેના પર આધારિત છે.",
    "home.explained.how.title": "હું એક કેવી રીતે સ્કેન કરું?",
    "home.explained.how.1":
      "તમારા સ્માર્ટફોન અથવા ટેબ્લેટ પર કૅમેરા એપ ખોલો. મોટાભાગના આધુનિક ઉપકરણો QR Code ને આપમેળે સ્કેન કરે છે.",
    "home.explained.how.2":
      "તમારો કૅમેરા QR Code તરફ નિર્દેશ કરો, ખાતરી કરો કે તે ફ્રેમમાં સ્પષ્ટ રીતે દેખાય છે.",
    "home.explained.how.3": "કૅમેરા કોડ ઓળખે ત્યાં સુધી થોડી સેકંડ સ્થિર રાખો.",
    "home.explained.how.4":
      "વેબસાઇટ, વિડિયો અથવા સંપર્ક કાર્ડ ખોલવા માટે દેખાતી સૂચના અથવા લિંક પર ટૅપ કરો.",
    "home.dashboard.title": "એક ડેશબોર્ડથી બધા QR Code મેનેજ કરો",
    "home.dashboard.body":
      "એક જ સરળ ડેશબોર્ડથી અમર્યાદિત QR Code બનાવો, સંપાદિત કરો અને ટ્રેક કરો. ગંતવ્યો અપડેટ કરો, ઍનાલિટિક્સ જુઓ અને તમારી ટીમ સાથે સહકાર કરો.",
    "home.dashboard.cta": "હવે મફત અજમાવો",
    "home.features.title":
      "૪ હજાર+ વપરાશકર્તાઓ ROI-સંચાલિત QR Code ઝુંબેશ માટે UnifiedQR પર કેમ ભરોસો કરે છે",
    "home.features.track.title": "દરેક સ્કેન ટ્રેક કરો",
    "home.features.track.body":
      "રિઅલ-ટાઇમ અંતર્દૃષ્ટિ સાથે જાણો કે તમારી QR Code ઝુંબેશ કેવી રીતે પ્રદર્શન કરી રહી છે. સ્કેન, અનન્ય વપરાશકર્તાઓ, સ્થાનો અને ઉપકરણો પર ડેટા મેળવો.",
    "home.features.dynamic.title": "મફત ડાયનામિક QR Code",
    "home.features.dynamic.body":
      "મફત ૨ ડાયનામિક QR Code બનાવો અને ક્યારેય પણ તેમની સામગ્રી અપડેટ કરો.",
    "home.features.collab.title": "તમારી ટીમ સાથે સહકાર કરો",
    "home.features.collab.body":
      "એક ડેશબોર્ડ પર QR Code મેનેજ અને શેર કરવા માટે ૫ ટીમ સભ્યોને આમંત્રિત કરો.",
    "home.features.support.title": "૨૪/૭ ગ્રાહક સપોર્ટ",
    "home.features.support.body":
      "અમારી ટીમ હંમેશા ઇમેઇલ અથવા કૉલ દ્વારા ઝડપથી સમસ્યાઓ ઠીક કરવા માટે તૈયાર છે.",
    "home.features.pay.title": "જે વાપરો છો તેના માટે ચૂકવણી કરો",
    "home.features.pay.body":
      "લવચીક કિંમત — ફક્ત જરૂરી સુવિધાઓ અથવા વધારાના કોડ માટે જ ચૂકવણી કરો.",
    "home.features.cta": "Flex યોજનાઓ જુઓ",
    "home.types.title": "તમે મફતમાં કયા પ્રકારના QR Code બનાવી શકો છો?",
    "home.types.cta": "બધા QR Code પ્રકારો જુઓ",
    "home.faq.title": "વારંવાર પૂછાતા પ્રશ્નો",
    "home.faq.1.q": "QR Code હંમેશા મફત છે?",
    "home.faq.1.a":
      "હા. અહીં તમે બનાવો છો તે દરેક સ્ટેટિક QR Code મફત છે, તેની કોઈ સમાપ્તિ તારીખ નથી અને કોઈ સ્કેન મર્યાદા નથી. તમે તેને PNG અથવા SVG તરીકે ડાઉનલોડ કરીને વ્યાવસાયિક રીતે ઉપયોગ કરી શકો છો.",
    "home.faq.2.q": "સ્ટેટિક અને ડાયનામિક QR Code વચ્ચે શું તફાવત છે?",
    "home.faq.2.a":
      "સ્ટેટિક QR Code ડેટા સીધો કોડની અંદર સંગ્રહિત કરે છે, તેથી તેને ક્યારેય બદલી શકાતો નથી. ડાયનામિક QR Code એ શોર્ટ લિંક તરફ નિર્દેશ કરે છે જે તમે નિયંત્રિત કરો છો, તેથી તમે ક્યારેય પણ ગંતવ્ય સંપાદિત કરી શકો છો અને સ્કેન ટ્રેક કરી શકો છો.",
    "home.faq.3.q": "શું હું QR Code માં મારો લોગો ઉમેરી શકું?",
    "home.faq.3.a":
      "હા. એક ટેમ્પલેટ પસંદ કરો, તમારા રંગો સમાયોજિત કરો અને કસ્ટમાઇઝેશન પેનલમાં લોગો ઉમેરો. સ્કેનરો હજુ પણ કોડ વિશ્વસનીય રીતે વાંચી શકે તે માટે લોગો નાનો રાખો.",
    "home.faq.4.q": "મારે કયા ફાઇલ ફોર્મેટમાં ડાઉનલોડ કરવું જોઈએ?",
    "home.faq.4.a":
      "સ્ક્રીન, સોશિયલ પોસ્ટ્સ અને દસ્તાવેજો માટે PNG નો ઉપયોગ કરો. પ્રિન્ટ, મોટા-ફોર્મેટ સાઇનેજ અથવા ગુણવત્તા ગુમાવ્યા વિના રીસાઇઝ કરવાની જરૂર હોય ત્યાં SVG નો ઉપયોગ કરો.",
    "home.faq.5.q": "QR Code ની સમાપ્તિ હોય છે?",
    "home.faq.5.a":
      "સ્ટેટિક QR Code ક્યારેય સમાપ્ત થતા નથી. ડાયનામિક QR Code તમારું એકાઉન્ટ સક્રિય છે ત્યાં સુધી સક્રિય રહે છે, અને તમે ક્યારેય પણ તેઓ ક્યાં નિર્દેશ કરે છે તે અપડેટ કરી શકો છો.",
  },
  kn: {
    "nav.products": "ಉತ್ಪನ್ನಗಳು",
    "nav.types": "QR ಕೋಡ್ ಪ್ರಕಾರಗಳು",
    "nav.pricing": "ಬೆಲೆ",
    "nav.contact": "ಸಂಪರ್ಕ",
    "nav.resources": "ಸಂಪನ್ಮೂಲಗಳು",
    "nav.language": "ಭಾಷೆ",
    "header.signIn": "ಸೈನ್ ಇನ್",
    "auth.title": "ಮರಳಿ ಸ್ವಾಗತ",
    "auth.subtitle":
      "ಉಳಿಸಿದ ಕೋಡ್‌ಗಳು, ಡೈನಾಮಿಕ್ ಲಿಂಕ್‌ಗಳು ಮತ್ತು ಸ್ಕ್ಯಾನ್ ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ನಿಮ್ಮ ಕಾರ್ಯಕ್ಷೇತ್ರದಲ್ಲಿ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    "auth.signInWith": "Google ನೊಂದಿಗೆ ಮುಂದುವರಿಸಿ",
    "auth.busy": "Google ತೆರೆಯುತ್ತಿದೆ…",
    "auth.googleOnly": "Google ಪ್ರಸ್ತುತ ಏಕೈಕ ಸೈನ್-ಇನ್ ವಿಧಾನ.",
    "auth.back": "← ಉಚಿತ ಜನರೇಟರ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    "auth.brand.tagline": "ಪ್ರತಿ QR ಕೋಡ್‌ಗೆ ಒಂದು ಕಾರ್ಯಕ್ಷೇತ್ರ.",
    "auth.brand.dynamic": "ಮುದ್ರಿಸಿದ ನಂತರ ಬದಲಾಯಿಸಬಹುದಾದ ಡೈನಾಮಿಕ್ ಶಾರ್ಟ್ ಲಿಂಕ್‌ಗಳು.",
    "auth.brand.analytics":
      "ಪ್ರತಿ ಡೈನಾಮಿಕ್ ಕೋಡ್‌ನಲ್ಲಿ ಸ್ಕ್ಯಾನ್ ಟ್ರ್ಯಾಕಿಂಗ್, ಮೊದಲ ಸ್ಕ್ಯಾನ್‌ನಿಂದ ಲೈವ್.",
    "auth.brand.templates": "13 ಸ್ಟುಡಿಯೋ ಟೆಂಪ್ಲೇಟ್‌ಗಳು, ಕಸ್ಟಮ್ ಬಣ್ಣಗಳು, PNG ಮತ್ತು SVG ರಫ್ತುಗಳು.",
    "auth.brand.secure": "Google-ಪರಿಶೀಲಿತ ಸೈನ್-ಇನ್. ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಸಂಗ್ರಹಿಸಲಾಗಿಲ್ಲ.",
    "auth.error.notAuthorized": "ಈ ಇಮೇಲ್ ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್ ಪ್ರವೇಶಿಸಲು ಅಧಿಕೃತವಾಗಿಲ್ಲ.",
    "auth.signOut": "ಸೈನ್ ಔಟ್",
    "pricing.title": "ನೀವು ಬಳಸುವುದಕ್ಕೆ ಮಾತ್ರ ಪಾವತಿಸಿ",
    "pricing.subtitle":
      "ಪ್ರತಿ ಯೋಜನೆಯಲ್ಲಿ ಅಪರಿಮಿತ ಉಚಿತ ಸ್ಟ್ಯಾಟಿಕ್ QR ಕೋಡ್‌ಗಳು ಸೇರಿವೆ. ಟ್ರ್ಯಾಕಿಂಗ್, ಸಂಪಾದಿಸಬಹುದಾದ ಕೋಡ್‌ಗಳು ಅಥವಾ ತಂಡ ಪ್ರವೇಶ ಅಗತ್ಯವಿದ್ದಾಗ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ.",
    "pricing.mostPopular": "ಅತ್ಯಂತ ಜನಪ್ರಿಯ",
    "pricing.perMonth": "ಪ್ರತಿ ತಿಂಗಳು",
    "pricing.forever": "ಯಾವಾಗಲೂ",
    "pricing.startFree": "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",
    "pricing.chooseFlex": "Flex ಆಯ್ಕೆಮಾಡಿ",
    "pricing.choosePro": "Pro ಆಯ್ಕೆಮಾಡಿ",
    "pricing.freeFeatures": [
      "ಅಪರಿಮಿತ ಸ್ಟ್ಯಾಟಿಕ್ QR ಕೋಡ್‌ಗಳು",
      "2 ಡೈನಾಮಿಕ್ QR ಕೋಡ್‌ಗಳು",
      "PNG ಮತ್ತು SVG ಡೌನ್‌ಲೋಡ್‌ಗಳು",
      "13 ವಿನ್ಯಾಸ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
      "ವಾಣಿಜ್ಯ ಬಳಕೆ",
    ],
    "pricing.flexFeatures": [
      "Free ನಲ್ಲಿರುವ ಎಲ್ಲಾ",
      "25 ಡೈನಾಮಿಕ್ QR ಕೋಡ್‌ಗಳು",
      "ಸ್ಕ್ಯಾನ್ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸ್ಥಳಗಳು",
      "ಲೋಗೋ ಅಪ್‌ಲೋಡ್",
      "ಇಮೇಲ್ ಬೆಂಬಲ",
    ],
    "pricing.proFeatures": [
      "Flex ನಲ್ಲಿರುವ ಎಲ್ಲಾ",
      "ಅಪರಿಮಿತ ಡೈನಾಮಿಕ್ QR ಕೋಡ್‌ಗಳು",
      "5 ತಂಡ ಸದಸ್ಯರು",
      "ಬಲ್ಕ್ ರಚನೆ ಮತ್ತು API ಪ್ರವೇಶ",
      "ಕಸ್ಟಮ್ ಶಾರ್ಟ್ ಡೊಮೇನ್",
      "24/7 ಆದ್ಯತೆಯ ಬೆಂಬಲ",
    ],
    "billing.title": "ಬಿಲ್ಲಿಂಗ್",
    "billing.subtitle":
      "ಯೋಜನೆ ಮಿತಿಗಳು, ಅಪ್‌ಗ್ರೇಡ್‌ಗಳು ಮತ್ತು ಇನ್ವಾಯ್ಸ್‌ಗಳು. ಪಾವತಿಗಳನ್ನು Cashfree ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತದೆ.",
    "billing.current": "ಪ್ರಸ್ತುತ",
    "billing.upgrade": "ಅಪ್‌ಗ್ರೇಡ್",
    "billing.yourPlan": "ನಿಮ್ಮ ಯೋಜನೆ",
    "billing.checkout": "ಚೆಕ್‌ಔಟ್ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ…",
    "billing.signInToUpgrade": "ಯೋಜನೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    "footer.tagline":
      "ಉಚಿತ QR ಕೋಡ್‌ಗಳನ್ನು ರಚಿಸಲು, ಸಂಪಾದಿಸಲು ಮತ್ತು ಅಭಿಯಾನ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಆಲ್-ಇನ್-ಒನ್ ಪರಿಕರ. ಜಗತ್ತಿನಾದ್ಯಂತ 4K+ ಬಳಕೆದಾರರ ವಿಶ್ವಾಸ.",
    "footer.product": "ಉತ್ಪನ್ನ",
    "footer.qrCodes": "QR ಕೋಡ್‌ಗಳು",
    "footer.company": "ಕಂಪನಿ",
    "footer.legal": "ಕಾನೂನು",
    "admin.unauthorized": "ಈ ಇಮೇಲ್ ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್‌ನಲ್ಲಿ ಲಾಗ್ ಇನ್ ಮಾಡಲು ಅಧಿಕೃತವಾಗಿಲ್ಲ.",
    "admin.signInToContinue": "ಮುಂದುವರಿಯಲು Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    "visitor.today": "ಇಂದಿನ ಭೇಟಿದಾರರು",
    "chooser.title": "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "chooser.subtitle": "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "home.hero.title": "UnifiedQR — ಉಚಿತ QR Code ಜನರೇಟರ್",
    "home.hero.subtitle":
      "ವೆಬ್‌ಸೈಟ್‌ಗಳು, PDF, ಸಂಪರ್ಕಗಳು, SMS ಮತ್ತು ಹೆಚ್ಚಿನವುಗಳಿಗಾಗಿ ಉಚಿತ QR Code ಗಳನ್ನು ರಚಿಸಿ. ಬಣ್ಣಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ, PNG ಅಥವಾ SVG ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ಪ್ರತಿ ಸ್ಕ್ಯಾನ್ ಅನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ — ಎಲ್ಲವೂ ಒಂದೇ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ.",
    "home.social.trusted": "ಇವುಗಳನ್ನು ನಂಬುತ್ತಾರೆ",
    "home.social.users": "೪K+ ಬಳಕೆದಾರರು",
    "home.social.onGoogle": "Google ನಲ್ಲಿ",
    "home.social.noCreditCard": "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಅಗತ್ಯವಿಲ್ಲ",
    "home.social.signupFree": "ಉಚಿತವಾಗಿ ಸೈನ್ ಅಪ್ ಮಾಡಿ",
    "home.steps.title": "೩ ಸರಳ ಹಂತಗಳಲ್ಲಿ ಉಚಿತ QR Code ಹೇಗೆ ರಚಿಸುವುದು",
    "home.steps.1.title": "ನಿಮ್ಮ QR Code ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "home.steps.1.body":
      "ನಿಮ್ಮ QR Code ಪ್ರಕಾರವನ್ನು (ಸ್ಟ್ಯಾಟಿಕ್ ಅಥವಾ ಡೈನಾಮಿಕ್) ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದರ ಆಧಾರದ ಮೇಲೆ ಆಯ್ಕೆಮಾಡಿ: URL ತೆರೆಯಿರಿ, PDF ಹಂಚಿಕೊಳ್ಳಿ, ಮೆನು ತೋರಿಸಿ, ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಹೆಚ್ಚಿನವು.",
    "home.steps.2.title": "ನಿಮ್ಮ ರೀತಿಯಲ್ಲಿ ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    "home.steps.2.body":
      "ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ, ಬಣ್ಣವನ್ನು ಬದಲಾಯಿಸಿ, ನಿಮ್ಮ QR Code ಅನ್ನು ಸ್ಟೈಲ್ ಮಾಡಿ, ಲೋಗೋ ಸೇರಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಮೊದಲು ರಿಯಲ್ ಟೈಮ್‌ನಲ್ಲಿ ಪರೀಕ್ಷಿಸಿ.",
    "home.steps.3.title": "ಡೌನ್‌ಲೋಡ್ & ಹಂಚಿಕೊಳ್ಳಿ",
    "home.steps.3.body":
      "PNG ಅಥವಾ SVG ಫಾರ್ಮ್ಯಾಟ್ ಆಯ್ಕೆಮಾಡಿ, ಡೌನ್‌ಲೋಡ್ ಒತ್ತಿರಿ ಮತ್ತು ನೀವು ಎಲ್ಲಿಯಾದರೂ ಹಂಚಿಕೊಳ್ಳಲು ಸಿದ್ಧರಾಗಿದ್ದೀರಿ!",
    "home.steps.cta": "ಉಚಿತ QR Code ರಚಿಸಿ",
    "home.explained.title": "QR Code ವಿವರಿಸಲಾಗಿದೆ",
    "home.explained.what.title": "QR Code ಎಂದರೇನು?",
    "home.explained.what.body":
      "QR Code ಎಂಬುದು URL, ಸಂಪರ್ಕ ವಿವರಗಳು, ಪಾವತಿ ಡೇಟಾ ಅಥವಾ ಪಠ್ಯದಂತಹ ಮಾಹಿತಿಯನ್ನು ಕಪ್ಪು ಮತ್ತು ಬಿಳಿ ಚೌಕಗಳ ಗ್ರಿಡ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸುವ ದ್ವಿಮಾತ್ರಿಕ ಬಾರ್‌ಕೋಡ್ ಆಗಿದೆ. ಇದನ್ನು ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಕ್ಯಾಮೆರಾದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಮೂಲಕ ಟೈಪ್ ಮಾಡದೆಯೇ ಸಂಗ್ರಹಿಸಿದ ವಿಷಯವನ್ನು ತಕ್ಷಣ ಪ್ರವೇಶಿಸಬಹುದು.",
    "home.explained.why.title": "2026 ರಲ್ಲಿ ಏಕೆ ಹಲವಾರು ಜನರು QR Code ಬಳಸುತ್ತಾರೆ?",
    "home.explained.why.body":
      "QR Code ಗಳು ಆಫ್‌ಲೈನ್ ಅನುಭವಗಳನ್ನು ಡಿಜಿಟಲ್ ವಿಷಯದೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವ ವೇಗವಾದ, ಸಂಪರ್ಕರಹಿತ ಮತ್ತು ಕಡಿಮೆ ವೆಚ್ಚದ ಮಾರ್ಗವನ್ನು ಒದಗಿಸುತ್ತವೆ. ವ್ಯವಹಾರಗಳು ರಿಯಲ್-ಟೈಮ್ ನವೀಕರಣಗಳು ಮತ್ತು ಮುದ್ರಣ ತ್ಯಾಜ್ಯವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಇವುಗಳನ್ನು ಅವಲಂಬಿಸಿವೆ.",
    "home.explained.how.title": "ನಾನು ಒಂದನ್ನು ಹೇಗೆ ಸ್ಕ್ಯಾನ್ ಮಾಡುವುದು?",
    "home.explained.how.1":
      "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಅಥವಾ ಟ್ಯಾಬ್ಲೆಟ್‌ನಲ್ಲಿ ಕ್ಯಾಮೆರಾ ಆಪ್ ತೆರೆಯಿರಿ. ಹೆಚ್ಚಿನ ಆಧುನಿಕ ಸಾಧನಗಳು QR Code ಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸ್ಕ್ಯಾನ್ ಮಾಡುತ್ತವೆ.",
    "home.explained.how.2":
      "ನಿಮ್ಮ ಕ್ಯಾಮೆರಾವನ್ನು QR Code ಕಡೆ ನಿರ್ದೇಶಿಸಿ, ಅದು ಫ್ರೇಮ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುತ್ತದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    "home.explained.how.3": "ಕ್ಯಾಮೆರಾ ಕೋಡ್ ಅನ್ನು ಗುರುತಿಸುವವರೆಗೂ ಕೆಲವು ಸೆಕೆಂಡುಗಳು ಸ್ಥಿರವಾಗಿರಿ.",
    "home.explained.how.4":
      "ವೆಬ್‌ಸೈಟ್, ವೀಡಿಯೊ ಅಥವಾ ಸಂಪರ್ಕ ಕಾರ್ಡ್ ತೆರೆಯಲು ಕಾಣಿಸಿಕೊಳ್ಳುವ ಅಧಿಸೂಚನೆ ಅಥವಾ ಲಿಂಕ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ.",
    "home.dashboard.title": "ಒಂದೇ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ಎಲ್ಲಾ QR Code ಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    "home.dashboard.body":
      "ಒಂದೇ ಸರಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ಅಪರಿಮಿತ QR Code ಗಳನ್ನು ರಚಿಸಿ, ಸಂಪಾದಿಸಿ ಮತ್ತು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಗಮ್ಯಸ್ಥಾನಗಳನ್ನು ನವೀಕರಿಸಿ, ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿಮ್ಮ ತಂಡದೊಂದಿಗೆ ಸಹಕರಿಸಿ.",
    "home.dashboard.cta": "ಈಗ ಉಚಿತವಾಗಿ ಪ್ರಯತ್ನಿಸಿ",
    "home.features.title":
      "೪ ಸಾವಿರಕ್ಕೂ ಹೆಚ್ಚು ಬಳಕೆದಾರರು ROI-ಚಾಲಿತ QR Code ಅಭಿಯಾನಗಳಿಗಾಗಿ ಏಕೆ UnifiedQR ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟಿದ್ದಾರೆ",
    "home.features.track.title": "ಪ್ರತಿ ಸ್ಕ್ಯಾನ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    "home.features.track.body":
      "ರಿಯಲ್-ಟೈಮ್ ಒಳನೋಟಗಳೊಂದಿಗೆ ನಿಮ್ಮ QR Code ಅಭಿಯಾನ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ ಎಂಬುದನ್ನು ತಿಳಿಯಿರಿ. ಸ್ಕ್ಯಾನ್‌ಗಳು, ಅನನ್ಯ ಬಳಕೆದಾರರು, ಸ್ಥಳಗಳು ಮತ್ತು ಸಾಧನಗಳ ಮೇಲಿನ ಡೇಟಾವನ್ನು ಪಡೆಯಿರಿ.",
    "home.features.dynamic.title": "ಉಚಿತ ಡೈನಾಮಿಕ್ QR Code ಗಳು",
    "home.features.dynamic.body":
      "ಉಚಿತವಾಗಿ ೨ ಡೈನಾಮಿಕ್ QR Code ಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಅವುಗಳ ವಿಷಯವನ್ನು ನವೀಕರಿಸಿ.",
    "home.features.collab.title": "ನಿಮ್ಮ ತಂಡದೊಂದಿಗೆ ಸಹಕರಿಸಿ",
    "home.features.collab.body":
      "ಒಂದೇ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿ QR Code ಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಮತ್ತು ಹಂಚಿಕೊಳ್ಳಲು ೫ ತಂಡ ಸದಸ್ಯರನ್ನು ಆಹ್ವಾನಿಸಿ.",
    "home.features.support.title": "೨೪/೭ ಗ್ರಾಹಕ ಬೆಂಬಲ",
    "home.features.support.body":
      "ನಮ್ಮ ತಂಡ ಯಾವಾಗಲೂ ಇಮೇಲ್ ಅಥವಾ ಕರೆಯ ಮೂಲಕ ತ್ವರಿತವಾಗಿ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಲು ಸಿದ್ಧವಾಗಿದೆ.",
    "home.features.pay.title": "ಬಳಸುವುದಕ್ಕೆ ಮಾತ್ರ ಪಾವತಿಸಿ",
    "home.features.pay.body":
      "ಹೊಂದಿಕೊಳ್ಳುವ ಬೆಲೆ — ಅಗತ್ಯವಿರುವ ವೈಶಿಷ್ಟ್ಯಗಳು ಅಥವಾ ಹೆಚ್ಚುವರಿ ಕೋಡ್‌ಗಳಿಗೆ ಮಾತ್ರ ಪಾವತಿಸಿ.",
    "home.features.cta": "Flex ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    "home.types.title": "ನೀವು ಉಚಿತವಾಗಿ ಯಾವ ರೀತಿಯ QR Code ಗಳನ್ನು ರಚಿಸಬಹುದು?",
    "home.types.cta": "ಎಲ್ಲಾ QR Code ಪ್ರಕಾರಗಳನ್ನು ನೋಡಿ",
    "home.faq.title": "ಪದೇ ಪದೇ ಕೇಳುವ ಪ್ರಶ್ನೆಗಳು",
    "home.faq.1.q": "QR Code ಗಳು ಯಾವಾಗಲೂ ಉಚಿತವೇ?",
    "home.faq.1.a":
      "ಹೌದು. ಇಲ್ಲಿ ನೀವು ರಚಿಸುವ ಪ್ರತಿ ಸ್ಟ್ಯಾಟಿಕ್ QR Code ಉಚಿತ, ಅದಕ್ಕೆ ಯಾವುದೇ ಅವಧಿ ಇಲ್ಲ ಮತ್ತು ಯಾವುದೇ ಸ್ಕ್ಯಾನ್ ಮಿತಿ ಇಲ್ಲ. ನೀವು ಅದನ್ನು PNG ಅಥವಾ SVG ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ವಾಣಿಜ್ಯಿಕವಾಗಿ ಬಳಸಬಹುದು.",
    "home.faq.2.q": "ಸ್ಟ್ಯಾಟಿಕ್ ಮತ್ತು ಡೈನಾಮಿಕ್ QR Code ಗಳ ನಡುವೆ ಏನು ವ್ಯತ್ಯಾಸ?",
    "home.faq.2.a":
      "ಸ್ಟ್ಯಾಟಿಕ್ QR Code ಡೇಟಾವನ್ನು ನೇರವಾಗಿ ಕೋಡ್ ಒಳಗೆ ಸಂಗ್ರಹಿಸುತ್ತದೆ, ಆದ್ದರಿಂದ ಅದನ್ನು ಎಂದಿಗೂ ಬದಲಾಯಿಸಲಾಗುವುದಿಲ್ಲ. ಡೈನಾಮಿಕ್ QR Code ನೀವು ನಿಯಂತ್ರಿಸುವ ಶಾರ್ಟ್ ಲಿಂಕ್ ಕಡೆ ಸೂಚಿಸುತ್ತದೆ, ಆದ್ದರಿಂದ ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಗಮ್ಯಸ್ಥಾನವನ್ನು ಸಂಪಾದಿಸಬಹುದು ಮತ್ತು ಸ್ಕ್ಯಾನ್‌ಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಬಹುದು.",
    "home.faq.3.q": "ನಾನು QR Code ಗೆ ನನ್ನ ಲೋಗೋ ಸೇರಿಸಬಹುದೇ?",
    "home.faq.3.a":
      "ಹೌದು. ಟೆಂಪ್ಲೇಟ್ ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ ಬಣ್ಣಗಳನ್ನು ಹೊಂದಿಸಿ ಮತ್ತು ಕಸ್ಟಮೈಸೇಶನ್ ಪ್ಯಾನೆಲ್‌ನಲ್ಲಿ ಲೋಗೋ ಸೇರಿಸಿ. ಸ್ಕ್ಯಾನರ್‌ಗಳು ಇನ್ನೂ ಕೋಡ್ ಅನ್ನು ವಿಶ್ವಾಸಾರ್ಹವಾಗಿ ಓದಬಹುದು ಎಂಬುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಲೋಗೋ ಚಿಕ್ಕದಾಗಿರಿಸಿ.",
    "home.faq.4.q": "ನಾನು ಯಾವ ಫೈಲ್ ಫಾರ್ಮ್ಯಾಟ್‌ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಕು?",
    "home.faq.4.a":
      "ಸ್ಕ್ರೀನ್‌ಗಳು, ಸಾಮಾಜಿಕ ಪೋಸ್ಟ್‌ಗಳು ಮತ್ತು ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳಿಗಾಗಿ PNG ಬಳಸಿ. ಮುದ್ರಣ, ದೊಡ್ಡ ಫಾರ್ಮ್ಯಾಟ್ ಸೈನೇಜ್ ಅಥವಾ ಗುಣಮಟ್ಟವನ್ನು ಕಳೆದುಕೊಳ್ಳದೆ ಮರುಗಾತ್ರಿಸಬೇಕಾದ ಎಲ್ಲಿಯಾದರೂ SVG ಬಳಸಿ.",
    "home.faq.5.q": "QR Code ಗಳಿಗೆ ಅವಧಿ ಇದೆಯೇ?",
    "home.faq.5.a":
      "ಸ್ಟ್ಯಾಟಿಕ್ QR Code ಗಳು ಎಂದಿಗೂ ಅವಧಿ ಮುಗಿಯುವುದಿಲ್ಲ. ಡೈನಾಮಿಕ್ QR Code ಗಳು ನಿಮ್ಮ ಖಾತೆ ಸಕ್ರಿಯವಾಗಿರುವವರೆಗೆ ಸಕ್ರಿಯವಾಗಿರುತ್ತವೆ, ಮತ್ತು ನೀವು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಅವುಗಳು ಎಲ್ಲಿ ಸೂಚಿಸುತ್ತವೆ ಎಂಬುದನ್ನು ನವೀಕರಿಸಬಹುದು.",
  },
  ml: {
    "nav.products": "ഉത്പന്നങ്ങൾ",
    "nav.types": "QR കോഡ് തരങ്ങൾ",
    "nav.pricing": "വില",
    "nav.contact": "ബന്ധപ്പെടുക",
    "nav.resources": "വിഭവങ്ങൾ",
    "nav.language": "ഭാഷ",
    "header.signIn": "സൈൻ ഇൻ",
    "auth.title": "തിരികെ സ്വാഗതം",
    "auth.subtitle":
      "സംരക്ഷിച്ച കോഡുകൾ, ഡൈനാമിക് ലിങ്കുകൾ എന്നിവ നിയന്ത്രിക്കാൻ നിങ്ങളുടെ വർക്ക്‌സ്പേസിൽ സൈൻ ഇൻ ചെയ്യുക.",
    "auth.signInWith": "Google ഉപയോഗിച്ച് തുടരുക",
    "auth.busy": "Google തുറക്കുന്നു…",
    "auth.googleOnly": "Google നിലവിൽ ഏകമാത്ര സൈൻ-ഇൻ രീതി.",
    "auth.back": "← സൗജന്യ ജനറേറ്ററിലേക്ക് മടങ്ങുക",
    "auth.brand.tagline": "ഓരോ QR കോഡിനും ഒരു വർക്ക്‌സ്പേസ്.",
    "auth.brand.dynamic": "പ്രിന്റ് ചെയ്ത ശേഷം മാറ്റാവുന്ന ഡൈനാമിക് ഷോർട്ട് ലിങ്കുകൾ.",
    "auth.brand.analytics": "ഓരോ ഡൈനാമിക് കോഡിലും സ്കാൻ ട്രാക്കിംഗ്, ആദ്യ സ്കാനിൽ നിന്ന് തത്സമയം.",
    "auth.brand.templates":
      "13 സ്റ്റുഡിയോ ടെംപ്ലേറ്റുകൾ, കസ്റ്റം നിറങ്ങൾ, PNG, SVG എക്സ്പോർട്ടുകൾ.",
    "auth.brand.secure": "Google-സ്ഥിരീകരിച്ച സൈൻ-ഇൻ. പാസ്‌വേഡുകൾ സൂക്ഷിച്ചിട്ടില്ല.",
    "auth.error.notAuthorized": "ഈ ഇമെയിൽ അഡ്മിൻ പാനലിൽ പ്രവേശിക്കാൻ അനുമതിയില്ല.",
    "auth.signOut": "സൈൻ� ഔട്ട്",
    "pricing.title": "നിങ്ങൾ ഉപയോഗിക്കുന്നതിന് മാത്രം പണം നൽകുക",
    "pricing.subtitle":
      "ഓരോ പ്ലാനിലും അപരിമിത സൗജന്യ സ്റ്റാറ്റിക് QR കോഡുകൾ ഉൾപ്പെടുന്നു. ട്രാക്കിംഗ്, എഡിറ്റ് ചെയ്യാവുന്ന കോഡുകൾ അല്ലെങ്കിൽ ടീം ആക്സസ് ആവശ്യമായപ്പോൾ അപ്‌ഗ്രേഡ് ചെയ്യുക.",
    "pricing.mostPopular": "ഏറ്റവും ജനപ്രിയം",
    "pricing.perMonth": "മാസം",
    "pricing.forever": "എല്ലായ്പ്പോഴും",
    "pricing.startFree": "സൗജന്യമായി ആരംഭിക്കുക",
    "pricing.chooseFlex": "Flex തിരഞ്ഞെടുക്കുക",
    "pricing.choosePro": "Pro തിരഞ്ഞെടുക്കുക",
    "pricing.freeFeatures": [
      "അപരിമിത സ്റ്റാറ്റിക് QR കോഡുകൾ",
      "2 ഡൈനാമിക് QR കോഡുകൾ",
      "PNG, SVG ഡൗൺലോഡുകൾ",
      "13 ഡിസൈൻ ടെംപ്ലേറ്റുകൾ",
      "വാണിജ്യ ഉപയോഗം",
    ],
    "pricing.flexFeatures": [
      "Free-ൽ ഉള്ളതെല്ലാം",
      "25 ഡൈനാമിക് QR കോഡുകൾ",
      "സ്കാൻ അനലിറ്റിക്സും ലൊക്കേഷനുകളും",
      "ലോഗോ അപ്‌ലോഡ്",
      "ഇമെയിൽ പിന്തുണ",
    ],
    "pricing.proFeatures": [
      "Flex-ൽ ഉള്ളതെല്ലാം",
      "അപരിമിത ഡൈനാമിക് QR കോഡുകൾ",
      "5 ടീം അംഗങ്ങൾ",
      "ബൾക്ക് സൃഷ്ടിയും API ആക്സസും",
      "കസ്റ്റം ഷോർട്ട് ഡൊമെയിൻ",
      "24/7 മുൻ‌ഗണന പിന്തുണ",
    ],
    "billing.title": "ബില്ലിംഗ്",
    "billing.subtitle":
      "പ്ലാൻ പരിധികൾ, അപ്‌ഗ്രേഡുകൾ, ഇൻവോയ്സുകൾ. പേയ്‌മെന്റുകൾ Cashfree വഴി സുരക്ഷിതമായി പ്രോസസ്സ് ചെയ്യുന്നു.",
    "billing.current": "നിലവിലെ",
    "billing.upgrade": "അപ്‌ഗ്രേഡ്",
    "billing.yourPlan": "നിങ്ങളുടെ പ്ലാൻ",
    "billing.checkout": "ചെക്ക്ഔട്ട് ആരംഭിക്കുന്നു…",
    "billing.signInToUpgrade": "പ്ലാൻ അപ്‌ഗ്രേഡ് ചെയ്യാൻ സൈൻ ഇൻ ചെയ്യുക.",
    "footer.tagline":
      "സൗജന്യ QR കോഡുകൾ സൃഷ്ടിക്കാനും എഡിറ്റ് ചെയ്യാനും കാമ്പെയിൻ പ്രകടനം ട്രാക്ക് ചെയ്യാനും ഉള്ള ഓൾ-ഇൻ-വൺ ടൂൾ. ലോകമെമ്പാടും 4K+ ഉപയോക്താക്കളുടെ വിശ്വാസം.",
    "footer.product": "ഉത്പന്നം",
    "footer.qrCodes": "QR കോഡുകൾ",
    "footer.company": "കമ്പനി",
    "footer.legal": "നിയമപരം",
    "admin.unauthorized": "ഈ ഇമെയിൽ അഡ്മിൻ പാനലിൽ ലോഗ് ഇൻ ചെയ്യാൻ അനുമതിയില്ല.",
    "admin.signInToContinue": "തുടരാൻ Google ഉപയോഗിച്ച് സൈൻ ഇൻ ചെയ്യുക.",
    "visitor.today": "�ന്നത്തെ സന്ദർശകർ",
    "chooser.title": "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    "chooser.subtitle": "തുടരാൻ നിങ്ങൾ ഇഷ്ടപ്പെടുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക",
    "home.hero.title": "UnifiedQR — സൗജന്യ QR Code ജനറേറ്റർ",
    "home.hero.subtitle":
      "വെബ്‌സൈറ്റുകൾ, PDF, കോൺടാക്റ്റുകൾ, SMS തുടങ്ങിയവയ്ക്കായി സൗജന്യ QR Code-കൾ സൃഷ്ടിക്കുക. നിറങ്ങൾ ഇഷ്ടാനുസൃതമാക്കുക, PNG അല്ലെങ്കിൽ SVG ആയി ഡൗൺലോഡ് ചെയ്യുക, ഓരോ സ്കാനും ട്രാക്ക് ചെയ്യുക — ഒരൊറ്റ ഡാഷ്‌ബോർഡിൽ നിന്ന്.",
    "home.social.trusted": "വിശ്വസിക്കുന്നവർ",
    "home.social.users": "4K+ ഉപയോക്താക്കൾ",
    "home.social.onGoogle": "Google-ൽ",
    "home.social.noCreditCard": "ക്രെഡിറ്റ് കാർഡ് ആവശ്യമില്ല",
    "home.social.signupFree": "സൗജന്യമായി സൈൻ അപ്പ് ചെയ്യുക",
    "home.steps.title": "3 ലളിത ഘട്ടങ്ങളിൽ സൗജന്യ QR Code എങ്ങനെ സൃഷ്ടിക്കാം",
    "home.steps.1.title": "നിങ്ങളുടെ QR Code തരം തിരഞ്ഞെടുക്കുക",
    "home.steps.1.body":
      "നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത് എന്നതിന്റെ അടിസ്ഥാനത്തിൽ നിങ്ങളുടെ QR Code തരം (സ്റ്റാറ്റിക് അല്ലെങ്കിൽ ഡൈനാമിക്) തിരഞ്ഞെടുക്കുക: URL തുറക്കുക, PDF പങ്കിടുക, മെനു കാണിക്കുക, കോൺടാക്റ്റ് വിവരങ്ങൾ പങ്കിടുക, തുടങ്ങിയവ.",
    "home.steps.2.title": "നിങ്ങളുടെ രീതിയിൽ ഇഷ്ടാനുസൃതമാക്കുക",
    "home.steps.2.body":
      "നിങ്ങളുടെ വിവരങ്ങൾ ചേർക്കുക, നിറം മാറ്റുക, നിങ്ങളുടെ QR Code സ്റ്റൈൽ ചെയ്യുക, ലോഗോ ചേർക്കുക, ഡൗൺലോഡ് ചെയ്യുന്നതിന് മുമ്പ് തത്സമയം പരിശോധിക്കുക.",
    "home.steps.3.title": "ഡൗൺലോഡ് & പങ്കിടുക",
    "home.steps.3.body":
      "PNG അല്ലെങ്കിൽ SVG ഫോർമാറ്റ് തിരഞ്ഞെടുക്കുക, ഡൗൺലോഡ് ക്ലിക്ക് ചെയ്യുക, നിങ്ങൾ എവിടെയും പങ്കിടാൻ തയ്യാറാണ്!",
    "home.steps.cta": "സൗജന്യ QR Code സൃഷ്ടിക്കുക",
    "home.explained.title": "QR Code വിശദീകരിച്ചു",
    "home.explained.what.title": "QR Code എന്നാൽ എന്താണ്?",
    "home.explained.what.body":
      "QR Code എന്നത് URL, കോൺടാക്റ്റ് വിവരങ്ങൾ, പേയ്‌മെന്റ് ഡാറ്റ അല്ലെങ്കിൽ ടെക്സ്റ്റ് എന്നിങ്ങനെയുള്ള വിവരങ്ങൾ കറുത്ത, വെളുത്ത ചതുരുകളുടെ ഗ്രിഡിൽ സൂക്ഷിക്കുന്ന ദ്വിമാന ബാർകോഡ് ആണ്. ഇത് സ്മാർട്ട്‌ഫോൺ ക്യാമറ ഉപയോഗിച്ച് സ്കാൻ ചെയ്ത് ടൈപ്പ് ചെയ്യാതെ തന്നെ സൂക്ഷിച്ച ഉള്ളടക്കം തത്സമയം ആക്‌സസ് ചെയ്യാം.",
    "home.explained.why.title": "2026-ൽ ഇത്രയധികം ആളുകൾ QR Code എന്തിനാണ് ഉപയോഗിക്കുന്നത്?",
    "home.explained.why.body":
      "QR Code-കൾ ഓൺലൈൻ അനുഭവങ്ങളെ ഡിജിറ്റൽ ഉള്ളടക്കവുമായി ബന്ധിപ്പിക്കുന്ന വേഗത്തിലുള്ള, കോൺടാക്റ്‌ലെസ്സ്, കുറഞ്ഞ ചെലവിലുള്ള മാർഗം നൽകുന്നു. ബിസിനസ്സുകൾ റിയൽ-ടൈം അപ്‌ഡേറ്റുകൾക്കും പ്രിന്റ് മാലിന്യം കുറയ്ക്കുന്നതിനും ഇവയെ ആശ്രയിക്കുന്നു.",
    "home.explained.how.title": "ഞാൻ ഒന്ന് എങ്ങനെ സ്കാൻ ചെയ്യും?",
    "home.explained.how.1":
      "നിങ്ങളുടെ സ്മാർട്ട്‌ഫോണിലോ ടാബ്‌ലെറ്റിലോ ക്യാമറ ആപ്പ് തുറക്കുക. മിക്ക ആധുനിക ഉപകരണങ്ങളും QR Code-കൾ സ്വയമേവ സ്കാൻ ചെയ്യുന്നു.",
    "home.explained.how.2":
      "നിങ്ങളുടെ ക്യാമറ QR Code നോട്ട് ചെയ്യുക, അത് ഫ്രെയിമിൽ വ്യക്തമായി കാണാൻ കഴിയുമെന്ന് ഉറപ്പാക്കുക.",
    "home.explained.how.3": "ക്യാമറ കോഡ് തിരിച്ചറിയുന്നത് വരെ കുറച്ച് സെക്കൻഡ് നിശ്ചലമായിരിക്കുക.",
    "home.explained.how.4":
      "വെബ്‌സൈറ്റ്, വീഡിയോ അല്ലെങ്കിൽ കോൺടാക്റ്റ് കാർഡ് തുറക്കാൻ തോന്നുന്ന അറിയിപ്പോ ലിങ്കോ ടാപ്പ് ചെയ്യുക.",
    "home.dashboard.title": "ഒരൊറ്റ ഡാഷ്‌ബോർഡിൽ നിന്ന് എല്ലാ QR Code-കളും നിയന്ത്രിക്കുക",
    "home.dashboard.body":
      "ഒരൊറ്റ എളുപ്പമുള്ള ഡാഷ്‌ബോർഡിൽ നിന്ന് അപരിമിത QR Code-കൾ സൃഷ്ടിക്കുക, എഡിറ്റ് ചെയ്യുക, ട്രാക്ക് ചെയ്യുക. ഗമ്യസ്ഥാനങ്ങൾ അപ്‌ഡേറ്റ് ചെയ്യുക, അനലിറ്റിക്സ് കാണുക, നിങ്ങളുടെ ടീമുമായി സഹകരിക്കുക.",
    "home.dashboard.cta": "ഇപ്പോൾ സൗജന്യമായി പരീക്ഷിക്കുക",
    "home.features.title":
      "4 ആയിരത്തിലധികം ഉപയോക്താക്കൾ ROI-നടത്തുന്ന QR Code കാമ്പെയിനുകൾക്കായി എന്തുകൊണ്ട് UnifiedQR വിശ്വസിക്കുന്നു",
    "home.features.track.title": "ഓരോ സ്കാനും ട്രാക്ക് ചെയ്യുക",
    "home.features.track.body":
      "തത്സമയ ഉൾക്കാഴ്ചകളിലൂടെ നിങ്ങളുടെ QR Code കാമ്പെയിൻ എത്ര നന്നായി പ്രവർത്തിക്കുന്നുവെന്ന് അറിയുക. സ്കാനുകൾ, അദ്വിതീയ ഉപയോക്താക്കൾ, ലൊക്കേഷനുകൾ, ഉപകരണങ്ങൾ എന്നിവയെക്കുറിച്ചുള്ള ഡാറ്റ നേടുക.",
    "home.features.dynamic.title": "സൗജന്യ ഡൈനാമിക് QR Code-കൾ",
    "home.features.dynamic.body":
      "സൗജന്യമായി 2 ഡൈനാമിക് QR Code-കൾ സൃഷ്ടിക്കുക, ഏത് സമയത്തും അവയുടെ ഉള്ളടക്കം അപ്‌ഡേറ്റ് ചെയ്യുക.",
    "home.features.collab.title": "നിങ്ങളുടെ ടീമുമായി സഹകരിക്കുക",
    "home.features.collab.body":
      "ഒരൊറ്റ ഡാഷ്‌ബോർഡിൽ QR Code-കൾ നിയന്ത്രിക്കാനും പങ്കിടാനും 5 ടീം അംഗങ്ങളെ ക്ഷണിക്കുക.",
    "home.features.support.title": "24/7 കസ്റ്റമർ സപ്പോർട്ട്",
    "home.features.support.body":
      "ഞങ്ങളുടെ ടീം എപ്പോഴും ഇമെയിലോ കോളോ വഴി പെട്ടെന്ന് പ്രശ്നങ്ങൾ പരിഹരിക്കാൻ തയ്യാറാണ്.",
    "home.features.pay.title": "ഉപയോഗിക്കുന്നതിന് മാത്രം പണം നൽകുക",
    "home.features.pay.body":
      "വഴക്കമുള്ള വില — ആവശ്യമായ ഫീച്ചറുകൾ അല്ലെങ്കിൽ അധിക കോഡുകൾക്ക് മാത്രം പണം നൽകുക.",
    "home.features.cta": "Flex പ്ലാനുകൾ പര്യവേക്ഷണം ചെയ്യുക",
    "home.types.title": "സൗജന്യമായി ഏത് തരത്തിലുള്ള QR Code-കൾ സൃഷ്ടിക്കാം?",
    "home.types.cta": "എല്ലാ QR Code തരങ്ങളും കാണുക",
    "home.faq.title": "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ",
    "home.faq.1.q": "QR Code-കൾ എല്ലായ്പ്പോഴും സൗജന്യമാണോ?",
    "home.faq.1.a":
      "അതെ. ഇവിടെ നിങ്ങൾ സൃഷ്ടിക്കുന്ന ഓരോ സ്റ്റാറ്റിക് QR Code-യും സൗജന്യമാണ്, കാലഹരണപ്പെടുന്ന തീയതിയോ സ്കാൻ പരിധിയോ ഇല്ല. നിങ്ങൾക്ക് ഇത് PNG അല്ലെങ്കിൽ SVG ആയി ഡൗൺലോഡ് ചെയ്ത് വാണിജ്യാവശ്യത്തിന് ഉപയോഗിക്കാം.",
    "home.faq.2.q": "സ്റ്റാറ്റിക്, ഡൈനാമിക് QR Code-കൾ തമ്മിൽ എന്താണ് വ്യത്യാസം?",
    "home.faq.2.a":
      "സ്റ്റാറ്റിക് QR Code ഡാറ്റ നേരിട്ട് കോഡിനുള്ളിൽ സൂക്ഷിക്കുന്നു, അതിനാൽ അത് ഒരിക്കലും മാറ്റാൻ കഴിയില്ല. ഡൈനാമിക് QR Code നിങ്ങൾ നിയന്ത്രിക്കുന്ന ഒരു ഷോർട്ട് ലിങ്കിലേക്ക് ചൂണ്ടുന്നു, അതിനാൽ നിങ്ങൾക്ക് ഏത് സമയത്തും ഗമ്യസ്ഥാനം എഡിറ്റ് ചെയ്യാനും സ്കാനുകൾ ട്രാക്ക് ചെയ്യാനും കഴിയും.",
    "home.faq.3.q": "QR Code-യിൽ എന്റെ ലോഗോ ചേർക്കാമോ?",
    "home.faq.3.a":
      "അതെ. ഒരു ടെംപ്ലേറ്റ് തിരഞ്ഞെടുക്കുക, നിങ്ങളുടെ നിറങ്ങൾ ക്രമീകരിക്കുക, ഇഷ്ടാനുസൃതമാക്കൽ പാനലിൽ ലോഗോ ചേർക്കുക. സ്കാനറുകൾക്ക് ഇപ്പോഴും കോഡ് വിശ്വസനീയമായി വായിക്കാൻ കഴിയുമെന്ന് ഉറപ്പാക്കാൻ ലോഗോ ചെറുതായി സൂക്ഷിക്കുക.",
    "home.faq.4.q": "ഏത് ഫയൽ ഫോർമാറ്റിൽ ഡൗൺലോഡ് ചെയ്യണം?",
    "home.faq.4.a":
      "സ്ക്രീനുകൾ, സോഷ്യൽ പോസ്റ്റുകൾ, ഡോക്യുമെന്റുകൾ എന്നിവയ്ക്കായി PNG ഉപയോഗിക്കുക. പ്രിന്റ്, വലിയ ഫോർമാറ്റ് സൈനേജ് അല്ലെങ്കിൽ ഗുണനിലവാരം നഷ്ടപ്പെടാതെ വീണ്ടും വലുതാക്കേണ്ട എവിടെയും SVG ഉപയോഗിക്കുക.",
    "home.faq.5.q": "QR Code-കൾക്ക് കാലഹരണമുണ്ടോ?",
    "home.faq.5.a":
      "സ്റ്റാറ്റിക് QR Code-കൾ ഒരിക്കലും കാലഹരണപ്പെടുന്നില്ല. ഡൈനാമിക് QR Code-കൾ നിങ്ങളുടെ അക്കൗണ്ട് സജീവമായിരിക്കുന്നിടത്തോളം സജീവമായിരിക്കും, അവ എവിടേക്ക് ചൂണ്ടുന്നു എന്നത് ഏത് സമയത്തും അപ്‌ഡേറ്റ് ചെയ്യാം.",
  },
  pa: {
    "nav.products": "ਉਤਪਾਦ",
    "nav.types": "QR ਕੋਡ ਕਿਸਮਾਂ",
    "nav.pricing": "ਕੀਮਤ",
    "nav.contact": "ਸੰਪਰਕ",
    "nav.resources": "ਸਰੋਤ",
    "nav.language": "ਭਾਸ਼ਾ",
    "header.signIn": "ਸਾਈਨ ਇਨ",
    "auth.title": "ਵਾਪਸੀ ਤੇ ਜੀ ਆਇਆਂ ਨੂੰ",
    "auth.subtitle":
      "ਸੰਭਾਲੇ ਹੋਏ ਕੋਡ, ਡਾਇਨਾਮਿਕ ਲਿੰਕ ਅਤੇ ਸਕੈਨ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਬੰਧਿਤ ਕਰਨ ਲਈ ਆਪਣੇ ਵਰਕਸਪੇਸ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰੋ।",
    "auth.signInWith": "Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    "auth.busy": "Google ਖੋਲ੍ਹ ਰਿਹਾ ਹੈ…",
    "auth.googleOnly": "Google ਇਸ ਵੇਲੇ ਇੱਕੋ ਸਾਈਨ-ਇਨ ਢੰਗ ਹੈ।",
    "auth.back": "← ਮੁਫ਼ਤ ਜਨਰੇਟਰ ਤੇ ਵਾਪਸ ਜਾਓ",
    "auth.brand.tagline": "ਹਰ QR ਕੋਡ ਲਈ ਇੱਕ ਵਰਕਸਪੇਸ।",
    "auth.brand.dynamic": "ਪ੍ਰਿੰਟ ਕਰਨ ਤੋਂ ਬਾਅਦ ਬਦਲੇ ਜਾ ਸਕਣ ਵਾਲੇ ਡਾਇਨਾਮਿਕ ਸ਼ਾਰਟ ਲਿੰਕ।",
    "auth.brand.analytics": "ਹਰ ਡਾਇਨਾਮਿਕ ਕੋਡ ਤੇ ਸਕੈਨ ਟਰੈਕਿੰਗ, ਪਹਿਲੇ ਸਕੈਨ ਤੋਂ ਲਾਈਵ।",
    "auth.brand.templates": "13 ਸਟੂਡੀਓ ਟੈਂਪਲੇਟ, ਕਸਟਮ ਰੰਗ, PNG ਅਤੇ SVG ਐਕਸਪੋਰਟ।",
    "auth.brand.secure": "Google-ਪੁਸ਼ਟੀਕ੍ਰਿਤ ਸਾਈਨ-ਇਨ। ਕੋਈ ਪਾਸਵਰਡ ਸੰਭਾਲੇ ਨਹੀਂ।",
    "auth.error.notAuthorized": "ਇਹ ਈਮੇਲ ਐਡਮਿਨ ਪੈਨਲ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਅਧਿਕ੃ਤ ਨਹੀਂ ਹੈ।",
    "auth.signOut": "ਸਾਈਨ ਆਊਟ",
    "pricing.title": "ਸਿਰਫ਼ ਜਿਸ ਦੀ ਵਰਤੋਂ ਕਰੋ ਉਸ ਦਾ ਭੁਗਤਾਨ ਕਰੋ",
    "pricing.subtitle":
      "ਹਰ ਪਲਾਨ ਵਿੱਚ ਅਸੀਮਿਤ ਮੁਫ਼ਤ ਸਟੈਟਿਕ QR ਕੋਡ ਸ਼ਾਮਲ ਹਨ। ਟਰੈਕਿੰਗ, ਸੰਪਾਦਨਯੋਗ ਕੋਡ ਜਾਂ ਟੀਮ ਐਕਸੈਸ ਦੀ ਲੋੜ ਹੋਣ ਤੇ ਅੱਪਗ੍ਰੇਡ ਕਰੋ।",
    "pricing.mostPopular": "ਸਭ ਤੋਂ ਵੱਧ ਮਸ਼ਹੂਰ",
    "pricing.perMonth": "ਪ੍ਰਤੀ ਮਹੀਨਾ",
    "pricing.forever": "ਹਮੇਸ਼ਾ ਲਈ",
    "pricing.startFree": "ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ",
    "pricing.chooseFlex": "Flex ਚੁਣੋ",
    "pricing.choosePro": "Pro ਚੁਣੋ",
    "pricing.freeFeatures": [
      "ਅਸੀਮਿਤ ਸਟੈਟਿਕ QR ਕੋਡ",
      "2 ਡਾਇਨਾਮਿਕ QR ਕੋਡ",
      "PNG ਅਤੇ SVG ਡਾਊਨਲੋਡ",
      "13 ਡਿਜ਼ਾਇਨ ਟੈਂਪਲੇਟ",
      "ਵਪਾਰਕ ਵਰਤੋਂ",
    ],
    "pricing.flexFeatures": [
      "Free ਵਿੱਚ ਸਭ ਕੁਝ",
      "25 ਡਾਇਨਾਮਿਕ QR ਕੋਡ",
      "ਸਕੈਨ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਟਿਕਾਣੇ",
      "ਲੋਗੋ ਅੱਪਲੋਡ",
      "ਈਮੇਲ ਸਹਾਇਤਾ",
    ],
    "pricing.proFeatures": [
      "Flex ਵਿੱਚ ਸਭ ਕੁਝ",
      "ਅਸੀਮਿਤ ਡਾਇਨਾਮਿਕ QR ਕੋਡ",
      "5 ਟੀਮ ਮੈਂਬਰ",
      "ਬਲਕ ਨਿਰਮਾਣ ਅਤੇ API ਐਕਸੈਸ",
      "ਕਸਟਮ ਸ਼ਾਰਟ ਡੋਮੇਨ",
      "24/7 ਤਰਜੀਹੀ ਸਹਾਇਤਾ",
    ],
    "billing.title": "ਬਿਲਿੰਗ",
    "billing.subtitle":
      "ਪਲਾਨ ਸੀਮਾਵਾਂ, ਅੱਪਗ੍ਰੇਡ ਅਤੇ ਇਨਵੌਇਸ। ਭੁਗਤਾਨ Cashfree ਰਾਹੀਂ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਪ੍ਰਕਿਰਿਆ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।",
    "billing.current": "ਮੌਜੂਦਾ",
    "billing.upgrade": "ਅੱਪਗ੍ਰੇਡ",
    "billing.yourPlan": "ਤੁਹਾਡਾ ਪਲਾਨ",
    "billing.checkout": "ਚੈਕਆਊਟ ਸ਼ੁਰੂ ਹੋ ਰਿਹਾ ਹੈ…",
    "billing.signInToUpgrade": "ਪਲਾਨ ਅੱਪਗ੍ਰੇਡ ਕਰਨ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।",
    "footer.tagline":
      "ਮੁਫ਼ਤ QR ਕੋਡ ਬਣਾਉਣ, ਸੰਪਾਦਿਤ ਕਰਨ ਅਤੇ ਮੁਹਿੰਮ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਟ੍ਰੈਕ ਕਰਨ ਦਾ ਆਲ-ਇਨ-ਵੱਨ ਟੂਲ। ਦੁਨੀਆ ਭਰ ਵਿੱਚ ੪K+ ਵਰਤੋਂਕਾਰਾਂ ਦਾ ਭਰੋਸਾ।",
    "footer.product": "ਉਤਪਾਦ",
    "footer.qrCodes": "QR ਕੋਡ",
    "footer.company": "ਕੰਪਨੀ",
    "footer.legal": "ਕਾਨੂੰਨੀ",
    "admin.unauthorized": "ਇਹ ਈਮੇਲ ਐਡਮਿਨ ਪੈਨਲ ਵਿੱਚ ਲੌਗ ਇਨ ਕਰਨ ਲਈ ਅਧਿਕ੃ਤ ਨਹੀਂ ਹੈ।",
    "admin.signInToContinue": "ਜਾਰੀ ਰੱਖਣ ਲਈ Google ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ।",
    "visitor.today": "ਅੱਜ ਦੇ ਮਹਿਮਾਨ",
    "chooser.title": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    "chooser.subtitle": "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ",
    "home.hero.title": "UnifiedQR — ਮੁਫ਼ਤ QR Code ਜਨਰੇਟਰ",
    "home.hero.subtitle":
      "ਵੈੱਬਸਾਈਟਾਂ, PDF, ਸੰਪਰਕ, SMS ਅਤੇ ਹੋਰ ਲਈ ਮੁਫ਼ਤ QR Code ਬਣਾਓ। ਰੰਗ ਕਸਟਮਾਈਜ਼ ਕਰੋ, PNG ਜਾਂ SVG ਵਜੋਂ ਡਾਊਨਲੋਡ ਕਰੋ ਅਤੇ ਹਰ ਸਕੈਨ ਟ੍ਰੈਕ ਕਰੋ — ਸਭ ਇੱਕ ਡੈਸ਼ਬੋਰਡ ਤੋਂ।",
    "home.social.trusted": "ਇਨ੍ਹਾਂ ਉੱਤੇ ਭਰੋਸਾ",
    "home.social.users": "੪K+ ਵਰਤੋਂਕਾਰ",
    "home.social.onGoogle": "Google ਤੇ",
    "home.social.noCreditCard": "ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਦੀ ਲੋੜ ਨਹੀਂ",
    "home.social.signupFree": "ਮੁਫ਼ਤ ਸਾਈਨ ਅੱਪ ਕਰੋ",
    "home.steps.title": "3 ਸੌਖੇ ਕਦਮਾਂ ਵਿੱਚ ਮੁਫ਼ਤ QR Code ਕਿਵੇਂ ਬਣਾਈਏ",
    "home.steps.1.title": "ਆਪਣੀ QR Code ਕਿਸਮ ਚੁਣੋ",
    "home.steps.1.body":
      "ਆਪਣੀ QR Code ਕਿਸਮ (ਸਟੈਟਿਕ ਜਾਂ ਡਾਇਨਾਮਿਕ) ਇਸ ਦੇ ਆਧਾਰ ਤੇ ਚੁਣੋ ਕਿ ਤੁਸੀਂ ਇਸ ਨਾਲ ਕੀ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ: URL ਖੋਲ੍ਹੋ, PDF ਸਾਂਝਾ ਕਰੋ, ਮੇਨੂ ਦਿਖਾਓ, ਸੰਪਰਕ ਵੇਰਵੇ ਸਾਂਝੇ ਕਰੋ, ਅਤੇ ਹੋਰ।",
    "home.steps.2.title": "ਆਪਣੇ ਤਰੀਕੇ ਨਾਲ ਕਸਟਮਾਈਜ਼ ਕਰੋ",
    "home.steps.2.body":
      "ਆਪਣੇ ਵੇਰਵੇ ਜੋੜੋ, ਰੰਗ ਬਦਲੋ, ਆਪਣੇ QR Code ਨੂੰ ਸਟਾਈਲ ਕਰੋ, ਲੋਗੋ ਜੋੜੋ ਅਤੇ ਡਾਊਨਲੋਡ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਰੀਅਲ ਟਾਈਮ ਵਿੱਚ ਜਾਂਚੋ।",
    "home.steps.3.title": "ਡਾਊਨਲੋਡ ਅਤੇ ਸਾਂਝਾ ਕਰੋ",
    "home.steps.3.body":
      "PNG ਜਾਂ SVG ਫਾਰਮੈਟ ਚੁਣੋ, ਡਾਊਨਲੋਡ ਦਬਾਓ ਅਤੇ ਤੁਸੀਂ ਕਿਤੇ ਵੀ ਸਾਂਝਾ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ!",
    "home.steps.cta": "ਮੁਫ਼ਤ QR Code ਬਣਾਓ",
    "home.explained.title": "QR Code ਸਮਝਾਇਆ ਗਿਆ",
    "home.explained.what.title": "QR Code ਕੀ ਹੈ?",
    "home.explained.what.body":
      "QR Code ਇੱਕ ਦ੍ਵਿਮਿਤੀ ਬਾਰਕੋਡ ਹੈ ਜੋ URL, ਸੰਪਰਕ ਵੇਰਵੇ, ਭੁਗਤਾਨ ਡੇਟਾ ਜਾਂ ਟੈਕਸਟ ਵਰਗੀ ਜਾਣਕਾਰੀ ਕਾਲੇ ਅਤੇ ਚਿੱਟੇ ਵਰਗਾਂ ਦੇ ਗ੍ਰਿਡ ਵਿੱਚ ਸੰਭਾਲਦਾ ਹੈ। ਇਸ ਨੂੰ ਸਮਾਰਟਫੋਨ ਕੈਮਰੇ ਨਾਲ ਸਕੈਨ ਕਰਕੇ ਟਾਈਪ ਕੀਤੇ ਬਿਨਾਂ ਸੰਭਾਲੀ ਗਈ ਸਮੱਗਰੀ ਤੁਰੰਤ ਐਕਸੈਸ ਕੀਤੀ ਜਾ ਸਕਦੀ ਹੈ।",
    "home.explained.why.title": "2026 ਵਿੱਚ ਇੰਨੇ ਲੋਕ QR Code ਕਿਉਂ ਵਰਤਦੇ ਹਨ?",
    "home.explained.why.body":
      "QR Code ਔਫਲਾਈਨ ਤਜ਼ਰਬਿਆਂ ਨੂੰ ਡਿਜੀਟਲ ਸਮੱਗਰੀ ਨਾਲ ਜੋੜਨ ਦਾ ਤੇਜ਼, ਨਾਨ-ਕਾਂਟੈਕਟ ਅਤੇ ਘੱਟ ਖਰਚ ਵਾਲਾ ਤਰੀਕਾ ਪ੍ਰਦਾਨ ਕਰਦੇ ਹਨ। ਕਾਰੋਬਾਰੀ ਰੀਅਲ-ਟਾਈਮ ਅੱਪਡੇਟ ਅਤੇ ਪ੍ਰਿੰਟ ਫ਼ਜ਼ੂਲਖ਼ਰਚ ਘਟਾਉਣ ਲਈ ਇਨ੍ਹਾਂ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦੇ ਹਨ।",
    "home.explained.how.title": "ਮੈਂ ਇੱਕ ਨੂੰ ਕਿਵੇਂ ਸਕੈਨ ਕਰਾਂ?",
    "home.explained.how.1":
      "ਆਪਣੇ ਸਮਾਰਟਫੋਨ ਜਾਂ ਟੈਬਲੇਟ ਤੇ ਕੈਮਰਾ ਐਪ ਖੋਲ੍ਹੋ। ਜ਼ਿਆਦਾਤਰ ਆਧੁਨਿਕ ਡਿਵਾਈਸ QR Code ਨੂੰ ਆਪਣੇ ਆਪ ਸਕੈਨ ਕਰਦੇ ਹਨ।",
    "home.explained.how.2":
      "ਆਪਣੇ ਕੈਮਰੇ ਨੂੰ QR Code ਵੱਲ ਨਿਰਦੇਸ਼ ਕਰੋ, ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਇਹ ਫ੍ਰੇਮ ਵਿੱਚ ਸਾਫ਼ ਤੌਰ ਤੇ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ।",
    "home.explained.how.3": "ਕੈਮਰੇ ਦੁਆਰਾ ਕੋਡ ਪਛਾਣੇ ਜਾਣ ਤੱਕ ਕੁਝ ਸਕਿੰਟ ਸਥਿਰ ਰਹੋ।",
    "home.explained.how.4":
      "ਵੈੱਬਸਾਈਟ, ਵੀਡੀਓ ਜਾਂ ਸੰਪਰਕ ਕਾਰਡ ਖੋਲ੍ਹਣ ਲਈ ਦਿਖਾਈ ਦੇਣ ਵਾਲੀ ਸੂਚਨਾ ਜਾਂ ਲਿੰਕ ਤੇ ਟੈਪ ਕਰੋ।",
    "home.dashboard.title": "ਇੱਕ ਡੈਸ਼ਬੋਰਡ ਤੋਂ ਸਾਰੇ QR Code ਪ੍ਰਬੰਧਿਤ ਕਰੋ",
    "home.dashboard.body":
      "ਇੱਕੋ ਸੌਖੇ ਡੈਸ਼ਬੋਰਡ ਤੋਂ ਅਸੀਮਿਤ QR Code ਬਣਾਓ, ਸੰਪਾਦਿਤ ਕਰੋ ਅਤੇ ਟ੍ਰੈਕ ਕਰੋ। ਮੰਜ਼ਿਲਾਂ ਅੱਪਡੇਟ ਕਰੋ, ਵਿਸ਼ਲੇਸ਼ਣ ਵੇਖੋ ਅਤੇ ਆਪਣੀ ਟੀਮ ਨਾਲ ਸਹਿਯੋਗ ਕਰੋ।",
    "home.dashboard.cta": "ਹੁਣੇ ਮੁਫ਼ਤ ਵਰਤ ਕੇ ਵੇਖੋ",
    "home.features.title":
      "੪ ਹਜ਼ਾਰ+ ਵਰਤੋਂਕਾਰ ROI-ਚਾਲਿਤ QR Code ਮੁਹਿੰਮਾਂ ਲਈ UnifiedQR ਉੱਤੇ ਕਿਉਂ ਭਰੋਸਾ ਕਰਦੇ ਹਨ",
    "home.features.track.title": "ਹਰ ਸਕੈਨ ਟ੍ਰੈਕ ਕਰੋ",
    "home.features.track.body":
      "ਰੀਅਲ-ਟਾਈਮ ਜਾਣਕਾਰੀ ਨਾਲ ਜਾਣੋ ਕਿ ਤੁਹਾਡੀ QR Code ਮੁਹਿੰਮ ਕਿਵੇਂ ਕੰਮ ਕਰ ਰਹੀ ਹੈ। ਸਕੈਨ, ਨਿਰਾਲੇ ਵਰਤੋਂਕਾਰ, ਟਿਕਾਣੇ ਅਤੇ ਡਿਵਾਈਸ ਬਾਰੇ ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰੋ।",
    "home.features.dynamic.title": "ਮੁਫ਼ਤ ਡਾਇਨਾਮਿਕ QR Code",
    "home.features.dynamic.body":
      "ਮੁਫ਼ਤ ਵਿੱਚ 2 ਡਾਇਨਾਮਿਕ QR Code ਬਣਾਓ ਅਤੇ ਕਿਸੇ ਵੀ ਸਮੇਂ ਉਨ੍ਹਾਂ ਦੀ ਸਮੱਗਰੀ ਅੱਪਡੇਟ ਕਰੋ।",
    "home.features.collab.title": "ਆਪਣੀ ਟੀਮ ਨਾਲ ਸਹਿਯੋਗ ਕਰੋ",
    "home.features.collab.body":
      "ਇੱਕ ਡੈਸ਼ਬੋਰਡ ਤੇ QR Code ਪ੍ਰਬੰਧਿਤ ਕਰਨ ਅਤੇ ਸਾਂਝੇ ਕਰਨ ਲਈ 5 ਟੀਮ ਮੈਂਬਰਾਂ ਨੂੰ ਸੱਦਾ ਵੇਖੋ।",
    "home.features.support.title": "੨੪/੭ ਗਾਹਕ ਸਹਾਇਤਾ",
    "home.features.support.body":
      "ਸਾਡੀ ਟੀਮ ਹਮੇਸ਼ਾ ਈਮੇਲ ਜਾਂ ਕਾਲ ਰਾਹੀਂ ਜਲਦੀ ਸਮੱਸਿਆਵਾਂ ਠੀਕ ਕਰਨ ਲਈ ਤਿਆਰ ਹੈ।",
    "home.features.pay.title": "ਜਿਸ ਦੀ ਵਰਤੋਂ ਕਰੋ ਉਸ ਦਾ ਭੁਗਤਾਨ ਕਰੋ",
    "home.features.pay.body":
      "ਲਚਕਦਾਰ ਕੀਮਤ — ਸਿਰਫ਼ ਲੋੜੀਂਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਜਾਂ ਵਾਧੂ ਕੋਡਾਂ ਲਈ ਹੀ ਭੁਗਤਾਨ ਕਰੋ।",
    "home.features.cta": "Flex ਯੋਜਨਾਵਾਂ ਦੇਖੋ",
    "home.types.title": "ਤੁਸੀਂ ਮੁਫ਼ਤ ਵਿੱਚ ਕਿਸ ਤਰ੍ਹਾਂ ਦੇ QR Code ਬਣਾ ਸਕਦੇ ਹੋ?",
    "home.types.cta": "ਸਾਰੀਆਂ QR Code ਕਿਸਮਾਂ ਦੇਖੋ",
    "home.faq.title": "ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ",
    "home.faq.1.q": "QR Code ਹਮੇਸ਼ਾ ਲਈ ਮੁਫ਼ਤ ਹਨ?",
    "home.faq.1.a":
      "ਹਾਂ। ਇੱਥੇ ਤੁਹਾਡੇ ਦੁਆਰਾ ਬਣਾਇਆ ਗਿਆ ਹਰ ਸਟੈਟਿਕ QR Code ਮੁਫ਼ਤ ਹੈ, ਕੋਈ ਮਿਆਦ ਨਹੀਂ ਅਤੇ ਕੋਈ ਸਕੈਨ ਸੀਮਾ ਨਹੀਂ। ਤੁਸੀਂ ਇਸ ਨੂੰ PNG ਜਾਂ SVG ਵਜੋਂ ਡਾਊਨਲੋਡ ਕਰ ਕੇ ਵਪਾਰਕ ਤੌਰ ਤੇ ਵਰਤ ਸਕਦੇ ਹੋ।",
    "home.faq.2.q": "ਸਟੈਟਿਕ ਅਤੇ ਡਾਇਨਾਮਿਕ QR Code ਵਿੱਚ ਕੀ ਅੰਤਰ ਹੈ?",
    "home.faq.2.a":
      "ਸਟੈਟਿਕ QR Code ਡੇਟਾ ਸਿੱਧਾ ਕੋਡ ਦੇ ਅੰਦਰ ਸੰਭਾਲਦਾ ਹੈ, ਇਸ ਲਈ ਇਸ ਨੂੰ ਕਦੇ ਵੀ ਬਦਲਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ। ਡਾਇਨਾਮਿਕ QR Code ਇੱਕ ਛੋਟੇ ਲਿੰਕ ਵੱਲ ਨਿਰਦੇਸ਼ ਕਰਦਾ ਹੈ ਜਿਸ ਨੂੰ ਤੁਸੀਂ ਕੰਟਰੋਲ ਕਰਦੇ ਹੋ, ਇਸ ਲਈ ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਮੰਜ਼ਿਲ ਸੰਪਾਦਿਤ ਕਰ ਸਕਦੇ ਹੋ ਅਤੇ ਸਕੈਨ ਟ੍ਰੈਕ ਕਰ ਸਕਦੇ ਹੋ।",
    "home.faq.3.q": "ਕੀ ਮੈਂ ਆਪਣਾ ਲੋਗੋ QR Code ਵਿੱਚ ਜੋੜ ਸਕਦਾ ਹਾਂ?",
    "home.faq.3.a":
      "ਹਾਂ। ਇੱਕ ਟੈਂਪਲੇਟ ਚੁਣੋ, ਆਪਣੇ ਰੰਗ ਸੈਟ ਕਰੋ ਅਤੇ ਕਸਟਮਾਈਜ਼ੇਸ਼ਨ ਪੈਨਲ ਵਿੱਚ ਲੋਗੋ ਜੋੜੋ। ਸਕੈਨਰ ਅਜੇ ਵੀ ਕੋਡ ਭਰੋਸੇਯੋਗ ਤਰੀਕੇ ਨਾਲ ਪੜ੍ਹ ਸਕਣ ਇਸ ਲਈ ਲੋਗੋ ਛੋਟਾ ਰੱਖੋ।",
    "home.faq.4.q": "ਮੈਂ ਕਿਸ ਫਾਈਲ ਫਾਰਮੈਟ ਵਿੱਚ ਡਾਊਨਲੋਡ ਕਰਾਂ?",
    "home.faq.4.a":
      "ਸਕ੍ਰੀਨਾਂ, ਸੋਸ਼ਲ ਪੋਸਟਾਂ ਅਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਲਈ PNG ਦੀ ਵਰਤੋਂ ਕਰੋ। ਪ੍ਰਿੰਟ, ਵੱਡੇ ਫਾਰਮੈਟ ਦੇ ਸਾਈਨੇਜ ਜਾਂ ਕਿਤੇ ਵੀ ਜਿੱਥੇ ਤੁਹਾਨੂੰ ਗੁਣਵੱਤਾ ਗੁਆਏ ਬਿਨਾਂ ਮੁੜ ਸਾਈਜ਼ ਕਰਨ ਦੀ ਲੋੜ ਹੋਵੇ ਉੱਥੇ SVG ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    "home.faq.5.q": "QR Code ਦੀ ਮਿਆਦ ਹੁੰਦੀ ਹੈ?",
    "home.faq.5.a":
      "ਸਟੈਟਿਕ QR Code ਕਦੇ ਮਿਆਦ ਪੁੱਗ ਨਹੀਂ ਸਕਦੇ। ਡਾਇਨਾਮਿਕ QR Code ਤੁਹਾਡੇ ਖਾਤੇ ਦੇ ਸਰਗਰਮ ਰਹਿਣ ਤੱਕ ਸਰਗਰਮ ਰਹਿੰਦੇ ਹਨ ਅਤੇ ਤੁਸੀਂ ਕਿਸੇ ਵੀ ਸਮੇਂ ਇਨ੍ਹਾਂ ਦੀ ਮੰਜ਼ਿਲ ਅੱਪਡੇਟ ਕਰ ਸਕਦੇ ਹੋ।",
  },
  es: {
    "nav.products": "Productos",
    "nav.types": "Tipos de QR Code",
    "nav.pricing": "Precios",
    "nav.contact": "Contacto",
    "nav.resources": "Recursos",
    "nav.language": "Idioma",
    "header.signIn": "Iniciar sesión",
    "auth.title": "Bienvenido de nuevo",
    "auth.subtitle":
      "Inicia sesión en tu espacio de trabajo para gestionar códigos guardados, enlaces dinámicos y análisis de escaneos.",
    "auth.signInWith": "Continuar con Google",
    "auth.busy": "Abriendo Google…",
    "auth.googleOnly": "Google es actualmente el único método de inicio de sesión.",
    "auth.back": "← Volver al generador gratuito",
    "auth.brand.tagline": "Un espacio de trabajo para cada QR Code que crees.",
    "auth.brand.dynamic": "Enlaces dinámicos que puedes redirigir después de imprimir.",
    "auth.brand.analytics":
      "Seguimiento de escaneos en cada código dinámico, en vivo desde el primer escaneo.",
    "auth.brand.templates":
      "13 plantillas de estudio, colores personalizados, exportaciones PNG y SVG.",
    "auth.brand.secure": "Inicio de sesión verificado por Google. No se almacenan contraseñas.",
    "auth.error.notAuthorized":
      "Este correo no está autorizado para acceder al panel de administración.",
    "auth.signOut": "Cerrar sesión",
    "pricing.title": "Paga solo por lo que uses",
    "pricing.subtitle":
      "Cada plan incluye códigos QR estáticos gratuitos ilimitados. Mejora cuando necesites seguimiento, códigos editables o acceso de equipo.",
    "pricing.mostPopular": "Más popular",
    "pricing.perMonth": "por mes",
    "pricing.forever": "para siempre",
    "pricing.startFree": "Empezar gratis",
    "pricing.chooseFlex": "Elegir Flex",
    "pricing.choosePro": "Elegir Pro",
    "pricing.freeFeatures": [
      "Códigos QR estáticos ilimitados",
      "2 códigos QR dinámicos",
      "Descargas PNG y SVG",
      "13 plantillas de diseño",
      "Uso comercial",
    ],
    "pricing.flexFeatures": [
      "Todo lo de Free",
      "25 códigos QR dinámicos",
      "Análisis de escaneos y ubicaciones",
      "Subida de logo",
      "Soporte por email",
    ],
    "pricing.proFeatures": [
      "Todo lo de Flex",
      "Códigos QR dinámicos ilimitados",
      "5 miembros del equipo",
      "Creación masiva y acceso API",
      "Dominio corto personalizado",
      "Soporte prioritario 24/7",
    ],
    "billing.title": "Facturación",
    "billing.subtitle":
      "Límites del plan, mejoras y facturas. Los pagos se procesan de forma segura mediante Cashfree.",
    "billing.current": "Actual",
    "billing.upgrade": "Mejorar",
    "billing.yourPlan": "Tu plan",
    "billing.checkout": "Iniciando pago…",
    "billing.signInToUpgrade": "Inicia sesión para mejorar tu plan.",
    "footer.tagline":
      "Herramienta todo-en-uno para crear códigos QR gratuitos, editarlos y rastrear el rendimiento de campañas. Con la confianza de más de 4K usuarios en todo el mundo.",
    "footer.product": "Producto",
    "footer.qrCodes": "Códigos QR",
    "footer.company": "Empresa",
    "footer.legal": "Legal",
    "admin.unauthorized":
      "Este correo no está autorizado para iniciar sesión en el panel de administración.",
    "admin.signInToContinue": "Inicia sesión con Google para continuar.",
    "visitor.today": "visitantes hoy",
    "chooser.title": "Elige tu idioma",
    "chooser.subtitle": "Selecciona tu idioma preferido para continuar",
    "home.hero.title": "UnifiedQR — Generador de QR Codes GRATIS",
    "home.hero.subtitle":
      "Crea QR Codes gratis para sitios web, PDFs, contactos, SMS y más. Personaliza colores, descarga como PNG o SVG y rastrea cada escaneo — todo desde un solo panel.",
    "home.social.trusted": "Confiado por",
    "home.social.users": "Más de 4K usuarios",
    "home.social.onGoogle": "en Google",
    "home.social.noCreditCard": "No se requiere tarjeta de crédito",
    "home.social.signupFree": "Regístrate gratis",
    "home.steps.title": "Cómo crear un QR Code gratis en 3 simples pasos",
    "home.steps.1.title": "Elige tu tipo de QR Code",
    "home.steps.1.body":
      "Elige tu tipo de QR Code (estático o dinámico) según lo que quieras hacer: abrir una URL, compartir un PDF, mostrar un menú, compartir datos de contacto y más.",
    "home.steps.2.title": "Personalízalo a tu manera",
    "home.steps.2.body":
      "Agrega tus datos, cambia el color, personaliza tu QR Code, añade un logo y pruébalo en tiempo real antes de descargar.",
    "home.steps.3.title": "Descarga y comparte",
    "home.steps.3.body":
      "Elige formato PNG o SVG, haz clic en descargar y ¡listo para compartir en cualquier lugar!",
    "home.steps.cta": "Crea un QR Code gratis",
    "home.explained.title": "QR Codes explicados",
    "home.explained.what.title": "¿Qué es un QR Code?",
    "home.explained.what.body":
      "Un QR Code es un código de barras bidimensional que almacena información como URLs, datos de contacto, datos de pago o texto en una cuadrícula de cuadrados blancos y negros. Se puede escanear con la cámara de un teléfono inteligente para acceder instantáneamente al contenido almacenado sin escribir.",
    "home.explained.why.title": "¿Por qué tanta gente usa QR Codes en 2026?",
    "home.explained.why.body":
      "Los QR Codes proporcionan una forma rápida, sin contacto y de bajo costo de vincular experiencias offline con contenido digital. Los negocios dependen de ellos para actualizaciones en tiempo real y para reducir el desperdicio de impresión.",
    "home.explained.how.title": "¿Cómo escaneo uno?",
    "home.explained.how.1":
      "Abre la aplicación de la cámara en tu teléfono inteligente o tablet. La mayoría de los dispositivos modernos escanean QR Codes automáticamente.",
    "home.explained.how.2":
      "Apunta tu cámara al QR Code, asegurándote de que sea claramente visible dentro del encuadre.",
    "home.explained.how.3": "Mantén la cámara estable unos segundos hasta que reconozca el código.",
    "home.explained.how.4":
      "Toca la notificación o enlace que aparece para abrir el sitio web, video o tarjeta de contacto.",
    "home.dashboard.title": "Gestiona todos tus QR Codes desde un solo panel",
    "home.dashboard.body":
      "Crea, edita y rastrea QR Codes ilimitados desde un solo panel fácil de usar. Actualiza destinos, ve análisis y colabora con tu equipo.",
    "home.dashboard.cta": "Pruébalo gratis ahora",
    "home.features.title":
      "Más de 4 mil usuarios confían en UnifiedQR para campañas de QR Codes orientadas a ROI",
    "home.features.track.title": "Rastrea cada escaneo",
    "home.features.track.body":
      "Conoce el rendimiento de tu campaña de QR Codes con información en tiempo real. Obtén datos sobre escaneos, usuarios únicos, ubicaciones y dispositivos.",
    "home.features.dynamic.title": "QR Codes dinámicos gratis",
    "home.features.dynamic.body":
      "Crea hasta 2 QR Codes dinámicos gratis y actualiza su contenido en cualquier momento.",
    "home.features.collab.title": "Colabora con tu equipo",
    "home.features.collab.body":
      "Invita hasta 5 miembros del equipo para gestionar y compartir QR Codes en un solo panel.",
    "home.features.support.title": "Atención al cliente 24/7",
    "home.features.support.body":
      "Nuestro equipo siempre está listo para resolver problemas rápidamente, por correo electrónico o llamada.",
    "home.features.pay.title": "Paga por lo que uses",
    "home.features.pay.body":
      "Precios flexibles — paga solo por las características o códigos extra que necesites.",
    "home.features.cta": "Explora los planes Flex",
    "home.types.title": "¿Qué tipos de QR Codes puedes crear gratis?",
    "home.types.cta": "Ver todos los tipos de QR Code",
    "home.faq.title": "Preguntas frecuentes",
    "home.faq.1.q": "¿Los QR Codes son gratis para siempre?",
    "home.faq.1.a":
      "Sí. Cada QR Code estático que creas aquí es gratis, no tiene fecha de vencimiento ni límite de escaneos. Puedes descargarlo como PNG o SVG y usarlo comercialmente.",
    "home.faq.2.q": "¿Cuál es la diferencia entre QR Codes estáticos y dinámicos?",
    "home.faq.2.a":
      "Un QR Code estático almacena los datos directamente dentro del código, por lo que nunca se puede cambiar. Un QR Code dinámico apunta a un enlace corto que tú controlas, por lo que puedes editar el destino y rastrear escaneos en cualquier momento.",
    "home.faq.3.q": "¿Puedo agregar mi logo a un QR Code?",
    "home.faq.3.a":
      "Sí. Elige una plantilla, ajusta tus colores y agrega un logo en el panel de personalización. Mantén el logo pequeño para que los escaneadores puedan leer el código de forma confiable.",
    "home.faq.4.q": "¿Qué formato de archivo debo descargar?",
    "home.faq.4.a":
      "Usa PNG para pantallas, publicaciones sociales y documentos. Usa SVG para impresión, señalización de gran formato o cualquier lugar donde necesites redimensionar sin perder calidad.",
    "home.faq.5.q": "¿Los QR Codes caducan?",
    "home.faq.5.a":
      "Los QR Codes estáticos nunca caducan. Los QR Codes dinámicos permanecen activos mientras tu cuenta esté activa y puedes actualizar a dónde apuntan en cualquier momento.",
  },
  fr: {
    "nav.products": "Produits",
    "nav.types": "Types de QR Code",
    "nav.pricing": "Tarifs",
    "nav.contact": "Contact",
    "nav.resources": "Ressources",
    "nav.language": "Langue",
    "header.signIn": "Se connecter",
    "auth.title": "Bon retour",
    "auth.subtitle":
      "Connectez-vous à votre espace de travail pour gérer les codes enregistrés, les liens dynamiques et les analyses de scan.",
    "auth.signInWith": "Continuer avec Google",
    "auth.busy": "Ouverture de Google…",
    "auth.googleOnly": "Google est actuellement le seul moyen de connexion.",
    "auth.back": "← Retour au générateur gratuit",
    "auth.brand.tagline": "Un espace de travail pour chaque QR Code que vous créez.",
    "auth.brand.dynamic": "Liens dynamiques modifiables après impression.",
    "auth.brand.analytics":
      "Suivi des scans sur chaque code dynamique, en direct dès le premier scan.",
    "auth.brand.templates": "13 modèles studio, couleurs personnalisées, exports PNG et SVG.",
    "auth.brand.secure": "Connexion vérifiée par Google. Aucun mot de passe stocké.",
    "auth.error.notAuthorized":
      "Cet e-mail n'est pas autorisé à accéder au panneau d'administration.",
    "auth.signOut": "Se déconnecter",
    "pricing.title": "Payez uniquement ce que vous utilisez",
    "pricing.subtitle":
      "Chaque plan inclut des QR Codes statiques gratuits illimités. Passez à un supérieur quand vous avez besoin de suivi, de codes modifiables ou d'accès équipe.",
    "pricing.mostPopular": "Le plus populaire",
    "pricing.perMonth": "par mois",
    "pricing.forever": "pour toujours",
    "pricing.startFree": "Commencer gratuitement",
    "pricing.chooseFlex": "Choisir Flex",
    "pricing.choosePro": "Choisir Pro",
    "pricing.freeFeatures": [
      "QR Codes statiques illimités",
      "2 QR Codes dynamiques",
      "Téléchargements PNG et SVG",
      "13 modèles de design",
      "Usage commercial",
    ],
    "pricing.flexFeatures": [
      "Tout ce qui est dans Free",
      "25 QR Codes dynamiques",
      "Analyses de scan et localisations",
      "Upload de logo",
      "Support par e-mail",
    ],
    "pricing.proFeatures": [
      "Tout ce qui est dans Flex",
      "QR Codes dynamiques illimités",
      "5 membres d'équipe",
      "Création en lot et accès API",
      "Domaine court personnalisé",
      "Support prioritaire 24/7",
    ],
    "billing.title": "Facturation",
    "billing.subtitle":
      "Limites du plan, mises à niveau et factures. Les paiements sont traités de manière sécurisée par Cashfree.",
    "billing.current": "Actuel",
    "billing.upgrade": "Mettre à niveau",
    "billing.yourPlan": "Votre plan",
    "billing.checkout": "Paiement en cours…",
    "billing.signInToUpgrade": "Connectez-vous pour mettre à niveau votre plan.",
    "footer.tagline":
      "Outil tout-en-un pour créer des QR Codes gratuits, les modifier et suivre les performances des campagnes. La confiance de plus de 4K utilisateurs dans le monde.",
    "footer.product": "Produit",
    "footer.qrCodes": "QR Codes",
    "footer.company": "Entreprise",
    "footer.legal": "Mentions légales",
    "admin.unauthorized":
      "Cet e-mail n'est pas autorisé à se connecter au panneau d'administration.",
    "admin.signInToContinue": "Connectez-vous avec Google pour continuer.",
    "visitor.today": "visiteurs aujourd'hui",
    "chooser.title": "Choisissez votre langue",
    "chooser.subtitle": "Sélectionnez votre langue préférée pour continuer",
    "home.hero.title": "UnifiedQR — Générateur de QR Code GRATUIT",
    "home.hero.subtitle":
      "Créez des QR Codes gratuits pour les sites web, PDFs, contacts, SMS et plus. Personnalisez les couleurs, téléchargez en PNG ou SVG et suivez chaque scan — tout depuis un seul tableau de bord.",
    "home.social.trusted": "Approuvé par",
    "home.social.users": "Plus de 4K utilisateurs",
    "home.social.onGoogle": "sur Google",
    "home.social.noCreditCard": "Pas de carte de crédit requise",
    "home.social.signupFree": "Inscrivez-vous gratuitement",
    "home.steps.title": "Comment créer un QR Code gratuit en 3 étapes simples",
    "home.steps.1.title": "Choisissez votre type de QR Code",
    "home.steps.1.body":
      "Choisissez votre type de QR Code (statique ou dynamique) en fonction de ce que vous voulez faire : ouvrir une URL, partager un PDF, afficher un menu, partager des coordonnées et plus.",
    "home.steps.2.title": "Personnalisez-le à votre façon",
    "home.steps.2.body":
      "Ajoutez vos coordonnées, changez la couleur, personnalisez votre QR Code, ajoutez un logo et testez-le en temps réel avant de télécharger.",
    "home.steps.3.title": "Téléchargez et partagez",
    "home.steps.3.body":
      "Choisissez le format PNG ou SVG, cliquez sur télécharger et vous êtes prêt à partager partout !",
    "home.steps.cta": "Créez un QR Code gratuit",
    "home.explained.title": "QR Codes expliqués",
    "home.explained.what.title": "Qu'est-ce qu'un QR Code ?",
    "home.explained.what.body":
      "Un QR Code est un code-barres bidimensionnel qui stocke des informations telles que des URLs, des coordonnées, des données de paiement ou du texte dans une grille de carrés noirs et blancs. Il peut être scanné avec l'appareil photo d'un smartphone pour accéder instantanément au contenu stocké sans taper.",
    "home.explained.why.title": "Pourquoi tant de gens utilisent-ils les QR Codes en 2026 ?",
    "home.explained.why.body":
      "Les QR Codes offrent un moyen rapide, sans contact et peu coûteux de lier les expériences hors ligne au contenu numérique. Les entreprises comptent sur eux pour les mises à jour en temps réel et pour réduire le gaspillage d'impression.",
    "home.explained.how.title": "Comment en scanner un ?",
    "home.explained.how.1":
      "Ouvrez l'application appareil photo sur votre smartphone ou tablette. La plupart des appareils modernes scannent les QR Codes automatiquement.",
    "home.explained.how.2":
      "Pointez votre appareil photo vers le QR Code, en vous assurant qu'il est clairement visible dans le cadre.",
    "home.explained.how.3":
      "Restez immobile quelques secondes jusqu'à ce que l'appareil photo reconnaisse le code.",
    "home.explained.how.4":
      "Appuyez sur la notification ou le lien qui apparaît pour ouvrir le site web, la vidéo ou la carte de contact.",
    "home.dashboard.title": "Gérez tous vos QR Codes depuis un seul tableau de bord",
    "home.dashboard.body":
      "Créez, modifiez et suivez des QR Codes illimités depuis un seul tableau de bord facile à utiliser. Mettez à jour les destinations, consultez les analyses et collaborez avec votre équipe.",
    "home.dashboard.cta": "Essayez-le gratuitement",
    "home.features.title":
      "Pourquoi plus de 4 mille utilisateurs font confiance à UnifiedQR pour des campagnes de QR Codes orientées ROI",
    "home.features.track.title": "Suivez chaque scan",
    "home.features.track.body":
      "Découvrez les performances de votre campagne de QR Codes avec des informations en temps réel. Obtenez des données sur les scans, les utilisateurs uniques, les emplacements et les appareils.",
    "home.features.dynamic.title": "QR Codes dynamiques gratuits",
    "home.features.dynamic.body":
      "Créez jusqu'à 2 QR Codes dynamiques gratuitement et mettez à jour leur contenu à tout moment.",
    "home.features.collab.title": "Collaborez avec votre équipe",
    "home.features.collab.body":
      "Invitez jusqu'à 5 membres de l'équipe pour gérer et partager des QR Codes sur un seul tableau de bord.",
    "home.features.support.title": "Support client 24/7",
    "home.features.support.body":
      "Notre équipe est toujours prête à résoudre les problèmes rapidement, par e-mail ou par appel.",
    "home.features.pay.title": "Payez pour ce que vous utilisez",
    "home.features.pay.body":
      "Tarification flexible — payez uniquement pour les fonctionnalités ou les codes supplémentaires dont vous avez besoin.",
    "home.features.cta": "Découvrez les plans Flex",
    "home.types.title": "Quels types de QR Codes pouvez-vous créer gratuitement ?",
    "home.types.cta": "Voir tous les types de QR Code",
    "home.faq.title": "Questions fréquemment posées",
    "home.faq.1.q": "Les QR Codes sont-ils gratuits pour toujours ?",
    "home.faq.1.a":
      "Oui. Chaque QR Code statique que vous créez ici est gratuit, n'a pas de date d'expiration et pas de limite de scan. Vous pouvez le télécharger en PNG ou SVG et l'utiliser commercialement.",
    "home.faq.2.q": "Quelle est la différence entre les QR Codes statiques et dynamiques ?",
    "home.faq.2.a":
      "Un QR Code statique stocke les données directement dans le code, il ne peut donc jamais être modifié. Un QR Code dynamique pointe vers un lien court que vous contrôlez, vous pouvez donc modifier la destination et suivre les scans à tout moment.",
    "home.faq.3.q": "Puis-je ajouter mon logo à un QR Code ?",
    "home.faq.3.a":
      "Oui. Choisissez un modèle, ajustez vos couleurs et ajoutez un logo dans le panneau de personnalisation. Gardez le logo petit pour que les lecteurs puissent toujours lire le code de manière fiable.",
    "home.faq.4.q": "Quel format de fichier dois-je télécharger ?",
    "home.faq.4.a":
      "Utilisez PNG pour les écrans, les publications sociales et les documents. Utilisez SVG pour l'impression, la signalétique grand format ou partout où vous devez redimensionner sans perte de qualité.",
    "home.faq.5.q": "Les QR Codes expirent-ils ?",
    "home.faq.5.a":
      "Les QR Codes statiques n'expirent jamais. Les QR Codes dynamiques restent actifs tant que votre compte est actif, et vous pouvez modifier leur destination à tout moment.",
  },
  de: {
    "nav.products": "Produkte",
    "nav.types": "QR-Code-Typen",
    "nav.pricing": "Preise",
    "nav.contact": "Kontakt",
    "nav.resources": "Ressourcen",
    "nav.language": "Sprache",
    "header.signIn": "Anmelden",
    "auth.title": "Willkommen zurück",
    "auth.subtitle":
      "Melden Sie sich in Ihrem Arbeitsbereich an, um gespeicherte Codes, dynamische Links und Scan-Analysen zu verwalten.",
    "auth.signInWith": "Mit Google fortfahren",
    "auth.busy": "Google wird geöffnet…",
    "auth.googleOnly": "Google ist derzeit die einzige Anmeldemethode.",
    "auth.back": "← Zurück zum kostenlosen Generator",
    "auth.brand.tagline": "Ein Arbeitsbereich für jeden QR-Code, den Sie erstellen.",
    "auth.brand.dynamic": "Dynamische Kurzlinks, die Sie nach dem Drucken ändern können.",
    "auth.brand.analytics": "Scan-Verfolgung bei jedem dynamischen Code, live ab dem ersten Scan.",
    "auth.brand.templates": "13 Studio-Vorlagen, individuelle Farben, PNG- und SVG-Exporte.",
    "auth.brand.secure": "Google-verifizierte Anmeldung. Keine Passwörter gespeichert.",
    "auth.error.notAuthorized":
      "Diese E-Mail ist nicht zum Zugriff auf das Admin-Panel berechtigt.",
    "auth.signOut": "Abmelden",
    "pricing.title": "Bezahlen Sie nur, was Sie nutzen",
    "pricing.subtitle":
      "Jeder Plan beinhaltet unbegrenzte kostenlose statische QR-Codes. Upgraden Sie, wenn Sie Tracking, bearbeitbare Codes oder Teamzugang benötigen.",
    "pricing.mostPopular": "Beliebteste",
    "pricing.perMonth": "pro Monat",
    "pricing.forever": "für immer",
    "pricing.startFree": "Kostenlos starten",
    "pricing.chooseFlex": "Flex wählen",
    "pricing.choosePro": "Pro wählen",
    "pricing.freeFeatures": [
      "Unbegrenzte statische QR-Codes",
      "2 dynamische QR-Codes",
      "PNG- & SVG-Downloads",
      "13 Design-Vorlagen",
      "Kommerzielle Nutzung",
    ],
    "pricing.flexFeatures": [
      "Alles aus Free",
      "25 dynamische QR-Codes",
      "Scan-Analysen & Standorte",
      "Logo-Upload",
      "E-Mail-Support",
    ],
    "pricing.proFeatures": [
      "Alles aus Flex",
      "Unbegrenzte dynamische QR-Codes",
      "5 Teammitglieder",
      "Massenerstellung & API-Zugang",
      "Benutzerdefinierte Kurzdomain",
      "24/7 Prioritäts-Support",
    ],
    "billing.title": "Abrechnung",
    "billing.subtitle":
      "Planlimits, Upgrades und Rechnungen. Zahlungen werden sicher über Cashfree abgewickelt.",
    "billing.current": "Aktuell",
    "billing.upgrade": "Upgrade",
    "billing.yourPlan": "Ihr Plan",
    "billing.checkout": "Checkout wird gestartet…",
    "billing.signInToUpgrade": "Melden Sie sich an, um Ihren Plan upzugraden.",
    "footer.tagline":
      "All-in-One-Werkzeug zum Erstellen kostenloser QR-Codes, Bearbeiten und Verfolgen der Kampagnenleistung. Vertraut von über 4K Nutzern weltweit.",
    "footer.product": "Produkt",
    "footer.qrCodes": "QR-Codes",
    "footer.company": "Unternehmen",
    "footer.legal": "Rechtliches",
    "admin.unauthorized": "Diese E-Mail ist nicht zum Einloggen im Admin-Panel berechtigt.",
    "admin.signInToContinue": "Melden Sie sich mit Google an, um fortzufahren.",
    "visitor.today": "Besucher heute",
    "chooser.title": "Wählen Sie Ihre Sprache",
    "chooser.subtitle": "Wählen Sie Ihre bevorzugte Sprache, um fortzufahren",
    "home.hero.title": "UnifiedQR — Kostenloser QR-Code-Generator",
    "home.hero.subtitle":
      "Erstellen Sie kostenlose QR-Codes für Websites, PDFs, Kontakte, SMS und mehr. Passen Sie Farben an, laden Sie als PNG oder SVG herunter und verfolgen Sie jeden Scan — alles von einem Dashboard aus.",
    "home.social.trusted": "Vertraut von",
    "home.social.users": "4.000+ Nutzern",
    "home.social.onGoogle": "bei Google",
    "home.social.noCreditCard": "Keine Kreditkarte erforderlich",
    "home.social.signupFree": "Kostenlos registrieren",
    "home.steps.title": "So erstellen Sie in 3 einfachen Schritten einen kostenlosen QR-Code",
    "home.steps.1.title": "Wählen Sie Ihren QR-Code-Typ",
    "home.steps.1.body":
      "Wählen Sie Ihren QR-Code-Typ (statisch oder dynamisch) basierend darauf, was Sie damit tun möchten: URL öffnen, PDF teilen, Menü anzeigen, Kontaktdaten teilen und mehr.",
    "home.steps.2.title": "Passen Sie ihn nach Ihren Wünschen an",
    "home.steps.2.body":
      "Fügen Sie Ihre Daten hinzu, ändern Sie die Farbe, gestalten Sie Ihren QR-Code, fügen Sie ein Logo hinzu und testen Sie ihn in Echtzeit, bevor Sie herunterladen.",
    "home.steps.3.title": "Herunterladen und teilen",
    "home.steps.3.body":
      "Wählen Sie PNG- oder SVG-Format, klicken Sie auf Herunterladen und Sie sind bereit, überall zu teilen!",
    "home.steps.cta": "Kostenlosen QR-Code erstellen",
    "home.explained.title": "QR-Codes erklärt",
    "home.explained.what.title": "Was ist ein QR-Code?",
    "home.explained.what.body":
      "Ein QR-Code ist ein zweidimensionaler Barcode, der Informationen wie URLs, Kontaktdaten, Zahlungsdaten oder Text in einem Raster aus schwarzen und weißen Quadraten speichert. Er kann mit der Kamera eines Smartphones gescannt werden, um den gespeicherten Inhalt sofort abzurufen, ohne Tippen.",
    "home.explained.why.title": "Warum nutzen so viele Leute QR-Codes im Jahr 2026?",
    "home.explained.why.body":
      "QR-Codes bieten eine schnelle, berührungsfreie und kostengünstige Möglichkeit, Offline-Erfahrungen mit digitalem Inhalt zu verbinden. Unternehmen verlassen sich auf sie für Echtzeit-Updates und zur Reduzierung von Druckabfällen.",
    "home.explained.how.title": "Wie scanne ich einen?",
    "home.explained.how.1":
      "Öffnen Sie die Kamera-App auf Ihrem Smartphone oder Tablet. Die meisten modernen Geräte scannen QR-Codes automatisch.",
    "home.explained.how.2":
      "Richten Sie Ihre Kamera auf den QR-Code und stellen Sie sicher, dass er im Bildrahmen deutlich sichtbar ist.",
    "home.explained.how.3":
      "Halten Sie die Kamera einige Sekunden ruhig, bis sie den Code erkennt.",
    "home.explained.how.4":
      "Tippen Sie auf die Benachrichtigung oder den Link, der erscheint, um die Website, das Video oder die Visitenkarte zu öffnen.",
    "home.dashboard.title": "Verwalten Sie alle Ihre QR-Codes von einem Dashboard",
    "home.dashboard.body":
      "Erstellen, bearbeiten und verfolgen Sie unbegrenzte QR-Codes von einem einzigen, einfach zu bedienenden Dashboard aus. Aktualisieren Sie Ziele, sehen Sie Analysen ein und arbeiten Sie mit Ihrem Team zusammen.",
    "home.dashboard.cta": "Jetzt kostenlos testen",
    "home.features.title":
      "Warum über 4.000 Nutzer UnifiedQR für ROI-getriebene QR-Code-Kampagnen vertrauen",
    "home.features.track.title": "Jeden Scan verfolgen",
    "home.features.track.body":
      "Erfahren Sie mit Echtzeit-Einblicken, wie Ihre QR-Code-Kampagne abschneidet. Erhalten Sie Daten zu Scans, eindeutigen Nutzern, Standorten und Geräten.",
    "home.features.dynamic.title": "Kostenlose dynamische QR-Codes",
    "home.features.dynamic.body":
      "Erstellen Sie bis zu 2 dynamische QR-Codes kostenlos und aktualisieren Sie deren Inhalte jederzeit.",
    "home.features.collab.title": "Arbeiten Sie mit Ihrem Team zusammen",
    "home.features.collab.body":
      "Laden Sie bis zu 5 Teammitglieder ein, um QR-Codes auf einem Dashboard zu verwalten und zu teilen.",
    "home.features.support.title": "24/7 Kundensupport",
    "home.features.support.body":
      "Unser Team ist immer bereit, Probleme schnell per E-Mail oder Anruf zu beheben.",
    "home.features.pay.title": "Bezahlen Sie nur, was Sie nutzen",
    "home.features.pay.body":
      "Flexible Preise — bezahlen Sie nur für die Funktionen oder zusätzlichen Codes, die Sie benötigen.",
    "home.features.cta": "Flex-Pläne entdecken",
    "home.types.title": "Welche Arten von QR-Codes können Sie kostenlos erstellen?",
    "home.types.cta": "Alle QR-Code-Typen ansehen",
    "home.faq.title": "Häufig gestellte Fragen",
    "home.faq.1.q": "Sind die QR-Codes für immer kostenlos?",
    "home.faq.1.a":
      "Ja. Jeder statische QR-Code, den Sie hier erstellen, ist kostenlos, hat kein Ablaufdatum und keine Scan-Grenze. Sie können ihn als PNG oder SVG herunterladen und kommerziell nutzen.",
    "home.faq.2.q": "Was ist der Unterschied zwischen statischen und dynamischen QR-Codes?",
    "home.faq.2.a":
      "Ein statischer QR-Code speichert die Daten direkt im Code und kann daher nie geändert werden. Ein dynamischer QR-Code verweist auf einen Kurzlink, den Sie kontrollieren, sodass Sie das Ziel jederzeit bearbeiten und Scans verfolgen können.",
    "home.faq.3.q": "Kann ich mein Logo zu einem QR-Code hinzufügen?",
    "home.faq.3.a":
      "Ja. Wählen Sie eine Vorlage, passen Sie Ihre Farben an und fügen Sie ein Logo im Anpassungsbereich hinzu. Halten Sie das Logo klein, damit Scanner den Code weiterhin zuverlässig lesen können.",
    "home.faq.4.q": "Welches Dateiformat sollte ich herunterladen?",
    "home.faq.4.a":
      "Verwenden Sie PNG für Bildschirme, Social-Media-Beiträge und Dokumente. Verwenden Sie SVG für Druck, Großformatbeschilderung oder überall, wo Sie ohne Qualitätsverlust skalieren müssen.",
    "home.faq.5.q": "Verfallen QR-Codes?",
    "home.faq.5.a":
      "Statische QR-Codes verfallen niemals. Dynamische QR-Codes bleiben so lange aktiv, wie Ihr Konto aktiv ist, und Sie können jederzeit aktualisieren, wohin sie verweisen.",
  },
  pt: {
    "nav.products": "Produtos",
    "nav.types": "Tipos de QR Code",
    "nav.pricing": "Preços",
    "nav.contact": "Contato",
    "nav.resources": "Recursos",
    "nav.language": "Idioma",
    "header.signIn": "Entrar",
    "auth.title": "Bem-vindo de volta",
    "auth.subtitle":
      "Faça login no seu espaço de trabalho para gerenciar códigos salvos, links dinâmicos e análises de escaneamento.",
    "auth.signInWith": "Continuar com Google",
    "auth.busy": "Abrindo Google…",
    "auth.googleOnly": "Google é atualmente o único método de login.",
    "auth.back": "← Voltar ao gerador gratuito",
    "auth.brand.tagline": "Um espaço de trabalho para cada QR Code que você criar.",
    "auth.brand.dynamic": "Links dinâmicos que você pode redirecionar após imprimir.",
    "auth.brand.analytics":
      "Rastreamento de escaneamento em cada código dinâmico, ao vivo desde o primeiro escaneamento.",
    "auth.brand.templates": "13 modelos de estúdio, cores personalizadas, exportações PNG e SVG.",
    "auth.brand.secure": "Login verificado pelo Google. Nenhuma senha armazenada.",
    "auth.error.notAuthorized":
      "Este e-mail não está autorizado a acessar o painel de administração.",
    "auth.signOut": "Sair",
    "pricing.title": "Pague apenas pelo que usar",
    "pricing.subtitle":
      "Cada plano inclui QR Codes estáticos gratuitos ilimitados. Atualize quando precisar de rastreamento, códigos editáveis ou acesso de equipe.",
    "pricing.mostPopular": "Mais popular",
    "pricing.perMonth": "por mês",
    "pricing.forever": "para sempre",
    "pricing.startFree": "Começar grátis",
    "pricing.chooseFlex": "Escolher Flex",
    "pricing.choosePro": "Escolher Pro",
    "pricing.freeFeatures": [
      "QR Codes estáticos ilimitados",
      "2 QR Codes dinâmicos",
      "Downloads PNG e SVG",
      "13 modelos de design",
      "Uso comercial",
    ],
    "pricing.flexFeatures": [
      "Tudo do Free",
      "25 QR Codes dinâmicos",
      "Análises de escaneamento e localizações",
      "Upload de logo",
      "Suporte por e-mail",
    ],
    "pricing.proFeatures": [
      "Tudo do Flex",
      "QR Codes dinâmicos ilimitados",
      "5 membros da equipe",
      "Criação em lote e acesso API",
      "Domínio curto personalizado",
      "Suporte prioritário 24/7",
    ],
    "billing.title": "Faturamento",
    "billing.subtitle":
      "Limites do plano, atualizações e faturas. Os pagamentos são processados de forma segura pela Cashfree.",
    "billing.current": "Atual",
    "billing.upgrade": "Atualizar",
    "billing.yourPlan": "Seu plano",
    "billing.checkout": "Iniciando pagamento…",
    "billing.signInToUpgrade": "Faça login para atualizar seu plano.",
    "footer.tagline":
      "Ferramenta tudo-em-um para criar QR Codes gratuitos, editá-los e rastrear o desempenho de campanhas. Confiado por mais de 4K usuários no mundo.",
    "footer.product": "Produto",
    "footer.qrCodes": "QR Codes",
    "footer.company": "Empresa",
    "footer.legal": "Legal",
    "admin.unauthorized":
      "Este e-mail não está autorizado a fazer login no painel de administração.",
    "admin.signInToContinue": "Faça login com Google para continuar.",
    "visitor.today": "visitantes hoje",
    "chooser.title": "Escolha seu idioma",
    "chooser.subtitle": "Selecione seu idioma preferido para continuar",
    "home.hero.title": "UnifiedQR — Gerador de QR Code GRÁTIS",
    "home.hero.subtitle":
      "Crie QR Codes gratuitos para sites, PDFs, contatos, SMS e muito mais. Personalize cores, baixe como PNG ou SVG e acompanhe cada escaneamento — tudo a partir de um único painel.",
    "home.social.trusted": "Confiado por",
    "home.social.users": "Mais de 4 mil usuários",
    "home.social.onGoogle": "no Google",
    "home.social.noCreditCard": "Sem necessidade de cartão de crédito",
    "home.social.signupFree": "Cadastre-se grátis",
    "home.steps.title": "Como criar um QR Code gratuito em 3 passos simples",
    "home.steps.1.title": "Escolha seu tipo de QR Code",
    "home.steps.1.body":
      "Escolha seu tipo de QR Code (estático ou dinâmico) com base no que você quer fazer: abrir uma URL, compartilhar um PDF, exibir um cardápio, compartilhar dados de contato e mais.",
    "home.steps.2.title": "Personalize do seu jeito",
    "home.steps.2.body":
      "Adicione seus dados, mude a cor, estilize seu QR Code, adicione um logo e teste em tempo real antes de baixar.",
    "home.steps.3.title": "Baixe e compartilhe",
    "home.steps.3.body":
      "Escolha o formato PNG ou SVG, clique em baixar e você está pronto para compartilhar em qualquer lugar!",
    "home.steps.cta": "Crie um QR Code gratuito",
    "home.explained.title": "QR Codes explicados",
    "home.explained.what.title": "O que é um QR Code?",
    "home.explained.what.body":
      "Um QR Code é um código de barras bidimensional que armazena informações como URLs, dados de contato, dados de pagamento ou texto em uma grade de quadrados pretos e brancos. Ele pode ser escaneado com a câmera de um smartphone para acessar instantaneamente o conteúdo armazenado sem digitar.",
    "home.explained.why.title": "Por que tantas pessoas usam QR Codes em 2026?",
    "home.explained.why.body":
      "Os QR Codes fornecem uma maneira rápida, sem contato e de baixo custo de conectar experiências offline a conteúdo digital. As empresas dependem deles para atualizações em tempo real e para reduzir o desperdício de impressão.",
    "home.explained.how.title": "Como eu escaneio um?",
    "home.explained.how.1":
      "Abra o aplicativo da câmera no seu smartphone ou tablet. A maioria dos dispositivos modernos escaneia QR Codes automaticamente.",
    "home.explained.how.2":
      "Aponte sua câmera para o QR Code, garantindo que esteja claramente visível dentro da moldura.",
    "home.explained.how.3":
      "Mantenha a câmera estável por alguns segundos até que ela reconheça o código.",
    "home.explained.how.4":
      "Toque na notificação ou link que aparece para abrir o site, vídeo ou cartão de contato.",
    "home.dashboard.title": "Gerencie todos os seus QR Codes a partir de um painel",
    "home.dashboard.body":
      "Crie, edite e acompanhe QR Codes ilimitados a partir de um único painel fácil de usar. Atualize destinos, veja análises e colabore com sua equipe.",
    "home.dashboard.cta": "Experimente grátis agora",
    "home.features.title":
      "Por que mais de 4 mil usuários confiam na UnifiedQR para campanhas de QR Codes orientadas a ROI",
    "home.features.track.title": "Acompanhe cada escaneamento",
    "home.features.track.body":
      "Saiba como sua campanha de QR Codes está performando com insights em tempo real. Obtenha dados sobre escaneamentos, usuários únicos, localizações e dispositivos.",
    "home.features.dynamic.title": "QR Codes dinâmicos grátis",
    "home.features.dynamic.body":
      "Crie até 2 QR Codes dinâmicos grátis e atualize seu conteúdo a qualquer momento.",
    "home.features.collab.title": "Colabore com sua equipe",
    "home.features.collab.body":
      "Convide até 5 membros da equipe para gerenciar e compartilhar QR Codes em um painel.",
    "home.features.support.title": "Suporte ao cliente 24/7",
    "home.features.support.body":
      "Nossa equipe está sempre pronta para resolver problemas rapidamente, por e-mail ou ligação.",
    "home.features.pay.title": "Pague pelo que usar",
    "home.features.pay.body":
      "Preços flexíveis — pague apenas pelos recursos ou códigos extras de que você precisa.",
    "home.features.cta": "Explore os planos Flex",
    "home.types.title": "Quais tipos de QR Codes você pode criar grátis?",
    "home.types.cta": "Ver todos os tipos de QR Code",
    "home.faq.title": "Perguntas frequentes",
    "home.faq.1.q": "Os QR Codes são grátis para sempre?",
    "home.faq.1.a":
      "Sim. Cada QR Code estático que você cria aqui é gratuito, não tem data de expiração e nem limite de escaneamento. Você pode baixar como PNG ou SVG e usar comercialmente.",
    "home.faq.2.q": "Qual é a diferença entre QR Codes estáticos e dinâmicos?",
    "home.faq.2.a":
      "Um QR Code estático armazena os dados diretamente dentro do código, então nunca pode ser alterado. Um QR Code dinâmico aponta para um link curto que você controla, então você pode editar o destino e rastrear escaneamentos a qualquer momento.",
    "home.faq.3.q": "Posso adicionar meu logo a um QR Code?",
    "home.faq.3.a":
      "Sim. Escolha um modelo, ajuste suas cores e adicione um logo no painel de personalização. Mantenha o logo pequeno para que os leitores ainda possam ler o código de forma confiável.",
    "home.faq.4.q": "Qual formato de arquivo devo baixar?",
    "home.faq.4.a":
      "Use PNG para telas, posts sociais e documentos. Use SVG para impressão, sinalização em grande formato ou em qualquer lugar onde você precise redimensionar sem perder qualidade.",
    "home.faq.5.q": "QR Codes expiram?",
    "home.faq.5.a":
      "QR Codes estáticos nunca expiram. QR Codes dinâmicos permanecem ativos enquanto sua conta estiver ativa, e você pode atualizar para onde apontam a qualquer momento.",
  },
  it: {
    "nav.products": "Prodotti",
    "nav.types": "Tipi di QR Code",
    "nav.pricing": "Prezzi",
    "nav.contact": "Contatto",
    "nav.resources": "Risorse",
    "nav.language": "Lingua",
    "header.signIn": "Accedi",
    "auth.title": "Bentornato",
    "auth.subtitle":
      "Accedi al tuo spazio di lavoro per gestire i codici salvati, i link dinamici e le analisi di scansioni.",
    "auth.signInWith": "Continua con Google",
    "auth.busy": "Apertura di Google…",
    "auth.googleOnly": "Google è attualmente l'unico metodo di accesso.",
    "auth.back": "← Torna al generatore gratuito",
    "auth.brand.tagline": "Uno spazio di lavoro per ogni QR Code che crei.",
    "auth.brand.dynamic": "Link dinamici che puoi ridirezionare dopo la stampa.",
    "auth.brand.analytics":
      "Tracciamento scansioni su ogni codice dinamico, in diretta dalla prima scansione.",
    "auth.brand.templates": "13 modello studio, colori personalizzati, esportazioni PNG e SVG.",
    "auth.brand.secure": "Accesso verificato da Google. Nessuna password memorizzata.",
    "auth.error.notAuthorized":
      "Questa email non è autorizzata ad accedere al pannello di amministrazione.",
    "auth.signOut": "Disconnetti",
    "pricing.title": "Paga solo per quello che usi",
    "pricing.subtitle":
      "Ogni piano include QR Code statici gratuiti illimitati. Aggiorna quando hai bisogno di tracciamento, codici modificabili o accesso team.",
    "pricing.mostPopular": "Più popolare",
    "pricing.perMonth": "al mese",
    "pricing.forever": "per sempre",
    "pricing.startFree": "Inizia gratis",
    "pricing.chooseFlex": "Scegli Flex",
    "pricing.choosePro": "Scegli Pro",
    "pricing.freeFeatures": [
      "QR Code statici illimitati",
      "2 QR Code dinamici",
      "Download PNG e SVG",
      "13 modelli di design",
      "Uso commerciale",
    ],
    "pricing.flexFeatures": [
      "Tutto di Free",
      "25 QR Code dinamici",
      "Analisi scansioni e posizioni",
      "Caricamento logo",
      "Supporto email",
    ],
    "pricing.proFeatures": [
      "Tutto di Flex",
      "QR Code dinamici illimitati",
      "5 membri del team",
      "Creazione bulk e accesso API",
      "Dominio breve personalizzato",
      "Supporto prioritario 24/7",
    ],
    "billing.title": "Fatturazione",
    "billing.subtitle":
      "Limiti del piano, aggiornamenti e fatture. I pagamenti sono elaborati in modo sicuro da Cashfree.",
    "billing.current": "Attuale",
    "billing.upgrade": "Aggiorna",
    "billing.yourPlan": "Il tuo piano",
    "billing.checkout": "Avvio del checkout…",
    "billing.signInToUpgrade": "Accedi per aggiornare il tuo piano.",
    "footer.tagline":
      "Strumento tutto-in-uno per creare QR Code gratuiti, modificarli e monitorare le prestazioni delle campagne. Fidato da oltre 4K utenti in tutto il mondo.",
    "footer.product": "Prodotto",
    "footer.qrCodes": "QR Code",
    "footer.company": "Azienda",
    "footer.legal": "Legale",
    "admin.unauthorized":
      "Questa email non è autorizzata ad accedere al pannello di amministrazione.",
    "admin.signInToContinue": "Accedi con Google per continuare.",
    "visitor.today": "visitatori oggi",
    "chooser.title": "Scegli la tua lingua",
    "chooser.subtitle": "Seleziona la tua lingua preferita per continuare",
    "home.hero.title": "UnifiedQR — Generatore di QR Code GRATUITO",
    "home.hero.subtitle":
      "Crea QR Code gratuiti per siti web, PDF, contatti, SMS e altro. Personalizza i colori, scarica come PNG o SVG e traccia ogni scansione — tutto da un unico pannello.",
    "home.social.trusted": "Fidato da",
    "home.social.users": "Oltre 4 mila utenti",
    "home.social.onGoogle": "su Google",
    "home.social.noCreditCard": "Nessuna carta di credito richiesta",
    "home.social.signupFree": "Registrati gratis",
    "home.steps.title": "Come creare un QR Code gratuito in 3 semplici passaggi",
    "home.steps.1.title": "Scegli il tuo tipo di QR Code",
    "home.steps.1.body":
      "Scegli il tuo tipo di QR Code (statico o dinamico) in base a ciò che vuoi fare: aprire un URL, condividere un PDF, visualizzare un menu, condividere i dati di contatto e altro.",
    "home.steps.2.title": "Personalizzalo a tuo modo",
    "home.steps.2.body":
      "Aggiungi i tuoi dati, cambia il colore, personalizza il tuo QR Code, aggiungi un logo e mettilo alla prova in tempo reale prima di scaricare.",
    "home.steps.3.title": "Scarica e condividi",
    "home.steps.3.body":
      "Scegli il formato PNG o SVG, premi scarica e sei pronto per condividere ovunque!",
    "home.steps.cta": "Crea un QR Code gratuito",
    "home.explained.title": "QR Code spiegati",
    "home.explained.what.title": "Cos'è un QR Code?",
    "home.explained.what.body":
      "Un QR Code è un codice a barre bidimensionale che memorizza informazioni come URL, dati di contatto, dati di pagamento o testo in una griglia di quadrati neri e bianchi. Può essere scansionato con la fotocamera di uno smartphone per accedere istantaneamente al contenuto memorizzato senza digitare.",
    "home.explained.why.title": "Perché così tante persone usano i QR Code nel 2026?",
    "home.explained.why.body":
      "I QR Code forniscono un modo rapido, senza contatto e a basso costo per collegare le esperienze offline al contenuto digitale. Le aziende si affidano ad essi per aggiornamenti in tempo reale e per ridurre lo spreco di stampa.",
    "home.explained.how.title": "Come ne scansiono uno?",
    "home.explained.how.1":
      "Apri l'app fotocamera sul tuo smartphone o tablet. La maggior parte dei dispositivi moderni scansiona i QR Code automaticamente.",
    "home.explained.how.2":
      "Punta la fotocamera verso il QR Code, assicurandoti che sia chiaramente visibile all'interno dell'inquadratura.",
    "home.explained.how.3":
      "Tieni la fotocamera ferma per qualche secondo fino a quando non riconosce il codice.",
    "home.explained.how.4":
      "Tocca la notifica o il link che appare per aprire il sito web, il video o il biglietto da visita.",
    "home.dashboard.title": "Gestisci tutti i tuoi QR Code da un unico pannello",
    "home.dashboard.body":
      "Crea, modifica e traccia QR Code illimitati da un unico pannello facile da usare. Aggiorna le destinazioni, visualizza le analisi e collabora con il tuo team.",
    "home.dashboard.cta": "Provalo gratis ora",
    "home.features.title":
      "Perché oltre 4 mila utenti si fidano di UnifiedQR per le campagne QR Code orientate al ROI",
    "home.features.track.title": "Traccia ogni scansione",
    "home.features.track.body":
      "Scopri come sta performando la tua campagna QR Code con analisi in tempo reale. Ottieni dati su scansioni, utenti unici, posizioni e dispositivi.",
    "home.features.dynamic.title": "QR Code dinamici gratuiti",
    "home.features.dynamic.body":
      "Crea fino a 2 QR Code dinamici gratuitamente e aggiorna il loro contenuto in qualsiasi momento.",
    "home.features.collab.title": "Collabora con il tuo team",
    "home.features.collab.body":
      "Invita fino a 5 membri del team per gestire e condividere QR Code su un unico pannello.",
    "home.features.support.title": "Supporto clienti 24/7",
    "home.features.support.body":
      "Il nostro team è sempre pronto a risolvere i problemi rapidamente, via email o telefonata.",
    "home.features.pay.title": "Paga per ciò che usi",
    "home.features.pay.body":
      "Prezzi flessibili — paga solo per le funzionalità o i codici extra di cui hai bisogno.",
    "home.features.cta": "Scopri i piani Flex",
    "home.types.title": "Che tipo di QR Code puoi creare gratuitamente?",
    "home.types.cta": "Vedi tutti i tipi di QR Code",
    "home.faq.title": "Domande frequenti",
    "home.faq.1.q": "I QR Code sono gratis per sempre?",
    "home.faq.1.a":
      "Sì. Ogni QR Code statico che crei qui è gratuito, non ha data di scadenza e nessun limite di scansioni. Puoi scaricarlo come PNG o SVG e usarlo commercialmente.",
    "home.faq.2.q": "Qual è la differenza tra QR Code statici e dinamici?",
    "home.faq.2.a":
      "Un QR Code statico memorizza i dati direttamente nel codice, quindi non può mai essere cambiato. Un QR Code dinamico punta a un link corto che controlli tu, quindi puoi modificare la destinazione e tracciare le scansioni in qualsiasi momento.",
    "home.faq.3.q": "Posso aggiungere il mio logo a un QR Code?",
    "home.faq.3.a":
      "Sì. Scegli un modello, regola i tuoi colori e aggiungi un logo nel pannello di personalizzazione. Mantieni il logo piccolo in modo che i lettori possano ancora leggere il codice in modo affidabile.",
    "home.faq.4.q": "Quale formato file dovrei scaricare?",
    "home.faq.4.a":
      "Usa PNG per schermi, post social e documenti. Usa SVG per la stampa, la segnaletica di grande formato o ovunque tu debba ridimensionare senza perdere qualità.",
    "home.faq.5.q": "I QR Code scadono?",
    "home.faq.5.a":
      "I QR Code statici non scadono mai. I QR Code dinamici rimangono attivi finché il tuo account è attivo e puoi aggiornare dove puntano in qualsiasi momento.",
  },
  nl: {
    "nav.products": "Producten",
    "nav.types": "QR Code-typen",
    "nav.pricing": "Prijzen",
    "nav.contact": "Contact",
    "nav.resources": "Hulpbronnen",
    "nav.language": "Taal",
    "header.signIn": "Inloggen",
    "auth.title": "Welkom terug",
    "auth.subtitle":
      "Log in op je werkruimte om opgeslagen codes, dynamische links en scan-analyses te beheren.",
    "auth.signInWith": "Doorgaan met Google",
    "auth.busy": "Google wordt geopend…",
    "auth.googleOnly": "Google is momenteel de enige inlogmethode.",
    "auth.back": "← Terug naar de gratis generator",
    "auth.brand.tagline": "Een werkruimte voor elke QR Code die je maakt.",
    "auth.brand.dynamic": "Dynamische korte links die je na het printen kunt wijzigen.",
    "auth.brand.analytics": "Scan-tracking op elke dynamische code, live vanaf de eerste scan.",
    "auth.brand.templates": "13 studio-sjablonen, aangepaste kleuren, PNG- en SVG-export.",
    "auth.brand.secure": "Google-geverifieerde aanmelding. Geen wachtwoorden opgeslagen.",
    "auth.error.notAuthorized":
      "Dit e-mailadres is niet geautoriseerd om het adminpaneel te openen.",
    "auth.signOut": "Uitloggen",
    "pricing.title": "Betaal alleen voor wat je gebruikt",
    "pricing.subtitle":
      "Elk plan bevat onbeperkte gratis statische QR Codes. Upgrade wanneer je tracking, bewerkbare codes of teamtoegang nodig hebt.",
    "pricing.mostPopular": "Meest populair",
    "pricing.perMonth": "per maand",
    "pricing.forever": "voor altijd",
    "pricing.startFree": "Gratis beginnen",
    "pricing.chooseFlex": "Flex kiezen",
    "pricing.choosePro": "Pro kiezen",
    "pricing.freeFeatures": [
      "Onbeperkte statische QR Codes",
      "2 dynamische QR Codes",
      "PNG- en SVG-downloads",
      "13 designsjablonen",
      "Commercieel gebruik",
    ],
    "pricing.flexFeatures": [
      "Alles van Free",
      "25 dynamische QR Codes",
      "Scan-analyses en locaties",
      "Logo uploaden",
      "E-mailsupport",
    ],
    "pricing.proFeatures": [
      "Alles van Flex",
      "Onbeperkte dynamische QR Codes",
      "5 teamleden",
      "Bulkcreatie en API-toegang",
      "Aangepast kort domein",
      "24/7 prioriteitsondersteuning",
    ],
    "billing.title": "Facturering",
    "billing.subtitle":
      "Planlimieten, upgrades en facturen. Betalingen worden veilig verwerkt door Cashfree.",
    "billing.current": "Huidig",
    "billing.upgrade": "Upgrade",
    "billing.yourPlan": "Jouw plan",
    "billing.checkout": "Checkout starten…",
    "billing.signInToUpgrade": "Log in om je plan te upgraden.",
    "footer.tagline":
      "Alles-in-één tool om gratis QR Codes te maken, te bewerken en campagneprestaties bij te houden. Vertrouwd door 4K+ gebruikers wereldwijd.",
    "footer.product": "Product",
    "footer.qrCodes": "QR Codes",
    "footer.company": "Bedrijf",
    "footer.legal": "Juridisch",
    "admin.unauthorized":
      "Dit e-mailadres is niet geautoriseerd om in te loggen op het adminpaneel.",
    "admin.signInToContinue": "Log in met Google om door te gaan.",
    "visitor.today": "bezoekers vandaag",
    "chooser.title": "Kies je taal",
    "chooser.subtitle": "Selecteer je voorkeurstaal om door te gaan",
    "home.hero.title": "UnifiedQR — GRATIS QR Code-generator",
    "home.hero.subtitle":
      "Maak gratis QR Codes voor websites, PDF's, contacten, SMS en meer. Pas kleuren aan, download als PNG of SVG en volg elke scan — alles vanuit één dashboard.",
    "home.social.trusted": "Vertrouwd door",
    "home.social.users": "4K+ gebruikers",
    "home.social.onGoogle": "op Google",
    "home.social.noCreditCard": "Geen creditcard vereist",
    "home.social.signupFree": "Meld je gratis aan",
    "home.steps.title": "Hoe maak je in 3 eenvoudige stappen een gratis QR Code",
    "home.steps.1.title": "Kies je QR Code-type",
    "home.steps.1.body":
      "Kies je QR Code-type (static of dynamisch) op basis van wat je wilt doen: een URL openen, een PDF delen, een menu weergeven, contactgegevens delen en meer.",
    "home.steps.2.title": "Pas het aan op jouw manier",
    "home.steps.2.body":
      "Voeg je gegevens toe, verander de kleur, styliseer je QR Code, voeg een logo toe en test hem in realtime voordat je downloadt.",
    "home.steps.3.title": "Download en deel",
    "home.steps.3.body":
      "Kies PNG- of SVG-formaat, druk op download en je bent klaar om overal te delen!",
    "home.steps.cta": "Maak een gratis QR Code",
    "home.explained.title": "QR Codes uitgelegd",
    "home.explained.what.title": "Wat is een QR Code?",
    "home.explained.what.body":
      "Een QR Code is een tweedimensionale streepjescode die informatie zoals URL's, contactgegevens, betalingsgegevens of tekst opslaat in een raster van zwarte en witte vierkanten. Het kan worden gescand met de camera van een smartphone om direct toegang te krijgen tot de opgeslagen inhoud zonder te typen.",
    "home.explained.why.title": "Waarom gebruiken zoveel mensen QR Codes in 2026?",
    "home.explained.why.body":
      "QR Codes bieden een snelle, contactloze en goedkope manier om offline ervaringen te koppelen aan digitale inhoud. Bedrijven vertrouwen erop voor real-time updates en om drukverspilling te verminderen.",
    "home.explained.how.title": "Hoe scan ik er een?",
    "home.explained.how.1":
      "Open de camera-app op je smartphone of tablet. De meeste moderne apparaten scannen QR Codes automatisch.",
    "home.explained.how.2":
      "Richt je camera op de QR Code en zorg ervoor dat deze duidelijk zichtbaar is in het kader.",
    "home.explained.how.3": "Houd de camera een paar seconden stil totdat deze de code herkent.",
    "home.explained.how.4":
      "Tik op de melding of link die verschijnt om de website, video of contactkaart te openen.",
    "home.dashboard.title": "Beheer al je QR Codes vanuit één dashboard",
    "home.dashboard.body":
      "Maak, bewerk en volg onbeperkte QR Codes vanuit één gebruiksvriendelijk dashboard. Update bestemmingen, bekijk analyses en werk samen met je team.",
    "home.dashboard.cta": "Probeer het nu gratis",
    "home.features.title":
      "Waarom meer dan 4 duizend gebruikers UnifiedQR vertrouwen voor ROI-gestuurde QR Code-campagnes",
    "home.features.track.title": "Volg elke scan",
    "home.features.track.body":
      "Ontdek hoe je QR Code-campagne presteert met realtime inzichten. Krijg gegevens over scans, unieke gebruikers, locaties en apparaten.",
    "home.features.dynamic.title": "Gratis dynamische QR Codes",
    "home.features.dynamic.body":
      "Maak tot 2 dynamische QR Codes gratis en update hun inhoud op elk moment.",
    "home.features.collab.title": "Werk samen met je team",
    "home.features.collab.body":
      "Nodig tot 5 teamleden uit om QR Codes te beheren en te delen op één dashboard.",
    "home.features.support.title": "24/7 klantenservice",
    "home.features.support.body":
      "Ons team staat altijd klaar om problemen snel op te lossen, via e-mail of telefoon.",
    "home.features.pay.title": "Betaal alleen voor wat je gebruikt",
    "home.features.pay.body":
      "Flexibele prijzen — betaal alleen voor de functies of extra codes die je nodig hebt.",
    "home.features.cta": "Ontdek Flex-plannen",
    "home.types.title": "Welke soorten QR Codes kun je gratis maken?",
    "home.types.cta": "Bekijk alle QR Code-typen",
    "home.faq.title": "Veelgestelde vragen",
    "home.faq.1.q": "Zijn de QR Codes gratis voor altijd?",
    "home.faq.1.a":
      "Ja. Elke statische QR Code die je hier maakt is gratis, heeft geen vervaldatum en geen scanlimiet. Je kunt hem downloaden als PNG of SVG en commercieel gebruiken.",
    "home.faq.2.q": "Wat is het verschil tussen statische en dynamische QR Codes?",
    "home.faq.2.a":
      "Een statische QR Code slaat de gegevens direct op in de code, dus deze kan nooit worden gewijzigd. Een dynamische QR Code verwijst naar een korte link die je beheert, dus je kunt de bestemming op elk moment bewerken en scannen bijhouden.",
    "home.faq.3.q": "Kan ik mijn logo aan een QR Code toevoegen?",
    "home.faq.3.a":
      "Ja. Kies een sjabloon, pas je kleuren aan en voeg een logo toe in het aanpassingspaneel. Houd het logo klein zodat scanners de code nog steeds betrouwbaar kunnen lezen.",
    "home.faq.4.q": "Welk bestandsformaat moet ik downloaden?",
    "home.faq.4.a":
      "Gebruik PNG voor schermen, social media-berichten en documenten. Gebruik SVG voor print, grootformaat bewegwijzering of overal waar je moet verkleinen zonder kwaliteitsverlies.",
    "home.faq.5.q": "Verlopen QR Codes?",
    "home.faq.5.a":
      "Statische QR Codes verlopen nooit. Dynamische QR Codes blijven actief zolang je account actief is, en je kunt op elk moment bijwerken waar ze naartoe verwijzen.",
  },
  pl: {
    "nav.products": "Produkty",
    "nav.types": "Typy QR Code",
    "nav.pricing": "Cennik",
    "nav.contact": "Kontakt",
    "nav.resources": "Zasoby",
    "nav.language": "Język",
    "header.signIn": "Zaloguj się",
    "auth.title": "Witaj z powrotem",
    "auth.subtitle":
      "Zaloguj się do swojego espacio de trabajo, aby zarządzać zapisanymi kodami, linkami dynamicznymi i analizami skanów.",
    "auth.signInWith": "Kontynuuj z Google",
    "auth.busy": "Otwieranie Google…",
    "auth.googleOnly": "Google jest obecnie jedyną metodą logowania.",
    "auth.back": "← Powrót do darmowego generatora",
    "auth.brand.tagline": "Jedno espacio de trabajo dla każdego QR Code, który stworzysz.",
    "auth.brand.dynamic": "Dynamiczne krótkie linki, które możesz zmienić po wydrukowaniu.",
    "auth.brand.analytics":
      "Śledzenie skanów na każdym kodzie dynamicznym, na żywo od pierwszego skanu.",
    "auth.brand.templates": "13 szablonów studyjnych, niestandardowe kolory, eksport PNG i SVG.",
    "auth.brand.secure": "Logowanie weryfikowane przez Google. Żadne hasła nie są przechowywane.",
    "auth.error.notAuthorized":
      "Ten e-mail nie jest upoważniony do dostępu do panelu administracyjnego.",
    "auth.signOut": "Wyloguj się",
    "pricing.title": "Płać tylko za to, czego używasz",
    "pricing.subtitle":
      "Każdy plan zawiera nieograniczone darmowe statyczne QR Codes. Ulepsz, gdy potrzebujesz śledzenia, edytowalnych kodów lub dostępu zespołu.",
    "pricing.mostPopular": "Najpopularniejszy",
    "pricing.perMonth": "miesięcznie",
    "pricing.forever": "na zawsze",
    "pricing.startFree": "Zacznij za darmo",
    "pricing.chooseFlex": "Wybierz Flex",
    "pricing.choosePro": "Wybierz Pro",
    "pricing.freeFeatures": [
      "Nieograniczone statyczne QR Codes",
      "2 dynamiczne QR Codes",
      "Pobieranie PNG i SVG",
      "13 szablonów graficznych",
      "Użytek komercyjny",
    ],
    "pricing.flexFeatures": [
      "Wszystko z Free",
      "25 dynamicznych QR Codes",
      "Analizy skanów i lokalizacje",
      "Przesyłanie logo",
      "Wsparcie e-mail",
    ],
    "pricing.proFeatures": [
      "Wszystko z Flex",
      "Nieograniczone dynamiczne QR Codes",
      "5 członków zespołu",
      "Tworzenie zbiorcze i dostęp API",
      "Niestandardowa krótka domena",
      "Priorytetowe wsparcie 24/7",
    ],
    "billing.title": "Rozliczenia",
    "billing.subtitle":
      "Limity planu, ulepszenia i faktury. Płatności są bezpiecznie przetwarzane przez Cashfree.",
    "billing.current": "Aktualny",
    "billing.upgrade": "Ulepsz",
    "billing.yourPlan": "Twój plan",
    "billing.checkout": "Rozpoczynanie płatności…",
    "billing.signInToUpgrade": "Zaloguj się, aby ulepszyć swój plan.",
    "footer.tagline":
      "Wszechstronne narzędzie do tworzenia darmowych QR Codes, ich edycji i śledzenia wyników kampanii. Zaufanie ponad 4K użytkowników na całym świecie.",
    "footer.product": "Produkt",
    "footer.qrCodes": "QR Codes",
    "footer.company": "Firma",
    "footer.legal": "Prawne",
    "admin.unauthorized": "Ten e-mail nie jest upoważniony do logowania w panelu administracyjnym.",
    "admin.signInToContinue": "Zaloguj się za pomocą Google, aby kontynuować.",
    "visitor.today": "odwiedzających dziś",
    "chooser.title": "Wybierz swój język",
    "chooser.subtitle": "Wybierz preferowany język, aby kontynuować",
    "home.hero.title": "UnifiedQR — DARMOWY generator QR Code",
    "home.hero.subtitle":
      "Twórz darmowe QR Code dla stron internetowych, PDF, kontaktów, SMS i nie tylko. Dostosuj kolory, pobierz jako PNG lub SVG i śledź każde skanowanie — wszystko z jednego panelu.",
    "home.social.trusted": "Zaufali nam",
    "home.social.users": "Ponad 4 tys. użytkowników",
    "home.social.onGoogle": "w Google",
    "home.social.noCreditCard": "Karta kredytowa nie jest wymagana",
    "home.social.signupFree": "Zarejestruj się za darmo",
    "home.steps.title": "Jak stworzyć darmowy QR Code w 3 prostych krokach",
    "home.steps.1.title": "Wybierz typ QR Code",
    "home.steps.1.body":
      "Wybierz typ QR Code (statyczny lub dynamiczny) w zależności od tego, co chcesz zrobić: otworzyć URL, udostępnić PDF, wyświetlić menu, udostępnić dane kontaktowe i więcej.",
    "home.steps.2.title": "Dostosuj po swojemu",
    "home.steps.2.body":
      "Dodaj swoje dane, zmień kolor, spersonalizuj swój QR Code, dodaj logo i przetestuj go w czasie rzeczywistym przed pobraniem.",
    "home.steps.3.title": "Pobierz i udostępnij",
    "home.steps.3.body":
      "Wybierz format PNG lub SVG, kliknij pobieranie i jesteś gotowy do udostępniania wszędzie!",
    "home.steps.cta": "Stwórz darmowy QR Code",
    "home.explained.title": "QR Code wyjaśnione",
    "home.explained.what.title": "Czym jest QR Code?",
    "home.explained.what.body":
      "QR Code to kod kreskowy dwuwymiarowy, który przechowuje informacje takie jak adresy URL, dane kontaktowe, dane płatności lub tekst w siatce czarnych i białych kwadratów. Może być skanowany aparatem smartfona, aby natychmiast uzyskać dostęp do przechowywanej treści bez wpisywania.",
    "home.explained.why.title": "Dlaczego tak wiele osób korzysta z QR Code w 2026?",
    "home.explained.why.body":
      "QR Code oferują szybki, bezdotykowy i niskokosztowy sposób łączenia doświadczeń offline z treścią cyfrową. Firmy polegają na nich w przypadku aktualizacji w czasie rzeczywistym i redukcji odpadów drukowanych.",
    "home.explained.how.title": "Jak zeskanować QR Code?",
    "home.explained.how.1":
      "Otwórz aplikację aparatu na smartfonie lub tablecie. Większość nowoczesnych urządzeń skanuje QR Code automatycznie.",
    "home.explained.how.2":
      "Skieruj aparat na QR Code, upewniając się, że jest wyraźnie widoczny w kadrze.",
    "home.explained.how.3": "Trzymaj aparat przez kilka sekund, aż rozpozna kod.",
    "home.explained.how.4":
      "Dotknij powiadomienia lub linku, który się pojawi, aby otworzyć stronę internetową, wideo lub wizytówkę.",
    "home.dashboard.title": "Zarządzaj wszystkimi QR Code z jednego panelu",
    "home.dashboard.body":
      "Twórz, edytuj i śledź nieograniczoną liczbę QR Code z jednego łatwego w obsłudze panelu. Aktualizuj destynacje, przeglądaj analizy i współpracuj ze swoim zespołem.",
    "home.dashboard.cta": "Wypróbuj za darmo teraz",
    "home.features.title":
      "Dlaczego ponad 4 tysiące użytkowników ufa UnifiedQR w zakresie kampanii QR Code ukierunkowanych na ROI",
    "home.features.track.title": "Śledź każde skanowanie",
    "home.features.track.body":
      "Poznaj wyniki swojej kampanii QR Code dzięki informacjom w czasie rzeczywistym. Uzyskaj dane o skanowaniach, unikalnych użytkownikach, lokalizacjach i urządzeniach.",
    "home.features.dynamic.title": "Darmowe dynamiczne QR Code",
    "home.features.dynamic.body":
      "Stwórz do 2 darmowych dynamicznych QR Code i aktualizuj ich zawartość w dowolnym momencie.",
    "home.features.collab.title": "Współpracuj ze swoim zespołem",
    "home.features.collab.body":
      "Zaproś do 5 członków zespołu do zarządzania i udostępniania QR Code na jednym panelu.",
    "home.features.support.title": "Obsługa klienta 24/7",
    "home.features.support.body":
      "Nasz zespół jest zawsze gotowy do szybkiego rozwiązywania problemów, przez e-mail lub telefon.",
    "home.features.pay.title": "Płać za to, czego używasz",
    "home.features.pay.body":
      "Elastyczne ceny — płać tylko za funkcje lub dodatkowe kody, których potrzebujesz.",
    "home.features.cta": "Poznaj plany Flex",
    "home.types.title": "Jakie typy QR Code możesz stworzyć za darmo?",
    "home.types.cta": "Zobacz wszystkie typy QR Code",
    "home.faq.title": "Często zadawane pytania",
    "home.faq.1.q": "Czy QR Code są darmowe na zawsze?",
    "home.faq.1.a":
      "Tak. Każdy statyczny QR Code, który tutaj stworzysz, jest darmowy, nie ma daty ważności ani limitu skanowań. Możesz go pobrać jako PNG lub SVG i używać komercyjnie.",
    "home.faq.2.q": "Jaka jest różnica między statycznymi a dynamicznymi QR Code?",
    "home.faq.2.a":
      "Statyczny QR Code przechowuje dane bezpośrednio w kodzie, więc nigdy nie może być zmieniony. Dynamiczny QR Code wskazuje na krótki link, który kontrolujesz, więc możesz edytować destynację i śledzić skanowania w dowolnym momencie.",
    "home.faq.3.q": "Czy mogę dodać swoje logo do QR Code?",
    "home.faq.3.a":
      "Tak. Wybierz szablon, dostosuj kolory i dodaj logo w panelu personalizacji. Trzymaj logo małe, aby skanery mogły nadal niezawodnie odczytywać kod.",
    "home.faq.4.q": "Jaki format pliku powinienem pobrać?",
    "home.faq.4.a":
      "Używaj PNG dla ekranów, postów w mediach społecznościowych i dokumentów. Używaj SVG do druku, wielkoformatowych oznaczeń lub wszędzie tam, gdzie musisz zmieniać rozmiar bez utraty jakości.",
    "home.faq.5.q": "Czy QR Code wygasają?",
    "home.faq.5.a":
      "Statyczne QR Code nigdy nie wygasają. Dynamiczne QR Code pozostają aktywne, dopóki Twoje konto jest aktywne, i możesz w dowolnym momencie zaktualizować, gdzie wskazują.",
  },
  sv: {
    "nav.products": "Produkter",
    "nav.types": "QR Code-typer",
    "nav.pricing": "Priser",
    "nav.contact": "Kontakt",
    "nav.resources": "Resurser",
    "nav.language": "Språk",
    "header.signIn": "Logga in",
    "auth.title": "Välkommen tillbaka",
    "auth.subtitle":
      "Logga in på din arbetsyta för att hantera sparade koder, dynamiska länkar och analys av skanningar.",
    "auth.signInWith": "Fortsätt med Google",
    "auth.busy": "Öppnar Google…",
    "auth.googleOnly": "Google är för närvarande den enda inloggningsmetoden.",
    "auth.back": "← Tillbaka till gratisgeneratorn",
    "auth.brand.tagline": "En arbetsyta för varje QR Code du skapar.",
    "auth.brand.dynamic": "Dynamiska korta länkar som du kan ändra efter utskrift.",
    "auth.brand.analytics":
      "Spårning av skanningar på varje dynamisk kod, live från första skanningen.",
    "auth.brand.templates": "13 studio-mallar, anpassade färger, PNG- och SVG-export.",
    "auth.brand.secure": "Google-verifierad inloggning. Inga lösenord lagrade.",
    "auth.error.notAuthorized": "Den här e-posten är inte behörig att komma åt adminpanelen.",
    "auth.signOut": "Logga ut",
    "pricing.title": "Betala bara för det du använder",
    "pricing.subtitle":
      "Varje plan inkluderar obegränsade gratis statiska QR Codes. Uppgradera när du behöver spårning, redigerbara koder eller teamåtkomst.",
    "pricing.mostPopular": "Mest populär",
    "pricing.perMonth": "per månad",
    "pricing.forever": "för alltid",
    "pricing.startFree": "Börja gratis",
    "pricing.chooseFlex": "Välj Flex",
    "pricing.choosePro": "Välj Pro",
    "pricing.freeFeatures": [
      "Obegränsade statiska QR Codes",
      "2 dynamiska QR Codes",
      "PNG- och SVG-nedladdningar",
      "13 designmallar",
      "Kommerciell användning",
    ],
    "pricing.flexFeatures": [
      "Allt i Free",
      "25 dynamiska QR Codes",
      "Skanningsanalys och platser",
      "Logouppladdning",
      "E-postsupport",
    ],
    "pricing.proFeatures": [
      "Allt i Flex",
      "Obegränsade dynamiska QR Codes",
      "5 teammedlemmar",
      "Massuppskapning och API-åtkomst",
      "Anpassad kort domän",
      "24/7 prioritetssupport",
    ],
    "billing.title": "Fakturering",
    "billing.subtitle":
      "Planbegränsningar, uppgraderingar och fakturor. Betalningar behandlas säkert av Cashfree.",
    "billing.current": "Nuvarande",
    "billing.upgrade": "Uppgradera",
    "billing.yourPlan": "Din plan",
    "billing.checkout": "Startar kassan…",
    "billing.signInToUpgrade": "Logga in för att uppgradera din plan.",
    "footer.tagline":
      "Allt-i-ett-verktyg för att skapa gratis QR Codes, redigera dem och spåra kampanjprestanda. Betrodd av över 4K användare världen över.",
    "footer.product": "Produkt",
    "footer.qrCodes": "QR Codes",
    "footer.company": "Företag",
    "footer.legal": "Juridiskt",
    "admin.unauthorized": "Den här e-posten är inte behörig att logga in på adminpanelen.",
    "admin.signInToContinue": "Logga in med Google för att fortsätta.",
    "visitor.today": "besökare idag",
    "chooser.title": "Välj ditt språk",
    "chooser.subtitle": "Välj ditt önskade språk för att fortsätta",
    "home.hero.title": "UnifiedQR — GRATIS QR Code-generator",
    "home.hero.subtitle":
      "Skapa gratis QR Codes för webbplatser, PDF:er, kontakter, SMS och mer. Anpassa färger, ladda ner som PNG eller SVG och spåra varje skanning — allt från en enda panel.",
    "home.social.trusted": "Betrodd av",
    "home.social.users": "4 000+ användare",
    "home.social.onGoogle": "på Google",
    "home.social.noCreditCard": "Inget kreditkort krävs",
    "home.social.signupFree": "Registrera dig gratis",
    "home.steps.title": "Hur du skapar en gratis QR Code i 3 enkla steg",
    "home.steps.1.title": "Välj din QR Code-typ",
    "home.steps.1.body":
      "Välj din QR Code-typ (statisk eller dynamisk) baserat på vad du vill göra: öppna en URL, dela en PDF, visa en meny, dela kontaktuppgifter och mer.",
    "home.steps.2.title": "Anpassa den på ditt sätt",
    "home.steps.2.body":
      "Lägg till dina uppgifter, ändra färgen, formge din QR Code, lägg till en logotyp och testa den i realtid innan du laddar ner.",
    "home.steps.3.title": "Ladda ner och dela",
    "home.steps.3.body":
      "Välj PNG- eller SVG-format, klicka på ladda ner och du är redo att dela var som helst!",
    "home.steps.cta": "Skapa en gratis QR Code",
    "home.explained.title": "QR Codes förklarade",
    "home.explained.what.title": "Vad är en QR Code?",
    "home.explained.what.body":
      "En QR Code är en tvådimensionell streckkod som lagrar information som URL:er, kontaktuppgifter, betalningsdata eller text i ett rutnät av svarta och vita fyrkanter. Den kan skannas med en smartphones kamera för att omedelbart komma åt det lagrade innehållet utan att skriva.",
    "home.explained.why.title": "Varför använder så många människor QR Codes 2026?",
    "home.explained.why.body":
      "QR Codes erbjuder ett snabbt, kontaktlöst och kostnadseffektivt sätt att koppla offlineupplevelser till digitalt innehåll. Företag förlitar sig på dem för realtidsuppdateringar och för att minska utskriftsavfall.",
    "home.explained.how.title": "Hur skannar jag en?",
    "home.explained.how.1":
      "Öppna kameraappen på din smartphone eller platta. De flesta moderna enheter skannar QR Codes automatiskt.",
    "home.explained.how.2":
      "Rikta din kamera mot QR Code och se till att den är tydligt synlig i ramen.",
    "home.explained.how.3": "Håll kameran stilla i några sekunder tills den känner igen koden.",
    "home.explained.how.4":
      "Tryck på aviseringslänken som visas för att öppna webbplatsen, videon eller visitkortet.",
    "home.dashboard.title": "Hantera alla dina QR Codes från en enda panel",
    "home.dashboard.body":
      "Skapa, redigera och spåra obegränsade QR Codes från en enda användarvänlig panel. Uppdatera destinationer, visa analyser och samarbeta med ditt team.",
    "home.dashboard.cta": "Prova gratis nu",
    "home.features.title":
      "Varför över 4 000 användare litar på UnifiedQR för ROI-driven QR Code-kampanjer",
    "home.features.track.title": "Spåra varje skanning",
    "home.features.track.body":
      "Få reda på hur din QR Code-kampanj presterar med realtidsinsikter. Få data om skanningar, unika användare, platser och enheter.",
    "home.features.dynamic.title": "Dynamiska QR Codes gratis",
    "home.features.dynamic.body":
      "Skapa upp till 2 dynamiska QR Codes gratis och uppdatera deras innehåll när som helst.",
    "home.features.collab.title": "Samarbeta med ditt team",
    "home.features.collab.body":
      "Bjud in upp till 5 teammedlemmar för att hantera och dela QR Codes på en enda panel.",
    "home.features.support.title": "Kundtjänst 24/7",
    "home.features.support.body":
      "Vårt team är alltid redo att lösa problem snabbt, via e-post eller ring.",
    "home.features.pay.title": "Betala för det du använder",
    "home.features.pay.body":
      "Flexibla priser — betala bara för de funktioner eller extra koder du behöver.",
    "home.features.cta": "Utforska Flex-planer",
    "home.types.title": "Vilka typer av QR Codes kan du skapa gratis?",
    "home.types.cta": "Se alla QR Code-typer",
    "home.faq.title": "Vanliga frågor",
    "home.faq.1.q": "Är QR Codes gratis för alltid?",
    "home.faq.1.a":
      "Ja. Varje statisk QR Code du skapar här är gratis, har inget utgångsdatum och ingen skanningsgräns. Du kan ladda ner den som PNG eller SVG och använda den kommersiellt.",
    "home.faq.2.q": "Vad är skillnaden mellan statiska och dynamiska QR Codes?",
    "home.faq.2.a":
      "En statisk QR Code lagrar data direkt i koden, så den kan aldrig ändras. En dynamisk QR Code pekar på en kort länk som du kontrollerar, så du kan redigera destinationen och spåra skanningar när som helst.",
    "home.faq.3.q": "Kan jag lägga till min logotyp på en QR Code?",
    "home.faq.3.a":
      "Ja. Välj en mall, anpassa dina färger och lägg till en logotyp i anpassningspanelen. Håll logotypen liten så att skannarna fortfarande kan läsa koden tillförlitligt.",
    "home.faq.4.q": "Vilket filformat bör jag ladda ner?",
    "home.faq.4.a":
      "Använd PNG för skärmar, sociala inlägg och dokument. Använd SVG för utskrift, storskalig skyltning eller överallt där du behöver ändra storlek utan kvalitetsförlust.",
    "home.faq.5.q": "Går QR Codes ut?",
    "home.faq.5.a":
      "Statiska QR Codes går aldrig ut. Dynamiska QR Codes förblir aktiva så länge ditt konto är aktivt, och du kan uppdatera vart de pekar när som helst.",
  },
  ru: {
    "nav.products": "Продукты",
    "nav.types": "Типы QR-кодов",
    "nav.pricing": "Цены",
    "nav.contact": "Контакты",
    "nav.resources": "Ресурсы",
    "nav.language": "Язык",
    "header.signIn": "Войти",
    "auth.title": "С возвращением",
    "auth.subtitle":
      "Войдите в своё рабочее пространство для управления сохранёнными кодами, динамическими ссылками и аналитикой сканирований.",
    "auth.signInWith": "Продолжить с Google",
    "auth.busy": "Открытие Google…",
    "auth.googleOnly": "Google — единственный способ входа.",
    "auth.back": "← Вернуться к бесплатному генератору",
    "auth.brand.tagline": "Рабочее пространство для каждого QR-кода, который вы создаёте.",
    "auth.brand.dynamic": "Динамические короткие ссылки, которые можно изменить после печати.",
    "auth.brand.analytics":
      "Отслеживание сканирований на каждом динамическом коде, в реальном времени с первого сканирования.",
    "auth.brand.templates": "13 шаблонов студии, пользовательские цвета, экспорт PNG и SVG.",
    "auth.brand.secure": "Вход, подтверждённый Google. Пароли не хранятся.",
    "auth.error.notAuthorized":
      "Эта электронная почта не авторизована для доступа к панели администрирования.",
    "auth.signOut": "Выйти",
    "pricing.title": "Платите только за то, что используете",
    "pricing.subtitle":
      "Каждый план включает неограниченные бесплатные статические QR-коды. Обновите, когда понадобится отслеживание, редактируемые коды или командный доступ.",
    "pricing.mostPopular": "Самый популярный",
    "pricing.perMonth": "в месяц",
    "pricing.forever": "навсегда",
    "pricing.startFree": "Начать бесплатно",
    "pricing.chooseFlex": "Выбрать Flex",
    "pricing.choosePro": "Выбрать Pro",
    "pricing.freeFeatures": [
      "Неограниченные статические QR-коды",
      "2 динамических QR-кода",
      "Скачивание PNG и SVG",
      "13 дизайнерских шаблонов",
      "Коммерческое использование",
    ],
    "pricing.flexFeatures": [
      "Всё из Free",
      "25 динамических QR-кодов",
      "Аналитика сканирований и локации",
      "Загрузка логотипа",
      "Поддержка по email",
    ],
    "pricing.proFeatures": [
      "Всё из Flex",
      "Неограниченные динамические QR-коды",
      "5 членов команды",
      "Массовое создание и доступ к API",
      "Пользовательский короткий домен",
      "Приоритетная поддержка 24/7",
    ],
    "billing.title": "Биллинг",
    "billing.subtitle":
      "Лимиты плана, обновления и счета. Платежи безопасно обрабатываются через Cashfree.",
    "billing.current": "Текущий",
    "billing.upgrade": "Обновить",
    "billing.yourPlan": "Ваш план",
    "billing.checkout": "Начало оформления…",
    "billing.signInToUpgrade": "Войдите, чтобы обновить свой план.",
    "footer.tagline":
      "Всё-в-одном инструмент для создания бесплатных QR-кодов, их редактирования и отслеживания эффективности кампаний. Ему доверяют более 4 тысяч пользователей по всему миру.",
    "footer.product": "Продукт",
    "footer.qrCodes": "QR-коды",
    "footer.company": "Компания",
    "footer.legal": "Правовая информация",
    "admin.unauthorized":
      "Эта электронная почта не авторизована для входа в панель администрирования.",
    "admin.signInToContinue": "Войдите через Google, чтобы продолжить.",
    "visitor.today": "посетителей сегодня",
    "chooser.title": "Выберите язык",
    "chooser.subtitle": "Выберите предпочтительный язык для продолжения",
    "home.hero.title": "UnifiedQR — Бесплатный генератор QR-кодов",
    "home.hero.subtitle":
      "Создавайте бесплатные QR-коды для сайтов, PDF, контактов, SMS и многого другого. Настраивайте цвета, скачивайте в PNG или SVG и отслеживайте каждое сканирование — всё из одной панели.",
    "home.social.trusted": "Нам доверяют",
    "home.social.users": "4 000+ пользователей",
    "home.social.onGoogle": "в Google",
    "home.social.noCreditCard": "Без привязки банковской карты",
    "home.social.signupFree": "Зарегистрируйтесь бесплатно",
    "home.steps.title": "Как создать бесплатный QR-код за 3 простых шага",
    "home.steps.1.title": "Выберите тип QR-кода",
    "home.steps.1.body":
      "Выберите тип QR-кода (статический или динамический) в зависимости от задачи: открыть URL, поделиться PDF, показать меню, передать контактные данные и многое другое.",
    "home.steps.2.title": "Настройте по своему вкусу",
    "home.steps.2.body":
      "Добавьте свои данные, измените цвет, оформите QR-код, добавьте логотип и протестируйте в реальном времени перед скачиванием.",
    "home.steps.3.title": "Скачайте и поделитесь",
    "home.steps.3.body":
      "Выберите формат PNG или SVG, нажмите скачать — и готово! Делитесь где угодно!",
    "home.steps.cta": "Создать бесплатный QR-код",
    "home.explained.title": "Что такое QR-коды",
    "home.explained.what.title": "Что такое QR-код?",
    "home.explained.what.body":
      "QR-код — это двумерный штрих-код, который хранит информацию, такую как URL, контактные данные, платёжные данные или текст, в виде сетки чёрных и белых квадратов. Его можно отсканировать камерой смартфона, чтобы мгновенно получить доступ к сохранённому контенту без набора текста.",
    "home.explained.why.title": "Почему так много людей используют QR-коды в 2026 году?",
    "home.explained.why.body":
      "QR-коды обеспечивают быстрый, бесконтактный и недорогой способ связать оффлайн-впечатления с цифровым контентом. Компании используют их для обновлений в реальном времени и сокращения расходов на печать, давая пользователям мгновенный доступ с помощью камеры смартфона.",
    "home.explained.how.title": "Как отсканировать QR-код?",
    "home.explained.how.1":
      "Откройте приложение камеры на смартфоне или планшете. Большинство современных устройств распознают QR-коды автоматически.",
    "home.explained.how.2": "Направьте камеру на QR-код, убедившись, что он чётко виден в кадре.",
    "home.explained.how.3": "Держите неподвижно несколько секунд, пока камера не распознает код.",
    "home.explained.how.4":
      "Нажмите на уведомление или ссылку, которая появится, чтобы открыть сайт, видео или визитку.",
    "home.dashboard.title": "Управляйте всеми QR-кодами из одной панели",
    "home.dashboard.body":
      "Создавайте, редактируйте и отслеживайте неограниченное количество QR-кодов с одной удобной панели. Обновляйте назначения, просматривайте аналитику и работайте вместе с командой.",
    "home.dashboard.cta": "Попробуйте бесплатно",
    "home.features.title":
      "Почему 4 тысячи+ пользователей доверяют UnifiedQR для QR-кампаний с максимальной отдачей",
    "home.features.track.title": "Отслеживайте каждое сканирование",
    "home.features.track.body":
      "Узнайте, как работает ваша QR-кампания, с данными в реальном времени. Получайте информацию о сканированиях, уникальных пользователях, местоположениях и устройствах.",
    "home.features.dynamic.title": "Бесплатные динамические QR-коды",
    "home.features.dynamic.body":
      "Создайте до 2 динамических QR-кодов бесплатно и обновляйте их содержимое в любое время.",
    "home.features.collab.title": "Сотрудничайте с командой",
    "home.features.collab.body":
      "Пригласите до 5 членов команды для управления и обмена QR-кодами на одной панели.",
    "home.features.support.title": "Поддержка 24/7",
    "home.features.support.body":
      "Наша команда всегда готова быстро решить проблемы по электронной почте или по телефону.",
    "home.features.pay.title": "Платите только за то, что используете",
    "home.features.pay.body":
      "Гибкие тарифы — платите только за нужные функции или дополнительные коды.",
    "home.features.cta": "Смотреть тарифы Flex",
    "home.types.title": "Какие типы QR-кодов можно создать бесплатно?",
    "home.types.cta": "Смотреть все типы QR-кодов",
    "home.faq.title": "Часто задаваемые вопросы",
    "home.faq.1.q": "QR-коды бесплатны навсегда?",
    "home.faq.1.a":
      "Да. Каждый статический QR-код, который вы создаёте здесь, бесплатен, не имеет срока действия и лимита сканирований. Вы можете скачать его в формате PNG или SVG и использовать в коммерческих целях.",
    "home.faq.2.q": "В чём разница между статическими и динамическими QR-кодами?",
    "home.faq.2.a":
      "Статический QR-код хранит данные прямо внутри кода, поэтому его невозможно изменить. Динамический QR-код ссылается на короткую ссылку, которую вы контролируете, поэтому вы можете изменить назначение и отслеживать сканирования в любое время.",
    "home.faq.3.q": "Могу ли я добавить свой логотип к QR-коду?",
    "home.faq.3.a":
      "Да. Выберите шаблон, настройте цвета и добавьте логотип в панели кастомизации. Держите логотип небольшим, чтобы сканеры могли надёжно считывать код.",
    "home.faq.4.q": "Какой формат файла лучше скачать?",
    "home.faq.4.a":
      "Используйте PNG для экранов, публикаций в соцсетях и документов. Используйте SVG для печати, больших вывесок или везде, где нужно менять размер без потери качества.",
    "home.faq.5.q": "Истекает ли срок действия QR-кодов?",
    "home.faq.5.a":
      "Статические QR-коды никогда не истекают. Динамические QR-коды остаются активными, пока активен ваш аккаунт, и вы можете изменить их назначение в любое время.",
  },
  tr: {
    "nav.products": "Ürünler",
    "nav.types": "QR Kod türleri",
    "nav.pricing": "Fiyatlandırma",
    "nav.contact": "İletişim",
    "nav.resources": "Kaynaklar",
    "nav.language": "Dil",
    "header.signIn": "Giriş yap",
    "auth.title": "Tekrar hoş geldiniz",
    "auth.subtitle":
      "Kayıtlı kodları, dinamik bağlantıları ve tarama analizlerini yönetmek için çalışma alanınıza giriş yapın.",
    "auth.signInWith": "Google ile devam et",
    "auth.busy": "Google açılıyor…",
    "auth.googleOnly": "Google şu anda tek giriş yöntemidir.",
    "auth.back": "← Ücretsiz üreticiye dön",
    "auth.brand.tagline": "Oluşturduğunuz her QR Kod için bir çalışma alanı.",
    "auth.brand.dynamic": "Bastıktan sonra yönlendirebileceğiniz dinamik kısa bağlantılar.",
    "auth.brand.analytics": "Her dinamik kodda tarama takibi, ilk taramadan itibaren canlı.",
    "auth.brand.templates": "13 stüdyo şablonu, özel renkler, PNG ve SVG dışa aktarım.",
    "auth.brand.secure": "Google doğrulamalı giriş. Şifre saklanmaz.",
    "auth.error.notAuthorized": "Bu e-posta, yönetici paneline erişim için yetkili değil.",
    "auth.signOut": "Çıkış yap",
    "pricing.title": "Yalnızca kullandığınız kadar ödeyin",
    "pricing.subtitle":
      "Her plan, sınırsız ücretsiz statik QR Kod içerir. Takip, düzenlenebilir kodlar veya ekip erişimi gerektiğinde yükseltin.",
    "pricing.mostPopular": "En popüler",
    "pricing.perMonth": "aylık",
    "pricing.forever": "sonsuz",
    "pricing.startFree": "Ücretsiz başla",
    "pricing.chooseFlex": "Flex seç",
    "pricing.choosePro": "Pro seç",
    "pricing.freeFeatures": [
      "Sınırsız statik QR Kodlar",
      "2 dinamik QR Kod",
      "PNG ve SVG indirmeleri",
      "13 tasarım şablonu",
      "Ticari kullanım",
    ],
    "pricing.flexFeatures": [
      "Free'deki her şey",
      "25 dinamik QR Kod",
      "Tarama analizi ve konumlar",
      "Logo yükleme",
      "E-posta desteği",
    ],
    "pricing.proFeatures": [
      "Flex'teki her şey",
      "Sınırsız dinamik QR Kod",
      "5 ekip üyesi",
      "Toplu oluşturma ve API erişimi",
      "Özel kısa alan adı",
      "24/7 öncelikli destek",
    ],
    "billing.title": "Faturalandırma",
    "billing.subtitle":
      "Plan limitleri, yükseltmeler ve faturalar. Ödemeler Cashfree tarafından güvenli şekilde işlenir.",
    "billing.current": "Mevcut",
    "billing.upgrade": "Yükselt",
    "billing.yourPlan": "Planınız",
    "billing.checkout": "Ödeme başlatılıyor…",
    "billing.signInToUpgrade": "Planınızı yükseltmek için giriş yapın.",
    "footer.tagline":
      "Ücretsiz QR Kodlar oluşturmak, düzenlemek ve kampanya performansını takip etmek için hepsi bir arada araç. Dünya genelinde 4K+ kullanıcının güvendiği çözüm.",
    "footer.product": "Ürün",
    "footer.qrCodes": "QR Kodlar",
    "footer.company": "Şirket",
    "footer.legal": "Yasal",
    "admin.unauthorized": "Bu e-posta, yönetici paneline giriş yapmaya yetkili değil.",
    "admin.signInToContinue": "Devam etmek için Google ile giriş yapın.",
    "visitor.today": "bugünkü ziyaretçiler",
    "chooser.title": "Dilinizi seçin",
    "chooser.subtitle": "Devam etmek için tercih ettiğiniz dili seçin",
    "home.hero.title": "UnifiedQR — Ücretsiz QR Kod Oluşturucu",
    "home.hero.subtitle":
      "Web siteleri, PDF'ler, kişiler, SMS ve daha fazlası için ücretsiz QR Kodlar oluşturun. Renkleri özelleştirin, PNG veya SVG olarak indirin ve her taramayı takip edin — hepsi tek bir panelden.",
    "home.social.trusted": "Güvenilir",
    "home.social.users": "4K+ kullanıcı",
    "home.social.onGoogle": "Google'da",
    "home.social.noCreditCard": "Kredi kartı gerekmez",
    "home.social.signupFree": "Ücretsiz kaydolun",
    "home.steps.title": "3 basit adımda ücretsiz QR Kod nasıl oluşturulur",
    "home.steps.1.title": "QR Kod türünüzü seçin",
    "home.steps.1.body":
      "QR Kod türünüzü (statik veya dinamik) amacınıza göre seçin: URL açma, PDF paylaşma, menü gösterme, iletişim bilgisi paylaşma ve daha fazlası.",
    "home.steps.2.title": "Kendi tarzınıza göre özelleştirin",
    "home.steps.2.body":
      "Detaylarınızı ekleyin, rengi değiştirin, QR Kodunuzu stilleyin, logo ekleyin ve indirmeden önce gerçek zamanlı olarak test edin.",
    "home.steps.3.title": "İndirin ve paylaşın",
    "home.steps.3.body":
      "PNG veya SVG formatını seçin, indirme düğmesine basın ve her yerde paylaşmaya hazır olun!",
    "home.steps.cta": "Ücretsiz QR Kod oluşturun",
    "home.explained.title": "QR Kodlar açıklanıyor",
    "home.explained.what.title": "QR Kod nedir?",
    "home.explained.what.body":
      "QR Kod, siyah ve beyaz karelerden oluşan bir ızgarada URL, iletişim bilgileri, ödeme verileri veya metin gibi bilgileri saklayan iki boyutlu bir barkoddur. Yazma yapmadan depolanan içeriğe anında erişmek için akıllı telefon kamerasıyla taranabilir.",
    "home.explained.why.title": "2026'da bu kadar çok kişi neden QR Kod kullanıyor?",
    "home.explained.why.body":
      "QR Kodlar, çevrimdışı deneyimleri dijital içeriğe bağlamanın hızlı, temassız ve düşük maliyetli bir yolunu sağlar. İşletmeler, kullanıcıya yalnızca akıllı telefon kamerasıyla anında erişim sağlarken gerçek zamanlı güncellemeler ve basım israfını azaltmak için bunlara güvenir.",
    "home.explained.how.title": "Bir QR Kodu nasıl tararım?",
    "home.explained.how.1":
      "Akıllı telefonunuzda veya tabletinizde kamera uygulamasını açın. Çoğu modern cihaz QR Kodları otomatik olarak tarar.",
    "home.explained.how.2":
      "Kameranızı QR Kodun üzerine doğrultun ve kodun çerçeve içinde net bir şekilde göründüğünden emin olun.",
    "home.explained.how.3": "Kamera kodu tanıyana kadar birkaç saniye sabit tutun.",
    "home.explained.how.4":
      "Web sitesini, videoyu veya kartviziti açmak için bildirime veya bağlantıya dokunun.",
    "home.dashboard.title": "Tüm QR Kodlarınızı tek bir panelden yönetin",
    "home.dashboard.body":
      "Tek, kullanımı kolay bir panelden sınırsız QR Kod oluşturun, düzenleyin ve takip edin. Hedefleri güncelleyin, analitikleri görüntüleyin ve ekibinizle işbirliği yapın.",
    "home.dashboard.cta": "Hemen ücretsiz deneyin",
    "home.features.title":
      "4 binden fazla kullanıcı neden ROI odaklı QR Kod kampanyaları için UnifiedQR'a güveniyor",
    "home.features.track.title": "Her taramayı takip edin",
    "home.features.track.body":
      "Gerçek zamanlı içgörülerle QR Kod kampanyanızın nasıl performans gösterdiğini bilin. Tarama, benzersiz kullanıcı, konum ve cihaz verilerini alın.",
    "home.features.dynamic.title": "Ücretsiz dinamik QR Kodlar",
    "home.features.dynamic.body":
      "Ücretsiz olarak 2 adede kadar dinamik QR Kod oluşturun ve içeriklerini istediğiniz zaman güncelleyin.",
    "home.features.collab.title": "Ekibinizle işbirliği yapın",
    "home.features.collab.body":
      "Bir panelde QR Kodları yönetmek ve paylaşmak için 5 ekibie üyesi davet edin.",
    "home.features.support.title": "7/24 müşteri desteği",
    "home.features.support.body":
      "Ekibimiz sorunları hızla çözmeye her zaman hazırdır, e-posta veya telefonla.",
    "home.features.pay.title": "Yalnızca kullandığınız kadar ödeyin",
    "home.features.pay.body":
      "Esnek fiyatlandırma — yalnızca ihtiyacınız olan özellikler veya ek kodlar için ödeme yapın.",
    "home.features.cta": "Flex planlarını keşfedin",
    "home.types.title": "Ücretsiz olarak hangi tür QR Kodları oluşturabilirsiniz?",
    "home.types.cta": "Tüm QR Kod türlerini görün",
    "home.faq.title": "Sıkça sorulan sorular",
    "home.faq.1.q": "QR Kodlar sonsuza kadar ücretsiz mi?",
    "home.faq.1.a":
      "Evet. Burada oluşturduğunuz her statik QR Kod ücretsizdir, son kullanma tarihi yoktur ve tarama limiti yoktur. PNG veya SVG olarak indirebilir ve ticari olarak kullanabilirsiniz.",
    "home.faq.2.q": "Statik ve dinamik QR Kodlar arasındaki fark nedir?",
    "home.faq.2.a":
      "Statik QR Kod, veriyi doğrudan kodun içinde depolar, bu yüzden asla değiştirilemez. Dinamik QR Kod, kontrol ettiğiniz bir kısa bağlantıya işaret eder, bu yüzden hedefi istediğiniz zaman düzenleyebilir ve taramaları takip edebilirsiniz.",
    "home.faq.3.q": "QR Koduma logomu ekleyebilir miyim?",
    "home.faq.3.a":
      "Evet. Bir şablon seçin, renklerinizi ayarlayın ve özelleştirme panelinde logo ekleyin. Tarayıcıların kodu güvenilir bir şekilde okuyabilmesi için logoyu küçük tutun.",
    "home.faq.4.q": "Hangi dosya formatını indirmeliyim?",
    "home.faq.4.a":
      "Ekranlar, sosyal gönderiler ve belgeler için PNG kullanın. Baskı, büyük format tabelaları veya boyutlandırma kaybı olmadan yeniden boyutlandırma ihtiyacınız olan her yer için SVG kullanın.",
    "home.faq.5.q": "QR Kodların son kullanma tarihi var mı?",
    "home.faq.5.a":
      "Statik QR Kodların son kullanma tarihi yoktur. Dinamik QR Kodlar, hesabınız aktif kaldığı sürece aktif kalır ve hedefi istediğiniz zaman değiştirebilirsiniz.",
  },
  ar: {
    "nav.products": "المنتجات",
    "nav.types": "أنواع رموز QR",
    "nav.pricing": "الأسعار",
    "nav.contact": "اتصل بنا",
    "nav.resources": "الموارد",
    "nav.language": "اللغة",
    "header.signIn": "تسجيل الدخول",
    "auth.title": "مرحباً بعودتك",
    "auth.subtitle":
      "سجّل الدخول إلى مساحة عملك لإدارة الرموز المحفوظة والروابط الديناميكية وتحليلات المسح.",
    "auth.signInWith": "المتابعة مع Google",
    "auth.busy": "جاري فتح Google…",
    "auth.googleOnly": "Google هو حاليًا الطريقة الوحيدة لتسجيل الدخول.",
    "auth.back": "← العودة إلى المولّد المجاني",
    "auth.brand.tagline": "مساحة عمل واحدة لكل رمز QR تنشئه.",
    "auth.brand.dynamic": "روابط قصيرة ديناميكية يمكنك إعادة توجيهها بعد الطباعة.",
    "auth.brand.analytics": "تتبع عمليات المسح لكل رمز ديناميكي، مباشرة من أول مسح.",
    "auth.brand.templates": "13 قالب استوديو، ألوان مخصصة، تصدير PNG و SVG.",
    "auth.brand.secure": "تسجيل دخول موثّق من Google. لا تُخزّن كلمات المرور.",
    "auth.error.notAuthorized": "هذا البريد الإلكتروني غير مصرح له بالوصول إلى لوحة الإدارة.",
    "auth.signOut": "تسجيل الخروج",
    "pricing.title": "ادفع فقط مقابل ما تستخدمه",
    "pricing.subtitle":
      "يتضمن كل خطة رموز QR ثابتة مجانية غير محدودة. قم بالترقية عندما تحتاج إلى التتبع أو الرموز القابلة للتعديل أو وصول الفريق.",
    "pricing.mostPopular": "الأكثر شعبية",
    "pricing.perMonth": "شهرياً",
    "pricing.forever": "إلى الأبد",
    "pricing.startFree": "ابدأ مجاناً",
    "pricing.chooseFlex": "اختر Flex",
    "pricing.choosePro": "اختر Pro",
    "pricing.freeFeatures": [
      "رموز QR ثابتة غير محدودة",
      "2 رمز QR ديناميكي",
      "تحميلات PNG و SVG",
      "13 قالب تصميم",
      "لاستخدام التجاري",
    ],
    "pricing.flexFeatures": [
      "كل ما في Free",
      "25 رمز QR ديناميكي",
      "تحليلات المسح والمواقع",
      "رفع الشعار",
      "الدعم عبر البريد الإلكتروني",
    ],
    "pricing.proFeatures": [
      "كل ما في Flex",
      "رموز QR ديناميكية غير محدودة",
      "5 أعضاء فريق",
      "إنشاء جماعي وصول API",
      "نطاق قصير مخصص",
      "دعم أولوي 24/7",
    ],
    "billing.title": "الفوترة",
    "billing.subtitle":
      "حدود الخطة والترقيات والفواتير. تتم معالجة المدفوعات بشكل آمن عبر Cashfree.",
    "billing.current": "الحالية",
    "billing.upgrade": "ترقية",
    "billing.yourPlan": "خطتك",
    "billing.checkout": "بدء الدفع…",
    "billing.signInToUpgrade": "سجّل الدخول لترقية خطتك.",
    "footer.tagline":
      "أداة شاملة لإنشاء رموز QR المجانية وتعديلها وتتبع أداء الحملات. يثق بها أكثر من 4 آلاف مستخدم حول العالم.",
    "footer.product": "المنتج",
    "footer.qrCodes": "رموز QR",
    "footer.company": "الشركة",
    "footer.legal": "القانونية",
    "admin.unauthorized": "هذا البريد الإلكتروني غير مصرح له بتسجيل الدخول في لوحة الإدارة.",
    "admin.signInToContinue": "سجّل الدخول باستخدام Google للمتابعة.",
    "visitor.today": "زوار اليوم",
    "chooser.title": "اختر لغتك",
    "chooser.subtitle": "حدد لغتك المفضلة للمتابعة",
    "home.hero.title": "UnifiedQR — مولّد رموز QR مجاني",
    "home.hero.subtitle":
      "أنشئ رموز QR مجانية للمواقع والملفات PDFجهات الاتصال والرسائل القصيرة والمزيد. خصص الألوان، وحمّل بصيغة PNG أو SVG، وتتبع كل مسح — كل ذلك من لوحة تحكم واحدة.",
    "home.social.trusted": "موثوق من قبل",
    "home.social.users": "أكثر من 4 آلاف مستخدم",
    "home.social.onGoogle": "على Google",
    "home.social.noCreditCard": "لا حاجة لبطاقة ائتمان",
    "home.social.signupFree": "سجّل مجاناً",
    "home.steps.title": "كيف تنشئ رمز QR مجاني في 3 خطوات بسيطة",
    "home.steps.1.title": "اختر نوع رمز QR",
    "home.steps.1.body":
      "اختر نوع رمز QR (ثابت أو ديناميكي) بناءً على ما تريد فعله: فتح عنوان URL، مشاركة ملف PDF، عرض قائمة، مشاركة بيانات جهة اتصال، والمزيد.",
    "home.steps.2.title": "خصّصه بالطريقة التي تريدها",
    "home.steps.2.body":
      "أضف تفاصيلك، غيّر اللون، صمم رمز QR الخاص بك، أضف شعاراً، واختبره في الوقت الحقيقي قبل التحميل.",
    "home.steps.3.title": "حمّل وشارك",
    "home.steps.3.body": "اختر صيغة PNG أو SVG، اضغط على تحميل، وأنت جاهز للمشاركة في أي مكان!",
    "home.steps.cta": "أنشئ رمز QR مجاني",
    "home.explained.title": "رموز QR مفسّرة",
    "home.explained.what.title": "ما هو رمز QR؟",
    "home.explained.what.body":
      "رمز QR هو شريط ثنائي الأبعاد يخزن معلومات مثل عناوين URL وبيانات جهات الاتصال والبيانات المالية أو النص في شبكة من المربعات السوداء والبيضاء. يمكن مسحه بكاميرا الهاتف الذكي للوصول الفوري إلى المحتوى المخزن دون كتابة.",
    "home.explained.why.title": "لماذا يستخدم كثير من الناس رموز QR في عام 2026؟",
    "home.explained.why.body":
      "توفر رموز QR طريقة سريعة ولامستة ومنخفضة التكلفة لربط التجارب غير المتصلة بالإنترنت بالمحتوى الرقمي. تعتمد الشركات عليها للتحديثات الفورية وتقليل هدر الطباعة مع تقديم وصول فوري للمستخدمين عبر كاميرا الهاتف الذكي فقط.",
    "home.explained.how.title": "كيف أسكن رمز QR؟",
    "home.explained.how.1":
      "افتح تطبيق الكاميرا على هاتفك الذكي أو جهازك اللوحي. تمسح معظم الأجهزة الحديثة رموز QR تلقائياً.",
    "home.explained.how.2": "وجّه كاميرتك نحو رمز QR، مع التأكد من أنه مرئي بوضوح داخل الإطار.",
    "home.explained.how.3": "اضغط ثابتاً لبضع ثوانٍ حتى تتعرف الكاميرا على الرمز.",
    "home.explained.how.4":
      "اضغط على الإشعار أو الرابط الذي يظهر لفتح الموقع الإلكتروني أو الفيديو أو بطاقة جهة الاتصال.",
    "home.dashboard.title": "أدر جميع رموز QR من لوحة تحكم واحدة",
    "home.dashboard.body":
      "أنشئ وعدّل وتتبع رموز QR غير المحدودة من لوحة تحكم واحدة سهلة الاستخدام. حدّث الوجهات، واطلع على التحليلات، وتعاون مع فريقك.",
    "home.dashboard.cta": "جرّب مجاناً الآن",
    "home.features.title": "لماذا يثق أكثر من 4 آلاف مستخدم في UnifiedQR لحملات QR المحققة للعائد",
    "home.features.track.title": "تتبع كل مسح",
    "home.features.track.body":
      "اعرف أداء حملة رمز QR الخاصة بك من خلال رؤى فورية. احصل على بيانات حولعمليات المسح والمستخدمين الفريدين والمواقع والأجهزة.",
    "home.features.dynamic.title": "رموز QR ديناميكية مجانية",
    "home.features.dynamic.body":
      "أنشئ ما يصل إلى 2 رمز QR ديناميكي مجاناً وحدّث محتواها في أي وقت.",
    "home.features.collab.title": "تعاون مع فريقك",
    "home.features.collab.body":
      "ادعُ ما يصل إلى 5 أعضاء من الفريق لإدارة ومشاركة رموز QR على لوحة تحكم واحدة.",
    "home.features.support.title": "دعم العملاء على مدار الساعة",
    "home.features.support.body":
      "فريقنا مستعد دائماً لإصلاح المشاكل بسرعة، عبر البريد الإلكتروني أو الهاتف.",
    "home.features.pay.title": "ادفع فقط مقابل ما تستخدمه",
    "home.features.pay.body": "تسعير مرن — ادفع فقط مقابل الميزات أو الرموز الإضافية التي تحتاجها.",
    "home.features.cta": "استكشف خطط Flex",
    "home.types.title": "ما هي أنواع رموز QR التي يمكنك إنشاؤها مجاناً؟",
    "home.types.cta": "عرض جميع أنواع رموز QR",
    "home.faq.title": "الأسئلة الشائعة",
    "home.faq.1.q": "هل رموز QR مجانية إلى الأبد؟",
    "home.faq.1.a":
      "نعم. كل رمز QR ثابت تنشئه هنا مجاني، وليس له تاريخ انتهاء ولا حد لعمليات المسح. يمكنك تحميله بصيغة PNG أو SVG واستخدامه تجارياً.",
    "home.faq.2.q": "ما الفرق بين رموز QR الثابتة والديناميكية؟",
    "home.faq.2.a":
      "رمز QR الثابت يخزن البيانات مباشرة داخل الرمز، لذا لا يمكن تغييره أبداً. رمز QR الديناميكي يشير إلى رابط قصير تتحكم فيه، لذا يمكنك تعديل الوجهة وتتبع عمليات المسح في أي وقت.",
    "home.faq.3.q": "هل يمكنني إضافة شعاري إلى رمز QR؟",
    "home.faq.3.a":
      "نعم. اختر قالباً، وعدّل ألوانك، وأضف شعاراً في لوحة التخصيص. أبقِ الشعار صغيراً حتى يتمكن الماسحون من قراءة الرمز بثقة.",
    "home.faq.4.q": "ما تنسيق الملف الذي يجب أن أحمّله؟",
    "home.faq.4.a":
      "استخدم PNG للشاشات والمنشورات الوثائق. استخدم SVG للطباعة أو لافتات التنسيق الكبير أو في أي مكان تحتاج فيه إلى تغيير الحجم دون فقدان الجودة.",
    "home.faq.5.q": "هل تنتهي صلاحية رموز QR؟",
    "home.faq.5.a":
      "رموز QR الثابتة لا تنتهي صلاحيتها أبداً. رموز QR الديناميكية تظل نشطة طالما حسابك نشط، ويمكنك تعديل وجهتها في أي وقت.",
  },
  fa: {
    "nav.products": "محصولات",
    "nav.types": "انواع QR کد",
    "nav.pricing": "قیمت‌ها",
    "nav.contact": "تماس",
    "nav.resources": "منابع",
    "nav.language": "زبان",
    "header.signIn": "ورود",
    "auth.title": "خوش آمدید",
    "auth.subtitle":
      "برای مدیریت کدهای ذخیره شده، لینک‌های داینامیک و تحلیل‌های اسکن وارد فضای کاری خود شوید.",
    "auth.signInWith": "ادامه با Google",
    "auth.busy": "باز کردن Google…",
    "auth.googleOnly": "Google در حال حاضر تنها روش ورود است.",
    "auth.back": "← بازگشت به مولد رایگان",
    "auth.brand.tagline": "یک فضای کاری برای هر QR کدی که ایجاد می‌کنید.",
    "auth.brand.dynamic": "لینک‌های کوتاه داینامیک که پس از چاپ قابل تغییر هستند.",
    "auth.brand.analytics": "ردیابی اسکن در هر کد داینامیک، به صورت زنده از اولین اسکن.",
    "auth.brand.templates": "۱۳ قالب استودیو، رنگ‌های سفارشی، خروجی PNG و SVG.",
    "auth.brand.secure": "ورود تأیید شده توسط Google. هیچ رمز عبوری ذخیره نمی‌شود.",
    "auth.error.notAuthorized": "این ایمیل مجاز به دسترسی به پنل مدیریت نیست.",
    "auth.signOut": "خروج",
    "pricing.title": "فقط برای آنچه استفاده می‌کنید پرداخت کنید",
    "pricing.subtitle":
      "هر طرح شامل QR کدهای استاتیک رایگان نامحدود است. هنگامی که به ردیابی، کدهای قابل ویرایش یا دسترسی تیم نیاز دارید ارتقا دهید.",
    "pricing.mostPopular": "محبوب‌ترین",
    "pricing.perMonth": "ماهانه",
    "pricing.forever": "برای همیشه",
    "pricing.startFree": "رایگان شروع کنید",
    "pricing.chooseFlex": "انتخاب Flex",
    "pricing.choosePro": "انتخاب Pro",
    "pricing.freeFeatures": [
      "QR کدهای استاتیک نامحدود",
      "۲ QR کد داینامیک",
      "دانلود PNG و SVG",
      "۱۳ قالب طراحی",
      "استفاده تجاری",
    ],
    "pricing.flexFeatures": [
      "همه چیز در Free",
      "۲۵ QR کد داینامیک",
      "تحلیل اسکن و مکان‌ها",
      "آپلود لوگو",
      "پشتیبانی ایمیلی",
    ],
    "pricing.proFeatures": [
      "همه چیز در Flex",
      "QR کدهای داینامیک نامحدود",
      "۵ عضو تیم",
      "ایجاد انبوه و دسترسی API",
      "دامنه کوتاه سفارشی",
      "پشتیبانی اولویت‌دار ۲۴/۷",
    ],
    "billing.title": "صورتحساب",
    "billing.subtitle":
      "محدودیت‌های طرح، ارتقاها و فاکتورها. پرداخت‌ها توسط Cashfree به صورت امن پردازش می‌شوند.",
    "billing.current": "فعلی",
    "billing.upgrade": "ارتقاء",
    "billing.yourPlan": "طرح شما",
    "billing.checkout": "شروع پرداخت…",
    "billing.signInToUpgrade": "برای ارتقای طرح وارد شوید.",
    "footer.tagline":
      "ابزار همه‌کاره برای ایجاد QR کدهای رایگان، ویرایش آن‌ها و ردیابی عملکرد کمپین. مورد اعتماد بیش از ۴ هزار کاربر در سراسر جهان.",
    "footer.product": "محصول",
    "footer.qrCodes": "QR کدها",
    "footer.company": "شرکت",
    "footer.legal": "قانونی",
    "admin.unauthorized": "این ایمیل مجاز به ورود به پنل مدیریت نیست.",
    "admin.signInToContinue": "برای ادامه با Google وارد شوید.",
    "visitor.today": "بازدیدکنندگان امروز",
    "chooser.title": "زبان خود را انتخاب کنید",
    "chooser.subtitle": "برای ادامه زبان مورد نظر خود را انتخاب کنید",
    "home.hero.title": "UnifiedQR — سازنده رایگان QR کد",
    "home.hero.subtitle":
      "QR کدهای رایگان برای وب‌سایت‌ها، PDF‌ها، مخاطبین، پیامک و موارد دیگر بسازید. رنگ‌ها را سفارشی کنید، به صورت PNG یا SVG دانلود کنید و هر اسکن را ردیابی کنید — همه از یک داشبورد.",
    "home.social.trusted": "مورد اعتماد",
    "home.social.users": "۴۰۰۰+ کاربر",
    "home.social.onGoogle": "در Google",
    "home.social.noCreditCard": "بدون نیاز به کارت اعتباری",
    "home.social.signupFree": "رایگان ثبت‌نام کنید",
    "home.steps.title": "چگونه در ۳ مرحله ساده یک QR کد رایگان بسازید",
    "home.steps.1.title": "نوع QR کد خود را انتخاب کنید",
    "home.steps.1.body":
      "نوع QR کد خود (ایستا یا پویا) را بر اساس کاری که می‌خواهد انجام دهد انتخاب کنید: باز کردن URL، اشتراک‌گذاری PDF، نمایش منو، اشتراک‌گذاری اطلاعات تماس و موارد دیگر.",
    "home.steps.2.title": "آن را به سبک خود سفارشی کنید",
    "home.steps.2.body":
      "جزئیات خود را اضافه کنید، رنگ را تغییر دهید، QR کد خود را طراحی کنید، لوگو اضافه کنید و قبل از دانلود به صورت بلادرنگ آزمایش کنید.",
    "home.steps.3.title": "دانلود و اشتراک‌گذاری",
    "home.steps.3.body":
      "قالب PNG یا SVG را انتخاب کنید، دانلود را بزنید و آماده اشتراک‌گذاری در هر جایی هستید!",
    "home.steps.cta": "یک QR کد رایگان بسازید",
    "home.explained.title": "توضیح QR کدها",
    "home.explained.what.title": "QR کد چیست؟",
    "home.explained.what.body":
      "QR کد یک بارکد دوبعدی است که اطلاعاتی مانند URL، اطلاعات تماس، داده‌های پرداخت یا متن را در شبکه‌ای از مربعات سیاه و سفید ذخیره می‌کند. می‌توان آن را با دوربین گوشی هوشمند اسکن کرد تا فوراً به محتوای ذخیره‌شده بدون تایپ کردن دسترسی پیدا کرد.",
    "home.explained.why.title": "چرا اینقدر زیاد از QR کد در سال ۲۰۲۶ استفاده می‌کنند؟",
    "home.explained.why.body":
      "QR کدها راهی سریع، بدون تماس و کم‌هزینه برای پیوند دادن تجربه‌های آفلاین به محتوای دیجیتال فراهم می‌کنند. کسب‌وکارها برای به‌روزرسانی‌های بلادرنگ و کاهش هدر چاپ به آنها اعتماد می‌کنند در حالی که دسترسی فوری به کاربران فقط با دوربین گوشی هوشمند ارائه می‌دهند.",
    "home.explained.how.title": "چگونه آن را اسکن کنم؟",
    "home.explained.how.1":
      "برنامه دوربین را در گوشی هوشمند یا تبلت خود باز کنید. بیشتر دستگاه‌های مدرن QR کدها را به صورت خودکار اسکن می‌کنند.",
    "home.explained.how.2":
      "دوربین خود را به سمت QR کد بگیرید و مطمئن شوید که به وضوح در قاب دیده می‌شود.",
    "home.explained.how.3": "چند ثانیه ثابت نگه دارید تا دوربین کد را تشخیص دهد.",
    "home.explained.how.4":
      "روی اعلان یا پیوندی که ظاهر می‌شود ضربه بزنید تا وب‌سایت، ویدیو یا کارت تماس باز شود.",
    "home.dashboard.title": "همه QR کدهای خود را از یک داشبورد مدیریت کنید",
    "home.dashboard.body":
      "تعداد نامحدود QR کد ایجاد، ویرایش و ردیابی کنید از یک داشبورد واحد و ساده. مقصد را به‌روزرسانی کنید، تحلیل‌ها را مشاهده کنید و با تیم خود همکاری کنید.",
    "home.dashboard.cta": "همین الان رایگان امتحان کنید",
    "home.features.title":
      "چرا بیش از ۴ هزار کاربر به UnifiedQR برای کمپین‌های QR با بازگشت سرمایه اعتماد می‌کنند",
    "home.features.track.title": "هر اسکن را ردیابی کنید",
    "home.features.track.body":
      "با بینش‌های بلادرنگ بدانید کمپین QR کد شما چگونه عمل می‌کند. داده‌هایی درباره اسکن‌ها، کاربران منحصربه‌فرد، موقعیت‌ها و دستگاه‌ها دریافت کنید.",
    "home.features.dynamic.title": "QR کدهای پویای رایگان",
    "home.features.dynamic.body":
      "تا ۲ QR کد پویا به صورت رایگان ایجاد کنید و محتوای آنها را در هر زمان به‌روزرسانی کنید.",
    "home.features.collab.title": "با تیم خود همکاری کنید",
    "home.features.collab.body":
      "تا ۵ عضو تیم را برای مدیریت و اشتراک‌گذاری QR کدها در یک داشبورد دعوت کنید.",
    "home.features.support.title": "پشتیبانی ۲۴/۷",
    "home.features.support.body":
      "تیم ما همیشه آماده است مشکلات را به سرعت از طریق ایمیل یا تلفن حل کند.",
    "home.features.pay.title": "فقط برای آنچه استفاده می‌کنید پرداخت کنید",
    "home.features.pay.body":
      "قیمت‌گذاری انعطاف‌پذیر — فقط برای ویژگی‌ها یا کدهای اضافی که نیاز دارید پرداخت کنید.",
    "home.features.cta": "طرح‌های Flex را کاوش کنید",
    "home.types.title": "چه نوع QR کدهایی می‌توانید رایگان بسازید؟",
    "home.types.cta": "مشاهده همه انواع QR کد",
    "home.faq.title": "سوالات متداول",
    "home.faq.1.q": "آیا QR کدها برای همیشه رایگان هستند؟",
    "home.faq.1.a":
      "بله. هر QR کد ایستایی که اینجا ایجاد می‌کنید رایگان است، تاریخ انقضا ندارد و محدودیت اسکن ندارد. می‌توانید آن را به صورت PNG یا SVG دانلود کنید و به صورت تجاری استفاده کنید.",
    "home.faq.2.q": "تفاوت بین QR کدهای ایستا و پویا چیست؟",
    "home.faq.2.a":
      "QR کد ایستا داده را مستقیماً داخل کد ذخیره می‌کند، بنابراین هرگز قابل تغییر نیست. QR کد پویا به لینک کوتاهی اشاره می‌کند که شما کنترل می‌کنید، بنابراین می‌توانید مقصد را در هر زمان ویرایش کنید و اسکن‌ها را ردیابی کنید.",
    "home.faq.3.q": "آیا می‌توانم لوگوی خود را به QR کد اضافه کنم؟",
    "home.faq.3.a":
      "بله. یک قالب انتخاب کنید، رنگ‌های خود را تنظیم کنید و لوگو را در پنل سفارشی‌سازی اضافه کنید. لوگو را کوچک نگه دارید تا اسکنرها همچنان بتوانند کد را به طور قابل اعتماد بخوانند.",
    "home.faq.4.q": "چه فرمت فایلی را باید دانلود کنم؟",
    "home.faq.4.a":
      "برای صفحه‌ها، پست‌های اجتماعی و اسناد از PNG استفاده کنید. برای چاپ، تابلوهای بزرگ یا هر جایی که نیاز به تغییر اندازه بدون افت کیفیت دارید از SVG استفاده کنید.",
    "home.faq.5.q": "آیا QR کدها منقضی می‌شوند؟",
    "home.faq.5.a":
      "QR کدهای ایستا هرگز منقضی نمی‌شوند. QR کدهای پویا تا زمانی که حساب شما فعال باشد فعال می‌مانند و می‌توانید مقصد آنها را در هر زمان تغییر دهید.",
  },
  ja: {
    "nav.products": "製品",
    "nav.types": "QRコードの種類",
    "nav.pricing": "料金",
    "nav.contact": "お問い合わせ",
    "nav.resources": "リソース",
    "nav.language": "言語",
    "header.signIn": "ログイン",
    "auth.title": "おかえりなさい",
    "auth.subtitle":
      "保存されたコード、動的リンク、スキャン分析を管理するにはワークスペースにログインしてください。",
    "auth.signInWith": "Googleで続ける",
    "auth.busy": "Googleを開いています…",
    "auth.googleOnly": "Googleは現在唯一のログイン方法です。",
    "auth.back": "← 無料ジェネレーターに戻る",
    "auth.brand.tagline": "作成するすべてのQRコードのワークスペース。",
    "auth.brand.dynamic": "印刷後に再設定できる動的ショートリンク。",
    "auth.brand.analytics": "すべての動的コードのスキャン追跡、最初のスキャンからリアルタイム。",
    "auth.brand.templates": "13のスタジオテンプレート、カスタムカラー、PNG・SVGエクスポート。",
    "auth.brand.secure": "Google認証ログイン。パスワードは保存されません。",
    "auth.error.notAuthorized": "このメールは管理パネルへのアクセスが許可されていません。",
    "auth.signOut": "ログアウト",
    "pricing.title": "使用した分だけ支払い",
    "pricing.subtitle":
      "すべてのプランに無制限の無料スタティックQRコードが含まれます。追跡、編集可能なコード、チームアクセスが必要な場合はアップグレードしてください。",
    "pricing.mostPopular": "最も人気",
    "pricing.perMonth": "月額",
    "pricing.forever": "永遠に",
    "pricing.startFree": "無料で始める",
    "pricing.chooseFlex": "Flexを選ぶ",
    "pricing.choosePro": "Proを選ぶ",
    "pricing.freeFeatures": [
      "無制限のスタティックQRコード",
      "2個の動的QRコード",
      "PNG・SVGダウンロード",
      "13のデザインテンプレート",
      "商用利用",
    ],
    "pricing.flexFeatures": [
      "Freeのすべて",
      "25個の動的QRコード",
      "スキャン分析と位置情報",
      "ロゴアップロード",
      "メールサポート",
    ],
    "pricing.proFeatures": [
      "Flexのすべて",
      "無制限の動的QRコード",
      "5人のチームメンバー",
      "一括作成とAPIアクセス",
      "カスタム短縮ドメイン",
      "24/7優先サポート",
    ],
    "billing.title": "請求",
    "billing.subtitle":
      "プランの制限、アップグレードと請求書。支払いはCashfreeによって安全に処理されます。",
    "billing.current": "現在",
    "billing.upgrade": "アップグレード",
    "billing.yourPlan": "あなたのプラン",
    "billing.checkout": "チェックアウト開始…",
    "billing.signInToUpgrade": "プランをアップグレードするにはログインしてください。",
    "footer.tagline":
      "無料QRコードの作成、編集、キャンペーンパフォーマンス追跡のためのオールインワンツール。世界中の4K以上のユーザーに信頼されています。",
    "footer.product": "製品",
    "footer.qrCodes": "QRコード",
    "footer.company": "会社",
    "footer.legal": "法的情報",
    "admin.unauthorized": "このメールは管理パネルへのログインが許可されていません。",
    "admin.signInToContinue": "続けるにはGoogleでログインしてください。",
    "visitor.today": "今日の訪問者",
    "chooser.title": "言語を選択",
    "chooser.subtitle": "続けるには希望の言語を選択してください",
    "home.hero.title": "UnifiedQR — 無料QRコードジェネレーター",
    "home.hero.subtitle":
      "ウェブサイト、PDF、連絡先、SMSなどに無料QRコードを作成。色をカスタマイズし、PNGまたはSVGでダウンロードし、すべてのスキャンを追跡 — すべて1つのダッシュボードから。",
    "home.social.trusted": "信頼されています",
    "home.social.users": "4,000人以上のユーザー",
    "home.social.onGoogle": "Google上で",
    "home.social.noCreditCard": "クレジットカード不要",
    "home.social.signupFree": "無料で登録",
    "home.steps.title": "3つの簡単なステップで無料QRコードを作成する方法",
    "home.steps.1.title": "QRコードのタイプを選ぶ",
    "home.steps.1.body":
      "QRコードのタイプ（静的または動的）を、やりたいことに基づいて選んでください：URLを開く、PDFを共有、メニューを表示、連絡先を共有など。",
    "home.steps.2.title": "カスタマイズ",
    "home.steps.2.body":
      "詳細を追加し、色を変え、QRコードをスタイルし、ロゴを追加し、ダウンロード前にリアルタイムでテスト。",
    "home.steps.3.title": "ダウンロードして共有",
    "home.steps.3.body": "PNGまたはSVG形式を選び、ダウンロードを押すだけでどこでも共有できます！",
    "home.steps.cta": "無料QRコードを作成",
    "home.explained.title": "QRコードとは",
    "home.explained.what.title": "QRコードとは？",
    "home.explained.what.body":
      "QRコードは、URL、連絡先情報、決済データ、テキストなどの情報を黒白のマス目グリッドに保存する二次元バーコードです。スマートフォンのカメラでスキャンすると、入力なしに保存されたコンテンツに即座にアクセスできます。",
    "home.explained.why.title": "なぜ2026年にこれほど多くの人がQRコードを使うのか？",
    "home.explained.why.body":
      "QRコードは、オフラインの体験をデジタルコンテンツに繋ぐ、高速でタッチレス、低コストな方法を提供します。企業はリアルタイムの更新や印刷の無駄を減らすために活用し、スマートフォンのカメラだけでユーザーに即座のアクセスを提供します。",
    "home.explained.how.1":
      "スマートフォンまたはタブレットのカメラアプリを開きます。ほとんどの最近のデバイスはQRコードを自動的にスキャンします。",
    "home.explained.how.2": "カメラをQRコードに向ける。明確にフレーム内に見えることを確認します。",
    "home.explained.how.3": "カメラがコードを認識するまで数秒間静かに保持します。",
    "home.explained.how.4":
      "表示される通知またはリンクをタップして、ウェブサイト、ビデオ、または名刺を開きます。",
    "home.dashboard.title": "1つのダッシュボードからすべてのQRコードを管理",
    "home.dashboard.body":
      "1つの使いやすいダッシュボードから無制限のQRコードを作成、編集、追跡。デスティネーションを更新し、分析を表示し、チームと連携。",
    "home.dashboard.cta": "無料で試す",
    "home.features.title":
      "なぜ4千人以上のユーザーがROI重視のQRコードキャンペーンにUnifiedQRを信頼するのか",
    "home.features.track.title": "すべてのスキャンを追跡",
    "home.features.track.body":
      "リアルタイムのインサイトでQRコードキャンペーンのパフォーマンスを把握。スキャン数、ユニークユーザー、場所、デバイスのデータを取得。",
    "home.features.dynamic.title": "無料動的QRコード",
    "home.features.dynamic.body":
      "無料で最大2つの動的QRコードを作成し、コンテンツをいつでも更新可能。",
    "home.features.collab.title": "チームとコラボレーション",
    "home.features.collab.body":
      "最大5人のチームメンバーを招待し、1つのダッシュボードでQRコードを管理・共有。",
    "home.features.support.title": "24時間年中無休のカスタマーサポート",
    "home.features.support.body":
      "チームは、メールまたは電話で問題を素早く解決する準備がいつもできています。",
    "home.features.pay.title": "使った分だけ支払い",
    "home.features.pay.body": "柔軟な料金設定 — 必要な機能や追加コードのみ支払い。",
    "home.features.cta": "Flexプランを見る",
    "home.types.title": "無料で作成できるQRコードの種類は？",
    "home.types.cta": "すべてのQRコードタイプを見る",
    "home.faq.title": "よくある質問",
    "home.faq.1.q": "QRコードは永遠に無料ですか？",
    "home.faq.1.a":
      "はい。ここで作成するすべての静的QRコードは無料で、有効期限がなく、スキャン制限もありません。PNGまたはSVGでダウンロードし、商用利用も可能です。",
    "home.faq.2.q": "静的QRコードと動的QRコードの違いは何ですか？",
    "home.faq.2.a":
      "静的QRコードはデータをコード内に直接保存するため、変更することはできません。動的QRコードはあなたが管理する短縮リンクを指すため、デスティネーションをいつでも編集し、スキャンを追跡できます。",
    "home.faq.3.q": "QRコードにロゴを追加できますか？",
    "home.faq.3.a":
      "はい。テンプレートを選択し、色を調整し、カスタマイズパネルでロゴを追加します。スキャナーが確実にコードを読み取れるように、ロゴは小さく保ちます。",
    "home.faq.4.q": "どのファイル形式をダウンロードすべきですか？",
    "home.faq.4.a":
      "画面、ソーシャル投稿、ドキュメントにはPNGを使用。印刷、大型看板、品質を損なわずにリサイズする必要がある場所にはSVGを使用。",
    "home.faq.5.q": "QRコードに有効期限はありますか？",
    "home.faq.5.a":
      "静的QRコードに有効期限はありません。動的QRコードはアカウントがアクティブな限りアクティブで、デスティネーションはいつでも変更できます。",
  },
  ko: {
    "nav.products": "제품",
    "nav.types": "QR 코드 유형",
    "nav.pricing": "요금",
    "nav.contact": "문의",
    "nav.resources": "리소스",
    "nav.language": "언어",
    "header.signIn": "로그인",
    "auth.title": "돌아오신 것을 환영합니다",
    "auth.subtitle":
      "저장된 코드, 동적 링크 및 스캔 분석을 관리하려면 워크스페이스에 로그인하세요.",
    "auth.signInWith": "Google로 계속",
    "auth.busy": "Google 열기…",
    "auth.googleOnly": "Google은 현재 유일한 로그인 방법입니다.",
    "auth.back": "← 무료 생성기로 돌아가기",
    "auth.brand.tagline": "생성하는 모든 QR 코드를 위한 워크스페이스.",
    "auth.brand.dynamic": "인쇄 후 재지정할 수 있는 동적 짧은 링크.",
    "auth.brand.analytics": "모든 동적 코드에서 스캔 추적, 첫 스캔부터 실시간.",
    "auth.brand.templates": "13개 스튜디오 템플릿, 맞춤 색상, PNG 및 SVG 내보내기.",
    "auth.brand.secure": "Google 인증 로그인. 비밀번호 저장 없음.",
    "auth.error.notAuthorized": "이 이메일은 관리 패널에 대한 접근이 허가되지 않았습니다.",
    "auth.signOut": "로그아웃",
    "pricing.title": "사용한 것만 지불",
    "pricing.subtitle":
      "모든 플랜에 무제한 무료 정적 QR 코드가 포함됩니다. 추적, 편집 가능한 코드 또는 팀 액세스가 필요할 때 업그레이드하세요.",
    "pricing.mostPopular": "가장 인기",
    "pricing.perMonth": "월",
    "pricing.forever": "영원히",
    "pricing.startFree": "무료로 시작",
    "pricing.chooseFlex": "Flex 선택",
    "pricing.choosePro": "Pro 선택",
    "pricing.freeFeatures": [
      "무제한 정적 QR 코드",
      "2개 동적 QR 코드",
      "PNG 및 SVG 다운로드",
      "13개 디자인 템플릿",
      "상업적 사용",
    ],
    "pricing.flexFeatures": [
      "Free의 모든 것",
      "25개 동적 QR 코드",
      "스캔 분석 및 위치",
      "로고 업로드",
      "이메일 지원",
    ],
    "pricing.proFeatures": [
      "Flex의 모든 것",
      "무제한 동적 QR 코드",
      "5명 팀원",
      "대량 생성 및 API 액세스",
      "맞춤 짧은 도메인",
      "24/7 우선 지원",
    ],
    "billing.title": "결제",
    "billing.subtitle":
      "플랜 제한, 업그레이드 및 인보이스. 결제는 Cashfree를 통해 안전하게 처리됩니다.",
    "billing.current": "현재",
    "billing.upgrade": "업그레이드",
    "billing.yourPlan": "내 플랜",
    "billing.checkout": "결제 시작…",
    "billing.signInToUpgrade": "플랜을 업그레이드하려면 로그인하세요.",
    "footer.tagline":
      "무료 QR 코드 생성, 편집 및 캠페인 성과 추적을 위한 올인원 도구. 전 세계 4K 이상의 사용자가 신뢰합니다.",
    "footer.product": "제품",
    "footer.qrCodes": "QR 코드",
    "footer.company": "회사",
    "footer.legal": "법적 정보",
    "admin.unauthorized": "이 이메일은 관리 패널 로그인이 허가되지 않았습니다.",
    "admin.signInToContinue": "계속하려면 Google로 로그인하세요.",
    "visitor.today": "오늘의 방문자",
    "chooser.title": "언어 선택",
    "chooser.subtitle": "계속하려면 선호하는 언어를 선택하세요",
    "home.hero.title": "UnifiedQR — 무료 QR 코드 생성기",
    "home.hero.subtitle":
      "웹사이트, PDF, 연락처, SMS 등을 위한 무료 QR 코드를 생성하세요. 색상을 사용자 정의하고, PNG 또는 SVG로 다운로드하며, 모든 스캔을 추적하세요 — 모든것을 하나의 대시보드에서.",
    "home.social.trusted": "신뢰하는",
    "home.social.users": "4,000명 이상의 사용자",
    "home.social.onGoogle": "Google에서",
    "home.social.noCreditCard": "신용카드 불필요",
    "home.social.signupFree": "무료로 가입하세요",
    "home.steps.title": "간단한 3단계로 무료 QR 코드 만드는 방법",
    "home.steps.1.title": "QR 코드 유형 선택",
    "home.steps.1.body":
      "QR 코드 유형(정적 또는 동적)을 용도에 따라 선택하세요: URL 열기, PDF 공유, 메뉴 표시, 연락처 공유 등.",
    "home.steps.2.title": "원하는 대로 사용자 정의",
    "home.steps.2.body":
      "세부 정보를 추가하고, 색상을 변경하고, QR 코드를 스타일링하고, 로고를 추가하고, 다운로드하기 전에 실시간으로 테스트하세요.",
    "home.steps.3.title": "다운로드 및 공유",
    "home.steps.3.body":
      "PNG 또는 SVG 형식을 선택하고, 다운로드를 누르면 어디서든 공유할 준비가 완료!",
    "home.steps.cta": "무료 QR 코드 만들기",
    "home.explained.title": "QR 코드 설명",
    "home.explained.what.title": "QR 코드란?",
    "home.explained.what.body":
      "QR 코드는 URL, 연락처 정보, 결제 데이터 또는 텍스트와 같은 정보를 흰색과 검은색 격자 그리드에 저장하는 2차원 바코드입니다. 타이핑 없이 저장된 콘텐츠에 즉시 액세스하려면 스마트폰 카메라로 스캔할 수 있습니다.",
    "home.explained.why.title": "왜 2026년에 이렇게 많은 사람들이 QR 코드를 사용하나요?",
    "home.explained.why.body":
      "QR 코드는 오프라인 경험을 디지털 콘텐츠에 연결하는 빠르고 비접촉적이며 저비용 방식을 제공합니다. 기업은 실시간 업데이트와 인쇄 낭비를 줄이면서 스마트폰 카메라만으로 사용자에게 즉시 액세스를 제공합니다.",
    "home.explained.how.title": "QR 코드를 어떻게 스캔하나요?",
    "home.explained.how.1":
      "스마트폰이나 태블릿에서 카메라 앱을 엽니다. 대부분의 최신 기기는 QR 코드를 자동으로 스캔합니다.",
    "home.explained.how.2":
      "카메라를 QR 코드를 향하고, 코드가 프레임 안에서 명확하게 보이는지 확인합니다.",
    "home.explained.how.3": "카메라가 코드를 인식할 때까지 몇 초 동안 움직이지 마세요.",
    "home.explained.how.4": "알림이나 링크를 눌러 웹사이트, 비디오 또는 연락처 카드를 엽니다.",
    "home.dashboard.title": "하나의 대시보드에서 모든 QR 코드 관리",
    "home.dashboard.body":
      "하나의 사용하기 쉬운 대시보드에서 무제한 QR 코드를 생성, 편집 및 추적합니다. 대상을 업데이트하고, 분석을 확인하고, 팀과 협업하세요.",
    "home.dashboard.cta": "지금 무료로 사용해 보세요",
    "home.features.title":
      "왜 4,000명 이상의 사용자가 ROI 중심 QR 코드 캠페인에 UnifiedQR을 신뢰하나요",
    "home.features.track.title": "모든 스캔 추적",
    "home.features.track.body":
      "실시간 인사이트로 QR 코드 캠페인의 성능을 파악하세요. 스캔, 고유 사용자, 위치 및 기기에 대한 데이터를 받으세요.",
    "home.features.dynamic.title": "무료 동적 QR 코드",
    "home.features.dynamic.body":
      "무료로 최대 2개의 동적 QR 코드를 생성하고 언제든지 콘텐츠를 업데이트하세요.",
    "home.features.collab.title": "팀과 협업",
    "home.features.collab.body":
      "최대 5명의 팀원을 초대하여 하나의 대시보드에서 QR 코드를 관리하고 공유하세요.",
    "home.features.support.title": "24/7 고객 지원",
    "home.features.support.body":
      "우리 팀은 이메일이나 전화를 통해 문제를 빠르게 해결할 준비가 항상 되어 있습니다.",
    "home.features.pay.title": "사용한 것만 지불",
    "home.features.pay.body": "유연한 가격 — 필요한 기능이나 추가 코드에 대해서만 지불하세요.",
    "home.features.cta": "Flex 플랜 살펴보기",
    "home.types.title": "무료로 만들 수 있는 QR 코드 유형은?",
    "home.types.cta": "모든 QR 코드 유형 보기",
    "home.faq.title": "자주 묻는 질문",
    "home.faq.1.q": "QR 코드가 영원히 무료인가요?",
    "home.faq.1.a":
      "네. 여기서 만드는 모든 정적 QR 코드는 무료이며, 만료일이 없고, 스캔 제한이 없습니다. PNG 또는 SVG로 다운로드하여 상업적으로 사용할 수 있습니다.",
    "home.faq.2.q": "정적 QR 코드와 동적 QR 코드의 차이점은?",
    "home.faq.2.a":
      "정적 QR 코드는 데이터를 코드 내부에 직접 저장하므로 변경할 수 없습니다. 동적 QR 코드는 당신이 제어하는 짧은 링크를 가리키므로 대상을 언제든 편집하고 스캔을 추적할 수 있습니다.",
    "home.faq.3.q": "QR 코드에 로고를 추가할 수 있나요?",
    "home.faq.3.a":
      "네. 템플릿을 선택하고, 색상을 조정하고, 사용자 정의 패널에서 로고를 추가하세요. 스캐너가 코드를 안정적으로 읽을 수 있도록 로고는 작게 유지하세요.",
    "home.faq.4.q": "어떤 파일 형식을 다운로드해야 하나요?",
    "home.faq.4.a":
      "화면, 소셜 게시물 및 문서에는 PNG를 사용하세요. 인쇄, 대형 포맷 간판 또는 품질 손실 없이 크기를 조정해야 하는 곳에는 SVG를 사용하세요.",
    "home.faq.5.q": "QR 코드에 만료일이 있나요?",
    "home.faq.5.a":
      "정적 QR 코드는 만료되지 않습니다. 동적 QR 코드는 계정이 활성화된 동안 활성 상태를 유지하며, 대상을 언제든 변경할 수 있습니다.",
  },
  "zh-CN": {
    "nav.products": "产品",
    "nav.types": "二维码类型",
    "nav.pricing": "价格",
    "nav.contact": "联系我们",
    "nav.resources": "资源",
    "nav.language": "语言",
    "header.signIn": "登录",
    "auth.title": "欢迎回来",
    "auth.subtitle": "登录您的工作区以管理已保存的代码、动态链接和扫描分析。",
    "auth.signInWith": "使用 Google 继续",
    "auth.busy": "正在打开 Google…",
    "auth.googleOnly": "Google 是目前唯一的登录方式。",
    "auth.back": "← 返回免费生成器",
    "auth.brand.tagline": "为您创建的每个二维码提供一个工作区。",
    "auth.brand.dynamic": "印刷后可重新指向的动态短链接。",
    "auth.brand.analytics": "每个动态代码的扫描跟踪，从第一次扫描开始实时更新。",
    "auth.brand.templates": "13 个工作室模板、自定义颜色、PNG 和 SVG 导出。",
    "auth.brand.secure": "Google 验证登录。不存储密码。",
    "auth.error.notAuthorized": "此邮箱未被授权访问管理面板。",
    "auth.signOut": "退出登录",
    "pricing.title": "只为您使用的付费",
    "pricing.subtitle":
      "每个套餐都包含无限免费静态二维码。当您需要跟踪、可编辑代码或团队访问时，请升级。",
    "pricing.mostPopular": "最受欢迎",
    "pricing.perMonth": "每月",
    "pricing.forever": "永久",
    "pricing.startFree": "免费开始",
    "pricing.chooseFlex": "选择 Flex",
    "pricing.choosePro": "选择 Pro",
    "pricing.freeFeatures": [
      "无限静态二维码",
      "2 个动态二维码",
      "PNG 和 SVG 下载",
      "13 个设计模板",
      "商业使用",
    ],
    "pricing.flexFeatures": [
      "Free 的所有功能",
      "25 个动态二维码",
      "扫描分析和位置",
      "Logo 上传",
      "邮件支持",
    ],
    "pricing.proFeatures": [
      "Flex 的所有功能",
      "无限动态二维码",
      "5 名团队成员",
      "批量创建和 API 访问",
      "自定义短域名",
      "24/7 优先支持",
    ],
    "billing.title": "账单",
    "billing.subtitle": "套餐限制、升级和发票。付款通过 Cashfree 安全处理。",
    "billing.current": "当前",
    "billing.upgrade": "升级",
    "billing.yourPlan": "您的套餐",
    "billing.checkout": "正在开始结账…",
    "billing.signInToUpgrade": "登录以升级您的套餐。",
    "footer.tagline":
      "创建免费二维码、编辑和跟踪广告系列效果的一体化工具。全球超过 4K 用户的信赖之选。",
    "footer.product": "产品",
    "footer.qrCodes": "二维码",
    "footer.company": "公司",
    "footer.legal": "法律信息",
    "admin.unauthorized": "此邮箱未被授权登录管理面板。",
    "admin.signInToContinue": "使用 Google 登录以继续。",
    "visitor.today": "今日访客",
    "chooser.title": "选择您的语言",
    "chooser.subtitle": "选择您偏好的语言以继续",
    "home.hero.title": "UnifiedQR — 免费二维码生成器",
    "home.hero.subtitle":
      "为网站、PDF、联系人、短信等创建免费二维码。自定义颜色、以PNG或SVG下载，并跟踪每次扫描 — 全部从一个仪表板完成。",
    "home.social.trusted": "值得信赖",
    "home.social.users": "4,000+ 用户",
    "home.social.onGoogle": "在 Google 上",
    "home.social.noCreditCard": "无需信用卡",
    "home.social.signupFree": "免费注册",
    "home.steps.title": "3个简单步骤创建免费二维码",
    "home.steps.1.title": "选择二维码类型",
    "home.steps.1.body":
      "根据用途选择二维码类型（静态或动态）：打开网址、分享PDF、显示菜单、分享联系信息等。",
    "home.steps.2.title": "自定义您的样式",
    "home.steps.2.body": "添加详情、更改颜色、设计二维码样式、添加logo，并在下载前实时测试。",
    "home.steps.3.title": "下载并分享",
    "home.steps.3.body": "选择PNG或SVG格式，点击下载，即可随时随地分享！",
    "home.steps.cta": "创建免费二维码",
    "home.explained.title": "二维码详解",
    "home.explained.what.title": "什么是二维码？",
    "home.explained.what.body":
      "二维码是一种二维条形码，在黑白方格网格中存储信息，如网址、联系信息、支付数据或文本。可以用智能手机摄像头扫描，无需输入即可即时访问存储的内容。",
    "home.explained.why.title": "为什么2026年这么多人使用二维码？",
    "home.explained.why.body":
      "二维码提供了一种快速、非接触式、低成本的方式，将线下体验与数字内容连接起来。企业依靠它们进行实时更新和减少印刷浪费，同时只需智能手机摄像头即可让用户即时访问。",
    "home.explained.how.title": "如何扫描二维码？",
    "home.explained.how.1": "在智能手机或平板电脑上打开相机应用。大多数现代设备会自动扫描二维码。",
    "home.explained.how.2": "将相机对准二维码，确保其在画面内清晰可见。",
    "home.explained.how.3": "保持几秒钟不动，直到相机识别出代码。",
    "home.explained.how.4": "点击出现的通知或链接，打开网站、视频或名片。",
    "home.dashboard.title": "从一个仪表板管理所有二维码",
    "home.dashboard.body":
      "从一个易于使用的仪表板创建、编辑和跟踪无限量的二维码。更新目的地、查看分析并与团队协作。",
    "home.dashboard.cta": "立即免费试用",
    "home.features.title": "为什么4千多名用户信任UnifiedQR进行高ROI二维码营销活动",
    "home.features.track.title": "跟踪每次扫描",
    "home.features.track.body":
      "通过实时洞察了解二维码营销活动的表现。获取扫描、独立用户、位置和设备数据。",
    "home.features.dynamic.title": "免费动态二维码",
    "home.features.dynamic.body": "免费创建最多2个动态二维码，并随时更新其内容。",
    "home.features.collab.title": "与团队协作",
    "home.features.collab.body": "邀请最多5名团队成员在一个仪表板上管理和分享二维码。",
    "home.features.support.title": "24/7 客户支持",
    "home.features.support.body": "我们的团队随时准备通过电子邮件或电话快速解决问题。",
    "home.features.pay.title": "只为使用的付费",
    "home.features.pay.body": "灵活定价 — 只需为所需的功能或额外代码付费。",
    "home.features.cta": "探索 Flex 计划",
    "home.types.title": "可以免费创建哪些类型的二维码？",
    "home.types.cta": "查看所有二维码类型",
    "home.faq.title": "常见问题",
    "home.faq.1.q": "二维码永远免费吗？",
    "home.faq.1.a":
      "是的。您在此创建的每个静态二维码都是免费的，没有过期日期和扫描限制。您可以将其下载为PNG或SVG并用于商业用途。",
    "home.faq.2.q": "静态和动态二维码有什么区别？",
    "home.faq.2.a":
      "静态二维码直接将数据存储在代码内部，因此永远无法更改。动态二维码指向您控制的短链接，因此您可以随时编辑目的地并跟踪扫描。",
    "home.faq.3.q": "我可以将logo添加到二维码吗？",
    "home.faq.3.a":
      "可以。选择模板，调整颜色，并在自定义面板中添加logo。保持logo较小，以便扫描器仍然可以可靠地读取代码。",
    "home.faq.4.q": "应该下载哪种文件格式？",
    "home.faq.4.a": "屏幕、社交帖子和文档使用PNG。印刷、大型标识或需要无损缩放的任何地方使用SVG。",
    "home.faq.5.q": "二维码会过期吗？",
    "home.faq.5.a":
      "静态二维码永不过期。动态二维码在您的账户保持活动期间保持活动状态，您可以随时更改其指向。",
  },
  "zh-TW": {
    "nav.products": "產品",
    "nav.types": "QR Code 類型",
    "nav.pricing": "價格",
    "nav.contact": "聯絡我們",
    "nav.resources": "資源",
    "nav.language": "語言",
    "header.signIn": "登入",
    "auth.title": "歡迎回來",
    "auth.subtitle": "登入您的工作區以管理儲存的代碼、動態連結和掃描分析。",
    "auth.signInWith": "使用 Google 繼續",
    "auth.busy": "正在開啟 Google…",
    "auth.googleOnly": "Google 是目前唯一的登入方式。",
    "auth.back": "← 返回免費產生器",
    "auth.brand.tagline": "為您建立的每個 QR Code 提供一個工作區。",
    "auth.brand.dynamic": "印刷後可重新指向的動態短連結。",
    "auth.brand.analytics": "每個動態代碼的掃描追蹤，從第一次掃描開始即時更新。",
    "auth.brand.templates": "13 個工作室模板、自訂色彩、PNG 和 SVG 匯出。",
    "auth.brand.secure": "Google 驗證登入。不儲存密碼。",
    "auth.error.notAuthorized": "此電子郵件未被授權存取管理面板。",
    "auth.signOut": "登出",
    "pricing.title": "只為您使用的付費",
    "pricing.subtitle":
      "每個方案都包含無限免費靜態 QR Code。當您需要追蹤、可編輯代碼或團隊存取時，請升級。",
    "pricing.mostPopular": "最受歡迎",
    "pricing.perMonth": "每月",
    "pricing.forever": "永久",
    "pricing.startFree": "免費開始",
    "pricing.chooseFlex": "選擇 Flex",
    "pricing.choosePro": "選擇 Pro",
    "pricing.freeFeatures": [
      "無限靜態 QR Code",
      "2 個動態 QR Code",
      "PNG 和 SVG 下載",
      "13 個設計模板",
      "商業使用",
    ],
    "pricing.flexFeatures": [
      "Free 的所有功能",
      "25 個動態 QR Code",
      "掃描分析和位置",
      "Logo 上傳",
      "電子郵件支援",
    ],
    "pricing.proFeatures": [
      "Flex 的所有功能",
      "無限動態 QR Code",
      "5 名團隊成員",
      "批量建立和 API 存取",
      "自訂短網域",
      "24/7 優先支援",
    ],
    "billing.title": "帳單",
    "billing.subtitle": "方案限制、升級和發票。付款透過 Cashfree 安全處理。",
    "billing.current": "目前",
    "billing.upgrade": "升級",
    "billing.yourPlan": "您的方案",
    "billing.checkout": "正在開始結帳…",
    "billing.signInToUpgrade": "登入以升級您的方案。",
    "footer.tagline":
      "建立免費 QR Code、編輯和追蹤行銷活動效果的一體化工具。全球超過 4K 用戶的信賴之選。",
    "footer.product": "產品",
    "footer.qrCodes": "QR Code",
    "footer.company": "公司",
    "footer.legal": "法律資訊",
    "admin.unauthorized": "此電子郵件未被授權登入管理面板。",
    "admin.signInToContinue": "使用 Google 登入以繼續。",
    "visitor.today": "今日訪客",
    "chooser.title": "選擇您的語言",
    "chooser.subtitle": "選擇您偏好的語言以繼續",
    "home.hero.title": "UnifiedQR — 免費 QR Code 產生器",
    "home.hero.subtitle":
      "為網站、PDF、聯絡人、簡訊等建立免費 QR Code。自訂色彩、以 PNG 或 SVG 下載，並追蹤每次掃描 — 全部從一個儀表板完成。",
    "home.social.trusted": "值得信賴",
    "home.social.users": "4,000+ 用戶",
    "home.social.onGoogle": "在 Google 上",
    "home.social.noCreditCard": "無需信用卡",
    "home.social.signupFree": "免費註冊",
    "home.steps.title": "3 個簡單步驟建立免費 QR Code",
    "home.steps.1.title": "選擇 QR Code 類型",
    "home.steps.1.body":
      "根據用途選擇 QR Code 類型（靜態或動態）：開啟網址、分享 PDF、顯示選單、分享聯絡資訊等。",
    "home.steps.2.title": "自訂您的樣式",
    "home.steps.2.body": "新增詳情、變更顏色、設計 QR Code 樣式、新增 logo，並在下載前即時測試。",
    "home.steps.3.title": "下載並分享",
    "home.steps.3.body": "選擇 PNG 或 SVG 格式，按下下載，即可隨處分享！",
    "home.steps.cta": "建立免費 QR Code",
    "home.explained.title": "QR Code 詳解",
    "home.explained.what.title": "什麼是 QR Code？",
    "home.explained.what.body":
      "QR Code 是一種二維條碼，在黑白方格網格中儲存資訊，如網址、聯絡資訊、付款資料或文字。可以用智慧型手機相機掃描，無需輸入即可立即存取儲存的內容。",
    "home.explained.why.title": "為什麼 2026 年這麼多人使用 QR Code？",
    "home.explained.why.body":
      "QR Code 提供一種快速、非接觸、低成本的方式，將線下體驗與數位內容連結。企業依靠它們進行即時更新並減少印刷浪費，同時只需智慧型手機相機即可讓使用者即時存取。",
    "home.explained.how.title": "如何掃描 QR Code？",
    "home.explained.how.1":
      "在智慧型手機或平板電腦上開啟相機應用程式。大多數現代裝置會自動掃描 QR Code。",
    "home.explained.how.2": "將相機對準 QR Code，確保其在畫面內清晰可見。",
    "home.explained.how.3": "保持幾秒鐘不動，直到相機辨識出代碼。",
    "home.explained.how.4": "點擊出現的通知或連結，開啟網站、影片或名片。",
    "home.dashboard.title": "從一個儀表板管理所有 QR Code",
    "home.dashboard.body":
      "從一個易於使用的儀表板建立、編輯和追蹤無限量的 QR Code。更新目的地、檢視分析報告並與團隊協作。",
    "home.dashboard.cta": "立即免費試用",
    "home.features.title": "為什麼 4 千多名使用者信任 UnifiedQR 進行高 ROI QR Code 行銷活動",
    "home.features.track.title": "追蹤每次掃描",
    "home.features.track.body":
      "透過即時洞察了解 QR Code 行銷活動的表現。取得掃描、獨立使用者、位置和裝置資料。",
    "home.features.dynamic.title": "免費動態 QR Code",
    "home.features.dynamic.body": "免費建立最多 2 個動態 QR Code，並隨時更新其內容。",
    "home.features.collab.title": "與團隊協作",
    "home.features.collab.body": "邀請最多 5 名團隊成員在一個儀表板上管理和分享 QR Code。",
    "home.features.support.title": "24/7 客戶支援",
    "home.features.support.body": "我們的團隊隨時準備透過電子郵件或電話快速解決問題。",
    "home.features.pay.title": "只為使用的付費",
    "home.features.pay.body": "彈性定價 — 只需為所需的功能或額外代碼付費。",
    "home.features.cta": "探索 Flex 方案",
    "home.types.title": "可以免費建立哪些類型的 QR Code？",
    "home.types.cta": "查看所有 QR Code 類型",
    "home.faq.title": "常見問題",
    "home.faq.1.q": "QR Code 永遠免費嗎？",
    "home.faq.1.a":
      "是的。您在此建立的每個靜態 QR Code 都是免費的，沒有到期日和掃描限制。您可以將其下載為 PNG 或 SVG 並用於商業用途。",
    "home.faq.2.q": "靜態和動態 QR Code 有什麼區別？",
    "home.faq.2.a":
      "靜態 QR Code 將資料直接儲存在代碼內部，因此永遠無法更改。動態 QR Code 指向您控制的短連結，因此您可以隨時編輯目的地並追蹤掃描。",
    "home.faq.3.q": "我可以將 logo 新增到 QR Code 嗎？",
    "home.faq.3.a":
      "可以。選擇範本，調整色彩，並在自訂面板中新增 logo。保持 logo 較小，以便掃描器仍然可以可靠地讀取代碼。",
    "home.faq.4.q": "應該下載哪種檔案格式？",
    "home.faq.4.a":
      "螢幕、社交貼文和文件使用 PNG。印刷、大型標識或需要無損縮放的任何地方使用 SVG。",
    "home.faq.5.q": "QR Code 會過期嗎？",
    "home.faq.5.a":
      "靜態 QR Code 永不過期。動態 QR Code 在您的帳戶保持活動期間保持活動狀態，您可以隨時更改其指向。",
  },
  th: {
    "nav.products": "ผลิตภัณฑ์",
    "nav.types": "ประเภท QR Code",
    "nav.pricing": "ราคา",
    "nav.contact": "ติดต่อ",
    "nav.resources": "ทรัพยากร",
    "nav.language": "ภาษา",
    "header.signIn": "เข้าสู่ระบบ",
    "auth.title": "ยินดีต้อนรับกลับ",
    "auth.subtitle":
      "เข้าสู่ระบบพื้นที่ทำงานของคุณเพื่อจัดการโค้ดที่บันทึกไว้ ลิงก์ไดนามิก และการวิเคราะห์การสแกน",
    "auth.signInWith": "ดำเนินการต่อด้วย Google",
    "auth.busy": "กำลังเปิด Google…",
    "auth.googleOnly": "Google เป็นวิธีเข้าสู่ระบบเดียวในปัจจุบัน",
    "auth.back": "← กลับไปยังตัวสร้างฟรี",
    "auth.brand.tagline": "พื้นที่ทำงานสำหรับ QR Code ทุกรหัสที่คุณสร้าง",
    "auth.brand.dynamic": "ลิงก์สั้นไดนามิกที่คุณสามารถเปลี่ยนทิศทางได้หลังพิมพ์",
    "auth.brand.analytics": "การติดตามการสแกนบนโค้ดไดนามิกทุกรหัส แบบเรียลไทม์ตั้งแต่การสแกนแรก",
    "auth.brand.templates": "13 เทมเพลตสตูดิโอ สีที่กำหนดเอง การส่งออก PNG และ SVG",
    "auth.brand.secure": "การเข้าสู่ระบบยืนยันโดย Google ไม่มีการจัดเก็บรหัสผ่าน",
    "auth.error.notAuthorized": "อีเมลนี้ไม่ได้รับอนุญาตให้เข้าถึงแผงผู้ดูแล",
    "auth.signOut": "ออกจากระบบ",
    "pricing.title": "จ่ายเฉพาะสิ่งที่คุณใช้",
    "pricing.subtitle":
      "ทุกแพ็กเกจรวม QR Code แบบคงที่ฟรีไม่จำกัด อัปเกรดเมื่อคุณต้องการการติดตาม โค้ดที่แก้ไขได้ หรือการเข้าถึงทีม",
    "pricing.mostPopular": "ยอดนิยม",
    "pricing.perMonth": "ต่อเดือน",
    "pricing.forever": "ตลอดกาล",
    "pricing.startFree": "เริ่มต้นฟรี",
    "pricing.chooseFlex": "เลือก Flex",
    "pricing.choosePro": "เลือก Pro",
    "pricing.freeFeatures": [
      "QR Code แบบคงที่ไม่จำกัด",
      "2 QR Code ไดนามิก",
      "ดาวน์โหลด PNG และ SVG",
      "13 เทมเพลตการออกแบบ",
      "การใช้งานเชิงพาณิชย์",
    ],
    "pricing.flexFeatures": [
      "ทุกอย่างใน Free",
      "25 QR Code ไดนามิก",
      "การวิเคราะห์การสแกนและตำแหน่ง",
      "อัปโหลดโลโก้",
      "การสนับสนุนทางอีเมล",
    ],
    "pricing.proFeatures": [
      "ทุกอย่างใน Flex",
      "QR Code ไดนามิกไม่จำกัด",
      "สมาชิกทีม 5 คน",
      "การสร้างแบบ.bulkและการเข้าถึง API",
      "โดเมนสั้นที่กำหนดเอง",
      "การสนับสนุนลำดับที่ 24/7",
    ],
    "billing.title": "การเรียกเก็บเงิน",
    "billing.subtitle":
      "ขีดจำกัดแพ็กเกจ การอัปเกรด และใบแจ้งหนี้ การชำระเงินได้รับการประมวลผลอย่างปลอดภัยผ่าน Cashfree",
    "billing.current": "ปัจจุบัน",
    "billing.upgrade": "อัปเกรด",
    "billing.yourPlan": "แพ็กเกจของคุณ",
    "billing.checkout": "กำลังเริ่มชำระเงิน…",
    "billing.signInToUpgrade": "เข้าสู่ระบบเพื่ออัปเกรดแพ็กเกจของคุณ",
    "footer.tagline":
      "เครื่องมือครบวงจรสำหรับสร้าง QR Code ฟรี แก้ไข และติดตามผลการดำเนินแคมเปญ ได้รับความไว้วางใจจากผู้ใช้กว่า 4K ทั่วโลก",
    "footer.product": "ผลิตภัณฑ์",
    "footer.qrCodes": "QR Code",
    "footer.company": "บริษัท",
    "footer.legal": "กฎหมาย",
    "admin.unauthorized": "อีเมลนี้ไม่ได้รับอนุญาตให้เข้าสู่ระบบแผงผู้ดูแล",
    "admin.signInToContinue": "เข้าสู่ระบบด้วย Google เพื่อดำเนินการต่อ",
    "visitor.today": "ผู้เข้าชมวันนี้",
    "chooser.title": "เลือกภาษาของคุณ",
    "chooser.subtitle": "เลือกภาษาที่ต้องการเพื่อดำเนินการต่อ",
    "home.hero.title": "UnifiedQR — เครื่องสร้าง QR Code ฟรี",
    "home.hero.subtitle":
      "สร้าง QR Code ฟรีสำหรับเว็บไซต์ ไฟล์ PDF ผู้ติดต่อ SMS และอื่นๆ ปรับแต่งสี ดาวน์โหลดเป็น PNG หรือ SVG และติดตามทุกการสแกน — ทั้งหมดจากแดชบอร์ดเดียว",
    "home.social.trusted": "เชื่อถือได้",
    "home.social.users": "ผู้ใช้ 4,000+ คน",
    "home.social.onGoogle": "บน Google",
    "home.social.noCreditCard": "ไม่ต้องใช้บัตรเครดิต",
    "home.social.signupFree": "สมัครสมาชิกฟรี",
    "home.steps.title": "วิธีสร้าง QR Code ฟรีใน 3 ขั้นตอนง่ายๆ",
    "home.steps.1.title": "เลือกประเภท QR Code ของคุณ",
    "home.steps.1.body":
      "เลือกประเภท QR Code (คงที่หรือไดนามิก) ตามวัตถุประสงค์: เปิด URL แชร์ PDF แสดงเมนู แชร์รายชื่อผู้ติดต่อ และอื่นๆ",
    "home.steps.2.title": "ปรับแต่งตามต้องการ",
    "home.steps.2.body":
      "เพิ่มรายละเอียด เปลี่ยนสี ออกแบบ QR Code เพิ่มโลโก้ และทดสอบแบบเรียลไทม์ก่อนดาวน์โหลด",
    "home.steps.3.title": "ดาวน์โหลดและแชร์",
    "home.steps.3.body": "เลือกฟอร์แมต PNG หรือ SVG กดดาวน์โหลด ก็พร้อมแชร์ได้ทุกที่!",
    "home.steps.cta": "สร้าง QR Code ฟรี",
    "home.explained.title": "QR Code อธิบาย",
    "home.explained.what.title": "QR Code คืออะไร?",
    "home.explained.what.body":
      "QR Code คือบาร์โค้ด 2 มิติที่เก็บข้อมูล เช่น URL รายชื่อผู้ติดต่อ ข้อมูลการชำระเงิน หรือข้อความ ในตารางสี่เหลี่ยมสีดำและสีขาว สามารถสแกนด้วยกล้องสมาร์ทโฟนเพื่อเข้าถึงเนื้อหาที่เก็บไว้ได้ทันทีโดยไม่ต้องพิมพ์",
    "home.explained.why.title": "ทำไมคนจำนวนมากถึงใช้ QR Code ในปี 2026?",
    "home.explained.why.body":
      "QR Code ให้วิธีที่รวดเร็ว ไม่สัมผัส และมีต้นทุนต่ำในการเชื่อมต่อประสบการณ์ออฟไลน์กับเนื้อหาดิจิทัล ธุรกิจพึ่งพา QR Code สำหรับการอัปเดตแบบเรียลไทม์และการลดการสิ้นเปลืองงานพิมพ์ ในขณะที่ให้ผู้ใช้เข้าถึงได้ทันทีเพียงแค่ใช้กล้องสมาร์ทโฟน",
    "home.explained.how.title": "จะสแกน QR Code ได้อย่างไร?",
    "home.explained.how.1":
      "เปิดแอปกล้องบนสมาร์ทโฟนหรือแท็บเล็ต อุปกรณ์สมัยใหม่ส่วนใหญ่จะสแกน QR Code โดยอัตโนมัติ",
    "home.explained.how.2": "หันกล้องไปที่ QR Code ตรวจสอบให้แน่ใจว่ามองเห็นได้ชัดเจนในกรอบ",
    "home.explained.how.3": "ถือนิ่งสักครู่จนกว่ากล้องจะจดจำโค้ด",
    "home.explained.how.4": "แตะการแจ้งเตือนหรือลิงก์ที่ปรากฏเพื่อเปิดเว็บไซต์ วิดีโอ หรือนามบัตร",
    "home.dashboard.title": "จัดการ QR Code ทั้งหมดจากแดชบอร์ดเดียว",
    "home.dashboard.body":
      "สร้าง แก้ไข และติดตาม QR Code ได้ไม่จำกัดจากแดชบอร์ดเดียวที่ใช้งานง่าย อัปเดตปลายทาง ดูการวิเคราะห์ และทำงานร่วมกับทีมของคุณ",
    "home.dashboard.cta": "ทดลองใช้ฟรีตอนนี้",
    "home.features.title":
      "ทำไมผู้ใช้มากกว่า 4 พันคนจึงเชื่อถือ UnifiedQR สำหรับแคมเปญ QR Code ที่ให้ ROI สูง",
    "home.features.track.title": "ติดตามทุกการสแกน",
    "home.features.track.body":
      "รู้ผลการดำเนินแคมเปญ QR Code ของคุณด้วยข้อมูลเชิงลึกแบบเรียลไทม์ รับข้อมูลเกี่ยวกับการสแกน ผู้ใช้ที่ไม่ซ้ำกัน ตำแหน่ง และอุปกรณ์",
    "home.features.dynamic.title": "QR Code ไดนามิกฟรี",
    "home.features.dynamic.body":
      "สร้าง QR Code ไดนามิกฟรีได้สูงสุด 2 รายการและอัปเดตเนื้อหาได้ทุกเมื่อ",
    "home.features.collab.title": "ร่วมงานกับทีม",
    "home.features.collab.body":
      "เชิญสมาชิกทีมสูงสุด 5 คนเพื่อจัดการและแชร์ QR Code บนแดชบอร์ดเดียว",
    "home.features.support.title": "ฝ่ายสนับสนุนลูกค้า 24/7",
    "home.features.support.body": "ทีมของเราพร้อมแก้ไขปัญหาอย่างรวดเร็วเสมอ ทางอีเมลหรือโทรศัพท์",
    "home.features.pay.title": "จ่ายเฉพาะที่คุณใช้",
    "home.features.pay.body": "ราคาที่ยืดหยุ่น — จ่ายเฉพาะฟีเจอร์หรือโค้ดเพิ่มเติมที่คุณต้องการ",
    "home.features.cta": "ดูแผน Flex",
    "home.types.title": "ประเภท QR Code ใดที่คุณสร้างได้ฟรี?",
    "home.types.cta": "ดู QR Code ทุกประเภท",
    "home.faq.title": "คำถามที่พบบ่อย",
    "home.faq.1.q": "QR Code ฟรีตลอดไปหรือไม่?",
    "home.faq.1.a":
      "ใช่ QR Code แบบคงที่ทุกรายการที่คุณสร้างที่นี่ฟรี ไม่มีวันหมดอายุ และไม่จำกัดการสแกน คุณสามารถดาวน์โหลดเป็น PNG หรือ SVG และใช้ในเชิงพาณิชย์ได้",
    "home.faq.2.q": "QR Code แบบคงที่และไดนามิกต่างกันอย่างไร?",
    "home.faq.2.a":
      "QR Code แบบคงที่เก็บข้อมูลโดยตรงในโค้ด จึงไม่สามารถเปลี่ยนแปลงได้ QR Code ไดนามิกชี้ไปที่ลิงก์สั้นที่คุณควบคุมได้ จึงแก้ไขปลายทางและติดตามการสแกนได้ทุกเมื่อ",
    "home.faq.3.q": "ฉันเพิ่มโลโก้ลง QR Code ได้หรือไม่?",
    "home.faq.3.a":
      "ได้ เลือกเทมเพลต ปรับสี และเพิ่มโลโก้ในแผงปรับแต่ง รักษาโลโก้ให้เล็กเพื่อให้เครื่องสแกนยังสามารถอ่านโค้ดได้อย่างน่าเชื่อถือ",
    "home.faq.4.q": "ควรดาวน์โหลดรูปแบบไฟล์ใด?",
    "home.faq.4.a":
      "ใช้ PNG สำหรับหน้าจอ โพสต์โซเชียล และเอกสาร ใช้ SVG สำหรับงานพิมพ์ ป้ายขนาดใหญ่ หรือทุกที่ที่ต้องการเปลี่ยนขนาดโดยไม่สูญเสียคุณภาพ",
    "home.faq.5.q": "QR Code มีวันหมดอายุหรือไม่?",
    "home.faq.5.a":
      "QR Code แบบคงที่ไม่มีวันหมดอายุ QR Code ไดนามิกจะยังคงใช้งานได้ตราบใดที่บัญชีของคุณยังใช้งานอยู่ และคุณสามารถเปลี่ยนปลายทางได้ทุกเมื่อ",
  },
  vi: {
    "nav.products": "Sản phẩm",
    "nav.types": "Loại QR Code",
    "nav.pricing": "Bảng giá",
    "nav.contact": "Liên hệ",
    "nav.resources": "Tài nguyên",
    "nav.language": "Ngôn ngữ",
    "header.signIn": "Đăng nhập",
    "auth.title": "Chào mừng trở lại",
    "auth.subtitle":
      "Đăng nhập vào không gian làm việc để quản lý mã đã lưu, liên kết động và phân tích quét.",
    "auth.signInWith": "Tiếp tục với Google",
    "auth.busy": "Đang mở Google…",
    "auth.googleOnly": "Google hiện là phương thức đăng nhập duy nhất.",
    "auth.back": "← Quay lại trình tạo miễn phí",
    "auth.brand.tagline": "Một không gian làm việc cho mỗi QR Code bạn tạo.",
    "auth.brand.dynamic": "Liên kết ngắn động có thể chỉnh hướng sau khi in.",
    "auth.brand.analytics": "Theo dõi quét trên mỗi mã động, thời gian thực từ lần quét đầu tiên.",
    "auth.brand.templates": "13 mẫu studio, màu tùy chỉnh, xuất PNG và SVG.",
    "auth.brand.secure": "Đăng nhập xác minh bởi Google. Không lưu mật khẩu.",
    "auth.error.notAuthorized": "Email này không được phép truy cập bảng quản trị.",
    "auth.signOut": "Đăng xuất",
    "pricing.title": "Chỉ trả cho những gì bạn sử dụng",
    "pricing.subtitle":
      "Mỗi gói bao gồm QR Code tĩnh miễn phí không giới hạn. Nâng cấp khi bạn cần theo dõi, mã có thể chỉnh sửa hoặc quyền truy cập nhóm.",
    "pricing.mostPopular": "Phổ biến nhất",
    "pricing.perMonth": "tháng",
    "pricing.forever": "mãi mãi",
    "pricing.startFree": "Bắt đầu miễn phí",
    "pricing.chooseFlex": "Chọn Flex",
    "pricing.choosePro": "Chọn Pro",
    "pricing.freeFeatures": [
      "QR Code tĩnh không giới hạn",
      "2 QR Code động",
      "Tải PNG & SVG",
      "13 mẫu thiết kế",
      "Sử dụng thương mại",
    ],
    "pricing.flexFeatures": [
      "Tất cả trong Free",
      "25 QR Code động",
      "Phân tích quét và vị trí",
      "Tải lên logo",
      "Hỗ trợ qua email",
    ],
    "pricing.proFeatures": [
      "Tất cả trong Flex",
      "QR Code động không giới hạn",
      "5 thành viên nhóm",
      "Tạo hàng loạt & truy cập API",
      "Tên miền ngắn tùy chỉnh",
      "Hỗ trợ ưu tiên 24/7",
    ],
    "billing.title": "Thanh toán",
    "billing.subtitle":
      "Giới hạn gói, nâng cấp và hóa đơn. Thanh toán được xử lý an toàn bởi Cashfree.",
    "billing.current": "Hiện tại",
    "billing.upgrade": "Nâng cấp",
    "billing.yourPlan": "Gói của bạn",
    "billing.checkout": "Bắt đầu thanh toán…",
    "billing.signInToUpgrade": "Đăng nhập để nâng cấp gói.",
    "footer.tagline":
      "Công cụ tất cả trong một để tạo QR Code miễn phí, chỉnh sửa và theo dõi hiệu suất chiến dịch. Được hơn 4K người dùng trên toàn thế giới tin tưởng.",
    "footer.product": "Sản phẩm",
    "footer.qrCodes": "QR Code",
    "footer.company": "Công ty",
    "footer.legal": "Pháp lý",
    "admin.unauthorized": "Email này không được phép đăng nhập vào bảng quản trị.",
    "admin.signInToContinue": "Đăng nhập bằng Google để tiếp tục.",
    "visitor.today": "khách truy cập hôm nay",
    "chooser.title": "Chọn ngôn ngữ của bạn",
    "chooser.subtitle": "Chọn ngôn ngữ ưa thích để tiếp tục",
    "home.hero.title": "UnifiedQR — Trình tạo QR Code miễn phí",
    "home.hero.subtitle":
      "Tạo QR Code miễn phí cho website, PDF, danh bạ, SMS và hơn thế nữa. Tùy chỉnh màu sắc, tải xuống dạng PNG hoặc SVG và theo dõi mọi lần quét — tất cả từ một bảng điều khiển.",
    "home.social.trusted": "Được tin tưởng",
    "home.social.users": "4.000+ người dùng",
    "home.social.onGoogle": "trên Google",
    "home.social.noCreditCard": "Không cần thẻ tín dụng",
    "home.social.signupFree": "Đăng ký miễn phí",
    "home.steps.title": "Cách tạo QR Code miễn phí trong 3 bước đơn giản",
    "home.steps.1.title": "Chọn loại QR Code",
    "home.steps.1.body":
      "Chọn loại QR Code (tĩnh hoặc động) dựa trên mục đích sử dụng: mở URL, chia sẻ PDF, hiển thị thực đơn, chia sẻ thông tin liên hệ và hơn thế nữa.",
    "home.steps.2.title": "Tùy chỉnh theo ý bạn",
    "home.steps.2.body":
      "Thêm thông tin, đổi màu, thiết kế QR Code, thêm logo và kiểm tra theo thời gian thực trước khi tải xuống.",
    "home.steps.3.title": "Tải xuống và chia sẻ",
    "home.steps.3.body":
      "Chọn định dạng PNG hoặc SVG, nhấn tải xuống và sẵn sàng chia sẻ ở bất cứ đâu!",
    "home.steps.cta": "Tạo QR Code miễn phí",
    "home.explained.title": "Giới thiệu về QR Code",
    "home.explained.what.title": "QR Code là gì?",
    "home.explained.what.body":
      "QR Code là mã vạch hai chiều lưu trữ thông tin như URL, thông tin liên hệ, dữ liệu thanh toán hoặc văn bản trong lưới ô vuông đen trắng. Nó có thể được quét bằng camera điện thoại thông minh để truy cập nội dung đã lưu ngay lập tức mà không cần nhập liệu.",
    "home.explained.why.title": "Tại sao nhiều người sử dụng QR Code đến vậy vào năm 2026?",
    "home.explained.why.body":
      "QR Code cung cấp cách nhanh chóng, không tiếp xúc và chi phí thấp để liên kết trải nghiệm ngoại tuyến với nội dung kỹ thuật số. Doanh nghiệp sử dụng chúng để cập nhật theo thời gian thực và giảm lãng phí in ấn đồng thời mang đến cho người dùng quyền truy cập tức thì chỉ bằng camera điện thoại thông minh.",
    "home.explained.how.title": "Làm thế nào để quét QR Code?",
    "home.explained.how.1":
      "Mở ứng dụng camera trên điện thoại thông minh hoặc máy tính bảng. Hầu hết các thiết bị hiện đại tự động quét QR Code.",
    "home.explained.how.2": "Hướng camera vào QR Code, đảm bảo nó rõ ràng trong khung hình.",
    "home.explained.how.3": "Giữ yên vài giây cho đến khi camera nhận diện được mã.",
    "home.explained.how.4":
      "Nhấn vào thông báo hoặc liên kết xuất hiện để mở trang web, video hoặc danh thiếp.",
    "home.dashboard.title": "Quản lý tất cả QR Code từ một bảng điều khiển",
    "home.dashboard.body":
      "Tạo, chỉnh sửa và theo dõi QR Code không giới hạn từ một bảng điều khiển dễ sử dụng. Cập nhật đích đến, xem phân tích và cộng tác với nhóm của bạn.",
    "home.dashboard.cta": "Dùng thử miễn phí ngay",
    "home.features.title":
      "Tại sao hơn 4.000 người dùng tin tưởng UnifiedQR cho chiến dịch QR Code hướng ROI",
    "home.features.track.title": "Theo dõi mọi lần quét",
    "home.features.track.body":
      "Biết được hiệu suất chiến dịch QR Code của bạn với thông tin chi tiết theo thời gian thực. Nhận dữ liệu về số lần quét, người dùng duy nhất, vị trí và thiết bị.",
    "home.features.dynamic.title": "QR Code động miễn phí",
    "home.features.dynamic.body":
      "Tạo tối đa 2 QR Code động miễn phí và cập nhật nội dung bất cứ lúc nào.",
    "home.features.collab.title": "Cộng tác với nhóm",
    "home.features.collab.body":
      "Mời tối đa 5 thành viên nhóm để quản lý và chia sẻ QR Code trên một bảng điều khiển.",
    "home.features.support.title": "Hỗ trợ khách hàng 24/7",
    "home.features.support.body":
      "Đội ngũ của chúng tôi luôn sẵn sàng giải quyết vấn đề nhanh chóng, qua email hoặc điện thoại.",
    "home.features.pay.title": "Chỉ trả cho những gì bạn sử dụng",
    "home.features.pay.body": "Giá linh hoạt — chỉ trả cho các tính năng hoặc mã bổ sung bạn cần.",
    "home.features.cta": "Khám phá gói Flex",
    "home.types.title": "Bạn có thể tạo loại QR Code miễn phí nào?",
    "home.types.cta": "Xem tất cả loại QR Code",
    "home.faq.title": "Câu hỏi thường gặp",
    "home.faq.1.q": "QR Code có miễn phí vĩnh viễn không?",
    "home.faq.1.a":
      "Có. Mỗi QR Code tĩnh bạn tạo ở đây đều miễn phí, không có ngày hết hạn và không giới hạn số lần quét. Bạn có thể tải xuống dạng PNG hoặc SVG và sử dụng thương mại.",
    "home.faq.2.q": "Sự khác biệt giữa QR Code tĩnh và động là gì?",
    "home.faq.2.a":
      "QR Code tĩnh lưu trữ dữ liệu trực tiếp trong mã, vì vậy không bao giờ có thể thay đổi. QR Code động trỏ đến liên kết ngắn bạn kiểm soát, vì vậy bạn có thể chỉnh sửa đích đến và theo dõi số lần quét bất cứ lúc nào.",
    "home.faq.3.q": "Tôi có thể thêm logo vào QR Code không?",
    "home.faq.3.a":
      "Được. Chọn mẫu, điều chỉnh màu sắc và thêm logo trong bảng tùy chỉnh. Giữ logo nhỏ để trình quét vẫn có thể đọc mã một cách đáng tin cậy.",
    "home.faq.4.q": "Tôi nên tải xuống định dạng tệp nào?",
    "home.faq.4.a":
      "Sử dụng PNG cho màn hình, bài đăng mạng xã hội và tài liệu. Sử dụng SVG cho in ấn, biển hiệu cỡ lớn hoặc bất kỳ đâu bạn cần thay đổi kích thước mà không mất chất lượng.",
    "home.faq.5.q": "QR Code có hết hạn không?",
    "home.faq.5.a":
      "QR Code tĩnh không bao giờ hết hạn. QR Code động vẫn hoạt động chừng nào tài khoản của bạn còn hoạt động, và bạn có thể chỉnh sửa đích đến bất cứ lúc nào.",
  },
  id: {
    "nav.products": "Produk",
    "nav.types": "Jenis QR Code",
    "nav.pricing": "Harga",
    "nav.contact": "Kontak",
    "nav.resources": "Sumber",
    "nav.language": "Bahasa",
    "header.signIn": "Masuk",
    "auth.title": "Selamat datang kembali",
    "auth.subtitle":
      "Masuk ke ruang kerja Anda untuk mengelola kode yang tersimpan, tautan dinamis, dan analitik pemindaian.",
    "auth.signInWith": "Lanjutkan dengan Google",
    "auth.busy": "Membuka Google…",
    "auth.googleOnly": "Google saat ini adalah satu-satunya metode masuk.",
    "auth.back": "← Kembali ke pembuat gratis",
    "auth.brand.tagline": "Satu ruang kerja untuk setiap QR Code yang Anda buat.",
    "auth.brand.dynamic": "Tautan pendek dinamis yang dapat Anda arahkan ulang setelah mencetak.",
    "auth.brand.analytics":
      "Pelacakan pemindaian pada setiap kode dinamis, langsung dari pemindaian pertama.",
    "auth.brand.templates": "13 template studio, warna kustom, ekspor PNG dan SVG.",
    "auth.brand.secure": "Masuk yang diverifikasi Google. Tidak ada kata sandi yang disimpan.",
    "auth.error.notAuthorized": "Email ini tidak diizinkan mengakses panel admin.",
    "auth.signOut": "Keluar",
    "pricing.title": "Bayar hanya untuk yang Anda gunakan",
    "pricing.subtitle":
      "Setiap paket mencakup QR Code statis gratis tanpa batas. Tingkatkan saat Anda membutuhkan pelacakan, kode yang dapat diedit, atau akses tim.",
    "pricing.mostPopular": "Paling populer",
    "pricing.perMonth": "per bulan",
    "pricing.forever": "selamanya",
    "pricing.startFree": "Mulai gratis",
    "pricing.chooseFlex": "Pilih Flex",
    "pricing.choosePro": "Pilih Pro",
    "pricing.freeFeatures": [
      "QR Code statis tanpa batas",
      "2 QR Code dinamis",
      "Unduhan PNG & SVG",
      "13 template desain",
      "Penggunaan komersial",
    ],
    "pricing.flexFeatures": [
      "Semua di Free",
      "25 QR Code dinamis",
      "Analitik pemindaian & lokasi",
      "Unggah logo",
      "Dukungan email",
    ],
    "pricing.proFeatures": [
      "Semua di Flex",
      "QR Code dinamis tanpa batas",
      "5 anggota tim",
      "Pembuatan massal & akses API",
      "Domain pendek kustom",
      "Dukungan prioritas 24/7",
    ],
    "billing.title": "Penagihan",
    "billing.subtitle":
      "Batasan paket, peningkatan, dan tagihan. Pembayaran diproses secara aman oleh Cashfree.",
    "billing.current": "Saat ini",
    "billing.upgrade": "Tingkatkan",
    "billing.yourPlan": "Paket Anda",
    "billing.checkout": "Memulai checkout…",
    "billing.signInToUpgrade": "Masuk untuk meningkatkan paket Anda.",
    "footer.tagline":
      "Alat serba guna untuk membuat QR Code gratis, mengeditnya, dan melacak kinerja kampanye. Dipercaya oleh 4K+ pengguna di seluruh dunia.",
    "footer.product": "Produk",
    "footer.qrCodes": "QR Code",
    "footer.company": "Perusahaan",
    "footer.legal": "Legal",
    "admin.unauthorized": "Email ini tidak diizinkan masuk ke panel admin.",
    "admin.signInToContinue": "Masuk dengan Google untuk melanjutkan.",
    "visitor.today": "pengunjung hari ini",
    "chooser.title": "Pilih bahasa Anda",
    "chooser.subtitle": "Pilih bahasa pilihan Anda untuk melanjutkan",
    "home.hero.title": "UnifiedQR — Pembuat QR Code Gratis",
    "home.hero.subtitle":
      "Buat QR Code gratis untuk situs web, PDF, kontak, SMS, dan lainnya. Sesuaikan warna, unduh sebagai PNG atau SVG, dan lacak setiap pemindaian — semuanya dari satu dasbor.",
    "home.social.trusted": "Dipercaya oleh",
    "home.social.users": "4.000+ pengguna",
    "home.social.onGoogle": "di Google",
    "home.social.noCreditCard": "Tidak perlu kartu kredit",
    "home.social.signupFree": "Daftar gratis",
    "home.steps.title": "Cara membuat QR Code gratis dalam 3 langkah sederhana",
    "home.steps.1.title": "Pilih jenis QR Code Anda",
    "home.steps.1.body":
      "Pilih jenis QR Code (statis atau dinamis) berdasarkan kebutuhan Anda: membuka URL, berbagi PDF, menampilkan menu, berbagi detail kontak, dan lainnya.",
    "home.steps.2.title": "Sesuaikan sesuai keinginan Anda",
    "home.steps.2.body":
      "Tambahkan detail Anda, ubah warna, gaya QR Code Anda, tambahkan logo, dan uji secara real time sebelum mengunduh.",
    "home.steps.3.title": "Unduh dan bagikan",
    "home.steps.3.body": "Pilih format PNG atau SVG, tekan unduh, dan siap dibagikan ke mana saja!",
    "home.steps.cta": "Buat QR Code gratis",
    "home.explained.title": "Penjelasan QR Code",
    "home.explained.what.title": "Apa itu QR Code?",
    "home.explained.what.body":
      "QR Code adalah kode batang dua dimensi yang menyimpan informasi seperti URL, detail kontak, data pembayaran, atau teks dalam kisi kotak hitam putih. QR Code dapat dipindai dengan kamera ponsel cerdas untuk langsung mengakses konten yang tersimpan tanpa mengetik.",
    "home.explained.why.title": "Mengapa begitu banyak orang menggunakan QR Code di tahun 2026?",
    "home.explained.why.body":
      "QR Code menyediakan cara cepat, tanpa kontak, dan biaya rendah untuk menghubungkan pengalaman offline dengan konten digital. Bisnis mengandalkan pembaruan real time dan mengurangi pemborosan cetak sambil memberikan akses instan kepada pengguna hanya dengan kamera ponsel cerdas.",
    "home.explained.how.title": "Bagaimana cara memindai QR Code?",
    "home.explained.how.1":
      "Buka aplikasi kamera di ponsel cerdas atau tablet Anda. Sebagian besar perangkat modern memindai QR Code secara otomatis.",
    "home.explained.how.2": "Arahkan kamera ke QR Code, pastikan terlihat jelas dalam bingkai.",
    "home.explained.how.3": "Tetap diam beberapa detik hingga kamera mengenali kode.",
    "home.explained.how.4":
      "Ketuk notifikasi atau tautan yang muncul untuk membuka situs web, video, atau kartu kontak.",
    "home.dashboard.title": "Kelola semua QR Code Anda dari satu dasbor",
    "home.dashboard.body":
      "Buat, edit, dan lacak QR Code tanpa batas dari satu dasbor yang mudah digunakan. Perbarui tujuan, lihat analitik, dan berkolaborasi dengan tim Anda.",
    "home.dashboard.cta": "Coba gratis sekarang",
    "home.features.title":
      "Mengapa 4 ribu+ pengguna mempercayakan UnifiedQR untuk kampanye QR Code berbasis ROI",
    "home.features.track.title": "Lacak setiap pemindaian",
    "home.features.track.body":
      "Ketahui performa kampanye QR Code Anda dengan wawasan real time. Dapatkan data tentang pemindaian, pengguna unik, lokasi, dan perangkat.",
    "home.features.dynamic.title": "QR Code dinamis gratis",
    "home.features.dynamic.body":
      "Buat hingga 2 QR Code dinamis gratis dan perbarui kontennya kapan saja.",
    "home.features.collab.title": "Kolaborasi dengan tim Anda",
    "home.features.collab.body":
      "Undang hingga 5 anggota tim untuk mengelola dan berbagi QR Code di satu dasbor.",
    "home.features.support.title": "Dukungan pelanggan 24/7",
    "home.features.support.body":
      "Tim kami selalu siap memperbaiki masalah dengan cepat, melalui email atau telepon.",
    "home.features.pay.title": "Bayar hanya untuk yang Anda gunakan",
    "home.features.pay.body":
      "Harga fleksibel — bayar hanya untuk fitur atau kode ekstra yang Anda butuhkan.",
    "home.features.cta": "Jelajahi paket Flex",
    "home.types.title": "Jenis QR Code apa yang dapat Anda buat secara gratis?",
    "home.types.cta": "Lihat semua jenis QR Code",
    "home.faq.title": "Pertanyaan yang sering diajukan",
    "home.faq.1.q": "Apakah QR Code gratis selamanya?",
    "home.faq.1.a":
      "Ya. Setiap QR Code statis yang Anda buat di sini gratis, tidak memiliki tanggal kedaluwarsa, dan tidak ada batas pemindaian. Anda dapat mengunduhnya sebagai PNG atau SVG dan menggunakannya secara komersial.",
    "home.faq.2.q": "Apa perbedaan antara QR Code statis dan dinamis?",
    "home.faq.2.a":
      "QR Code statis menyimpan data langsung di dalam kode, sehingga tidak pernah dapat diubah. QR Code dinamis menunjuk ke tautan pendek yang Anda kendalikan, sehingga Anda dapat mengedit tujuan dan melacak pemindaian kapan saja.",
    "home.faq.3.q": "Bisakah saya menambahkan logo ke QR Code?",
    "home.faq.3.a":
      "Ya. Pilih templat, sesuaikan warna Anda, dan tambahkan logo di panel kustomisasi. Pertahankan logo tetap kecil sehingga pemindai masih dapat membaca kode secara andal.",
    "home.faq.4.q": "Format file apa yang harus saya unduh?",
    "home.faq.4.a":
      "Gunakan PNG untuk layar, postingan media sosial, dan dokumen. Gunakan SVG untuk cetak, papan format besar, atau di mana pun Anda perlu mengubah ukuran tanpa kehilangan kualitas.",
    "home.faq.5.q": "Apakah QR Code kedaluwarsa?",
    "home.faq.5.a":
      "QR Code statis tidak pernah kedaluwarsa. QR Code dinamis tetap aktif selama akun Anda aktif, dan Anda dapat mengedit tujuannya kapan saja.",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: string;
  t: (key: MessageKey) => string;
  formatMoney: (amount: number) => string;
  needsLanguageChooser: boolean;
  markLanguageChosen: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const LOCALE_CODES = SUPPORTED_LOCALES.map((l) => l.code) as readonly string[];

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return (stored && LOCALE_CODES.includes(stored) ? stored : "en") as Locale;
}

function detectCurrency(): string {
  return "INR";
}

function numberFormatLocale(currency: string) {
  return currency === "INR" ? "en-IN" : "en-US";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);
  const [currency] = useState<string>(detectCurrency);
  const [chosen, setChosen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !!window.localStorage.getItem(CHOSEN_KEY);
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const dict = messages[locale] as unknown as Record<MessageKey, string>;
    return {
      locale,
      setLocale: (l) => {
        setLocaleState(l);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, l);
          window.localStorage.setItem(CHOSEN_KEY, "1");
          setChosen(true);
        }
      },
      currency,
      t: (key) => dict[key],
      formatMoney: (amount) =>
        new Intl.NumberFormat(numberFormatLocale(currency), {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(amount),
      needsLanguageChooser: !chosen,
      markLanguageChosen: () => {
        setChosen(true);
        if (typeof window !== "undefined") window.localStorage.setItem(CHOSEN_KEY, "1");
      },
    };
  }, [locale, currency, chosen]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
