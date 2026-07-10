import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  CheckCircle2, Sparkles, Loader2, Upload, X, MapPin,
  Calendar, Clock, Phone, User, ChevronRight, CheckCircle, Zap, Info,
} from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../data/mockData';
import { detectCategory, enhanceDescription, extractKeywords } from '../../utils/aiHelpers';
import toast from 'react-hot-toast';

const STEPS = ['Item Details', 'Location & Date', 'Your Info', 'Review & Submit'];

export default function ReportFound() {
  const navigate = useNavigate();
  const { addItem } = useApp();

  const [step, setStep]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [keywords, setKeywords] = useState(null);

  const [form, setForm] = useState({
    title: '', category: '', description: '', location: '',
    date: '', time: '', contactPhone: '', holderName: '', notes: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'title' && value.length > 3) {
      const detected = detectCategory(value);
      if (detected !== 'others') setForm((f) => ({ ...f, category: detected }));
    }
  };

  const onDrop = useCallback((accepted) => {
    const mapped = accepted.map((file) => ({ file, preview: URL.createObjectURL(file), name: file.name }));
    setImages((prev) => [...prev, ...mapped].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
  });

  const handleAIEnhance = async () => {
    if (!form.description.trim()) { toast.error('Enter a description first'); return; }
    setAiLoading(true);
    try {
      const enhanced = await enhanceDescription(form.description, form.category);
      setForm((f) => ({ ...f, description: enhanced }));
      setKeywords(extractKeywords(enhanced));
      toast.success('✨ Description enhanced by AI!');
    } finally { setAiLoading(false); }
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.title.trim())       e.title       = 'Item name is required';
      if (!form.category)           e.category    = 'Select a category';
      if (!form.description.trim()) e.description = 'Description is required';
    }
    if (step === 1) {
      if (!form.location) e.location = 'Location is required';
      if (!form.date)     e.date     = 'Date is required';
    }
    if (step === 2) {
      if (!form.contactPhone) e.contactPhone = 'Contact number is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, 3)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const item = await addItem({
        ...form,
        type: 'found',
        images: images.map((i) => i.preview),
      });
      toast.success('Found item reported! 🟢 The owner will be notified.');
      navigate(`/item/${item.id || item._id}`);
    } catch (err) {
      console.error('Submit found report failed:', err);
      toast.error('Unable to submit found report. Please try again.');
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
            <span>Dashboard</span> <ChevronRight size={14} /> <span className="text-secondary dark:text-white font-medium">Report Found Item</span>
          </div>
          <h1 className="text-2xl font-bold text-secondary dark:text-white mb-1 flex items-center gap-2">
            <CheckCircle2 size={22} className="text-success" />
            Report a Found Item
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Help someone find their belongings. AI will match this with lost reports.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
          <div className="absolute top-4 left-0 h-0.5 bg-success z-0 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < step ? 'bg-success border-success text-white'
                : i === step ? 'bg-white dark:bg-slate-800 border-success text-success'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
              }`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-xs mt-1.5 font-medium hidden sm:block ${i === step ? 'text-success' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="card p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Item Name <span className="text-danger">*</span>
                  </label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Student ID Card, Black Wallet, Key Ring…"
                    className={inputCls('title')} />
                  {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
                  {form.category && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Zap size={11} /> AI detected: <strong>{CATEGORIES.find((c) => c.id === form.category)?.label}</strong>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Category <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.id} type="button"
                        onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                          form.category === cat.id
                            ? 'border-success bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-slate-200 dark:border-slate-700 hover:border-green-300 text-slate-600 dark:text-slate-300'
                        }`}>
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
                    <button type="button" onClick={handleAIEnhance} disabled={aiLoading || !form.description.trim()}
                      className="ai-badge cursor-pointer hover:opacity-80 disabled:opacity-50">
                      {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                      {aiLoading ? 'Enhancing…' : '✨ AI Enhance'}
                    </button>
                  </div>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                    placeholder="Describe the found item: color, size, brand, contents, condition…"
                    className={inputCls('description')} />
                  {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
                </div>

                {keywords && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 bg-green-50/50 dark:bg-green-900/10">
                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-1">
                      <Zap size={12} /> AI Keywords Extracted
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[...keywords.colors, ...keywords.brands, ...keywords.locations].map((kw) => (
                        <span key={kw} className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">{kw}</span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Photos (up to 5)</label>
                  <div {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragActive ? 'border-success bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-green-300'
                    }`}>
                    <input {...getInputProps()} />
                    <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {isDragActive ? 'Drop images here…' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Photos greatly increase the chance of the owner recognizing it</p>
                  </div>
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                          <img src={img.preview} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => setImages((p) => p.filter((_, j) => j !== i))}
                            className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                            <X size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Found Location <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <select name="location" value={form.location} onChange={handleChange}
                      className={`select-base pl-10 ${errors.location ? 'input-error' : ''}`}>
                      <option value="">Select where you found it…</option>
                      {CAMPUS_LOCATIONS.map((loc) => <option key={loc}>{loc}</option>)}
                    </select>
                  </div>
                  {errors.location && <p className="text-xs text-danger mt-1">{errors.location}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Date Found <span className="text-danger">*</span></label>
                    <div className="relative">
                      <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" name="date" value={form.date} onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className={`input-base pl-10 ${errors.date ? 'input-error' : ''}`} />
                    </div>
                    {errors.date && <p className="text-xs text-danger mt-1">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Time Found</label>
                    <div className="relative">
                      <Clock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="time" name="time" value={form.time} onChange={handleChange} className="input-base pl-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Additional Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                    placeholder="Current storage location, condition, anything else…"
                    className="input-base" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2">
                    <Info size={13} className="shrink-0 mt-0.5" />
                    Thank you for being a Good Samaritan! Your details are kept private and shared securely through FindIt messaging.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">Your Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="holderName" value={form.holderName} onChange={handleChange}
                      placeholder="Your name (visible to item owner)"
                      className="input-base pl-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary dark:text-slate-200 mb-1.5">
                    Contact Number <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={`input-base pl-10 ${errors.contactPhone ? 'input-error' : ''}`} />
                  </div>
                  {errors.contactPhone && <p className="text-xs text-danger mt-1">{errors.contactPhone}</p>}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="font-semibold text-secondary dark:text-white mb-4">Review Your Found Report</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Item',      value: form.title },
                    { label: 'Category',  value: CATEGORIES.find((c) => c.id === form.category)?.label },
                    { label: 'Location',  value: form.location },
                    { label: 'Date',      value: form.date },
                    { label: 'Time',      value: form.time || 'Not specified' },
                    { label: 'Contact',   value: form.contactPhone },
                    { label: 'Photos',    value: `${images.length} uploaded` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="text-sm text-slate-500 dark:text-slate-400 w-24 shrink-0">{label}</span>
                      <span className="text-sm font-medium text-secondary dark:text-white text-right">{value || '—'}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3.5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 flex items-start gap-2">
                  <CheckCircle size={15} className="text-success shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 dark:text-green-300">
                    After submission, AI will scan lost reports and notify the owner if we find a match. You're making a difference! 🌟
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button onClick={prevStep} disabled={step === 0} className="btn-secondary px-5 py-2.5 text-sm disabled:opacity-40">
              ← Back
            </button>
            {step < 3 ? (
              <button onClick={nextStep} className="bg-success text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm flex items-center gap-1.5">
                Next Step →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="bg-success text-white font-semibold px-8 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm flex items-center gap-1.5 disabled:opacity-50">
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                ) : (
                  <><CheckCircle2 size={14} /> Submit Found Report</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
