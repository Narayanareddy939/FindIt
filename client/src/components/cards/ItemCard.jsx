import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Eye, Bookmark, BookmarkCheck, Award, CheckCircle, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { formatDate, timeAgo, truncate, statusBadgeClass, statusLabel, matchMeta } from '../../utils/helpers';

/**
 * ItemCard — Reusable card for lost/found items shown in lists and search results
 */
export default function ItemCard({ item, index = 0 }) {
  const { toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(item.id);

  const cat = CATEGORIES.find((c) => c.id === item.category);
  const hasMatch = item.matchScore && item.matchScore >= 60;
  const matchInfo = hasMatch ? matchMeta(item.matchScore) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card card-hover group relative overflow-hidden"
    >
      {/* Match badge */}
      {hasMatch && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border ${matchInfo.ring} ${matchInfo.color} shadow-sm`}>
            <Zap size={10} className="fill-current" />
            {item.matchScore}% Match
          </span>
        </div>
      )}

      {/* Verified badge */}
      {item.verified && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-blue-600 border border-blue-200">
            <CheckCircle size={10} className="fill-current" />
            Verified
          </span>
        </div>
      )}

      {/* Image */}
      <Link to={`/item/${item.id}`} className="block relative overflow-hidden aspect-[4/3] rounded-t-2xl bg-slate-100 dark:bg-slate-700">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {cat?.icon || '📦'}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category + Status row */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat?.color || 'bg-slate-100 text-slate-600'}`}>
            {cat?.icon} {cat?.label || item.category}
          </span>
          <span className={statusBadgeClass(item.status)}>
            {statusLabel(item.status)}
          </span>
        </div>

        {/* Title */}
        <Link to={`/item/${item.id}`}>
          <h3 className="font-semibold text-secondary dark:text-white text-sm leading-snug mb-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {item.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
          {truncate(item.description, 90)}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={12} className="text-primary-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={12} className="text-primary-500 shrink-0" />
            <span>{formatDate(item.date)}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">{timeAgo(item.createdAt)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {/* Reporter avatar */}
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-[10px] font-bold text-primary-700 dark:text-primary-300">
              {item.reporter?.avatar || (item.reporter?.name ? item.reporter.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??')}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
              {item.reporter?.name?.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Views */}
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Eye size={12} />
              {item.views}
            </span>

            {/* Reward */}
            {item.reward && (
              <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Award size={11} />
                {item.reward}
              </span>
            )}

            {/* Bookmark */}
            <button
              onClick={(e) => { e.preventDefault(); toggleBookmark(item.id); }}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark item'}
            >
              {bookmarked
                ? <BookmarkCheck size={15} className="text-primary-600 fill-primary-100" />
                : <Bookmark size={15} className="text-slate-400 hover:text-primary-600" />
              }
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
