/**
 * FindIt AI Helpers — Simulates intelligent features:
 * 1. Description Enhancement
 * 2. Category Auto-Detection
 * 3. Keyword Extraction
 * 4. Smart Match Scoring
 * 5. Duplicate Detection
 */


/* ─── 1. Description Enhancer ────────────────────────────────────────────── */
const templates = {
  'student-id': (raw) =>
    `${raw} student ID card issued by Presidency University. Features a passport-size photograph, student name, roll number, department, year of study, and validity date. Attached to a neck lanyard for easy carrying.`,
  wallet: (raw) =>
    `${raw} wallet with multiple card slots, a main cash compartment, and a zippered inner pocket. Likely contains ATM/credit cards, college bus pass, and personal identification documents.`,
  earphones: (raw) =>
    `${raw} wireless earphones with compact charging case. Supports active noise cancellation and Bluetooth 5.0 connectivity. May still be paired with a nearby mobile device — try playing audio to locate.`,
  laptop: (raw) =>
    `${raw} laptop computer with power adapter. Contains personal and academic data including assignments, projects, and course materials. Screen may have identifying marks or stickers for recognition.`,
  mobile: (raw) =>
    `${raw} smartphone, possibly secured with a PIN/fingerprint lock. Contains personal contacts, photos, and university-related apps. May have a protective case or screen guard for identification.`,
  keys: (raw) =>
    `${raw} key set on a metal ring. May include hostel room key, vehicle key, padlock key, or locker key. Check for any identifying tags, keychains, or engravings attached to the ring.`,
  bags: (raw) =>
    `${raw} bag/backpack containing academic materials, stationery, and personal belongings. Check inner pockets for name tags, student ID, or emergency contact details for quick identification.`,
  stationery: (raw) =>
    `${raw} stationery item commonly used by students. May have the owner's name written on it. Typically found in classrooms, labs, or exam halls during academic sessions.`,
  jewelry: (raw) =>
    `${raw} piece of jewelry with potential sentimental value. Handle with care. If found, please hand it to the campus security office or contact the reporter immediately.`,
  default: (raw) =>
    `${raw} item lost/found on the Presidency University campus. Please review the description, location, and date carefully. Contact the reporter through FindIt's secure messaging system if you have any information.`,
};

export const enhanceDescription = async (rawText, category) => {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 1800));
  const fn = templates[category] || templates.default;
  return fn(rawText.trim());
};

/* ─── 2. Category Detector ───────────────────────────────────────────────── */
const catKeywords = {
  'student-id': ['student id', 'id card', 'identity card', 'college id', 'university id', 'lanyard', 'roll no'],
  wallet:       ['wallet', 'purse', 'billfold', 'money clip', 'card holder', 'cash'],
  earphones:    ['airpods', 'earphone', 'earbud', 'headphone', 'buds', 'jabra', 'sony wf', 'boat rockerz'],
  laptop:       ['laptop', 'macbook', 'notebook', 'chromebook', 'thinkpad', 'dell', 'hp pavilion', 'lenovo', 'asus'],
  mobile:       ['phone', 'mobile', 'iphone', 'samsung', 'oneplus', 'redmi', 'smartphone', 'realme', 'oppo', 'vivo'],
  keys:         ['key', 'keys', 'key ring', 'keychain', 'bike key', 'room key', 'padlock'],
  bags:         ['bag', 'backpack', 'sling', 'handbag', 'rucksack', 'jansport', 'wildcraft', 'tote'],
  clothing:     ['shirt', 'jacket', 'hoodie', 'sweater', 'coat', 'scarf', 'cap', 'hat', 'jeans'],
  jewelry:      ['ring', 'necklace', 'bracelet', 'earring', 'chain', 'watch', 'bangle', 'pendant'],
  books:        ['book', 'notebook', 'textbook', 'journal', 'diary', 'notes', 'novel'],
  stationery:   ['pen', 'pencil', 'calculator', 'ruler', 'compass', 'eraser', 'stationery', 'casio', 'geometry'],
  electronics:  ['charger', 'adapter', 'cable', 'power bank', 'mouse', 'keyboard', 'usb', 'pendrive', 'hard disk'],
  documents:    ['document', 'certificate', 'marksheet', 'letter', 'passport', 'aadhar', 'file', 'printout'],
};

export const detectCategory = (text) => {
  const lower = text.toLowerCase();
  for (const [id, kws] of Object.entries(catKeywords)) {
    if (kws.some((kw) => lower.includes(kw))) return id;
  }
  return 'others';
};

/* ─── 3. Keyword Extractor ───────────────────────────────────────────────── */
const COLORS     = ['red', 'blue', 'green', 'black', 'white', 'grey', 'gray', 'yellow', 'purple', 'pink', 'orange', 'brown', 'navy', 'silver', 'gold', 'cyan', 'maroon'];
const BRANDS     = ['apple', 'samsung', 'hp', 'dell', 'lenovo', 'sony', 'jbl', 'bose', 'nike', 'adidas', 'wildcraft', 'jansport', 'realme', 'oneplus', 'casio', 'titan', 'boat'];
const LOC_WORDS  = ['library', 'canteen', 'cafeteria', 'hostel', 'lab', 'block', 'gate', 'auditorium', 'parking', 'court', 'ground', 'office', 'hall'];

export const extractKeywords = (text) => {
  const lower = text.toLowerCase();
  return {
    colors:    COLORS.filter((c) => lower.includes(c)),
    brands:    BRANDS.filter((b) => lower.includes(b)),
    locations: LOC_WORDS.filter((l) => lower.includes(l)),
    numbers:   (lower.match(/\b\d{4,}\b/g) || []).slice(0, 3),
  };
};

/* ─── 4. Smart Match Scorer ──────────────────────────────────────────────── */
export const calcMatchScore = (a, b) => {
  let score = 0;

  // Category (30 pts)
  if (a.category === b.category) score += 30;

  // Location (25 pts)
  const aLoc = (a.location || '').toLowerCase();
  const bLoc = (b.location || '').toLowerCase();
  const locWords = aLoc.split(/[\s,]+/).filter((w) => w.length > 3);
  const locHits  = locWords.filter((w) => bLoc.includes(w)).length;
  score += Math.round(Math.min(25, (locHits / Math.max(locWords.length, 1)) * 25));

  // Date (20 pts)
  if (a.date && b.date) {
    const diff = Math.abs(new Date(a.date) - new Date(b.date)) / 86_400_000;
    if (diff === 0)      score += 20;
    else if (diff <= 1)  score += 15;
    else if (diff <= 3)  score += 10;
    else if (diff <= 7)  score +=  5;
  }

  // Title (25 pts)
  const aTitle = (a.title || '').toLowerCase();
  const bTitle = (b.title || '').toLowerCase();
  const titleW = aTitle.split(/\s+/).filter((w) => w.length > 3);
  const titleH = titleW.filter((w) => bTitle.includes(w)).length;
  score += Math.round(Math.min(25, (titleH / Math.max(titleW.length, 1)) * 25));

  return Math.min(score, 99);
};

/* ─── 5. Find Matches ────────────────────────────────────────────────────── */
export const findMatches = (item, allItems) => {
  const opp = item.type === 'lost' ? 'found' : 'lost';
  return allItems
    .filter((i) => i.type === opp && i.id !== item.id)
    .map((i) => ({ ...i, matchScore: calcMatchScore(item, i) }))
    .filter((i) => i.matchScore >= 30)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};

/* ─── 6. Duplicate Detector ──────────────────────────────────────────────── */
export const detectDuplicate = (newItem, existingItems) => {
  for (const item of existingItems) {
    if (item.type !== newItem.type) continue;
    const score = calcMatchScore(newItem, item);
    if (score >= 65) return { isDuplicate: true, matchedItem: item, score };
  }
  return { isDuplicate: false, matchedItem: null, score: 0 };
};
