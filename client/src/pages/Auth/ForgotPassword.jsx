import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { isValidEmail } from '../../utils/helpers';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError('Please enter a valid college email address.'); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to login
        </Link>

        <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-5 shadow-glow">
          <MapPin size={26} className="text-white" />
        </div>

        {!sent ? (
          <>
            <h1 className="text-2xl font-bold text-secondary dark:text-white mb-2">Reset Password</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Enter your college email and we'll send a password reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">College Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="yourname@presidencyuniversity.in"
                    className={`input-base pl-10 ${error ? 'input-error' : ''}`}
                  />
                </div>
                {error && <p className="text-xs text-danger mt-1">{error}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-secondary dark:text-white mb-3">Check Your Email</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              We've sent a password reset link to <strong className="text-secondary dark:text-white">{email}</strong>.
              Please check your inbox.
            </p>
            <Link to="/login" className="btn-primary w-full">Back to Login</Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
