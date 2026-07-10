import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home          from './pages/Home/Home';
import Login         from './pages/Auth/Login';
import Signup        from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard     from './pages/Dashboard/Dashboard';
import ReportLost    from './pages/ReportLost/ReportLost';
import ReportFound   from './pages/ReportFound/ReportFound';
import Search        from './pages/Search/Search';
import ItemDetails   from './pages/ItemDetails/ItemDetails';
import Notifications from './pages/Notifications/Notifications';
import Bookmarks     from './pages/Bookmarks/Bookmarks';
import Profile       from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import NotFound      from './pages/Errors/NotFound';

// Route guard
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  const location = useLocation();

  // Pages that should not show the main navbar/footer
  const authPages = ['/login', '/signup', '/forgot-password'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-surface dark:bg-dark flex flex-col transition-colors duration-300">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"               element={<Home />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/signup"         element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/search"         element={<Search />} />
            <Route path="/item/:id"       element={<ItemDetails />} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"      element={<Dashboard />} />
              <Route path="/report/lost"    element={<ReportLost />} />
              <Route path="/report/found"   element={<ReportFound />} />
              <Route path="/notifications"  element={<Notifications />} />
              <Route path="/bookmarks"      element={<Bookmarks />} />
              <Route path="/profile"        element={<Profile />} />
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}
