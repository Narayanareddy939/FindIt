import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

/* ── Notification normalizer ─────────────────────────────────────────────── */
const NOTIF_META = {
  match:    { icon: 'zap',            bg: 'bg-green-50 dark:bg-green-900/20',   color: 'text-green-500' },
  approved: { icon: 'check-circle',   bg: 'bg-blue-50 dark:bg-blue-900/20',    color: 'text-blue-500' },
  comment:  { icon: 'message-circle', bg: 'bg-purple-50 dark:bg-purple-900/20',color: 'text-purple-500' },
  returned: { icon: 'package-check',  bg: 'bg-emerald-50 dark:bg-emerald-900/20', color: 'text-emerald-500' },
  system:   { icon: 'zap',            bg: 'bg-slate-50 dark:bg-slate-800',      color: 'text-slate-500' },
};

const normalizeNotification = (n) => {
  if (!n) return n;
  const meta = NOTIF_META[n.type] || NOTIF_META.system;
  const id = n.id || n._id;
  return {
    ...n,
    id,
    _id: n._id || id,
    icon: n.icon || meta.icon,
    bg: n.bg || meta.bg,
    color: n.color || meta.color,
    itemId: n.itemId || n.relatedItem,
    time: n.time || (n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'),
  };
};


export const AppProvider = ({ children }) => {
  const { api, user } = useAuth();
  const [items, setItems]                   = useState([]);
  const [notifications, setNotifications]   = useState([]);
  const [bookmarks, setBookmarks]           = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  const normalizeItem = useCallback((item) => {
    if (!item) return item;

    const reporter = item.reporter && typeof item.reporter === 'object'
      ? {
          ...item.reporter,
          id: item.reporter.id || item.reporter._id,
          _id: item.reporter._id || item.reporter.id,
        }
      : item.reporter;

    // Normalize images: backend stores as [{url, publicId}], frontend expects string[]
    const images = (item.images || []).map((img) =>
      typeof img === 'string' ? img : img?.url || img
    ).filter(Boolean);

    return {
      ...item,
      id: item.id || item._id,
      _id: item._id || item.id,
      reporter,
      images,
    };
  }, []);

  /* ── Items ─────────────────────────────────────────────────────────────── */
  const fetchItems = useCallback(async (query = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/items', { params: query });
      if (response.data.success) {
        const normalizedItems = (response.data.data || []).map(normalizeItem);
        setItems(normalizedItems);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch items';
      setError(message);
      console.error('Fetch items failed:', message);
    } finally {
      setLoading(false);
    }
  }, [api, normalizeItem]);

  const addItem = useCallback(async (itemData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/items', itemData);
      if (response.data.success) {
        setItems((prev) => [normalizeItem(response.data.data), ...prev]);
        return response.data.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to add item';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [api, normalizeItem]);

  const updateItem = useCallback(async (id, itemData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/items/${id}`, itemData);
      if (response.data.success) {
        setItems((prev) => prev.map((i) => (i._id === id || i.id === id ? normalizeItem(response.data.data) : i)));
        return response.data.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update item';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [api, normalizeItem]);

  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.delete(`/items/${id}`);
      if (response.data.success) {
        setItems((prev) => prev.filter((i) => i._id !== id && i.id !== id));
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to delete item';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateItemStatus = useCallback(async (id, status) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/items/${id}/status`, { status });
      if (response.data.success) {
        setItems((prev) => prev.map((item) => (item._id === id || item.id === id ? normalizeItem(response.data.data) : item)));
      }
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update status';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [api, normalizeItem]);

  const getItemById = useCallback((id) => items.find((i) => i._id === id || i.id === id || i._id?.toString() === id || i.id?.toString() === id), [items]);

  const uploadImages = useCallback(async (formData) => {
    try {
      setError(null);
      const response = await api.post('/items/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Upload failed';
      setError(message);
      throw new Error(message);
    }
  }, [api]);

  /* ── Bookmarks ─────────────────────────────────────────────────────────── */
  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await api.get('/items/user/bookmarks');
      if (response.data.success) {
        setBookmarks(response.data.data.map((b) => b._id));
      }
    } catch (err) {
      console.error('Fetch bookmarks failed:', err.message);
    }
  }, [api]);

  const toggleBookmark = useCallback(async (itemId) => {
    try {
      setError(null);
      const response = await api.post(`/items/${itemId}/bookmark`);
      if (response.data.success) {
        setBookmarks(response.data.data);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Bookmark failed';
      setError(message);
      console.error('Bookmark failed:', message);
    }
  }, [api]);

  const isBookmarked = useCallback((itemId) => bookmarks.includes(itemId), [bookmarks]);

  const getBookmarkedItems = useCallback(
    () => items.filter((i) => bookmarks.includes(i._id) || bookmarks.includes(i.id)),
    [items, bookmarks],
  );

  /* ── Recently Viewed ───────────────────────────────────────────────────── */
  const markViewed = useCallback((itemId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== itemId);
      return [itemId, ...filtered].slice(0, 8);
    });
  }, []);

  const getRecentlyViewed = useCallback(
    () =>
      recentlyViewed
        .map((id) => items.find((i) => i._id === id))
        .filter(Boolean),
    [items, recentlyViewed],
  );

  /* ── Notifications ─────────────────────────────────────────────────────── */
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications((response.data.data || []).map(normalizeNotification));
      }
    } catch (err) {
      console.error('Fetch notifications failed:', err.message);
    }
  }, [api]);

  const markNotificationRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id || n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Mark read failed:', err.message);
    }
  }, [api]);

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read/all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark all read failed:', err.message);
    }
  }, [api]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch items on mount for public browsing and user-specific data when signed in
  useEffect(() => {
    fetchItems();
    if (user) {
      fetchNotifications();
      fetchBookmarks();
    }
  }, [user, fetchItems, fetchNotifications, fetchBookmarks]);

  return (
    <AppContext.Provider
      value={{
        items, fetchItems, addItem, updateItem, deleteItem, updateItemStatus, getItemById, uploadImages, loading, error,
        bookmarks, toggleBookmark, isBookmarked, getBookmarkedItems,
        recentlyViewed, markViewed, getRecentlyViewed,
        notifications, fetchNotifications, markNotificationRead, markAllRead, unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
