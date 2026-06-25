import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, Star } from 'lucide-react';
import { useState } from 'react';
import { useWatchlistStore } from '@/stores/watchlistStore';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const watchlistCount = useWatchlistStore((s) => s.ids.length);

  const links = [
    { to: '/', label: '首页' },
    { to: '/funds', label: '基金列表' },
    { to: '/watchlist', label: '自选基金', icon: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-surface-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-gold-500 group-hover:text-gold-400 transition-colors" />
            <span className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
              睿盈<span className="text-gold-500">基金</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors py-1 flex items-center gap-1.5 ${
                  location.pathname === link.to
                    ? 'text-gold-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.icon && <Star className="w-4 h-4" />}
                {link.label}
                {link.icon && watchlistCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-gold-500 text-surface">
                    {watchlistCount}
                  </span>
                )}
                {location.pathname === link.to && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3 sm:pb-4 flex flex-col gap-2 sm:gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname === link.to
                    ? 'text-gold-400 bg-surface-hover'
                    : 'text-gray-300 hover:text-white hover:bg-surface-hover'
                }`}
              >
                {link.icon && <Star className="w-4 h-4" />}
                {link.label}
                {link.icon && watchlistCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-gold-500 text-surface">
                    {watchlistCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}