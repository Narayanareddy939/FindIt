import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, AlertCircle, CheckCircle2, Package,
  Bookmark, Bell, TrendingUp, Plus, Eye, Zap,
} from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import ItemCard from '../../components/cards/ItemCard';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const TABS = [
  { id: 'overview',   label: 'Overview',      icon: LayoutDashboard },
  { id: 'lost',       label: 'My Lost Items', icon: AlertCircle },
  { id: 'found',      label: 'My Found Items',icon: CheckCircle2 },
  { id: 'recovered',  label: 'Recovered',     icon: Package },
];

export default function Dashboard() {
  const { user }  = useAuth();
  const { items, notifications } = useApp();
  const [tab, setTab] = useState('overview');

  const currentUserId = user?._id || user?.id;
  const matchesCurrentUser = (item) => {
    const reporterId = item.reporter?._id || item.reporter?.id || item.reporter;
    return reporterId?.toString() === currentUserId?.toString();
  };

  const myLost      = items.filter((i) => matchesCurrentUser(i) && i.type === 'lost');
  const myFound     = items.filter((i) => matchesCurrentUser(i) && i.type === 'found');
  const myRecovered = items.filter((i) => matchesCurrentUser(i) && i.status === 'returned');
  const unread      = notifications.filter((n) => !n.read).length;
  const hasMatches  = items.some((i) => matchesCurrentUser(i) && i.matchScore && i.matchScore >= 60);

  return (
    <PageWrapper>
      <div className="container-app py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {user?.department} · {user?.year} · {user?.rollNo}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/report/lost" className="btn-danger text-sm px-4 py-2.5">
              <AlertCircle size={15} /> Report Lost
            </Link>
            <Link to="/report/found" className="bg-success text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Report Found
            </Link>
          </div>
        </div>

        {/* Match alert banner */}
        {hasMatches && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-6 border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/10 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Zap size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-secondary dark:text-white text-sm">🎯 Possible Match Found!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your Student ID Card has a 97% match with a found item near the library.</p>
            </div>
            <Link to="/item/1" className="btn-primary text-xs py-1.5 px-4 shrink-0">Review Match</Link>
          </motion.div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: AlertCircle,  label: 'Lost Reports',    value: myLost.length,      color: 'from-red-500 to-danger' },
            { icon: CheckCircle2, label: 'Found Reports',   value: myFound.length,     color: 'from-emerald-500 to-green-600' },
            { icon: Package,      label: 'Items Recovered', value: myRecovered.length, color: 'from-blue-500 to-primary-600' },
            { icon: TrendingUp,   label: 'People Helped',   value: user?.stats?.helped || 3, color: 'from-violet-500 to-purple-600' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-secondary dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-700">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-secondary dark:hover:text-white'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-secondary dark:text-white mb-4 flex items-center gap-2">
                <Bell size={16} className="text-primary-600" /> Recent Notifications
                {unread > 0 && <span className="w-5 h-5 rounded-full bg-danger text-white text-xs font-bold flex items-center justify-center">{unread}</span>}
              </h3>
              <div className="space-y-3">
                {notifications.slice(0, 4).map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`card p-4 flex items-start gap-3 ${!n.read ? 'border-l-4 border-primary-500' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center shrink-0`}>
                      <Zap size={15} className={n.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-secondary dark:text-white">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-500 mt-1 shrink-0" />}
                  </motion.div>
                ))}
              </div>
              <Link to="/notifications" className="block text-center text-sm text-primary-600 dark:text-primary-400 mt-4 hover:underline">
                View all notifications →
              </Link>
            </div>

            {/* Quick actions */}
            <div>
              <h3 className="font-semibold text-secondary dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { to: '/report/lost',  icon: AlertCircle,  label: 'Report Lost Item',  sub: 'File a new lost report',    color: 'text-danger bg-red-50 dark:bg-red-900/20' },
                  { to: '/report/found', icon: CheckCircle2, label: 'Report Found Item', sub: 'Submit what you\'ve found', color: 'text-success bg-green-50 dark:bg-green-900/20' },
                  { to: '/search',       icon: Eye,          label: 'Browse All Items',  sub: 'Search the database',       color: 'text-primary-600 bg-blue-50 dark:bg-blue-900/20' },
                  { to: '/bookmarks',    icon: Bookmark,     label: 'My Bookmarks',      sub: 'Saved items',               color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
                ].map(({ to, icon: Icon, label, sub, color }) => (
                  <Link key={to} to={to}
                    className="card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all duration-200 group">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'lost' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">{myLost.length} lost item{myLost.length !== 1 ? 's' : ''} reported</p>
              <Link to="/report/lost" className="btn-danger text-xs py-2 px-4"><Plus size={13} /> New Report</Link>
            </div>
            {myLost.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myLost.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-16">
                <AlertCircle size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No lost items reported yet</p>
                <Link to="/report/lost" className="btn-primary mt-4 text-sm">Report Lost Item</Link>
              </div>
            )}
          </div>
        )}

        {tab === 'found' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">{myFound.length} found item{myFound.length !== 1 ? 's' : ''} reported</p>
              <Link to="/report/found" className="bg-success text-white text-xs py-2 px-4 rounded-xl font-semibold hover:bg-green-700 flex items-center gap-1.5"><Plus size={13} /> New Report</Link>
            </div>
            {myFound.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myFound.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-16">
                <CheckCircle2 size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No found items reported yet</p>
                <Link to="/report/found" className="bg-success text-white font-semibold text-sm px-5 py-2.5 rounded-xl mt-4 inline-block hover:bg-green-700">Report Found Item</Link>
              </div>
            )}
          </div>
        )}

        {tab === 'recovered' && (
          <div>
            {myRecovered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myRecovered.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No items marked as returned yet</p>
                <p className="text-xs text-slate-400 mt-2">Items appear here once you mark them as returned</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
