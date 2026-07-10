import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon, SlidersHorizontal, X, ChevronDown, Grid3x3,
  List, ArrowUpDown, Package,
} from 'lucide-react';
import PageWrapper from '../../components/common/PageWrapper';
import ItemCard from '../../components/cards/ItemCard';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../../data/mockData';
import { debounce } from '../../utils/helpers';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'oldest',    label: 'Oldest First' },
  { value: 'relevance', label: 'Most Relevant' },
];

// Skeleton loader for items
function ItemSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3] rounded-t-2xl rounded-b-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-5 w-16" />
        </div>
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const { items } = useApp();

  const [query,      setQuery]      = useState(searchParams.get('q') || '');
  const [debouncedQ, setDebouncedQ] = useState(query);
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [catFilter,  setCatFilter]  = useState('all');
  const [sortBy,     setSortBy]     = useState('newest');
  const [viewMode,   setViewMode]   = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading,    setLoading]    = useState(false);

  // Debounce search
  const handleQueryChange = useMemo(
    () =>
      debounce((val) => {
        setDebouncedQ(val);
        setLoading(false);
      }, 400),
    [],
  );

  const onQueryChange = (e) => {
    setQuery(e.target.value);
    setLoading(true);
    handleQueryChange(e.target.value);
  };

  // Filtered + sorted items
  const results = useMemo(() => {
    let filtered = [...items];

    if (typeFilter !== 'all') {
      filtered = filtered.filter((i) => i.type === typeFilter || i.status === typeFilter);
    }
    if (catFilter !== 'all') {
      filtered = filtered.filter((i) => i.category === catFilter);
    }
    if (debouncedQ.trim()) {
      const q = debouncedQ.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          i.reporter?.name?.toLowerCase().includes(q) ||
          CATEGORIES.find((c) => c.id === i.category)?.label.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case 'newest':    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'oldest':    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'relevance': filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)); break;
    }

    return filtered;
  }, [items, typeFilter, catFilter, sortBy, debouncedQ]);

  const clearFilters = () => {
    setQuery('');
    setDebouncedQ('');
    setTypeFilter('all');
    setCatFilter('all');
    setSortBy('newest');
  };

  const hasFilters = typeFilter !== 'all' || catFilter !== 'all' || debouncedQ;

  return (
    <PageWrapper>
      <div className="container-app py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary dark:text-white mb-1">Search Items</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {results.length} item{results.length !== 1 ? 's' : ''} found
            {debouncedQ && <span> for "<strong>{debouncedQ}</strong>"</span>}
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={onQueryChange}
              placeholder="Search by item name, keyword, location, owner…"
              className="input-base pl-12 pr-10"
              autoFocus
            />
            {query && (
              <button onClick={() => { setQuery(''); setDebouncedQ(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`btn-secondary px-4 gap-2 ${filtersOpen ? 'border-primary-300 text-primary-600' : ''}`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="card p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Type filter */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-2 uppercase tracking-wide">Status</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { value: 'all',      label: 'All' },
                        { value: 'lost',     label: '🔴 Lost' },
                        { value: 'found',    label: '🟢 Found' },
                        { value: 'returned', label: '🔵 Returned' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setTypeFilter(value)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                            typeFilter === value
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-300'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category filter */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-2 uppercase tracking-wide">Category</label>
                    <select
                      value={catFilter}
                      onChange={(e) => setCatFilter(e.target.value)}
                      className="select-base text-sm py-2"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-semibold text-secondary dark:text-slate-300 mb-2 uppercase tracking-wide">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="select-base text-sm py-2"
                    >
                      {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 text-xs text-danger hover:underline flex items-center gap-1">
                    <X size={12} /> Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category quick-filter pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setCatFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
              catFilter === 'all'
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400'
            }`}
          >
            All
          </button>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCatFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
                catFilter === cat.id
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary-400'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* View toggle + count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <strong className="text-secondary dark:text-white">{results.length}</strong> results
          </p>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400'}`}
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-slate-400'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <ItemSkeleton key={i} />)}
          </div>
        ) : results.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'space-y-4'
          }>
            {results.map((item, i) => (
              <ItemCard key={item.id || item._id} item={item} index={i} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Package size={36} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-secondary dark:text-white mb-2">No Items Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              {debouncedQ
                ? `No results for "${debouncedQ}". Try different keywords or remove filters.`
                : 'No items match the current filters. Try adjusting your search.'}
            </p>
            <button onClick={clearFilters} className="btn-primary px-6 py-2.5 text-sm">
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
