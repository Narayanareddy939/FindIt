import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Users, Package, CheckCircle, X,
  AlertTriangle, Search, BarChart3, Eye, Trash2,
} from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/mockData';
import { formatDate, timeAgo, statusBadgeClass, statusLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ADMIN_TABS = [
  { id: 'pending',   label: 'Pending Approval', icon: AlertTriangle },
  { id: 'all',       label: 'All Items',         icon: Package },
  { id: 'users',     label: 'Users',             icon: Users },
  { id: 'analytics', label: 'Analytics',         icon: BarChart3 },
];

const MOCK_USERS = [
  { id: 'u1', name: 'Lakshmi Narayana Reddy', email: 'lakshmi@presidency.edu', dept: 'CS', year: '3rd', reports: 3, joined: '2024-07', role: 'student', status: 'active' },
  { id: 'u2', name: 'Priya Sharma',           email: 'priya@presidency.edu',   dept: 'MBA', year: '1st', reports: 2, joined: '2024-08', role: 'student', status: 'active' },
  { id: 'u3', name: 'Rahul Verma',            email: 'rahul@presidency.edu',   dept: 'CS', year: '2nd', reports: 1, joined: '2024-09', role: 'student', status: 'active' },
  { id: 'u4', name: 'Ananya Krishnan',        email: 'ananya@presidency.edu',  dept: 'ECE', year: '4th', reports: 4, joined: '2024-07', role: 'student', status: 'active' },
];

export default function AdminDashboard() {
  const { items, deleteItem, updateItem } = useApp();
  const { api, user } = useAuth();
  const [tab, setTab]   = useState('pending');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [, setUsersLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const pendingItems = items.filter((i) => !i.verified);
  const allItems     = items;
  const displayedUsers = users.length > 0 ? users : MOCK_USERS;
  const registeredUserCount = users.length > 0 ? users.length : MOCK_USERS.length;

  const filtered = (list) =>
    list.filter(
      (i) =>
        !search ||
        i.title?.toLowerCase().includes(search.toLowerCase()) ||
        i.reporter?.name?.toLowerCase().includes(search.toLowerCase()),
    );

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Fetch users failed:', err);
      toast.error('Unable to load users.');
    } finally {
      setUsersLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const handleSeedDemoUsers = async () => {
    try {
      setDemoLoading(true);
      const response = await api.post('/users/demo');
      if (response.data.success) {
        toast.success(`Created ${response.data.createdCount} demo users`);
        fetchUsers();
      }
    } catch (err) {
      console.error('Seed demo users failed:', err);
      toast.error('Failed to seed demo users.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleRemoveDemoUsers = async () => {
    try {
      setDemoLoading(true);
      const response = await api.delete('/users/demo');
      if (response.data.success) {
        toast.success(`Removed ${response.data.deletedCount} demo users`);
        fetchUsers();
      }
    } catch (err) {
      console.error('Remove demo users failed:', err);
      toast.error('Failed to remove demo users.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== id));
        toast.success('User deleted successfully.');
      }
    } catch (err) {
      console.error('Delete user failed:', err);
      toast.error('Could not delete user.');
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateItem(id, { verified: true });
      toast.success('Item approved and verified ✅');
    } catch (err) {
      console.error('Approve item failed:', err);
      toast.error('Unable to approve item.');
    }
  };

  const handleReject = (id) => {
    deleteItem(id);
    toast.error('Item rejected and removed');
  };

  return (
    <PageWrapper>
      <div className="container-app py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Manage reports, users, and campus safety</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSeedDemoUsers}
              disabled={demoLoading}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Seed Demo Accounts
            </button>
            <button
              onClick={handleRemoveDemoUsers}
              disabled={demoLoading}
              className="btn-danger px-4 py-2 text-sm"
            >
              Remove Demo Accounts
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reports',   value: items.length,                               color: 'from-blue-500 to-primary-600',  icon: Package },
            { label: 'Pending Review',  value: pendingItems.length,                        color: 'from-amber-500 to-orange-600',  icon: AlertTriangle },
            { label: 'Items Returned',  value: items.filter((i) => i.status === 'returned').length, color: 'from-emerald-500 to-green-600', icon: CheckCircle },
            { label: 'Registered Users',value: registeredUserCount,                       color: 'from-violet-500 to-purple-600', icon: Users },
          ].map(({ label, value, color, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              className="card p-5 flex items-center gap-3">
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
          {ADMIN_TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                tab === id
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-secondary dark:hover:text-white'
              }`}>
              <Icon size={14} />
              {label}
              {id === 'pending' && pendingItems.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-warning text-white text-xs font-bold flex items-center justify-center">
                  {pendingItems.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search bar (for items tabs) */}
        {(tab === 'pending' || tab === 'all') && (
          <div className="relative mb-5 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or reporter…"
              className="input-base pl-9 text-sm py-2.5" />
          </div>
        )}

        {/* Tab: Pending */}
        {tab === 'pending' && (
          <div className="space-y-3">
            {filtered(pendingItems).length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle size={40} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">All items reviewed! Nothing pending.</p>
              </div>
            ) : (
              filtered(pendingItems).map((item) => {
                const cat = CATEGORIES.find((c) => c.id === item.category);
                return (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="card p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                      {item.images?.[0]
                        ? <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">{cat?.icon}</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-secondary dark:text-white truncate">{item.title}</p>
                        <span className={statusBadgeClass(item.type)}>{statusLabel(item.type)}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.reporter?.name} · {item.location} · {formatDate(item.date)}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo(item.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold hover:bg-green-200 transition-colors">
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-danger dark:text-red-400 text-xs font-semibold hover:bg-red-200 transition-colors">
                        <X size={12} /> Reject
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Tab: All Items */}
        {tab === 'all' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {['Item', 'Category', 'Status', 'Reporter', 'Date', 'Views', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered(allItems).map((item) => {
                  const cat = CATEGORIES.find((c) => c.id === item.category);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-secondary dark:text-white max-w-[160px] truncate">{item.title}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{cat?.icon} {cat?.label}</td>
                      <td className="px-4 py-3"><span className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</span></td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[120px] truncate">{item.reporter?.name}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(item.date)}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.views}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => window.open(`/item/${item.id}`, '_blank')}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-600">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => handleReject(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-danger">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Users */}
        {tab === 'users' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {['Name', 'Email', 'Role', 'Department', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {displayedUsers.map((u) => (
                  <tr key={u._id || u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-secondary dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">{u.role || 'student'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.department || u.dept} · {u.year}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(u.createdAt || new Date())}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteUser(u._id || u.id)}
                        className="text-xs text-danger hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {displayedUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center px-4 py-10 text-slate-500 dark:text-slate-400">No users available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Analytics */}
        {tab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Items by Category',
                data: CATEGORIES.slice(0, 6).map((c) => ({
                  label: `${c.icon} ${c.label}`,
                  count: items.filter((i) => i.category === c.id).length,
                })),
              },
              {
                title: 'Items by Status',
                data: [
                  { label: '🔴 Lost',     count: items.filter((i) => i.type === 'lost').length },
                  { label: '🟢 Found',    count: items.filter((i) => i.type === 'found').length },
                  { label: '🔵 Returned', count: items.filter((i) => i.status === 'returned').length },
                ],
              },
            ].map(({ title, data }) => (
              <div key={title} className="card p-5">
                <h3 className="font-semibold text-secondary dark:text-white mb-4 text-sm">{title}</h3>
                <div className="space-y-3">
                  {data.map(({ label, count }) => {
                    const max = Math.max(...data.map((d) => d.count), 1);
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 dark:text-slate-300">{label}</span>
                          <span className="font-semibold text-secondary dark:text-white">{count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / max) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-primary rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
