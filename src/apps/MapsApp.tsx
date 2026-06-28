import { useState } from 'react';

interface MapsAppProps {
  onClose: () => void;
}

export default function MapsApp({ onClose }: MapsAppProps) {
  const [search, setSearch] = useState('');

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <button className="text-blue-500 text-sm" onClick={onClose}>
            ← 返回
          </button>
          <h1 className="text-lg font-semibold flex-1">地图</h1>
          <button className="text-blue-500">ℹ️</button>
        </div>
        <div className="bg-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="搜索地点"
            className="bg-transparent text-sm outline-none flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 relative">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 25%, #E3F2FD 50%, #BBDEFB 75%, #FCE4EC 100%)',
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-32 h-2 bg-white rounded-full opacity-60 rotate-12" />
          <div className="absolute top-1/3 right-1/3 w-24 h-2 bg-white rounded-full opacity-60 -rotate-12" />
          <div className="absolute bottom-1/3 left-1/3 w-40 h-2 bg-white rounded-full opacity-60 rotate-45" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-blue-300/50 rounded-full" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500" />
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600">
            📍
          </button>
          <button className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600">
            🔄
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl">
                🏠
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">我的位置</p>
                <p className="text-gray-500 text-xs">北京市朝阳区...</p>
              </div>
              <button className="text-blue-500 text-sm">路线</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around">
        <div className="flex flex-col items-center gap-1 text-blue-500">
          <span className="text-xl">🏙️</span>
          <span className="text-xs">探索</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">🚗</span>
          <span className="text-xs">驾车</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">🚇</span>
          <span className="text-xs">公交</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">👤</span>
          <span className="text-xs">我的</span>
        </div>
      </div>
    </div>
  );
}
