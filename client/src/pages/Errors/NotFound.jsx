import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="text-8xl mb-6">🔍</div>
          <h1 className="text-6xl font-black text-slate-200 dark:text-slate-700 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-secondary dark:text-white mb-3">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto mb-8">
            Just like a lost item, this page seems to be missing. It might have been moved, deleted, or you may have mistyped the URL.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary px-6 py-3 gap-2">
              <Home size={16} /> Back to Home
            </Link>
            <Link to="/search" className="btn-secondary px-6 py-3 gap-2">
              <Search size={16} /> Browse Items
            </Link>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
