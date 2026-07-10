import { Link } from 'react-router-dom';
import { MapPin, Share2, Code, Network, Mail, Heart } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Browse Items',  to: '/search' },
    { label: 'Report Lost',   to: '/report/lost' },
    { label: 'Report Found',  to: '/report/found' },
    { label: 'Dashboard',     to: '/dashboard' },
  ],
  Support: [
    { label: 'How It Works',  to: '/#how-it-works' },
    { label: 'FAQ',           to: '/#faq' },
    { label: 'Contact Admin', to: '/search' },
    { label: 'Safety Tips',   to: '/search' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Use',   to: '/' },
    { label: 'Cookie Policy',  to: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary dark:bg-dark/80 text-slate-300 border-t border-slate-700">
      <div className="container-app py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <span className="text-white">FindIt</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              Helping students at Presidency University reconnect with their lost
              belongings through smart AI matching and a community-powered platform.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Share2,  href: '#', label: 'Twitter'  },
                { icon: Code,     href: '#', label: 'GitHub'   },
                { icon: Network, href: '#', label: 'LinkedIn' },
                { icon: Mail,     href: 'mailto:findit@presidency.edu', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 FindIt — Presidency University. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> by students, for students
          </p>
        </div>
      </div>
    </footer>
  );
}
