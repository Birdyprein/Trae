import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

interface Product {
  name: string;
  tagline: string;
  color: string;
  gradient: string;
  href: string;
}

const products: Product[] = [
  {
    name: "HUAWEI Mate 70 Pro+",
    tagline: "致敬卓越",
    color: "from-amber-500/30 to-orange-600/10",
    gradient: "bg-gradient-to-br from-amber-500/10 via-transparent to-orange-600/5",
    href: "#",
  },
  {
    name: "HUAWEI Pura 80 Ultra",
    tagline: "瞬间美学",
    color: "from-violet-500/30 to-purple-600/10",
    gradient: "bg-gradient-to-br from-violet-500/10 via-transparent to-purple-600/5",
    href: "#",
  },
  {
    name: "HUAWEI Mate X6",
    tagline: "折叠新生",
    color: "from-sky-500/30 to-blue-600/10",
    gradient: "bg-gradient-to-br from-sky-500/10 via-transparent to-blue-600/5",
    href: "#",
  },
  {
    name: "HUAWEI nova 14 Pro",
    tagline: "出色，够青春",
    color: "from-emerald-500/30 to-teal-600/10",
    gradient: "bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-600/5",
    href: "#",
  },
];

export default function ProductLineup() {
  return (
    <section id="phones" className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white">
            探索全部产品
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-[480px]">
            从旗舰到折叠，从影像到青春，总有一款适合你
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <a
              key={product.name}
              href={product.href}
              className="group relative rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border)]/80 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Product image placeholder */}
              <div className="relative h-64 flex items-center justify-center">
                <div className={`w-32 h-48 rounded-2xl bg-gradient-to-b ${product.color} shadow-lg`}>
                  <div className="w-full h-full rounded-2xl bg-[var(--surface)]/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className="relative p-5 pt-0">
                <h3 className="text-base font-semibold text-white group-hover:text-white transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {product.tagline}
                </p>
                <div className="flex items-center gap-1 mt-3 text-[var(--accent)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>了解详情</span>
                  <ArrowRight size={14} weight="bold" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}