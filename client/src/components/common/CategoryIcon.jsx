import {
  CreditCard,
  Wallet,
  Cpu,
  Laptop,
  Smartphone,
  Headphones,
  BookOpen,
  PenTool,
  Key,
  Backpack,
  Shirt,
  Gem,
  FileText,
  Package,
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  'student-id': CreditCard,
  wallet: Wallet,
  electronics: Cpu,
  laptop: Laptop,
  mobile: Smartphone,
  earphones: Headphones,
  books: BookOpen,
  stationery: PenTool,
  keys: Key,
  bags: Backpack,
  clothing: Shirt,
  jewelry: Gem,
  documents: FileText,
  others: Package,
};

export default function CategoryIcon({ categoryId, size = 16, className = '', ...props }) {
  const IconComponent = CATEGORY_ICON_MAP[categoryId] || Package;
  return <IconComponent size={size} className={className} {...props} />;
}
