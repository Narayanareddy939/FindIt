import { createContext, useContext, useState, useCallback } from 'react';
import { mockItems, mockNotifications } from '../data/mockData';
import { clone, generateId } from '../utils/helpers';
import { findMatches } from '../utils/aiHelpers';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [items, setItems]               = useState(mockItems);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [bookmarks, setBookmarks]       = useState(['3']); // pre-bookmarked item IDs
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // ── Items ─────────────────────────────────────────────────────────────────
  const addItem = useCallback((itemData) => {
    const newItem = {
      ...itemData,
      id: generateId(),
      status: itemData.type,
      verified: false,
      views: 0,
      createdAt: new Date().toISOString(),
      reporter: {
        id: 'u1',
        name: 'Lakshmi Narayana Reddy',
        avatar: 'LN',
        email: 'lakshmi@presidency.edu',
        phone: '+91 9876543210',
      },
    };

    setItems((prev) => {
      const updated = [newItem, ...prev];
      // Auto-find matches and create notifications
      const matches = findMatches(newItem, prev);
      if (matches.length > 0 && matches[0].matchScore >= 70) {
        setNotifications((n) => [
          {
            id: `notif_${Date.now()}`,
            type: 'match',
            title: 'Possible Match Found! 🎯',
            message: `Your ${newItem.type} item "${newItem.title}" has a ${matches[0].matchScore}% match!`,
            time: 'just now',
            read: false,
            itemId: newItem.id,
            icon: 'zap',
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
          },
          ...n,
        ]);
      }
      return updated;
    });
    return newItem;
  }, []);

  const updateItemStatus = useCallback((id, status) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
  }, []);

  const getItemById = useCallback((id) => items.find((i) => i.id === id), [items]);

  // ── Bookmarks ─────────────────────────────────────────────────────────────
  const toggleBookmark = useCallback((itemId) => {
    setBookmarks((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  }, []);

  const isBookmarked = useCallback((itemId) => bookmarks.includes(itemId), [bookmarks]);

  const getBookmarkedItems = useCallback(
    () => items.filter((i) => bookmarks.includes(i.id)),
    [items, bookmarks],
  );

  // ── Recently Viewed ───────────────────────────────────────────────────────
  const markViewed = useCallback((itemId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== itemId);
      return [itemId, ...filtered].slice(0, 10);
    });
  }, []);

  const getRecentlyViewed = useCallback(
    () => items.filter((i) => recentlyViewed.includes(i.id)),
    [items, recentlyViewed],
  );

  // ── Notifications ─────────────────────────────────────────────────────────
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read: true } : n),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        items, addItem, updateItemStatus, getItemById,
        bookmarks, toggleBookmark, isBookmarked, getBookmarkedItems,
        recentlyViewed, markViewed, getRecentlyViewed,
        notifications, markNotificationRead, markAllRead, unreadCount,
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
