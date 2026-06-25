import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

// 用于保存每个路由的滚动位置
const scrollPositions: Record<string, number> = {};

export default function Layout() {
  const location = useLocation();

  // 监听路由变化，保存当前滚动位置并恢复新页面的滚动位置
  useEffect(() => {
    // 保存当前页面的滚动位置
    const currentPath = location.pathname;
    scrollPositions[currentPath] = window.scrollY;

    // 恢复之前保存的滚动位置（如果有）
    const savedPosition = scrollPositions[currentPath];
    if (savedPosition !== undefined) {
      // 稍微延迟以确保页面已渲染
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      // 新页面默认滚动到顶部
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14 sm:pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}