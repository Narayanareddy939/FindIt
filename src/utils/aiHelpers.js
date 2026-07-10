/**
 * AI Helper utilities
 * Simulates AI-powered features: description enhancement, category detection,
 * keyword extraction, smart matching, and duplicate detection
 */

import { CATEGORIES } from '../data/mockData';

// ─── 1. Description Enhancer ─────────────────────────────────────────────────
const descriptionTemplates = {
  'student-id': (base) =>
    `${base} student ID card with university branding, lanyard attachment hole, and photo identification. Contains student name, roll number, department, and validity date. Issued by Presidency University.`,
  wallet: (base) =>
    `${base} wallet with multiple card slots, a main cash compartment, and an inner zip pocket. May contain ATM cards, ID cards, student bus pass, and personal belongings.`,
  earphones: (base) =>
    `${base} wireless earphones/earbuds with charging case. Includes silicone ear tips and Bluetooth connectivity. May be paired with a nearby mobile device.`,
  laptop: (base) =>
    `${base} laptop computer with charging adapter. Contains personal data, academic work, and university assignments. Handle with care — fragile screen and components.`,
  mobile: (base) =>
    `${base} smartphone with lock screen enabled. Contains personal contacts, photos, and university-related applications. May have protective case or screen guard.`,
  keys: (base) =>
    `${base} key ring with multiple keys. May include hostel room key, vehicle key, padlock key, or locker key. Has identifying tags or key chains attached.`,
  bags: (base) =>
    `${base} backpack/bag containing academic materials, stationery, and personal items. Has multiple compartments and may have name tag or identification inside.`,
  default: (base) =>
    `${base} item found/lost on campus. Please check the description, location, and date carefully. Contact the reporter if you have any information.`,
};

export const enhanceDescription = (rawText, category) => {
  const template = descriptionTemplates[category] || descriptionTemplates.default;
  const enhanced = template(rawText.trim());
  return enhanced;
};

// ─── 2. Category Auto-Detector ────────────────────────────────────────────────
const categoryKeywords = {
  'student-id': ['student id', 'id card', 'identity card', 'college id', 'university id', 'lanyard'],
  wallet: ['wallet', 'purse', 'billfold', 'money clip', 'card holder'],
  earphones: ['airpods', 'earphones', 'earbuds', 'headphones', 'buds', 'audio', 'jabra', 'sony wf'],
  laptop: ['laptop', 'macbook', 'notebook', 'chromebook', 'thinkpad', 'dell', 'hp pavilion', 'lenovo'],
  mobile: ['phone', 'mobile', 'iphone', 'samsung', 'oneplus', 'redmi', 'smartphone', 'realme', 'oppo'],
  keys: ['keys', 'key ring', 'keychain', 'key chain', 'bike key', 'room key'],
  bags: ['bag', 'backpack', 'sling', 'handbag', 'rucksack', 'jansport', 'wildcraft'],
  clothing: ['shirt', 'jacket', 'hoodie', 'sweater', 'coat', 'scarf', 'cap', 'hat'],
  jewelry: ['ring', 'necklace', 'bracelet', 'earring', 'chain', 'watch', 'bangle'],
  books: ['book', 'notebook', 'textbook', 'journal', 'diary', 'notes'],
  stationery: ['pen', 'pencil', 'calculator', 'ruler', 'compass', 'eraser', 'stationery'],
  electronics: ['charger', 'adapter', 'cable', 'power bank', 'mouse', 'keyboard', 'usb'],
  documents: ['document', 'certificate', 'marksheet', 'letter', 'passport', 'aadhar', 'file'],
};

export const detectCategory = (text) => {
  const lower = text.toLowerCase();
  for (const [catId, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return catId;
    }
  }
  return 'others';
};

// ─── 3. Keyword Extractor ─────────────────────────────────────────────────────
const colorWords   = ['red', 'blue', 'green', 'black', 'white', 'grey', 'gray', 'yellow', 'purple', 'pink', 'orange', 'brown', 'navy', 'silver', 'gold'];
const brandWords   = ['apple', 'samsung', 'hp', 'dell', 'lenovo', 'sony', 'jbl', 'bose', 'nike', 'adidas', 'wildcraft', 'jansport', 'realme', 'oneplus'];
const locationWords = ['library', 'canteen', 'cafeteria', 'hostel', 'lab', 'block', 'gate', 'auditorium', 'parking', 'court', 'ground', 'office'];

export const extractKeywords = (text) => {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  return {
    colors:    colorWords.filter((c) => lower.includes(c)),
    brands:    brandWords.filter((b) => lower.includes(b)),
    locations: locationWords.filter((l) => lower.includes(l)),
    others:    words.filter((w) => w.length > 4 && !colorWords.includes(w) && !brandWords.includes(w)).slice(0, 5),
  };
};

// ─── 4. Smart Matching ────────────────────────────────────────────────────────
export const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;

  // Category match (30 points)
  if (lostItem.category === foundItem.category) score += 30;

  // Location proximity (25 points)
  const lostLoc  = lostItem.location?.toLowerCase() || '';
  const foundLoc = foundItem.location?.toLowerCase() || '';
  const locWords  = lostLoc.split(/[\s,]+/).filter((w) => w.length > 3);
  const locMatches = locWords.filter((w) => foundLoc.includes(w));
  score += Math.min(25, (locMatches.length / Math.max(locWords.length, 1)) * 25);

  // Date proximity (20 points)
  if (lostItem.date && foundItem.date) {
    const diff = Math.abs(new Date(lostItem.date) - new Date(foundItem.date)) / (1000 * 60 * 60 * 24);
    if (diff === 0) score += 20;
    else if (diff <= 1) score += 15;
    else if (diff <= 3) score += 10;
    else if (diff <= 7) score += 5;
  }

  // Title similarity (25 points)
  const lostTitle  = lostItem.title?.toLowerCase() || '';
  const foundTitle = foundItem.title?.toLowerCase() || '';
  const titleWords  = lostTitle.split(/\s+/).filter((w) => w.length > 3);
  const titleMatches = titleWords.filter((w) => foundTitle.includes(w));
  score += Math.min(25, (titleMatches.length / Math.max(titleWords.length, 1)) * 25);

  return Math.round(Math.min(score, 99));
};

// ─── 5. Duplicate Detector ────────────────────────────────────────────────────
export const detectDuplicate = (newItem, existingItems) => {
  for (const item of existingItems) {
    if (item.type !== newItem.type) continue;
    const score = calculateMatchScore(newItem, item);
    if (score >= 70) {
      return { isDuplicate: true, matchedItem: item, score };
    }
  }
  return { isDuplicate: false, matchedItem: null, score: 0 };
};

// ─── 6. Find Matches for Item ─────────────────────────────────────────────────
export const findMatches = (item, allItems) => {
  const oppositeType = item.type === 'lost' ? 'found' : 'lost';
  return allItems
    .filter((i) => i.type === oppositeType && i.id !== item.id)
    .map((i) => ({ ...i, matchScore: calculateMatchScore(item, i) }))
    .filter((i) => i.matchScore >= 40)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};
