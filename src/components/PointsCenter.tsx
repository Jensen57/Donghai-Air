import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Coins, 
  ChevronRight, 
  History, 
  Gift, 
  Star,
  Zap,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';

export default function PointsCenter({ onBack, onShowBuyPoints, onShowPointsMall }: { onBack: () => void, onShowBuyPoints: () => void, onShowPointsMall: () => void }) {
  const { userInfo } = useAuth();
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const quickActions = [
    { 
      label: '购买积分', 
      sub: '可用现金购买，快速累计积分', 
      icon: CreditCard, 
      color: 'text-donghai', 
      bg: 'bg-donghai/10', 
      onClick: onShowBuyPoints 
    },
    { 
      label: '积分兑换', 
      sub: '精选航空周边，积分超值购', 
      icon: Gift, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50', 
      onClick: onShowPointsMall 
    },
    { 
      label: '积分详情', 
      sub: '查询完整的历史收支明细', 
      icon: History, 
      color: 'text-gray-600', 
      bg: 'bg-gray-100', 
      onClick: () => setShowAllRecords(true) 
    },
  ];

  if (showAllRecords) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-50 border-b">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={() => setShowAllRecords(false)} />
            <h1 className="text-lg font-bold">积分明细</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {userInfo?.pointsRecords && userInfo.pointsRecords.length > 0 ? (
            <div className="bg-white">
              {userInfo.pointsRecords.map((record) => (
                <div key={record.id} className="p-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      record.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {record.amount > 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">{record.description}</div>
                      <div className="text-[10px] text-gray-400">{record.createdAt}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${record.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {record.amount > 0 ? '+' : ''}{record.amount}
                    </div>
                    <div className="text-[10px] text-gray-400">余额 {record.balance}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <History className="w-12 h-12 opacity-10 mb-2" />
              <div className="text-sm">暂无积分记录</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Refined Compact Header */}
      <div className="bg-white px-4 pt-12 pb-6 border-b sticky top-0 z-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-lg font-bold">积分商城中心</h1>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 text-xs gap-1" onClick={() => setShowRules(true)}>
            <Star className="w-3 h-3" />
            规则说明
          </Button>
        </div>

        <Card className="bg-donghai overflow-hidden border-none shadow-lg rounded-[24px] relative">
          <div className="p-6 text-white relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] opacity-70 tracking-widest uppercase font-medium">当前可用积分</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono">{userInfo?.points}</span>
                <Coins className="w-4 h-4 opacity-50" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] flex items-center gap-1.5 border border-white/10">
                <Zap className="w-2.5 h-2.5 text-yellow-300 fill-yellow-300" />
                有效期: {userInfo?.pointsExpiry}
              </div>
            </div>
          </div>
          {/* Subtle Graphic Element */}
          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Actions List (Vertical) */}
        <div className="space-y-3">
          {quickActions.map((action, i) => (
            <div 
              key={i} 
              onClick={action.onClick}
              className="bg-white rounded-[22px] p-4 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer shadow-sm border border-gray-50"
            >
              <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-gray-800 block">{action.label}</span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">{action.sub}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          ))}
        </div>

        {/* Recent Records Section - Elevated Position */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm space-y-4 border border-gray-50">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <div className="w-1 h-3 bg-donghai rounded-full" />
              最近记录
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-donghai p-0 h-auto font-bold" onClick={() => setShowAllRecords(true)}>查看全部</Button>
          </div>
          
          {userInfo?.pointsRecords && userInfo.pointsRecords.length > 0 ? (
            <div className="space-y-4">
              {userInfo.pointsRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      record.amount > 0 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {record.amount > 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownLeft className="w-4 h-4 text-red-500" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-700">{record.description}</div>
                      <div className="text-[9px] text-gray-400">{record.createdAt}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${record.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {record.amount > 0 ? '+' : ''}{record.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center justify-center text-gray-300">
              <p className="text-[10px]">暂无积分收支记录</p>
            </div>
          )}
        </div>
      </div>

      {/* Rules Modal */}
      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowRules(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-[32px] p-6 w-full max-w-xs shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">积分规则说明</h3>
                <X className="w-5 h-5 text-gray-400 cursor-pointer" onClick={() => setShowRules(false)} />
              </div>
              <div className="text-xs text-gray-500 space-y-3 leading-relaxed mb-6">
                <p>1. 积分仅支持以下情况获取：现金购买、赔付发放、退货退积分。</p>
                <p>2. 当前商城默认积分兑换比例为：1元 = 10积分（具体视商品单独配置可能略有浮动）。</p>
                <p>3. 积分有效期可于个人中心查询，逾期作废。</p>
                <p>4. 积分支付方式如果失效，请联系客服处理。</p>
              </div>
              <Button 
                className="w-full bg-donghai text-white rounded-full h-11 font-bold"
                onClick={() => setShowRules(false)}
              >
                我知道了
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
