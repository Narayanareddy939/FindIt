import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  AlertCircle, Sparkles, Loader2, Upload, X, MapPin,
  Calendar, Clock, Phone, Mail, DollarSign,
  ChevronRight, CheckCircle, Zap, Info,
} from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../data/mockData';
import { detectCategory, enhanceDescription, extractKeywords, detectDuplicate } from '../../utils/aiHelpers';
import toast from 'react-hot-toast';

const STEPS = ['Item Details', 'Location & Date', 'Contact & Reward', 'Review & Submit'];

export default function ReportLost() {
  const navigate = useNavigate();
  const { items, addItem } = useApp();

  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const [images, setImages] = useState([]);
  const [keywords, setKeywords] = useState(null);

  const [form, setForm] = useState({
    title: '', category: '', description: '', location: '',
    date: '', time: '', reward: '', contactPhone: '', contactEmail: '',
    notes: '', holderName: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // Auto-detect category when title changes
    if (name === 'title' && value.length > 3) {
      const detected = detectCategory(value);
      if (detected !== 'others') {
        setForm((f) => ({ ...f, category: detected }));
      }
    }
  };

  // Image drop zone
  const onDrop = useCallback((accepted) => {
    const mapped = accepted.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...mapped].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
  });

  // AI enhance description
  const handleAIEnhance = async () => {
    if (!form.description.trim()) { toast.error('Enter a description first'); return; }
    setAiLoading(true);
    try {
      const enhanced = await enhanceDescription(form.description, form.category);
      setForm((f) => ({ ...f, description: enhanced }));
      const kw = extractKeywords(enhanced);
      setKeywords(kw);
      toast.success('✨ Description enhanced by AI!');
    } catch {
      toast.error('AI enhancement failed. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Step validation
  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.title.trim())    e.title    = 'Item name is required';
      if (!form.category)        e.category = 'Select a category';
      if (!form.description.trim()) e.description = 'Description is required';
    }
    if (step === 1) {
      if (!form.location) e.location = 'Location is required';
      if (!form.date)     e.date     = 'Date is required';
    }
    if (step === 2) {
      if (!form.contactPhone && !form.contactEmail) {
        e.contactPhone = 'At least one contact method is required';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    // Check duplicates at step 1
    if (step === 1) {
      const dup = detectDuplicate({ ...form, type: 'lost' }, items);
      if (dup.isDuplicate) {
        setDuplicate(dup);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const item = await addItem({
        ...form,
        type: 'lost',
        images: images.map((i) => i.preview),
        reward: form.reward || null,
      });
      toast.success('Lost item reported! 🔴 We\'ll notify you of matches.');
      navigate(`/item/${item.id || item._id}`);
    } catch (err) {
      console.error('Submit lost report failed:', err);
      toast.error('Unable to submit lost report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (name) => `input-base ${errors[name] ? 'input-error' : ''}`;

  return (
    <PageWrapper>
      <div className="container-app py-10 max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
            <span>Dashboard</span> <ChevronRight size={14} /> <span className="text-secondary dark:text-white font-medium">Report Lost Item</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary dark:text-white mb-1 flex items-center gap-2">
            <AlertCircle size={22} className="text-danger" />
            Report a Lost Item
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Fill in the details below. AI will help find matches automatically.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
          <div className="absolute top-4 left-0 h-0.5 bg-primary-600 z-0 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step ? 'bg-primary-600 border-primary-600 text-white'
                : i === step ? 'bg-white dark:bg-slate-800 border-primary-600 text-primary-600'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
              }`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-medium hidden sm:block ${i === step ? 'text-primary-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Duplicate Warning */}
        <AnimatePresence>
          {duplicate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-4 border-l-4 border-warning mb-6"
            >
              <div className="flex items-start gap-3">
                <Zap size={18} className="text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-secondary dark:text-white mb-1">Possible Duplicate Detected ({duplicate.score}% similar)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">A similar item was already reported. This might already be in our system.</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setDuplicate(null); setStep(2); }} className="text-xs btn-secondary py-1.5 px-3">Continue Anyway</button>
                    <button onClick={() => navigate(`/item/${duplicate.matchedItem.id}`)} className="text-xs btn-primary py-1.5 px-3">View Similar Item</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form card */}
        <div className="card p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {/* ── Step 0: Item Details ────────────────────────────────────── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Item Name <span className="text-danger">*</span>
                  </label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Student ID Card, AirPods Pro, Blue Wallet…"
                    className={inputCls('title')} />
                  {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
                  {form.category && (
                    <p className="text-xs text-primary-600 mt-1 flex items-center gap-1">
                      <Zap size={11} /> AI detected category: <strong>{CATEGORIES.find((c) => c.id === form.category)?.label}</strong>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Category <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all text-xs font-medium ${
                          form.category === cat.id
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-xs text-danger mt-1">{errors.category}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-secondary dark:text-slate-200">
                      Description <span className="text-danger">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAIEnhance}
                      disabled={aiLoading || !form.description.trim()}
                      className="ai-badge cursor-pointer hover:opacity-80 disabled:opacity-50 transition-opacity"
                    >
                      {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      {aiLoading ? 'Enhancing…' : '✨ AI Enhance'}
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your item: color, brand, distinguishing features, what it contains…"
                    className={inputCls('description')}
                  />
                  {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Info size={11} /> Click "AI Enhance" to improve your description automatically
                  </p>
                </div>

                {/* Keywords display */}
                {keywords && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 bg-violet-50/50 dark:bg-violet-900/10">
                    <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-2 flex items-center gap-1">
                      <Zap size={12} /> AI Extracted Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[...keywords.colors, ...keywords.brands, ...keywords.locations, ...keywords.numbers].map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Photos (up to 5)
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                      isDragActive
                        ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isDragActive ? 'Drop images here…' : 'Drag & drop or click to upload photos'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Max 5 images, 5MB each</p>
                  </div>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                          <img src={img.preview} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                            className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center"
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Location & Date ─────────────────────────────────── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Lost Location <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select name="location" value={form.location} onChange={handleChange}
                      className={`select-base pl-10 ${errors.location ? 'input-error' : ''}`}>
                      <option value="">Select campus location…</option>
                      {CAMPUS_LOCATIONS.map((loc) => <option key={loc}>{loc}</option>)}
                    </select>
                  </div>
                  {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                      Date Lost <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" name="date" value={form.date} onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`input-base pl-10 ${errors.date ? 'input-error' : ''}`} />
                    </div>
                    {errors.date && <p className="text-xs text-danger mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Approx. Time</label>
                    <div className="relative">
                      <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="time" name="time" value={form.time} onChange={handleChange} className="input-base pl-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Additional Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                    placeholder="Any other details that might help identify the item…"
                    className="input-base" />
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Contact & Reward ────────────────────────────────── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <Info size={13} className="shrink-0 mt-0.5" />
                    Your contact info is kept private. It's shared only when you accept a contact request from a finder.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`input-base pl-10 ${errors.contactPhone ? 'input-error' : ''}`} />
                  </div>
                  {errors.contactPhone && <p className="text-xs text-danger mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="contactEmail" value={form.contactEmail} onChange={handleChange}
                      placeholder="yourname@presidencyuniversity.in" type="email"
                      className="input-base pl-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Reward (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="reward" value={form.reward} onChange={handleChange}
                      placeholder="e.g. ₹500" className="input-base pl-10" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Offering a reward increases response rate significantly</p>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Review ──────────────────────────────────────────── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-semibold text-secondary dark:text-white mb-4">Review Your Report</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Item',        value: form.title },
                    { label: 'Category',    value: CATEGORIES.find((c) => c.id === form.category)?.label },
                    { label: 'Location',    value: form.location },
                    { label: 'Date',        value: form.date },
                    { label: 'Time',        value: form.time || 'Not specified' },
                    { label: 'Reward',      value: form.reward || 'None' },
                    { label: 'Contact',     value: form.contactPhone || form.contactEmail },
                    { label: 'Photos',      value: `${images.length} uploaded` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-sm text-slate-500 dark:text-slate-400 w-24 shrink-0">{label}</span>
                      <span className="text-sm font-medium text-secondary dark:text-white text-right flex-1">{value || '—'}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Description Preview</p>
                  <p className="text-sm text-secondary dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 leading-relaxed">{form.description}</p>
                </div>
                <div className="p-3.5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 flex items-start gap-2">
                  <CheckCircle size={15} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 dark:text-green-300">
                    After submission, AI will scan all found reports and notify you of any matches instantly.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="btn-secondary px-5 py-2.5 text-sm disabled:opacity-40"
            >
              ← Back
            </button>
            {step < 3 ? (
              <button onClick={nextStep} className="btn-primary px-6 py-2.5 text-sm">
                Next Step →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary px-8 py-2.5 text-sm">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Submitting…
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <AlertCircle size={14} /> Submit Lost Report
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
