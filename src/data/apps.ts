export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  type: 'clock' | 'calculator' | 'photos' | 'settings' | 'weather' | 'notes' | 'calendar' | 'maps' | 'music' | 'safari' | 'messages' | 'mail';
}

export const apps: AppIcon[] = [
  { id: '1', name: 'FaceTime', icon: '📹', gradient: 'from-green-400 to-green-600', type: 'safari' },
  { id: '2', name: '日历', icon: '📅', gradient: 'from-white to-gray-100', type: 'calendar' },
  { id: '3', name: '照片', icon: '🖼️', gradient: 'from-white to-gray-100', type: 'photos' },
  { id: '4', name: '相机', icon: '📷', gradient: 'from-gray-600 to-gray-800', type: 'photos' },
  { id: '5', name: '地图', icon: '🗺️', gradient: 'from-green-200 to-blue-200', type: 'maps' },
  { id: '6', name: '时钟', icon: '⏰', gradient: 'from-gray-900 to-black', type: 'clock' },
  { id: '7', name: '天气', icon: '☀️', gradient: 'from-blue-400 to-blue-600', type: 'weather' },
  { id: '8', name: '备忘录', icon: '📝', gradient: 'from-yellow-200 to-yellow-400', type: 'notes' },
  { id: '9', name: '计算器', icon: '🧮', gradient: 'from-gray-700 to-gray-900', type: 'calculator' },
  { id: '10', name: '音乐', icon: '🎵', gradient: 'from-pink-500 to-purple-600', type: 'music' },
  { id: '11', name: '设置', icon: '⚙️', gradient: 'from-gray-300 to-gray-500', type: 'settings' },
  { id: '12', name: 'App Store', icon: '🛍️', gradient: 'from-blue-400 to-blue-600', type: 'safari' },
];

export const dockApps: AppIcon[] = [
  { id: 'd1', name: '电话', icon: '📞', gradient: 'from-green-400 to-green-600', type: 'safari' },
  { id: 'd2', name: 'Safari', icon: '🧭', gradient: 'from-blue-400 to-blue-600', type: 'safari' },
  { id: 'd3', name: '信息', icon: '💬', gradient: 'from-green-400 to-green-600', type: 'messages' },
  { id: 'd4', name: '音乐', icon: '🎵', gradient: 'from-pink-500 to-purple-600', type: 'music' },
];
