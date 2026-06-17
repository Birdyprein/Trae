interface Spec {
  label: string;
  value: string;
}

const specs: Spec[] = [
  { label: "处理器", value: "麒麟 9100" },
  { label: "操作系统", value: "HarmonyOS NEXT" },
  { label: "屏幕", value: "6.82 英寸 OLED LTPO" },
  { label: "分辨率", value: "2720 x 1260 像素" },
  { label: "刷新率", value: "1-120Hz 自适应" },
  { label: "主摄像头", value: "50MP 超感知 + 40MP 超广角 + 48MP 长焦" },
  { label: "前置摄像头", value: "13MP + 3D 深感" },
  { label: "电池", value: "5800mAh" },
  { label: "充电", value: "100W 有线 + 80W 无线" },
  { label: "存储", value: "12GB + 256GB / 512GB / 1TB" },
  { label: "防护", value: "IP68 防尘抗水" },
  { label: "重量", value: "约 225g" },
];

export default function Specs() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: text */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
              技术规格
            </h2>
            <p className="text-[var(--text-secondary)] mt-3 max-w-[400px]">
              旗舰配置，不妥协的性能表现
            </p>

            {/* Quick highlights */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
                <p className="text-2xl font-bold text-white font-mono">100W</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">有线快充</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
                <p className="text-2xl font-bold text-white font-mono">120Hz</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">自适应刷新</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
                <p className="text-2xl font-bold text-white font-mono">IP68</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">防尘抗水</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5">
                <p className="text-2xl font-bold text-white font-mono">1TB</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">最大存储</p>
              </div>
            </div>
          </div>

          {/* Right: spec list */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <span className="text-sm text-[var(--text-secondary)]">{spec.label}</span>
                  <span className="text-sm text-white font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}