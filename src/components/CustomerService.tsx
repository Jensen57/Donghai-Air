import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  Headphones, 
  Clock,
  ExternalLink,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CustomerServiceProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp?: (query?: string) => void;
}

export default function CustomerService({ isOpen, onClose, onOpenHelp }: CustomerServiceProps) {
  const [view, setView] = useState<'menu' | 'chat' | 'phone'>('menu');
  const [messages, setMessages] = useState([
    { id: 1, text: '您好！欢迎来到东海航空商城客服中心。请问有什么可以帮您？', sender: 'bot', time: '10:00' }
  ]);
  const [inputText, setInputText] = useState('');

  const phoneNumbers = [
    { label: '商城咨询热线', number: '010-888888' },
    { label: '售后服务热线', number: '010-666666' },
    { label: '投诉建议热线', number: '010-999999' }
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = { id: Date.now(), text: inputText, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMsg]);
    setInputText('');
    
    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: '收到您的咨询，人工客服正在接入中，请稍候...', 
        sender: 'bot', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[200]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-white px-4 pt-12 pb-3 flex items-center justify-between border-b shadow-sm">
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-6 h-6 text-gray-800 cursor-pointer" onClick={onClose} />
                <div className="w-8 h-8 rounded-full bg-donghai/10 flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-donghai" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    {view === 'menu' ? '客服中心' : view === 'chat' ? '在线客服' : '电话客服'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    <span className="text-[8px] text-gray-400">正在为您服务</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {view === 'menu' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card 
                    onClick={() => setView('chat')}
                    className="p-5 border-none shadow-md bg-white rounded-2xl flex flex-col items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-donghai/10 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-donghai" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">在线客服</div>
                      <div className="text-[10px] text-gray-400 mt-1">真人客服1对1</div>
                    </div>
                  </Card>

                  <Card 
                    onClick={() => setView('phone')}
                    className="p-5 border-none shadow-md bg-white rounded-2xl flex flex-col items-center gap-3 cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">电话客服</div>
                      <div className="text-[10px] text-gray-400 mt-1">专属热线咨询</div>
                    </div>
                  </Card>
                </div>

                <div className="pt-4">
                  <div className="text-xs font-bold text-gray-800 mb-3 ml-1">猜你想问</div>
                  <div className="space-y-2">
                    {['如何申请退款？', '积分如何获取？', '物流信息在哪里查看？', '内购商品规则有哪些？'].map((q, i) => (
                      <div 
                        key={i} 
                        onClick={() => onOpenHelp?.(q)}
                        className="text-xs text-gray-600 bg-white p-4 rounded-xl shadow-sm flex items-center justify-between cursor-pointer active:bg-gray-50 border border-gray-50"
                      >
                        <span className="font-medium">{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'chat' && (
              <div className="flex flex-col min-h-full">
                <div className="flex-1 space-y-4 mb-4">
                  <div className="flex justify-center">
                    <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">系统：已连接客服中心</span>
                  </div>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-[12px] shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-donghai text-white rounded-tr-none' 
                          : 'bg-white text-gray-700 rounded-tl-none'
                      }`}>
                        {msg.text}
                        <div className={`text-[8px] mt-1 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'phone' && (
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-xl flex items-start gap-2 mb-4">
                  <Clock className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold text-blue-800">服务时间</div>
                    <div className="text-[9px] text-blue-600">周一至周日 09:00 - 21:00</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {phoneNumbers.map((item, i) => (
                    <Card 
                      key={i}
                      onClick={() => window.location.href = `tel:${item.number}`}
                      className="p-3 border-none shadow-sm bg-white rounded-xl flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors"
                    >
                      <div>
                        <div className="text-[9px] text-gray-400 mb-0.5">{item.label}</div>
                        <div className="text-[12px] font-bold text-gray-800">{item.number}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5 text-green-500" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer for Chat */}
          {view === 'chat' && (
            <div className="bg-white p-4 pb-10 border-t flex items-center gap-3">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="在此输入您想咨询的问题..."
                className="flex-1 bg-gray-50 rounded-xl h-12 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-donghai/30"
              />
              <Button 
                onClick={handleSendMessage}
                className="w-12 h-12 rounded-xl bg-donghai text-white p-0 flex items-center justify-center shadow-lg shadow-donghai/20"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Bottom Back Button - only in sub-views */}
          {view !== 'menu' && (
            <div className="p-4 pt-0 bg-white">
              <Button 
                variant="ghost" 
                onClick={() => setView('menu')}
                className="w-full h-10 text-xs text-gray-400 bg-gray-50 rounded-xl"
              >
                返回客服功能列表
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    )}
    </AnimatePresence>
  );
}
