import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/** Format ISO date to readable string */
export const formatDate = (dateStr) => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(d)) return dateStr || '—';
    return format(d, 'dd MMM yyyy');
  } catch { return dateStr || '—'; }
};

/** Relative time string */
export const timeAgo = (dateStr) => {
  try {
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(d)) return 'recently';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch { return 'recently'; }
};

/** Truncate text */
export const truncate = (text, max = 100) => {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

/** Status badge class */
export const statusBadgeClass = (status) => {
  switch (status) {
    case 'lost':     return 'badge-lost';
    case 'found':    return 'badge-found';
    case 'returned': return 'badge-returned';
    default:         return 'badge-lost';
  }
};

/** Status label with emoji */
export const statusLabel = (status) => {
  switch (status) {
    case 'lost':     return '🔴 Lost';
    case 'found':    return '🟢 Found';
    case 'returned': return '🔵 Returned';
    default:         return status;
  }
};

/** Avatar initials from full name */
export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';

/** Deterministic avatar bg color from name */
export const avatarColor = (name = '') => {
  const palette = [
    'bg-blue-500', 'bg-violet-500', 'bg-emerald-500',
    'bg-orange-500', 'bg-rose-500', 'bg-indigo-500',
    'bg-teal-500', 'bg-amber-500',
  ];
  const idx = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
};

const COLLEGE_EMAIL_DOMAIN = '@presidencyuniversity.in';

/** Validate email */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
  email.toLowerCase().endsWith(COLLEGE_EMAIL_DOMAIN);

/** Validate Indian phone */
export const isValidPhone = (phone) =>
  /^(\+91[-\s]?)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''));

/** Format large numbers */
export const fmt = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

/** Match score label + color */
export const matchMeta = (score) => {
  if (score >= 90) return { label: 'Excellent Match', color: 'text-emerald-600 dark:text-emerald-400', ring: 'border-emerald-500' };
  if (score >= 75) return { label: 'Strong Match',    color: 'text-blue-600 dark:text-blue-400',    ring: 'border-blue-500' };
  if (score >= 60) return { label: 'Good Match',      color: 'text-yellow-600 dark:text-yellow-400', ring: 'border-yellow-500' };
  if (score >= 40) return { label: 'Possible Match',  color: 'text-orange-600 dark:text-orange-400', ring: 'border-orange-500' };
  return { label: 'Weak Match', color: 'text-slate-500', ring: 'border-slate-400' };
};

/** Generate unique ID */
export const generateId = () =>
  `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/** Build share URL */
export const shareUrl = (itemId) =>
  `${window.location.origin}/item/${itemId}`;

/** WhatsApp share URL */
export const waShareUrl = (text) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;

/** Copy to clipboard */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/** Debounce */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
