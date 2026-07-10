import { format, formatDistanceToNow, parseISO } from 'date-fns';

/** Format date for display */
export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr || 'Unknown';
  }
};

/** Relative time (e.g. "3 hours ago") */
export const timeAgo = (dateStr) => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return 'recently';
  }
};

/** Truncate long text */
export const truncate = (text, maxLen = 100) => {
  if (!text) return '';
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
};

/** Get status color classes */
export const getStatusColor = (status) => {
  switch (status) {
    case 'lost':     return 'badge-lost';
    case 'found':    return 'badge-found';
    case 'returned': return 'badge-returned';
    default:         return 'badge-lost';
  }
};

/** Get status label */
export const getStatusLabel = (status) => {
  switch (status) {
    case 'lost':     return '🔴 Lost';
    case 'found':    return '🟢 Found';
    case 'returned': return '🔵 Returned';
    default:         return status;
  }
};

/** Get initials from name */
export const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

/** Generate avatar color from name */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500',
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
};

/** Validate email format */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Validate phone number (Indian format) */
export const isValidPhone = (phone) =>
  /^(\+91|0)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));

/** Format large numbers */
export const formatNumber = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

/** Match score label */
export const getMatchLabel = (score) => {
  if (score >= 90) return { label: 'Excellent Match', color: 'text-green-600' };
  if (score >= 70) return { label: 'Good Match',      color: 'text-blue-600' };
  if (score >= 50) return { label: 'Possible Match',  color: 'text-yellow-600' };
  return { label: 'Weak Match', color: 'text-slate-500' };
};

/** Deep clone */
export const clone = (obj) => JSON.parse(JSON.stringify(obj));

/** Generate unique ID */
export const generateId = () => `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/** Share URL builder */
export const buildShareUrl = (itemId) =>
  `${window.location.origin}/item/${itemId}`;

/** WhatsApp share URL */
export const whatsAppShareUrl = (text) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;
