import { Globe, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

const footerLinks = {
  "产品": ["智能手机", "平板电脑", "笔记本电脑", "穿戴设备", "音频产品", "路由器"],
  "服务": ["华为商城", "以旧换新", "服务与支持", "零售店", "企业购"],
  "关于": ["关于华为", "新闻中心", "联系我们", "隐私政策", "用户协议"],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="text-xl font-bold text-white tracking-tight">
              <span className="text-[var(--accent)]">HUAWEI</span>
            </a>
            <p className="text-sm text-[var(--text-secondary)] mt-4 max-w-[200px]">
              构建万物互联的智能世界
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-white mb-4">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-secondary)]">
            HUAWEI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors rounded-full hover:bg-[var(--surface)]">
              <Globe size={18} weight="regular" />
            </a>
            <a href="#" className="p-2 text-[var(--text-secondary)] hover:text-white transition-colors rounded-full hover:bg-[var(--surface)]">
              <EnvelopeSimple size={18} weight="regular" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}