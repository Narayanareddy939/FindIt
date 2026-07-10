import { motion } from 'framer-motion';
import { Bell, CheckCheck, Zap, CheckCircle, MessageCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/common/PageWrapper';
import { useApp } from '../../context/AppContext';

const ICON_MAP = {
  zap: Zap,
  'check-circle': CheckCircle,
  'message-circle': MessageCircle,
  'package-check': Package,
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useApp();

  return (
    <PageWrapper>
      <div className="container-app py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary dark:text-white flex items-center gap-2">
              <Bell size={22} className="text-primary-600" /> Notifications
              {unreadCount > 0 && (
                <span className="w-6 h-6 rounded-full bg-danger text-white text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost text-sm flex items-center gap-1.5">
              <CheckCheck size={15} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Bell size={36} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">All Caught Up!</h3>
            <p className="text-slate-500 text-sm">No notifications yet. Report an item to get started.</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => {
              const Icon = ICON_MAP[n.icon] || Bell;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card p-4 flex items-start gap-4 cursor-pointer hover:shadow-card-hover transition-all duration-200 ${
                    !n.read ? 'border-l-4 border-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''
                  }`}
                  onClick={() => markNotificationRead(n.id)}
                >
                  <div className={`w-10 h-10 rounded-2xl ${n.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={n.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-secondary dark:text-white leading-snug">{n.title}</p>
                      {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-slate-400">{n.time}</span>
                      {n.itemId && (
                        <Link
                          to={`/item/${n.itemId}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          View Item →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
