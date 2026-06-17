import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface Accessory {
  name: string;
  category: string;
  price: string;
  gradient: string;
}

const accessories: Accessory[] = [
  {
    name: "HUAWEI Watch GT 5",
    category: "智能手表",
    price: "1,488 起",
    gradient: "from-amber-600/30 to-yellow-500/10",
  },
  {
    name: "HUAWEI FreeBuds Pro 4",
    category: "真无线耳机",
    price: "1,199 起",
    gradient: "from-slate-500/30 to-zinc-600/10",
  },
  {
    name: "HUAWEI MatePad Pro",
    category: "平板电脑",
    price: "3,999 起",
    gradient: "from-sky-500/30 to-blue-600/10",
  },
  {
    name: "HUAWEI MateBook X Pro",
    category: "笔记本电脑",
    price: "8,999 起",
    gradient: "from-zinc-500/30 to-gray-600/10",
  },
];

export default function Accessories() {
  return (
    <section className="py-24 md:py-32 bg-[var(--surface)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
              更多选择
            </h2>
            <p className="text-[var(--text-secondary)] mt-3 max-w-[400px]">
              手表、耳机、平板、笔记本，构建全场景智慧生活
            </p>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium"
          >
            查看全部
            <ArrowRight size={16} weight="bold" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accessories.map((item) => (
            <a
              key={item.name}
              href="#"
              className="group rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] overflow-hidden hover:border-[var(--border)]/80 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Image placeholder */}
              <div className="h-40 flex items-center justify-center relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-30 group-hover:opacity-50 transition-opacity`} />
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/15" />
                </div>
              </div>

              {/* Text */}
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                  {item.category}
                </p>
                <h3 className="text-sm font-semibold text-white mt-1 group-hover:text-[var(--accent)] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {item.price}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 md:hidden">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-[var(--accent)] font-medium"
          >
            查看全部
            <ArrowRight size={16} weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
}