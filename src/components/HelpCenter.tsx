import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Headphones, 
  Phone, 
  MessageSquare, 
  Search,
  HelpCircle,
  ChevronDown,
  UserPlus,
  ShoppingBag,
  ShieldAlert,
  Zap,
  Star,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const FAQ_DATA = [
  {
    category: 'purchase',
    title: '购物指南',
    questions: [
      { q: '如何申请退款？', a: '在“我的订单”中找到对应订单，点击“申请售后”，选择“仅退款”或“退货退款”并填写原因即可。' },
      { q: '物流信息在哪里查看？', a: '在“我的订单”列表中点击目标订单，进入“订单详情”页面即可查看实时物流动态。' },
      { q: '下单后多久发货？', a: '实物商品通常在下单后48小时内发货，节假日顺延。' },
      { q: '如何修改收货地址？', a: '在订单处于“待发货”状态时，可以联系在线客服或在订单详情页尝试修改。' }
    ]
  },
  {
    category: 'points',
    title: '积分相关',
    questions: [
      { q: '积分如何获取？', a: '您可以通过乘坐东海航空航班、在商城消费、或参加每日签到等活动获得积分。' },
      { q: '积分可以兑换什么？', a: '积分可在“积分商城”兑换航空机票周边、生活用品或抵扣部分现金。' }
    ]
  },
  {
    category: 'login',
    title: '账户安全',
    questions: [
      { q: '如何进行微信授权登录？', a: '在“个人主页”点击“去登录”，弹出微信授权提示后点击“允许”即可完成登录。' },
      { q: '手机号绑定是必须的吗？', a: '为了您的账户安全及赔付验证，建议您完成绑定。' }
    ]
  },
  {
    category: 'compensation',
    title: '旅客赔付',
    questions: [
      { q: '延误赔付申请需要提供什么？', a: '您需要提供登机牌照片、身份证号及有效的银行账户信息。' },
      { q: '赔付审核需要多久？', a: '通常在提交申请后的3-5个工作日内完成审核。' }
    ]
  }
];

export default function HelpCenter({ onBack, initialSearch = '' }: { onBack: () => void, initialSearch?: string }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Auto-expand if the search matches a specific question exactly (useful for jumps)
  React.useEffect(() => {
    if (initialSearch) {
      setExpandedId(initialSearch);
    }
  }, [initialSearch]);

  const filteredData = FAQ_DATA.map(section => ({
    ...section,
    questions: section.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  const handleContact = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowFeedback(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-donghai text-white px-4 pt-12 pb-6 sticky top-0 z-[60]">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-lg font-medium">帮助中心</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索您遇到的问题" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-none rounded-xl py-3 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Quick Contact */}
      {!searchQuery && (
        <div className="p-4 grid grid-cols-2 gap-4">
          <Card className="p-4 border-none shadow-sm flex flex-col items-center gap-2 active:bg-gray-50 transition-colors" onClick={handleContact}>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium">在线客服</span>
            <span className="text-[10px] text-gray-400">09:00 - 21:00</span>
          </Card>
          <Card className="p-4 border-none shadow-sm flex flex-col items-center gap-2 active:bg-gray-50 transition-colors" onClick={handleContact}>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm font-medium">电话客服</span>
            <span className="text-[10px] text-gray-400">24小时服务</span>
          </Card>
        </div>
      )}

      {/* FAQ Sections */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <h3 className="text-sm font-bold text-gray-800 my-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-donghai" />
          {searchQuery ? `搜索结果 (${filteredData.reduce((acc, s) => acc + s.questions.length, 0)})` : '常见问题'}
        </h3>
        
        <div className="space-y-4">
          {filteredData.map((section, sIdx) => (
            <div key={sIdx} className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">{section.title}</h4>
              <div className="space-y-2">
                {section.questions.map((q, qIdx) => {
                  const isExpanded = expandedId === q.q;
                  return (
                    <Card key={qIdx} className="border-none shadow-sm overflow-hidden">
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
                        onClick={() => setExpandedId(isExpanded ? null : q.q)}
                      >
                        <span className="text-sm text-gray-700">{q.q}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4"
                          >
                            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
                              {q.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-gray-400">未找到相关问题，换个词试试吧</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {isConnecting && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
            >
              <RefreshCw className="w-10 h-10 text-donghai animate-spin" />
              <p className="text-sm font-medium">正在为您连接客服...</p>
            </motion.div>
          </div>
        )}

        {showFeedback && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                  <ShieldAlert className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">客服暂时忙碌</h3>
                  <p className="text-xs text-gray-500 mt-2">当前咨询人数较多，您可以提交反馈，我们将尽快回复您。</p>
                </div>
                <div className="w-full space-y-3 mt-4">
                  <Button className="w-full bg-donghai text-white rounded-xl h-11" onClick={() => setShowFeedback(false)}>提交反馈</Button>
                  <Button variant="ghost" className="w-full text-gray-400" onClick={() => setShowFeedback(false)}>稍后再试</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
