import { motion } from 'framer-motion';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../components/common/PageWrapper';
import ItemCard from '../../components/cards/ItemCard';
import { useApp } from '../../context/AppContext';

export default function Bookmarks() {
  const { getBookmarkedItems } = useApp();
  const bookmarked = getBookmarkedItems();

  return (
    <PageWrapper>
      <div className="container-app py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary dark:text-white flex items-center gap-2">
            <Bookmark size={22} className="text-primary-600 fill-primary-100" /> Bookmarks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {bookmarked.length} saved item{bookmarked.length !== 1 ? 's' : ''}
          </p>
        </div>

        {bookmarked.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Bookmark size={36} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">No Bookmarks Yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Save items by clicking the bookmark icon on any item card. Quickly access them here.
            </p>
            <Link to="/search" className="btn-primary px-6 py-3 inline-flex items-center gap-2">
              Browse Items <ArrowRight size={15} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bookmarked.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
