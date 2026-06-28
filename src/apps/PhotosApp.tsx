import { useState } from 'react';

interface PhotosAppProps {
  onClose: () => void;
}

const photos = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80',
];

export default function PhotosApp({ onClose }: PhotosAppProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('library');

  const tabs = [
    { id: 'library', label: '图库' },
    { id: 'foryou', label: '为你推荐' },
    { id: 'albums', label: '相簿' },
    { id: 'search', label: '搜索' },
  ];

  if (selectedPhoto) {
    return (
      <div className="w-full h-full bg-black flex flex-col">
        <div className="flex justify-between items-center p-4">
          <button className="text-blue-500" onClick={() => setSelectedPhoto(null)}>
            返回
          </button>
          <div className="flex gap-4 text-blue-500">
            <span>⬆️</span>
            <span>❤️</span>
            <span>ℹ️</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src={selectedPhoto} alt="" className="max-w-full max-h-full object-contain" />
        </div>
        <div className="flex justify-around p-4 text-blue-500">
          <span>分享</span>
          <span>收藏</span>
          <span>编辑</span>
          <span>删除</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="px-4 pt-2 pb-2">
        <div className="flex justify-between items-center h-10">
          <button className="text-blue-500" onClick={onClose}>
            返回
          </button>
          <h1 className="text-lg font-semibold">照片</h1>
          <button className="text-blue-500">选择</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="aspect-square cursor-pointer active:opacity-80"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-around py-2 border-t border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`text-xs flex flex-col items-center gap-1 ${
              activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.id === 'library' && <span className="text-lg">🖼️</span>}
            {tab.id === 'foryou' && <span className="text-lg">💝</span>}
            {tab.id === 'albums' && <span className="text-lg">📁</span>}
            {tab.id === 'search' && <span className="text-lg">🔍</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
