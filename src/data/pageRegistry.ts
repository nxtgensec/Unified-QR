export interface ContentPage {
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  cta: string;
  relatedSlugs: string[];
}

export const pages: Record<string, ContentPage> = {
  "url-qr-code": {
    title: "URL QR Code — Create a Free Website QR Code | UnifiedQR",
    description:
      "Generate a free QR Code for any website URL. Customize colors, add a logo, and download as PNG or SVG in seconds.",
    h1: "URL QR Code",
    intro:
      "Turn any website link into a scannable QR Code. Whether it's a homepage, product page or landing page, your audience can reach it instantly by pointing their phone camera at the code.",
    sections: [
      {
        heading: "How to create a URL QR Code",
        body: "Paste your website link into the generator above, choose a template, customize the colors and download. The entire process takes under 30 seconds and requires no account.",
      },
      {
        heading: "Static vs dynamic URL QR Codes",
        body: "A static URL QR Code embeds the link directly — it can't be changed after printing. A dynamic QR Code uses a short redirect link, so you can update the destination anytime without reprinting the code.",
      },
      {
        heading: "Where to use URL QR Codes",
        body: "Print them on flyers, posters, business cards, product packaging, menus, billboards, store windows and email signatures. Anywhere you want to drive traffic to a webpage without making people type a URL.",
      },
      {
        heading: "Why choose UnifiedQR",
        body: "Unlimited free static QR Codes, real-time scan analytics on dynamic codes, 13 studio templates, PNG and SVG downloads, and no expiry date on any free code you create.",
      },
    ],
    faqs: [
      {
        q: "Can I change the URL after printing?",
        a: "Yes, if you create a dynamic QR Code. Dynamic codes use a redirect link that you can update from your dashboard at any time. Static codes cannot be changed.",
      },
      {
        q: "Is there a scan limit?",
        a: "No. Every QR Code you create on UnifiedQR — static or dynamic — has unlimited scans.",
      },
    ],
    cta: "Create a free URL QR Code",
    relatedSlugs: ["dynamic-qr-code", "trackable-qr-code", "qr-code-generator-with-logo"],
  },
  "pdf-to-qr-code": {
    title: "PDF to QR Code — Free PDF QR Code Generator | UnifiedQR",
    description:
      "Convert any PDF into a scannable QR Code. Share menus, brochures and price lists without printing.",
    h1: "PDF to QR Code",
    intro:
      "Turn a PDF document into a QR Code that anyone can scan to open and view the file instantly. Perfect for menus, instruction manuals, price lists and brochures.",
    sections: [
      {
        heading: "How it works",
        body: "Upload your PDF to a hosting service (Google Drive, Dropbox or your own server), paste the share link into the generator, and download your QR Code. Scanners will be taken directly to the PDF.",
      },
      {
        heading: "Best for restaurants and retail",
        body: "Replace printed menus and catalogues with a single QR Code. Update the PDF anytime without changing the code — great for seasonal menus, price changes and new product launches.",
      },
      {
        heading: "Works on every phone",
        body: "Modern iOS and Android devices scan QR Codes natively through the camera app. No third-party scanner needed.",
      },
    ],
    faqs: [
      {
        q: "Can I update the PDF after printing the QR Code?",
        a: "Yes — if you use a dynamic QR Code, you can change the linked URL at any time to point at a new PDF without reprinting.",
      },
      {
        q: "Does the QR Code store the PDF?",
        a: "No. The QR Code stores a URL that links to the PDF. The PDF itself must be hosted online.",
      },
    ],
    cta: "Create a free PDF QR Code",
    relatedSlugs: ["url-qr-code", "menu-qr-code", "dynamic-qr-code"],
  },
  "multi-url-qr-code": {
    title: "Multi-URL QR Code — Link Multiple URLs in One Code | UnifiedQR",
    description:
      "Create a single QR Code that links to multiple websites. Perfect for campaigns with more than one destination.",
    h1: "Multi-URL QR Code",
    intro:
      "One QR Code, multiple destinations. Let your audience pick which link to open — website, social profiles, videos, stores and more — all from a single scan.",
    sections: [
      {
        heading: "How multi-URL QR Codes work",
        body: "When someone scans the code, they see a mobile-optimised landing page with all your links. They tap the one they want. You can add, remove or reorder links at any time with a dynamic code.",
      },
      {
        heading: "Perfect for social media profiles",
        body: "Instead of printing a different QR Code for each platform, combine them all into one. Your audience picks where they want to follow you.",
      },
      {
        heading: "Ideal for product packaging",
        body: "Link your website, YouTube demo, customer support page and review form from a single code on the box.",
      },
    ],
    faqs: [
      {
        q: "How many URLs can I add?",
        a: "You can add as many links as you need. Each link appears as a button on the landing page your audience sees after scanning.",
      },
      {
        q: "Can I track which links get the most clicks?",
        a: "Yes. Dynamic multi-URL QR Codes include analytics so you can see total scans and which links your audience taps most.",
      },
    ],
    cta: "Create a free Multi-URL QR Code",
    relatedSlugs: ["social-media-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "vcard-qr-code-generator": {
    title: "vCard QR Code — Share Contact Details Instantly | UnifiedQR",
    description:
      "Create a free vCard QR Code. One scan saves your name, phone, email and address directly to someone's phone.",
    h1: "vCard QR Code",
    intro:
      "Replace paper business cards with a scannable vCard QR Code. One scan saves your full contact details — name, phone, email, company and address — straight into the other person's phone contacts.",
    sections: [
      {
        heading: "What a vCard QR Code does",
        body: "The QR Code encodes a vCard (Virtual Contact File). When scanned, the phone opens the contacts app with all your details pre-filled. The person just taps Save.",
      },
      {
        heading: "Use cases",
        body: "Print it on business cards, conference badges, email signatures, company letterheads and shop counters. It removes the friction of manually entering contact details.",
      },
      {
        heading: "Dynamic vCard codes",
        body: "With a dynamic vCard QR Code, you can update your phone number, email or job title without printing a new card. Just edit the destination in your dashboard.",
      },
    ],
    faqs: [
      {
        q: "Do scanners need a specific app?",
        a: "No. Both iOS and Android cameras scan vCard QR Codes natively and open the contacts app automatically.",
      },
      {
        q: "Can I update my details after printing?",
        a: "Yes, with a dynamic QR Code. Edit the linked vCard file in your dashboard and the same printed code will serve the updated information.",
      },
    ],
    cta: "Create a free vCard QR Code",
    relatedSlugs: ["contact-qr-code", "email-qr-code", "dynamic-qr-code"],
  },
  "contact-qr-code": {
    title: "Contact QR Code — Share Your Details with One Scan | UnifiedQR",
    description:
      "Create a free contact QR Code. Share your phone number, email and social profiles instantly.",
    h1: "Contact QR Code",
    intro:
      "Let people save your contact information with a single scan. A contact QR Code opens a page with your phone number, email address, social links and more — no typing required.",
    sections: [
      {
        heading: "What to include",
        body: "Add your name, phone number, email, website, and any social media profiles. Everything appears on a clean landing page when someone scans the code.",
      },
      {
        heading: "Where to use it",
        body: "Print on business cards, conference badges, name tags, email signatures and shop counters.",
      },
      {
        heading: "Static vs dynamic",
        body: "A static contact QR Code is free and permanent. A dynamic version lets you update details without reprinting.",
      },
    ],
    faqs: [
      {
        q: "What's the difference between a contact QR Code and a vCard QR Code?",
        a: "A vCard QR Code saves contact details directly into the phone's address book. A contact QR Code opens a web page showing your information — the user then manually saves it.",
      },
      {
        q: "Is it free?",
        a: "Yes. Both static and dynamic contact QR Codes are free to create on UnifiedQR.",
      },
    ],
    cta: "Create a free Contact QR Code",
    relatedSlugs: ["vcard-qr-code-generator", "email-qr-code", "phone-qr-code"],
  },
  "text-to-qr-code": {
    title: "Text to QR Code — Free Text QR Code Generator | UnifiedQR",
    description:
      "Convert any plain text into a scannable QR Code. Share WiFi passwords, serial numbers and short messages.",
    h1: "Text to QR Code",
    intro:
      "Turn any text string into a QR Code. Perfect for sharing WiFi credentials, product serial numbers, short instructions, promo codes — anything that can be expressed as plain text.",
    sections: [
      {
        heading: "How to create one",
        body: "Type or paste your text into the generator, choose a template, and download. The QR Code stores the exact text you entered — no hosting required.",
      },
      {
        heading: "Common uses",
        body: "WiFi passwords on restaurant tables, serial numbers on product labels, short instructions on packaging, unique codes for events, and verification numbers on certificates.",
      },
      {
        heading: "No internet needed to scan",
        body: "Since the text is stored directly in the code, scanners don't need an internet connection to read it — they just decode the pattern and display the text.",
      },
    ],
    faqs: [
      {
        q: "How much text can a QR Code hold?",
        a: "A standard QR Code can store up to 4,296 alphanumeric characters. For longer text, keep the code simple and test scanning before printing.",
      },
      {
        q: "Can I edit the text after printing?",
        a: "No. Text QR Codes are static — the data is baked into the code. For editable content, use a dynamic QR Code that links to a URL.",
      },
    ],
    cta: "Create a free Text QR Code",
    relatedSlugs: ["wifi-qr-code", "sms-qr-code", "url-qr-code"],
  },
  "sms-qr-code": {
    title: "SMS QR Code — Free SMS QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that opens a pre-filled SMS message. Perfect for opt-ins, votes and support requests.",
    h1: "SMS QR Code",
    intro:
      "Let customers send you an SMS with one scan. The QR Code pre-fills the phone number and message — they just tap Send.",
    sections: [
      {
        heading: "How it works",
        body: "Enter the destination phone number and a message template. When someone scans the code, their phone opens the Messages app with everything filled in. They tap Send and you receive the SMS.",
      },
      {
        heading: "Best use cases",
        body: "Opt-in campaigns, customer feedback collection, vote or poll responses, support requests, event RSVPs, and contest entries.",
      },
      {
        heading: "No app required",
        body: "Both iOS and Android handle SMS QR Codes natively. The camera detects the code and opens the default messaging app.",
      },
    ],
    faqs: [
      {
        q: "Does the recipient get charged for the SMS?",
        a: "Standard SMS charges from their carrier apply. You can add a zero-cost message by using a keyword your audience recognises.",
      },
      {
        q: "Can I pre-fill a specific message?",
        a: "Yes. You set both the phone number and the message body. The user only needs to tap Send.",
      },
    ],
    cta: "Create a free SMS QR Code",
    relatedSlugs: ["email-qr-code", "phone-qr-code", "url-qr-code"],
  },
  "email-qr-code": {
    title: "Email QR Code — Free Email QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that opens a pre-filled email. Set the recipient, subject and body before your audience scans.",
    h1: "Email QR Code",
    intro:
      "Make it effortless for customers to email you. The QR Code opens their email app with the recipient, subject and message body already filled in.",
    sections: [
      {
        heading: "How it works",
        body: "Enter the recipient email address, a subject line and an optional message body. When someone scans, their email app opens with everything pre-filled — they just tap Send.",
      },
      {
        heading: "Where to use it",
        body: "Customer support desks, feedback forms, product registration cards, event inquiry boards and packaging inserts.",
      },
      {
        heading: "Why it helps",
        body: "Eliminates the friction of manually typing an email address and subject. Higher response rates with zero effort from your audience.",
      },
    ],
    faqs: [
      {
        q: "Do scanners need an email app installed?",
        a: "Yes. The QR Code triggers a mailto: link, which opens the default email app on the user's device.",
      },
      {
        q: "Can I track how many people scan it?",
        a: "Yes — use a dynamic QR Code to get real-time scan analytics including device type, location and scan count.",
      },
    ],
    cta: "Create a free Email QR Code",
    relatedSlugs: ["sms-qr-code", "phone-qr-code", "contact-qr-code"],
  },
  "phone-qr-code": {
    title: "Phone QR Code — Free Phone Call QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that dials a phone number when scanned. Great for signage, business cards and storefronts.",
    h1: "Phone Call QR Code",
    intro:
      "Let customers call you with a single scan. The QR Code opens the phone dialer with your number — they tap Call and they're connected.",
    sections: [
      {
        heading: "How it works",
        body: "Enter the phone number you want people to call. When someone scans the code, their phone opens the dialer with the number pre-filled. They just tap the call button.",
      },
      {
        heading: "Best for businesses",
        body: "Print on storefront windows, restaurant tables, hotel rooms, billboards and vehicle wraps. Remove the friction of looking up and typing a phone number.",
      },
      {
        heading: "Include international codes",
        body: "For global audiences, include the country code (e.g. +91 for India, +1 for US) so the number works regardless of where the scanner is located.",
      },
    ],
    faqs: [
      {
        q: "Does the scanner get charged for the call?",
        a: "Standard call rates from their mobile carrier apply. There is no additional charge from UnifiedQR.",
      },
      {
        q: "Can I track how many calls it generates?",
        a: "With a dynamic QR Code, you can track total scans. Actual call completions depend on the phone's dialer app and cannot be tracked from our end.",
      },
    ],
    cta: "Create a free Phone Call QR Code",
    relatedSlugs: ["sms-qr-code", "contact-qr-code", "vcard-qr-code-generator"],
  },
  "social-media-qr-code": {
    title: "Social Media QR Code — Link All Profiles in One Code | UnifiedQR",
    description:
      "Create a single QR Code for all your social media profiles. One scan shows all your links.",
    h1: "Social Media QR Code",
    intro:
      "One QR Code to rule them all. Link your Instagram, Facebook, LinkedIn, YouTube, TikTok and every other profile behind a single code. Scanners see all your links and pick where to follow.",
    sections: [
      {
        heading: "How it works",
        body: "Add all your social media URLs to the generator. When someone scans the code, they see a clean landing page with buttons for each platform. They tap the one they want.",
      },
      {
        heading: "Perfect for events and conferences",
        body: "Print it on badges, name tags, booth displays and handouts. Attendees can follow you on every platform with a single scan.",
      },
      {
        heading: "Update links without reprinting",
        body: "Use a dynamic QR Code so you can add, remove or reorder platforms anytime. No need to reprint stickers, cards or banners.",
      },
    ],
    faqs: [
      {
        q: "Which social platforms can I add?",
        a: "Any platform with a URL — Instagram, Facebook, LinkedIn, YouTube, TikTok, Twitter/X, Snapchat, Pinterest, Discord, WhatsApp, Telegram and more.",
      },
      {
        q: "Can I track which platforms get the most taps?",
        a: "Yes. Dynamic social media QR Codes include click analytics per link so you know where your audience is most engaged.",
      },
    ],
    cta: "Create a free Social Media QR Code",
    relatedSlugs: ["multi-url-qr-code", "facebook-qr-code", "instagram-qr-code"],
  },
  "facebook-qr-code": {
    title: "Facebook QR Code — Free Facebook QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that links to your Facebook page, profile or group. Customize and download free.",
    h1: "Facebook QR Code",
    intro:
      "Drive more Facebook followers with a scannable QR Code. Link to your page, business profile, group or event — perfect for print ads, storefronts and packaging.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your Facebook URL into the generator, pick a template, customise the colours and download. Works for pages, profiles, groups and event listings.",
      },
      {
        heading: "Where to use it",
        body: "Business cards, flyers, restaurant tables, retail displays, product packaging, email signatures and event booths.",
      },
      {
        heading: "Why it works",
        body: "People are far more likely to follow you on Facebook if they don't have to search for your page. A QR Code removes that friction entirely.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a Facebook group instead of a page?",
        a: "Yes. Paste the URL of any Facebook page, profile, group or event.",
      },
      {
        q: "Is it free?",
        a: "Yes. Create unlimited free Facebook QR Codes on UnifiedQR.",
      },
    ],
    cta: "Create a free Facebook QR Code",
    relatedSlugs: ["instagram-qr-code", "social-media-qr-code", "url-qr-code"],
  },
  "instagram-qr-code": {
    title: "Instagram QR Code — Free Instagram QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that links to your Instagram profile. Get more followers from print materials.",
    h1: "Instagram QR Code",
    intro:
      "Turn offline touchpoints into Instagram followers. A scannable QR Code takes people straight to your profile — no searching, no typing.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your Instagram profile URL, choose a template, customise and download. Takes less than 30 seconds.",
      },
      {
        heading: "Best places to print it",
        body: "Business cards, café counters, retail bags, product tags, event badges, posters, menus and email footers.",
      },
      {
        heading: "Grow faster from offline traffic",
        body: "Every physical touchpoint becomes a follower acquisition channel. People scan, land on your profile, and follow — all in under 5 seconds.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a specific Instagram post?",
        a: "Yes. Paste the URL of any post, reel, story highlight or profile.",
      },
      {
        q: "Does it work with Instagram business accounts?",
        a: "Yes. It works with any Instagram URL — personal, business or creator accounts.",
      },
    ],
    cta: "Create a free Instagram QR Code",
    relatedSlugs: ["facebook-qr-code", "tiktok-qr-code", "social-media-qr-code"],
  },
  "linkedin-qr-code": {
    title: "LinkedIn QR Code — Free LinkedIn QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your LinkedIn profile or company page. Perfect for networking events.",
    h1: "LinkedIn QR Code",
    intro:
      "Make networking effortless. A LinkedIn QR Code lets contacts save your professional profile with a single scan — ideal for conferences, meetups and business cards.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your LinkedIn profile or company page URL, customise the design, and download as PNG or SVG.",
      },
      {
        heading: "Networking events and conferences",
        body: "Print it on your badge, name tag or business card. Fellow attendees can connect with you instantly instead of exchanging cards and adding contacts later.",
      },
      {
        heading: "Company pages",
        body: "Link to your LinkedIn company page for employer branding. Print on recruitment materials, office windows and careers pages.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a LinkedIn company page?",
        a: "Yes. Paste any LinkedIn URL — personal profile, company page or job listing.",
      },
      {
        q: "Is it free?",
        a: "Yes. Unlimited LinkedIn QR Codes, no account required.",
      },
    ],
    cta: "Create a free LinkedIn QR Code",
    relatedSlugs: ["social-media-qr-code", "vcard-qr-code-generator", "url-qr-code"],
  },
  "whatsapp-qr-code": {
    title: "WhatsApp QR Code — Free WhatsApp QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that opens a WhatsApp chat. Great for customer support and sales enquiries.",
    h1: "WhatsApp QR Code",
    intro:
      "Let customers message you on WhatsApp with a single scan. The QR Code opens a chat window with your number — they just type and send.",
    sections: [
      {
        heading: "How it works",
        body: "Enter your WhatsApp phone number (with country code). When someone scans, WhatsApp opens with a new chat to your number. Optionally pre-fill a message.",
      },
      {
        heading: "Customer support",
        body: "Print on product packaging, receipts, invoices and store counters. Customers can reach your support team without searching for your number.",
      },
      {
        heading: "Sales and enquiries",
        body: "Link WhatsApp to your marketing materials. When people scan, they can ask about pricing, availability or custom orders directly.",
      },
    ],
    faqs: [
      {
        q: "Do scanners need WhatsApp installed?",
        a: "Yes. The QR Code opens a wa.me link which redirects to WhatsApp. If WhatsApp is not installed, it prompts the user to download it.",
      },
      {
        q: "Can I pre-fill a message?",
        a: "Yes. Add a message parameter to your URL so the chat opens with a pre-written message the user can edit before sending.",
      },
    ],
    cta: "Create a free WhatsApp QR Code",
    relatedSlugs: ["telegram-qr-code", "sms-qr-code", "social-media-qr-code"],
  },
  "tiktok-qr-code": {
    title: "TikTok QR Code — Free TikTok QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your TikTok profile. Get more followers from physical marketing materials.",
    h1: "TikTok QR Code",
    intro:
      "Bridge the gap between offline and TikTok. A scannable QR Code takes people directly to your profile, specific video or challenge page.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your TikTok profile URL or video link, customise the design and download.",
      },
      {
        heading: "Event and retail use",
        body: "Print on event booths, retail displays, product packaging and promotional posters. Let offline audiences discover your TikTok content instantly.",
      },
      {
        heading: "Creator growth",
        body: "Place QR Codes in your YouTube descriptions, podcast show notes and email newsletters to cross-promote your TikTok presence.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a specific TikTok video?",
        a: "Yes. Paste the URL of any TikTok video, profile or sound page.",
      },
      {
        q: "Is it free?",
        a: "Yes. Create unlimited TikTok QR Codes for free.",
      },
    ],
    cta: "Create a free TikTok QR Code",
    relatedSlugs: ["instagram-qr-code", "youtube-qr-code", "social-media-qr-code"],
  },
  "youtube-qr-code": {
    title: "YouTube QR Code — Free YouTube QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that links to a YouTube video or channel. Perfect for print and signage.",
    h1: "YouTube QR Code",
    intro:
      "Turn any print material into a video view. A YouTube QR Code takes people straight to your video, playlist or channel — no searching required.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your YouTube video, playlist or channel URL, customise the QR Code design and download.",
      },
      {
        heading: "Best use cases",
        body: "Product packaging linking to demo videos, posters linking to music videos, event flyers linking to highlight reels, and business cards linking to your channel.",
      },
      {
        heading: "Boost video views",
        body: "Every physical touchpoint becomes a video discovery channel. People scan and watch — no need to search for your content.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a YouTube playlist or channel?",
        a: "Yes. Paste any YouTube URL — video, playlist, channel or Shorts link.",
      },
      {
        q: "Does it work on all phones?",
        a: "Yes. iOS and Android both handle YouTube links natively, opening in the YouTube app if installed or in the browser.",
      },
    ],
    cta: "Create a free YouTube QR Code",
    relatedSlugs: ["tiktok-qr-code", "video-qr-code-generator", "social-media-qr-code"],
  },
  "video-qr-code-generator": {
    title: "Video QR Code — Free Video QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for any video. Link to YouTube, Vimeo or hosted videos with one scan.",
    h1: "Video QR Code",
    intro:
      "Make any video scannable. A video QR Code links to YouTube, Vimeo or self-hosted videos — perfect for product demos, tutorials and event highlights.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste the video URL, choose a template, customise the design and download. Works with any video hosting platform.",
      },
      {
        heading: "Product packaging",
        body: "Print on boxes to link to setup guides, assembly instructions or unboxing experiences.",
      },
      {
        heading: "Events and museums",
        body: "Place next to exhibits, art installations or stage performances to link to supplementary video content.",
      },
    ],
    faqs: [
      {
        q: "Which video platforms are supported?",
        a: "Any platform with a URL — YouTube, Vimeo, Wistia, Dailymotion, or a video hosted on your own website.",
      },
      {
        q: "Can I change the video without reprinting?",
        a: "Yes, with a dynamic QR Code. Update the video URL anytime from your dashboard.",
      },
    ],
    cta: "Create a free Video QR Code",
    relatedSlugs: ["youtube-qr-code", "audio-qr-code", "url-qr-code"],
  },
  "audio-qr-code": {
    title: "Audio QR Code — Free Audio QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that links to an audio file. Share podcasts, music and voice messages.",
    h1: "Audio QR Code",
    intro:
      "Turn any audio link into a scannable code. Share podcast episodes, music tracks, audio guides and voice messages — one scan and your audience is listening.",
    sections: [
      {
        heading: "How to create one",
        body: "Upload your audio to a hosting service (Spotify, SoundCloud, Anchor or your own server), paste the link and generate your QR Code.",
      },
      {
        heading: "Museums and galleries",
        body: "Add audio QR Codes next to exhibits so visitors can hear narration, artist commentary or historical context through their phone speakers.",
      },
      {
        heading: "Podcast promotion",
        body: "Print on posters, flyers and business cards. New listeners scan and start playing your latest episode immediately.",
      },
    ],
    faqs: [
      {
        q: "Which audio platforms work?",
        a: "Any URL — Spotify, Apple Music, SoundCloud, Anchor, YouTube Music or self-hosted MP3 links.",
      },
      {
        q: "Can I update the audio link later?",
        a: "Yes, with a dynamic QR Code.",
      },
    ],
    cta: "Create a free Audio QR Code",
    relatedSlugs: ["video-qr-code-generator", "spotify-qr-code", "url-qr-code"],
  },
  "spotify-qr-code": {
    title: "Spotify QR Code — Free Spotify QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that opens a Spotify track, album or playlist. Perfect for musicians and venues.",
    h1: "Spotify QR Code",
    intro:
      "Let people scan and listen. A Spotify QR Code opens a specific track, album or playlist directly in the Spotify app.",
    sections: [
      {
        heading: "How to create one",
        body: "Copy the share link from Spotify, paste it into the generator and download your QR Code.",
      },
      {
        heading: "For musicians and venues",
        body: "Print on gig posters, album inserts, merchandise and venue walls. Fans scan and stream your music instantly.",
      },
      {
        heading: "Curated playlists",
        body: "Share workout playlists, study mixes or party soundtracks. Print the QR Code on flyers or share digitally.",
      },
    ],
    faqs: [
      {
        q: "Does the scanner need Spotify installed?",
        a: "If Spotify is installed, the link opens directly in the app. If not, it opens in the browser with a prompt to open in Spotify.",
      },
      {
        q: "Can I link to a specific playlist?",
        a: "Yes. Copy the share link of any track, album, playlist or artist page.",
      },
    ],
    cta: "Create a free Spotify QR Code",
    relatedSlugs: ["audio-qr-code", "youtube-qr-code", "social-media-qr-code"],
  },
  "dynamic-qr-code": {
    title: "Dynamic QR Code — Editable QR Codes with Scan Tracking | UnifiedQR",
    description:
      "Create dynamic QR Codes you can edit after printing. Track scans, change destinations and manage codes from one dashboard.",
    h1: "Dynamic QR Code",
    intro:
      "Unlike static QR Codes, dynamic codes use a redirect link you control. Edit the destination, track every scan and manage all your codes from a single dashboard — without ever reprinting.",
    sections: [
      {
        heading: "Why dynamic beats static",
        body: "Static codes are permanent — once printed, the data is locked. Dynamic codes let you change where they point, so you never waste printed materials when a URL changes.",
      },
      {
        heading: "Real-time analytics",
        body: "See every scan with timestamps, device type, location and referrer data. Know exactly how your QR Code campaigns perform.",
      },
      {
        heading: "How to get started",
        body: "Sign up for free, create a dynamic QR Code, set the destination URL, and download. You get 2 free dynamic codes on the free plan.",
      },
      {
        heading: "Edit without reprinting",
        body: "Changed your landing page? New promotion? Updated menu? Just log in, update the destination, and the same printed code serves the new content.",
      },
    ],
    faqs: [
      {
        q: "How many dynamic QR Codes can I create for free?",
        a: "You get 2 free dynamic QR Codes on the free plan. Upgrade to Flex for 25 or Pro for unlimited.",
      },
      {
        q: "Do dynamic QR Codes expire?",
        a: "No. Dynamic codes stay active as long as your account exists. You can also deactivate them manually.",
      },
      {
        q: "Are scan analytics real-time?",
        a: "Yes. Scans appear on your dashboard within seconds of being recorded.",
      },
    ],
    cta: "Create a free Dynamic QR Code",
    relatedSlugs: ["trackable-qr-code", "url-qr-code", "qr-code-generator-with-logo"],
  },
  "trackable-qr-code": {
    title: "Trackable QR Code — QR Code with Scan Analytics | UnifiedQR",
    description:
      "Create a trackable QR Code and see every scan in real time. Device, location and timestamp data included.",
    h1: "Trackable QR Code",
    intro:
      "Know exactly how your QR Codes perform. Every trackable QR Code records scans with device type, geographic location, timestamps and referrer data — all visible on your dashboard.",
    sections: [
      {
        heading: "What data you get",
        body: "Each scan records the device (iOS/Android/desktop), approximate location (city/country), timestamp, and whether the scan came from a direct scan or a referral link.",
      },
      {
        heading: "Campaign optimisation",
        body: "Compare scan counts across different placements. Find out which poster, flyer or product label drives the most traffic. Adjust your strategy based on real data.",
      },
      {
        heading: "Team access",
        body: "Share analytics with team members. Everyone on your team can view scan data, so marketing, sales and product teams stay aligned.",
      },
    ],
    faqs: [
      {
        q: "Does tracking require an app?",
        a: "No. Tracking is built into every dynamic QR Code on UnifiedQR. Scans are recorded server-side without any app installation.",
      },
      {
        q: "Is tracking available on free plan?",
        a: "Yes. Even free dynamic QR Codes include full scan analytics.",
      },
    ],
    cta: "Create a trackable QR Code",
    relatedSlugs: ["dynamic-qr-code", "url-qr-code", "qr-code-generator-with-logo"],
  },
  "qr-code-generator-with-logo": {
    title: "QR Code Generator with Logo — Add Your Brand | UnifiedQR",
    description:
      "Create a free QR Code with your logo in the centre. Customise colours and download as PNG or SVG.",
    h1: "QR Code Generator with Logo",
    intro:
      "Brand your QR Codes with your company logo. Add a logo in the centre, match your brand colours, and choose from 13 professional templates — all free.",
    sections: [
      {
        heading: "How to add your logo",
        body: "After generating your QR Code, use the customization panel to upload your logo. It appears in the centre of the code with error correction ensuring scanners still read it reliably.",
      },
      {
        heading: "Brand colours",
        body: "Change the foreground and background colours to match your brand palette. Use high contrast for reliable scanning.",
      },
      {
        heading: "13 studio templates",
        body: "Choose from 13 unique templates — rounded, sharp, decorative and minimal styles. Each template gives your QR Code a distinct look.",
      },
      {
        heading: "Download formats",
        body: "PNG for screens and social media. SVG for print and large-format signage. Both formats include your logo and custom colours.",
      },
    ],
    faqs: [
      {
        q: "Will a logo make my QR Code unscanable?",
        a: "No. QR Codes use Reed-Solomon error correction, which allows up to 30% damage. A small centred logo doesn't affect readability.",
      },
      {
        q: "What size should my logo be?",
        a: "Keep it small — ideally under 20% of the code area. The generator handles positioning automatically.",
      },
    ],
    cta: "Create a QR Code with your logo",
    relatedSlugs: ["create-colored-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "create-colored-qr-code": {
    title: "Colored QR Code — Custom Color QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code with custom colours. Match your brand palette while keeping it scannable.",
    h1: "Colored QR Code",
    intro:
      "Go beyond black and white. Create a coloured QR Code that matches your brand identity — choose foreground, background and template accent colours.",
    sections: [
      {
        heading: "How to customize colours",
        body: "Pick any foreground and background colour in the customization panel. Use the colour picker or enter a hex code for exact brand matching.",
      },
      {
        heading: "Scanning reliability",
        body: "Always maintain high contrast between foreground and background. Dark codes on light backgrounds scan most reliably. Test your code on multiple devices before printing.",
      },
      {
        heading: "Template accent colours",
        body: "Each of the 13 templates has accent elements that can also be customised. Create truly unique QR Codes that stand out.",
      },
    ],
    faqs: [
      {
        q: "What colours should I avoid?",
        a: "Low-contrast combinations (light on light, dark on dark) and neon colours can cause scanning failures. Stick to high-contrast pairs.",
      },
      {
        q: "Can I match my exact brand colour?",
        a: "Yes. Enter your hex code in the colour picker for precise brand matching.",
      },
    ],
    cta: "Create a colored QR Code",
    relatedSlugs: ["qr-code-generator-with-logo", "qr-code-sticker", "url-qr-code"],
  },
  "menu-qr-code": {
    title: "Menu QR Code — Free Restaurant Menu QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your restaurant menu. Let customers scan and view your menu on their phone.",
    h1: "Menu QR Code",
    intro:
      "Replace printed menus with a scannable QR Code. Customers point their camera, your menu loads on their phone, and you can update items anytime without reprinting.",
    sections: [
      {
        heading: "How it works",
        body: "Host your menu as a PDF or webpage (Google Drive, your website or a dedicated menu page). Paste the link into the generator and download your QR Code.",
      },
      {
        heading: "Update without reprinting",
        body: "Use a dynamic QR Code so you can change the menu URL whenever prices change, items are added or seasonal specials rotate.",
      },
      {
        heading: "Table-top placement",
        body: "Print small QR Code stickers for each table. Customers scan, browse the full menu on their phone, and order — all without touching a shared menu.",
      },
      {
        heading: "Multiple menus",
        body: "Create separate codes for breakfast, lunch, dinner and drinks. Each code links to a different menu PDF or page.",
      },
    ],
    faqs: [
      {
        q: "Do I need a website to host my menu?",
        a: "No. You can host a PDF on Google Drive, Dropbox or any free hosting service. The QR Code just needs a URL.",
      },
      {
        q: "Can I change the menu without reprinting the QR Code?",
        a: "Yes. With a dynamic QR Code, update the linked URL anytime. The same printed code serves the new menu.",
      },
    ],
    cta: "Create a free Menu QR Code",
    relatedSlugs: ["pdf-to-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "event-qr-code": {
    title: "Event QR Code — Free Event QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your event. Link to registration pages, schedules, maps and live streams.",
    h1: "Event QR Code",
    intro:
      "Simplify event management with scannable QR Codes. Link to registration forms, event schedules, venue maps, live streams and feedback surveys — all from one code.",
    sections: [
      {
        heading: "Registration and tickets",
        body: "Link your QR Code to an online registration form or ticket page. Attendees scan and register on the spot.",
      },
      {
        heading: "Event schedules and maps",
        body: "Print QR Codes at the venue entrance linking to a live schedule or floor plan. Update the schedule in real time with a dynamic code.",
      },
      {
        heading: "Post-event feedback",
        body: "Place QR Codes at exits linking to a feedback survey. Capture attendee opinions while the experience is fresh.",
      },
      {
        heading: "Live streams",
        body: "For hybrid events, print QR Codes linking to your live stream. Remote attendees can join by scanning a code on the promotional materials.",
      },
    ],
    faqs: [
      {
        q: "Can I change the event URL after printing?",
        a: "Yes, with a dynamic QR Code. Update the destination anytime.",
      },
      {
        q: "How do I create QR Codes for ticketing?",
        a: "Paste your ticketing platform URL (Eventbrite, Meetup, etc.) into the generator and download.",
      },
    ],
    cta: "Create a free Event QR Code",
    relatedSlugs: ["event-registration-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "e-commerce-qr-code": {
    title: "E-Commerce QR Code — Free Online Store QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your online store. Drive traffic from print to product pages.",
    h1: "E-Commerce QR Code",
    intro:
      "Bridge the gap between physical and digital retail. A QR Code on packaging, receipts or displays takes customers straight to your product pages.",
    sections: [
      {
        heading: "Product packaging",
        body: "Print a QR Code on each product linking to the product page, user manual or review page. Customers scan and get instant digital content.",
      },
      {
        heading: "Receipts and invoices",
        body: "Add a QR Code to printed receipts linking to your loyalty programme, review page or support portal.",
      },
      {
        heading: "In-store displays",
        body: "Place QR Codes on shelf displays linking to product details, comparison pages or online checkout for out-of-stock items.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a specific product page?",
        a: "Yes. Paste any URL — product page, category page, cart link or checkout flow.",
      },
      {
        q: "Can I track sales from QR Codes?",
        a: "With a dynamic QR Code, you track scan counts. For full sales attribution, add UTM parameters to the destination URL and use Google Analytics.",
      },
    ],
    cta: "Create a free E-Commerce QR Code",
    relatedSlugs: ["url-qr-code", "coupon-qr-code", "dynamic-qr-code"],
  },
  "coupon-qr-code": {
    title: "Coupon QR Code — Free Coupon QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for discount coupons and promo codes. Drive in-store and online redemptions.",
    h1: "Coupon QR Code",
    intro:
      "Turn printed coupons into scannable QR Codes. Customers scan to reveal a discount code, link to a deal page or open a loyalty reward.",
    sections: [
      {
        heading: "How it works",
        body: "Link your QR Code to a coupon landing page, a discount code reveal page or a promotional URL. Customers scan and redeem.",
      },
      {
        heading: "Print and digital campaigns",
        body: "Print on flyers, receipts, product packaging, direct mail and in-store signage. Every physical touchpoint becomes a redemption channel.",
      },
      {
        heading: "Dynamic coupon codes",
        body: "Use a dynamic QR Code to rotate promotions without reprinting. Update the destination URL for seasonal sales, flash deals and exclusive offers.",
      },
    ],
    faqs: [
      {
        q: "Can I track coupon redemptions?",
        a: "Track scan counts with a dynamic QR Code. For full redemption tracking, link to a page that records promo code usage.",
      },
      {
        q: "Can I change the coupon without reprinting?",
        a: "Yes. Update the dynamic QR Code's destination URL to point at a new promotion.",
      },
    ],
    cta: "Create a free Coupon QR Code",
    relatedSlugs: ["e-commerce-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "wifi-qr-code": {
    title: "WiFi QR Code — Free WiFi QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your WiFi network. Guests scan and connect instantly — no typing the password.",
    h1: "WiFi QR Code",
    intro:
      "Share your WiFi password without saying it out loud. A WiFi QR Code lets guests connect to your network by scanning — no typing, no spelling mistakes.",
    sections: [
      {
        heading: "How it works",
        body: "Enter your WiFi network name (SSID) and password. The generator creates a QR Code that encodes the connection details. Guests scan, tap Join, and they're connected.",
      },
      {
        heading: "Where to print it",
        body: "Café counters, hotel rooms, office reception desks, Airbnb welcome cards, restaurant tables and event venues.",
      },
      {
        heading: "No internet needed to scan",
        body: "The WiFi credentials are stored directly in the QR Code. Guests don't need an internet connection to scan it — they just point their camera and connect.",
      },
    ],
    faqs: [
      {
        q: "Does this work with WPA2 and WPA3?",
        a: "Yes. The QR Code encodes standard WiFi connection parameters that work with WEP, WPA, WPA2 and WPA3 networks.",
      },
      {
        q: "Can I include a hidden network name?",
        a: "Yes, but hidden networks require the exact SSID to be entered. The QR Code will include it, and the phone will connect even if the network doesn't broadcast its name.",
      },
    ],
    cta: "Create a free WiFi QR Code",
    relatedSlugs: ["text-to-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "qr-codes-for-business": {
    title: "QR Codes for Business — How Businesses Use QR Codes | UnifiedQR",
    description:
      "Learn how businesses use QR Codes for marketing, payments, inventory and customer engagement. Create yours free.",
    h1: "QR Codes for Business",
    intro:
      "QR Codes are one of the most versatile tools in modern business. From marketing campaigns to inventory management, here's how companies of every size use them — and how you can create your own for free.",
    sections: [
      {
        heading: "Marketing and advertising",
        body: "Print QR Codes on posters, flyers, billboards and product packaging to drive traffic to landing pages, social media profiles, videos and promotional offers.",
      },
      {
        heading: "Customer support",
        body: "Link QR Codes to WhatsApp, email or help centre pages. Customers scan and get support instantly without searching for contact details.",
      },
      {
        heading: "Payments",
        body: "Display QR Codes at checkout counters for digital wallet payments. Scan-to-pay is growing rapidly in markets across Asia, Europe and Latin America.",
      },
      {
        heading: "Inventory and asset tracking",
        body: "Attach QR Codes to products, shelves and equipment. Staff scan to check stock levels, update records and track asset locations.",
      },
      {
        heading: "Reviews and feedback",
        body: "Place QR Codes on receipts, tables and exit points linking to Google Reviews or feedback forms. Capture customer opinions while the experience is fresh.",
      },
    ],
    faqs: [
      {
        q: "Are QR Codes free for businesses?",
        a: "Yes. Static QR Codes are completely free on UnifiedQR. Dynamic QR Codes with analytics are available on free and paid plans.",
      },
      {
        q: "How do I know which QR Code type to use?",
        a: "Match the code to your goal: URL codes for websites, vCard for contact sharing, SMS/email for enquiries, dynamic codes for campaigns you want to track.",
      },
    ],
    cta: "Create a free QR Code for your business",
    relatedSlugs: ["url-qr-code", "dynamic-qr-code", "qr-codes-in-retail"],
  },
  "qr-codes-in-retail": {
    title: "QR Codes in Retail — In-Store QR Code Strategies | UnifiedQR",
    description:
      "Use QR Codes in retail to boost engagement, reduce print costs and track in-store campaigns. Create free retail QR Codes.",
    h1: "QR Codes in Retail",
    intro:
      "Retailers use QR Codes to bridge physical stores and digital experiences. From shelf labels to checkout counters, here's how QR Codes drive engagement and sales in retail.",
    sections: [
      {
        heading: "Shelf labels and product info",
        body: "Replace large printed information cards with QR Codes. Customers scan to see detailed specs, reviews, comparison charts and video demos.",
      },
      {
        heading: "In-store promotions",
        body: "Place QR Codes on end caps, window displays and promotional stands. Link to exclusive online deals, loyalty sign-ups and flash sales.",
      },
      {
        heading: "Checkout and payments",
        body: "Speed up checkout with scan-to-pay QR Codes. Reduce queue times and offer contactless payment options.",
      },
      {
        heading: "Returns and support",
        body: "Print QR Codes on receipts linking to return forms, support chat or warranty registration pages.",
      },
    ],
    faqs: [
      {
        q: "How do I track in-store QR Code performance?",
        a: "Use dynamic QR Codes. Each scan records the device, time and approximate location, so you know which displays drive the most engagement.",
      },
      {
        q: "Do customers need a special app?",
        a: "No. Modern smartphones scan QR Codes through the native camera app. No third-party scanner required.",
      },
    ],
    cta: "Create a free Retail QR Code",
    relatedSlugs: ["qr-codes-for-business", "e-commerce-qr-code", "url-qr-code"],
  },
  "qr-codes-for-restaurants": {
    title: "QR Codes for Restaurants — Menu, Feedback & More | UnifiedQR",
    description:
      "Use QR Codes in your restaurant for digital menus, feedback collection and promotions. Create free restaurant QR Codes.",
    h1: "QR Codes for Restaurants",
    intro:
      "QR Codes have transformed restaurant operations. Digital menus, table-side ordering, feedback collection and loyalty programmes — all accessible with a quick scan.",
    sections: [
      {
        heading: "Digital menus",
        body: "Replace printed menus with QR Codes at each table. Customers scan, view the full menu on their phone, and you can update items and prices anytime.",
      },
      {
        heading: "Table-side ordering",
        body: "Link QR Codes to your online ordering page. Customers scan, order and pay without waiting for a server.",
      },
      {
        heading: "Feedback and reviews",
        body: "Place QR Codes on receipts or table tents linking to Google Reviews or your feedback form. Capture opinions while the meal is fresh in memory.",
      },
      {
        heading: "Loyalty programmes",
        body: "Print QR Codes on loyalty cards or receipts linking to sign-up pages. Build your customer database without paper forms.",
      },
    ],
    faqs: [
      {
        q: "Can I update the menu without reprinting the QR Code?",
        a: "Yes. Use a dynamic QR Code and update the linked URL whenever your menu changes.",
      },
      {
        q: "Do I need a website for my menu?",
        a: "No. Host your menu as a PDF on Google Drive or any free hosting service.",
      },
    ],
    cta: "Create a free Restaurant QR Code",
    relatedSlugs: ["menu-qr-code", "feedback-qr-code", "qr-codes-in-retail"],
  },
  "feedback-qr-code": {
    title: "Feedback QR Code — Collect Customer Reviews | UnifiedQR",
    description:
      "Create a QR Code for feedback collection. Link to Google Reviews, surveys or feedback forms with one scan.",
    h1: "Feedback QR Code",
    intro:
      "Make it effortless for customers to leave feedback. A feedback QR Code opens a review page, survey form or feedback portal — one scan and they're sharing their opinion.",
    sections: [
      {
        heading: "Google Reviews",
        body: "Link directly to your Google Reviews page. Customers scan, tap the star rating and write a review — no searching for your business name.",
      },
      {
        heading: "Custom surveys",
        body: "Link to Google Forms, Typeform, SurveyMonkey or your own feedback page. Collect structured data about customer satisfaction.",
      },
      {
        heading: "Where to place them",
        body: "Table tents, receipts, exit doors, counter displays and packaging inserts. The closer to the experience, the higher the response rate.",
      },
    ],
    faqs: [
      {
        q: "How do I get a direct link to my Google Reviews page?",
        a: "Search for your business on Google, click 'Write a review' and copy the URL from the review dialog. Paste it into the QR Code generator.",
      },
      {
        q: "Can I track how many reviews I get?",
        a: "Track QR Code scans with a dynamic code. Actual review completions depend on the platform (Google, Yelp, etc.) and cannot be tracked from our end.",
      },
    ],
    cta: "Create a free Feedback QR Code",
    relatedSlugs: ["qr-codes-for-restaurants", "survey-monkey-qr-code", "url-qr-code"],
  },
  "qr-codes-for-real-estate": {
    title: "QR Codes for Real Estate — Property Marketing | UnifiedQR",
    description:
      "Use QR Codes in real estate for property listings, virtual tours and open houses. Create free property QR Codes.",
    h1: "QR Codes for Real Estate",
    intro:
      "Real estate agents use QR Codes to turn every sign, flyer and brochure into an interactive property listing. Prospects scan and instantly access virtual tours, floor plans and booking pages.",
    sections: [
      {
        heading: "For-sale and for-rent signs",
        body: "Add a QR Code to every property sign. Prospects scan and see the full listing, photo gallery, virtual tour and agent contact details.",
      },
      {
        heading: "Open house materials",
        body: "Print QR Codes on flyers and brochures linking to virtual tours, mortgage calculators and neighbourhood guides.",
      },
      {
        heading: "Business cards",
        body: "Include a QR Code on your business card linking to your listing page, Zillow profile or personal website.",
      },
      {
        heading: "Property management",
        body: "Use QR Codes for maintenance requests, lease renewals and community notices in residential buildings.",
      },
    ],
    faqs: [
      {
        q: "Can I track how many people scan a property listing?",
        a: "Yes. Dynamic QR Codes record every scan with timestamps, device type and location. Compare performance across properties.",
      },
      {
        q: "Can I update the listing URL without reprinting?",
        a: "Yes. Use a dynamic QR Code and update the destination when the property status changes.",
      },
    ],
    cta: "Create a free Real Estate QR Code",
    relatedSlugs: ["url-qr-code", "vcard-qr-code-generator", "dynamic-qr-code"],
  },
  "qr-codes-for-education": {
    title: "QR Codes for Education — Schools, Universities & More | UnifiedQR",
    description:
      "Use QR Codes in education for assignments, library resources and campus navigation. Create free education QR Codes.",
    h1: "QR Codes for Education",
    intro:
      "Schools and universities use QR Codes to connect physical learning materials with digital resources. Students scan to access assignments, videos, library catalogues and campus maps.",
    sections: [
      {
        heading: "Classroom materials",
        body: "Print QR Codes on worksheets, textbooks and handouts linking to supplementary videos, reading materials and interactive exercises.",
      },
      {
        heading: "Library and resources",
        body: "Add QR Codes to book covers linking to reviews, author pages or related reading lists. Students scan and discover more.",
      },
      {
        heading: "Campus navigation",
        body: "Place QR Codes on building directories and maps. Students and visitors scan to get directions, class schedules and event listings.",
      },
      {
        heading: "Assignments and submissions",
        body: "Generate unique QR Codes for each assignment linking to submission forms, rubrics and reference materials.",
      },
    ],
    faqs: [
      {
        q: "Are QR Codes accessible for students with disabilities?",
        a: "QR Codes work best with visual scanning. Provide alternative access methods (URLs, NFC tags) for students who cannot use camera-based scanning.",
      },
      {
        q: "Do students need a special app?",
        a: "No. Modern smartphones scan QR Codes through the native camera app.",
      },
    ],
    cta: "Create a free Education QR Code",
    relatedSlugs: ["qr-codes-for-business", "url-qr-code", "text-to-qr-code"],
  },
  "qr-codes-for-healthcare": {
    title: "QR Codes for Healthcare — Patient Info & More | UnifiedQR",
    description:
      "Use QR Codes in healthcare for patient information, prescriptions and medical records. Create free healthcare QR Codes.",
    h1: "QR Codes for Healthcare",
    intro:
      "Healthcare providers use QR Codes to improve patient access to information. From prescription labels to waiting room displays, codes link patients to digital resources instantly.",
    sections: [
      {
        heading: "Prescription and medication info",
        body: "Print QR Codes on prescription labels linking to dosage instructions, side effects and drug interaction information.",
      },
      {
        heading: "Patient intake forms",
        body: "Display QR Codes in waiting rooms linking to digital intake forms. Patients fill out paperwork on their phone instead of clipboards.",
      },
      {
        heading: "Lab results and records",
        body: "Include QR Codes on printed lab reports linking to patient portals where results are available digitally.",
      },
      {
        heading: "Health education",
        body: "Place QR Codes on posters and brochures linking to instructional videos, exercise guides and dietary information.",
      },
    ],
    faqs: [
      {
        q: "Are QR Codes HIPAA compliant?",
        a: "QR Codes themselves don't store personal health information — they link to URLs. Ensure the destination URL and hosting service meet your compliance requirements.",
      },
      {
        q: "Can QR Codes be used on medical bracelets?",
        a: "Yes. Medical ID QR Codes can link to allergy information, emergency contacts and medical history for first responders.",
      },
    ],
    cta: "Create a free Healthcare QR Code",
    relatedSlugs: ["lab-results-qr-code", "medical-id-qr-code", "url-qr-code"],
  },
  "qr-code-history": {
    title: "QR Code History — The Story Behind QR Codes | UnifiedQR",
    description:
      "Learn the history of QR Codes — from automotive manufacturing to global ubiquity. From Denso Wave to 2026.",
    h1: "QR Code History",
    intro:
      "QR Codes were invented in 1994 by Denso Wave, a Japanese automotive parts company, to track vehicles during manufacturing. Three decades later, they're everywhere — from restaurant menus to concert tickets.",
    sections: [
      {
        heading: "1994: Invented by Denso Wave",
        body: "Masahiro Hara and his team at Denso Wave created the Quick Response Code to solve a problem: traditional barcodes couldn't hold enough data for parts tracking. The QR Code's two-dimensional matrix stored 100 times more information.",
      },
      {
        heading: "2000s: QR Codes reach the West",
        body: "After Denso Wave chose not to enforce their patent, QR Codes spread globally. Japanese and South Korean adoption led the way, with Western markets following slowly.",
      },
      {
        heading: "2011: iOS 11 native scanning",
        body: "Apple integrated QR Code scanning directly into the iPhone camera app in iOS 11 (2017). Android followed suit. This removed the need for third-party scanner apps and triggered mass adoption.",
      },
      {
        heading: "2020: COVID-19 accelerates adoption",
        body: "Contactless menus, vaccine passes and check-in systems made QR Codes a daily habit for billions. Usage increased by over 500% during the pandemic.",
      },
      {
        heading: "2026: Universal standard",
        body: "QR Codes are now used for payments, marketing, healthcare, education and logistics worldwide. GS1 Digital Link is connecting physical products to digital experiences at scale.",
      },
    ],
    faqs: [
      {
        q: "Who invented the QR Code?",
        a: "Masahiro Hara and his team at Denso Wave in 1994.",
      },
      {
        q: "Why is it called a QR Code?",
        a: "QR stands for 'Quick Response' — the code was designed to be decoded quickly in manufacturing environments.",
      },
      {
        q: "Are QR Codes patented?",
        a: "Denso Wave holds the patent but has chosen not to enforce it, making QR Codes free for anyone to use.",
      },
    ],
    cta: "Create your own QR Code",
    relatedSlugs: ["whats-a-qr-code", "dynamic-qr-code", "url-qr-code"],
  },
  "whats-a-qr-code": {
    title: "What Is a QR Code? — How QR Codes Work | UnifiedQR",
    description:
      "Learn what a QR Code is, how it works and why billions of people use them every day. Simple explanation with examples.",
    h1: "What Is a QR Code?",
    intro:
      "A QR Code (Quick Response Code) is a two-dimensional barcode that stores data in a grid of black and white squares. It can be scanned with a smartphone camera to instantly access URLs, contact details, text and more.",
    sections: [
      {
        heading: "How a QR Code works",
        body: "When you scan a QR Code, your camera captures the pattern of squares. The decoding software interprets the pattern and extracts the stored data — a URL, phone number, text or other content. The data is then displayed or acted upon.",
      },
      {
        heading: "Parts of a QR Code",
        body: "A QR Code has three finder patterns (the large squares in the corners), timing patterns, alignment patterns and data modules. The finder patterns help the scanner orient the code correctly, even at an angle.",
      },
      {
        heading: "Static vs dynamic",
        body: "A static QR Code stores data directly in the pattern — it can't be changed. A dynamic QR Code stores a short URL that redirects to the actual content, so you can update the destination without changing the printed code.",
      },
      {
        heading: "How much data can a QR Code hold?",
        body: "A standard QR Code can store up to 4,296 alphanumeric characters or 7,089 numeric digits. For URLs and most use cases, this is more than enough.",
      },
    ],
    faqs: [
      {
        q: "Do I need an app to scan a QR Code?",
        a: "No. Modern iOS (11+) and Android (9+) devices scan QR Codes natively through the camera app. No third-party scanner needed.",
      },
      {
        q: "Are QR Codes secure?",
        a: "QR Codes themselves are just data containers. Security depends on the content they link to. Always verify the URL before entering personal information.",
      },
      {
        q: "Can QR Codes be faked?",
        a: "Yes. Malicious QR Codes can link to phishing sites. Always check the URL after scanning and use QR Codes from trusted sources.",
      },
    ],
    cta: "Create your first QR Code",
    relatedSlugs: ["qr-code-history", "qr-code-size", "qr-codes-in-everyday-life"],
  },
  "qr-code-size": {
    title: "QR Code Size — What Size Should a QR Code Be? | UnifiedQR",
    description:
      "Learn the ideal QR Code size for print and digital. Minimum size, scanning distance and resolution guidelines.",
    h1: "QR Code Size Guide",
    intro:
      "The right QR Code size depends on how far away people will scan it. Too small and it won't scan. Too large and it wastes space. Here's how to pick the perfect size.",
    sections: [
      {
        heading: "The 10:1 rule",
        body: "The scanning distance should be at least 10 times the width of the QR Code. For example, if people scan from 1 metre away, the code should be at least 10 cm wide.",
      },
      {
        heading: "Recommended sizes",
        body: "Business cards: 2 cm × 2 cm minimum. Flyers and posters: 3–5 cm. Billboards: 30+ cm. Screens: at least 1 cm on mobile, 2.5 cm on desktop.",
      },
      {
        heading: "Resolution for print",
        body: "Export at 300 DPI for print. SVG format scales to any size without losing quality. PNG is fine for screens and social media.",
      },
      {
        heading: "Quiet zone",
        body: "Always leave a white border (quiet zone) around the QR Code. At least 4 modules wide. This helps scanners detect the code edges.",
      },
    ],
    faqs: [
      {
        q: "What's the smallest a QR Code can be?",
        a: "Technically, a QR Code can be as small as 2 cm × 2 cm for close-range scanning (business cards). For longer distances, increase the size proportionally.",
      },
      {
        q: "Does the error correction level affect size?",
        a: "Higher error correction levels (L, M, Q, H) create denser codes that may need more space. Use level M (15% correction) for a good balance.",
      },
    ],
    cta: "Create a QR Code at the right size",
    relatedSlugs: ["qr-code-error-correction", "qr-code-quiet-zone", "qr-code-best-practices"],
  },
  "qr-code-error-correction": {
    title: "QR Code Error Correction — How Damaged QR Codes Still Scan | UnifiedQR",
    description:
      "Understand QR Code error correction levels (L, M, Q, H) and how they let codes scan even when partially damaged.",
    h1: "QR Code Error Correction",
    intro:
      "QR Codes use Reed-Solomon error correction, which adds redundant data so codes can still scan even when partially damaged, dirty or covered by a logo.",
    sections: [
      {
        heading: "The four levels",
        body: "Level L: 7% recovery. Level M: 15% recovery. Level Q: 25% recovery. Level H: 30% recovery. Higher levels create denser codes but tolerate more damage.",
      },
      {
        heading: "When to use each level",
        body: "Use L for clean, indoor environments. Use M for general purpose (recommended). Use Q or H for outdoor signage, industrial use or codes with centred logos.",
      },
      {
        heading: "Why logos work",
        body: "A centred logo covers part of the data modules. Error correction fills in the gaps so the code still scans. Keep logos under 20% of the code area for reliable scanning.",
      },
    ],
    faqs: [
      {
        q: "Which error correction level should I use?",
        a: "Level M (15% recovery) is the best default. It balances code density with damage tolerance.",
      },
      {
        q: "Can I add a logo and still have the code scan?",
        a: "Yes, as long as the logo doesn't exceed 30% of the code area. Use error correction level H for maximum logo coverage.",
      },
    ],
    cta: "Create a QR Code with error correction",
    relatedSlugs: ["qr-code-size", "qr-code-quiet-zone", "qr-code-generator-with-logo"],
  },
  "qr-code-quiet-zone": {
    title: "QR Code Quiet Zone — White Border Requirements | UnifiedQR",
    description:
      "Learn why QR Codes need a white border (quiet zone) and how wide it should be for reliable scanning.",
    h1: "QR Code Quiet Zone",
    intro:
      "Every QR Code needs a blank white border called a 'quiet zone'. Without it, scanners may fail to detect where the code begins and ends.",
    sections: [
      {
        heading: "What is a quiet zone?",
        body: "The quiet zone is a margin of white (or light) space surrounding the QR Code. It tells the scanner where the code starts. Without it, nearby graphics, text or edges can confuse the decoder.",
      },
      {
        heading: "How wide should it be?",
        body: "The minimum quiet zone is 4 modules (the small squares that make up the QR Code). In practice, a border of at least 1 cm (0.4 inches) works for most print sizes.",
      },
      {
        heading: "Common mistakes",
        body: "Placing text too close to the code, putting the code in a coloured box without a border, or cropping the border in design software. Always leave breathing room.",
      },
    ],
    faqs: [
      {
        q: "What happens if I don't include a quiet zone?",
        a: "Scanning may fail or become unreliable. The scanner needs the blank space to distinguish the code from its surroundings.",
      },
      {
        q: "Does the quiet zone count towards the code size?",
        a: "Yes. When calculating print dimensions, add the quiet zone to the total size. A 3 cm code with 1 cm borders on each side needs 5 cm of space.",
      },
    ],
    cta: "Create a properly formatted QR Code",
    relatedSlugs: ["qr-code-size", "qr-code-error-correction", "qr-code-best-practices"],
  },
  "qr-code-best-practices": {
    title: "QR Code Best Practices — Tips for Reliable QR Codes | UnifiedQR",
    description:
      "Follow these QR Code best practices to ensure reliable scanning, maximum engagement and professional results.",
    h1: "QR Code Best Practices",
    intro:
      "A well-designed QR Code is scannable, engaging and professional. Follow these best practices to get the most out of every code you create.",
    sections: [
      {
        heading: "1. Test before printing",
        body: "Always scan your QR Code on multiple devices (iOS and Android) before printing. What works on one phone may fail on another.",
      },
      {
        heading: "2. Use high contrast",
        body: "Dark foreground on light background is the most reliable. Black on white is ideal. Avoid low-contrast colours.",
      },
      {
        heading: "3. Include a call to action",
        body: "Add text like 'Scan to view menu' or 'Scan for 10% off' near the code. People are more likely to scan when they know what to expect.",
      },
      {
        heading: "4. Leave a quiet zone",
        body: "Maintain a white border of at least 4 modules around the code. Don't crowd it with text or graphics.",
      },
      {
        heading: "5. Choose the right size",
        body: "Follow the 10:1 rule — scanning distance should be 10× the code width. For a 1 m scanning distance, use at least 10 cm.",
      },
      {
        heading: "6. Use dynamic codes for campaigns",
        body: "Dynamic QR Codes let you change the destination and track scans. Essential for marketing campaigns where you need analytics.",
      },
    ],
    faqs: [
      {
        q: "Should I use colour or black and white?",
        a: "Either works as long as there's high contrast. Coloured codes with your brand palette look professional and are still scannable.",
      },
      {
        q: "How do I know if my QR Code will scan?",
        a: "Test on at least 3 devices, including an older Android phone. If it scans on all of them, you're good to print.",
      },
    ],
    cta: "Create a reliable QR Code",
    relatedSlugs: ["qr-code-size", "qr-code-error-correction", "qr-code-quiet-zone"],
  },
  "qr-codes-in-everyday-life": {
    title: "QR Codes in Everyday Life — Where You See Them | UnifiedQR",
    description:
      "QR Codes are everywhere — restaurants, stores, transit, healthcare and more. See how they're part of daily life.",
    h1: "QR Codes in Everyday Life",
    intro:
      "QR Codes have quietly become part of daily life. From morning coffee to evening entertainment, here's where you encounter them without even thinking about it.",
    sections: [
      {
        heading: "Restaurants and cafés",
        body: "Digital menus, table-side ordering, WiFi sharing, loyalty sign-ups and payment. QR Codes replaced paper menus in millions of restaurants worldwide.",
      },
      {
        heading: "Retail stores",
        body: "Product information, price comparisons, in-store navigation, mobile payments and digital receipts. Every aisle is a potential scan point.",
      },
      {
        heading: "Public transport",
        body: "Bus stops, train stations and airports use QR Codes for ticketing, schedules, route maps and real-time updates.",
      },
      {
        heading: "Healthcare",
        body: "Prescription labels, patient intake forms, lab results and health education materials. QR Codes improve patient access to information.",
      },
      {
        heading: "Events and entertainment",
        body: "Concert tickets, movie posters, sports venues and museum exhibits. QR Codes connect physical experiences with digital content.",
      },
    ],
    faqs: [
      {
        q: "How many QR Codes are scanned per day globally?",
        a: "Estimates suggest over 100 million QR Code scans occur daily worldwide, a number that continues to grow as more industries adopt them.",
      },
      {
        q: "Will QR Codes eventually replace barcodes?",
        a: "GS1 (the global barcode standards body) is transitioning to QR Codes as the primary consumer-facing barcode by 2027. QR Codes will coexist with traditional barcodes for logistics.",
      },
    ],
    cta: "Create your own QR Code",
    relatedSlugs: ["whats-a-qr-code", "qr-codes-for-business", "qr-code-history"],
  },
  "telegram-qr-code": {
    title: "Telegram QR Code — Free Telegram QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code that opens a Telegram chat. Great for communities and customer support.",
    h1: "Telegram QR Code",
    intro:
      "Make it easy for people to reach you on Telegram. A QR Code opens a direct chat or group invitation — no need to search for usernames.",
    sections: [
      {
        heading: "How it works",
        body: "Enter your Telegram username or group invite link. When someone scans, Telegram opens with a chat to your account or group join page.",
      },
      {
        heading: "Community building",
        body: "Print on event materials, newsletters and social media graphics to drive Telegram group membership.",
      },
      {
        heading: "Customer support",
        body: "Display on your website, store and packaging. Customers scan and get instant support through Telegram's fast messaging.",
      },
    ],
    faqs: [
      {
        q: "Do scanners need Telegram installed?",
        a: "Yes. The QR Code opens a t.me link which redirects to Telegram. If not installed, it prompts the user to download it.",
      },
      {
        q: "Can I link to a specific group?",
        a: "Yes. Paste the group invite link and the QR Code will open the group join page.",
      },
    ],
    cta: "Create a free Telegram QR Code",
    relatedSlugs: ["whatsapp-qr-code", "discord-qr-code", "social-media-qr-code"],
  },
  "discord-qr-code": {
    title: "Discord QR Code — Free Discord QR Code Generator | UnifiedQR",
    description: "Create a QR Code for your Discord server. Get new members with one scan.",
    h1: "Discord QR Code",
    intro:
      "Grow your Discord community with scannable QR Codes. Link to your server invite — print on posters, merchandise and event materials.",
    sections: [
      {
        heading: "How to create one",
        body: "Copy your Discord server invite link, paste it into the generator and download your QR Code.",
      },
      {
        heading: "Gaming events and meetups",
        body: "Print on event badges, gaming setups and tournament materials. Attendees scan and join your server instantly.",
      },
      {
        heading: "Merchandise and packaging",
        body: "Add Discord QR Codes to product packaging, stickers and merch. Fans scan and join your community.",
      },
    ],
    faqs: [
      {
        q: "Do scanners need Discord installed?",
        a: "The invite link works in browser or app. If Discord is installed, it opens directly. If not, it opens in the browser with a join prompt.",
      },
      {
        q: "Can I track how many people join from the QR Code?",
        a: "Track scans with a dynamic QR Code. Actual server joins depend on the invite link settings and Discord's analytics.",
      },
    ],
    cta: "Create a free Discord QR Code",
    relatedSlugs: ["telegram-qr-code", "social-media-qr-code", "url-qr-code"],
  },
  "snapchat-qr-code": {
    title: "Snapchat QR Code — Free Snapcode QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your Snapchat profile. Get more friends and followers from print materials.",
    h1: "Snapchat QR Code",
    intro:
      "Turn offline touchpoints into Snapchat followers. A QR Code takes people straight to your profile or Snapcode — no searching required.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your Snapchat profile URL, customise the design and download.",
      },
      {
        heading: "Events and retail",
        body: "Print on event booths, merchandise and packaging. Attendees and customers scan and add you on Snapchat.",
      },
      {
        heading: "Cross-platform growth",
        body: "Add Snapchat QR Codes to your other social media profiles and marketing materials to grow your Snap following.",
      },
    ],
    faqs: [
      {
        q: "What URL should I use?",
        a: "Use your Snapchat profile URL in the format snapchat.com/add/your-username.",
      },
      {
        q: "Is it free?",
        a: "Yes. Create unlimited Snapchat QR Codes for free.",
      },
    ],
    cta: "Create a free Snapchat QR Code",
    relatedSlugs: ["instagram-qr-code", "tiktok-qr-code", "social-media-qr-code"],
  },
  "wechat-qr-code": {
    title: "WeChat QR Code — Free WeChat QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your WeChat profile or official account. Perfect for reaching Chinese audiences.",
    h1: "WeChat QR Code",
    intro:
      "Connect with the WeChat ecosystem through a scannable QR Code. Link to your profile, official account or Mini Program.",
    sections: [
      {
        heading: "How it works",
        body: "Paste your WeChat QR Code image URL or profile link, customise the design and download.",
      },
      {
        heading: "For businesses targeting China",
        body: "WeChat is the primary digital platform for Chinese consumers. A WeChat QR Code bridges your offline and online presence for this audience.",
      },
      {
        heading: "Events and trade shows",
        body: "Print on business cards, booth displays and marketing materials at international events to connect with WeChat users.",
      },
    ],
    faqs: [
      {
        q: "Do scanners need WeChat installed?",
        a: "Yes. WeChat QR Codes only work within the WeChat app. The scanner needs to open the code in WeChat.",
      },
      {
        q: "Can I link to a WeChat Mini Program?",
        a: "Yes. Mini Program QR Codes work the same way — paste the correct URL type and the code will open the Mini Program when scanned in WeChat.",
      },
    ],
    cta: "Create a free WeChat QR Code",
    relatedSlugs: ["whatsapp-qr-code", "social-media-qr-code", "url-qr-code"],
  },
  "pinterest-qr-code": {
    title: "Pinterest QR Code — Free Pinterest QR Code Generator | UnifiedQR",
    description:
      "Create a QR Code for your Pinterest profile or board. Drive pinners from print to your boards.",
    h1: "Pinterest QR Code",
    intro:
      "Link print materials to your Pinterest presence. A QR Code takes people straight to your profile, board or specific pin.",
    sections: [
      {
        heading: "How to create one",
        body: "Paste your Pinterest URL (profile, board or pin), customise the design and download.",
      },
      {
        heading: "Home décor and design",
        body: "Perfect for interior designers, home décor shops and craft businesses. Print on product tags and packaging to link to your Pinterest boards.",
      },
      {
        heading: "Wedding and event planners",
        body: "Share inspiration boards with clients. Print QR Codes on business cards, brochures and venue materials.",
      },
    ],
    faqs: [
      {
        q: "Can I link to a specific board or pin?",
        a: "Yes. Paste the URL of any Pinterest profile, board or individual pin.",
      },
      {
        q: "Is it free?",
        a: "Yes. Unlimited Pinterest QR Codes at no cost.",
      },
    ],
    cta: "Create a free Pinterest QR Code",
    relatedSlugs: ["instagram-qr-code", "social-media-qr-code", "url-qr-code"],
  },
  "survey-monkey-qr-code": {
    title: "SurveyMonkey QR Code — Free Survey QR Code Generator | UnifiedQR",
    description: "Create a QR Code for your SurveyMonkey survey. Get more responses with one scan.",
    h1: "SurveyMonkey QR Code",
    intro:
      "Increase survey response rates with a scannable QR Code. Customers scan and start answering — no typing URLs or searching for forms.",
    sections: [
      {
        heading: "How to create one",
        body: "Copy your SurveyMonkey survey link, paste it into the generator and download. Print at touchpoints where feedback matters.",
      },
      {
        heading: "Post-purchase feedback",
        body: "Print on receipts, packaging and thank-you cards. Customers scan and share their experience while it's fresh.",
      },
      {
        heading: "Employee engagement",
        body: "Place QR Codes in break rooms, offices and meeting spaces. Staff scan and provide anonymous feedback.",
      },
    ],
    faqs: [
      {
        q: "Can I track how many people start the survey?",
        a: "Track QR Code scans with a dynamic code. Survey completion rates depend on SurveyMonkey's analytics.",
      },
      {
        q: "Can I update the survey link without reprinting?",
        a: "Yes, with a dynamic QR Code. Change the destination URL anytime.",
      },
    ],
    cta: "Create a free Survey QR Code",
    relatedSlugs: ["feedback-qr-code", "url-qr-code", "dynamic-qr-code"],
  },
  "resume-qr-code": {
    title: "Resume QR Code — Add a QR Code to Your CV | UnifiedQR",
    description:
      "Add a QR Code to your resume linking to your portfolio, LinkedIn or online CV. Stand out to recruiters.",
    h1: "Resume QR Code",
    intro:
      "Make your resume interactive. A QR Code links recruiters to your portfolio, LinkedIn profile, video introduction or online CV — all from a single scan.",
    sections: [
      {
        heading: "What to link to",
        body: "Your portfolio website, LinkedIn profile, GitHub repository, personal blog or a video introduction. Choose the link that best showcases your skills.",
      },
      {
        heading: "Where to place it",
        body: "Top-right corner of your resume, next to your contact details. Keep it small (2 cm × 2 cm) and professional.",
      },
      {
        heading: "Why it works",
        body: "Recruiters spend an average of 7 seconds scanning a resume. A QR Code gives them instant access to your full body of work without leaving the paper.",
      },
    ],
    faqs: [
      {
        q: "Will a QR Code on my resume look unprofessional?",
        a: "No. QR Codes on resumes are now common and well-received, especially in tech, design and marketing roles.",
      },
      {
        q: "Should I use a static or dynamic QR Code?",
        a: "Static is fine for a stable portfolio URL. Use dynamic if you want to update the destination (e.g., change from portfolio to job application tracking) without reprinting.",
      },
    ],
    cta: "Create a free Resume QR Code",
    relatedSlugs: ["vcard-qr-code-generator", "social-media-qr-code", "url-qr-code"],
  },
  "qr-code-on-business-card": {
    title: "QR Code on Business Card — How to Use QR Codes on Cards | UnifiedQR",
    description:
      "Add a QR Code to your business card. Share your contact details, portfolio and social profiles with one scan.",
    h1: "QR Code on Business Card",
    intro:
      "A QR Code transforms a static business card into an interactive gateway. One scan and your contact is saved, your portfolio is viewed and your social profiles are followed.",
    sections: [
      {
        heading: "What to link",
        body: "vCard contact details (scan-to-save), LinkedIn profile, portfolio website, or a multi-URL page with all your links.",
      },
      {
        heading: "Size and placement",
        body: "Keep the code 2 cm × 2 cm minimum. Place it in a corner where it doesn't compete with your name and title. Leave a quiet zone around it.",
      },
      {
        heading: "Design tips",
        body: "Match the code colours to your card design. Add a small label like 'Scan to save contact' next to the code.",
      },
    ],
    faqs: [
      {
        q: "Will the QR Code fit on a standard business card?",
        a: "Yes. A 2 cm × 2 cm QR Code takes up minimal space and still scans reliably.",
      },
      {
        q: "Should I use a vCard QR Code or a URL QR Code?",
        a: "A vCard QR Code saves contact details directly into the phone. A URL QR Code opens a landing page. Choose vCard for maximum convenience.",
      },
    ],
    cta: "Create a QR Code for your business card",
    relatedSlugs: ["vcard-qr-code-generator", "contact-qr-code", "qr-code-size"],
  },
  "qr-code-on-flyers": {
    title: "QR Code on Flyers — Boost Your Flyer Campaigns | UnifiedQR",
    description:
      "Add QR Codes to your flyers to drive traffic, collect feedback and track campaign performance.",
    h1: "QR Code on Flyers",
    intro:
      "Flyers are one of the most common places for QR Codes. A well-placed code turns a passive reader into an active participant — scanning to visit, sign up, purchase or learn more.",
    sections: [
      {
        heading: "Where to place it on the flyer",
        body: "Bottom-right corner or just above the call to action. The code should be visible without folding, with enough white space around it.",
      },
      {
        heading: "What to link",
        body: "Landing pages, registration forms, product pages, event RSVPs, discount codes or social media profiles. Match the link to the flyer's goal.",
      },
      {
        heading: "Track your campaign",
        body: "Use a dynamic QR Code for each flyer variant. Compare scan counts to find which design, placement and message performs best.",
      },
    ],
    faqs: [
      {
        q: "How big should the QR Code be on a flyer?",
        a: "At least 3 cm × 3 cm on an A4 flyer. Follow the 10:1 rule — if people scan from arm's length (~30 cm), the code should be at least 3 cm.",
      },
      {
        q: "Should I add text near the QR Code?",
        a: "Yes. A call to action like 'Scan for 20% off' or 'Scan to register' increases scan rates by 30–50%.",
      },
    ],
    cta: "Create a QR Code for your flyers",
    relatedSlugs: ["qr-code-best-practices", "dynamic-qr-code", "url-qr-code"],
  },
  "qr-codes-on-digital-signage": {
    title: "QR Codes on Digital Signage — Interactive Displays | UnifiedQR",
    description:
      "Use QR Codes on digital signage to bridge physical and digital. Drive engagement from screens and displays.",
    h1: "QR Codes on Digital Signage",
    intro:
      "Digital signage reaches people in transit, but they can't click a screen. QR Codes let them take action — scanning to buy, sign up, learn more or follow.",
    sections: [
      {
        heading: "Retail and malls",
        body: "Display QR Codes on digital kiosks and screens linking to product pages, store directories and promotional offers.",
      },
      {
        heading: "Transit stations",
        body: "Add QR Codes to departure boards, route maps and platform displays linking to schedules, ticket purchases and real-time updates.",
      },
      {
        heading: "Corporate lobbies",
        body: "Display on lobby screens linking to company information, job listings and visitor check-in forms.",
      },
    ],
    faqs: [
      {
        q: "How big should a QR Code be on a digital screen?",
        a: "At least 2.5 cm on a desktop screen and 1 cm on mobile. For large digital signage, use 10–30 cm depending on viewing distance.",
      },
      {
        q: "Will a QR Code on a screen scan properly?",
        a: "Yes, as long as the resolution is high enough and the contrast is maintained. Test at the intended viewing distance before deploying.",
      },
    ],
    cta: "Create a QR Code for digital signage",
    relatedSlugs: ["billboard-qr-code", "qr-code-size", "qr-code-best-practices"],
  },
  "billboard-qr-code": {
    title: "Billboard QR Code — QR Codes on Large-Format Signage | UnifiedQR",
    description:
      "Create QR Codes sized for billboards and large-format signage. Scannable from a distance.",
    h1: "Billboard QR Code",
    intro:
      "Billboard QR Codes are large-format codes designed to be scanned from a distance — cars, buses or pedestrians on the opposite side of the street.",
    sections: [
      {
        heading: "Sizing for distance",
        body: "Follow the 10:1 rule. For a 10 metre scanning distance, the code should be at least 1 metre wide. For 20 metres, use 2 metres.",
      },
      {
        heading: "High error correction",
        body: "Use error correction level H (30% recovery) for billboards. Environmental factors like weather, dirt and lighting can partially obscure the code.",
      },
      {
        heading: "Simple content",
        body: "Keep the linked URL short and simple. Complex URLs create denser codes that are harder to scan at distance.",
      },
    ],
    faqs: [
      {
        q: "Can people scan a QR Code from a moving car?",
        a: "At highway speeds, scanning is unreliable. At city speeds (30–50 km/h) with a large enough code, it's possible but not recommended. Target pedestrians and parked vehicles.",
      },
      {
        q: "What file format should I use for billboards?",
        a: "SVG. It scales to any size without pixelation. Export at the exact dimensions needed for the billboard.",
      },
    ],
    cta: "Create a billboard-sized QR Code",
    relatedSlugs: ["qr-codes-on-digital-signage", "qr-code-size", "qr-code-best-practices"],
  },
  "qr-code-on-packaging-for-info": {
    title: "QR Code on Packaging — Product Information Codes | UnifiedQR",
    description:
      "Add QR Codes to product packaging for manuals, support, reviews and authenticity verification.",
    h1: "QR Code on Product Packaging",
    intro:
      "Product packaging is prime real estate for QR Codes. Link to setup guides, user manuals, customer support, reviews and authenticity verification — all from a small code on the box.",
    sections: [
      {
        heading: "User manuals and setup guides",
        body: "Replace thick paper manuals with a QR Code linking to an online guide. Customers scan and see step-by-step instructions, videos and FAQs.",
      },
      {
        heading: "Customer support",
        body: "Print a QR Code linking to your support page or WhatsApp chat. Customers scan and get help without searching your website.",
      },
      {
        heading: "Reviews and feedback",
        body: "Add a QR Code linking to a review page. Capture customer opinions while the product is still new and exciting.",
      },
      {
        heading: "Authenticity verification",
        body: "Use unique QR Codes on each product for anti-counterfeit verification. Customers scan and confirm the product is genuine.",
      },
    ],
    faqs: [
      {
        q: "What size should the QR Code be on packaging?",
        a: "2–3 cm for small boxes, 3–5 cm for larger packaging. Ensure it's visible and scannable in retail lighting conditions.",
      },
      {
        q: "Can I update the linked content without changing packaging?",
        a: "Yes, with a dynamic QR Code. Update the destination URL anytime without reprinting the packaging.",
      },
    ],
    cta: "Create a QR Code for your packaging",
    relatedSlugs: ["e-commerce-qr-code", "dynamic-qr-code", "qr-code-best-practices"],
  },
  "lab-results-qr-code": {
    title: "Lab Results QR Code — Share Lab Reports with QR Codes | UnifiedQR",
    description:
      "Create a QR Code for lab results. Let patients access their reports by scanning a code.",
    h1: "Lab Results QR Code",
    intro:
      "Simplify lab report delivery with QR Codes. Patients scan a code on their appointment card or printout and access their results digitally.",
    sections: [
      {
        heading: "How it works",
        body: "Host lab results in a patient portal or secure link. Generate a QR Code for each patient linking to their specific results. Print on appointment cards or discharge summaries.",
      },
      {
        heading: "Patient convenience",
        body: "No more waiting for postal mail or making phone calls. Patients scan and see their results on their phone at their convenience.",
      },
      {
        heading: "Privacy considerations",
        body: "Use unique, non-guessable URLs for each patient's results. Consider requiring authentication on the destination page.",
      },
    ],
    faqs: [
      {
        q: "Is this HIPAA compliant?",
        a: "QR Codes don't store health data — they link to URLs. Ensure the hosting platform meets your compliance requirements (encryption, access controls, audit logs).",
      },
      {
        q: "Can each patient have a unique QR Code?",
        a: "Yes. Generate a unique URL for each patient and create a separate QR Code for each. Track scans with dynamic codes.",
      },
    ],
    cta: "Create a free Lab Results QR Code",
    relatedSlugs: ["medical-id-qr-code", "qr-codes-for-healthcare", "url-qr-code"],
  },
  "medical-id-qr-code": {
    title: "Medical ID QR Code — Emergency Health Information | UnifiedQR",
    description:
      "Create a Medical ID QR Code with emergency health info. First responders can scan for allergies, blood type and conditions.",
    h1: "Medical ID QR Code",
    intro:
      "A Medical ID QR Code stores critical health information that first responders can access in emergencies. Scan to reveal allergies, blood type, medications, conditions and emergency contacts.",
    sections: [
      {
        heading: "What to include",
        body: "Blood type, known allergies, current medications, medical conditions (diabetes, epilepsy, etc.), emergency contact name and number, and doctor's contact details.",
      },
      {
        heading: "Where to wear it",
        body: "Medical bracelets, necklaces, keychains and wallet cards. First responders are trained to look for medical ID indicators.",
      },
      {
        heading: "Why it matters",
        body: "In an emergency, patients may be unconscious or unable to communicate. A medical ID QR Code gives first responders instant access to life-saving information.",
      },
    ],
    faqs: [
      {
        q: "Do first responders know to scan QR Codes?",
        a: "Many first responders are trained to look for medical ID indicators, including QR Codes. However, it's wise to also have traditional engraved medical information.",
      },
      {
        q: "Is the data stored on the QR Code?",
        a: "It can be. Text QR Codes store data directly. For richer data, link to a hosted medical profile page.",
      },
    ],
    cta: "Create a Medical ID QR Code",
    relatedSlugs: ["qr-codes-for-healthcare", "lab-results-qr-code", "text-to-qr-code"],
  },
  "qr-codes-on-stationery": {
    title: "QR Codes on Stationery — Letterheads, Notecards & More | UnifiedQR",
    description:
      "Add QR Codes to stationery — letterheads, envelopes, notecards and stamps. Connect print with digital.",
    h1: "QR Codes on Stationery",
    intro:
      "Stationery is an often-overlooked place for QR Codes. Letterheads, envelopes, notecards and custom stamps become interactive when you add a scannable code.",
    sections: [
      {
        heading: "Business letterheads",
        body: "Add a QR Code to your letterhead linking to your website, portfolio or contact page. Every letter becomes a marketing touchpoint.",
      },
      {
        heading: "Thank-you notecards",
        body: "Print QR Codes on thank-you cards linking to a personalised video message, photo gallery or special offer.",
      },
      {
        heading: "Custom stamps and stickers",
        body: "Create small QR Code stamps for packaging, envelopes and promotional materials. Fast, reusable and consistent branding.",
      },
    ],
    faqs: [
      {
        q: "Will a QR Code on a letterhead look professional?",
        a: "Yes, as long as it's small (1.5–2 cm), placed discreetly (bottom corner) and matches the stationery design.",
      },
      {
        q: "What format should I use for stationery?",
        a: "SVG for print. It scales without pixelation and works with any print service.",
      },
    ],
    cta: "Create a QR Code for your stationery",
    relatedSlugs: ["qr-code-on-business-card", "qr-code-on-flyers", "qr-code-best-practices"],
  },
  "qr-codes-on-book-cover": {
    title: "QR Codes on Book Covers — Author & Publisher Tools | UnifiedQR",
    description:
      "Add QR Codes to book covers linking to author pages, reviews and bonus content. Connect readers with digital experiences.",
    h1: "QR Codes on Book Covers",
    intro:
      "Authors and publishers use QR Codes on book covers to connect readers with bonus content, author bios, review pages and companion materials.",
    sections: [
      {
        heading: "Back cover QR Code",
        body: "Print a QR Code on the back cover linking to the author's website, book trailer video or a page with bonus chapters and reading guides.",
      },
      {
        heading: "Inside front cover",
        body: "Add a QR Code inside the front cover linking to a 'Reader's Companion' page with character guides, maps and discussion questions.",
      },
      {
        heading: "Series cross-promotion",
        body: "Link QR Codes to other books in the series, pre-order pages or the author's newsletter sign-up.",
      },
    ],
    faqs: [
      {
        q: "Will a QR Code affect the book's cover design?",
        a: "A small, well-placed QR Code (2 cm × 2 cm) in a corner or on the back cover adds functionality without disrupting the design.",
      },
      {
        q: "Can I track how many readers scan the code?",
        a: "Yes, with a dynamic QR Code. Track scans to measure reader engagement with digital content.",
      },
    ],
    cta: "Create a QR Code for your book",
    relatedSlugs: ["url-qr-code", "dynamic-qr-code", "qr-code-on-packaging-for-info"],
  },
  "qr-code-for-games": {
    title: "QR Code for Games — Gaming QR Code Ideas | UnifiedQR",
    description:
      "Use QR Codes in gaming for scavenger hunts, in-game rewards, live events and community building.",
    h1: "QR Code for Games",
    intro:
      "QR Codes add interactive layers to gaming — from real-world scavenger hunts to in-game reward redemption and live event engagement.",
    sections: [
      {
        heading: "Scavenger hunts and ARGs",
        body: "Hide QR Codes in the physical world that unlock in-game content, clues or rewards. Great for promotional events and community engagement.",
      },
      {
        heading: "In-game rewards",
        body: "Print QR Codes on merchandise, event tickets or packaging that redeem exclusive in-game items, skins or currency.",
      },
      {
        heading: "Live events and tournaments",
        body: "Display QR Codes at gaming events linking to brackets, live streams, social media and registration pages.",
      },
      {
        heading: "Community building",
        body: "Link QR Codes to Discord servers, subreddit pages and community forums. Grow your player base from physical marketing.",
      },
    ],
    faqs: [
      {
        q: "Can I create unique QR Codes for each player?",
        a: "Yes. Generate unique URLs for each player and create individual QR Codes. Track which codes are scanned for event check-ins and reward redemption.",
      },
      {
        q: "Do QR Codes work in dark environments?",
        a: "Yes, as long as there's enough light for the camera to detect the code. For dark venues, use backlit displays or glow-in-the-dark QR Code prints.",
      },
    ],
    cta: "Create a QR Code for your game",
    relatedSlugs: ["event-qr-code", "dynamic-qr-code", "url-qr-code"],
  },
  "qr-code-for-non-profits": {
    title: "QR Codes for Non-Profits — Fundraising & Outreach | UnifiedQR",
    description:
      "Use QR Codes for non-profit fundraising, volunteer sign-ups, event registration and donation collection.",
    h1: "QR Codes for Non-Profits",
    intro:
      "Non-profits use QR Codes to simplify donations, boost volunteer engagement and maximise event reach. One scan connects supporters to your mission.",
    sections: [
      {
        heading: "Donation collection",
        body: "Print QR Codes on posters, flyers and event materials linking to your donation page. Remove friction from the giving process.",
      },
      {
        heading: "Volunteer sign-ups",
        body: "Display QR Codes at events, community boards and partner locations linking to volunteer registration forms.",
      },
      {
        heading: "Event promotion",
        body: "Print on promotional materials linking to event pages, ticket purchases and livestream links.",
      },
      {
        heading: "Storytelling",
        body: "Link QR Codes to beneficiary stories, impact reports and video testimonials. Show supporters exactly where their contributions go.",
      },
    ],
    faqs: [
      {
        q: "Is there a discounted plan for non-profits?",
        a: "UnifiedQR's free plan includes unlimited static QR Codes and 2 dynamic codes. For most non-profit use cases, the free plan is sufficient.",
      },
      {
        q: "Can I track donations from QR Code scans?",
        a: "Track scan counts with dynamic QR Codes. For donation attribution, use unique UTM parameters in the destination URL.",
      },
    ],
    cta: "Create a free QR Code for your non-profit",
    relatedSlugs: ["event-qr-code", "feedback-qr-code", "url-qr-code"],
  },
  "qr-code-for-self-guided-tours": {
    title: "QR Codes for Self-Guided Tours — Interactive Tourism | UnifiedQR",
    description:
      "Create QR Codes for self-guided tours. Link to audio guides, maps, history and multimedia at each stop.",
    h1: "QR Codes for Self-Guided Tours",
    intro:
      "Transform any location into an interactive tour stop. QR Codes at each point link to audio narration, historical facts, maps and multimedia content.",
    sections: [
      {
        heading: "How it works",
        body: "Place a QR Code at each tour stop. Visitors scan and hear audio narration, read historical context or watch video content about the location.",
      },
      {
        heading: "Museums and galleries",
        body: "Place codes next to exhibits linking to artist bios, process videos and high-resolution images. Visitors explore at their own pace.",
      },
      {
        heading: "City and heritage walks",
        body: "Mark historical buildings, landmarks and hidden gems with QR Codes. Tourists scan and learn the stories behind the locations.",
      },
      {
        heading: "Nature trails",
        body: "Add QR Codes at points of interest along hiking trails linking to wildlife guides, plant identification and safety information.",
      },
    ],
    faqs: [
      {
        q: "Do visitors need to download an app?",
        a: "No. The QR Codes open web pages directly in the phone's browser. No app installation required.",
      },
      {
        q: "Can I update tour content without reprinting?",
        a: "Yes, with dynamic QR Codes. Update audio files, text and media anytime without changing the printed codes.",
      },
    ],
    cta: "Create QR Codes for your tour",
    relatedSlugs: ["event-qr-code", "audio-qr-code", "dynamic-qr-code"],
  },
  "qr-code-for-business-card": {
    title: "QR Code for Business Card — Share Contact Info Instantly | UnifiedQR",
    description:
      "Add a QR Code to your business card. One scan saves your details to someone's phone.",
    h1: "QR Code for Business Card",
    intro:
      "A QR Code on your business card lets people save your contact details, visit your website or follow you on social media — all with one scan.",
    sections: [
      {
        heading: "What to link",
        body: "vCard (scan-to-save contact), your website, LinkedIn profile or a multi-URL page with all your social profiles.",
      },
      {
        heading: "Size and placement",
        body: "2 cm × 2 cm minimum. Place in a corner or below your contact details. Leave a quiet zone around the code.",
      },
      {
        heading: "Make it action-oriented",
        body: "Add a small label like 'Scan to save my contact' or 'Scan for portfolio'. Give people a reason to scan.",
      },
    ],
    faqs: [
      {
        q: "Should I use a static or dynamic QR Code?",
        a: "Static for stable URLs (portfolio, LinkedIn). Dynamic if you want to update the destination without reprinting cards.",
      },
      {
        q: "Will the QR Code fit on a standard card?",
        a: "Yes. A 2 cm × 2 cm code takes up minimal space and scans reliably.",
      },
    ],
    cta: "Create a QR Code for your business card",
    relatedSlugs: ["vcard-qr-code-generator", "qr-code-on-business-card", "contact-qr-code"],
  },
  "qr-codes-in-printed-book-ads": {
    title: "QR Codes in Book Ads — Print Advertising with QR Codes | UnifiedQR",
    description:
      "Add QR Codes to book advertisements in magazines, newspapers and catalogues. Track ad engagement with scan data.",
    h1: "QR Codes in Book Ads",
    intro:
      "Print ads have no click tracking. QR Codes change that — every scan is a measurable engagement. Add them to magazine ads, newspaper inserts and catalogue pages.",
    sections: [
      {
        heading: "Why QR Codes in print ads",
        body: "Print advertising is one-directional. QR Codes create a two-way bridge. Readers scan and you get measurable data on engagement.",
      },
      {
        heading: "Book and author promotion",
        body: "Include QR Codes in magazine ads linking to book trailers, author interviews, sample chapters and purchase pages.",
      },
      {
        heading: "Catalogue and brochure ads",
        body: "Add QR Codes next to product listings in printed catalogues linking to online ordering, detailed specs and video demos.",
      },
    ],
    faqs: [
      {
        q: "Do QR Codes in print ads actually get scanned?",
        a: "Yes, when paired with a compelling call to action. 'Scan for a free chapter' or 'Scan for 20% off' drives significantly higher scan rates than codes with no label.",
      },
      {
        q: "How do I track print ad performance?",
        a: "Use a unique dynamic QR Code for each ad placement. Compare scan counts across publications, issues and positions.",
      },
    ],
    cta: "Create a QR Code for your print ad",
    relatedSlugs: ["qr-code-on-flyers", "billboard-qr-code", "dynamic-qr-code"],
  },
  "qr-codes-for-open-house-flyers": {
    title: "QR Codes for Open House Flyers — Real Estate Marketing | UnifiedQR",
    description:
      "Add QR Codes to open house flyers. Let visitors scan for virtual tours, property details and agent contact info.",
    h1: "QR Codes for Open House Flyers",
    intro:
      "Open house flyers are perfect for QR Codes. Prospects scan to see the full listing, virtual tour, neighbourhood data and agent contact — all from a single code.",
    sections: [
      {
        heading: "What to link",
        body: "Virtual tour, full listing page, mortgage calculator, neighbourhood guide or agent vCard. Choose the link that best serves the visitor.",
      },
      {
        heading: "Placement on the flyer",
        body: "Bottom-right corner or just above the agent contact details. Make it prominent but not distracting.",
      },
      {
        heading: "Track engagement",
        body: "Use a unique dynamic QR Code for each property. Know which listings generate the most scan engagement.",
      },
    ],
    faqs: [
      {
        q: "Can I update the destination after printing flyers?",
        a: "Yes, with a dynamic QR Code. If the listing status changes, update the URL without reprinting.",
      },
      {
        q: "What size should the QR Code be on a flyer?",
        a: "3–4 cm for an A4 flyer. Ensure it's large enough to scan from arm's length.",
      },
    ],
    cta: "Create a QR Code for your open house",
    relatedSlugs: ["qr-codes-for-real-estate", "qr-code-on-flyers", "dynamic-qr-code"],
  },
};

export function getPage(slug: string): ContentPage | undefined {
  return pages[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(pages);
}
