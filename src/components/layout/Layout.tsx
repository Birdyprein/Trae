import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import Navbar from './Navbar';
import Footer from './Footer';

const SCROLL_STORAGE_KEY = 'fund-layout-scroll';

/**
 * 全局布局
 * - 包含 AnimatedBackground、Navbar、Outlet、Footer
 * - 滚动位置管理：使用 sessionStorage 保存/恢复滚动位置
 * - main 区域有 pt-14 sm:pt-16 给导航栏留空间
 */
const EXCLUDED_PATHS = ['/funds'];

const Layout: React.FC = () => {
  const location = useLocation();

  // 禁用浏览器默认滚动恢复，避免与手动恢复冲突
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // 路由切换时恢复该路径的滚动位置（基金列表页自行管理，不参与）
  useEffect(() => {
    const restoreScroll = () => {
      try {
        if (EXCLUDED_PATHS.includes(location.pathname)) return;
        const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
        if (!raw) return;
        const map: Record<string, number> = JSON.parse(raw);
        const saved = map[location.pathname] ?? 0;
        window.scrollTo({ top: saved, left: 0, behavior: 'instant' as ScrollBehavior });
      } catch {
        // 忽略解析错误
      }
    };

    // 等待内容渲染后再恢复滚动位置
    const rafId = requestAnimationFrame(restoreScroll);
    return () => cancelAnimationFrame(rafId);
  }, [location.pathname]);

  // 离开页面 / 路由变化前保存当前滚动位置（基金列表页自行管理，不参与）
  useEffect(() => {
    const handleSaveScroll = () => {
      try {
        if (EXCLUDED_PATHS.includes(location.pathname)) return;
        const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
        const map: Record<string, number> = raw ? JSON.parse(raw) : {};
        map[location.pathname] = window.scrollY ?? 0;
        sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(map));
      } catch {
        // 忽略写入错误
      }
    };

    // 页面隐藏（路由切换前的最佳时机）保存
    window.addEventListener('pagehide', handleSaveScroll);

    // 路由变化时也保存一次（在 pathname 变化的 effect 中先存再切）
    return () => {
      handleSaveScroll();
      window.removeEventListener('pagehide', handleSaveScroll);
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <AnimatedBackground />

      <Navbar />

      <main className="flex-1 pt-14 sm:pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
