import { useState } from 'react';
import { User, Mail, Phone, GraduationCap, Hash, Edit3, Save, Camera } from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { avatarColor, getInitials, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile }  = useAuth();
  const { items } = useApp();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm]       = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '',
    rollNo: user?.rollNo || '',
  });

  const currentUserId = user?._id || user?.id;
  const myItems    = items.filter((i) => {
    const reporterId = i.reporter?._id || i.reporter?.id || i.reporter;
    return reporterId?.toString() === currentUserId?.toString();
  });
  const myLost     = myItems.filter((i) => i.type === 'lost').length;
  const myFound    = myItems.filter((i) => i.type === 'found').length;
  const recovered  = myItems.filter((i) => i.status === 'returned').length;

  const handleSave = async () => {
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile(form);
      }
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container-app py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-secondary dark:text-white mb-8 flex items-center gap-2">
          <User size={22} className="text-primary-600" /> My Profile
        </h1>

        <div className="space-y-6">
          {/* Avatar card */}
          <div className="card p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl ${avatarColor(user?.name || '')} flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                {getInitials(user?.name || '')}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
                <Camera size={13} />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-secondary dark:text-white">{user?.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                  {user?.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">
                  {user?.year}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Member since {formatDate(user?.joinedAt)}</p>
            </div>
            <div className="sm:ml-auto">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm gap-1.5">
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving} className="btn-primary text-sm gap-1.5 disabled:opacity-50">
                  {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Lost Reports',   value: myLost,    color: 'text-danger' },
              { label: 'Found Reports',  value: myFound,   color: 'text-success' },
              { label: 'Items Returned', value: recovered, color: 'text-primary-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Info form */}
          <div className="card p-6">
            <h3 className="font-semibold text-secondary dark:text-white mb-5">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: User,         label: 'Full Name',   key: 'name',       placeholder: 'Your full name' },
                { icon: Phone,        label: 'Phone',       key: 'phone',      placeholder: '+91 98765 43210' },
                { icon: GraduationCap,label: 'Department',  key: 'department', placeholder: 'Computer Science' },
                { icon: GraduationCap,label: 'Year',        key: 'year',       placeholder: '3rd Year' },
                { icon: Hash,         label: 'Roll Number', key: 'rollNo',     placeholder: '21CS4567' },
                { icon: Mail,         label: 'Email',       key: 'email',      placeholder: user?.email, disabled: true },
              ].map(({ icon: Icon, label, key, placeholder, disabled }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={key === 'email' ? user?.email : form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      disabled={!editing || disabled}
                      placeholder={placeholder}
                      className="input-base pl-9 text-sm disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="card p-6">
            <h3 className="font-semibold text-secondary dark:text-white mb-4">Notification Preferences</h3>
            <div className="space-y-3">
              {[
                { label: 'Email notifications for matches',  defaultChecked: true },
                { label: 'Push notifications',               defaultChecked: true },
                { label: 'WhatsApp alerts',                  defaultChecked: false },
                { label: 'Weekly digest email',              defaultChecked: false },
              ].map(({ label, defaultChecked }) => (
                <label key={label} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-secondary dark:text-slate-200">{label}</span>
                  <input type="checkbox" defaultChecked={defaultChecked}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
