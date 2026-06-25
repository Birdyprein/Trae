import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();

  // 恢复滚动位置
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);
    if (savedPosition !== null) {
      const position = parseInt(savedPosition, 10);
      // 延迟恢复确保页面内容已渲染
      setTimeout(() => {
        window.scrollTo(0, position);
      }, 100);
    } else {
      // 首次访问滚动到顶部
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // 保存滚动位置
  useEffect(() => {
    const savePosition = () => {
      sessionStorage.setItem(`scroll_${location.pathname}`, String(window.scrollY));
    };

    // 监听滚动事件保存位置
    window.addEventListener('scroll', savePosition, { passive: true });

    // 组件卸载时保存位置
    return () => {
      window.removeEventListener('scroll', savePosition);
      sessionStorage.setItem(`scroll_${location.pathname}`, String(window.scrollY));
    };
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