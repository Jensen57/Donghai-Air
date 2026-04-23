import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, MessageSquare, Users, Compass, User, Search as SearchIcon, Monitor } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface WeChatHomeProps {
  onOpenMiniProgram: () => void;
}

export default function WeChatHome({ onOpenMiniProgram }: WeChatHomeProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startY.current = clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPulling) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diff = clientY - startY.current;
    if (diff > 0) {
      // Pulling down
      setPullProgress(Math.min(diff / 300, 1.2));
    } else {
      setIsPulling(false);
      setPullProgress(0);
    }
  };

  const handleTouchEnd = () => {
    if (pullProgress > 0.4) {
      setPullProgress(0.8);
    } else {
      setPullProgress(0);
    }
    setIsPulling(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPulling) handleTouchEnd();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isPulling, pullProgress]);

  const contacts = [
    { name: '文件传输助手', msg: '[图片]', time: '昨天 22:47', icon: 'bg-green-500' },
    { name: '联系人 1', msg: '[视频通话]', time: '昨天 20:18', icon: 'bg-blue-400' },
    { name: '联系人 2', msg: '[视频通话]', time: '星期二', icon: 'bg-orange-400' },
    { name: '联系人 3', msg: '每天', time: '星期六', icon: 'bg-purple-400' },
    { name: '联系人 4', msg: '[视频通话]', time: '4月16日', icon: 'bg-pink-400' },
    { name: '联系人 5', msg: 'https://edu.aliyun.com/...', time: '4月15日', icon: 'bg-indigo-400' },
    { name: '大家庭', msg: '[语音] 4"', time: '3月4日', icon: 'bg-yellow-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#ededed] relative overflow-hidden">
      {/* Mini Program Pull Down Area */}
      <motion.div 
        style={{ 
          height: pullProgress * 300,
          opacity: pullProgress,
          scale: 0.8 + pullProgress * 0.2
        }}
        className="absolute top-0 left-0 right-0 bg-[#2b2b2b] flex flex-col items-center justify-center overflow-hidden z-0"
      >
        <div className="w-full px-6 flex flex-col items-center gap-6">
          <div className="text-white/60 text-xs font-medium">最近使用的小程序</div>
          <div className="grid grid-cols-4 gap-6 w-full max-w-xs">
             <div className="flex flex-col items-center gap-2" onClick={onOpenMiniProgram}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden p-2">
                   <img src="/logo.png" alt="logo" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = 'https://img.icons8.com/color/96/airplane-take-off.png')} />
                </div>
                <div className="text-white/80 text-[10px] whitespace-nowrap">东海航空...</div>
             </div>
             {/* Placeholders */}
             <div className="flex flex-col items-center gap-2 opacity-30">
                <div className="w-12 h-12 bg-white/20 rounded-full" />
                <div className="w-8 h-2 bg-white/20 rounded-full" />
             </div>
             <div className="flex flex-col items-center gap-2 opacity-30">
                <div className="w-12 h-12 bg-white/20 rounded-full" />
                <div className="w-8 h-2 bg-white/20 rounded-full" />
             </div>
             <div className="flex flex-col items-center gap-2 opacity-30">
                <div className="w-12 h-12 bg-white/20 rounded-full" />
                <div className="w-8 h-2 bg-white/20 rounded-full" />
             </div>
          </div>
          <div className="flex items-center gap-1 text-white/40 text-[10px]">
             <span>更多</span>
             <ChevronRight size={10} />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        style={{ 
          y: pullProgress * 300,
        }}
        className="flex-1 flex flex-col bg-[#ededed] overflow-y-auto no-scrollbar relative z-10 shadow-2xl select-none"
      >
        {/* Header */}
        <div className="bg-[#ededed] px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-20">
          <div className="text-lg font-medium text-black">微信 (1)</div>
          <div className="flex items-center gap-4">
            <SearchIcon size={20} className="text-black" />
            <Plus size={24} className="text-black" />
          </div>
        </div>

        {/* Pull Indicator */}
        <div className="h-0 relative flex justify-center">
           <motion.div 
             style={{ opacity: 1 - pullProgress * 2, y: 10 }}
             className="absolute flex items-center gap-1 text-[10px] text-gray-300"
           >
              <div className="flex flex-col items-center">
                 <span>↓ 下拉查看小程序</span>
              </div>
           </motion.div>
        </div>

        {/* Windows Login Status */}
        <div className="px-4 py-3 bg-[#f5f5f5] flex items-center gap-3 border-b border-gray-200">
           <Monitor size={16} className="text-gray-400" />
           <span className="text-xs text-gray-400">Windows 微信已登录</span>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2">
           <div className="bg-white rounded-md py-1.5 flex items-center justify-center gap-1 text-gray-400">
              <SearchIcon size={14} />
              <span className="text-sm">搜索</span>
           </div>
        </div>

        {/* Chat List */}
        <div className="flex-1">
          {contacts.map((contact, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3 bg-white border-b border-gray-100 active:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 rounded-md ${contact.icon} relative flex-shrink-0`}>
                {i === 0 && (
                   <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium text-base text-gray-900 truncate">{contact.name}</span>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <div className="text-sm text-gray-400 truncate">
                   {contact.msg}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Tab Bar */}
        <div className="bg-[#f7f7f7] border-t border-gray-200 flex items-center justify-around py-2 shrink-0">
          <div className="flex flex-col items-center gap-0.5 text-[#07c160] relative">
            <MessageSquare size={24} fill="currentColor" />
            <span className="text-[10px]">微信</span>
            <div className="absolute -top-1 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] border border-white">1</div>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <Users size={24} />
            <span className="text-[10px]">通讯录</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <Compass size={24} />
            <span className="text-[10px]">发现</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 text-gray-400">
            <User size={24} />
            <span className="text-[10px]">我</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const ChevronRight = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
