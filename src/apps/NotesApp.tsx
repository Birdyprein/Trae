import { useState } from 'react';

interface NotesAppProps {
  onClose: () => void;
}

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
}

const initialNotes: Note[] = [
  { id: 1, title: '购物清单', content: '牛奶、面包、鸡蛋、水果', date: '今天' },
  { id: 2, title: '会议笔记', content: '产品需求评审会议要点\n1. 新功能优先级\n2. 排期安排\n3. 风险评估', date: '昨天' },
  { id: 3, title: '读书笔记', content: '《原子习惯》第三章摘要\n习惯的形成分为四个步骤：提示、渴求、反应、奖励。', date: '周一' },
  { id: 4, title: '旅行计划', content: '周末郊野公园\n- 野餐装备\n- 相机\n- 防晒霜', date: '上周' },
];

export default function NotesApp({ onClose }: NotesAppProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: '新备忘录',
      content: '',
      date: '刚刚',
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setEditContent('');
    setIsEditing(true);
  };

  const saveNote = () => {
    if (selectedNote) {
      setNotes(notes.map(n =>
        n.id === selectedNote.id ? { ...n, content: editContent, title: editContent.split('\n')[0] || '新备忘录' } : n
      ));
    }
    setIsEditing(false);
  };

  if (selectedNote) {
    return (
      <div className="w-full h-full bg-[#1C1C1E] text-white flex flex-col">
        <div className="flex items-center justify-between px-4 h-12 border-b border-gray-800">
          <button className="text-yellow-500 text-sm" onClick={() => setSelectedNote(null)}>
            ← 返回
          </button>
          <button className="text-yellow-500 text-sm" onClick={saveNote}>
            完成
          </button>
        </div>
        <textarea
          className="flex-1 w-full bg-transparent text-white p-4 text-base outline-none resize-none"
          value={editContent}
          onChange={(e) => {
            setEditContent(e.target.value);
            setIsEditing(true);
          }}
          placeholder="开始输入..."
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#1C1C1E] text-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-800">
        <button className="text-yellow-500 text-sm" onClick={onClose}>
          ← 返回
        </button>
        <h1 className="text-lg font-semibold">备忘录</h1>
        <button className="text-yellow-500 text-xl" onClick={createNote}>
          ✏️
        </button>
      </div>

      <div className="p-4">
        <div className="bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="搜索"
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="py-3 border-b border-gray-800 cursor-pointer active:opacity-70"
            onClick={() => openNote(note)}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-medium truncate">{note.title}</h3>
              <span className="text-gray-500 text-xs flex-shrink-0 ml-2">{note.date}</span>
            </div>
            <p className="text-gray-400 text-xs truncate">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
