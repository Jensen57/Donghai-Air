import React, { useState } from 'react';
import { Minus, CircleDot, X, Settings, AlertTriangle, RefreshCw, Link2, VolumeX, Pin, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom icons based on WeChat UI
const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8L16 12L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WeChatShareIcon = () => (
   <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" color="#07c160">
      <path d="M13.5 6.5C13.5 6.5 13.5 10.5 8.5 10.5C3.5 10.5 3.5 16.5 3.5 16.5C3.5 16.5 5.5 13.5 8.5 13.5C11.5 13.5 13.5 13.5 13.5 13.5V17.5L20.5 12L13.5 6.5Z"/>
   </svg>
);

const MomentsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" color="#0075FF" />
     <path d="M12 2V22" stroke="currentColor" strokeWidth="2" color="#FF3B30"/>
     <path d="M2 12H22" stroke="currentColor" strokeWidth="2" color="#34C759"/>
     <circle cx="12" cy="12" r="4" fill="currentColor" color="#FFCC00"/>
  </svg>
);

const MyMiniProgramIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" color="#ffc300">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M19 19L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 19V15M19 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function MiniProgramCapsule() {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems1 = [
    { icon: WeChatShareIcon, label: '转发给朋友', color: 'text-green-500', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: MomentsIcon, label: '发送到朋友圈', color: 'text-blue-500', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: MyMiniProgramIcon, label: '添加到\n我的小程序', color: 'text-yellow-500', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: () => <Pin size={28} color="#07c160" />, label: '置顶小程序', color: 'text-emerald-500', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: () => <Monitor size={28} color="#0075FF" />, label: '添加到\n电脑桌面', color: 'text-blue-400', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
  ];

  const menuItems2 = [
    { icon: () => <Settings size={28} color="#333" />, label: '设置', color: 'text-gray-700', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: () => <AlertTriangle size={28} color="#333" />, label: '反馈与投诉', color: 'text-gray-700', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: () => <RefreshCw size={28} color="#333" />, label: '重新进入\n小程序', color: 'text-gray-700', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: () => <Link2 size={28} color="#333" />, label: '复制链接', color: 'text-gray-700', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
    { icon: () => <VolumeX size={28} color="#333" />, label: '静音', color: 'text-gray-700', bg: 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] rounded-2xl' },
  ];

  return (
    <>
      <div className="fixed top-3 right-3 z-[9900]">
        <div className="flex items-center bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm rounded-full h-[32px] px-2.5 gap-2">
          <button onClick={() => setShowMenu(true)} className="flex items-center justify-center w-[22px] h-[22px] hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200">
             <div className="flex gap-[3px]">
               <div className="w-[4px] h-[4px] rounded-full bg-black"></div>
               <div className="w-[4px] h-[4px] rounded-full bg-black"></div>
               <div className="w-[4px] h-[4px] rounded-full bg-black"></div>
             </div>
          </button>
          <div className="w-[1px] h-[16px] bg-gray-200"></div>
          <button className="flex items-center justify-center w-[22px] h-[22px] hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200">
            <Minus className="w-[18px] h-[18px] stroke-[2.5] text-black" />
          </button>
          <div className="w-[1px] h-[16px] bg-gray-200"></div>
          <button className="flex items-center justify-center w-[22px] h-[22px] hover:bg-gray-100 rounded-full transition-colors active:bg-gray-200">
            <CircleDot className="w-[18px] h-[18px] stroke-[2.5] text-black" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/40 flex items-end sm:items-center justify-center"
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f5f5f5] w-full rounded-t-3xl sm:rounded-3xl sm:max-w-md p-4 sm:p-6 pb-safe"
            >
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">东海航空商城</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 pb-2">
                  {menuItems1.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[3.5rem]">
                      <div className={`w-[52px] h-[52px] flex items-center justify-center ${item.bg}`}>
                        <item.icon />
                      </div>
                      <span className="text-[10px] text-gray-500 text-center whitespace-pre-line leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 pb-2">
                  {menuItems2.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[3.5rem]">
                      <div className={`w-[52px] h-[52px] flex items-center justify-center ${item.bg}`}>
                        <item.icon />
                      </div>
                      <span className="text-[10px] text-gray-500 text-center whitespace-pre-line leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
