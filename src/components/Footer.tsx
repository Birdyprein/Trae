export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} 睿盈基金. 数据仅供参考，不构成投资建议.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <button type="button" className="hover:text-gray-300 cursor-pointer transition-colors bg-transparent border-none p-0">关于我们</button>
            <button type="button" className="hover:text-gray-300 cursor-pointer transition-colors bg-transparent border-none p-0">风险提示</button>
            <button type="button" className="hover:text-gray-300 cursor-pointer transition-colors bg-transparent border-none p-0">隐私政策</button>
          </div>
        </div>
      </div>
    </footer>
  );
}