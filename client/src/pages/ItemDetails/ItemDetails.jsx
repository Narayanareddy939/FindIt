import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Eye, Bookmark, BookmarkCheck,
  Flag, Award, CheckCircle, Zap, Phone, Mail,
  ArrowLeft, ChevronLeft, ChevronRight, Copy, MessageCircle,
} from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import ItemCard from '../../components/cards/ItemCard';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/mockData';
import { findMatches } from '../../utils/aiHelpers';
import { formatDate, timeAgo, statusBadgeClass, statusLabel, avatarColor, getInitials, copyToClipboard, waShareUrl, shareUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

const normalizeItem = (item) => {
  if (!item) return item;
  const reporter = item.reporter && typeof item.reporter === 'object'
    ? {
        ...item.reporter,
        id: item.reporter.id || item.reporter._id,
        _id: item.reporter._id || item.reporter.id,
      }
    : item.reporter;

  return {
    ...item,
    id: item.id || item._id,
    _id: item._id || item.id,
    reporter,
  };
};

export default function ItemDetails() {
  const { id }         = useParams();
  const navigate       = useNavigate();
  const { getItemById, markViewed, toggleBookmark, isBookmarked, items, updateItemStatus } = useApp();
  const { user, api }  = useAuth();

  const [imgIdx, setImgIdx]       = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [markingReturned, setMarkingReturned] = useState(false);
  const [detailItem, setDetailItem]   = useState(null);
  const [loadingItem, setLoadingItem] = useState(false);

  const item = detailItem || getItemById(id);

  useEffect(() => {
    if (id) markViewed(id);
  }, [id, markViewed]);

  useEffect(() => {
    const loadItemDetail = async () => {
      if (!id) return;
      if (detailItem?.id === id) return;
      if (item && item.reporter?.phone && item.reporter?.email) return;

      try {
        setLoadingItem(true);
        const response = await api.get(`/items/${id}`);
        if (response.data.success) {
          setDetailItem(normalizeItem(response.data.data));
        }
      } catch (err) {
        console.error('Failed to load item details:', err.message);
      } finally {
        setLoadingItem(false);
      }
    };

    loadItemDetail();
  }, [api, id, item, detailItem]);

  if (!item) {
    return (
      <div className="container-app py-20 text-center">
        {loadingItem ? (
          <>
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-secondary dark:text-white mb-2">Loading item details…</h2>
            <p className="text-slate-500 mb-6">Please wait while we fetch the report.</p>
          </>
        ) : (
          <>
            <p className="text-3xl mb-3">🔍</p>
            <h2 className="text-xl font-bold text-secondary dark:text-white mb-2">Item Not Found</h2>
            <p className="text-slate-500 mb-6">This item may have been removed or the link is invalid.</p>
            <Link to="/search" className="btn-primary">Browse All Items</Link>
          </>
        )}
      </div>
    );
  }

  const cat     = CATEGORIES.find((c) => c.id === item.category);
  const bm      = isBookmarked(item.id);
  const matches = findMatches(item, items).slice(0, 3);
  const images  = item.images?.length ? item.images : [];
  const isOwner = user?.id === item.reporter?.id;

  const handleMarkReturned = async () => {
    setMarkingReturned(true);
    try {
      const itemId = item.id || item._id;
      const updated = await updateItemStatus(itemId, 'returned');
      if (updated) {
        setDetailItem(normalizeItem(updated));
      }
      toast.success('🎉 Item marked as returned!');
    } catch (err) {
      toast.error('Unable to update item status. Please try again later.');
    } finally {
      setMarkingReturned(false);
    }
  };

  const handleShare = async () => {
    const url = shareUrl(item.id);
    const copied = await copyToClipboard(url);
    if (copied) toast.success('Link copied to clipboard!');
    else toast.error('Could not copy link');
  };

  const handleWhatsApp = () => {
    const text = `🔍 Found on FindIt: "${item.title}"\n📍 ${item.location}\n🔗 ${shareUrl(item.id)}`;
    window.open(waShareUrl(text), '_blank');
  };

  return (
    <PageWrapper>
      <div className="container-app py-8 max-w-6xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Image Gallery + Actions ─────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={imgIdx}
                    src={images[imgIdx]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl">{cat?.icon || '📦'}</div>
              )}

              {/* Image nav */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((i) => Math.max(i - 1, 0))} disabled={imgIdx === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all disabled:opacity-30">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setImgIdx((i) => Math.min(i + 1, images.length - 1))} disabled={imgIdx === images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all disabled:opacity-30">
                    <ChevronRight size={18} />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}

              {/* Status overlay */}
              <div className="absolute top-3 left-3">
                <span className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
              </div>
              {item.verified && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-blue-600 border border-blue-200">
                    <CheckCircle size={10} /> Verified
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-primary-600' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Share actions */}
            <div className="card p-4 space-y-2">
              <p className="text-xs font-semibold text-secondary dark:text-white mb-3">Share & Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleShare} className="btn-secondary text-xs py-2 gap-1.5">
                  <Copy size={13} /> Copy Link
                </button>
                <button onClick={handleWhatsApp} className="btn-secondary text-xs py-2 gap-1.5">
                  <MessageCircle size={13} /> WhatsApp
                </button>
                <button onClick={() => toggleBookmark(item.id)} className={`text-xs py-2 gap-1.5 rounded-xl border font-semibold transition-all ${bm ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'btn-secondary'}`}>
                  {bm ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                  {bm ? 'Saved' : 'Bookmark'}
                </button>
                <button onClick={() => toast('Report submitted to admin for review', { icon: '🚩' })} className="btn-secondary text-xs py-2 gap-1.5 text-danger border-danger/30">
                  <Flag size={13} /> Report
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Details ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title + meta */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold text-secondary dark:text-white leading-tight">{item.title}</h1>
                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${cat?.color}`}>
                  {cat?.icon} {cat?.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><Eye size={14} /> {item.views} views</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {timeAgo(item.createdAt)}</span>
                {item.reward && (
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <Award size={14} /> Reward: {item.reward}
                  </span>
                )}
              </div>
            </div>

            {/* Match alert */}
            {item.matchScore && item.matchScore >= 60 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-4 border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-green-600 text-sm shrink-0">
                    {item.matchScore}%
                  </div>
                  <div>
                    <p className="font-semibold text-secondary dark:text-white text-sm flex items-center gap-1.5">
                      <Zap size={14} className="text-green-500" /> AI Match Found!
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      This item has a <strong>{item.matchScore}%</strong> similarity score with a {item.type === 'lost' ? 'found' : 'lost'} report.{' '}
                      <Link to={`/item/${item.matchId}`} className="text-primary-600 hover:underline font-semibold">
                        View matching item →
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Description */}
            <div className="card p-5">
              <h3 className="font-semibold text-secondary dark:text-white mb-3 text-sm">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.description}</p>
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <p className="text-xs text-slate-400 mb-1.5 font-medium">📍 Location</p>
                <p className="text-sm font-semibold text-secondary dark:text-white">{item.location}</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-slate-400 mb-1.5 font-medium">📅 Date</p>
                <p className="text-sm font-semibold text-secondary dark:text-white">
                  {formatDate(item.date)} {item.time && `@ ${item.time}`}
                </p>
              </div>
            </div>

            {/* Reporter */}
            <div className="card p-5">
              <h3 className="font-semibold text-secondary dark:text-white mb-4 text-sm">
                {item.type === 'lost' ? 'Reported By' : 'Found & Held By'}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full ${avatarColor(item.reporter?.name || '')} flex items-center justify-center text-white font-bold`}>
                  {getInitials(item.reporter?.name || '')}
                </div>
                <div>
                  <p className="font-semibold text-secondary dark:text-white text-sm">{item.reporter?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Presidency University Student</p>
                </div>
              </div>

              {/* Contact */}
              {user && (
                <AnimatePresence>
                  {!showContact ? (
                    <button
                      onClick={() => { setShowContact(true); toast.success('Contact details revealed!'); }}
                      className="btn-primary w-full py-2.5 text-sm"
                    >
                      <Phone size={15} /> View Contact Details
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <div className="text-sm text-secondary dark:text-white font-semibold">Contact details for {item.reporter?.name}</div>
                      {item.reporter?.phone && (
                        <a href={`tel:${item.reporter.phone}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <Phone size={14} className="text-primary-600" />
                          <span className="font-medium">{item.reporter.phone}</span>
                        </a>
                      )}
                      {item.reporter?.email && (
                        <a href={`mailto:${item.reporter.email}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <Mail size={14} className="text-primary-600" />
                          <span className="font-medium">{item.reporter.email}</span>
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}

              {!user && (
                <Link to="/login" className="btn-secondary w-full py-2.5 text-sm text-center">
                  Sign in to view contact details
                </Link>
              )}
            </div>

            {/* Owner actions */}
            {isOwner && item.status !== 'returned' && (
              <div className="card p-4 border-l-4 border-primary-500 bg-primary-50/50 dark:bg-primary-900/10">
                <p className="text-sm font-semibold text-secondary dark:text-white mb-2">Your Item</p>
                <p className="text-xs text-slate-500 mb-3">Once you've collected your item, mark it as returned to update the community.</p>
                <button
                  onClick={handleMarkReturned}
                  disabled={markingReturned}
                  className="btn-primary py-2 px-5 text-sm"
                >
                  {markingReturned ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</>
                  ) : (
                    <><CheckCircle size={14} /> Mark as Returned</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── AI Matches ─────────────────────────────────────────────────── */}
        {matches.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} className="text-violet-600" />
              <h2 className="text-xl font-bold text-secondary dark:text-white">AI-Suggested Matches</h2>
              <span className="ai-badge">{matches.length} found</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((m, i) => (
                <ItemCard key={m.id} item={m} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
