import { motion } from 'framer-motion';
import { fmt } from '../../utils/helpers';

/**
 * StatCard — Animated statistic display card for homepage and dashboard
 */
export default function StatCard({ value, label, icon, color = 'from-primary-500 to-primary-600', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'backOut' }}
      className="glass-card p-6 text-center group hover:shadow-card-hover transition-all duration-300"
    >
      <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <p className="text-2xl lg:text-3xl font-bold text-secondary dark:text-white mb-1">
        {typeof value === 'number' ? fmt(value) : value}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
}
