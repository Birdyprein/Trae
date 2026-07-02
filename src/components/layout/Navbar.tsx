import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { TrendingUp, Menu, X, Search } from 'lucide-react';

interface NavbarProps {
  /** 移动端搜索回调（可选） */
  onSearch?: (value: string) => void;
}

interface NavItem {
  to: string;
  label: string;
}

const NAV_ITEMS = [
  { to: '/', label: '首页' },
  { to: '/funds', label: '基金' },
  { to: '/watchlist', label: '自选' },
  { to: '/compare', label: '对比' },
  { to: '/portfolio', label: '持仓' },
];

/**
 * 玻璃态导航栏
 * - glass-nav 类，固定顶部
 * - Logo + 导航链接
 * - 搜索框（glass-input）
 * - 响应式：手机端汉堡菜单
 */
const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      // 默认跳转到基金列表并带关键词
      navigate(`/funds?q=${encodeURIComponent(trimmed)}`);
    }
    setMobileOpen(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'px-3 py-1.5 text-sm rounded-lg transition-colors whitespace-nowrap',
      isActive
        ? 'text-gold-300 bg-[rgb(40,40,55)]'
        : 'text-secondary hover:text-white hover:bg-[rgb(30,30,45)]',
    ].join(' ');

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-40">
      <div className="section-container bg-black">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-300 to-gold-600 flex items-center justify-center">
              <TrendingUp size={18} className="text-black" />
            </span>
            <span className="text-base sm:text-lg font-medium gradient-text-gold hidden sm:inline">
              基金分析平台
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* 桌面端搜索框 */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative flex-1 max-w-xs"
            role="search"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="搜索基金代码 / 名称..."
              className="glass-input w-full pl-9 pr-3 py-1.5 text-sm"
              aria-label="搜索基金"
            />
          </form>

          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            className="md:hidden glass-button p-2 text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* 移动端展开菜单 */}
        {mobileOpen ? (
          <div className="md:hidden pb-3 animate-slide-up">
            <form
              onSubmit={handleSearchSubmit}
              className="relative mb-2"
              role="search"
            >
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="搜索基金代码 / 名称..."
                className="glass-input w-full pl-9 pr-3 py-2 text-sm"
                aria-label="搜索基金"
                autoFocus
              />
            </form>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={linkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
