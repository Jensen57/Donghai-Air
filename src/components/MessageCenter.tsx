import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Trash2, 
  CheckCircle, 
  Bell, 
  ShoppingBag, 
  ShieldAlert, 
  Star, 
  Info, 
  Zap,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';

type MessageType = 'order' | 'compensation' | 'points' | 'internal' | 'system';

interface Message {
  id: string;
  title: string;
  content: string;
  time: string;
  type: MessageType;
  isRead: boolean;
  businessId?: string;
}

const TypeIcon = ({ type }: { type: MessageType }) => {
  switch (type) {
    case 'order': return <ShoppingBag className="w-4 h-4 text-blue-500" />;
    case 'compensation': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
    case 'points': return <Star className="w-4 h-4 text-yellow-500" />;
    case 'internal': return <Zap className="w-4 h-4 text-purple-500" />;
    case 'system': return <Info className="w-4 h-4 text-gray-500" />;
  }
};

const TypeLabel = ({ type }: { type: MessageType }) => {
  switch (type) {
    case 'order': return '订单通知';
    case 'compensation': return '赔付通知';
    case 'points': return '积分通知';
    case 'internal': return '内购活动';
    case 'system': return '系统通知';
  }
};

export default function MessageCenter({ onBack, onNavigate }: { onBack: () => void, onNavigate: (type: string, id?: string) => void }) {
  const { userInfo, updateUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const messages = userInfo?.messages || [];

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'all') return true;
    if (activeTab === 'order') return msg.type === 'order';
    if (activeTab === 'compensation') return msg.type === 'compensation';
    if (activeTab === 'other') return !['order', 'compensation'].includes(msg.type);
    return true;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const markAsRead = async (ids: string[]) => {
    if (!userInfo) return;
    const newMessages = userInfo.messages.map(m => 
      ids.includes(m.id) ? { ...m, isRead: true } : m
    );
    const unreadCount = newMessages.filter(m => !m.isRead).length;
    await updateUser({ 
      messages: newMessages,
      unreadMessagesCount: unreadCount
    });
    setSelectedIds([]);
    if (ids.length > 1) setIsEditMode(false);
  };

  const deleteMessages = async (ids: string[]) => {
    if (!userInfo) return;
    setIsDeleting(true);
    try {
      const newMessages = userInfo.messages.filter(m => !ids.includes(m.id));
      const unreadCount = newMessages.filter(m => !m.isRead).length;
      await updateUser({ 
        messages: newMessages,
        unreadMessagesCount: unreadCount
      });
      setSelectedIds([]);
      setIsEditMode(false);
    } catch(err) {
      // ignore
    } finally {
      setIsDeleting(false);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === filteredMessages.length && filteredMessages.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map(m => m.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <Bell className="w-8 h-8 text-donghai animate-bounce mb-4 opacity-20" />
        <p className="text-sm text-gray-400">加载消息中...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-medium">消息中心</h1>
        </div>
        <div className="flex items-center gap-4">
          {messages.length > 0 && (
            <span 
              className="text-sm opacity-90 cursor-pointer font-medium"
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedIds([]);
              }}
            >
              {isEditMode ? '完成' : '批量编辑'}
            </span>
          )}
          <MoreHorizontal className="w-6 h-6 opacity-70" />
        </div>
      </div>

      {/* Tabs */}
      {!isEditMode && (
        <div className="bg-white border-b sticky top-[88px] z-[50]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-transparent h-12 p-0 rounded-none">
              <TabsTrigger value="all" className="flex-1 h-full rounded-none text-xs data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block">全部</TabsTrigger>
              <TabsTrigger value="order" className="flex-1 h-full rounded-none text-xs data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block">订单</TabsTrigger>
              <TabsTrigger value="compensation" className="flex-1 h-full rounded-none text-xs data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block">赔付</TabsTrigger>
              <TabsTrigger value="other" className="flex-1 h-full rounded-none text-xs data-[state=active]:text-donghai data-[state=active]:shadow-none relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-0.5 after:bg-donghai after:hidden data-[state=active]:after:block">其他</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        <AnimatePresence initial={false}>
          {filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden active:bg-gray-50 transition-colors ${!msg.isRead ? 'border-l-4 border-donghai' : ''}`}
              onClick={() => {
                if (isEditMode) {
                  toggleSelect(msg.id);
                } else {
                  markAsRead([msg.id]);
                  onNavigate(msg.type, msg.businessId);
                }
              }}
            >
              <div className="flex gap-3">
                {isEditMode && (
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-1 transition-colors ${selectedIds.includes(msg.id) ? 'bg-donghai border-donghai' : 'border-gray-300'}`}>
                    {selectedIds.includes(msg.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        <TypeIcon type={msg.type} />
                      </div>
                      <span className="text-xs font-bold text-gray-800">{msg.title}</span>
                      {!msg.isRead && <Badge className="bg-red-500 h-1.5 w-1.5 p-0 rounded-full" />}
                    </div>
                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{msg.content}</p>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400">{TypeLabel({ type: msg.type })}</span>
                    <div className="flex items-center gap-4">
                      {!isEditMode && (
                        <div 
                          className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessages([msg.id]);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <ChevronRight className="w-3 h-3 text-gray-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">暂无消息通知</p>
          </div>
        )}
      </div>

      {/* Edit Mode Bottom Bar */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-[70] shadow-[0_-4px_10px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-center gap-2 cursor-pointer" onClick={selectAll}>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedIds.length === filteredMessages.length && filteredMessages.length > 0 ? 'bg-donghai border-donghai' : 'border-gray-300'}`}>
                {selectedIds.length === filteredMessages.length && filteredMessages.length > 0 && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-gray-600 font-medium">全选</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={selectedIds.length === 0}
                onClick={() => markAsRead(selectedIds)}
                className="rounded-full text-xs border-gray-200 text-gray-600 h-9 px-6"
              >
                全部已读
              </Button>
              <Button 
                size="sm" 
                disabled={selectedIds.length === 0 || isDeleting}
                onClick={() => deleteMessages(selectedIds)}
                className="rounded-full text-xs bg-red-500 hover:bg-red-600 text-white h-9 px-6 flex items-center justify-center min-w-[100px] font-bold"
              >
               {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
               删除({selectedIds.length})
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
}
