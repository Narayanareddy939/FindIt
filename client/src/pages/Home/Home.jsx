import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, AlertCircle, CheckCircle2, ArrowRight, Zap,
  Users, Package, TrendingUp, Star, ChevronDown,
  Shield, Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/common/PageWrapper';
import ItemCard from '../../components/cards/ItemCard';
import StatCard from '../../components/cards/StatCard';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { mockStats, mockTestimonials, mockFAQs, mockItems } from '../../data/mockData';

/* ─── How It Works steps ─────────────────────────────────────────────────── */
const HOW_STEPS = [
  { icon: '📝', step: '01', title: 'Report Your Item', desc: 'Fill a quick form with item details, photos, and location. AI enhances your description automatically.' },
  { icon: '🤖', step: '02', title: 'AI Finds Matches', desc: 'Our smart engine scans all reports and calculates similarity scores between lost and found items.' },
  { icon: '🔔', step: '03', title: 'Get Notified Instantly', desc: 'When a match above 70% is found, both parties receive an instant notification with match details.' },
  { icon: '🤝', step: '04', title: 'Connect & Recover', desc: 'Contact the finder securely through FindIt. Verify, collect your item, and mark it as returned.' },
];

/* ─── FAQ Item ───────────────────────────────────────────────────────────── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="card overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-secondary dark:text-white text-sm pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Home Page ──────────────────────────────────────────────────────────── */
export default function Home() {
  const navigate      = useNavigate();
  const { items, loading }     = useApp();
  const { user }      = useAuth();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const displayItems = items.length > 0 ? items : mockItems;
  const recentLost  = displayItems.filter((i) => i.type === 'lost').slice(0, 4);
  const recentFound = displayItems.filter((i) => i.type === 'found').slice(0, 4);


  return (
    <PageWrapper>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-hero overflow-hidden min-h-[92vh] flex items-center">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/20 hero-blob opacity-50" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 hero-blob opacity-40" style={{ animationDelay: '-4s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-app relative z-10 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping-slow" />
              <Zap size={14} className="text-primary-400" />
              AI-Powered Smart Matching is Live
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6 text-balance"
            >
              Lost Something?
              <br />
              <span className="gradient-text">FindIt</span> Has You Covered
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10"
            >
              The smart campus Lost & Found platform for Presidency University.
              AI matches your lost items with found reports — instantly.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearch}
              className="flex gap-3 max-w-2xl mx-auto mb-8"
            >
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for wallets, AirPods, ID cards, keys…"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/15 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary px-6 py-4 rounded-2xl whitespace-nowrap">
                Search
              </button>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to={user ? '/report/lost' : '/signup'}
                className="btn-primary px-8 py-3.5 text-base rounded-2xl"
              >
                <AlertCircle size={18} />
                Report Lost Item
              </Link>
              <Link
                to={user ? '/report/found' : '/signup'}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition-all duration-300 text-base hover:scale-[1.02]"
              >
                <CheckCircle2 size={18} />
                Report Found Item
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 mt-12 text-slate-400 text-sm"
            >
              {[
                { icon: Shield,  text: 'Verified Reports' },
                { icon: Zap,     text: 'AI Powered' },
                { icon: Clock,   text: 'Real-time Alerts' },
                { icon: Users,   text: '3,200+ Students' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon size={14} className="text-primary-400" />
                  {text}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="section bg-white dark:bg-slate-900/40">
        <div className="container-app">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { value: mockStats.totalItems,    label: 'Total Reports',     icon: <Package size={22} className="text-white" />, color: 'from-blue-500 to-primary-600' },
              { value: mockStats.itemsFound,    label: 'Items Found',       icon: <CheckCircle2 size={22} className="text-white" />, color: 'from-emerald-500 to-green-600' },
              { value: mockStats.itemsReturned, label: 'Items Returned',    icon: <TrendingUp size={22} className="text-white" />, color: 'from-violet-500 to-purple-600' },
              { value: `${mockStats.successRate}%`, label: 'Success Rate', icon: <Star size={22} className="text-white fill-current" />, color: 'from-amber-500 to-orange-600' },
            ].map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="section bg-slate-50 dark:bg-dark/60">
        <div className="container-app">
          <div className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="ai-badge mb-4 inline-flex">✨ Simple Process</span>
              <h2 className="section-heading dark:text-white mb-4">How FindIt Works</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                From reporting to recovery in four simple steps. Our AI does the heavy lifting.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-violet-200 to-primary-200 dark:from-primary-900 dark:via-violet-900 dark:to-primary-900 z-0" />

            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 text-center relative z-10"
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="w-8 h-8 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                  {step.step}
                </div>
                <h3 className="font-bold text-secondary dark:text-white mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Lost Items ────────────────────────────────────────────── */}
      <section className="section bg-white dark:bg-slate-900/40">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-secondary dark:text-white">Recently Lost</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Help someone find their belongings</p>
            </div>
            <Link to="/search?type=lost" className="btn-ghost text-sm flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentLost.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Recently Found Items ───────────────────────────────────────────── */}
      <section className="section bg-slate-50 dark:bg-dark/60">
        <div className="container-app">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-secondary dark:text-white">Recently Found</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Is one of these yours?</p>
            </div>
            <Link to="/search?type=found" className="btn-ghost text-sm flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentFound.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Features Banner ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-app">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-hero p-10 lg:p-16 text-white">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="ai-badge mb-4 inline-flex">🤖 AI-Powered Features</span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                  Smarter Than a WhatsApp Group
                </h2>
                <p className="text-slate-300 text-base leading-relaxed mb-8">
                  FindIt uses AI to enhance your item description, auto-detect categories,
                  extract keywords, and calculate a smart similarity score between lost and found reports.
                </p>
                <Link to="/search" className="btn-primary bg-white text-primary-700 hover:bg-slate-100 hover:shadow-lg px-8 py-3.5">
                  Try It Now <ArrowRight size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { icon: '✍️', label: 'Description Enhancement', desc: '"Blue wallet" → AI rewrites with full detail' },
                  { icon: '🏷️', label: 'Auto Category Detection', desc: '"AirPods" → Electronics selected automatically' },
                  { icon: '🔍', label: 'Keyword Extraction', desc: 'Color, brand, type, location extracted instantly' },
                  { icon: '🎯', label: 'Smart Match Score', desc: '97% match → Instant notification to owner' },
                ].map((f) => (
                  <div key={f.label} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                    <span className="text-2xl">{f.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{f.label}</p>
                      <p className="text-xs text-slate-300 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="section bg-slate-50 dark:bg-dark/60">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="section-heading dark:text-white mb-3">What Students Say</h2>
            <p className="text-slate-500 dark:text-slate-400">Real stories from Presidency University campus</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockTestimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 card-hover"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-secondary dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                  <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">{t.item}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="section bg-white dark:bg-slate-900/40">
        <div className="container-app">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-heading dark:text-white mb-3">Frequently Asked Questions</h2>
              <p className="text-slate-500 dark:text-slate-400">Everything you need to know about FindIt</p>
            </div>
            <div className="space-y-3">
              {mockFAQs.map((faq, i) => (
                <FAQItem key={i} {...faq} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      {!user && (
        <section className="section bg-gradient-primary">
          <div className="container-app text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Find Your Lost Item?
              </h2>
              <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">
                Join 3,200+ Presidency University students using FindIt.
                Your item might already be waiting for you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/signup" className="bg-white text-primary-700 hover:bg-slate-100 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg inline-flex items-center gap-2">
                  Create Free Account <ArrowRight size={16} />
                </Link>
                <Link to="/search" className="border-2 border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2">
                  Browse Items
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
