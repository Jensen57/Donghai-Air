import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Phone, 
  ChevronRight, 
  Headphones, 
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CustomerServiceProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp?: (query?: string) => void;
}

export default function CustomerService({ isOpen, onClose, onOpenHelp }: CustomerServiceProps) {
  const phoneNumbers = [
    { label: '商城咨询热线', number: '010-888888' },
    { label: '售后服务热线', number: '010-666666' },
    { label: '投诉建议热线', number: '010-999999' }
  ];

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
                <div className="w-8 h-8 rounded-full bg-donghai/10 flex items-center justify-center">
                  <Headphones className="w-4 h-4 text-donghai" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">电话咨询</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400">客服热线已开通</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-400" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {/* Banner */}
              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 border border-blue-100">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-blue-800">咨询服务时间</div>
                  <div className="text-[11px] text-blue-600 mt-1">周一至周日 09:00 - 21:00</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">如果您有任何疑问，欢迎致电以下客服热线。</div>
                </div>
              </div>
              
              {/* Phone List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-800 ml-1">专属服务热线</div>
                <div className="space-y-2">
                  {phoneNumbers.map((item, i) => (
                    <Card 
                      key={i}
                      onClick={() => window.location.href = `tel:${item.number}`}
                      className="p-4 border-none shadow-sm bg-white rounded-2xl flex items-center justify-between cursor-pointer active:bg-gray-50 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                      <div>
                        <div className="text-[10px] text-gray-400 mb-1">{item.label}</div>
                        <div className="text-sm font-bold text-gray-800">{item.number}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-500" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="pt-2">
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

            {/* Bottom Button */}
            <div className="p-4 bg-white border-t">
              <Button 
                onClick={onClose}
                className="w-full h-11 bg-donghai text-white rounded-xl text-sm font-medium shadow-md shadow-donghai/10 hover:bg-donghai/90"
              >
                关闭客服中心
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
