import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  ChevronRight, 
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-[200] flex items-end sm:items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="relative w-full max-w-md bg-gray-50 rounded-t-[24px] sm:rounded-[24px] overflow-hidden flex flex-col max-h-[70vh] shadow-2xl"
        >
          {/* Header */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-donghai/10 flex items-center justify-center">
                <Headphones className="w-4 h-4 text-donghai" />
              </div>
              <div>
                <h3 className="text-[12px] font-bold text-gray-800">
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

          <div className="flex-1 overflow-y-auto p-4 min-h-[240px]">
            {view === 'menu' && (
              <div className="space-y-3">
                <Card 
                  onClick={() => setView('chat')}
                  className="p-3 border-none shadow-sm bg-white rounded-xl flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-donghai/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-donghai" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-gray-800">在线客服</div>
                      <div className="text-[9px] text-gray-400">与真人客服实时对话</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                </Card>

                <Card 
                  onClick={() => setView('phone')}
                  className="p-3 border-none shadow-sm bg-white rounded-xl flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-gray-800">电话客服</div>
                      <div className="text-[9px] text-gray-400">拨打服务热线咨询</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                </Card>

                <div className="pt-2">
                  <div className="text-[10px] font-bold text-gray-800 mb-2">常见问题</div>
                  <div className="space-y-1.5">
                    {['如何申请退款？', '积分如何获取？', '物流信息在哪里查看？'].map((q, i) => (
                      <div 
                        key={i} 
                        onClick={() => onOpenHelp?.(q)}
                        className="text-[10px] text-gray-500 bg-white p-2 rounded-lg border border-gray-100 flex items-center justify-between cursor-pointer active:bg-gray-50"
                      >
                        <span>{q}</span>
                        <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-3 mb-2">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-2.5 rounded-xl text-[11px] ${
                        msg.sender === 'user' 
                          ? 'bg-donghai text-white rounded-tr-none' 
                          : 'bg-white text-gray-700 rounded-tl-none shadow-sm'
                      }`}>
                        {msg.text}
                        <div className={`text-[7px] mt-0.5 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
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
            <div className="bg-white p-3 border-t flex items-center gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="请输入..."
                className="flex-1 bg-gray-50 rounded-full h-9 px-3 text-[10px] focus:outline-none focus:ring-1 focus:ring-donghai/30"
              />
              <Button 
                onClick={handleSendMessage}
                className="w-9 h-9 rounded-full bg-donghai text-white p-0 flex items-center justify-center shadow-lg shadow-donghai/20"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Back button for sub-views */}
          {view !== 'menu' && (
            <div className="p-3 bg-white border-t">
              <Button 
                variant="ghost" 
                onClick={() => setView('menu')}
                className="w-full h-8 text-[10px] text-gray-400"
              >
                返回客服中心
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
