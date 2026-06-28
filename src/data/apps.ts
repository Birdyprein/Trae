export interface AppIcon {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  type: 'clock' | 'calculator' | 'weather' | 'settings' | 'photos' | 'music' | 'safari' | 'messages' | 'calendar' | 'notes';
}

export const apps: AppIcon[] = [
  { id: '1', name: 'Safari', icon: '🧭', gradient: 'from-blue-400 to-cyan-400', type: 'safari' },
  { id: '2', name: '信息', icon: '💬', gradient: 'from-green-400 to-emerald-500', type: 'messages' },
  { id: '3', name: '天气', icon: '🌤️', gradient: 'from-amber-400 to-orange-500', type: 'weather' },
  { id: '4', name: '照片', icon: '🖼️', gradient: 'from-pink-400 to-rose-500', type: 'photos' },
  { id: '5', name: '音乐', icon: '🎵', gradient: 'from-purple-500 to-fuchsia-600', type: 'music' },
  { id: '6', name: '时钟', icon: '⏰', gradient: 'from-slate-700 to-slate-900', type: 'clock' },
  { id: '7', name: '日历', icon: '📅', gradient: 'from-red-400 to-red-600', type: 'calendar' },
  { id: '8', name: '备忘录', icon: '📝', gradient: 'from-yellow-300 to-amber-400', type: 'notes' },
  { id: '9', name: '计算器', icon: '🧮', gradient: 'from-gray-600 to-gray-800', type: 'calculator' },
  { id: '10', name: '设置', icon: '⚙️', gradient: 'from-slate-400 to-slate-600', type: 'settings' },
];

export const dockApps: AppIcon[] = [
  { id: 'd1', name: '电话', icon: '📞', gradient: 'from-green-400 to-emerald-600', type: 'messages' },
  { id: 'd2', name: 'Safari', icon: '🧭', gradient: 'from-blue-400 to-cyan-400', type: 'safari' },
  { id: 'd3', name: '音乐', icon: '🎵', gradient: 'from-purple-500 to-fuchsia-600', type: 'music' },
  { id: 'd4', name: '相机', icon: '📷', gradient: 'from-gray-600 to-gray-800', type: 'photos' },
];
