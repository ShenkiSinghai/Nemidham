/* =====================================================================
   यह वेबसाइट की सारी जानकारी की फ़ाइल है। / THIS IS THE FILE YOU EDIT.
   Timings, announcements, yojanayen, karyakram, photos, team, about, daan,
   how to reach, social links: everything is here.

   Every text has two languages:   { hi: "हिंदी में", en: "In English" }

   Simple rules:
   - Keep the quote marks "like this" around text.
   - Keep the comma at the end of each item.
   - Add a new item by copying a whole { ... }, block and changing the text.
   - Delete an item by removing its whole { ... }, block.
   - Anything marked SAMPLE is only an example. Replace or delete it
     before the website goes public (search this file for the word SAMPLE).
   - Hindi: write easy Hindi. For hard words, write the English word in
     Devanagari letters (for example: गैलरी, कैलेंडर, टीम).
   - English: write Hindi words in English letters (Daan, Karyakram, Aarti).
   ===================================================================== */

/* ---------- 0. YOUR LINKS: WhatsApp, Facebook, Instagram, YouTube ----------
   Paste the full link between the quote marks.
   The four icons always show. A platform with "" (no link yet) is shown greyed out and cannot be clicked.
   The links open that platform directly. They appear in the footer of every page. */
window.LINKS = {
  whatsappGroup: "https://chat.whatsapp.com/IECu8XuP7dLFaWeDHTsHMW?s=cl&p=a&mlu=4&ilr=4&iam=2",   // WhatsApp group invite link
  facebook: "https://www.facebook.com/share/19mUVVu8pS/",
  instagram: "https://www.instagram.com/neminathjinalay",
  youtube: "https://youtube.com/@neminathjinalay"          // YouTube channel link
};

/* ---------- 1. Basic details ---------- */
window.SITE = {
  name:  { hi: "श्री 1008 नेमिनाथ दिगंबर जैन मंदिर", en: "Shri 1008 Neminath Digambar Jain Mandir" },
  place: { hi: "नेमिधाम", en: "Nemidham" },
  tagline: {
    hi: "नेमिधाम में रोज़ दर्शन, अभिषेक और आरती। आपके सहयोग से मंदिर का विकास आगे बढ़ रहा है।",
    en: "Daily darshan, abhishek and aarti at Nemidham. The mandir is growing with your support."
  },

  // ---- Home page top banner (the big picture screen) ----
  // The line shown under "Nemidham", just above the buttons. Change it any time.
  heroLine: {
    hi: "जैन संस्कारों के बीजारोपण का एक नया केंद्र",
    en: "A New Center for the Sowing of Jain Values"
  },
  // Small line above the mandir name. Write "" to hide it.
  heroInvocation: { hi: "॥ जय जिनेन्द्र ॥", en: "|| Jai Jinendra ||" },
  // true = flowers and petals float down in the banner; false = switch them off.
  heroPetals: true,
  // The two buttons under the line. Write "" in href to hide a button.
  heroButtons: [
    { href: "daan.html",  label: { hi: "दान करें", en: "Daan" }, style: "gold" },
    { href: "daily.html", label: { hi: "दैनिक कार्यक्रम", en: "Daily Karyakram" }, style: "ghost" }
  ],
  // Menu items you want to hide (write the page names): "yojana", "daily", "karyakram", "calendar", "announcements",
  //   "gallery", "about", "timeline", "team", "visit", "daan".   Example: hideMenu: ["timeline"],
  hideMenu: [],
  // Sections of the HOME page you want to hide (write the names): "yojana", "notices", "events", "gallery", "cta"
  //   (cta = the two cards "Give daan" and "Visit the mandir" at the bottom).  Example: hideHome: ["notices"],
  hideHome: [],
  // Tabs of the "Visit the mandir" page you want to hide: "timings", "reach", "facilities", "rules".  Example: hideVisitTabs: ["rules"],
  hideVisitTabs: [],
  // false = remove the grey "Dharmshala (coming soon)" line from the About us menu.
  dharmshalaSoon: true,
  timezone: "Asia/Kolkata",

  // true shows the "Open now" box and daily timings. false hides them everywhere.
  showTimings: true,

  // 24-hour format "HH:MM". 6:30 AM = "06:30", 7:30 PM = "19:30"
  timings: { open: "06:30", abhishek: "07:30", aarti: "19:30", close: "21:00" },
  timingsNote: {
    hi: "त्योहार के दिनों में समय बदल सकता है। कृपया सूचनाएं देखें।",
    en: "Timings can change on festival days. Please check Announcements."
  },

  addressLines: [
    { hi: "श्री 1008 नेमिनाथ दिगंबर जैन मंदिर, नेमिधाम", en: "Shri 1008 Neminath Digambar Jain Mandir, Nemidham" },
    { hi: "बकोरी रोड, वाघोली", en: "Bakori Road, Wagholi" },
    { hi: "पुणे, महाराष्ट्र, 412207", en: "Pune, Maharashtra, 412207" }
  ],
  phone: "",       // e.g. "+91 98765 43210"
  whatsapp: "",    // number for chat: digits only with country code, e.g. "919876543210"
  email: "",       // e.g. "contact@example.org"

  // Map. Fill ONE of these and the map appears on the "How to reach" page:
  //  mapQuery: the place name or coordinates as Google Maps understands them,
  //            e.g. "Neminath Jinalay Nemidham" or "18.5204,73.8567"
  //  mapLink / mapEmbed: optional. Paste your own Google Maps share link /
  //            embed src if you want to override the automatic ones.
  mapQuery: "",
  mapLink: "https://maps.app.goo.gl/hmgaJF2hrvdnN2jf8",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.6979918312923!2d74.00815587372229!3d18.587649567124686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c3005211eeaf%3A0x258f5a756ded4252!2sShri%201008%20Neminath%20Jinalay%2C%20Nemidham!5e0!3m2!1sen!2sin!4v1793055390325!5m2!1sen!2sin",

  // Social links: fill them in section 0 at the top of this file.
  social: window.LINKS,

  // Mandir logo shown in the menu. To use another picture, upload it to images/ and write its path here.
  // (images/jain-symbol.svg is the plain Jain symbol, if you ever want it back.)
  logo: "images/mandir-logo.png",

  // Visitor numbers. analyticsId: Google Analytics, private numbers for you (analytics.google.com).
  analyticsId: "G-BWWJVYC4Q4",

  // Visible visitor count shown in the footer (the public number everyone sees, not just you).
  // Make a free account at goatcounter.com (2 minutes, see README), then write its "site code" here
  // (if your dashboard is at nemidham.goatcounter.com, the code is "nemidham"). Leave "" to hide it.
  goatcounter: "nemidham",

  // Small credit shown at the bottom right of the footer. Set credit: null to hide it.
  credit: { name: "Shenki Singhai", url: "https://www.linkedin.com/in/shenki-singhai-20882061" },

  // Home page photo slideshow: a scrolling strip of photos on the Home page.
  //   enabled   true/false — turn the whole strip on or off.
  //   source    "all" pulls from every visible photo album, newest/as-uploaded order.
  //             Or write one album's id (e.g. "vedi-pratishtha") to only ever show that album.
  //   shuffle   false (default) keeps the same order every time, so it doesn't look random.
  //             Set true if you'd rather it mix the photos up differently on every visit.
  //   count     how many photos to pull into the strip. Write  count: "all"  to show EVERY photo of the album(s).
  //   seconds   how many seconds between each automatic scroll. (Theme 2: 2 seconds. It stops while the visitor keeps the mouse on a photo, and starts again when the mouse moves away.)
  slideshow: { enabled: true, source: "kshamavani-2026", shuffle: false, count: "all", seconds: 2 },


  // Namokar mantra audio on the Home page. enabled: true plays it by default (a visitor can switch it off with the small button).
  // Put the file at  audio/namokarmantra.mp3  (any .mp3 is fine, a small file of 1-3 MB is best). If the file is missing, no button shows.
  // The sound starts at the visitor's first tap/click (browsers do not allow sound before that). volume: 0 to 1.
  audio: { enabled: true, file: "audio/namokarmantra.mp3", volume: 0.6 },

  // "Add as an app" (PWA). A pop-up offers it to visitors who have not added the app; the footer button is always there.
  //   popup: false            -> no pop-up (people can still add the app from the footer button or their browser menu)
  //   popupAfterDays: 4       -> after "Not now", the pop-up comes back after this many days
  //   popupGapMinutes: 30     -> if a visitor ignores the pop-up (no tap), it is not shown again for this many minutes (so it does not pop up on every page)
  //   footerButton: false     -> hide the footer button too (the browser's own menu still lets people add the site)
  // Writing  appInstall: false  switches off both the pop-up and the footer button.
  appInstall: { popup: true, popupAfterDays: 4, popupGapMinutes: 30, footerButton: true },

  // Bhaktamar path names written in the Google Sheet also appear on the Karyakram page by themselves.
  // Set bhaktamarKaryakram: false to stop that. bhaktamarTime is the time shown (leave "" to show no time).
  bhaktamarKaryakram: true,
  bhaktamarTime: { hi: "", en: "" },

  // Order of the albums on the Gallery page (photos and videos), by each album's date:
  //   "newest"  latest album first (default).   "oldest"  oldest album first.
  albumOrder: "newest",

  // Karyakram older than this drop off the "Past" tab. "year" = 365 days (366 in a leap year), counted back from today.
  // You can also write a number of days (like 30), or -1 to keep them all.
  karyakramPastDays: "year",

  // Where this site lives on GitHub. Only needed for the automatic photo list in Gallery albums.
  github: { user: "shenkisinghai", repo: "Nemidham" },

  // Optional: your YouTube channel ID (starts with UC, find it in YouTube Studio > Settings > Channel > Advanced).
  // All the channel's videos then play inside the site's Videos gallery, and new uploads appear by themselves.
  youtubeChannelId: "",

  // Optional big photo behind the top of the Home page, e.g. "images/hero.jpg".
  heroImage: "",

  // THEME 2 HOME: Bhagwan Neminath ki murti ki photo, jo bhamandal ke andar dikhti hai.
  // Photo ko images/ folder mein daalo aur uska naam yahan likho. Hum "neminath.webp" use karte hain (halki file, jaldi khulti hai,
  // quality wahi). Jab tak photo load nahi hoti tab tak wahan kuch nahi dikhta.
  // Best: transparent background wali WEBP ya PNG, lagbhag 900 x 1100 pixel.
  murti: "images/neminath.webp",
  // Namokar mantra (home ke hero ke niche chalta hai). Badalna ho to yahan likho.
  mantraLines: [
    "णमो अरिहंताणं", "णमो सिद्धाणं", "णमो आयरियाणं", "णमो उवज्झायाणं", "णमो लोए सव्वसाहूणं",
    "एसो पंच णमोक्कारो, सव्व पावप्पणासणो", "मंगलाणं च सव्वेसिं, पढमं हवइ मंगलं"
  ]
};

/* ---------- 2. Top banner (the thin gold strip at the very top) ---------- */
// Set enabled: false to hide it. Use it for the one most important message.
window.BANNER = {
  enabled: true,
  text: {
    hi: "संत शाला और नई प्रतिमाओं के लिए सहयोग का अवसर।",
    en: "Be part of building the Sant Shala and the new pratimas."
  },
  link: "yojana.html",
  linkText: { hi: "योजनाएं देखें", en: "See Yojanayen" }
};

/* ---------- 3. Yojanayen (upcoming works of the mandir) ---------- */
// status: "active" (efforts underway), "soon" (coming later), "done" (completed)
// target / raised: optional, e.g. "₹ 11,00,000". Leave "" to hide.
// details: a short list of points (optional).
// formUrl: optional Google Form link. Empty "" (or no line) = no button. Paste a link to show a "Submit your interest" button on that card.
//   The button words come from window.YOJANA_PAGE below (or write  formText: { hi: "...", en: "..." }  inside one card).
// The "contact for details" and "give daan" buttons are common: they sit once at the top of the Yojana page.
// pinned: true  shows the yojana on the Home page too. Yojanayen WITHOUT  pinned: true  show only on the Yojanayen page.
//   (If no yojana is pinned, the yojana section is left out of the Home page completely.)
// photo / photos: optional pictures of the yojana (plan drawing, land, model). Upload them to images/ then write
//   photo: "images/yojana/sant-shala.jpg"   or   photos: ["images/yojana/a.jpg", "images/yojana/b.jpg"]
//   The first picture also shows on the Home card; on the Yojanayen page all pictures show and open big when clicked.
// hidden: true  hides a yojana everywhere without deleting it.
// To add a new yojana: copy one whole { ... }, block, paste it after the last one, and change the text and id.
// To remove one: delete its whole { ... }, block, or set  hidden: true  (everywhere).
// To take one off the Home page only: change  pinned: true  to  pinned: false  (or delete that line).
window.YOJANA = [
  {
    id: "bhumi-daan",
    pinned: true,
    status: "active",
    title: { hi: "भूमि दान", en: "Bhumi Daan" },
    short: {
      hi: "मंदिर की अपनी भूमि के लिए भूमि दान लिया जा रहा है।",
      en: "Bhumi daan is being accepted for the mandir's own land."
    },
    summary: {
      hi: "मंदिर बना हुआ है, लेकिन अभी वह धार्मिक कार्य के लिए 3 साल के लिए दान की गई भूमि पर है। मंदिर की अपनी भूमि के लिए हम भूमि दान ले रहे हैं।",
      en: "The mandir is already built, but for now it stands on land given for religious use for 3 years. We are accepting bhumi daan so that the mandir can have its own land."
    },
    details: [
      { hi: "आवश्यक भूमि का क्षेत्रफल: 4000 वर्ग फुट।", en: "Land required: 4000 sq ft." },
      { hi: "भूमि दान करने के इच्छुक श्रद्धालु कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।", en: "If you wish to donate land, please contact the members listed on the Team page." }
    ],
    target: "", raised: "",
    photos: []        // e.g. ["images/yojana/bhumi.jpg"]  (optional)
  },
  {
    id: "sant-shala",
    pinned: true,
    status: "active",
    title: { hi: "संत शाला", en: "Sant Shala" },
    short: {
      hi: "साधु-संतों के ठहरने और साधना के लिए संत शाला का निर्माण।",
      en: "Building a Sant Shala for monks and sadhvis to stay and practise."
    },
    summary: {
      hi: "साधु-संतों के ठहरने और साधना के लिए मंदिर परिसर में संत शाला बनाने का प्रयास किया जा रहा है।",
      en: "We are working to build a Sant Shala within the mandir premises, where monks and sadhvis can stay and practise."
    },
    details: [
      { hi: "संत शाला से संबंधित जानकारी के लिए कृपया टीम से संपर्क करें।", en: "For information about the Sant Shala, please connect with the Team." }
    ],
    target: "", raised: ""
  },
  {
    id: "murti-mahavir",
    pinned: true,
    status: "active",
    title: { hi: "भगवान महावीर स्वामी की नई प्रतिमा", en: "New Pratima of Bhagwan Mahavir Swami" },
    short: {
      hi: "मंदिर जी में विराजमान की जाने वाली भगवान महावीर स्वामी की नई प्रतिमा।",
      en: "A new pratima of Bhagwan Mahavir Swami to be installed in the mandir."
    },
    summary: {
      hi: "भगवान महावीर स्वामी की नई प्रतिमा मंदिर जी में विराजमान की जाएगी।",
      en: "A new pratima of Bhagwan Mahavir Swami will be installed in the mandir."
    },
    details: [
      { hi: "8 इंच की अष्टधातु की प्रतिमा।", en: "An 8 inch pratima made of ashtadhatu (eight metals)." },
      { hi: "प्रतिमा की प्रतिष्ठा मुंबई में नवंबर 2026 में होने वाले पंचकल्याणक में की जाएगी।", en: "The pratima will be consecrated at the Panchkalyanak to be held in Mumbai in November 2026." }
    ],
    target: "", raised: ""
  },
  {
    id: "murti-munisuvratnath",
    pinned: true,
    status: "active",
    title: { hi: "भगवान मुनिसुव्रतनाथ की नई प्रतिमा", en: "New Pratima of Bhagwan Munisuvratnath" },
    short: {
      hi: "मंदिर जी में विराजमान की जाने वाली भगवान मुनिसुव्रतनाथ की नई प्रतिमा।",
      en: "A new pratima of Bhagwan Munisuvratnath to be installed in the mandir."
    },
    summary: {
      hi: "भगवान मुनिसुव्रतनाथ की नई प्रतिमा मंदिर जी में विराजमान की जाएगी।",
      en: "A new pratima of Bhagwan Munisuvratnath will be installed in the mandir."
    },
    details: [
      { hi: "8 इंच की अष्टधातु की प्रतिमा।", en: "An 8 inch pratima made of ashtadhatu (eight metals)." },
      { hi: "प्रतिमा की प्रतिष्ठा मुंबई में नवंबर 2026 में होने वाले पंचकल्याणक में की जाएगी।", en: "The pratima will be consecrated at the Panchkalyanak to be held in Mumbai in November 2026." }
    ],
    target: "", raised: ""
  },
  {
    id: "jain-society",
    pinned: true,
    status: "active",
    title: { hi: "नेमिधाम में आगामी जैन सोसायटी (फ्लैट्स)", en: "Upcoming Jain Society (Flats) at Nemidham" },
    short: {
      hi: "नेमिधाम में 150 फ्लैट की जैन सोसायटी बनाने का प्रयास।",
      en: "Efforts to build a Jain society of 150 flats at Nemidham."
    },
    summary: {
      hi: "नेमिधाम में जैन सोसायटी (फ्लैट्स) बनाने के लिए प्रयास किए जा रहे हैं। सोसायटी में 150 फ्लैट होंगे।",
      en: "Efforts are on to build a Jain society (flats) at Nemidham. The society will have 150 flats."
    },
    details: [
      { hi: "योजना 150 फ्लैट की सोसायटी की है।", en: "The plan is for a society of 150 flats." },
      { hi: "अब तक लगभग 70 लोगों ने अपनी रुचि दर्शाई है।", en: "About 70 people have shown interest so far." },
      { hi: "150 रुचि आने पर इस पर आगे कार्य शुरू किया जाएगा।", en: "Work will move ahead once 150 people have shown interest." },
      { hi: "जानकारी के लिए सौरभ जैन और नीलेश जैन से संपर्क करें। उनके नंबर टीम पेज पर मिल जाएंगे।", en: "For details, please contact Saurabh Jain and Neelesh Jain. Their numbers are on the Team page." }
    ],
    target: "", raised: "",
    formUrl: "https://forms.gle/NcoF3N6NF8j9S11j6"
  },
  {
    id: "dharmshala",
    pinned: true,
    status: "soon",
    title: { hi: "धर्मशाला और आवास", en: "Dharmshala and aavas" },
    short: {
      hi: "यात्रियों के ठहरने की व्यवस्था भविष्य में की जाएगी।",
      en: "Stay for yatris will be arranged in future."
    },
    summary: {
      hi: "मंदिर आने वाले यात्रियों के लिए धर्मशाला और आवास की व्यवस्था भविष्य में की जाएगी। जानकारी जल्द यहाँ दी जाएगी।",
      en: "A dharmshala and aavas for visiting yatris will be arranged in future. Details will be shared here soon."
    },
    details: [],
    target: "", raised: ""
  },

  // ---- 4 spare cards (hidden). To use one: delete its  hidden: true,  line and write your own text. ----
  {
    hidden: true,   // spare card "Yojana 1": delete this line, then write your own text
    id: "yojana-1",
    status: "active",
    title: { hi: "योजना 1", en: "Yojana 1" },
    short: { hi: "यहाँ योजना की एक लाइन लिखें।", en: "Write a one-line summary of the yojana here." },
    summary: { hi: "यहाँ योजना का पूरा विवरण लिखें।", en: "Write the full details of the yojana here." },
    details: [],
    target: "", raised: "",
    formUrl: ""     // Google Form link. Empty = no form button. Paste a link between the quotes to show the button.
  },
  {
    hidden: true,   // spare card "Yojana 2": delete this line, then write your own text
    id: "yojana-2",
    status: "active",
    title: { hi: "योजना 2", en: "Yojana 2" },
    short: { hi: "यहाँ योजना की एक लाइन लिखें।", en: "Write a one-line summary of the yojana here." },
    summary: { hi: "यहाँ योजना का पूरा विवरण लिखें।", en: "Write the full details of the yojana here." },
    details: [],
    target: "", raised: "",
    formUrl: ""     // Google Form link. Empty = no form button. Paste a link between the quotes to show the button.
  },
  {
    hidden: true,   // spare card "Yojana 3": delete this line, then write your own text
    id: "yojana-3",
    status: "active",
    title: { hi: "योजना 3", en: "Yojana 3" },
    short: { hi: "यहाँ योजना की एक लाइन लिखें।", en: "Write a one-line summary of the yojana here." },
    summary: { hi: "यहाँ योजना का पूरा विवरण लिखें।", en: "Write the full details of the yojana here." },
    details: [],
    target: "", raised: "",
    formUrl: ""     // Google Form link. Empty = no form button. Paste a link between the quotes to show the button.
  },
  {
    hidden: true,   // spare card "Yojana 4": delete this line, then write your own text
    id: "yojana-4",
    status: "active",
    title: { hi: "योजना 4", en: "Yojana 4" },
    short: { hi: "यहाँ योजना की एक लाइन लिखें।", en: "Write a one-line summary of the yojana here." },
    summary: { hi: "यहाँ योजना का पूरा विवरण लिखें।", en: "Write the full details of the yojana here." },
    details: [],
    target: "", raised: "",
    formUrl: ""     // Google Form link. Empty = no form button. Paste a link between the quotes to show the button.
  }
];

/* ---------- 3क. Common wording on the Yojana page (optional) ----------
   The two buttons at the top of the Yojana page, and the Google Form button on a card, use the words below.
   To change a word, edit the text between the quotes. Leave "" to use the standard wording.
   contactText  button that opens the Team page ("Contact us for details").
   daanText     button that opens the Daan page ("Give daan for the yojanayen").
   formText     the Google Form button on a card (shows only on cards that have a formUrl).
                A single card can use its own words with  formText: { hi: "...", en: "..." }  inside that card. */
window.YOJANA_PAGE = {
  contactText: { hi: "", en: "" },   // default: जानकारी के लिए संपर्क करें / Contact us for details
  daanText:    { hi: "", en: "" },   // default: योजनाओं के लिए दान करें / Give daan for the yojanayen
  formText:    { hi: "", en: "" }    // default: अपनी रुचि दर्ज करें / Submit your interest
};

/* ---------- 3ख. Activities menu (Nemidham Cricket Club, Trekking, ...) ----------
   Every block below becomes one item in the "Activities" menu and has its own page.
   TO ADD an activity: copy one whole { ... }, block, paste it after the last one, change id and the text.
   TO REMOVE: delete its block.   TO HIDE for now: add  hidden: true,  inside it.
   If every block is hidden or removed, the Activities menu disappears by itself.
   Everything except id and title is optional. Leave a line empty (or delete it) and that part of the page is simply not shown.
   id          short name, English small letters, no spaces.
   page        the page file of this activity, e.g. "kids-club.html" (already made for the 4 below).
               For a NEW activity, make its page file first (steps in README part 5.20), then write its name here.
   comingSoon  true shows a "Coming soon" tag. Write  comingSoon: false,  when the page is ready.
   title       name shown in the menu and at the top of the page.      short   one line under the heading.
   poster      picture of the poster, e.g. "images/activities/kids-club.jpeg" (upload it into images/activities/).
               Visitors tap it to see it full size. Make the picture small first (README part 4).
   decor       a few emoji shown big and bouncing at the top of the page, e.g. "🎈 ⚽ 🎨 📚" (separate by spaces).
   banner      one bright slogan line, {hi,en}.
   info        quick facts: { icon: "📅", label: {hi,en}, value: {hi,en} },  e.g. When / Where / Fee.
   paragraphs  plain text paragraphs.      list   bullet points.
   HIDE / REMOVE / ADD: every info line, section box, list line, paragraph and contact person can have  hidden: true,  (hides it)
               or be deleted (removes it) or copied (adds one more). Spare hidden boxes are already there: delete their  hidden: true,  to use them.
   sections    boxes with a heading, shown in this order, in neat rows: { icon: "🎮", color: "blue", title: {hi,en}, sub: {hi,en}, list: [...], paragraphs: [...], wide: true }
               color: orange, blue, purple, green, pink, gold or teal.  wide: true makes the box full width.
               The Contact box always comes last, by itself.
               Each list line can also have an icon and a time:  { icon: "🥾", time: {hi,en}, hi: "...", en: "..." }
   contacts    people to call: { name: {hi,en}, role: {hi,en}, phone: "+91 98765 43210" }.
               If there are none, a "Contact us" button to the Team page is shown instead.
   contactTitle  heading of the contact box (default "Contact").     contactNote   one line above the contact people.
   formUrl     optional Google Form link. Paste it between the quotes and a button appears. formText = its words.  */
window.ACTIVITIES = [
  {
    id: "cricket-club", page: "cricket-club.html", comingSoon: false,
    decor: "🏏 ⚾ 🏆 🧢 🥤",
    banner: { hi: "खेलेंगे साथ, बढ़ेगा अपनापन!", en: "We play together, our bond grows!" },
    title: { hi: "नेमिधाम क्रिकेट क्लब", en: "Nemidham Cricket Club" },
    short: { hi: "खेल से स्वास्थ्य, परिवार से जुड़ाव, और समाज से अपनापन।", en: "Health through sport, bonding through family, belonging through community." },
    poster: "images/activities/cricket-club.jpeg",
    info: [
      { icon: "📍", label: { hi: "कहाँ", en: "Where" }, value: { hi: "नेमिधाम टर्फ, वाघोली, पुणे", en: "Nemidham Turf, Wagholi, Pune" } },
      { icon: "🏆", label: { hi: "प्रकार", en: "Type" }, value: { hi: "टूर्नामेंट आधारित कार्यक्रम", en: "Tournament based events" } },
      { hidden: true, icon: "📅", label: { hi: "कब", en: "When" }, value: { hi: "यहाँ लिखें", en: "Write here" } },
      { hidden: true, icon: "✨", label: { hi: "नई जानकारी", en: "New info" }, value: { hi: "यहाँ लिखें", en: "Write here" } }
    ],
    paragraphs: [
      { hi: "खेलो, जुड़ो, फिट रहो और साथ रहो।", en: "Play, bond, stay fit and be together." },
      { hi: "अच्छा खेल, बेहतर समाज, मजबूत नेमिधाम!", en: "Good sport, a better society, a stronger Nemidham!" }
    ],
    sections: [
      {
        icon: "🏆", color: "orange",
        title: { hi: "टूर्नामेंट आधारित कार्यक्रम", en: "Tournament based events" },
        list: [
          { hi: "क्रिकेट मैच", en: "Cricket matches" },
          { hi: "लीग", en: "Leagues" },
          { hi: "विशेष कार्यक्रम", en: "Special events" },
          { hi: "फैमिली क्रिकेट डेज़", en: "Family cricket days" }
        ]
      },
      {
        icon: "🏏", color: "green",
        title: { hi: "हमारे कार्यक्रम", en: "Our programmes" },
        list: [
          { icon: "🏆", hi: "लीग मैचेस (टीम आधारित मैच)", en: "League matches (team based)" },
          { icon: "🏏", hi: "फ्रेंडली मैचेस (सभी उम्र के लिए)", en: "Friendly matches (for all ages)" },
          { icon: "🧒", hi: "किड्स क्रिकेट (बच्चों के लिए विशेष सत्र)", en: "Kids cricket (special sessions for children)" },
          { icon: "👨‍👩‍👧‍👦", hi: "फैमिली क्रिकेट (परिवार के साथ खेलें, जुड़ें और आनंद लें)", en: "Family cricket (play, bond and enjoy with the family)" },
          { icon: "🎮", hi: "टीम गेम्स और फन एक्टिविटीज़ (सभी के लिए मनोरंजक खेल)", en: "Team games and fun activities (entertaining games for everyone)" },
          { icon: "🥤", hi: "रिफ्रेशमेंट्स (नाश्ता, ठंडे पेय और साथ बैठकी)", en: "Refreshments (snacks, cold drinks and sitting together)" },
          { icon: "🤝", hi: "सामुदायिक मिलन (खेल के साथ मित्रता और नेटवर्किंग)", en: "Community meet (friendship and networking along with sport)" }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "blue",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 1", en: "New card 1" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "purple",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 2", en: "New card 2" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      }
    ],
    contactTitle: { hi: "क्रिकेट से जुड़ें, नेमिधाम से जुड़ें!", en: "Join cricket, join Nemidham!" },
    contactNote: { hi: "जुड़ने और जानकारी के लिए संपर्क करें:", en: "To join or for more information, please contact:" },
    contacts: [
      { name: { hi: "दीपक जैन", en: "Deepak Jain" }, phone: "9928218313" },
      { name: { hi: "स्वप्निल जैन", en: "Swapnil Jain" }, phone: "9405197463" },
      { hidden: true, name: { hi: "नाम", en: "Name" }, role: { hi: "संयोजक", en: "Coordinator" }, phone: "" }   // spare: delete "hidden: true," to use
    ],
    formUrl: ""
  },
  {
    id: "trekking", page: "trekking.html", comingSoon: false,
    decor: "⛰️ 🥾 🎶 🍲 🏏 🌿 ☀️",
    banner: { hi: "हर तीसरा रविवार नेमिधाम के नाम!", en: "Every third Sunday belongs to Nemidham!" },
    title: { hi: "नेमिधाम ट्रेकिंग क्लब", en: "Nemidham Trekking Club" },
    short: { hi: "भक्ति, प्रकृति, फिटनेस, संगीत, स्वाद, खेल और परिवार: मंदिर से पहाड़ी तक।", en: "Devotion, nature, fitness, music, food, games and family: from the mandir to the hill." },
    poster: "images/activities/trekking.jpeg",
    info: [
      { icon: "📅", label: { hi: "कब", en: "When" }, value: { hi: "हर महीने का तीसरा रविवार", en: "Third Sunday of every month" } },
      { icon: "📍", label: { hi: "कहाँ", en: "Where" }, value: { hi: "नेमिधाम से वाघोली पहाड़ी तक", en: "Nemidham to Wagholi hill" } },
      { icon: "⏰", label: { hi: "समय", en: "Time" }, value: { hi: "सुबह 6:00 से दोपहर 3:00 बजे तक", en: "6:00 AM to 3:00 PM" } },
      { hidden: true, icon: "✨", label: { hi: "नई जानकारी 1", en: "New info 1" }, value: { hi: "यहाँ लिखें", en: "Write here" } }
    ],
    paragraphs: [
      { hi: "सुबह भगवान के चरणों में शुरुआत, दिनभर प्रकृति, मित्रता और मस्ती के साथ।", en: "Start the morning at the feet of Bhagwan, and spend the day with nature, friends and fun." },
      { hi: "मंदिर से पहाड़ी तक, पहाड़ी से मैदान तक!", en: "From the mandir to the hill, from the hill to the ground!" }
    ],
    sections: [
      {
        icon: "🥾", color: "orange", wide: true,
        title: { hi: "दिन का कार्यक्रम", en: "Programme of the day" },
        list: [
          { icon: "🙏", time: { hi: "सुबह 6:00 – 6:30", en: "6:00 – 6:30 AM" }, hi: "श्रीजी का अभिषेक एवं शांतिधारा", en: "Abhishek and Shantidhara of Shriji" },
          { icon: "🪷", time: { hi: "सुबह 6:30 – 7:00", en: "6:30 – 7:00 AM" }, hi: "पूजन एवं मंगल पाठ", en: "Pujan and Mangal Path" },
          { icon: "👥", time: { hi: "सुबह 7:00 – 7:15", en: "7:00 – 7:15 AM" }, hi: "ट्रेकिंग ब्रीफिंग (रूट, सुरक्षा निर्देश)", en: "Trekking briefing (route, safety instructions)" },
          { icon: "🥾", time: { hi: "सुबह 7:15 – 8:30", en: "7:15 – 8:30 AM" }, hi: "वाघोली पहाड़ी की ओर ट्रेकिंग", en: "Trek towards Wagholi hill" },
          { icon: "🍽️", time: { hi: "सुबह 8:30 – 9:00", en: "8:30 – 9:00 AM" }, hi: "पहाड़ी पर विश्राम एवं नाश्ता", en: "Rest and breakfast on the hill" },
          { icon: "🎵", time: { hi: "सुबह 9:00 – 9:45", en: "9:00 – 9:45 AM" }, hi: "सिंगिंग और अंताक्षरी (भजन, देशभक्ति, पुराने गीत, ओपन माइक)", en: "Singing and Antakshari (bhajan, patriotic, old songs, Open Mic)" },
          { icon: "🎮", time: { hi: "सुबह 9:45 – 10:30", en: "9:45 – 10:30 AM" }, hi: "फन गेम्स और टीम एक्टिविटीज़ (ट्रेज़र हंट, नेचर बिंगो, बच्चों के गेम्स)", en: "Fun Games and Team Activities (Treasure Hunt, Nature Bingo, kids' games)" },
          { icon: "🚶", time: { hi: "सुबह 10:30 – 11:00", en: "10:30 – 11:00 AM" }, hi: "वापसी ट्रेक (नेमिधाम)", en: "Return trek to Nemidham" }
        ]
      },
      {
        icon: "🏛️", color: "pink", wide: true,
        title: { hi: "नेमिधाम वापस आने के बाद", en: "After returning to Nemidham" },
        list: [
          { icon: "🍲", time: { hi: "सुबह 11:30 – दोपहर 1:00", en: "11:30 AM – 1:00 PM" }, hi: "गक्कड़-भरता का सामूहिक कार्यक्रम (गरमा-गरम, साथ बैठकर)", en: "Group gakkad-bharta meal (hot, eaten together)" },
          { icon: "🏏", time: { hi: "दोपहर 1:00 – 3:00", en: "1:00 – 3:00 PM" }, hi: "क्रिकेट मैच (बच्चों का, युवाओं का, फैमिली टीम, मज़ेदार चैलेंज)", en: "Cricket match (kids, youth, family team, fun challenges)" },
          { icon: "🤝", time: { hi: "दोपहर 3:00", en: "3:00 PM" }, hi: "सामूहिक समापन एवं विदाई (मंगल पाठ एवं अगले महीने की घोषणा)", en: "Closing together and farewell (Mangal Path and next month's announcement)" }
        ]
      },
      {
        icon: "✨", color: "teal",
        title: { hi: "क्यों जुड़ें?", en: "Why join?" },
        list: [
          { icon: "🙏", hi: "धार्मिक ऊर्जा", en: "Spiritual energy" },
          { icon: "🌳", hi: "प्रकृति से जुड़ाव", en: "Connection with nature" },
          { icon: "❤️", hi: "फिटनेस और स्वास्थ्य", en: "Fitness and health" },
          { icon: "🎶", hi: "गीत-संगीत और आनंद", en: "Music and joy" },
          { icon: "👨‍👩‍👧‍👦", hi: "परिवार और मित्रता", en: "Family and friendship" },
          { icon: "😋", hi: "स्वादिष्ट गक्कड़-भरता", en: "Tasty gakkad-bharta" },
          { icon: "🏏", hi: "खेल और टीम स्पिरिट", en: "Sports and team spirit" }
        ]
      },
      {
        icon: "🌿", color: "green",
        title: { hi: "हमारे नियम", en: "Our rules" },
        list: [
          { icon: "🚫", hi: "प्लास्टिक नहीं", en: "No plastic" },
          { icon: "🗑️", hi: "कचरा नहीं फैलाना", en: "No litter" },
          { icon: "🌱", hi: "प्रकृति को नुकसान नहीं", en: "No damage to nature" },
          { icon: "🤝", hi: "सब साथ रहें", en: "Stay together" }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "blue",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 1", en: "New card 1" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "purple",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 2", en: "New card 2" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      }
    ],
    contactTitle: { hi: "जो आएगा, वही यादें बनाएगा!", en: "Those who come will make the memories!" },
    contactNote: { hi: "ट्रेकिंग में जुड़ने और जानकारी के लिए संपर्क करें।", en: "To join the trek or for more information, please contact us." },
    contacts: [
      { name: { hi: "निरंजन जैन", en: "Niranjan Jain" }, phone: "9834507342" },
      { hidden: true, name: { hi: "नाम", en: "Name" }, role: { hi: "संयोजक", en: "Coordinator" }, phone: "" }   // spare: delete "hidden: true," to use
    ],
    formUrl: ""
  },
  {
    id: "tirth-yatra", page: "tirth-yatra.html", comingSoon: true,
    decor: "🛕 🚌 🙏 🌄",
    title: { hi: "नेमिधाम यात्रा संघ", en: "Nemidham Yatra Sangh" },
    short: { hi: "जल्द आ रहा है।", en: "Coming soon." },
    poster: "",
    info: [
      { hidden: true, icon: "✨", label: { hi: "नई जानकारी 1", en: "New info 1" }, value: { hi: "यहाँ लिखें", en: "Write here" } },
      { hidden: true, icon: "✨", label: { hi: "नई जानकारी 2", en: "New info 2" }, value: { hi: "यहाँ लिखें", en: "Write here" } },
      { hidden: true, icon: "✨", label: { hi: "नई जानकारी 3", en: "New info 3" }, value: { hi: "यहाँ लिखें", en: "Write here" } }
    ],
    paragraphs: [],
    sections: [
      {
        hidden: true, icon: "⭐", color: "orange",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 1", en: "New card 1" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "blue",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 2", en: "New card 2" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "green",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 3", en: "New card 3" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "pink",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 4", en: "New card 4" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      }
    ],
    contacts: [
      { hidden: true, name: { hi: "नाम", en: "Name" }, role: { hi: "संयोजक", en: "Coordinator" }, phone: "" },
      { hidden: true, name: { hi: "नाम", en: "Name" }, role: { hi: "संयोजक", en: "Coordinator" }, phone: "" }
    ],
    formUrl: ""
  },
  {
    id: "kids-club", page: "kids-club.html", comingSoon: false,
    decor: "🎈 ⚽ 🎨 📚 🧸 🪁 🏆",
    banner: { hi: "हर हफ्ते धर्म-संस्कार, खेल और शिक्षा का संगम!", en: "Every week: dharma, sanskar, games and learning together!" },
    title: { hi: "नेमिधाम किड्स क्लब", en: "Nemidham Kids Club" },
    short: { hi: "बच्चों के लिए अनोखा कॉन्सेप्ट: आओ मिलें, संस्कार पाएं, सीखें और भरपूर मज़ा करें!", en: "A unique concept for children: come, meet, receive sanskar, learn and have lots of fun!" },
    poster: "images/activities/kids-club.jpeg",
    info: [
      { icon: "📅", label: { hi: "कब", en: "When" }, value: { hi: "हर शनिवार शाम", en: "Every Saturday evening" } },
      { icon: "📍", label: { hi: "कहाँ", en: "Where" }, value: { hi: "श्री नेमिनाथ जिनालय (मंदिर) में", en: "At Shri Neminath Jinalay (mandir)" } },
      { icon: "🪑", label: { hi: "सीटें", en: "Seats" }, value: { hi: "सीमित: केवल 10-12 बच्चे", en: "Limited: only 10-12 children" } },
      { icon: "👨‍👩‍👧", label: { hi: "पेरेंट्स", en: "Parents" }, value: { hi: "रोज़ ₹10 दें (बचत की आदत के लिए)", en: "Give ₹10 a day (to build the habit of saving)" } },
      { icon: "🐷", label: { hi: "बच्चे", en: "Children" }, value: { hi: "हर हफ्ते ₹50 जमा करें (किटी जैसी सेविंग)", en: "Deposit ₹50 every week (kitty-style savings)" } },
      { hidden: true, icon: "✨", label: { hi: "नई जानकारी 1", en: "New info 1" }, value: { hi: "यहाँ लिखें", en: "Write here" } }
    ],
    paragraphs: [
      { hi: "यह आयोजन श्री नेमिनाथ जिनालय (मंदिर) में हर शनिवार शाम होगा।", en: "This gathering is held at Shri Neminath Jinalay (mandir) every Saturday evening." },
      { hi: "बच्चे धर्म-संस्कार सीखेंगे, एक घंटे के मज़ेदार खेल खेलेंगे और जीवन के काम की बातें सीखेंगे। और हाँ, खेल के बाद ताज़ा दूध या जूस भी मिलेगा!", en: "Children will learn dharma-sanskar, play an hour of fun games and learn useful things for life. And yes, there is fresh milk or juice after the games!" }
    ],
    sections: [
      {
        icon: "🪔", color: "orange",
        title: { hi: "धर्म शिक्षा व संस्कार", en: "Dharma education and sanskar" },
        sub: { hi: "धर्म से जुड़ें, जीवन संवरें", en: "Connect with dharma, make life better" },
        list: [
          { hi: "जैन धर्म की सरल शिक्षा", en: "Simple teaching of Jain dharma" },
          { hi: "आदर्श जीवन की प्रेरणा", en: "Inspiration for an ideal life" },
          { hi: "सदाचार और अच्छे व्यवहार", en: "Good conduct and good behaviour" },
          { hi: "मंदिर दर्शन व आरती", en: "Mandir darshan and aarti" }
        ]
      },
      {
        icon: "🎮", color: "blue",
        title: { hi: "1 घंटे के फन गेम्स", en: "1 hour of fun games" },
        sub: { hi: "खेलो, सीखो, बढ़ो", en: "Play, learn, grow" },
        list: [
          { hi: "टीम गेम्स", en: "Team games" },
          { hi: "इंटेलिजेंस एक्टिविटीज़", en: "Intelligence activities" },
          { hi: "मस्ती भरे खेल", en: "Fun games" },
          { hi: "क्रिएटिविटी एक्टिविटीज़", en: "Creativity activities" },
          { hi: "सहयोग व नेतृत्व क्षमता", en: "Cooperation and leadership" }
        ]
      },
      {
        icon: "📖", color: "purple",
        title: { hi: "शिक्षा", en: "Learning" },
        sub: { hi: "ज्ञान ही सच्ची शक्ति", en: "Knowledge is true strength" },
        list: [
          { hi: "जीवन कौशल (लाइफ स्किल्स)", en: "Life skills" },
          { hi: "समय प्रबंधन", en: "Time management" },
          { hi: "संस्कारात्मक सोच", en: "Value-based thinking" },
          { hi: "आत्मविश्वास", en: "Self-confidence" },
          { hi: "सकारात्मक व्यक्तित्व विकास", en: "Positive personality development" }
        ]
      },
      {
        icon: "🎁", color: "pink",
        title: { hi: "हर हफ्ते की ख़ास बातें", en: "Every week" },
        list: [
          { icon: "🏠", hi: "हर हफ्ते नया प्रायोजक (पेरेंट होस्ट)", en: "A new sponsor every week (parent host)" },
          { icon: "🥛", hi: "मस्ती के बाद ताज़ा दूध/जूस (हेल्दी ड्रिंक)", en: "Fresh milk or juice after the fun (healthy drink)" },
          { icon: "🏆", hi: "खेलों में जीतें आकर्षक गिफ्ट्स (हर हफ्ते)", en: "Win attractive gifts in the games (every week)" }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "teal",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 1", en: "New card 1" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      },
      {
        hidden: true, icon: "⭐", color: "green",   // spare card: delete the "hidden: true," part to show it
        title: { hi: "नया कार्ड 2", en: "New card 2" },
        list: [
          { hi: "यहाँ पहला बिंदु लिखें।", en: "Write the first point here." },
          { hi: "यहाँ दूसरा बिंदु लिखें।", en: "Write the second point here." }
        ]
      }
    ],
    contactTitle: { hi: "जुड़ें हमारे साथ!", en: "Join us!" },
    contactNote: { hi: "सीमित सीटें (केवल 10-12 बच्चे)। नाम दर्ज कराने व जानकारी हेतु संपर्क करें:", en: "Limited seats (only 10-12 children). To register your child or for information, please contact:" },
    contacts: [
      { name: { hi: "अभिषेक जैन", en: "Abhishek Jain" }, phone: "8308803431" },
      { hidden: true, name: { hi: "नाम", en: "Name" }, role: { hi: "संयोजक", en: "Coordinator" }, phone: "" }   // spare: delete "hidden: true," to use
    ],
    formUrl: ""
  }
];

/* ---------- 4. Announcements ---------- */
// Every announcement shows on the Announcements page. Only pinned ones also show on Home.
// pinned: true shows it on Home and keeps it at the top.
// hidden: true hides an item without deleting it.
window.ANNOUNCEMENTS = [
  {
    date: "2026-10-26", pinned: true,
    title: { hi: "हमारी नई वेबसाइट में आपका स्वागत है", en: "Welcome to our new website" },
    text: {
      hi: "जय जिनेन्द्र। कार्यक्रम, तस्वीरें, योजनाएं और दान की जानकारी अब एक ही जगह है।",
      en: "Jai Jinendra. Karyakram, photos, yojanayen and daan details are now in one place."
    }
  },
  {
    date: "2026-10-20", pinned: false,
    title: { hi: "त्योहार के दिनों में दर्शन का समय", en: "Darshan timings on festival days" },
    text: {
      hi: "विशेष दिनों में समय बदल सकता है। जानकारी कुछ दिन पहले यहाँ दी जाएगी।",
      en: "On special days the timings may change. We will post the details here a few days before."
    }
  }
];

/* ---------- 5. Karyakram (events) ---------- */
// date: "YYYY-MM-DD". endDate is optional (for events of many days).
// time can be plain text like "8:00 AM", or { hi: "सुबह 8:00", en: "8:00 AM" }.
// Past events move to the "Past" tab by themselves.
// pinned: true  shows an UPCOMING karyakram on the Home page too (the next 3 pinned ones). Karyakram without
//   pinned: true  show only on the Karyakram page. If none is pinned, the karyakram section is left out of Home.
// To remove a karyakram: delete its whole { ... }, block, or add  hidden: true,  inside it.
window.EVENTS = [
  {
    pinned: true,
    date: "2026-11-09", time: { hi: "सुबह 7:00", en: "7:00 AM" },
    place: { hi: "मंदिर जी", en: "Mandir ji" },
    type: { hi: "उत्सव", en: "Utsav" },
    title: { hi: "लाडू कार्यक्रम: भगवान महावीर स्वामी का मोक्ष कल्याणक", en: "Laddu Karyakram: Moksha Kalyanak of Bhagwan Mahavir Swami" },
    text: {
      hi: "भगवान महावीर स्वामी के मोक्ष कल्याणक के अवसर पर मंदिर जी में लाडू कार्यक्रम होगा। सभी श्रद्धालु आमंत्रित हैं।",
      en: "A Laddu Karyakram will be held at the mandir on the occasion of the Moksha Kalyanak of Bhagwan Mahavir Swami. All devotees are welcome."
    }
  },

  // TEMPLATE for the next karyakram. It is hidden. To use it: remove the line  hidden: true,
  // and change the text. To add one more, copy the whole { ... }, block.
  // pinned: true  (add this line) puts it on the Home page too.
  // To take a karyakram off the website later: delete its { ... }, block, or add  hidden: true,
  {
    hidden: true,
    date: "2026-12-01", time: { hi: "सुबह 8:00", en: "8:00 AM" },
    place: { hi: "मंदिर जी", en: "Mandir ji" },
    type: { hi: "पूजा", en: "Pooja" },
    title: { hi: "SAMPLE: कार्यक्रम का नाम", en: "SAMPLE: Name of the karyakram" },
    text: { hi: "SAMPLE: कार्यक्रम की जानकारी यहाँ लिखें।", en: "SAMPLE: Write the details of the karyakram here." }
  }
];

/* ---------- 6. Jain Calendar ---------- */
// type: "kalyanak", "parv", "tithi" or "other".
// Please copy these dates from a calendar / panchang you trust.
// hidden: true hides an item without deleting it.
window.CALENDAR = [
  {
    date: "2026-11-08", type: "parv",
    title: { hi: "SAMPLE: पर्व का नाम", en: "SAMPLE: Name of the parv" },
    note: { hi: "SAMPLE: तिथि और मंदिर में क्या होगा, यहाँ लिखें।", en: "SAMPLE: Write the tithi and what happens at the mandir." }
  },
  {
    date: "2026-11-20", type: "kalyanak",
    title: { hi: "SAMPLE: कल्याणक का नाम", en: "SAMPLE: Name of the kalyanak" },
    note: { hi: "", en: "" }
  },
  {
    date: "2026-10-01", type: "tithi",
    title: { hi: "SAMPLE: बीती हुई तिथि", en: "SAMPLE: A past tithi" },
    note: { hi: "", en: "" }
  }
];

/* ---------- 7. Gallery ---------- */
// The Gallery has two main albums: photos and videos. Inside each, you make albums by occasion.
//
// TO MAKE A NEW PHOTO ALBUM (3 steps)
//  1. On GitHub, upload your photos into a new folder, e.g. images/gallery/diwali-2026/
//  2. Copy one whole { ... }, block below, paste it right after, and change id, date, title, folder.
//  3. Choose how photos are listed:
//       files: [ "1.jpg", "2.jpg" ]   write the photo names yourself (always works), or
//       delete the files line         then the site reads the folder by itself, you only upload photos.
//     The page gallery-helper.html writes the block for you.
//  hidden: true  hides an album without deleting it.
//  cover: "images/gallery/diwali-2026/1.jpg"  is the picture shown on the album card (optional).
//
// TO ADD VIDEOS to a video album, list them in items:
//   { youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: { hi: "", en: "" } }  a YouTube video or playlist link.
//   It plays inside the website, nobody has to go to YouTube.
//   { file: "video1.mp4", title: {...} }  a small video file uploaded into the album's folder (about 25 MB at most).
window.GALLERY = {
  photos: [
    {
      id: "bhumipujan", date: "2026-04-13",
      title: { hi: "भूमि पूजन", en: "Bhumi Pujan" },
      description: { hi: "", en: "" },
      folder: "images/gallery/Bhumi Pujan",
    },
     {
      id: "vedi-pratishtha", date: "2026-05-09",
      title: { hi: "वेदी प्रतिष्ठा एवं विश्व शांति महायज्ञ", en: "Vedi Pratishtha & Vishv Shanti Mahayagya" },
      description: { hi: "", en: "" },
      folder: "images/gallery/vedi-pratishtha",
    },
     {
      id: "kshamavani-2026", date: "2026-09-26",
      title: { hi: "क्षमावाणी 2026", en: "Kshamavani 2026" },
      description: { hi: "", en: "" },
      folder: "images/gallery/Kshamavani-2026",
    },
    {
      hidden: true,
      id: "sample-utsav", date: "2026-09-10",
      title: { hi: "SAMPLE: वार्षिक उत्सव", en: "SAMPLE: Annual Utsav" },
      description: { hi: "", en: "" },
      folder: "images/gallery",
      files: [
        { file: "sample-5.svg", caption: { hi: "नमूना फोटो 5", en: "Sample photo 5" } },
        { file: "sample-6.svg", caption: { hi: "नमूना फोटो 6", en: "Sample photo 6" } }
      ]
    }
  ],
  videos: [
    {
      id: "mandir-videos", date: "2026-10-28",
      title: { hi: "मंदिर के वीडियो", en: "Mandir videos" },
      description: { hi: "", en: "" },
      items: [
        { youtube: "https://www.youtube.com/watch?v=w6oB8_KqmOY", title: { hi: "भूमि पूजन", en: "Bhumi Pujan" } },
        { youtube: "https://www.youtube.com/watch?v=1k3XrL_6LpA", title: { hi: "मुनि श्री अजीत सागर महाराज जी की मंगल देशना", en: "Muni Shri Ajit Sagar Maharaj Ji's Mangal Deshna" } },
        { youtube: "https://www.youtube.com/watch?v=DbivpjTuzjM", title: { hi: "नेमिधाम वाघोली क्षमावाणी", en: "Nemidham Wagholi Kchamawani" } },
        { youtube: "https://www.youtube.com/watch?v=5VB2MmrS7Ts", title: { hi: "शांतिधारा", en: "Shantidhara" } }
      ]
    },
    {
      hidden: true,
      id: "sample-videos", date: "2026-10-01",
      title: { hi: "SAMPLE: आरती के वीडियो", en: "SAMPLE: Aarti videos" },
      description: { hi: "यहाँ YouTube वीडियो का लिंक डालें।", en: "Paste your YouTube video links here." },
      items: [
        // { youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX", title: { hi: "शाम की आरती", en: "Evening Aarti" } }
      ]
    }
  ]
};

/* ---------- 8. Team ---------- */
// HOW TO CHANGE THE TEAM (all on GitHub, in this file):
//  - Add a person: copy one line  { name: "...", role: {...}, phone: "", photo: "" },  inside "members", paste it, edit it.
//      name   the person's name (plain text, or { hi: "...", en: "..." })
//      role   the responsibility, in Hindi and English
//      phone  mobile number, e.g. "+91 98765 43210". Shown under the name, tap to call. "" hides it.
//      photo  optional, e.g. "images/team/name.jpg". Without it, the initials show.
//  - Remove a person: delete that whole line.
//  - Add a new group (like "Sevaks"): copy a whole  { group: {...}, members: [ ... ] },  block and edit it.
//  - Hide a group for now: add  hidden: true,  inside its block (as Trustees below).
window.TEAM = [
  {
    // Trustees are hidden for now (everyone is on the working committee at the moment).
    // When trustees are appointed, delete the line "hidden: true," and fill in the names.
    hidden: true,
    group: { hi: "ट्रस्टी", en: "Trustees" },
    members: [
      { name: "SAMPLE Name One", role: { hi: "अध्यक्ष", en: "President" }, phone: "", photo: "" },
      { name: "SAMPLE Name Two", role: { hi: "सचिव", en: "Secretary" }, phone: "", photo: "" },
      { name: "SAMPLE Name Three", role: { hi: "कोषाध्यक्ष", en: "Treasurer" }, phone: "", photo: "" }
    ]
  },
  {
    group: { hi: "कार्यकारिणी", en: "Working committee" },
    members: [
      { name: "SAMPLE Name Four", role: { hi: "कार्यक्रम संयोजक", en: "Karyakram coordinator" }, phone: "", photo: "" },
      { name: "SAMPLE Name Five", role: { hi: "स्वयंसेवक संयोजक", en: "Volunteer coordinator" }, phone: "", photo: "" }
    ]
  },
  {
    group: { hi: "पुजारी", en: "Pujari" },
    members: [
      { name: "SAMPLE Name Six", role: { hi: "पुजारी", en: "Pujari" }, phone: "", photo: "" }
    ]
  }
];

/* ---------- 9. About page ---------- */
// Each section has an id (no spaces), a title, and paragraphs.
// Add  list: [ {hi:"",en:""}, ... ]  to show bullet points after the paragraphs.
window.ABOUT = [
  {
    id: "mandir",
    title: { hi: "मंदिर के बारे में", en: "About the mandir" },
    paragraphs: [
      {
        hi: "श्री 1008 नेमिनाथ दिगंबर जैन मंदिर, नेमिधाम भगवान नेमिनाथ को समर्पित जैन मंदिर है।",
        en: "Shri 1008 Neminath Digambar Jain Mandir, Nemidham is a Jain mandir dedicated to Bhagwan Neminath."
      },
      {
        hi: "पुणे की पावन धरा पर बसे जैन परिवारों के मन में एक ही संकल्प था— अपना जमीन से घर हो जहां अपने निवास के समीप एक जिनालय हो, जहाँ भक्ति की धारा अविरल बहती रहे। इसी पवित्र विचार ने जैन श्रावक संघ के अंतर्गत एक स्वरूप लिया। मंदिर निर्माण का यह स्वप्न मात्र एक विचार से शुरू होकर, श्रद्धा और समर्पण की एक अद्भुत यात्रा बन गया।",
        en: "The Jain families living on the holy land of Pune shared one wish: a Jinalaya close to their homes, where the stream of devotion keeps flowing. This pure thought took shape under the Jain Shravak Sangh. The dream of building the mandir began as a single idea and became a wonderful journey of faith and dedication."
      },
      {
        hi: "इस भव्य मंदिर की नींव और निर्माण की यात्रा 1 जुलाई 2024 को प्रारंभ हुई थी। श्रावकों के अटूट सहयोग और गुरुओं के मार्गदर्शन से, लगभग दो वर्षों के प्रयास के बाद 13 अप्रैल 2026 को भूमि पूजन हुआ और 9 मई 2026 को वेदी प्रतिष्ठा संपन्न हुई।",
        en: "The journey of laying the foundation and building this grand mandir began on 1 July 2024. With the unfailing support of the shravaks and the guidance of the gurus, after about two years of effort, the Bhumi Pujan was held on 13 April 2026 and the Vedi Pratishtha was completed on 9 May 2026."
      },
      {
        hi: "मूलनायक भगवान की घोषणा मुनि श्री वीर सागर जी, और वेदी प्रतिष्ठा मुनि श्री अजित सागर जी महाराज के मंगल सानिध्य में संपन्न हुई।",
        en: "The Mulnayak Bhagwan was announced by Muni Shri Veer Sagar Ji, and the Vedi Pratishtha was completed in the auspicious presence of Muni Shri Ajit Sagar Ji Maharaj."
      },
      {
        hi: "मंदिर बना हुआ है और अभी धार्मिक कार्य के लिए 3 साल के लिए दान की गई भूमि पर है। मंदिर की अपनी भूमि के लिए भूमि दान लिया जा रहा है और विकास जारी है।",
        en: "The mandir is built and, for now, stands on land given for religious use for 3 years. Bhumi daan is being accepted for the mandir's own land, and development is going on."
      }
    ],
    list: [
      { hi: "मंगल सान्निध्य: मुनि श्री 108 अजित सागर जी, मुनि श्री 108 नीराग सागर जी, और ऐलक श्री 105 विवेकानंद सागर जी महाराज", en: "Mangal Sannidhya: Muni Shri 108 Ajit Sagar Ji, Muni Shri 108 Neerag Sagar Ji and Aelak Shri 105 Vivekanand Sagar Ji Maharaj" },
      { hi: "प्रतिष्ठाचार्य: भाई प्रदीप भैया 'सुयश'", en: "Pratishthacharya: Bhai Pradeep Bhaiya 'Suyash'" },
      { hi: "सूर्यमंत्र प्रदाता: निर्यापक मुनिपुंगव श्री 108 सुधासागर जी महाराज", en: "Surya Mantra Pradata: Niryapak Munipungav Shri 108 Sudhasagar Ji Maharaj" },
      { hi: "मंगल आशीर्वाद: निर्यापक मुनि श्री 108 वीर सागर जी महाराज", en: "Mangal Ashirvad: Niryapak Muni Shri 108 Veer Sagar Ji Maharaj" }
    ]
  },
  {
    id: "bhagwan",
    title: { hi: "भगवान नेमिनाथ", en: "Bhagwan Neminath" },
    paragraphs: [
      {
        hi: "भगवान नेमिनाथ जैन परंपरा में वर्तमान काल के 22वें तीर्थंकर माने जाते हैं। उनका चिह्न शंख है।",
        en: "Bhagwan Neminath is the 22nd Tirthankar of the present age in Jain tradition. His emblem is the conch (shankh)."
      },
      {
        hi: "उनकी करुणा के लिए उन्हें याद किया जाता है। परंपरा के अनुसार, विवाह के भोज के लिए इकट्ठे पशुओं को देखकर उन्होंने संसार त्याग दिया और दीक्षा ली। जैन परंपरा मानती है कि उन्होंने गिरनार में मोक्ष प्राप्त किया।",
        en: "He is remembered for his deep compassion. According to tradition, when he saw the animals gathered for his wedding feast, he turned away from worldly life and took diksha. Jain tradition holds that he attained moksha at Girnar."
      }
    ]
  },
  {
    id: "vision",
    title: { hi: "हमारी दृष्टि (Vision)", en: "Our vision" },
    paragraphs: [
      {
        hi: "जैन श्रावक संघ द्वारा संचालित यह मंदिर आगामी पीढ़ियों के लिए संस्कार, संस्कृति और धर्म का केंद्र बनेगा। हमारा उद्देश्य यहाँ आने वाले हर श्रद्धालु को शांति, ध्यान और भगवान के दर्शन से आत्मिक संतोष प्रदान करना है।",
        en: "Run by the Jain Shravak Sangh, this mandir will become a centre of values, culture and dharma for the coming generations. Our aim is to give every devotee who comes here peace, meditation and spiritual contentment through the darshan of Bhagwan."
      }
    ]
  }
];

/* ---------- 10. How to reach ---------- */
// Add or remove blocks. "title" and "text" can be edited freely.
// hidden: true  hides a block without deleting it (the Parking block below is hidden for now).
window.HOWTO = [
  {
    title: { hi: "सड़क से", en: "By road" },
    text: {
      hi: "खराडी, पुणे से नगर रोड पर वाघोली की ओर आएं और बकोरी रोड पर मंदिर पहुँचें। खराडी से दूरी लगभग 10 किमी है।",
      en: "From Kharadi, Pune, take Nagar Road towards Wagholi, then Bakori Road to reach the mandir. It is about 10 km from Kharadi."
    }
  },
  {
    title: { hi: "रेल से", en: "By rail" },
    text: {
      hi: "सबसे नज़दीकी स्टेशन पुणे रेलवे स्टेशन है, जो लगभग 18 किमी दूर है। हडपसर रेलवे स्टेशन लगभग 14 किमी दूर है।",
      en: "The nearest station is Pune Railway Station, about 18 km away. Hadapsar Railway Station is about 14 km away."
    }
  },
  {
    title: { hi: "हवाई जहाज़ से", en: "By air" },
    text: {
      hi: "सबसे नज़दीकी हवाई अड्डा पुणे अंतरराष्ट्रीय हवाई अड्डा, विमान नगर है, जो लगभग 14 किमी दूर है।",
      en: "The nearest airport is Pune International Airport, Viman Nagar, about 14 km away."
    }
  },
  {
    hidden: true,
    title: { hi: "पार्किंग और सुविधाएं", en: "Parking and facilities" },
    text: { hi: "SAMPLE: पार्किंग, पीने का पानी आदि की जानकारी लिखें।", en: "SAMPLE: Write about parking, drinking water and other facilities." }
  }
];

/* ---------- 9क. Dainik karyakram (roz ka karyakram) — "Dainik Karyakram" page ----------
   Roz mandir mein jo hota hai, uski list. Samay badalna ho to sirf time likho ("HH:MM", 24 ghante).
   at: "open" / "abhishek" / "aarti" / "close"  likhne par samay apne aap section 1 (SITE.timings) se aata hai,
       isliye wahan badlo to yahan bhi badal jaata hai. Apna alag samay chahiye to  at  ki jagah  time: "08:30"  likho.
   title / text   naam aur chhoti jaankari (text khali chhod sakte ho).
   icon           ek emoji (chahe to).
   hidden: true   kisi line ko bina delete kiye chhupane ke liye.
   NOTE: Shantidhara aur Pooja ke samay SAMPLE hain. Asli samay likho.
   Vishesh dinon ke karyakram (tyohar, kalyanak...) section 5 (EVENTS) mein likhe jaate hain, wo us tareekh par
   apne aap is page par dikhte hain. */
window.DAILY = [
  { at: "open", icon: "🛕", title: { hi: "मंदिर जी के पट खुलना", en: "Mandir opens" }, text: { hi: "दर्शन शुरू।", en: "Darshan begins." } },
  { at: "abhishek", icon: "🪔", title: { hi: "महामस्तकाभिषेक", en: "Mahamastakabhishek" }, text: { hi: "भगवान का अभिषेक।", en: "Abhishek of Bhagwan." } },
  { time: "08:30", icon: "💧", title: { hi: "शांतिधारा", en: "Shantidhara" }, text: { hi: "SAMPLE समय: असली समय लिखें।", en: "SAMPLE time: write the real time." } },
  { time: "09:30", icon: "🌸", title: { hi: "पूजा", en: "Pooja" }, text: { hi: "SAMPLE समय: असली समय लिखें।", en: "SAMPLE time: write the real time." } },
  { at: "aarti", icon: "🪔", title: { hi: "आरती", en: "Aarti" }, text: { hi: "सायं आरती।", en: "Evening aarti." } },
  { at: "close", icon: "🌙", title: { hi: "मंदिर जी के पट बंद होना", en: "Mandir closes" }, text: { hi: "", en: "" } }
];

/* ---------- 9ख. Timeline (About us > Timeline page) ----------
   Mandir ke safar ki ghatnayein. HAR ENTRY EK ALAG CARD hoti hai; cards baari-baari se baayein / daayein dikhte hain
   (SAME saal ki do entries bhi alag-alag side par aati hain).

   NAYI ENTRY JODNE KE LIYE: neeche ki koi ek poori  { ... },  line copy karo, list mein kahin bhi paste karo, text badlo.
   ENTRY HATANE KE LIYE: wo poori { ... },  line delete kar do.   CHHUPANE KE LIYE (delete kiye bina): usme  hidden: true,  likh do.
   Entries file ke order mein dikhti hain, isliye purani se nayi ki taraf (upar se neeche) likho.

   year     saal ("2024") - card par bada dikhta hai.
   when     (chahe to) mahina / tareekh, jaise { hi: "अगस्त", en: "August" }. Nahi chahiye to line hata do ya "" likho.
   title    heading {hi,en}.        text   vivaran {hi,en} (khali chhod sakte ho).

   PHOTO:  1) photo ko  images/timeline/  folder mein daalo (folder na ho to bana lo), chhota rakho (width ~1000px, WEBP ya JPG, 300 KB tak).
           2) entry mein likho:   photo: "images/timeline/bhumi-daan.jpg"                       (ek photo)
                          ya:     photos: ["images/timeline/a.jpg", "images/timeline/b.jpg"]   (kai photo; click par bada khulta hai)
           Photo CHHUPANE ke liye (file wahin rahe):  hidePhoto: true,
           Photo HATANE ke liye:  photo: "" ya photos: [] kar do (ya wo line delete kar do).
   NOTE: entries mandir ke asli safar ki hain; nayi ghatna upar bataye tareeke se jodo. */
window.TIMELINE = [
  { year: "2024", when: { hi: "1 जुलाई", en: "1 July" }, title: { hi: "नींव और निर्माण की शुरुआत", en: "Foundation and construction begin" }, text: { hi: "मंदिर निर्माण की यात्रा शुरू हुई।", en: "The journey of building the mandir began." }, photo: "" },
  { year: "2026", when: { hi: "13 अप्रैल", en: "13 April" }, title: { hi: "भूमि पूजन", en: "Bhumi Pujan" }, text: { hi: "श्रावकों के साथ भूमि पूजन संपन्न हुआ।", en: "Bhumi Pujan was held with the shravaks." }, photo: "images/timeline/bhumi-pujan.webp" },
  { year: "2026", when: { hi: "9 मई", en: "9 May" }, title: { hi: "वेदी प्रतिष्ठा एवं विश्व शांति महायज्ञ", en: "Vedi Pratishtha & Vishv Shanti Mahayagya" }, text: { hi: "भव्य वेदी प्रतिष्ठा संपन्न हुई।", en: "The grand Vedi Pratishtha was completed." }, photo: "images/timeline/vedi-pratishtha.webp" },
  { year: "2026", when: { hi: "20 जुलाई", en: "20 July" }, title: { hi: "भगवान नेमिनाथ का मोक्ष कल्याणक", en: "Moksha Kalyanak of Bhagwan Neminath" }, text: { hi: "मंदिर जी में पहली बार निर्वाण लड्डू चढ़ाया गया।", en: "The Nirvan Laddu was offered in the mandir for the first time." }, photo: "images/timeline/moksh-kalyanak-ladoo.webp" },
  { year: "2026", when: { hi: "16 सितंबर", en: "16 September" }, title: { hi: "पहला दसलक्षण पर्व", en: "First Dashlakshan Parv" }, text: { hi: "मंदिर जी में पहली बार दसलक्षण पर्व मनाया गया।", en: "Dashlakshan Parv was celebrated in the mandir for the first time." }, photo: "images/timeline/dashlakshan.webp" },
  { year: "2026", when: { hi: "26 सितंबर", en: "26 September" }, title: { hi: "पहली क्षमावाणी", en: "First Kshamavani" }, text: { hi: "मंदिर जी में पहली बार क्षमावाणी मनाई गई।", en: "Kshamavani was celebrated in the mandir for the first time." }, photo: "images/timeline/kshamavani.webp" }
];

/* ---------- 9ख-2. Nearby (Visit > Nearby page): mandirs, tirths, tourist places ... ----------
   Page par har GROUP ek alag button (tab) hota hai. Button dabane par sirf usi group ke cards dikhte hain.
   Neeche 3 group hain: mandirs, tirths, tourist.  Naya group (jaise "Restaurants") chahiye to ek poora group { ... }, copy karo.
   Group:  id (angrezi, chhota, space nahi), icon (ek emoji), title {hi,en} (button ka naam, chhota rakho), intro {hi,en} (upar ki line, khali chhod sakte ho),
           hidden: true,  poora group (button) chhupane ke liye,   items: [ cards ]
   Card:   name {hi,en}, distance {hi,en} (jaise "5 km"), address {hi,en}, text {hi,en} (chhota vivaran),
           phone: "9876543210"  (kai number: "98..., 97..."),
           mapLink: "https://maps.app.goo.gl/..."  ya  mapQuery: "naam, shehar"   ("Nakshe mein dekhein" button),
           photo: "images/nearby/naam.jpg"  ya  photos: ["images/nearby/a.jpg", "images/nearby/b.jpg"]
           hidePhoto: true,   PHOTO CHHUPI HUI HAI. Photo dikhani ho to ye  hidePhoto: true,  wali line MITA do.
           hidden: true,   poora card chhupane ke liye.
   NAYA CARD: koi ek poora card { ... }, copy karke usi group ki items list mein paste karo. HATANE ke liye poori { ... }, delete karo.
   Har group mein 3 khali card (hidden: true) taiyaar hain: "hidden: true," mita do to dikhne lagenge.
   NOTE: sab entries SAMPLE hain. Asli naam, pata, number likho. */
window.NEARBY = [
  {
    id: "mandirs", icon: "🛕", title: { hi: "आस-पास के मंदिर", en: "Nearby Mandirs" }, intro: { hi: "", en: "" },
    items: [
      { name: { hi: "SAMPLE: पास का जैन मंदिर", en: "SAMPLE: Nearby Jain Mandir" }, distance: { hi: "SAMPLE: 3 किमी", en: "SAMPLE: 3 km" }, address: { hi: "SAMPLE: यहाँ मंदिर का पता लिखें", en: "SAMPLE: Write the mandir address here" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { name: { hi: "SAMPLE: दूसरा जैन मंदिर", en: "SAMPLE: Another Jain Mandir" }, distance: { hi: "SAMPLE: 8 किमी", en: "SAMPLE: 8 km" }, address: { hi: "SAMPLE: यहाँ मंदिर का पता लिखें", en: "SAMPLE: Write the mandir address here" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नया मंदिर", en: "New mandir" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नया मंदिर", en: "New mandir" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नया मंदिर", en: "New mandir" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true }
    ]
  },
  {
    id: "tirths", icon: "🙏", title: { hi: "आस-पास के तीर्थ क्षेत्र", en: "Nearby Tirth Kshetras" }, intro: { hi: "", en: "" },
    items: [
      { name: { hi: "SAMPLE: पास का तीर्थ क्षेत्र", en: "SAMPLE: Nearby Tirth Kshetra" }, distance: { hi: "SAMPLE: 40 किमी", en: "SAMPLE: 40 km" }, address: { hi: "SAMPLE: यहाँ तीर्थ का पता लिखें", en: "SAMPLE: Write the tirth address here" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नया तीर्थ क्षेत्र", en: "New tirth kshetra" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नया तीर्थ क्षेत्र", en: "New tirth kshetra" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नया तीर्थ क्षेत्र", en: "New tirth kshetra" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true }
    ]
  },
  {
    id: "tourist", icon: "🏞️", title: { hi: "घूमने की जगहें", en: "Tourist Places" }, intro: { hi: "", en: "" },
    items: [
      { name: { hi: "SAMPLE: घूमने की जगह", en: "SAMPLE: Tourist place" }, distance: { hi: "SAMPLE: 15 किमी", en: "SAMPLE: 15 km" }, address: { hi: "SAMPLE: यहाँ पता लिखें", en: "SAMPLE: Write the address here" }, text: { hi: "SAMPLE: जगह के बारे में एक-दो लाइन।", en: "SAMPLE: One or two lines about the place." }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नई जगह", en: "New place" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नई जगह", en: "New place" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true },
      { hidden: true, name: { hi: "नई जगह", en: "New place" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true }
    ]
  },
  {
    hidden: true, id: "extra", icon: "⭐", title: { hi: "और जगहें", en: "More places" }, intro: { hi: "", en: "" },   // spare group: "hidden: true," mita do to ye button dikhega
    items: [
      { name: { hi: "नई जगह", en: "New place" }, distance: { hi: "", en: "" }, address: { hi: "", en: "" }, text: { hi: "", en: "" }, phone: "", mapLink: "", photos: [], hidePhoto: true }
    ]
  }
];

/* ---------- 9ग. Mandir niyam (Visit page > Mandir niyam / Mandir rules) ----------
   intro: upar ki ek line.  list: har niyam ek { hi, en } line; naya niyam jodne ke liye ek line copy karo, hatane ke liye line delete karo. */
window.MANDIR_NIYAM = {
  intro: { hi: "आपका दर्शन के लिए स्वागत है। नीचे कुछ सामान्य नियम हैं।", en: "We welcome you for darshan. These are the usual courtesies." },
  list: [
    { hi: "साफ़ और सादे कपड़े पहनकर आएं।", en: "Wear clean, modest clothes." },
    { hi: "मंदिर में प्रवेश से पहले जूते-चप्पल बाहर उतारें।", en: "Remove footwear before entering." },
    { hi: "चमड़े की वस्तुएं मंदिर में न लाएं।", en: "Avoid leather items inside the mandir." },
    { hi: "मोबाइल साइलेंट रखें।", en: "Keep your phone on silent." },
    { hi: "फोटो लेने से पहले अनुमति लें।", en: "Please ask before taking photographs." }
  ]
};

/* ---------- 10क. Suvidhayen (facilities of the mandir) ----------
   Shown on its own page (menu: Mandir > Suvidhayen). One card per facility.
   TO ADD: copy one whole { ... }, block, paste it after the last one, change the text.  TO REMOVE: delete it.
   TO HIDE: add  hidden: true,  inside it.  Three spare hidden cards are at the end: delete their "hidden: true," to use them.
   pinned: true   also shows a small card for it on the Home page (next to "Give daan" and "Visit the mandir"). Keep it to one or two.
   icon (one emoji), color (orange, blue, purple, green, pink, gold, teal), title, short (one line, used on the Home card),
   paragraphs, info: [ { icon, label: {hi,en}, value: {hi,en} } ], list: [ {hi,en} ],
   contactNote (one line above the people), contacts: [ { name: {hi,en}, role: {hi,en}, phone: "..." } ].
   Every info line, list line and contact can also have  hidden: true. */
window.SUVIDHA = [
  {
    id: "bhojanshala", pinned: true, icon: "🍽️", color: "orange",
    title: { hi: "भोजनशाला", en: "Bhojanshala" },
    short: { hi: "मंदिर में शुद्ध भोजन की व्यवस्था है। कूपन राशि ₹100 है।", en: "Pure, shuddh bhojan is available at the mandir. Coupon: ₹100." },
    paragraphs: [
      { hi: "मंदिर में शुद्ध भोजन की व्यवस्था है।", en: "Shuddh (pure) bhojan is arranged at the mandir." }
    ],
    info: [
      { icon: "🎟️", label: { hi: "कूपन राशि", en: "Coupon amount" }, value: { hi: "₹100", en: "₹100" } }
    ],
    list: [],
    contactNote: { hi: "भोजन के लिए पुजारी भैया नीरज जैन से संपर्क करें।", en: "For bhojan, please contact Pujari Neeraj Jain." },
    contacts: [
      { name: { hi: "नीरज जैन", en: "Neeraj Jain" }, role: { hi: "पुजारी", en: "Pujari" }, phone: "8770979624" }
    ]
  },
  {
    hidden: true, icon: "⭐", color: "blue",   // spare card: delete the "hidden: true," part to show it
    title: { hi: "नई सुविधा 1", en: "New facility 1" },
    paragraphs: [ { hi: "यहाँ सुविधा की जानकारी लिखें।", en: "Write the details of this facility here." } ],
    info: [],
    list: [],
    contacts: []
  },
  {
    hidden: true, icon: "⭐", color: "green",   // spare card: delete the "hidden: true," part to show it
    title: { hi: "नई सुविधा 2", en: "New facility 2" },
    paragraphs: [ { hi: "यहाँ सुविधा की जानकारी लिखें।", en: "Write the details of this facility here." } ],
    info: [],
    list: [],
    contacts: []
  },
  {
    hidden: true, icon: "⭐", color: "purple",   // spare card: delete the "hidden: true," part to show it
    title: { hi: "नई सुविधा 3", en: "New facility 3" },
    paragraphs: [ { hi: "यहाँ सुविधा की जानकारी लिखें।", en: "Write the details of this facility here." } ],
    info: [],
    list: [],
    contacts: []
  }
];

/* ---------- 11. Daan ---------- */
// enabled: false shows "details coming soon" instead.
// Leave a field "" to hide it. Check every detail with the trustees first.
window.DAAN = {
  enabled: true,
  intro: {
    hi: "आपका दान मंदिर की रोज़ की पूजा, मंदिर के रखरखाव और ऊपर दी गई योजनाओं में काम आता है। आपके सहयोग के लिए धन्यवाद।",
    en: "Your daan supports daily pooja, the upkeep of the mandir and the yojanayen listed on this website. Thank you for your support."
  },
  upiId: "eazypay.mxv8ofmr7akehh1@icici",
  qrImage: "images/upi-qr.png",     // shown just below the UPI ID
  bank: [
    { label: { hi: "खाते का नाम", en: "Account name" }, value: "Jain Shravak Sangh" },
    { label: { hi: "बैंक", en: "Bank" }, value: "ICICI Bank" },
    { label: { hi: "खाता संख्या", en: "Account number" }, value: "172705005064", copy: true },
    { label: { hi: "IFSC", en: "IFSC" }, value: "ICIC0001727", copy: true },
    { label: { hi: "शाखा", en: "Branch" }, value: "Wagholi" }
  ],
  inPerson: {
    hi: "आप मंदिर कार्यालय में खुलने के समय में भी दान दे सकते हैं। रसीद दी जाएगी।",
    en: "You can also give daan at the mandir office during opening hours. A receipt will be given."
  },
  note: { hi: "", en: "" },
  // A short caution shown on the Daan page just above "Niyamit daan aur seva". Leave both "" to hide it.
  disclaimer: {
    hi: "कृपया कोई भी भुगतान (पेमेंट) करने से पहले एक बार मंदिर के कार्यकर्ता से जानकारी जाँच लें, और भुगतान करते समय खाताधारक का नाम भी मिला लें।",
    en: "Before making any payment, please confirm the details once with a mandir karyakarta, and check the account holder's name when you pay."
  }
};

/* Regular daan and seva (every week / every month): one card each on the Daan page.
   Each card: title, when (the small tag on top), text, how (small grey line at the bottom).
   TO ADD a card: copy one whole { ... }, block, paste it after the last one, change the text.
   TO REMOVE a card: delete its whole { ... }, block.   TO HIDE it for now: add  hidden: true,  inside it.
   The last three cards ("Daan 1/2/3") are spare cards that are hidden. To use one: delete its  hidden: true,  line
   and write your own text. Cards are shown in this order, three in a row on a computer screen.
   contacts: [ { name: {hi,en}, phone: "..." } ]  A call button with the name shows under the card once a phone number is written. */
window.RECURRING = [
  {
    title: { hi: "मासिक द्रव्य दान", en: "Masik Dravya Daan" },
    amount: 1122,   // fixed amount shown on the card (write a number, or "" to hide the line)
    when: { hi: "हर महीने", en: "Every month" },
    text: {
      hi: "हर महीने मंदिर के लिए किसी भी तरह की सामग्री का दान, ख़ासकर पूजा की सामग्री। आप भी इसमें जुड़ सकते हैं।",
      en: "Every month, items of any kind can be given as daan to the mandir, mainly pooja items. You can join too."
    },
    how: {
      hi: "सामग्री दान करने के लिए कृपया स्वप्निल जैन से संपर्क करें।",
      en: "To give items as daan, please contact Swapnil Jain."
    },
    // Write the phone number between the quotes and a call button with the name appears under this card.
    contacts: [ { name: { hi: "स्वप्निल जैन", en: "Swapnil Jain" }, phone: "" } ]
  },
  {
    title: { hi: "साप्ताहिक शांतिधारा", en: "Saptahik Shantidhara" },
    amount: 1022,   // fixed amount shown on the card (write a number, or "" to hide the line)
    when: { hi: "हर हफ्ते", en: "Every week" },
    text: {
      hi: "सप्ताह के किसी एक दिन (जैसे हर मंगलवार) के लिए एक या एक से अधिक श्रद्धालु अपना नाम दे सकते हैं। उस दिन हर हफ्ते उन्हीं पुण्यार्जकों के नाम से शांतिधारा होती है।",
      en: "One or more devotees can give their name for a particular day of the week (for example, every Tuesday). On that day each week, Shantidhara is performed in the name of those punyarjaks."
    },
    how: {
      hi: "पुण्यार्जक बनने के लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।",
      en: "To become a punyarjak, please contact the members listed on the Team page."
    },
    // When the name is confirmed: write it and the phone number here (and change the "how" line above if you like).
    contacts: [ { name: { hi: "नाम", en: "Name" }, phone: "" } ]
  },
  {
    title: { hi: "मासिक शांतिधारा", en: "Masik Shantidhara" },
    amount: 522,   // fixed amount shown on the card (write a number, or "" to hide the line)
    when: { hi: "हर महीने", en: "Every month" },
    text: {
      hi: "महीने की किसी एक तारीख के लिए एक या एक से अधिक श्रद्धालु अपना नाम दे सकते हैं। उस तारीख को हर महीने उन्हीं पुण्यार्जकों के नाम से शांतिधारा होती है।",
      en: "One or more devotees can give their name for a particular date of the month. On that date each month, Shantidhara is performed in the name of those punyarjaks."
    },
    how: {
      hi: "पुण्यार्जक बनने के लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।",
      en: "To become a punyarjak, please contact the members listed on the Team page."
    },
    // When the name is confirmed: write it and the phone number here (and change the "how" line above if you like).
    contacts: [ { name: { hi: "नाम", en: "Name" }, phone: "" } ]
  },
  {
    title: { hi: "मासिक भक्तामर भक्ति", en: "Masik Bhaktamber Bhakti" },
    amount: 522,   // fixed amount shown on the card (write a number, or "" to hide the line)
    when: { hi: "हर महीने के दूसरे रविवार", en: "Second Sunday of every month" },
    text: {
      hi: "हर महीने कोई भी परिवार अपना नाम देकर उस महीने के भक्तामर पाठ का पुण्यार्जन कर सकता है। यह पाठ महीने के दूसरे रविवार को होता है।",
      en: "Every month, any family can give its name and earn the punyarjan of that month's Bhaktamber path. The path is held on the second Sunday of the month."
    },
    how: {
      hi: "पुण्यार्जक बनने के लिए कृपया अनुज जैन से संपर्क करें।",
      en: "To become a punyarjak, please contact Anuj Jain."
    },
    contacts: [ { name: { hi: "अनुज जैन", en: "Anuj Jain" }, phone: "" } ]
  },
  {
    hidden: true,
    title: { hi: "दान 1", en: "Daan 1" },
    when: { hi: "हर महीने", en: "Every month" },
    text: { hi: "यहाँ इस दान या सेवा की जानकारी लिखें।", en: "Write the details of this daan or seva here." },
    how: { hi: "इसके लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।", en: "To join, please contact the members listed on the Team page." }
  },
  {
    hidden: true,
    title: { hi: "दान 2", en: "Daan 2" },
    when: { hi: "हर महीने", en: "Every month" },
    text: { hi: "यहाँ इस दान या सेवा की जानकारी लिखें।", en: "Write the details of this daan or seva here." },
    how: { hi: "इसके लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।", en: "To join, please contact the members listed on the Team page." }
  },
  {
    hidden: true,
    title: { hi: "दान 3", en: "Daan 3" },
    when: { hi: "हर महीने", en: "Every month" },
    text: { hi: "यहाँ इस दान या सेवा की जानकारी लिखें।", en: "Write the details of this daan or seva here." },
    how: { hi: "इसके लिए कृपया टीम पेज पर दिए गए सदस्यों से संपर्क करें।", en: "To join, please contact the members listed on the Team page." }
  }
];

/* GOOGLE SHEET LINKS for the Daan page lists (names, dates, amounts).
   Paste the "Publish to web" CSV link of each Sheet tab between the quotes (see README: Google Sheet section).
   A link left empty "" means: that list is read from the lists written below in this file (PUNYARJAK, DRAVYA, BHAKTAMBAR).
   Once a link is filled, the Sheet is used and the Daan page shows only the previous / this / next month by itself. */
window.SHEETS = {
  saptahik: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0LcLQrJv1MmiZkn-eK_u48xX-6_36mp1-X6XaOgrop888loS6Rrd3IdSLQBHPLA/pub?gid=1603045792&single=true&output=csv",    // tab "Saptahik Shantidhara"
  masik: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0LcLQrJv1MmiZkn-eK_u48xX-6_36mp1-X6XaOgrop888loS6Rrd3IdSLQBHPLA/pub?gid=947962969&single=true&output=csv",       // tab "Masik Shantidhara"
  dravya: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0LcLQrJv1MmiZkn-eK_u48xX-6_36mp1-X6XaOgrop888loS6Rrd3IdSLQBHPLA/pub?gid=2001759128&single=true&output=csv",      // tab "Dravya dan"
  bhaktamar: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0LcLQrJv1MmiZkn-eK_u48xX-6_36mp1-X6XaOgrop888loS6Rrd3IdSLQBHPLA/pub?gid=700086573&single=true&output=csv"    // tab "Bhaktamar"
};

/* Shantidhara punyarjak list. Shown on the Daan page as a calendar-style table, month by month,
   with Saptahik and Masik dates told apart by colour, and a filter to show only one kind.
   kind: "saptahik" or "masik".   date: "YYYY-MM-DD".   name: the punyarjak (plain text or { hi, en }).
   TO ADD: copy one line, paste it, change date / kind / name.
   TO REMOVE: delete the line, or add  hidden: true  to it.
   If there are no rows, the table does not show. Only add a name with that person's permission. */
window.PUNYARJAK = [
];

/* Bhaktamber path: monthly punyarjak. Shown on the Daan page as a table of ALL 12 months of the current year.
   The path is on the 2nd Sunday of each month; the table works out that date by itself.
   TO ADD a family: copy one line, paste it, change  month: "YYYY-MM"  and the name.  Two families in one month = two lines.
   If the path is held on another day in a month, add  date: "YYYY-MM-DD"  to that line.
   TO REMOVE: delete the line, or add  hidden: true  to it. Months with no name show "open for now, you can give your name".
   Only add a name with that family's permission. Delete the whole block (all of it) to remove the table from the Daan page. */
window.BHAKTAMBAR = [
  // { month: "2026-11", name: { hi: "परिवार का नाम", en: "Family name" } },
];

/* ---------- 12. Trust and 80G details (shown on the Daan page) ---------- */
// Fill the value of each line when you have it. Lines with an empty value are hidden.
// If every value is empty, visitors see "details will be added soon".
// You can add more lines by copying one { ... }, block.
window.TRUST = {
  enabled: true,
  items: [
    { label: { hi: "ट्रस्ट का नाम", en: "Name of the trust" }, value: "" },
    { label: { hi: "रजिस्ट्रेशन नंबर", en: "Registration number" }, value: "" },
    { label: { hi: "PAN", en: "PAN" }, value: "" },
    { label: { hi: "80G नंबर", en: "80G number" }, value: "" },
    { label: { hi: "80G की वैधता", en: "80G valid till" }, value: "" },
    { label: { hi: "12A नंबर", en: "12A number" }, value: "" }
  ],
  note: {
    hi: "",   // e.g. "दान की रसीद मंदिर कार्यालय से मिलेगी।"
    en: ""    // e.g. "A receipt is given by the mandir office."
  }
};

/* Masik Dravya Daan: list of donors. If there are no rows, the table does not show.
   Only add a name with the person's permission. */
window.DRAVYA = [
];
