import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPhone } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Field = ({ label, name, type = 'text', icon: Icon, placeholder, form, handleChange, errors, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />}
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input-base ${Icon ? 'pl-10' : ''} ${errors[name] ? 'input-error' : ''}`}
        {...rest}
      />
    </div>
    {errors[name] && <p className="text-xs text-danger mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors[name]}</p>}
  </div>
);

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [form, setForm] = useState({
    name: '', email: location.state?.email || '', phone: '', password: '', confirm: '',
    department: '', rollNo: '', year: '', agreeTerms: false,
  });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name     = 'Full name is required';
    if (!isValidEmail(form.email)) e.email    = 'Enter a valid college email';
    if (!isValidPhone(form.phone)) e.phone    = 'Enter a valid Indian phone number';
    if (form.password.length < 8)  e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.department)          e.department = 'Select your department';
    if (!form.agreeTerms)          e.agreeTerms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleGoogleLogin = () => {
    const email = window.prompt("Sign in with Google\n\nEnter your college email address:");
    if (!email) return;
    
    if (!email.endsWith('@presidencyuniversity.in')) {
      toast.error('Only @presidencyuniversity.in emails are allowed.');
      return;
    }
    
    setForm(f => ({ ...f, email }));
    toast.success('Google account verified. Please complete the rest of the details.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        department: form.department,
        rollNo: form.rollNo,
        year: form.year,
      });
      toast.success('Account created! Welcome to FindIt 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left decorative */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-violet-500/20 hero-blob" />
          <div className="absolute bottom-20 left-20 w-56 h-56 bg-primary-500/20 hero-blob" style={{ animationDelay: '-3s' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <MapPin size={24} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white">FindIt</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join Your Campus<br />Lost & Found Network</h2>
          <p className="text-slate-300 text-base max-w-sm mx-auto leading-relaxed mb-8">
            Create your account and help make the campus community stronger.
          </p>
          <div className="space-y-3 text-left">
            {[
              'AI-powered item matching',
              'Instant match notifications',
              'Secure contact system',
              'Community-verified reports',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 text-sm text-white">
                <CheckCircle size={16} className="text-green-400 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface dark:bg-dark overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
        >
          <Link to="/" className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FindIt</span>
          </Link>

          <h1 className="text-2xl font-bold text-secondary dark:text-white mb-1">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Join FindIt with your college email</p>

          {/* Google (UI only -> Now mocked) */}
          <button type="button" onClick={handleGoogleLogin} className="w-full btn-secondary text-sm flex items-center justify-center gap-2 mb-5">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400">or fill in details</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="name" icon={User} placeholder="Jane Doe" form={form} handleChange={handleChange} errors={errors} />
              <Field label="College Email" name="email" type="email" icon={Mail} placeholder="jane@presidencyuniversity.in" form={form} handleChange={handleChange} errors={errors} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Field label="Roll No." name="rollNo" placeholder="2024BCSE001" form={form} handleChange={handleChange} errors={errors} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Field label="Phone Number" name="phone" type="tel" icon={Phone} placeholder="+91 98765 43210" form={form} handleChange={handleChange} errors={errors} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Department</label>
                <select name="department" value={form.department} onChange={handleChange}
                  className={`select-base ${errors.department ? 'input-error' : ''}`}>
                  <option value="">Select</option>
                  {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'MBA', 'Commerce', 'Arts', 'Science'].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {errors.department && <p className="text-xs text-danger mt-1">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Year</label>
                <select name="year" value={form.year} onChange={handleChange} className="select-base">
                  <option value="">Select</option>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG 1st Year', 'PG 2nd Year'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Field label="Password" name="password" type="password" icon={Lock} placeholder="••••••••" autoComplete="new-password" form={form} handleChange={handleChange} errors={errors} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Field label="Confirm Password" name="confirm" type="password" icon={Lock} placeholder="••••••••" autoComplete="new-password" form={form} handleChange={handleChange} errors={errors} />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 mt-0.5 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                I agree to the{' '}
                <Link to="/" className="text-primary-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-xs text-danger -mt-2 flex items-center gap-1"><AlertCircle size={11} />{errors.agreeTerms}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
